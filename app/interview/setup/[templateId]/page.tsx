// File: app/interview/setup/[templateId]/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { startInterview } from '@/app/actions/interview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  Mic, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  AudioWaveform,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';

export default function InterviewSetupPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [micPermission, setMicPermission] = useState<
    'prompt' | 'granted' | 'denied'
  >('prompt');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  // Check for mic permission on load
  useEffect(() => {
    // Check if browser supports permissions API for microphone
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' as any })
        .then((result) => {
          if (result.state === 'granted') {
            setMicPermission('granted');
          } else if (result.state === 'denied') {
            setMicPermission('denied');
          }
        });
    }
  }, []);

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just wanted the permission
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      setError('');
    } catch (err) {
      setMicPermission('denied');
      setError('Voice uplink failed. Please enable microphone access in your browser settings.');
    }
  };

  const handleStart = async () => {
    // 1. Check Mic
    if (micPermission !== 'granted') {
      await requestMicPermission();
      return;
    }

    // 2. Check Session
    if (!(session?.user as any)?.id) {
      setError('Identity verification failed. Please log in again.');
      return;
    }

    setIsStarting(true);
    setError('');

    try {
      const response = await startInterview(
        unwrappedParams.templateId,
        (session?.user as any)?.id || ''
      );

      if (response.success && response.sessionId) {
        // Redirect on Success
        router.push(`/interview/live/${response.sessionId}`);
      } else {
        setError(response.error || 'Initialization error. System could not start the interview.');
        setIsStarting(false);
      }
    } catch (err) {
      console.error("Client Error:", err);
      setError('An unexpected system error occurred.');
      setIsStarting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none"></div>
      <div className="absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg overflow-hidden border-0 shadow-2xl shadow-indigo-500/10 bg-white/80 backdrop-blur-xl ring-1 ring-slate-200">
          
          {/* Header Graphic */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="relative z-10">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner ring-1 ring-white/30">
                   <Cpu size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">System Check</h1>
                <p className="text-indigo-100 font-medium">Calibrating environment for session.</p>
             </div>
          </div>

          <CardContent className="p-8 space-y-8">
            
            {/* Status Indicator Box */}
            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
              micPermission === 'granted' 
                ? 'border-green-100 bg-green-50/50' 
                : micPermission === 'denied'
                ? 'border-red-100 bg-red-50/50'
                : 'border-slate-100 bg-slate-50/50'
            }`}>
              <div className="flex items-start gap-4">
                 <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors ${
                    micPermission === 'granted' ? 'bg-green-100 text-green-600' : 
                    micPermission === 'denied' ? 'bg-red-100 text-red-600' : 
                    'bg-white text-slate-400'
                 }`}>
                    {micPermission === 'granted' ? <CheckCircle2 size={20} /> :
                     micPermission === 'denied' ? <XCircle size={20} /> :
                     <Mic size={20} />}
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-900">
                      {micPermission === 'granted' ? 'Voice Uplink Established' : 
                       micPermission === 'denied' ? 'Uplink Failed' : 
                       'Microphone Access Required'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                       {micPermission === 'granted' ? 'Signal clear. Audio capture is active and ready.' : 
                        micPermission === 'denied' ? 'Access blocked. Check browser permissions.' : 
                        'We need to hear your brilliance to proceed.'}
                    </p>

                    {micPermission === 'granted' && (
                       <div className="mt-4 flex items-center gap-1 h-8">
                          {/* Fake Audio Visualizer Animation */}
                          {[...Array(5)].map((_, i) => (
                             <div 
                               key={i} 
                               className="w-1.5 bg-green-500 rounded-full animate-[bounce_1s_infinite]"
                               style={{ animationDelay: `${i * 0.1}s`, height: '60%' }}
                             ></div>
                          ))}
                          <span className="ml-2 text-xs font-bold text-green-600 uppercase tracking-widest">Live</span>
                       </div>
                    )}

                    {micPermission === 'prompt' && (
                       <Button 
                         onClick={requestMicPermission} 
                         variant="outline" 
                         size="sm" 
                         className="mt-4 border-slate-300 bg-white hover:bg-slate-50 hover:text-indigo-600"
                       >
                          Enable Access
                       </Button>
                    )}
                 </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-100 animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Disclaimer / Secure Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
               <ShieldCheck size={14} />
               <span>Session is private & secure</span>
            </div>

            <Button
              size="lg"
              className="group relative w-full overflow-hidden rounded-xl bg-slate-900 py-6 text-lg font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-indigo-600 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              disabled={micPermission !== 'granted' || isStarting}
              onClick={handleStart}
            >
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Initializing Simulation...
                </>
              ) : (
                <span className="flex items-center gap-2">
                   Initialize Interview <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}