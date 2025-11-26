'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { publishTemplate, deleteTemplate } from '@/app/actions/recruiter';
import { Clock, Eye, EyeOff, Trash2, PhoneCall, AlertCircle, Check, BarChart2, FileText } from 'lucide-react';
import { IInterviewTemplate } from '@/models/InterviewTemplateModel';

interface RecruiterTemplateCardProps {
  template: IInterviewTemplate;
}

export default function RecruiterTemplateCard({ template }: RecruiterTemplateCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPublic, setIsPublic] = useState(template.isPublic);

  const handlePublish = () => {
    startTransition(async () => {
      try {
        const result = await publishTemplate((template as any)._id.toString());
        if (result.success) {
          setIsPublic(!isPublic);
          setPublishStatus('success');
          setTimeout(() => setPublishStatus('idle'), 2000);
        } else {
          setPublishStatus('error');
          setTimeout(() => setPublishStatus('idle'), 2000);
        }
      } catch (error) {
        setPublishStatus('error');
        setTimeout(() => setPublishStatus('idle'), 2000);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteTemplate((template as any)._id.toString());
        if (result.success) {
          setDeleteStatus('success');
          setTimeout(() => {
            router.refresh();
          }, 500);
        } else {
          setDeleteStatus('error');
          setTimeout(() => setDeleteStatus('idle'), 2000);
        }
      } catch (error) {
        setDeleteStatus('error');
        setTimeout(() => setDeleteStatus('idle'), 2000);
      }
    });
  };

  return (
    <Card className="bg-white border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex flex-col overflow-hidden h-full group">
      <CardHeader className="pb-3 bg-slate-50/50 border-b-2 border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* LINK TO DETAILED PAGE */}
            <Link href={`/recruiter/interview/${(template as any)._id.toString()}`} className="block">
                <CardTitle className="text-xl font-black text-slate-900 truncate cursor-pointer group-hover:text-indigo-600 transition-colors">
                {template.title}
                </CardTitle>
            </Link>
            
            <CardDescription className="flex items-center text-slate-500 font-bold text-xs mt-2 uppercase tracking-wide">
              <Clock className="h-3 w-3 mr-1.5" />
              {new Date((template as any).createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </CardDescription>
          </div>
          <div
            className={`px-3 py-1 rounded-lg border-2 font-bold text-[10px] uppercase tracking-wider transition-colors ${
              isPublic
                ? 'bg-emerald-100 border-emerald-600 text-emerald-800'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            {isPublic ? 'Public' : 'Private'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6 pt-6 relative">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-100 rounded-md border-2 border-indigo-200 text-indigo-600">
                <FileText className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Questions ({template.questions?.length || 0})</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
            <ul className="text-sm text-slate-600 space-y-2.5">
              {template.questions?.slice(0, 2).map((question, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="font-black text-indigo-500 text-xs mt-0.5">{idx + 1}</span>
                  <span className="line-clamp-2 font-medium leading-relaxed">{question}</span>
                </li>
              ))}
              {(template.questions?.length || 0) > 2 && (
                <li className="text-slate-400 text-xs font-bold italic pl-6">+{(template.questions?.length || 0) - 2} more questions</li>
              )}
            </ul>
          </div>
        </div>

        {showDeleteConfirm ? (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl animate-in fade-in zoom-in duration-200 absolute bottom-6 left-6 right-6 z-20 shadow-lg">
            <p className="text-sm text-red-900 font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Really delete this?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-2 border-red-900 shadow-[2px_2px_0px_0px_rgba(127,29,29,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? '...' : 'Yes, Delete'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isPending}
                className="flex-1 bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-auto">
            
            {/* Primary Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Link href={`/recruiter/interview/${(template as any)._id.toString()}`} className="w-full">
                    <Button 
                        variant="outline"
                        className="w-full h-10 bg-white border-2 border-slate-900 text-slate-900 font-bold shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all rounded-xl"
                    >
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Stats
                    </Button>
                </Link>

                <Link href={`/recruiter/conduct/${(template as any)._id.toString()}`} className="w-full">
                    <Button 
                        className="w-full h-10 bg-indigo-600 border-2 border-slate-900 text-white font-bold shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-indigo-700 transition-all rounded-xl"
                    >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Invite
                    </Button>
                </Link>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2 pt-2 border-t-2 border-slate-100">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    onClick={handlePublish}
                    disabled={isPending}
                >
                    {isPublic ? (
                        <span className="flex items-center"><EyeOff className="h-3 w-3 mr-1.5" /> Hide</span>
                    ) : (
                        <span className="flex items-center"><Eye className="h-3 w-3 mr-1.5" /> Publish</span>
                    )}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isPending}
                >
                    <Trash2 className="h-3 w-3 mr-1.5" /> Delete
                </Button>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        {publishStatus === 'success' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-100 border-2 border-emerald-600 text-emerald-800 px-3 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in font-bold text-xs z-10 pointer-events-none">
            <Check className="h-3 w-3" /> Updated
          </div>
        )}
        {publishStatus === 'error' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-100 border-2 border-red-600 text-red-800 px-3 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in font-bold text-xs z-10 pointer-events-none">
            <AlertCircle className="h-3 w-3" /> Failed
          </div>
        )}
      </CardContent>
    </Card>
  );
}