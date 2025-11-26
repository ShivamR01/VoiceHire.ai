import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import InterviewTemplate from '@/models/InterviewTemplateModel';
import InterviewSession from '@/models/InterviewSessionModel';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/components/SignOutButton';
import InterviewManager from '@/components/InterviewManager';

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // 1. Auth Check
  if (!user) return redirect('/login');
  
  // If not a recruiter/admin, send them to Home or Main Recruiter page
  if ((user as any).role !== 'RECRUITER' && (user as any).role !== 'ADMIN') {
    return redirect('/'); 
  }

  await dbConnect();

  // 2. Fetch Template
  const templateDoc = await InterviewTemplate.findById(templateId).lean();
  if (!templateDoc) return notFound();

  // 3. Ownership Check
  if (
    templateDoc.createdBy &&
    templateDoc.createdBy.toString() !== (user as any).id &&
    (user as any).role !== 'ADMIN'
  ) {
    return redirect('/recruiter'); // Changed from /dashboard
  }

  const template = JSON.parse(JSON.stringify(templateDoc));

  // 4. Fetch Sessions
  const sessionsDocs = await InterviewSession.find({ template: templateId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const sessions = JSON.parse(JSON.stringify(sessionsDocs));

  return (
    <div className="min-h-screen bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Quirky Header with Glass effect */}
        <div className="sticky top-4 z-10">
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Fixed Back Link */}
                <Link href="/recruiter">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200/50">
                      <ArrowLeft className="h-5 w-5 text-gray-700" />
                  </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
                        {template.title}
                        <span className="hidden sm:inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                            AI Interview
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Manage candidates and view insights</p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Link href={`/recruiter/conduct/${templateId}`}>
                    <Button className="rounded-full bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all">
                        <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                        Start New Session
                    </Button>
                </Link>
                <SignOutButton />
            </div>
            </div>
        </div>

        {/* Template Quick Context */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Context</h3>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {template.description || "No description provided for this interview."}
                </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-blue-100/50">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Snapshot</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                        <span className="text-gray-600 text-sm">Questions</span>
                        <span className="font-bold text-indigo-900">{template.questions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                        <span className="text-gray-600 text-sm">Created</span>
                        <span className="font-bold text-indigo-900">{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs text-indigo-600/80 italic">"Good hiring is about finding the signal in the noise."</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Client Component */}
        <InterviewManager template={template} sessions={sessions} />

      </div>
    </div>
  );
}