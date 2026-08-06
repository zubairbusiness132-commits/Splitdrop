import React, { useState } from 'react';
import { Search, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface SeoPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const SeoPromptBuilderTool: React.FC<SeoPromptBuilderToolProps> = ({ onShowToast }) => {
  const [useCase, setUseCase] = useState<string>('Blog Article');
  const [primaryKeyword, setPrimaryKeyword] = useState<string>('best image splitter tool online');
  const [secondaryKeywords, setSecondaryKeywords] = useState<string>('split photos online, crop image in half, dual photo joiner, zero server upload');
  const [searchIntent, setSearchIntent] = useState<string>('Informational & Problem-Solving');
  const [targetWordCount, setTargetWordCount] = useState<string>('1,800 - 2,500 Words');
  const [targetAudience, setTargetAudience] = useState<string>('Graphic Designers, Photographers, Content Creators & Marketers');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an expert SEO Director and Senior Technical Content Strategist.\n\n`;
    prompt += `[SEO TASK & USE CASE]\nUse Case: ${useCase}\nTarget Word Count: ${targetWordCount}\nTarget Search Intent: ${searchIntent}\n\n`;
    prompt += `[KEYWORD STRATEGY]\nPrimary Keyword: "${primaryKeyword}"\nSecondary Keywords: ${secondaryKeywords}\nTarget Audience: ${targetAudience}\n\n`;
    prompt += `[E-E-A-T & QUALITY REQUIREMENTS]\n`;
    prompt += `1. **Meta Tags**: High CTR Meta Title (<60 chars) and Meta Description (<155 chars) containing the primary keyword.\n`;
    prompt += `2. **H1, H2, H3 Heading Structure**: Logical, skimmable hierarchy addressing intent and LSI keywords naturally.\n`;
    prompt += `3. **E-E-A-T Compliance**: Demonstrate Experience, Expertise, Authoritativeness & Trustworthiness with real-world examples.\n`;
    prompt += `4. **FAQ Section**: Include 5 common user questions with FAQ Schema.org JSON-LD formatting recommendations.\n`;
    prompt += `5. **Internal & External Links**: Suggest anchor text opportunities for contextual internal linking.\n\n`;
    prompt += `Generate a complete, search-engine-optimized article draft with markdown formatting.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔍</span> SEO Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build SEO content briefs for blogs, websites, keyword research, meta titles & internal linking.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> SEO Parameters
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['Blog Article', 'Website Page', 'Keyword Research', 'Meta Titles', 'Descriptions', 'Internal Linking', 'Content Brief'].map(u => (
              <button
                key={u}
                onClick={() => setUseCase(u)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  useCase === u
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Focus Keyword</label>
            <input
              type="text"
              value={primaryKeyword}
              onChange={e => setPrimaryKeyword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Secondary / LSI Keywords</label>
            <textarea
              rows={2}
              value={secondaryKeywords}
              onChange={e => setSecondaryKeywords(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Search Intent</label>
              <input
                type="text"
                value={searchIntent}
                onChange={e => setSearchIntent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Word Count Target</label>
              <input
                type="text"
                value={targetWordCount}
                onChange={e => setTargetWordCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> SEO Master Prompt
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
            title="SEO Prompt"
            toolId="seo-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setPrimaryKeyword(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
