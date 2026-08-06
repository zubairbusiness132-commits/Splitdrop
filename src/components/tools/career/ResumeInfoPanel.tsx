import React from 'react';
import { ResumeData } from '../../../types/resume';
import { FileText, Layers, HardDrive, Calendar, Layout, CheckCircle2 } from 'lucide-react';

interface ResumeInfoPanelProps {
  resumeData: ResumeData;
  className?: string;
}

export const ResumeInfoPanel: React.FC<ResumeInfoPanelProps> = ({ resumeData, className = '' }) => {
  // Estimate content density / pages
  const totalItems = 
    (resumeData.experience?.length || 0) + 
    (resumeData.education?.length || 0) + 
    (resumeData.projects?.length || 0) + 
    (resumeData.skills?.length || 0) + 
    (resumeData.certifications?.length || 0);

  const estimatedPages = totalItems > 12 ? 2 : 1;
  const rawJsonLength = JSON.stringify(resumeData).length;
  const estimatedPdfKb = Math.round(150 + rawJsonLength * 0.15);
  const formattedDate = new Date(resumeData.updatedAt || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-50/30 dark:bg-slate-800/40 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white">
            {resumeData.name || 'Untitled Resume'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5" title="Estimated Page Count">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'}</span>
          </span>

          <span className="flex items-center gap-1.5" title="Estimated Export PDF File Size">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>~{estimatedPdfKb} KB</span>
          </span>

          <span className="flex items-center gap-1.5" title="Last Saved Timestamp">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </span>

          <span className="flex items-center gap-1.5 capitalize" title="Current Template Theme">
            <Layout className="w-3.5 h-3.5 text-slate-400" />
            <span>{resumeData.styling?.templateStyle || 'Modern'}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> ATS Ready
          </span>
        </div>
      </div>
    </div>
  );
};
