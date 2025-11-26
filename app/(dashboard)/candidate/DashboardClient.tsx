// File: app/candidate/DashboardClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { 
  CalendarCheck, 
  Terminal, 
  Zap, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Ghost,
  Target,
  Activity,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
  user: any;
  candidateName: string;
  scheduledInterviews: any[];
  completedInterviews: any[];
  templates: any[];
}

export default function DashboardClient({
  user,
  candidateName,
  scheduledInterviews = [],
  completedInterviews = [],
  templates = []
}: DashboardClientProps) {
  
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showAllPractice, setShowAllPractice] = useState(false);

  // Safety check to ensure arrays exist
  const safeHistory = Array.isArray(completedInterviews) ? completedInterviews : [];
  const safeTemplates = Array.isArray(templates) ? templates : [];
  const safeScheduled = Array.isArray(scheduledInterviews) ? scheduledInterviews : [];

  // Logic for toggling lists
  const displayedHistory = showAllHistory ? safeHistory : safeHistory.slice(0, 3);
  const displayedPractice = showAllPractice ? safeTemplates : safeTemplates.slice(0, 4);

  // Stats calculation
  const totalCompleted = safeHistory.length;
  const activeCount = safeScheduled.length;

  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight">VoiceHire<span className="text-indigo-600">.ai</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden text-sm font-semibold text-slate-500 md:block">
                Welcome back, {candidateName}
             </div>
             <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6 md:p-10">
        
        {/* --- PAGE HEADER --- */}
        <header className="mb-10">
           <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
             Command Center
           </h1>
           <p className="mt-2 text-lg font-medium text-slate-500">
             Track your progress and manage your upcoming simulations.
           </p>
        </header>

        {/* --- KEY METRICS GRID --- */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Active Interviews */}
          <div className="relative overflow-hidden rounded-2xl bg-indigo-600 p-6 text-white shadow-xl transition-transform hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider opacity-80">Active Missions</p>
                <h3 className="mt-2 text-4xl font-black">{activeCount}</h3>
              </div>
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <CalendarCheck size={24} className="text-white" />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium opacity-80">
              {activeCount > 0 ? "You have pending interviews." : "No active assignments."}
            </p>
          </div>

          {/* Card 2: Completed Interviews */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 text-slate-900 shadow-sm ring-1 ring-slate-200 transition-transform hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Completed Logs</p>
                <h3 className="mt-2 text-4xl font-black">{totalCompleted}</h3>
              </div>
              <div className="rounded-xl bg-green-50 p-3">
                <Trophy size={24} className="text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">
              Lifetime sessions recorded.
            </p>
          </div>

           {/* Card 3: Start Practice (Spans 2 cols) */}
           <div className="group relative col-span-1 overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-xl transition-transform hover:scale-[1.02] sm:col-span-2">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
              <div className="relative z-10 flex h-full flex-col justify-between">
                 <div className="flex items-start justify-between">
                    <div>
                       <h3 className="text-xl font-bold text-white">Start a Practice Session</h3>
                       <p className="mt-1 text-slate-400">Choose from {safeTemplates.length} templates to sharpen your skills.</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                       <Terminal size={24} className="text-white" />
                    </div>
                 </div>
                 <Button 
                   onClick={() => setShowAllPractice(true)}
                   className="mt-4 w-fit rounded-full bg-white px-6 font-bold text-slate-900 hover:bg-slate-200"
                 >
                    Browse Library
                 </Button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* --- LEFT COLUMN (Active & Practice) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ACTIVE INTERVIEWS LIST */}
            <section className="rounded-3xl border border-slate-200 bg-white p-1 shadow-sm">
               <div className="rounded-[20px] bg-slate-50 p-6">
                  <div className="mb-6 flex items-center justify-between">
                     <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <Activity className="text-indigo-600" size={20} />
                        Active Assignments
                     </h2>
                  </div>

                  <div className="space-y-3">
                     {safeScheduled.length > 0 ? (
                        safeScheduled.map((session: any) => (
                           <div key={session._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-600 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex gap-4">
                                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">
                                    <Target size={20} />
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-slate-900 text-lg">
                                       {session.template?.title || 'Untitled Session'}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500">
                                       Assigned by {session.conductedBy?.name || 'Recruiter'}
                                    </p>
                                 </div>
                              </div>
                              <Link href={`/interview/live/${session._id}`}>
                                 <Button size="lg" className="w-full rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 sm:w-auto">
                                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                                 </Button>
                              </Link>
                           </div>
                        ))
                     ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-12 text-center">
                           <div className="mb-3 rounded-full bg-slate-100 p-3">
                              <Ghost className="h-6 w-6 text-slate-400" />
                           </div>
                           <p className="font-semibold text-slate-900">No pending assignments</p>
                           <p className="text-sm text-slate-500">Wait for a recruiter or start a practice session.</p>
                        </div>
                     )}
                  </div>
               </div>
            </section>

            {/* PRACTICE TEMPLATES LIST */}
            <section>
               <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                     <Sparkles className="text-orange-500" size={20} />
                     Practice Library
                  </h2>
               </div>
               
               <div className="grid gap-4 sm:grid-cols-2">
                  {displayedPractice.length > 0 ? (
                     displayedPractice.map((template: any) => (
                        <Link href={`/interview/setup/${template._id}`} key={template._id} className="group">
                           <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-900 hover:shadow-lg">
                              <div>
                                 <div className="mb-4 flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                       <Terminal size={20} />
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                       {(template.questions || []).length} Qs
                                    </span>
                                 </div>
                                 <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                                    {template.title}
                                 </h3>
                                 <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                    {template.description || "Master this specific interview scenario."}
                                 </p>
                              </div>
                              <div className="mt-4 flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-900">
                                 Start Simulation <ArrowRight size={16} className="ml-2" />
                              </div>
                           </div>
                        </Link>
                     ))
                  ) : (
                     <div className="col-span-full py-8 text-center text-slate-500">No templates available.</div>
                  )}
               </div>

               {/* Toggle Button for Practice */}
               {safeTemplates.length > 4 && (
                 <div className="mt-6 flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllPractice(!showAllPractice)}
                      className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    >
                      {showAllPractice ? (
                        <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                      ) : (
                        <>View All ({safeTemplates.length}) <ChevronDown className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                 </div>
               )}
            </section>
          </div>

          {/* --- RIGHT COLUMN (History) --- */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                   <History size={20} className="text-slate-400" />
                   Recent History
                </h3>

                <div className="relative space-y-8 pl-2">
                   {/* Vertical Line */}
                   <div className="absolute left-[15px] top-2 bottom-4 w-[2px] bg-slate-100"></div>

                   {displayedHistory.length > 0 ? (
                      displayedHistory.map((session: any) => (
                         <div key={session._id} className="relative pl-8">
                            {/* Dot Indicator */}
                            <div className={cn(
                               "absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center z-10",
                               (session.feedback?.overallScore || 0) >= 70 ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                            )}>
                               <div className={cn(
                                 "h-2.5 w-2.5 rounded-full",
                                  (session.feedback?.overallScore || 0) >= 70 ? "bg-green-500" : "bg-orange-500"
                               )}></div>
                            </div>

                            <div className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-slate-300 hover:shadow-sm">
                               <div className="mb-1 flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase text-slate-400">
                                     {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className={cn(
                                     "text-sm font-black",
                                     (session.feedback?.overallScore || 0) >= 70 ? "text-green-600" : "text-orange-600"
                                  )}>
                                     {session.feedback?.overallScore || 0}%
                                  </span>
                               </div>
                               <h4 className="line-clamp-1 font-bold text-slate-900">
                                  {session.template?.title}
                                </h4>
                               <Link 
                                 href={`/interview/feedback/${session._id}`}
                                 className="mt-2 inline-flex items-center text-xs font-bold text-indigo-600 hover:underline"
                               >
                                  View Feedback
                               </Link>
                            </div>
                         </div>
                      ))
                   ) : (
                      <div className="py-4 text-center text-sm text-slate-400 italic">
                         No history yet.
                      </div>
                   )}
                </div>

                {/* Toggle Button for History */}
                {safeHistory.length > 3 && (
                  <div className="mt-8">
                     <Button 
                       variant="ghost" 
                       onClick={() => setShowAllHistory(!showAllHistory)}
                       className="w-full justify-center text-slate-500 hover:text-slate-900"
                     >
                       {showAllHistory ? "Collapse History" : "View All Logs"}
                     </Button>
                  </div>
                )}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}