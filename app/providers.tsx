// File: app/providers.tsx
'use client';
// This is a client-side component, necessary for SessionProvider
import { SessionProvider } from 'next-auth/react';
import React from 'react';

// This wrapper component is required to use useSession() in client components
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}