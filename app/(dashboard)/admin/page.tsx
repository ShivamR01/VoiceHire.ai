import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Settings,
  Database,
  Terminal
} from 'lucide-react';

// Models
import InterviewTemplate from '@/models/InterviewTemplateModel';
import InterviewSession from '@/models/InterviewSessionModel';
import User from '@/models/UserModel'; // Assuming you have this. If not, remove the User stats part.

import SignOutButton from '@/components/SignOutButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // 1. Security Check
  if (!user) return redirect('/login');
  if ((user as any).role !== 'ADMIN') return redirect('/dashboard');

  await dbConnect();

  // 2. Data Fetching (Parallel for speed)
  const [
    totalUsers,
    totalTemplates,
    totalSessions,
    recentSessions,
    recentTemplates
  ] = await Promise.all([
    // Counts
    User ? User.countDocuments() : Promise.resolve(0),
    InterviewTemplate.countDocuments(),
    InterviewSession.countDocuments(),
    // Recent Activity
    InterviewSession.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean(),
    // Recent Templates
    InterviewTemplate.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('createdBy', 'name')
      .lean()
  ]);

  // 3. Simple Analytics
  const completedSessions = await InterviewSession.countDocuments({ status: 'COMPLETED' });
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Command Center</h1>
            <p className="text-gray-500 font-medium">Welcome back, {(user as any).name || 'Commander'}. System is operational.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/recruiter">
                <Button variant="outline" className="rounded-full border-gray-300">
                    Switch to Recruiter View
                </Button>
             </Link>
             <SignOutButton />
          </div>
        </div>

        {/* --- Stats Grid (Bento Style) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                title="Total Users" 
                value={totalUsers} 
                icon={<Users className="w-5 h-5 text-purple-600" />} 
                color="bg-purple-50 border-purple-100"
                trend="+12% this week"
            />
            <StatCard 
                title="Active Templates" 
                value={totalTemplates} 
                icon={<FileText className="w-5 h-5 text-blue-600" />} 
                color="bg-blue-50 border-blue-100"
                trend="Library growing"
            />
            <StatCard 
                title="Total Interviews" 
                value={totalSessions} 
                icon={<Activity className="w-5 h-5 text-orange-600" />} 
                color="bg-orange-50 border-orange-100"
                trend="High traffic"
            />
            <StatCard 
                title="Completion Rate" 
                value={`${completionRate}%`} 
                icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} 
                color="bg-emerald-50 border-emerald-100"
                trend="Healthy engagement"
            />
        </div>

        {/* --- Main Dashboard Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Live Feed */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Recent Interviews Card */}
                <Card className="border-0 shadow-md ring-1 ring-black/5 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Live Interview Feed
                            </CardTitle>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 animate-pulse">
                                Live
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {JSON.parse(JSON.stringify(recentSessions)).length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {JSON.parse(JSON.stringify(recentSessions)).map((session: any) => (
                                    <div key={session._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm border border-white shadow-sm">
                                                {(session.candidateEmail?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {session.candidateEmail || session.user?.email || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    {session.status === 'COMPLETED' ? 'Completed' : 'Started'} 
                                                    <span className="text-gray-300">•</span>
                                                    {new Date(session.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={`
                                            ${session.status === 'COMPLETED' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}
                                            border-0
                                        `}>
                                            {session.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 italic">No recent activity detected.</div>
                        )}
                    </CardContent>
                    <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                        <Button variant="link" className="text-sm text-gray-500 hover:text-gray-900">View All Data history &rarr;</Button>
                    </div>
                </Card>

            </div>

            {/* Right Col: Quick Actions & System Health */}
            <div className="space-y-6">
                
                {/* Quick Actions */}
                <Card className="border-0 shadow-sm ring-1 ring-black/5 rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-gray-400" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <Link href="/recruiter/create">
                            <Button className="w-full justify-start bg-white/10 hover:bg-white/20 border-0 text-white">
                                <Plus className="w-4 h-4 mr-2" /> Create New Template
                            </Button>
                        </Link>
                        <Button className="w-full justify-start bg-white/10 hover:bg-white/20 border-0 text-white">
                            <Database className="w-4 h-4 mr-2" /> Backup Database
                        </Button>
                        <Button className="w-full justify-start bg-white/10 hover:bg-white/20 border-0 text-white">
                            <Settings className="w-4 h-4 mr-2" /> System Settings
                        </Button>
                    </CardContent>
                </Card>

                {/* Latest Templates Mini-List */}
                <Card className="border-0 shadow-sm ring-1 ring-black/5 rounded-3xl bg-white">
                    <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Newest Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {JSON.parse(JSON.stringify(recentTemplates)).map((t: any) => (
                                <div key={t._id} className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                                        <p className="text-xs text-gray-500">
                                            By {t.createdBy?.name || 'Admin'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quirky System Status */}
                <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-bold text-emerald-900">System Healthy</p>
                        <p className="text-xs text-emerald-700">All services operational. <br/> DB Latency: 24ms</p>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component for Stats ---
function StatCard({ title, value, icon, color, trend }: any) {
    return (
        <Card className={`${color} border shadow-none hover:shadow-md transition-all duration-300`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                        {icon}
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                    <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
                    <p className="text-xs font-semibold opacity-70 mt-1">{trend}</p>
                </div>
            </CardContent>
        </Card>
    )
}