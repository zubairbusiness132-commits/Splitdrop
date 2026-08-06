import React, { useState } from 'react';
import { Code, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface CodingPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const CodingPromptBuilderTool: React.FC<CodingPromptBuilderToolProps> = ({ onShowToast }) => {
  const [techStack, setTechStack] = useState<string>('React');
  const [taskType, setTaskType] = useState<string>('Feature Implementation');
  const [goal, setGoal] = useState<string>('Build a responsive, debounced search filter component with caching and loading skeletons');
  const [codeContext, setCodeContext] = useState<string>('Working in a React 18 TypeScript project with Tailwind CSS utilities.');
  const [constraints, setConstraints] = useState<string>('Use custom React hooks, strict TypeScript types, memoize heavy computations, handle empty and error states cleanly.');
  const [outputPreference, setOutputPreference] = useState<string>('Production-ready code block with inline TS doc comments & usage example component');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as a Senior Principal Software Engineer and Architect specializing in ${techStack}.\n\n`;
    prompt += `[TASK CATEGORY]\nTask: ${taskType} | Stack: ${techStack}\n\n`;
    prompt += `[PRIMARY OBJECTIVE]\n${goal}\n\n`;
    if (codeContext.trim()) {
      prompt += `[PROJECT ENVIRONMENT & CONTEXT]\n${codeContext}\n\n`;
    }
    if (constraints.trim()) {
      prompt += `[TECHNICAL REQUIREMENTS & CONSTRAINTS]\n${constraints}\n\n`;
    }
    prompt += `[CODE QUALITY RULES]\n`;
    prompt += `1. Follow clean code principles, SOLID design, and modern idiomatic ${techStack} patterns.\n`;
    prompt += `2. Ensure complete type safety with zero 'any' types.\n`;
    prompt += `3. Handle edge cases (null/undefined, network timeouts, invalid inputs) defensively.\n`;
    prompt += `4. Optimize for runtime efficiency and memory usage.\n\n`;
    prompt += `[EXPECTED OUTPUT]\n${outputPreference}`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💻</span> Coding Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate software engineering prompts for React, Python, JS, Flutter, SQL, debugging & clean architecture.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Language & Framework Stack
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'Flutter', 'Python', 'Node.js', 'PHP', 'Java', 'C#', 'SQL', 'Debugging', 'Optimization'].map(lang => (
              <button
                key={lang}
                onClick={() => setTechStack(lang)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  techStack === lang
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Feature Objective / Goal</label>
            <textarea
              rows={2}
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Code Base Context & Environment</label>
            <input
              type="text"
              value={codeContext}
              onChange={e => setCodeContext(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Constraints & Edge Cases</label>
            <input
              type="text"
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Coding Master Prompt
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
            title="Coding Prompt"
            toolId="coding-prompt-builder"
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
