// File: app/dashboard/(recruiter)/create/page.tsx
'use client';

import { useState, useTransition, useActionState, useEffect } from 'react';
import { createInterviewFromJD } from '@/app/actions/recruiter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  AlertCircle, 
  Wand2, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  FileText, 
  CheckCircle2,
  Zap 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Quirky loading messages
const LOADING_MESSAGES = [
  "Teaching the AI how to interview...",
  "Parsing corporate jargon...",
  "Summoning the hiring spirits...",
  "Generating tough questions...",
  "Polishing the pixels...",
];

const SAMPLE_JD = `We are looking for a Senior React Engineer to join our starship. 
Must have experience with Next.js, Tailwind CSS, and TypeScript. 
Responsibilities include building warp-speed UIs and fighting bugs in deep space.
Bonus points if you know how to center a div without Googling it.`;

export default function CreateInterviewPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialState = { success: false, message: '', templateId: null };
  const [state, formAction] = useActionState(createInterviewFromJD, initialState);

  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('jobDescription', jobDescription);
      formAction(formData);
    });
  };

  // Auto-fill for testing
  const fillSample = () => {
    setTitle("Senior Starship Engineer");
    setJobDescription(SAMPLE_JD);
  };

  // Redirect on success
  if (state.success && state.templateId) {
    setTimeout(() => {
      router.push('/recruiter');
    }, 1500);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none"></div>
      <div className="absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* --- LEFT COLUMN: INFO & QUIRKS --- */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/60 px-4 py-1.5 text-sm font-bold text-blue-600 backdrop-blur-md shadow-sm">
               <Sparkles size={16} /> AI-Powered Generator
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Let's build a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Better Interview.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Don't waste hours writing questions. Just paste the Job Description, and our AI recruiter will generate a structured, role-specific interview script in seconds.
            </p>

            <div className="hidden lg:block pt-8">
               <div className="relative rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 transform rotate-[-2deg] max-w-sm mx-auto lg:mx-0">
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg transform rotate-12">
                     PRO TIP
                  </div>
                  <div className="flex gap-4">
                     <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Bot size={20} />
                     </div>
                     <div className="text-sm text-slate-600">
                        <p className="font-bold text-slate-900 mb-1">AI Says:</p>
                        "The more specific your Job Description, the sharper my questions will be. No pressure."
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE FORM --- */}
          <div className="lg:col-span-7">
            <Card className="relative overflow-hidden border-0 shadow-2xl shadow-blue-900/10 bg-white/80 backdrop-blur-xl ring-1 ring-slate-200">
              {isPending && (
                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-8 text-center animate-in fade-in duration-300">
                    <div className="relative mb-6">
                       <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Bot size={24} className="text-blue-600 animate-bounce" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Generating Magic...</h3>
                    <p className="text-slate-500 font-medium animate-pulse">{LOADING_MESSAGES[loadingMsgIndex]}</p>
                 </div>
              )}
              
              {state.success && (
                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-8 text-center animate-in zoom-in duration-300">
                    <div className="mb-4 h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                       <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Success!</h3>
                    <p className="text-slate-600 mb-6">Your interview template is ready for launch.</p>
                    <div className="h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                    </div>
                 </div>
              )}

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Header inside card */}
                  <div className="flex items-center justify-between mb-2">
                     <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Wand2 className="text-indigo-500" size={24} /> Configuration
                     </h2>
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={fillSample}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                     >
                        <Zap size={14} className="mr-1" /> Auto-fill Sample
                     </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-slate-500">Role Title</Label>
                    <div className="relative">
                       <Input
                         id="title"
                         name="title"
                         placeholder="e.g. Senior Backend Engineer"
                         required
                         value={title}
                         onChange={(e) => setTitle(e.target.value)}
                         className="h-12 border-slate-200 bg-slate-50/50 pl-11 text-lg font-medium focus:bg-white focus:ring-blue-500 transition-all"
                       />
                       <div className="absolute left-3 top-3 text-slate-400">
                          <Bot size={20} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <Label htmlFor="jobDescription" className="text-sm font-bold uppercase tracking-wider text-slate-500">Job Description</Label>
                       <span className={`text-xs font-bold ${jobDescription.length > 500 ? 'text-green-600' : 'text-slate-400'}`}>
                          {jobDescription.length} chars
                       </span>
                    </div>
                    <div className="relative">
                       <Textarea
                         id="jobDescription"
                         name="jobDescription"
                         placeholder="Paste the full job description here. The more details, the better the interview..."
                         required
                         value={jobDescription}
                         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                         className="min-h-[200px] resize-y border-slate-200 bg-slate-50/50 p-4 text-base leading-relaxed focus:bg-white focus:ring-blue-500 transition-all"
                       />
                       <div className="absolute right-3 bottom-3 text-slate-300 pointer-events-none">
                          <FileText size={20} />
                       </div>
                    </div>
                    <p className="text-xs text-slate-400 italic">
                       * Tip: Include tech stack, seniority level, and key responsibilities.
                    </p>
                  </div>

                  {state.message && !state.success && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100 animate-in shake">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="font-medium text-sm">{state.message}</p>
                    </div>
                  )}

                  <div className="pt-2">
                     <Button
                       type="submit"
                       disabled={isPending || state.success}
                       className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-6 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:scale-[1.02] hover:shadow-blue-500/40 disabled:opacity-70 disabled:hover:scale-100"
                     >
                       <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                          Generate Interview Agent
                          <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                       </span>
                       {/* Shine effect */}
                       <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                     </Button>
                     <p className="mt-4 text-center text-xs font-medium text-slate-400">
                        Takes approximately 10-15 seconds. Don't close the tab.
                     </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}