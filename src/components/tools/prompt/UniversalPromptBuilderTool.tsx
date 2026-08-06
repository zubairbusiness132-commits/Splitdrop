import React, { useState } from 'react';
import { Globe, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface UniversalPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const UniversalPromptBuilderTool: React.FC<UniversalPromptBuilderToolProps> = ({ onShowToast }) => {
  const [role, setRole] = useState<string>('Senior Subject Matter Expert & Strategic Consultant');
  const [goal, setGoal] = useState<string>('Create an actionable operational roadmap for scaling team productivity');
  const [context, setContext] = useState<string>('Remote-first technology team expanding from 15 to 50 employees across multiple timezones');
  const [requirements, setRequirements] = useState<string>('1. Clear communication protocols\n2. Tooling recommendations\n3. Key performance indicator framework');
  const [constraints, setConstraints] = useState<string>('No expensive enterprise software contracts, keep implementation under 30 days');
  const [outputFormat, setOutputFormat] = useState<string>('Executive Summary, Phase-by-Phase Timeline Table, and Action Item Checklist');
  const [tone, setTone] = useState<string>('Professional, Direct, Pragmatic & Encouraging');
  const [language, setLanguage] = useState<string>('English');
  const [examples, setExamples] = useState<string>('Example Phase 1: Implement async daily check-ins using Slack integrations.');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('Include a troubleshooting section for common remote friction points.');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an expert ${role}.\n\n`;
    prompt += `[GOAL]\n${goal}\n\n`;
    if (context.trim()) prompt += `[CONTEXT]\n${context}\n\n`;
    if (requirements.trim()) prompt += `[REQUIREMENTS]\n${requirements}\n\n`;
    if (constraints.trim()) prompt += `[CONSTRAINTS]\n${constraints}\n\n`;
    if (outputFormat.trim()) prompt += `[OUTPUT FORMAT]\n${outputFormat}\n\n`;
    if (tone.trim()) prompt += `[TONE & STYLE]\n${tone}\n\n`;
    if (language.trim()) prompt += `[OUTPUT LANGUAGE]\n${language}\n\n`;
    if (examples.trim()) prompt += `[EXAMPLES / REFERENCE]\n${examples}\n\n`;
    if (additionalInstructions.trim()) prompt += `[ADDITIONAL INSTRUCTIONS]\n${additionalInstructions}\n\n`;
    prompt += `Please confirm understanding and fulfill the request systematically.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌐</span> Universal Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build custom structured master prompts with Role, Goal, Context, Constraints, Format, Tone & Examples.
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
        <div className="glass-card p-6 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-500" /> All Prompt Sections
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Persona / Role</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Goal / Objective</label>
            <textarea
              rows={2}
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Context</label>
            <textarea
              rows={2}
              value={context}
              onChange={e => setContext(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Requirements</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Constraints</label>
              <textarea
                rows={2}
                value={constraints}
                onChange={e => setConstraints(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tone & Style</label>
              <input
                type="text"
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language</label>
              <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Output Format</label>
            <input
              type="text"
              value={outputFormat}
              onChange={e => setOutputFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Universal Master Prompt
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
            title="Universal Prompt"
            toolId="universal-prompt-builder"
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
