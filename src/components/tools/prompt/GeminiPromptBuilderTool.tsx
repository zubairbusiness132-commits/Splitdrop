import React, { useState } from 'react';
import { Sparkles, Sliders, BookOpen, Layers } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface GeminiPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const GeminiPromptBuilderTool: React.FC<GeminiPromptBuilderToolProps> = ({ onShowToast }) => {
  const [mode, setMode] = useState<string>('Research');
  const [systemInstruction, setSystemInstruction] = useState<string>('You are Google Gemini, an expert multimodal research intelligence and analytical assistant.');
  const [userQuery, setUserQuery] = useState<string>('Analyze the technical trade-offs between monolithic and microservice architectures for high-traffic financial applications.');
  const [multimodalContext, setMultimodalContext] = useState<string>('Attached diagram showing system architecture and database flow.');
  const [groundingRules, setGroundingRules] = useState<string>('Rely on verified technical standards, cite relevant benchmarks, and highlight known failure modes.');
  const [requireCitations, setRequireCitations] = useState<boolean>(true);
  const [enableDeepReasoning, setEnableDeepReasoning] = useState<boolean>(true);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n`;
    prompt += `[PRIMARY TASK - ${mode.toUpperCase()} MODE]\n${userQuery}\n\n`;

    if (multimodalContext.trim()) {
      prompt += `[MULTIMODAL / DOCUMENT INPUT CONTEXT]\n${multimodalContext}\n\n`;
    }

    if (groundingRules.trim()) {
      prompt += `[FACT CHECKING & GROUNDING RULES]\n${groundingRules}\n\n`;
    }

    if (enableDeepReasoning) {
      prompt += `[DEEP REASONING INSTRUCTION]\nPlease break down your analysis into clear logical steps before stating your conclusions. Evaluate counter-arguments and edge cases.\n\n`;
    }

    if (requireCitations) {
      prompt += `[CITATIONS & VERIFICATION]\nInclude specific source attribution or standard framework references for all claims.\n\n`;
    }

    prompt += `Generate a structured response with clear headings, comparison tables, and bullet points where applicable.`;
    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✨</span> Google Gemini Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build optimized Gemini prompts for text, deep research, reasoning, document analysis & planning.
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
              <Sliders className="w-4 h-4 text-indigo-500" /> Gemini Prompt Modes
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
              Gemini 1.5 & 2.0 Ready
            </span>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prompt Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {['Text', 'Research', 'Reasoning', 'Documents', 'Images', 'Planning'].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === m
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* System Instruction */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">System Instruction</label>
            <textarea
              rows={2}
              value={systemInstruction}
              onChange={e => setSystemInstruction(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* User Query */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Task / User Query</label>
            <textarea
              rows={3}
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Multimodal Context */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Multimodal / Attachment Context</label>
            <input
              type="text"
              value={multimodalContext}
              onChange={e => setMultimodalContext(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={enableDeepReasoning} onChange={e => setEnableDeepReasoning(e.target.checked)} className="w-4 h-4 accent-indigo-600 rounded" />
              <span>Deep Reasoning</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={requireCitations} onChange={e => setRequireCitations(e.target.checked)} className="w-4 h-4 accent-indigo-600 rounded" />
              <span>Require Citations</span>
            </label>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Gemini Master Prompt
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
            title="Gemini Master Prompt"
            toolId="gemini-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setUserQuery(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
