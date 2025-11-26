// File: app/actions/recruiter.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import InterviewTemplate from '@/models/InterviewTemplateModel';
import { generateQuestionsFromJD } from '@/lib/gemini';
import { Types } from 'mongoose';
import { getServerSession } from 'next-auth';

export type FormState = {
  success: boolean;
  message: string;
  templateId?: string | null;
};

const CreateInterviewSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  jobDescription: z.string().min(50, { message: 'Job description must be at least 50 characters.' }),
});

export async function createInterviewFromJD(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role === 'CANDIDATE') {
    return { success: false, message: 'Not authorized.' };
  }

  const validatedFields = CreateInterviewSchema.safeParse({
    title: formData.get('title'),
    jobDescription: formData.get('jobDescription'),
  });

  if (!validatedFields.success) {
    const firstError = validatedFields.error.issues[0]?.message || 'Validation failed';
    return { success: false, message: firstError };
  }

  const { title, jobDescription } = validatedFields.data;

  try {
    await dbConnect();
    const aiQuestionsArray = await generateQuestionsFromJD(jobDescription);
    const questionsList: string[] = aiQuestionsArray.map(item => item.question);

    if (questionsList.length === 0) {
      return { success: false, message: 'AI failed to generate questions.' };
    }

    const newTemplate = new InterviewTemplate({
      title: title,
      description: jobDescription,
      isAIGenerated: true,
      isPublic: false,
      createdBy: new Types.ObjectId((session.user as any).id),
      questions: questionsList,
    });

    await newTemplate.save();
    revalidatePath('/recruiter');

    return {
      success: true,
      message: 'New AI interview template created!',
      templateId: (newTemplate as any)._id.toString(),
    };
  } catch (error) {
    console.error('Error in createInterviewFromJD:', error);
    return { success: false, message: 'An unknown error occurred.' };
  }
}

// --- UPDATED: START RECRUITER INTERVIEW ---
export async function startRecruiterInterview(
  templateId: string,
  candidateEmail: string
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role === 'CANDIDATE') {
    return { success: false, error: 'Not authorized.' };
  }

  if (!templateId || !candidateEmail) {
    return { success: false, error: 'Template ID and candidate email are required.' };
  }

  try {
    await dbConnect();

    const template = await InterviewTemplate.findById(templateId);
    if (!template) {
      return { success: false, error: 'Interview template not found.' };
    }

    if (template.createdBy && template.createdBy.toString() !== (session.user as any).id) {
      return { success: false, error: 'You do not own this template.' };
    }

    if (!template.questions || template.questions.length === 0) {
      return { success: false, error: 'This template has no questions.' };
    }

    const InterviewSession = (await import('@/models/InterviewSessionModel')).default;
    const firstQuestion = template.questions[0];

    // FIX: Store email in lowercase to ensure matching works reliably
    const normalizedEmail = candidateEmail.trim().toLowerCase();

    const newSession = await InterviewSession.create({
      user: null, // Explicitly null, will be filled when candidate joins
      template: new Types.ObjectId(templateId),
      status: 'IN_PROGRESS',
      candidateEmail: normalizedEmail, 
      conductedBy: new Types.ObjectId((session.user as any).id),
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
      sessionId: newSession._id.toString(),
      firstQuestion: firstQuestion,
      candidateEmail: normalizedEmail,
    };
  } catch (error) {
    console.error('Error starting recruiter interview:', error);
    return { success: false, error: 'Failed to start interview.' };
  }
}

export async function publishTemplate(templateId: string): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role === 'CANDIDATE') {
    return { success: false, message: 'Not authorized.' };
  }

  try {
    await dbConnect();
    const template = await InterviewTemplate.findById(templateId);

    if (!template) return { success: false, message: 'Template not found.' };
    if (template.createdBy && template.createdBy.toString() !== (session.user as any).id) {
      return { success: false, message: 'You do not own this template.' };
    }

    template.isPublic = !template.isPublic;
    await template.save();
    revalidatePath('/recruiter');

    return {
      success: true,
      message: `Template is now ${template.isPublic ? 'public' : 'private'}.`,
      templateId: (template as any)._id.toString(),
    };
  } catch (error) {
    return { success: false, message: 'Failed to update template.' };
  }
}

export async function deleteTemplate(templateId: string): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role === 'CANDIDATE') {
    return { success: false, message: 'Not authorized.' };
  }

  try {
    await dbConnect();
    const template = await InterviewTemplate.findById(templateId);

    if (!template) return { success: false, message: 'Template not found.' };
    if (template.createdBy && template.createdBy.toString() !== (session.user as any).id) {
      return { success: false, message: 'You do not own this template.' };
    }

    await InterviewTemplate.deleteOne({ _id: templateId });
    revalidatePath('/recruiter');

    return {
      success: true,
      message: 'Template deleted successfully.',
      templateId: (template as any)._id.toString(),
    };
  } catch (error) {
    return { success: false, message: 'Failed to delete template.' };
  }
}