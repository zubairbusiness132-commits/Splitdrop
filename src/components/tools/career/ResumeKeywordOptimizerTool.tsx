import React, { useState } from 'react';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { Search, Sparkles, CheckCircle2, AlertCircle, Copy, FileText } from 'lucide-react';
import { ACTION_VERBS } from '../../../data/resumeTemplatesData';

export const ResumeKeywordOptimizerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [resume] = useState<ResumeData>(() => getActiveResume());
  const [jobDescription, setJobDescription] = useState<string>('');

  const resumeText = [
    resume.personalInfo.fullName,
    resume.personalInfo.jobTitle,
    resume.personalInfo.summary,
    ...resume.experience.map(e => `${e.title} ${e.company} ${e.description}`),
    ...resume.skills.map(s => s.name),
    ...resume.projects.map(p => `${p.title} ${p.description}`)
  ].filter(Boolean).join(' ').toLowerCase();

  // Keyword extraction from Job Description
  const jdWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['with', 'that', 'this', 'from', 'have', 'your', 'will', 'about', 'team', 'work', 'must', 'ability'].includes(w));

  // Word frequency
  const wordCounts: Record<string, number> = {};
  jdWords.forEach(w => {
    wordCounts[w] = (wordCounts[w] || 0) + 1;
  });

  const topJdKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);

  const matchedKeywords = topJdKeywords.filter(kw => resumeText.includes(kw));
  const missingKeywords = topJdKeywords.filter(kw => !resumeText.includes(kw));

  const matchPct = topJdKeywords.length > 0
    ? Math.round((matchedKeywords.length / topJdKeywords.length) * 100)
    : 0;

  // Detect Action Verbs in active resume
  const usedActionVerbs = ACTION_VERBS.filter(verb => resumeText.includes(verb.toLowerCase()));
  const recommendedVerbs = ACTION_VERBS.filter(verb => !resumeText.includes(verb.toLowerCase())).slice(0, 8);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Description Input */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" /> Target Job Description (JD)
            </h3>
            <span className="text-[11px] text-slate-400">{jobDescription.length} chars</span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            placeholder="Paste target job advertisement description here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {jobDescription.length === 0 && (
            <p className="text-xs text-slate-500 italic">
              💡 Tip: Paste a real job post above to see exact keyword match percentages and missing power words.
            </p>
          )}
        </div>

        {/* Comparison Output */}
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Job Keyword Match Rate
            </h3>
            <span className={`text-sm font-black px-3 py-1 rounded-full ${
              matchPct >= 75 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
              matchPct >= 50 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {matchPct}% Match
            </span>
          </div>

          {/* Missing Keywords */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Missing Key Terms ({missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No missing keywords detected.</span>
              ) : (
                missingKeywords.map(kw => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold capitalize"
                  >
                    + {kw}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Matched Keywords */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Successfully Matched Keywords ({matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchedKeywords.map(kw => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold capitalize"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* High Impact Action Verbs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Recommended High-Impact Action Verbs
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {recommendedVerbs.map(verb => (
                <button
                  key={verb}
                  onClick={() => {
                    navigator.clipboard.writeText(verb);
                    onShowToast(`Copied "${verb}" to clipboard!`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium border border-indigo-500/20 flex items-center gap-1 transition-all"
                >
                  <span>{verb}</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
