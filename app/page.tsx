import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { Mic, Sparkles, Brain, Zap, MessageCircle, TrendingUp, ArrowRight, Activity, Terminal, Ghost } from 'lucide-react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Logic to determine dashboard URL
  let dashboardUrl = '/dashboard';
  if (session?.user) {
    const role = (session.user as any).role;
    if (role === 'RECRUITER') {
      dashboardUrl = '/recruiter';
    } else if (role === 'CANDIDATE') {
      dashboardUrl = '/candidate';
    } else if (role === 'ADMIN') {
      dashboardUrl = '/admin';
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fafafa] text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* --- FUTURISTIC BACKGROUND LAYERS --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute -left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[100px] animate-pulse"></div>
      <div className="absolute -right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-300/30 blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-[20%] h-[400px] w-[400px] rounded-full bg-pink-300/20 blur-[100px]"></div>

      {/* --- NAVIGATION --- */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Mic size={24} className="animate-pulse" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">VoiceHire<span className="text-indigo-600">.ai</span></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Version v1.0</span>
          </div>
        </div>

        <div className="hidden gap-8 md:flex">
             {/* Nav Links could go here */}
        </div>

        <div>
          {session ? (
            <Button asChild className="rounded-full bg-slate-900 px-6 font-bold text-white shadow-lg hover:bg-slate-800 hover:scale-105 transition-all">
              <Link href={dashboardUrl}>Enter Portal</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                Log In
              </Link>
              <Button asChild className="rounded-full bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 mx-auto mt-16 max-w-7xl px-6 pb-32 md:mt-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/50 px-4 py-1.5 text-sm font-semibold text-indigo-600 backdrop-blur-md shadow-sm mb-8 transition-transform hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>Gemini 3.0 Pro Enabled</span>
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 md:text-7xl lg:text-8xl leading-[0.9]">
              Interview <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x">Without</span> <br />
              <span className="relative inline-block">
                The Panic.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="mt-8 text-xl font-medium leading-relaxed text-slate-500 max-w-lg">
              Turn ideas into interviews—AI handles the talking, evaluating, and feedback so you can hire with confidence.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              {session ? (
                <Button asChild size="lg" className="h-16 rounded-2xl bg-slate-900 px-8 text-lg font-bold text-white shadow-2xl shadow-slate-400/50 hover:bg-slate-800 hover:scale-[1.02] transition-all">
                  <Link href={dashboardUrl} className="flex items-center gap-2">
                    Resume Simulation <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="h-16 rounded-2xl bg-indigo-600 px-8 text-lg font-bold text-white shadow-2xl shadow-indigo-400/50 hover:bg-indigo-700 hover:scale-[1.02] transition-all">
                    <Link href="/signup">Start Session</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-16 rounded-2xl border-2 border-slate-200 px-8 text-lg font-bold text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900">
                    <Link href="/login">Log In</Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm font-semibold text-slate-400">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                   <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=${10+i}')] bg-cover`}></div>
                ))}
              </div>
              <p>Trusted by 10,000+ nervous humans.</p>
            </div>
          </div>

          {/* Right Column: Visual Element (Fake Interface) */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
             {/* Decorative blob behind */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-[80px] rounded-full"></div>
             
             {/* The Card */}
             <div className="relative rounded-3xl border border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 ease-out">
                {/* Header of fake app */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-200/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-500">recruiter_ai_v1.exe</div>
                </div>

                {/* Chat Area */}
                <div className="space-y-4">
                  {/* AI Message */}
                  <div className="flex gap-3">
                     <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                       <Brain size={18} />
                     </div>
                     <div className="rounded-2xl rounded-tl-none bg-white p-4 shadow-sm text-sm text-slate-700 leading-relaxed">
                       <p className="font-bold text-indigo-900 mb-1">AI Recruiter</p>
                       Tell me about a time you failed. And please, don't say you "work too hard."
                     </div>
                  </div>

                  {/* User Audio Visualizer (Fake) */}
                  <div className="flex gap-3 justify-end">
                     <div className="flex flex-col items-end gap-1">
                        <div className="rounded-2xl rounded-tr-none bg-slate-900 p-3 shadow-md text-white min-w-[200px]">
                           <div className="flex items-center justify-center gap-1 h-8">
                              {/* Animated bars */}
                              {[...Array(12)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-green-400 rounded-full animate-[bounce_1s_infinite]" 
                                  style={{ 
                                    height: `${Math.max(20, Math.random() * 100)}%`,
                                    animationDelay: `${i * 0.1}s` 
                                  }}
                                ></div>
                              ))}
                           </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">Recording...</span>
                     </div>
                     <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover"></div>
                  </div>

                   {/* AI Roast */}
                   <div className="flex gap-3">
                     <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                       <Brain size={18} />
                     </div>
                     <div className="rounded-2xl rounded-tl-none bg-indigo-50 border border-indigo-100 p-4 shadow-sm text-sm text-slate-700 leading-relaxed">
                       <p className="font-bold text-indigo-900 mb-1">AI Recruiter</p>
                       <span className="text-indigo-600 font-semibold">Feedback:</span> Good answer, but you said "um" 4 times. Confidence level: 72%. Try again with more conviction.
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- BENTO GRID FEATURES --- */}
        <div className="mt-32">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Why it's better than a mirror.</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px]">
            
            {/* Card 1: Realistic Simulations (Top Left - Large) */}
            <div className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={120} />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                    <Ghost size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Scary Realistic</h3>
                  <p className="mt-2 text-slate-500 max-w-sm">
                    Our AI parses your resume and acts like the specific hiring manager for your role. Tech leads ask code questions; HR asks culture questions.
                  </p>
                </div>
                {/* Visual detail */}
                <div className="mt-6 flex gap-2">
                   <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 border border-slate-200">System Design</span>
                   <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 border border-slate-200">Behavioral</span>
                   <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 border border-slate-200">Salary Negotiation</span>
                </div>
              </div>
            </div>

            {/* Card 2: The Roast (Top Right - Vertical) */}
            <div className="group relative col-span-1 md:row-span-2 overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 shadow-xl text-white transition-transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-green-400 mb-6 border border-white/20">
                   <Terminal size={24} />
                </div>
                <h3 className="text-2xl font-bold">Live Feedback</h3>
                <p className="mt-2 text-slate-400 mb-8">
                  Get instant analysis on your speaking pace, filler words, and answer quality.
                </p>
                
                {/* Fake Terminal */}
                <div className="flex-1 rounded-xl bg-black/50 border border-white/10 p-4 font-mono text-xs text-green-400 overflow-hidden">
                   <p className="mb-2 opacity-50">$ analysis --start</p>
                   <p className="mb-1"><span className="text-white">User:</span> "Umm, I think..."</p>
                   <p className="mb-1 text-red-400">Alert: Filler word detected.</p>
                   <p className="mb-1"><span className="text-white">User:</span> "I am a hard worker."</p>
                   <p className="mb-1 text-yellow-400">Warn: Cliche detected.</p>
                   <p className="mt-2 animate-pulse">_Cursor</p>
                </div>
              </div>
            </div>

            {/* Card 3: Conversation (Bottom Left) */}
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm">
                    <MessageCircle size={24} />
                 </div>
                 <Activity size={24} className="text-purple-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Dynamic Convros</h3>
               <p className="mt-2 text-sm text-slate-600">It listens to context. If you mention Python, it asks about Python.</p>
            </div>

            {/* Card 4: Progress (Bottom Center) */}
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-lg border border-slate-100">
               <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm mb-4">
                  <TrendingUp size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Score Tracking</h3>
               <p className="mt-2 text-sm text-slate-600">Gamify your interview prep. Watch your "Hireability Score" go up.</p>
               {/* Fake chart line */}
               <svg className="absolute bottom-0 left-0 w-full h-16 text-green-100 group-hover:text-green-200 transition-colors" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 20 L 20 15 L 40 18 L 60 5 L 80 8 L 100 0 V 20 H 0" fill="currentColor" />
               </svg>
            </div>

          </div>
        </div>

        {/* --- QUIRKY FOOTER / SOCIAL PROOF --- */}
        <div className="mt-32 pt-10 border-t border-slate-200 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">
            Trusted by Industry Leadering companies and global firms 
          </p>
          
          <div className="relative flex overflow-hidden group">
            <div className="animate-marquee whitespace-nowrap flex gap-16 items-center text-3xl font-black text-slate-300 opacity-50 hover:opacity-100 transition-opacity">
               <span className="cursor-default hover:text-indigo-400 transition-colors">GOOGLE</span>
               <span className="cursor-default hover:text-orange-400 transition-colors">AMAZON</span>
               <span className="cursor-default hover:text-blue-400 transition-colors">META</span>
               <span className="cursor-default hover:text-red-400 transition-colors">NETFLIX</span>
               <span className="cursor-default hover:text-green-400 transition-colors">SPOTIFY</span>
               <span className="cursor-default hover:text-indigo-400 transition-colors">APPLE</span>
               <span className="cursor-default hover:text-orange-400 transition-colors">MICROSOFT</span>
               <span className="cursor-default hover:text-blue-400 transition-colors">TATA</span>
            </div>
          </div>

          <p className="mt-20 text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} VoiceHire AI. <br className="md:hidden"/> Made by Realcoder Softwares
          </p>
        </div>

      </main>
    </div>
  );
}