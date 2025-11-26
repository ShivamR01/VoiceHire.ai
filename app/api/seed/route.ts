// <!-- File: app/api/seed/route.ts -->
// <!-- I've updated this file to add three new interview templates -->
// <!-- (Project Manager, Python Developer, and UX/UI Designer). -->

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/UserModel';
import InterviewTemplate from '@/models/InterviewTemplateModel';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  // Protect this route in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production.' },
      { status: 403 }
    );
  }

  try {
    await dbConnect();

    // Clear existing mock users and public templates
    await User.deleteMany({ email: { $regex: /@test\.com$/ } });
    await InterviewTemplate.deleteMany({ isPublic: true });

    // Create Hashed Password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create Test Users
    const candidate = await User.create({
      email: 'candidate@test.com',
      password: hashedPassword,
      name: 'Test Candidate',
      role: 'CANDIDATE',
    });

    const recruiter = await User.create({
      email: 'recruiter@test.com',
      password: hashedPassword,
      name: 'Test Recruiter',
      role: 'RECRUITER',
    });

    const admin = await User.create({
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Test Admin',
      role: 'ADMIN',
    });

    // Create Public Interview Templates (Now 5 total)
    await InterviewTemplate.create([
      // Existing Template 1
      {
        title: 'React.js Developer',
        description:
          'A standard interview for a mid-level React.js developer.',
        isPublic: true,
        isAIGenerated: false,
        questions: [
          'What is the difference between state and props in React?',
          'Explain the component lifecycle in React.',
          'What are React Hooks? Can you give an example of useState and useEffect?',
          'How does virtual DOM work in React?',
          'What is your experience with state management libraries like Redux or Zustand?',
        ],
      },
      // Existing Template 2
      {
        title: 'Marketing Manager',
        description:
          'A behavioral and situational interview for a marketing manager role.',
        isPublic: true,
        isAIGenerated: false,
        questions: [
          'Tell me about a successful marketing campaign you led from start to finish.',
          'How do you measure the ROI of a marketing campaign?',
          'Describe a time you had to work with a difficult stakeholder. How did you handle it?',
          'What marketing trends are you currently following?',
          'How do you use data and analytics to inform your marketing strategy?',
        ],
      },
      // --- NEW TEMPLATE 1 ---
      {
        title: 'Project Manager - Behavioral',
        description:
          'Focuses on situational and behavioral questions for project management roles.',
        isPublic: true,
        isAIGenerated: false,
        questions: [
          'Describe a project you managed that failed. What did you learn from it?',
          'How do you handle scope creep?',
          'Walk me through your process for communicating with stakeholders.',
          'Tell me about a time you had to manage a conflict within your team.',
          'What project management tools are you proficient in, and why do you prefer them?',
        ],
      },
      // --- NEW TEMPLATE 2 ---
      {
        title: 'Python Backend Developer',
        description:
          'A technical interview for a mid-level Python/Django/Flask developer.',
        isPublic: true,
        isAIGenerated: false,
        questions: [
          'What is the difference between a list and a tuple in Python, and when would you use each?',
          'Explain the "GIL" (Global Interpreter Lock) in Python and how it affects concurrency.',
          'Describe your experience with a Python web framework like Django or Flask. What are its pros and cons?',
          'What is a decorator in Python? Can you provide a simple example?',
          'How would you design a REST API for a simple to-do list application?',
        ],
      },
      // --- NEW TEMPLATE 3 ---
      {
        title: 'Junior UX/UI Designer',
        description:
          'A common interview for a junior designer, focusing on their process and portfolio.',
        isPublic: true,
        isAIGenerated: false,
        questions: [
          'Walk me through a project in your portfolio that you are most proud of. What was your design process?',
          'What is the difference between UX and UI design, and how do you see them intersecting?',
          'How do you handle negative feedback on your designs?',
          'What design tools (like Figma, Sketch, or Adobe XD) are you most comfortable with?',
          'Describe a time you had to make a design decision based on user research or testing.',
        ],
      },
    ]);

    return NextResponse.json(
      {
        message: 'Database seeded successfully with 3 users and 5 templates!',
        users: {
          candidate: candidate.email,
          recruiter: recruiter.email,
          admin: admin.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database.' },
      { status: 500 }
    );
  }
}