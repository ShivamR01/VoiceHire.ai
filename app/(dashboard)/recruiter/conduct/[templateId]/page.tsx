'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { startRecruiterInterview } from '@/app/actions/recruiter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Send, CheckCircle, ArrowLeft, Sparkles, Mail } from 'lucide-react';

export default function ConductInterviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [candidateEmail, setCandidateEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInvite = async () => {
    if (!candidateEmail.trim()) {
      setError('Please enter a candidate email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await startRecruiterInterview(
        unwrappedParams.templateId,
        candidateEmail.trim()
      );

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to schedule interview.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  // --- Styles for animated background blobs ---
  const backgroundStyle = `
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-slate-50">
      <style>{backgroundStyle}</style>
      
      {/* --- Quirky Background Elements --- */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-[-10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-[-10%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {success ? (
        // --- Success View ---
        <Card className="relative z-10 w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-green-100">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-green-500" />
          
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-full border border-green-200">
                <CheckCircle className="h-12 w-12 text-green-600 drop-shadow-sm" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Invitation Sent!</h2>
              <p className="text-gray-500 max-w-xs mx-auto text-base">
                We've queued the interview for <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">{candidateEmail}</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full px-8 pt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/recruiter')} 
                className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                Return Home
              </Button>
              <Button 
                onClick={() => { setSuccess(false); setCandidateEmail(''); }}
                className="flex-1 h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200 transition-all duration-200"
              >
                Invite Another
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // --- Form View ---
        <Card className="relative z-10 w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-black/5">
           {/* Decorative top gradient line */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500" />

          <CardHeader className="pb-2">
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 rotate-3 transition-transform hover:rotate-0 duration-300">
                <Sparkles className="h-8 w-8 text-violet-600 fill-violet-100" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight">
                  Let's Start Hiring
                </CardTitle>
                <CardDescription className="text-slate-500 text-base mt-2">
                  Send a unique interview link to your candidate.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 px-8 pb-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                Candidate's Email Address
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 h-14 rounded-xl border-slate-200 bg-slate-50/50 text-base focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-medium rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-500/30"
                disabled={isLoading}
                onClick={handleInvite}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Crunching Data...
                  </>
                ) : (
                  <>
                    Send Invitation <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="w-full rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                onClick={() => router.push('/recruiter')}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}