// File: app/candidate/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import InterviewTemplate from '@/models/InterviewTemplateModel';
import InterviewSession from '@/models/InterviewSessionModel';
import User from '@/models/UserModel'; // Ensure this matches your actual model file name
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function CandidateDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.email) {
    return redirect('/login');
  }

  // Protect candidate route
  if ((user as any).role !== 'CANDIDATE' && (user as any).role !== 'ADMIN') {
    return redirect('/dashboard');
  }

  await dbConnect();

  const userEmail = user.email.toLowerCase();

  // 1. Fetch User from DB to get the correct _id for relation queries
  // We use a case-insensitive regex for the email to ensure we find the user even if casing differs
  const dbUser = await User.findOne({ 
    email: { $regex: new RegExp(`^${userEmail}$`, 'i') } 
  }).lean();

  if (!dbUser) {
    // Fallback if user exists in session but not in DB (edge case)
    console.error("Candidate Dashboard: User not found in DB for email:", userEmail);
    return redirect('/login');
  }

  const candidateName = dbUser.name || user.name || 'Candidate';
  const userId = dbUser._id; 

  // 2. Fetch Scheduled Interviews (Active Missions)
  // Recruiters invite by email, so we query by candidateEmail
  const scheduledDocs = await InterviewSession.find({
    candidateEmail: { $regex: new RegExp(`^${userEmail}$`, 'i') },
    status: 'IN_PROGRESS',
    conductedBy: { $ne: null }
  })
    .populate('template')
    .populate('conductedBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const scheduledInterviews = JSON.parse(JSON.stringify(scheduledDocs));

  // 3. Fetch Completed Interviews (For Stats & History)
  // We use the stable userId from the DB fetch above
  const completedDocs = await InterviewSession.find({
    user: userId,
    status: 'COMPLETED',
  })
    .populate('template')
    .sort({ createdAt: -1 })
    .lean();

  const completedInterviews = JSON.parse(JSON.stringify(completedDocs));

  // 4. Fetch Public Practice Templates
  const templatesDocs = await InterviewTemplate.find({
    isPublic: true,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const templates = JSON.parse(JSON.stringify(templatesDocs));

  // Pass data to the Client Component
  return (
    <DashboardClient 
      user={user}
      candidateName={candidateName}
      scheduledInterviews={scheduledInterviews}
      completedInterviews={completedInterviews}
      templates={templates}
    />
  );
}