import React, { useState } from 'react';
import { Share2, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface SocialMediaPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const SocialMediaPromptBuilderTool: React.FC<SocialMediaPromptBuilderToolProps> = ({ onShowToast }) => {
  const [platform, setPlatform] = useState<string>('LinkedIn');
  const [contentType, setContentType] = useState<string>('Carousel Slide Deck Outline');
  const [topic, setTopic] = useState<string>('5 Harsh Truths About AI Software Development That Nobody Talks About');
  const [targetAudience, setTargetAudience] = useState<string>('Software Engineers, Tech Founders & Product Leaders');
  const [tone, setTone] = useState<string>('Thought-Provoking, Authoritative & Actionable');
  const [cta, setCta] = useState<string>('Repost if you agree and comment your thoughts below!');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an expert Social Media Growth Specialist and Viral Copywriter.\n\n`;
    prompt += `[PLATFORM & FORMAT]\nPlatform: ${platform}\nContent Type: ${contentType}\nTarget Audience: ${targetAudience}\n\n`;
    prompt += `[TOPIC & HOOK]\nTopic: "${topic}"\n\n`;
    prompt += `[TONE & CTA]\nTone: ${tone}\nPrimary Call-To-Action: ${cta}\n\n`;
    prompt += `[CONTENT OUTLINE REQUIREMENTS]\n`;
    if (platform === 'LinkedIn' || contentType.includes('Carousel')) {
      prompt += `1. **Slide 1 / Cover**: Bold curiosity-gap hook title.\n`;
      prompt += `2. **Slides 2 - 6**: 5 digestible, high-value visual takeaways with clear headings.\n`;
      prompt += `3. **Final Slide**: Summary recap + strong engagement call to action.\n`;
      prompt += `4. Include a ready-to-copy post caption with relevant trending hashtags.\n`;
    } else if (platform === 'Twitter/X' || platform === 'Threads') {
      prompt += `1. Write a viral 5-tweet thread with line breaks and emoji triggers.\n`;
      prompt += `2. Tweet 1 must be a strong pattern interrupt hook.\n`;
      prompt += `3. Tweet 5 must be the final takeaway + CTA.\n`;
    } else {
      prompt += `1. High-retention video script outline with visual cues & audio triggers.\n`;
      prompt += `2. Engaging caption with relevant hashtags.\n`;
    }

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📱</span> Social Media Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate viral social post prompts for Instagram, LinkedIn, TikTok, Twitter/X, Facebook & Threads.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Platform & Audience
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'Twitter/X', 'Threads'].map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  platform === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Content Format</label>
            <input
              type="text"
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Post Topic / Hook Concept</label>
            <textarea
              rows={2}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tone of Voice</label>
              <input
                type="text"
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Call-To-Action</label>
              <input
                type="text"
                value={cta}
                onChange={e => setCta(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Social Post Master Prompt
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
            title="Social Media Prompt"
            toolId="social-media-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setTopic(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
