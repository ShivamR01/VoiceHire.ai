'use client';

import { useState } from 'react';
import { 
  Search, Copy, Check, MoreHorizontal, 
  Calendar, CheckCircle2, Clock, Users, ArrowUpRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { toast } from 'sonner'; // Assuming you use sonner or similar for toasts

interface InterviewManagerProps {
  template: any;
  sessions: any[];
}

export default function InterviewManager({ template, sessions }: InterviewManagerProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter Logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = 
      session.candidateEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isCompleted = session.status === 'COMPLETED';
    
    return activeTab === 'completed' 
      ? isCompleted && matchesSearch 
      : !isCompleted && matchesSearch;
  });

  // Stats Logic
  const total = sessions.length;
  const completed = sessions.filter(s => s.status === 'COMPLETED').length;
  const pending = sessions.filter(s => s.status === 'IN_PROGRESS').length;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/recruiter/conduct/${template._id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Bento Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          label="Total Candidates"
          value={total}
          trend="+12%"
          color="bg-indigo-50 border-indigo-100"
        />
        <StatCard 
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          label="Completed"
          value={completed}
          color="bg-emerald-50 border-emerald-100"
        />
        <StatCard 
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Pending"
          value={pending}
          color="bg-amber-50 border-amber-100"
        />
        <Card className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-0 shadow-lg transform transition-all hover:scale-[1.02] cursor-pointer" onClick={handleCopyLink}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
             {copied ? <Check className="w-8 h-8 mb-2 animate-bounce" /> : <Copy className="w-8 h-8 mb-2" />}
             <p className="font-bold text-lg">Copy Invite Link</p>
             <p className="text-white/80 text-xs mt-1">Send this to candidates</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Controls & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('active')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Active & Pending
            </button>
            <button 
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'completed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Completed
            </button>
        </div>
        
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Search candidates..." 
                className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* 3. The List */}
      <div className="grid gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <CandidateCard key={session._id} session={session} type={activeTab} />
          ))
        ) : (
          <div className="text-center py-20 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl">
             <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-gray-900 font-semibold">No candidates found</h3>
             <p className="text-gray-500 text-sm">Try adjusting your filters or invite a new candidate.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components for cleaner code ---

function StatCard({ icon, label, value, color, trend }: any) {
    return (
        <Card className={`${color} border shadow-none transition-all hover:shadow-md`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-white/60 rounded-lg backdrop-blur-sm">{icon}</div>
                    {trend && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">{trend}</span>}
                </div>
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                <div className="text-sm font-medium text-gray-600 mt-1">{label}</div>
            </CardContent>
        </Card>
    )
}

function CandidateCard({ session, type }: { session: any, type: 'active' | 'completed' }) {
    const score = session.feedback?.overallScore || 0;
    const isPassing = score >= 70;

    return (
        <div className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200">
            
            {/* Left: User Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${type === 'completed' ? (isPassing ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700') : 'bg-gray-100 text-gray-600'}`}>
                    {session.candidateEmail?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">
                        {session.candidateEmail || session.user?.email || 'Anonymous Candidate'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {/* FIXED: Added 'en-US' to prevent hydration mismatch */}
                        {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {session.user?.name && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{session.user.name}</span>}
                    </div>
                </div>
            </div>

            {/* Middle: Stats / Status */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center gap-6">
                {type === 'completed' ? (
                    <>
                        <div className="text-right">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Score</span>
                            <p className={`text-xl font-bold ${isPassing ? 'text-green-600' : 'text-amber-600'}`}>{score}%</p>
                        </div>
                        <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                        <div className="max-w-[200px] hidden md:block">
                            <p className="text-xs text-gray-500 truncate">{session.feedback?.detailedAnalysis || "No summary available"}</p>
                        </div>
                    </>
                ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        Pending / In Progress
                    </Badge>
                )}
            </div>

            {/* Right: Actions */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-end">
                {type === 'completed' ? (
                    <Link href={`/interview/feedback/${session._id}`}>
                        <Button size="sm" variant="outline" className="rounded-full border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 group-hover:translate-x-1 transition-all">
                            View Report <ArrowUpRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Cancel Session</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}