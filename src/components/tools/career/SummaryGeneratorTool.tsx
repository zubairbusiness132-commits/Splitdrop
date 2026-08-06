import React, { useState } from 'react';
import { SUMMARY_PRESETS } from '../../../data/careerData';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

export const SummaryGeneratorTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [role, setRole] = useState<string>('Software Engineer');
  const [yearsExp, setYearsExp] = useState<number>(5);
  const [coreSkills, setCoreSkills] = useState<string>('React, TypeScript, Node.js, System Architecture');
  const [metricAchievement, setMetricAchievement] = useState<string>('reducing API latencies by 40% and leading cross-functional engineering teams');

  // Generated Presets
  const impactSummary = `Results-driven ${role} with ${yearsExp}+ years of proven experience in ${coreSkills}. Recognized for ${metricAchievement}. Adept at partnering with executive stakeholders to translate high-level business goals into robust technical deliverables.`;
  const techSummary = `Detail-oriented ${role} offering ${yearsExp}+ years of hands-on expertise building scalable architectures using ${coreSkills}. Track record of ${metricAchievement} while maintaining strict code quality and unit test coverage standards.`;
  const executiveSummary = `Senior ${role} with ${yearsExp}+ years of progressive leadership driving digital transformation and technical execution. Specialized in ${coreSkills}, with a record of ${metricAchievement}.`;

  const handleApplySummary = (text: string) => {
    const current = getActiveResume();
    const updated = {
      ...current,
      personalInfo: {
        ...current.personalInfo,
        summary: text
      }
    };
    saveActiveResume(updated);
    onShowToast('Applied summary to active resume!');
    if (onNavigate) {
      onNavigate('/resume-builder.html');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" /> Professional Summary Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Generate structured, high-impact executive summaries locally using battle-tested professional formula templates.
        </p>
      </div>

      {/* Form Inputs */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Enter Your Career Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Target Job Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Years of Work Experience</label>
            <input
              type="number"
              value={yearsExp}
              onChange={(e) => setYearsExp(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Core Technical / Professional Skills</label>
            <input
              type="text"
              value={coreSkills}
              onChange={(e) => setCoreSkills(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Key Measurable Achievement / Metric</label>
            <input
              type="text"
              value={metricAchievement}
              onChange={(e) => setMetricAchievement(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Generated Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Results & Impact Tone" text={impactSummary} onApply={() => handleApplySummary(impactSummary)} />
        <SummaryCard title="Technical & Precision Tone" text={techSummary} onApply={() => handleApplySummary(techSummary)} />
        <SummaryCard title="Executive Leadership Tone" text={executiveSummary} onApply={() => handleApplySummary(executiveSummary)} />
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; text: string; onApply: () => void }> = ({ title, text, onApply }) => (
  <div className="glass-card p-5 rounded-3xl flex flex-col justify-between space-y-4">
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{title}</h4>
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
        "{text}"
      </p>
    </div>

    <button
      onClick={onApply}
      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
    >
      <span>Insert Into Resume</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
);
