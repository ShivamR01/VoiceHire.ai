'use client';
// This is a Client Component.
import { useFormStatus } from 'react-dom';
import { signupUser } from '@/app/actions/auth';
import Link from 'next/link';
import { useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  Ghost, 
  Loader2,
  IdCard // Added for the Name field to distinguish from Role
} from 'lucide-react';

// We'll use shadcn/ui components for a premium feel
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form status button with animation
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
    >
      {pending ? (
        <>
           <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing...
        </>
      ) : (
        'Create Account'
      )}
    </Button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(signupUser, initialState);

  useEffect(() => {
    if (state.success) {
      // Small delay to let the user see the success message before redirecting
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fafafa] p-4 text-slate-900">
      
      {/* --- BACKGROUND LAYERS (Consistent with Home & Login) --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-[100px] animate-pulse"></div>
      <div className="absolute -right-[10%] top-[40%] h-[500px] w-[500px] rounded-full bg-indigo-300/30 blur-[100px] animate-pulse delay-700"></div>

      {/* --- BACK LINK --- */}
      <div className="absolute top-8 left-8 z-50">
        <Button asChild variant="ghost" className="gap-2 hover:bg-white/50 hover:text-indigo-600 transition-colors">
          <Link href="/">
            <ArrowLeft size={16} /> Abort Mission
          </Link>
        </Button>
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-pink-200/50">
        
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-sm animate-bounce-slow">
            <Sparkles size={24} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
            Join the Simulation
          </CardTitle>
          <CardDescription className="text-slate-500">
            Select your role to begin your training.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={formAction} className="space-y-6">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">I identify as...</Label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer group relative">
                  <input 
                    type="radio" 
                    name="role" 
                    value="CANDIDATE" 
                    className="peer sr-only" 
                    defaultChecked 
                  />
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-slate-100 bg-white/50 rounded-xl hover:border-indigo-200 hover:bg-white peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:shadow-inner transition-all h-full">
                    <User className="w-8 h-8 mb-2 text-slate-400 peer-checked:text-indigo-600 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 peer-checked:text-indigo-900">Candidate</span>
                    <span className="text-[10px] text-slate-400 text-center leading-tight mt-1">Ready to get roasted</span>
                  </div>
                  {/* Checkmark indicator */}
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </label>

                <label className="cursor-pointer group relative">
                  <input 
                    type="radio" 
                    name="role" 
                    value="RECRUITER" 
                    className="peer sr-only" 
                  />
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-slate-100 bg-white/50 rounded-xl hover:border-pink-200 hover:bg-white peer-checked:border-pink-500 peer-checked:bg-pink-50 peer-checked:shadow-inner transition-all h-full">
                    <Briefcase className="w-8 h-8 mb-2 text-slate-400 peer-checked:text-pink-600 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 peer-checked:text-pink-900">Recruiter</span>
                     <span className="text-[10px] text-slate-400 text-center leading-tight mt-1">Looking for talent</span>
                  </div>
                   {/* Checkmark indicator */}
                   <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </label>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Full Name</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-9 bg-white/50 border-slate-200 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="human@example.com"
                  className="pl-9 bg-white/50 border-slate-200 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-500">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  className="pl-9 bg-white/50 border-slate-200 focus:bg-white transition-all"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">Must be at least 8 characters</p>
            </div>

            {/* Messages */}
            {!state.success && state.message && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 border border-red-100">
                <Ghost size={16} />
                {state.message}
              </div>
            )}
             {state.success && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600 animate-in fade-in slide-in-from-top-1 border border-green-100">
                <Sparkles size={16} />
                {state.message || "Account created! Redirecting..."}
              </div>
            )}

            <SubmitButton />
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-4">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Footer Text */}
      <div className="absolute bottom-4 text-center text-xs text-slate-400">
        By joining, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms</span> of mostly harmless data usage.
      </div>
    </div>
  );
}