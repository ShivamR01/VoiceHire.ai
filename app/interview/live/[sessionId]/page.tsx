'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mic, 
  Loader2, 
  StopCircle, 
  CheckCircle2, 
  Volume2, 
  Sparkles,
  X,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base64ToArrayBuffer, pcmToWav } from '@/lib/audioUtils';
import { processUserSpeech, finishInterviewAndGetFeedback } from '@/app/actions/interview';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility, otherwise use standard template literals

type InterviewStatus =
  | 'IDLE'
  | 'AI_SPEAKING'
  | 'USER_LISTENING'
  | 'USER_SPEAKING'
  | 'PROCESSING'
  | 'FINISHED';

export default function LiveInterviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const unwrappedParams = use(params);
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isRecruiterMode = searchParams.get('recruiter') === 'true';

  const router = useRouter();
  const [status, setStatus] = useState<InterviewStatus>('IDLE');
  const [currentTranscript, setCurrentTranscript] = useState<string>('Ready to begin session.');
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    audioPlayerRef.current = new Audio();
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const playAIAudio = async (text: string) => {
    setStatus('AI_SPEAKING');
    setCurrentTranscript(text);
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS Fetch Failed');

      const { audioData, sampleRate } = await response.json();
      
      const pcmData = new Int16Array(base64ToArrayBuffer(audioData));
      const wavBlob = pcmToWav(pcmData, sampleRate);
      const audioUrl = URL.createObjectURL(wavBlob);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.onended = () => {
          setStatus('USER_LISTENING');
        };
        
        await audioPlayerRef.current.play().catch(e => {
            console.warn("Autoplay blocked, waiting for interaction", e);
            setError("Audio autoplay blocked. Please start manually.");
            setStatus('USER_LISTENING'); 
        });
      }
    } catch (err) {
      console.error(err);
      setError('Audio stream failed. Please read the transcript.');
      setStatus('USER_LISTENING');
    }
  };

  const startRecording = async () => {
    setError('');
    
    if (audioPlayerRef.current) {
        audioPlayerRef.current.muted = false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (base64Audio) {
            await processAudio(base64Audio);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setStatus('USER_SPEAKING');
      setCurrentTranscript('Listening...');
    } catch (err) {
      setError('Microphone access denied. Check permissions.');
      setStatus('USER_LISTENING');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        setStatus('PROCESSING');
        mediaRecorderRef.current.stop();
    }
  };
  
  const processAudio = async (audioBase64: string) => {
    try {
      const response = await processUserSpeech(unwrappedParams.sessionId, audioBase64);
      
      if (response.success) {
        if (response.isInterviewOver) {
          setCurrentTranscript("Interview concluded. Analyzing performance...");
          await handleFinishInterview();
        } else if (response.nextQuestionText) {
          await playAIAudio(response.nextQuestionText);
        }
      } else {
        setError((response as any).error || 'Processing error. Please try again.');
        setStatus('USER_LISTENING');
      }
    } catch (err) {
      setError('Connection unstable.');
      setStatus('USER_LISTENING');
    }
  };

  const handleFinishInterview = async () => {
      setStatus('PROCESSING');
      const response = await finishInterviewAndGetFeedback(unwrappedParams.sessionId);
      if (response.success) {
        setStatus('FINISHED');
        setTimeout(() => {
          router.push(`/interview/feedback/${unwrappedParams.sessionId}`);
        }, 2000);
      } else {
        setError('Failed to generate report.');
        setStatus('FINISHED');
      }
  };

  const handleStart = async () => {
      playAIAudio("Hello. I'm your AI interviewer. Let's begin. Please introduce yourself and briefly describe your professional background.");
  };

  return (
    // Use h-[100dvh] for mobile browser support
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-50 font-sans selection:bg-slate-200 selection:text-slate-900">
      
      {/* --- BACKGROUND TEXTURE --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent via-white/50 to-white/80 pointer-events-none"></div>

      {/* --- HEADER (Compact) --- */}
      <div className="relative z-20 flex-none flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
             <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
                <Sparkles size={12} />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-slate-900 hidden sm:inline-block">Interview AI</span>
        </div>
        
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 backdrop-blur-md shadow-sm">
            <div className={cn(
               "h-1.5 w-1.5 rounded-full shadow-sm transition-all duration-500",
               status === 'IDLE' && 'bg-slate-300',
               status === 'AI_SPEAKING' && 'bg-indigo-500 animate-pulse shadow-indigo-200',
               status === 'USER_SPEAKING' && 'bg-amber-500 animate-pulse shadow-amber-200',
               status === 'USER_LISTENING' && 'bg-green-500',
               status === 'PROCESSING' && 'bg-blue-500',
               status === 'FINISHED' && 'bg-emerald-500'
            )}></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{status.replace('_', ' ')}</span>
        </div>
      </div>

      {/* --- MAIN STAGE (Flexible) --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto gap-8 md:gap-12">
         
         {/* 1. Visual Avatar */}
         <div className="relative flex-none">
            {/* Ambient Glow */}
            <div className={cn(
                "absolute -inset-12 rounded-full blur-3xl transition-opacity duration-1000",
                status === 'AI_SPEAKING' ? 'bg-indigo-200/50 opacity-100' : 'opacity-0',
                status === 'USER_SPEAKING' ? 'bg-amber-200/50 opacity-100' : 'opacity-0'
            )}></div>

            {/* Core Circle */}
            <div className={cn(
                "relative h-20 w-20 rounded-full flex items-center justify-center transition-all duration-700",
                status === 'AI_SPEAKING' ? 'scale-110 shadow-xl shadow-indigo-100' : 'scale-100',
                status === 'USER_SPEAKING' ? 'scale-110 shadow-xl shadow-amber-100' : 'scale-100',
                status === 'IDLE' && 'grayscale opacity-80'
            )}>
                 {/* Ripple Ring */}
                 <div className={cn(
                     "absolute inset-0 rounded-full border border-slate-900/5 transition-transform duration-[2s] ease-out",
                     (status === 'AI_SPEAKING' || status === 'USER_SPEAKING') ? 'scale-[1.5] opacity-0' : 'scale-100 opacity-0'
                 )}></div>
                 
                 <div className={cn(
                     "h-16 w-16 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm border",
                     status === 'AI_SPEAKING' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400',
                     status === 'USER_SPEAKING' && 'bg-white border-amber-500 text-amber-600',
                     status === 'USER_LISTENING' && 'bg-white border-green-500 text-green-600'
                 )}>
                      {status === 'AI_SPEAKING' && <Volume2 size={20} className="animate-pulse" />}
                      {status === 'USER_SPEAKING' && <Mic size={20} className="animate-pulse" />}
                      {status === 'USER_LISTENING' && <Mic size={20} />}
                      {status === 'PROCESSING' && <Loader2 size={20} className="animate-spin" />}
                      {status === 'IDLE' && <Sparkles size={20} />}
                      {status === 'FINISHED' && <CheckCircle2 size={20} className="text-emerald-500" />}
                 </div>
            </div>
         </div>

         {/* 2. Transcript & Waveform Container */}
         <div className="flex-1 flex flex-col justify-start items-center w-full space-y-4 md:space-y-6 max-h-[40vh] overflow-y-auto px-4 no-scrollbar">
            
            {/* Waveform */}
            <div className="h-6 flex items-center justify-center gap-1 min-h-[24px]">
                {(status === 'AI_SPEAKING' || status === 'USER_SPEAKING') && (
                    [...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "w-1 rounded-full transition-all duration-300 animate-[music_0.8s_ease-in-out_infinite]",
                                status === 'AI_SPEAKING' ? 'bg-slate-900' : 'bg-amber-500'
                            )}
                            style={{ 
                                animationDelay: `${Math.random() * 0.5}s`,
                                height: '100%' 
                            }}
                        ></div>
                    ))
                )}
            </div>

            {/* Main Text - Adjusted Size */}
            <h2 className={cn(
                "text-center text-xl md:text-2xl font-medium leading-relaxed tracking-tight transition-all duration-500",
                status === 'AI_SPEAKING' ? 'text-slate-900' : 'text-slate-500'
            )}>
               "{currentTranscript}"
            </h2>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">
                {status === 'USER_LISTENING' && 'Listening...'}
                {status === 'PROCESSING' && 'Thinking...'}
                {status === 'AI_SPEAKING' && 'Interviewer Speaking'}
                {status === 'USER_SPEAKING' && 'Recording Answer...'}
            </p>
         </div>
      </div>

      {/* --- FLOATING CONTROL DOCK (Compact) --- */}
      <div className="relative z-20 flex-none pb-8 pt-4 flex justify-center px-4">
         <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-2xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300">
             
             {status === 'IDLE' && (
                <Button onClick={handleStart} className="h-12 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 hover:scale-105 shadow-md">
                   <Play size={16} fill="currentColor" className="mr-2" /> Start Session
                </Button>
             )}

             {status === 'AI_SPEAKING' && (
                <div className="h-12 px-6 flex items-center justify-center text-xs font-semibold text-slate-400 gap-2 cursor-not-allowed">
                    <Loader2 size={14} className="animate-spin text-indigo-500" /> AI Speaking...
                </div>
             )}

             {status === 'USER_LISTENING' && (
                 <Button onClick={startRecording} className="h-12 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 hover:scale-105 shadow-md">
                    <Mic className="mr-2 h-4 w-4" /> Tap to Speak
                 </Button>
             )}

             {status === 'USER_SPEAKING' && (
                 <Button onClick={stopRecording} variant="destructive" className="h-12 rounded-full bg-red-500 px-6 text-sm font-semibold text-white hover:bg-red-600 hover:scale-105 shadow-md shadow-red-500/20">
                    <StopCircle className="mr-2 h-4 w-4 fill-current" /> Finish Answer
                 </Button>
             )}
             
             {status === 'PROCESSING' && (
                <div className="h-12 px-6 flex items-center justify-center text-xs font-semibold text-slate-400 gap-2">
                    <Loader2 size={14} className="animate-spin" /> Processing...
                </div>
             )}

             {status === 'FINISHED' && (
                <div className="h-12 px-6 flex items-center justify-center text-sm font-bold text-emerald-600 gap-2">
                    <CheckCircle2 size={16} /> Session Complete
                </div>
             )}

             {/* Separator */}
             {status !== 'IDLE' && status !== 'FINISHED' && (
                 <div className="h-6 w-px bg-slate-200 mx-1"></div>
             )}

             {/* Close Button */}
             {status !== 'IDLE' && status !== 'FINISHED' && (
                 <Button variant="ghost" size="icon" onClick={handleFinishInterview} className="h-12 w-12 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <X size={18} />
                 </Button>
             )}
         </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-600 border border-red-100 shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
           <X size={12} /> {error}
        </div>
      )}
    </div>
  );
}