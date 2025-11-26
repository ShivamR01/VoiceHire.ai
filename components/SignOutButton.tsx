// File: components/SignOutButton.tsx
// This is a new Client Component to handle sign out reliably.

'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  text?: string;
}

export default function SignOutButton({ 
  variant = 'outline', 
  size = 'default',
  className,
  text = 'Sign Out'
}: SignOutButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}