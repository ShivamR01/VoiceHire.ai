'use client';

import { ArrowRight } from 'lucide-react';

export default function RecruiterDashboardButton() {
  return (
    <a
      href="/recruiter"
      className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-all duration-300"
    >
      Go to Recruiter Dashboard
      <ArrowRight className="h-5 w-5" />
    </a>
  );
}
