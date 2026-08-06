import React, { useState } from 'react';
import { Sparkles, Sliders, BookOpen, Code } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface ClaudePromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ClaudePromptBuilderTool: React.FC<ClaudePromptBuilderToolProps> = ({ onShowToast }) => {
  const [mode, setMode] = useState<string>('Analysis');
  const [role, setRole] = useState<string>('Principal Data Scientist and Technical Strategist');
  const [context, setContext] = useState<string>('Evaluating user retention metrics for a global mobile gaming application across Q1-Q3.');
  const [instructions, setInstructions] = useState<string>('1. Identify key drop-off points in the user onboarding funnel.\n2. Propose 3 hypothesis-driven A/B testing scenarios.\n3. Draft an executive summary suitable for C-level leadership.');
  const [formatting, setFormatting] = useState<string>('Use clean markdown tables for metrics, bullet points for key takeaways, and numbered lists for recommendations.');
  const [enableArtifacts, setEnableArtifacts] = useState<boolean>(true);
  const [enableThinking, setEnableThinking] = useState<boolean>(true);
  const [prefill, setPrefill] = useState<string>('Here is the comprehensive retention analysis report:');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `<role>\n${role}\n</role>\n\n`;
    prompt += `<context>\n${context}\n</context>\n\n`;
    prompt += `<instructions>\n${instructions}\n</instructions>\n\n`;

    if (formatting.trim()) {
      prompt += `<formatting_rules>\n${formatting}\n</formatting_rules>\n\n`;
    }

    if (enableArtifacts) {
      prompt += `<artifacts_guideline>\nIf outputting standalone documents, code blocks, diagrams, or reports, package them cleanly as self-contained Artifacts.\n</artifacts_guideline>\n\n`;
    }

    if (enableThinking) {
      prompt += `<thinking_process>\nPlease think step-by-step inside <thinking> tags before producing your final answer.\n</thinking_process>\n\n`;
    }

    if (prefill.trim()) {
      prompt += `Assistant: ${prefill}`;
    }

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧠</span> Claude Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build XML-tagged structured prompts optimized for Anthropic Claude 3.5 Sonnet, Haiku & Opus.
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
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" /> Claude Parameters
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
              XML Tag Format
            </span>
          </div>

          {/* Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prompt Purpose</label>
            <div className="grid grid-cols-4 gap-2">
              {['Long-form', 'Analysis', 'Writing', 'Research'].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === m
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role Tag (&lt;role&gt;)</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Context */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Context Tag (&lt;context&gt;)</label>
            <textarea
              rows={2}
              value={context}
              onChange={e => setContext(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Instructions (&lt;instructions&gt;)</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Prefill */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assistant Response Prefill</label>
            <input
              type="text"
              value={prefill}
              onChange={e => setPrefill(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={enableArtifacts} onChange={e => setEnableArtifacts(e.target.checked)} className="w-4 h-4 accent-purple-600 rounded" />
              <span>Claude Artifacts</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={enableThinking} onChange={e => setEnableThinking(e.target.checked)} className="w-4 h-4 accent-purple-600 rounded" />
              <span>Extended Thinking</span>
            </label>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Claude XML Master Prompt
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
            title="Claude Master Prompt"
            toolId="claude-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setInstructions(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
