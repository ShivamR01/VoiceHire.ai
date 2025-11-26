import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import InterviewSession from '@/models/InterviewSessionModel';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Clock, 
  User, 
  Bot, 
  Sparkles, 
  Trophy, 
  Target, 
  TrendingUp,
  FileText,
  Share2,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  // Fetch session and populate template details
  const interviewSession = await InterviewSession.findById(sessionId)
    .populate('template')
    .lean()
    .exec() as any;

  if (!interviewSession) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
            <h1 className="text-4xl font-black mb-2">404</h1>
            <p className="text-xl text-slate-500">Interview session not found in the archives.</p>
            <Link href="/dashboard" className="mt-8">
               <Button>Return to Base</Button>
            </Link>
        </div>
    );
  }

//   Access Control
  const userId = (user as any).id;
  const userEmail = user.email?.toLowerCase();
  const isSessionOwner = Array.isArray(interviewSession.user) ? interviewSession.user.some((u: any) => u.toString() === userId) : interviewSession.user?.toString() === userId;
  const isRecruiterOwner = interviewSession.conductedBy && interviewSession.conductedBy.toString() === userId;
  const isAssignedCandidate = interviewSession.candidateEmail && interviewSession.candidateEmail.toLowerCase() === userEmail;

  if (!isSessionOwner && !isRecruiterOwner && !isAssignedCandidate && (user as any).role !== 'ADMIN') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <p className="text-xl font-bold text-red-600">Access Denied: Classified Information.</p>
        </div>
    );
  }

  const feedback = interviewSession.feedback;
  const transcript = interviewSession.transcript || [];
  const templateTitle = interviewSession.template?.title || 'Unknown Mission';
  const score = feedback?.overallScore || 0;

  // Determine dashboard link based on role
  const role = (user as any).role;
  const dashboardLink = role === 'RECRUITER' ? '/recruiter' : '/candidate';

  // Helper to format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine score color/grade
  const getScoreColor = (s: number) => {
      if (s >= 90) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      if (s >= 75) return 'text-blue-500 bg-blue-50 border-blue-100';
      if (s >= 60) return 'text-amber-500 bg-amber-50 border-amber-100';
      return 'text-red-500 bg-red-50 border-red-100';
  };

  const getScoreLabel = (s: number) => {
      if (s >= 90) return 'Legendary';
      if (s >= 75) return 'Professional';
      if (s >= 60) return 'Developing';
      return 'Novice';
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* --- TOP NAVIGATION --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href={dashboardLink} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span>Back to Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-500" />
                    <span className="font-semibold text-slate-900">{templateTitle}</span>
                    <Badge variant="outline" className="ml-2 bg-slate-50 text-slate-500">Report</Badge>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="hidden sm:flex text-slate-600 border-slate-200">
                    <Printer size={16} className="mr-2" /> Print
                 </Button>
                 <Button variant="outline" size="sm" className="hidden sm:flex text-slate-600 border-slate-200">
                    <Share2 size={16} className="mr-2" /> Share
                 </Button>
            </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* --- HERO SCORE CARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12 lg:col-span-8">
                <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                        <Trophy size={300} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        {/* Score Circle */}
                        <div className="relative shrink-0">
                             {/* Decorative ring */}
                             <div className={`absolute inset-0 rounded-full border-[6px] opacity-20 ${getScoreColor(score).split(' ')[0].replace('text-', 'border-')}`}></div>
                             
                             <div className={`h-40 w-40 rounded-full flex flex-col items-center justify-center border-[6px] ${getScoreColor(score).split(' ')[2]} bg-white shadow-inner`}>
                                 <span className={`text-5xl font-black tracking-tighter ${getScoreColor(score).split(' ')[0]}`}>
                                     {score}
                                 </span>
                                 <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                                     Score
                                 </span>
                             </div>
                             
                             {score >= 70 && (
                                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                                     <CheckCircle2 size={12} /> PASSED
                                 </div>
                             )}
                        </div>

                        {/* Text Summary */}
                        <div className="text-center md:text-left space-y-4">
                             <div>
                                 <h2 className="text-3xl font-black text-slate-900 mb-1">
                                     {getScoreLabel(score)} Performance
                                 </h2>
                                 <p className="text-slate-500 text-lg">
                                     Completed on {new Date(interviewSession.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                 </p>
                             </div>
                             
                             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                 <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                                     <Clock size={16} className="text-slate-400" />
                                     <span className="text-sm font-bold text-slate-700">12m 30s Duration</span>
                                 </div>
                                 <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                                     <Bot size={16} className="text-slate-400" />
                                     <span className="text-sm font-bold text-slate-700">{transcript.filter((t: any) => t.speaker === 'AI').length} Questions</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS / SIDEBAR */}
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="h-full rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Target size={150} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">AI Recruiter Insight</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                           "Based on your responses, you showed strong technical aptitude but could improve on structuring your behavioral answers using the STAR method."
                        </p>
                    </div>
                    <div className="relative z-10 mt-6">
                        <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
                            <Sparkles size={16} className="mr-2" /> View Detailed Breakdown
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- DETAILED FEEDBACK GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* STRENGTHS */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Key Strengths</h3>
                </div>
                
                <div className="grid gap-3">
                    {feedback?.strengths?.length ? (
                        feedback.strengths.map((str: string, idx: number) => (
                            <div key={idx} className="group flex items-start p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
                                <div className="mt-0.5 mr-3 shrink-0">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                </div>
                                <span className="text-slate-700 font-medium group-hover:text-emerald-900 transition-colors">{str}</span>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 italic">
                            No specific strengths highlighted.
                        </div>
                    )}
                </div>
            </div>

            {/* IMPROVEMENTS */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                        <Target size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Areas to Improve</h3>
                </div>
                
                <div className="grid gap-3">
                    {feedback?.areasForImprovement?.length ? (
                        feedback.areasForImprovement.map((area: string, idx: number) => (
                            <div key={idx} className="group flex items-start p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
                                <div className="mt-0.5 mr-3 shrink-0">
                                    <ArrowLeft size={18} className="text-amber-500 rotate-45" />
                                </div>
                                <span className="text-slate-700 font-medium group-hover:text-amber-900 transition-colors">{area}</span>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 italic">
                            No specific improvements needed.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- DEEP ANALYSIS --- */}
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Comprehensive Analysis</h3>
            </div>
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                    {feedback?.detailedAnalysis || "Analysis pending..."}
                </p>
            </div>
        </div>

        {/* --- TRANSCRIPT LOG --- */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="text-slate-400" /> Session Log
                </h3>
                <Badge variant="outline" className="text-slate-500">Read-Only</Badge>
            </div>
            
            <div className="p-8 space-y-8 max-h-[800px] overflow-y-auto custom-scrollbar">
                {transcript.map((entry: any, index: number) => {
                    // Determine Question Number for AI entries
                    const questionNumber = entry.speaker === 'AI' 
                        ? transcript.slice(0, index + 1).filter((t: any) => t.speaker === 'AI').length 
                        : null;

                    return (
                        <div key={index} className={`flex gap-4 ${entry.speaker === 'USER' ? 'justify-end' : 'justify-start'}`}>
                            {/* Avatar for AI */}
                            {entry.speaker === 'AI' && (
                                <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md mt-1">
                                    <Bot size={20} />
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`flex flex-col max-w-[85%] ${entry.speaker === 'USER' ? 'items-end' : 'items-start'}`}>
                                
                                {/* Question Label */}
                                {entry.speaker === 'AI' && (
                                    <span className="text-xs font-bold text-indigo-600 mb-1 ml-1">
                                        Question {questionNumber}
                                    </span>
                                )}

                                <div className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                                    entry.speaker === 'AI' 
                                        ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                                        : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200'
                                }`}>
                                    {entry.text}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 mt-1 px-1 uppercase tracking-wider">
                                    {entry.timestamp ? formatTime(entry.timestamp) : (entry.speaker === 'AI' ? 'Interviewer' : 'You')}
                                </span>
                            </div>

                            {/* User Avatar */}
                            {entry.speaker === 'USER' && (
                                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 border border-white shadow-sm mt-1">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {transcript.length === 0 && (
                     <div className="text-center py-12">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300 mb-4">
                            <FileText size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">Transcript data unavailable.</p>
                     </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}