// File: app/actions/interview.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import InterviewSession from '@/models/InterviewSessionModel';
import InterviewTemplate from '@/models/InterviewTemplateModel';
import {
  generateText,
  transcribeSpeech,
} from '@/lib/gemini';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';
import { cleanJsonString } from '@/lib/utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function startInterview(templateId: string, userId: string) {
  if (!userId) return { success: false, error: 'User not authenticated.' };
  if (!templateId) return { success: false, error: 'Template ID is required.' };

  try {
    await dbConnect();
    const template = await InterviewTemplate.findById(templateId);
    if (!template) return { success: false, error: 'Interview template not found.' };

    if (!template.questions || !Array.isArray(template.questions) || template.questions.length === 0) {
      return { success: false, error: 'This interview template is invalid (no questions found).' };
    }

    const firstQuestion = template.questions[0];

    const session = await InterviewSession.create({
      user: new Types.ObjectId(userId),
      template: new Types.ObjectId(templateId),
      status: 'IN_PROGRESS',
      transcript: [
        {
          speaker: 'AI',
          text: firstQuestion,
          timestamp: new Date(),
        },
      ],
    });

    return {
      success: true,
      sessionId: session._id.toString(),
      firstQuestion: firstQuestion,
    };
  } catch (error) {
    console.error('Error starting interview:', error);
    return { success: false, error: 'Failed to start interview.' };
  }
}

export async function processUserSpeech(
  sessionId: string,
  audioBase64: string
) {
  try {
    await dbConnect();
    
    // 1. Auth Check
    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user?.email) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) return { success: false, error: 'Session not found.' };
    if (session.status === 'COMPLETED') return { success: false, error: 'Interview is already completed.' };

    // 2. Strict Access Control Logic
    const userEmail = sessionUser.user.email.toLowerCase();
    const userId = (sessionUser.user as any).id;

    const isAssignedCandidate = session.candidateEmail && session.candidateEmail.toLowerCase() === userEmail;
    const isSessionOwner = session.user && session.user.toString() === userId;

    // Allow access if they are the assigned candidate OR if they are the session owner (for self-practice)
    if (!isAssignedCandidate && !isSessionOwner) {
      console.warn(`Unauthorized access attempt by ${userEmail} on session ${sessionId}`);
      return { success: false, error: 'You are not authorized to access this interview session.' };
    }

    // 3. Claim Session (First time join for scheduled interviews)
    if (isAssignedCandidate && !session.user) {
      session.user = new Types.ObjectId(userId);
      await session.save();
    }

    // 4. Transcribe
    let userText = "";
    try {
        userText = await transcribeSpeech(audioBase64);
    } catch (sttError: any) {
        console.error("STT Error inside action:", sttError);
        return { 
            success: false, 
            error: `Speech recognition failed: ${sttError.message || 'Unknown error'}` 
        };
    }
    
    if (!userText || userText.trim() === '') {
      const repeatQuestion = "I couldn't hear you clearly. Could you please repeat that?";
      session.transcript.push({
        speaker: 'AI',
        text: repeatQuestion,
        timestamp: new Date(),
      });
      await session.save();
      return {
        success: true,
        nextQuestionText: repeatQuestion,
        userTranscript: "(No speech detected)",
        isInterviewOver: false,
      };
    }

    session.transcript.push({
      speaker: 'USER',
      text: userText,
      timestamp: new Date(),
    });

    // 5. Logic for next question
    const template = await InterviewTemplate.findById(session.template);
    if (!template) return { success: false, error: 'Template not found.' };

    // Heuristic: Count how many *unique* questions from the template have been asked by AI
    // This helps handle "Repeat" messages gracefully
    const aiTranscriptSet = new Set(
      session.transcript
        .filter((t: any) => t.speaker === 'AI')
        .map((t: any) => t.text)
    );
    
    let nextQuestionIndex = 0;
    for (let i = 0; i < template.questions.length; i++) {
      if (aiTranscriptSet.has(template.questions[i])) {
        nextQuestionIndex = i + 1;
      } else {
        break; // Found the first unasked question
      }
    }

    let nextQuestionText: string;
    let isInterviewOver = false;

    if (nextQuestionIndex < template.questions.length) {
      nextQuestionText = template.questions[nextQuestionIndex];
      session.transcript.push({
        speaker: 'AI',
        text: nextQuestionText,
        timestamp: new Date(),
      });
    } else {
      nextQuestionText = 'Thank you for your answers. This concludes the interview. I am now generating your feedback report.';
      isInterviewOver = true;
    }

    await session.save();

    return {
      success: true,
      nextQuestionText,
      userTranscript: userText,
      isInterviewOver,
    };
  } catch (error: any) {
    console.error('Error processing speech:', error);
    return { success: false, error: `Failed to process audio: ${error.message || 'Unknown error'}` };
  }
}

export async function finishInterviewAndGetFeedback(sessionId: string) {
  try {
    await dbConnect();
    
    // Auth Check for Feedback
    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user) return { success: false, error: 'Unauthorized' };

    const session = await InterviewSession.findById(sessionId);
    if (!session) return { success: false, error: 'Session not found.' };

    // Access Control for Feedback
    const userId = (sessionUser.user as any).id;
    const userEmail = sessionUser.user.email?.toLowerCase();
    
    const isAssignedCandidate = session.candidateEmail && session.candidateEmail.toLowerCase() === userEmail;
    const isSessionOwner = session.user && session.user.toString() === userId;
    const isRecruiterOwner = session.conductedBy && session.conductedBy.toString() === userId;

    if (!isSessionOwner && !isRecruiterOwner && !isAssignedCandidate) {
       return { success: false, error: 'Unauthorized' };
    }

    if (session.status === 'COMPLETED' && session.feedback) {
      // Ensure we return a plain object
      return { success: true, feedback: JSON.parse(JSON.stringify(session.feedback)) };
    }

    const transcriptText = session.transcript
      .map((entry: any) => `${entry.speaker}: ${entry.text}`)
      .join('\n');

    const feedbackSystemPrompt = `You are an expert technical recruiter. Analyze this interview transcript.
    Return ONLY valid JSON. Do not use Markdown formatting.
    
    JSON Schema:
    {
      "overallScore": number (0-100),
      "strengths": string[],
      "areasForImprovement": string[],
      "detailedAnalysis": string
    }`;

    const feedbackJsonString = await generateText(
      feedbackSystemPrompt,
      transcriptText,
      { responseMimeType: "application/json" }
    );

    const cleanJson = cleanJsonString(feedbackJsonString);
    let feedbackObject;
    
    try {
        feedbackObject = JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Error:", cleanJson);
        feedbackObject = {
            overallScore: 0,
            strengths: ["Error generating feedback"],
            areasForImprovement: ["Please contact support"],
            detailedAnalysis: "AI processing failed for this session."
        };
    }

    session.feedback = feedbackObject;
    session.status = 'COMPLETED';
    await session.save();

    revalidatePath('/dashboard');

    return {
      success: true,
      // Explicitly serialize to ensure no Mongoose objects leak
      feedback: JSON.parse(JSON.stringify(feedbackObject)),
    };
  } catch (error) {
    console.error('Error generating feedback:', error);
    return { success: false, error: 'Failed to generate feedback.' };
  }
}