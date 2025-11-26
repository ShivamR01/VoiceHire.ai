// File: app/dashboard/page.tsx
// Route dispatcher that redirects users to their role-specific dashboard

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return redirect('/login');
  }

  const role = (user as any).role || 'CANDIDATE';

  // Route to appropriate dashboard based on role
  if (role === 'RECRUITER') {
    return redirect('/recruiter');
  } else if (role === 'ADMIN') {
    return redirect('/admin');
  } else {
    return redirect('/candidate');
  }
}