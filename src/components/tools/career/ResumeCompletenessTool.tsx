import React, { useState } from 'react';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { CheckCircle2, Circle, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const ResumeCompletenessTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [resume] = useState<ResumeData>(() => getActiveResume());

  const checks = [
    { label: 'Full Name & Job Title', pass: Boolean(resume.personalInfo.fullName && resume.personalInfo.jobTitle), weight: 15 },
    { label: 'Contact Email & Phone Number', pass: Boolean(resume.personalInfo.email && resume.personalInfo.phone), weight: 15 },
    { label: 'Professional Summary (> 30 words)', pass: Boolean(resume.personalInfo.summary && resume.personalInfo.summary.length > 50), weight: 15 },
    { label: 'At least 1 Work Experience Entry', pass: (resume.experience?.length || 0) > 0, weight: 20 },
    { label: 'At least 1 Education Entry', pass: (resume.education?.length || 0) > 0, weight: 15 },
    { label: 'At least 5 Technical or Domain Skills', pass: (resume.skills?.length || 0) >= 5, weight: 10 },
    { label: 'Portfolio or Professional Link (LinkedIn/GitHub)', pass: Boolean(resume.personalInfo.linkedIn || resume.personalInfo.gitHub || resume.personalInfo.portfolio), weight: 10 }
  ];

  const totalScore = checks.reduce((acc, curr) => acc + (curr.pass ? curr.weight : 0), 0);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Resume Profile Completeness Tracker
          </h3>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{totalScore}% Complete</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${totalScore}%` }}
          />
        </div>

        <div className="space-y-3 pt-2">
          {checks.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                {item.pass ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className={`font-semibold ${item.pass ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </div>

              <span className={`text-[11px] font-bold ${item.pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                +{item.weight}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
