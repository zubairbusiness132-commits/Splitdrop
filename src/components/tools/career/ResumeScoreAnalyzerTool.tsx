import React, { useState } from 'react';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Palette, 
  FileText, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

interface ResumeScoreAnalyzerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const ResumeScoreAnalyzerTool: React.FC<ResumeScoreAnalyzerToolProps> = ({ onShowToast }) => {
  const [resume] = useState<ResumeData>(() => getActiveResume());

  // Calculations
  const hasPhoto = Boolean(resume.personalInfo.photoUrl);
  const hasLinks = Boolean(resume.personalInfo.linkedIn || resume.personalInfo.gitHub || resume.personalInfo.portfolio || resume.personalInfo.website);
  const summaryLength = resume.personalInfo.summary?.length || 0;
  
  const expCount = resume.experience?.length || 0;
  const eduCount = resume.education?.length || 0;
  const skillCount = resume.skills?.length || 0;
  const certCount = resume.certifications?.length || 0;
  const projectCount = resume.projects?.length || 0;

  // Completion calculation
  let totalFields = 8;
  let filledFields = 0;
  if (resume.personalInfo.fullName) filledFields++;
  if (resume.personalInfo.email && resume.personalInfo.phone) filledFields++;
  if (summaryLength > 30) filledFields++;
  if (expCount > 0) filledFields++;
  if (eduCount > 0) filledFields++;
  if (skillCount >= 3) filledFields++;
  if (hasLinks) filledFields++;
  if (projectCount > 0 || certCount > 0) filledFields++;

  const completionPct = Math.round((filledFields / totalFields) * 100);

  // Scores
  const designScore = Math.min(98, 70 + (resume.styling?.templateStyle ? 15 : 5) + (resume.styling?.primaryColor ? 10 : 0));
  const contentScore = Math.min(100, (expCount >= 2 ? 30 : expCount * 15) + (summaryLength > 50 ? 25 : 10) + (skillCount >= 5 ? 25 : skillCount * 4) + (eduCount >= 1 ? 20 : 0));
  const atsScore = Math.min(100, 60 + (filledFields * 5));
  const keywordScore = Math.min(95, 50 + (skillCount * 4) + (projectCount * 5));
  const professionalismScore = Math.min(100, (hasLinks ? 25 : 10) + (summaryLength > 40 ? 25 : 10) + (expCount > 0 ? 25 : 0) + (resume.personalInfo.email ? 25 : 0));
  const readabilityScore = Math.min(96, 75 + (resume.styling?.fontSize === 'medium' ? 15 : 10));

  const overallScore = Math.round((designScore + contentScore + atsScore + keywordScore + professionalismScore + readabilityScore) / 6);

  const suggestions: string[] = [];
  if (summaryLength < 50) suggestions.push('Expand your professional summary to 3-4 sentences highlighting key career achievements.');
  if (skillCount < 6) suggestions.push('Add at least 6 technical & domain skills to improve automated resume matching.');
  if (!hasLinks) suggestions.push('Include a LinkedIn profile link or GitHub/Portfolio URL to demonstrate proof of work.');
  if (expCount < 2) suggestions.push('Detail at least 2 relevant work experience items with quantifiable result metrics.');
  if (certCount === 0) suggestions.push('Add industry certifications to validate your domain expertise.');

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      {/* Main Overall Meter */}
      <div className="glass-card p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Overall Resume Health Score
          </span>
          <div className="text-5xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
            {overallScore} <span className="text-lg font-bold text-slate-400">/ 100</span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            {overallScore >= 85 ? '🌟 Excellent Grade' : overallScore >= 70 ? '👍 Good Quality' : '⚠️ Needs Improvement'}
          </span>
        </div>

        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Profile Completion Rate</span>
            <span>{completionPct}% Complete</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A 100% complete profile significantly improves recruiter outreach response rates.
          </p>
        </div>
      </div>

      {/* 6 Dimension Score Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScoreCard icon={<Palette className="w-4 h-4 text-purple-500" />} label="Design & Styling" score={designScore} desc="Typography contrast & layout spacing" />
        <ScoreCard icon={<FileText className="w-4 h-4 text-blue-500" />} label="Content Quality" score={contentScore} desc="Experience depth & summary clarity" />
        <ScoreCard icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} label="ATS Compliance" score={atsScore} desc="Parser readability & text formatting" />
        <ScoreCard icon={<BarChart3 className="w-4 h-4 text-amber-500" />} label="Keyword Density" score={keywordScore} desc="Industry skill terms & action verbs" />
        <ScoreCard icon={<Award className="w-4 h-4 text-rose-500" />} label="Professionalism" score={professionalismScore} desc="Contact accuracy & link presence" />
        <ScoreCard icon={<TrendingUp className="w-4 h-4 text-teal-500" />} label="Readability Index" score={readabilityScore} desc="Skimmability & line spacing" />
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Actionable Recommendations
        </h3>
        {suggestions.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium p-3 bg-emerald-500/10 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            Your resume passes all major optimization benchmarks! You are ready to apply.
          </div>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ScoreCard: React.FC<{ icon: React.ReactNode; label: string; score: number; desc: string }> = ({ icon, label, score, desc }) => (
  <div className="glass-card p-4 rounded-2xl space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{score}%</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
    <p className="text-[11px] text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);
