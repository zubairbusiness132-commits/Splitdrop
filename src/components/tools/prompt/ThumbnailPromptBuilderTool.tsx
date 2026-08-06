import React, { useState } from 'react';
import { Tv, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface ThumbnailPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ThumbnailPromptBuilderTool: React.FC<ThumbnailPromptBuilderToolProps> = ({ onShowToast }) => {
  const [platformCategory, setPlatformCategory] = useState<string>('YouTube');
  const [niche, setNiche] = useState<string>('Technology');
  const [mainSubject, setMainSubject] = useState<string>('Shocked tech reviewer pointing dramatically at a floating futuristic hologram laptop');
  const [expression, setExpression] = useState<string>('Surprised, Wide Eyes, Open Mouth Shock');
  const [overlayText, setOverlayText] = useState<string>('DON\'T BUY THIS!');
  const [visualHook, setVisualHook] = useState<string>('Glowing red warning badge and big red arrow pointing at laptop');
  const [colorScheme, setColorScheme] = useState<string>('Ultra High-Contrast Electric Yellow, Cyan & Dark Charcoal background');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `High-CTR YouTube thumbnail image concept for ${platformCategory} / ${niche} content.\n`;
    prompt += `Main Subject: ${mainSubject}.\n`;
    prompt += `Facial Expression: ${expression}.\n`;
    prompt += `Overlay Text Idea: Bold 3D typography reading "${overlayText}".\n`;
    prompt += `Visual Hook & Gimmick: ${visualHook}.\n`;
    prompt += `Color Scheme: ${colorScheme}.\n`;
    prompt += `Aspect Ratio: ${aspectRatio}.\n\n`;
    prompt += `[COMPOSITION RULES]\nEye-catching thumbnail design, vibrant saturation, exaggerated depth of field, subject isolated in sharp focus, professional lighting rim, optimized for small screen viewing.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📺</span> Thumbnail Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate high-CTR thumbnail prompts for YouTube, TikTok, Instagram & Facebook with facial hooks & bold text.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Platform & Niche Selection
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['YouTube', 'Instagram', 'Facebook', 'TikTok', 'Gaming', 'Finance', 'Education', 'Technology', 'Movie', 'AI', 'Health', 'Business'].map(cat => (
              <button
                key={cat}
                onClick={() => setNiche(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  niche === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Main Subject & Action</label>
            <textarea
              rows={2}
              value={mainSubject}
              onChange={e => setMainSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Facial Expression & Overlay Text */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Facial Expression</label>
              <input
                type="text"
                value={expression}
                onChange={e => setExpression(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Overlay Text Hook</label>
              <input
                type="text"
                value={overlayText}
                onChange={e => setOverlayText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Visual Hook & Color Scheme */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Visual Hook / Attention Grabber</label>
            <input
              type="text"
              value={visualHook}
              onChange={e => setVisualHook(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Thumbnail Master Prompt
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
            title="Thumbnail Prompt"
            toolId="thumbnail-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setMainSubject(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
