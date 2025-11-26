'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { 
  PlusCircle, 
  Briefcase, 
  Users, 
  Zap, 
  FileText, 
  Search, 
  LayoutTemplate, 
  ArrowUpRight, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Template {
  _id: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: string;
  isAIGenerated?: boolean;
}

interface DashboardClientProps {
  user: any;
  recruiterName: string;
  templates: Template[];
  stats: {
    totalScreened: number;
    activeInterviews: number;
    totalTemplates: number;
  };
}

export default function RecruiterDashboardClient({
  user,
  recruiterName,
  templates = [],
  stats
}: DashboardClientProps) {
  
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates based on search
  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- TOP BAR --- */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Briefcase size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight">VoiceHire<span className="text-blue-600">.recruiter</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden text-sm font-semibold text-slate-500 md:block">
                {recruiterName}
             </div>
             <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6 md:p-10">
        
        {/* --- HEADER --- */}
        <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
           <div>
             <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 shadow-sm">
                <LayoutTemplate size={12} /> Dashboard
             </div>
             <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
               Recruiter Overview
             </h1>
             <p className="mt-2 text-lg font-medium text-slate-500">
               Manage your interview templates and track candidate progress.
             </p>
           </div>
           
           <Link href="/recruiter/create">
             <Button size="lg" className="rounded-full bg-blue-600 px-8 font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all">
               <PlusCircle className="mr-2 h-5 w-5" /> Create Template
             </Button>
           </Link>
        </header>

        {/* --- STATS GRID --- */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
           
           {/* Stat 1: Total Screened */}
           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidates Screened</p>
                    <h3 className="mt-2 text-4xl font-black text-slate-900">{stats.totalScreened}</h3>
                 </div>
                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Users size={24} />
                 </div>
              </div>
           </div>

           {/* Stat 2: Active Interviews */}
           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Interviews</p>
                    <h3 className="mt-2 text-4xl font-black text-slate-900">{stats.activeInterviews}</h3>
                 </div>
                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Zap size={24} fill="currentColor" />
                 </div>
              </div>
           </div>

           {/* Stat 3: Total Templates */}
           <div className="group relative overflow-hidden rounded-2xl bg-blue-600 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-blue-500/30">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">Total Templates</p>
                    <h3 className="mt-2 text-4xl font-black">{stats.totalTemplates}</h3>
                 </div>
                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <FileText size={24} />
                 </div>
              </div>
           </div>
        </div>

        {/* --- TEMPLATES LIST --- */}
        <section>
           <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                 <FileText className="text-slate-400" /> Interview Templates
              </h2>
              <div className="relative w-full sm:w-72">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                 <Input 
                   placeholder="Search templates..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 rounded-xl border-slate-200 bg-white focus:ring-blue-500"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Create New Card (First Item) */}
              <Link href="/recruiter/create" className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
                 <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <PlusCircle size={28} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-600 group-hover:text-blue-700">Create New Template</h3>
                 <p className="mt-1 text-sm text-slate-400">Set up a new interview with custom questions.</p>
              </Link>

              {filteredTemplates.length > 0 ? (
                 filteredTemplates.map((template) => (
                    <div key={template._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-blue-500/50">
                       <div className="absolute top-0 left-0 h-1 w-full bg-slate-100 group-hover:bg-blue-500 transition-all"></div>
                       
                       <div>
                          <div className="mb-4 flex items-start justify-between">
                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText size={20} />
                             </div>
                             {template.isAIGenerated && (
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                                   <Sparkles size={10} className="mr-1" /> AI Generated
                                </Badge>
                             )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                             {template.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                             {template.description || "No description provided."}
                          </p>
                          
                          <div className="mt-4 flex items-center gap-3 text-xs font-medium text-slate-400">
                             <span className="flex items-center gap-1">
                                <Briefcase size={12} /> {(template.questions || []).length} Questions
                             </span>
                             <span className="flex items-center gap-1">
                                <Clock size={12} /> {new Date(template.createdAt).toLocaleDateString()}
                             </span>
                          </div>
                       </div>

                       <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
                          <Link href={`/recruiter/edit/${template._id}`} className="flex-1">
                             <Button variant="outline" className="w-full rounded-lg border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                                Edit
                             </Button>
                          </Link>
                          <Link href={`/recruiter/conduct/${template._id}`}>
                             <Button className="flex-1 rounded-lg bg-slate-900 text-white hover:bg-blue-600">
                                Invite <ArrowUpRight size={16} className="ml-1" />
                             </Button>
                          </Link>
                       </div>
                    </div>
                 ))
              ) : (
                 <div className="col-span-full py-12 text-center">
                    {searchQuery ? (
                       <p className="text-slate-500">No templates found matching "{searchQuery}".</p>
                    ) : (
                       <p className="text-slate-500">No templates created yet.</p>
                    )}
                 </div>
              )}
           </div>
        </section>

      </main>
    </div>
  );
}