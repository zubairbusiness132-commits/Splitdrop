import React, { useState } from 'react';
import { Mail, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface CoverLetterPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const CoverLetterPromptBuilderTool: React.FC<CoverLetterPromptBuilderToolProps> = ({ onShowToast }) => {
  const [companyName, setCompanyName] = useState<string>('Stripe');
  const [jobTitle, setJobTitle] = useState<string>('Senior Frontend Engineer');
  const [hiringManager, setHiringManager] = useState<string>('Engineering Hiring Team');
  const [applicantBackground, setApplicantBackground] = useState<string>('6+ years building high-performance web applications in React and TypeScript with focus on payment systems and accessibility.');
  const [valueProp, setValueProp] = useState<string>('Reduced page load times by 40% and rebuilt core checkout design system utilized by 200+ developers.');
  const [tone, setTone] = useState<string>('Enthusiastic yet Professional & Executive');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an expert career strategist and executive copywriter.\n\n`;
    prompt += `Write a highly persuasive, customized 3-paragraph Cover Letter for:\n`;
    prompt += `Company: ${companyName}\nTarget Position: ${jobTitle}\nRecipient: ${hiringManager}\n\n`;
    prompt += `[APPLICANT BACKGROUND]\n${applicantBackground}\n\n`;
    prompt += `[UNIQUE VALUE PROPOSITION]\n${valueProp}\n\n`;
    prompt += `[TONE & STYLE]\n${tone}\n\n`;
    prompt += `[COVER LETTER STRUCTURE]\n`;
    prompt += `1. **Opening**: Strong hook explaining genuine interest in ${companyName}'s mission and why I am uniquely qualified.\n`;
    prompt += `2. **Body**: Highlight 2 major career achievements mapped directly to the requirements of the ${jobTitle} position.\n`;
    prompt += `3. **Closing**: Clear call-to-action requesting a quick conversation, professional sign-off.\n\n`;
    prompt += `Make the letter concise (300 words max), engaging, and ready to send.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✉️</span> Cover Letter Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Craft persuasive, professional AI cover letter prompts tailored to target companies & hiring managers.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Target Job & Company
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Company</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Applicant Experience & Strengths</label>
            <textarea
              rows={2}
              value={applicantBackground}
              onChange={e => setApplicantBackground(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Metric / Accomplishment</label>
            <input
              type="text"
              value={valueProp}
              onChange={e => setValueProp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Cover Letter Master Prompt
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
            title="Cover Letter Prompt"
            toolId="cover-letter-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setApplicantBackground(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
