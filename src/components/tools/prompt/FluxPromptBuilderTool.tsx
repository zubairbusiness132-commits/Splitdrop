import React, { useState } from 'react';
import { Zap, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface FluxPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const FluxPromptBuilderTool: React.FC<FluxPromptBuilderToolProps> = ({ onShowToast }) => {
  const [subject, setSubject] = useState<string>('A stylish coffee shop storefront with a glowing neon sign');
  const [embeddedText, setEmbeddedText] = useState<string>('COFFEE & CO');
  const [modelPreset, setModelPreset] = useState<string>('Flux.1 Dev');
  const [medium, setMedium] = useState<string>('35mm Street Photography');
  const [lighting, setLighting] = useState<string>('Warm Twilight Sunset with Volumetric Rain Reflections');
  const [cameraShot, setCameraShot] = useState<string>('Wide Angle Street Level Eye-Height');
  const [colorGrade, setColorGrade] = useState<string>('Cinematic Kodak Portra 400 Film Grain');
  const [details, setDetails] = useState<string>('Wet asphalt reflecting neon light, steam rising from coffee cup on bistro table');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `${medium} of ${subject}`;
    if (embeddedText.trim()) {
      prompt += `, with the text "${embeddedText}" clearly written and rendered on the sign`;
    }
    if (cameraShot.trim()) prompt += `. Shot angle: ${cameraShot}`;
    if (lighting.trim()) prompt += `. Lighting: ${lighting}`;
    if (details.trim()) prompt += `. Fine details: ${details}`;
    if (colorGrade.trim()) prompt += `. Color & aesthetic: ${colorGrade}`;
    prompt += `. Model: ${modelPreset} | Resolution / Aspect Ratio: ${aspectRatio}.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚡</span> Flux Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate prompts optimized for Black Forest Labs Flux.1 Schnell, Dev & Pro with text rendering support.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Flux.1 Model Controls
          </h3>

          {/* Model Preset */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Flux Version Target</label>
            <div className="grid grid-cols-3 gap-2">
              {['Flux.1 Schnell', 'Flux.1 Dev', 'Flux.1 Pro'].map(m => (
                <button
                  key={m}
                  onClick={() => setModelPreset(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    modelPreset === m
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Description</label>
            <textarea
              rows={2}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Text in Image (Flux Special Feature) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Text to Render inside Image (Flux Specialty)
            </label>
            <input
              type="text"
              value={embeddedText}
              onChange={e => setEmbeddedText(e.target.value)}
              placeholder='e.g., "COFFEE & CO"'
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Medium */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Art Medium / Camera Style</label>
            <input
              type="text"
              value={medium}
              onChange={e => setMedium(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Lighting & Camera */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lighting & Shadow</label>
              <input
                type="text"
                value={lighting}
                onChange={e => setLighting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait / Reel)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3 (Standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Flux.1 Master Prompt
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
            title="Flux Prompt"
            toolId="flux-prompt-builder"
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
