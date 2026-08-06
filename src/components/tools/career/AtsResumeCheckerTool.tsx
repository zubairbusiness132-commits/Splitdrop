import React, { useState, useEffect } from 'react';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  FileText, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award,
  Sparkles
} from 'lucide-react';

interface AtsResumeCheckerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const AtsResumeCheckerTool: React.FC<AtsResumeCheckerToolProps> = ({ onShowToast }) => {
  const [resume, setResume] = useState<ResumeData>(() => getActiveResume());
  const [pastedText, setPastedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'current' | 'custom'>('current');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');

  useEffect(() => {
    setResume(getActiveResume());
  }, []);

  // Compute text content to analyze
  const textToScan = activeTab === 'custom' && pastedText.trim().length > 0
    ? pastedText
    : [
        resume.personalInfo.fullName,
        resume.personalInfo.jobTitle,
        resume.personalInfo.email,
        resume.personalInfo.phone,
        resume.personalInfo.address,
        resume.personalInfo.summary,
        ...resume.experience.map(e => `${e.title} ${e.company} ${e.description}`),
        ...resume.education.map(e => `${e.degree} ${e.institution} ${e.description}`),
        ...resume.skills.map(s => s.name),
        ...resume.projects.map(p => `${p.title} ${p.description}`)
      ].filter(Boolean).join(' ');

  // Analysis Logic
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(textToScan) || Boolean(resume.personalInfo.email);
  const hasPhone = /[\d\+\-\(\)\s]{7,}/.test(textToScan) || Boolean(resume.personalInfo.phone);
  const hasLocation = textToScan.length > 50 && (Boolean(resume.personalInfo.address) || /city|state|zip|country/i.test(textToScan));
  const hasSummary = (resume.personalInfo.summary && resume.personalInfo.summary.length > 30) || textToScan.length > 200;
  
  const skillCount = activeTab === 'current' ? resume.skills.length : (textToScan.match(/javascript|react|python|java|sql|node|git|agile|leadership|project/gi) || []).length;
  const expCount = activeTab === 'current' ? resume.experience.length : (textToScan.match(/experience|worked|developed|managed|led/gi) || []).length;
  const eduCount = activeTab === 'current' ? resume.education.length : (textToScan.match(/bachelor|master|university|degree|college/gi) || []).length;

  const wordCount = textToScan.split(/\s+/).filter(Boolean).length;
  const readabilityScore = Math.min(98, Math.max(40, Math.round(100 - Math.abs(450 - wordCount) * 0.1)));

  // ATS Score calculation
  let score = 0;
  if (hasEmail) score += 15;
  if (hasPhone) score += 15;
  if (hasSummary) score += 15;
  if (skillCount >= 5) score += 20; else score += skillCount * 3;
  if (expCount >= 2) score += 20; else score += expCount * 10;
  if (eduCount >= 1) score += 15;

  score = Math.min(100, score);

  // Common ATS expected keywords
  const COMMON_KEYWORDS = ['Leadership', 'Project Management', 'Agile', 'Cross-functional', 'Optimization', 'Strategy', 'Analytics', 'Problem Solving', 'Collaboration', 'Documentation'];
  const missingKeywords = COMMON_KEYWORDS.filter(kw => !textToScan.toLowerCase().includes(kw.toLowerCase()));

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'current'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Scan Active Resume
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste Plain Text
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Target Role:</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            placeholder="e.g. Software Engineer"
          />
        </div>
      </div>

      {activeTab === 'custom' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Paste Resume Plain Text to Analyze:
          </label>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={6}
            placeholder="Paste your full resume text here to run an instant ATS scan..."
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gauge / Score Box */}
        <div className="glass-card p-6 rounded-3xl text-center flex flex-col items-center justify-center space-y-3 md:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            ATS Scanner Score
          </span>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{score}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            score >= 80 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            score >= 60 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
            'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {score >= 80 ? 'High ATS Compatibility' : score >= 60 ? 'Moderate ATS Readiness' : 'Needs Optimization'}
          </span>
        </div>

        {/* Breakdown checks */}
        <div className="glass-card p-6 rounded-3xl space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" /> ATS Compliance Checklist
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Contact Email & Phone</span>
              </div>
              {hasEmail && hasPhone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Professional Summary</span>
              </div>
              {hasSummary ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Work Experience Items</span>
              </div>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{expCount} items</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Education Details</span>
              </div>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{eduCount} listed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Technical Skills Count</span>
              </div>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{skillCount} skills</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Readability Score</span>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{readabilityScore} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Keywords Box */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" /> Target Industry Keywords Scan ({missingKeywords.length} missing)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ATS algorithms scan for industry standard power terms. Adding these naturally into your experience bullet points boosts your score.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {COMMON_KEYWORDS.map((kw) => {
            const isPresent = textToScan.toLowerCase().includes(kw.toLowerCase());
            return (
              <span
                key={kw}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isPresent
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                {isPresent ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
                {kw}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
