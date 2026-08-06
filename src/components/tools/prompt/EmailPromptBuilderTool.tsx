import React, { useState } from 'react';
import { Mail, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface EmailPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const EmailPromptBuilderTool: React.FC<EmailPromptBuilderToolProps> = ({ onShowToast }) => {
  const [emailCategory, setEmailCategory] = useState<string>('Cold Outreach');
  const [recipientRole, setRecipientRole] = useState<string>('VP of Marketing at mid-market B2B companies');
  const [goal, setGoal] = useState<string>('Book a 15-minute introductory call to demonstrate our AI automation platform');
  const [valueProposition, setValueProposition] = useState<string>('Cut lead qualification time by 75% with automated workflow routing');
  const [tone, setTone] = useState<string>('Polite, Direct, High-Value & Low-Pressure');
  const [cta, setCta] = useState<string>('Are you open to a quick 10-minute chat this Thursday at 2 PM?');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an expert corporate communication specialist and sales copywriter.\n\n`;
    prompt += `[EMAIL TYPE & PURPOSE]\nCategory: ${emailCategory}\nRecipient: ${recipientRole}\nPrimary Goal: ${goal}\n\n`;
    prompt += `[CORE VALUE PROPOSITION]\n${valueProposition}\n\n`;
    prompt += `[TONE & STYLE]\n${tone}\n\n`;
    prompt += `[CALL TO ACTION]\n${cta}\n\n`;
    prompt += `[EMAIL STRUCTURE REQUIREMENT]\n`;
    prompt += `1. Provide 3 punchy, high-open-rate Subject Lines.\n`;
    prompt += `2. Write a concise email body under 120 words that gets straight to the point.\n`;
    prompt += `3. End with a clear, low-friction single question call to action.\n\n`;
    prompt += `Draft the complete email template ready for sending.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📧</span> Email Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate AI prompts for business emails, cold outreach, customer support, job offers & marketing.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Email Objective & Category
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['Business', 'Job', 'Support', 'Marketing', 'Professional', 'Cold Outreach', 'Follow-up'].map(c => (
              <button
                key={c}
                onClick={() => setEmailCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  emailCategory === c
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recipient Role / Persona</label>
            <input
              type="text"
              value={recipientRole}
              onChange={e => setRecipientRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Goal / Objective</label>
            <textarea
              rows={2}
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Call to Action (CTA)</label>
            <input
              type="text"
              value={cta}
              onChange={e => setCta(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Email Master Prompt
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
            title="Email Prompt"
            toolId="email-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setGoal(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
