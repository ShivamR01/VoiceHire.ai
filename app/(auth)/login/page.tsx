'use client';
// This is a Client Component.
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

// Using standard Lucide icons for that modern feel
import { 
  Loader2, 
  Github, 
  Command, // Using Command icon as a placeholder for a "Google"-like abstract icon if Chrome isn't preferred, or just simple text
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Fingerprint,
  Ghost
} from 'lucide-react';

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      const session = await getSession();
      const role = (session?.user as any)?.role;
      router.refresh();

      if (role === 'RECRUITER') {
        router.push('/recruiter');
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/candidate');
      }
    } else {
      setIsLoading(false);
      setError('Invalid credentials. Did the AI change the locks?');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fafafa] p-4 text-slate-900">
      
      {/* --- BACKGROUND LAYERS (Consistent with Home) --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[100px] animate-pulse"></div>
      <div className="absolute -right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-indigo-300/30 blur-[100px] animate-pulse delay-700"></div>

      {/* --- BACK LINK --- */}
      <div className="absolute top-8 left-8 z-50">
        <Button asChild variant="ghost" className="gap-2 hover:bg-white/50 hover:text-indigo-600 transition-colors">
          <Link href="/">
            <ArrowLeft size={16} /> Back to Reality
          </Link>
        </Button>
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-200/50">
        
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
            <Fingerprint size={24} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access the simulation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Social Logins (Visual only for now) */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="bg-white/50 hover:bg-white hover:border-indigo-200">
                <Command className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline" type="button" className="bg-white/50 hover:bg-white hover:border-indigo-200">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 flex-shrink-0 text-xs text-slate-400 uppercase tracking-widest">Or via email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="human@example.com"
                  className="pl-9 bg-white/50 border-slate-200 focus:bg-white transition-all"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-500">Password</Label>
                <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-9 bg-white/50 border-slate-200 focus:bg-white transition-all"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                Keep me logged in for 30 days
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
                <Ghost size={16} />
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11 shadow-lg shadow-slate-900/20">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-4">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
              Start Free Trial
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      {/* Quirky Footer Text */}
      <div className="absolute bottom-4 text-center text-xs text-slate-400">
        Secure connection established. No robots allowed.
      </div>
    </div>
  );
}