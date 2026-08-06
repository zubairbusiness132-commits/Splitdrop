import React, { useState } from 'react';
import { MessageSquare, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface ChatgptPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ChatgptPromptBuilderTool: React.FC<ChatgptPromptBuilderToolProps> = ({ onShowToast }) => {
  const [domain, setDomain] = useState<string>('Coding');
  const [role, setRole] = useState<string>('Senior Full-Stack Engineer');
  const [goal, setGoal] = useState<string>('Build a responsive React component with state management');
  const [context, setContext] = useState<string>('Developing a dashboard widget for an e-commerce platform');
  const [constraints, setConstraints] = useState<string>('Use TypeScript, Tailwind CSS, no third-party UI libraries');
  const [outputFormat, setOutputFormat] = useState<string>('Clean code block with inline comments & usage example');
  const [tone, setTone] = useState<string>('Professional & Technical');
  const [useChainOfThought, setUseChainOfThought] = useState<boolean>(true);
  const [includeExamples, setIncludeExamples] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an expert ${role}.\n\n`;
    prompt += `[GOAL]\n${goal}\n\n`;
    if (context.trim()) {
      prompt += `[CONTEXT]\n${context}\n\n`;
    }
    if (constraints.trim()) {
      prompt += `[REQUIREMENTS & CONSTRAINTS]\n${constraints}\n\n`;
    }
    prompt += `[TONE & STYLE]\n${tone}\n\n`;
    prompt += `[EXPECTED OUTPUT FORMAT]\n${outputFormat}\n\n`;

    if (useChainOfThought) {
      prompt += `[STEP-BY-STEP REASONING]\nPlease think step-by-step before producing the final output. First outline your strategy, then write the detailed response.\n\n`;
    }

    if (includeExamples) {
      prompt += `[FEW-SHOT EXAMPLES]\nExample Input: "Create a button component"\nExample Output: "export const Button = () => ..."\n\n`;
    }

    prompt += `Please confirm you understand these instructions and provide your response.`;
    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💬</span> ChatGPT Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build structured, high-performing ChatGPT prompt templates for coding, marketing, writing & research.
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
        {/* Input Parameters */}
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" /> Prompt Builder Controls
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
              100% Offline
            </span>
          </div>

          {/* Domain Category Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Domain / Industry</label>
            <div className="flex flex-wrap gap-1.5">
              {['Writing', 'Coding', 'Marketing', 'Business', 'Education', 'Research', 'Productivity', 'Translation', 'Summarization'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setDomain(cat);
                    if (cat === 'Coding') {
                      setRole('Senior Full-Stack Engineer');
                      setGoal('Build a responsive React component with state management');
                    } else if (cat === 'Marketing') {
                      setRole('Senior Digital Marketing Director');
                      setGoal('Draft a high-converting Facebook ad campaign copy');
                    } else if (cat === 'Business') {
                      setRole('Management Consultant');
                      setGoal('Create a SWOT analysis for a new SaaS product');
                    } else if (cat === 'Writing') {
                      setRole('Best-selling Fiction Author');
                      setGoal('Outline an engaging mystery chapter hook');
                    }
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    domain === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Persona / Role</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Goal */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Objective / Goal</label>
            <textarea
              rows={2}
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Context */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Context</label>
            <textarea
              rows={2}
              value={context}
              onChange={e => setContext(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Requirements & Constraints */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Constraints & Requirements</label>
            <input
              type="text"
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useChainOfThought} onChange={e => setUseChainOfThought(e.target.checked)} className="w-4 h-4 accent-indigo-600 rounded" />
              <span>Step-by-Step Logic</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeExamples} onChange={e => setIncludeExamples(e.target.checked)} className="w-4 h-4 accent-indigo-600 rounded" />
              <span>Few-Shot Examples</span>
            </label>
          </div>
        </div>

        {/* Live Output Preview */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Output Prompt Preview
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
            title="ChatGPT Master Prompt"
            toolId="chatgpt-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => {
          setGoal(text);
        }}
        onShowToast={onShowToast}
      />
    </div>
  );
};
