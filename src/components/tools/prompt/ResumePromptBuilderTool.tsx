import React, { useState } from 'react';
import { FileText, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface ResumePromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ResumePromptBuilderTool: React.FC<ResumePromptBuilderToolProps> = ({ onShowToast }) => {
  const [targetRole, setTargetRole] = useState<string>('Senior Product Manager');
  const [industry, setIndustry] = useState<string>('B2B SaaS / FinTech');
  const [experienceLevel, setExperienceLevel] = useState<string>('Mid-Senior Level (5-8 Years)');
  const [keySkills, setKeySkills] = useState<string>('Agile, Product Roadmap, SQL, User Research, AB Testing, Go-To-Market Strategy');
  const [rawDetails, setRawDetails] = useState<string>('Led cross-functional team of 10 engineers, launched payment API, reduced checkout churn by 18%, managed $2M budget.');
  const [sectionFocus, setSectionFocus] = useState<string>('Work Experience Accomplishment Bullets');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an elite Executive Career Coach and Silicon Valley Resume Specialist.\n\n`;
    prompt += `[JOB TARGET & INDUSTRY]\nTarget Job Title: ${targetRole}\nIndustry Focus: ${industry}\nExperience Level: ${experienceLevel}\n\n`;
    prompt += `[KEY SKILLS TO HIGHLIGHT]\n${keySkills}\n\n`;
    prompt += `[RAW EXPERIENCE & DUTIES TO REWRITE]\n"${rawDetails}"\n\n`;
    prompt += `[SECTION FOCUS]\nTarget Section: ${sectionFocus}\n\n`;
    prompt += `[ATS & RESUME OPTIMIZATION RULES]\n`;
    prompt += `1. Format every accomplishment using Google's XYZ metric formula: "Accomplished [X] as measured by [Y], by doing [Z]".\n`;
    prompt += `2. Start every bullet with high-impact action verbs (e.g., Engineered, Spearheaded, Accelerated, Orchestrated).\n`;
    prompt += `3. Seamlessly incorporate target keywords naturally without keyword-stuffing.\n`;
    prompt += `4. Ensure 100% ATS parser compatibility (no complex columns, standard headers, clear metrics).\n\n`;
    prompt += `Please generate 5 high-impact, tailored bullet points ready for my resume.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📄</span> Resume Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate ATS-friendly AI resume writing & job tailoring prompts using accomplishment metrics.
          </p>
        </div>

        <button
          onClick={() => setIsLibraryOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" /> Ready-Made Templates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-500" /> Career Profile Setup
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Industry</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Technical & Soft Skills</label>
            <input
              type="text"
              value={keySkills}
              onChange={e => setKeySkills(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw Responsibilities & Unformatted Notes</label>
            <textarea
              rows={3}
              value={rawDetails}
              onChange={e => setRawDetails(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> ATS Resume Master Prompt
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {finalPrompt.length} chars
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto border border-slate-800 select-all">
              {finalPrompt}
            </div>
          </div>

          <PromptExportActions
            promptText={finalPrompt}
            title="Resume Prompt"
            toolId="resume-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setRawDetails(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
