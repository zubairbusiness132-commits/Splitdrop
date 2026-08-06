import React, { useState } from 'react';
import { Sparkles, Sliders, BookOpen, Layers } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface StableDiffusionPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const StableDiffusionPromptBuilderTool: React.FC<StableDiffusionPromptBuilderToolProps> = ({ onShowToast }) => {
  const [subject, setSubject] = useState<string>('An intricate fantasy dragon resting on a hoard of ancient glowing gold coins inside a cavern');
  const [style, setStyle] = useState<string>('digital painting, concept art, trending on ArtStation');
  const [lighting, setLighting] = useState<string>('volumetric lighting, rim light, ambient occlusion, glowing crystal embers');
  const [artistStyle, setArtistStyle] = useState<string>('Greg Rutkowski, WLOP, Alphonse Mucha');
  const [qualityTerms, setQualityTerms] = useState<string>('masterpiece, best quality, highly detailed, 8k wallpaper, sharp focus');
  const [negativePrompt, setNegativePrompt] = useState<string>('worst quality, low quality, normal quality, blurry, deformed hands, extra limbs, bad anatomy, cropped, watermark, signature');
  const [cfgScale, setCfgScale] = useState<number>(7.5);
  const [sampler, setSampler] = useState<string>('DPM++ 2M Karras');
  const [steps, setSteps] = useState<number>(30);
  const [resolution, setResolution] = useState<string>('1024x1024 (SDXL Square)');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePositivePrompt = () => {
    let p = `${subject}, ${style}`;
    if (artistStyle.trim()) p += `, art by ${artistStyle}`;
    if (lighting.trim()) p += `, ${lighting}`;
    if (qualityTerms.trim()) p += `, ${qualityTerms}`;
    return p;
  };

  const positive = generatePositivePrompt();

  const generateFullOutput = () => {
    let output = `[POSITIVE PROMPT]\n${positive}\n\n`;
    output += `[NEGATIVE PROMPT]\n${negativePrompt}\n\n`;
    output += `[RECOMMENDED SETTINGS]\nCFG Scale: ${cfgScale} | Sampler: ${sampler} | Sampling Steps: ${steps} | Resolution: ${resolution}`;
    return output;
  };

  const finalPrompt = generateFullOutput();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌌</span> Stable Diffusion Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build positive and negative prompts with CFG guidance scale, sampling methods & step recommendations for SDXL & SD3.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Positive & Negative Parameters
          </h3>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Positive Subject & Action</label>
            <textarea
              rows={2}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Style & Artists */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Art Style</label>
              <input
                type="text"
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Artist Influences</label>
              <input
                type="text"
                value={artistStyle}
                onChange={e => setArtistStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-rose-600 dark:text-rose-400">Negative Prompt (What to Avoid)</label>
            <textarea
              rows={2}
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Sampler & CFG & Steps */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Generation Suggestions</span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sampling Method</label>
                <select
                  value={sampler}
                  onChange={e => setSampler(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="DPM++ 2M Karras">DPM++ 2M Karras</option>
                  <option value="Euler a">Euler a</option>
                  <option value="DDIM">DDIM</option>
                  <option value="UniPC">UniPC</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CFG Scale: {cfgScale}</label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={cfgScale}
                  onChange={e => setCfgScale(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> SD Master Config
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
            title="Stable Diffusion Prompt"
            toolId="stable-diffusion-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setSubject(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
