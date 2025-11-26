import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import InterviewTemplate from '@/models/InterviewTemplateModel';
import InterviewSession from '@/models/InterviewSessionModel'; // Import Session Model
import RecruiterTemplateCard from '@/components/RecruiterTemplateCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { Briefcase, PlusCircle, Sparkles, TrendingUp, Users, Zap, Command, Activity, CheckCircle } from 'lucide-react';

export default async function RecruiterDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return redirect('/login');
  }

  // Protect recruiter route
  if ((user as any).role !== 'RECRUITER' && (user as any).role !== 'ADMIN') {
    return redirect('/candidate');
  }

  await dbConnect();

  // 1. Fetch recruiter's templates
  const templatesDocs = await InterviewTemplate.find({
    createdBy: (user as any).id,
    isAIGenerated: true,
  }).sort({ createdAt: -1 }).lean();

  const templates = JSON.parse(JSON.stringify(templatesDocs));

  // 2. Fetch stats from Sessions
  // We need to find all sessions that belong to any of these templates
  const templateIds = templates.map((t: any) => t._id);
  const sessionsDocs = await InterviewSession.find({
    template: { $in: templateIds }
  }).lean();

  const totalAssigned = sessionsDocs.length;
  const totalCompleted = sessionsDocs.filter((s: any) => s.status === 'COMPLETED').length;
  
  // Calculate Average Score across all completed interviews
  const completedSessions = sessionsDocs.filter((s: any) => s.status === 'COMPLETED' && s.feedback?.overallScore);
  const avgScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc: number, curr: any) => acc + (curr.feedback?.overallScore || 0), 0) / completedSessions.length)
    : 0;

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-violet-200 text-neutral-900 font-sans relative">
      
      {/* Abstract Geometric Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] bg-gradient-to-b from-violet-100/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[20%] left-[5%] w-96 h-96 bg-fuchsia-100/40 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-cyan-100/40 rounded-full blur-3xl mix-blend-multiply" />
          {/* Tech Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-full shadow-sm transition-transform hover:scale-105 cursor-default">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs font-bold text-neutral-600 tracking-widest uppercase">Command Center</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-neutral-900 leading-[0.9]">
                    Hey <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500">{user.name?.split(' ')[0] || 'Recruiter'}</span>.
                </h1>
                
                <p className="text-xl md:text-2xl text-neutral-500 font-medium leading-relaxed">
                    Let's find some <span className="relative inline-block px-2 text-white bg-neutral-900 -skew-x-6 mx-1 shadow-lg"><span className="skew-x-6 block">rockstars</span></span> today.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <SignOutButton className="border-2 border-neutral-200 bg-transparent hover:bg-neutral-100 text-neutral-700 font-bold rounded-xl px-6 py-3 h-auto" text="Log Out" />
                <Link href="/recruiter/create">
                    {/* Tactile Button Style */}
                    <Button className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                        <PlusCircle className="mr-2 h-5 w-5" /> New Interview
                    </Button>
                </Link>
            </div>
        </header>

        {/* --- Bento Grid Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 mb-20">
            
            {/* Stat 1: Big White Card (Templates) */}
            <div className="lg:col-span-5 bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-xl shadow-neutral-200/50 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-100 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-neutral-400 uppercase tracking-wider text-sm">Active Roles</span>
                    </div>
                    <div className="text-7xl font-black text-neutral-900 mt-4 tracking-tighter">
                        {templates.length}
                    </div>
                </div>
                <div className="relative z-10 mt-8 flex items-center gap-2 text-sm font-bold text-violet-600 cursor-pointer hover:underline">
                    View Analytics <TrendingUp className="w-4 h-4" />
                </div>
            </div>

            {/* Stat 2: Dark Card (Candidates) */}
            <div className="lg:col-span-4 bg-neutral-900 text-white rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-fuchsia-500 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-sm mb-4">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-neutral-400 uppercase tracking-wider text-sm">Total Candidates</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="bg-green-500 text-neutral-900 text-xs font-bold px-2 py-1 rounded-md mb-1">{totalCompleted} Done</span>
                        <span className="text-neutral-400 text-xs font-mono">of {totalAssigned} Assigned</span>
                    </div>
                </div>
                <div className="relative z-10 text-5xl font-black tracking-tighter mt-4">
                    {totalAssigned}
                </div>
                <div className="relative z-10 mt-4 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className="bg-fuchsia-500 h-full rounded-full" 
                        style={{ width: `${totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Stat 3: Gradient Card (Avg Score) */}
            <div className="lg:col-span-3 bg-gradient-to-br from-pink-500 to-orange-400 text-white rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                <Sparkles className="w-8 h-8 mb-4 text-yellow-200 animate-pulse" />
                <div className="text-4xl font-black mb-1">{avgScore}%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-90">Avg AI Score</div>
            </div>
        </div>

        {/* --- Templates Grid Section --- */}
        <section>
            <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 bg-white border-2 border-neutral-100 rounded-2xl flex items-center justify-center shadow-sm text-fuchsia-500">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                    Your Mission Templates
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {templates.length > 0 ? (
                templates.map((template: any) => (
                <div key={template._id} className="group perspective-1000">
                    <RecruiterTemplateCard
                        template={template}
                    />
                </div>
                ))
            ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white border-4 border-dashed border-neutral-200 rounded-[3rem] text-center relative overflow-hidden">
                    <div className="bg-neutral-50 p-8 rounded-full mb-6 relative z-10">
                        <Briefcase className="h-16 w-16 text-neutral-300" />
                    </div>
                    <h3 className="text-3xl font-black text-neutral-900 mb-3 relative z-10">Your launchpad is empty.</h3>
                    <p className="text-neutral-500 max-w-md mb-10 text-lg relative z-10 font-medium">
                        Create your first AI-powered interview template to start screening candidates like a pro.
                    </p>
                    <Link href="/recruiter/create" className="relative z-10">
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-8 text-xl rounded-2xl shadow-xl hover:shadow-violet-500/30 transition-all font-bold">
                        <PlusCircle className="mr-3 h-6 w-6" /> Launch New Template
                        </Button>
                    </Link>
                    
                    {/* Decorative background inside empty state */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />
                </div>
            )}
            </div>
        </section>

      </div>
    </div>
  );
}