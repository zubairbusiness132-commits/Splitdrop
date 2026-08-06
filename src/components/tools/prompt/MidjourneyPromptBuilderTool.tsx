import React, { useState } from 'react';
import { Image, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface MidjourneyPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const MidjourneyPromptBuilderTool: React.FC<MidjourneyPromptBuilderToolProps> = ({ onShowToast }) => {
  const [subject, setSubject] = useState<string>('Portrait of a cybernetic cyberpunk priestess wearing intricate golden circuitry robes');
  const [style, setStyle] = useState<string>('Hyperrealistic Photorealism, Unreal Engine 5 render');
  const [camera, setCamera] = useState<string>('DSLR Eye-Level Shot');
  const [lens, setLens] = useState<string>('85mm Portrait Lens f/1.2');
  const [lighting, setLighting] = useState<string>('Volumetric Rim Light, Dramatic Soft Neon Reflections');
  const [materials, setMaterials] = useState<string>('Polished Gold, Matte Black Obsidian, Holographic Glass');
  const [colorPalette, setColorPalette] = useState<string>('Deep Midnight Blue, Cyan & Emerald Green accents');
  const [composition, setComposition] = useState<string>('Centered Symmetry, Golden Ratio, Shallow Depth of Field');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [version, setVersion] = useState<string>('v 6.1');
  const [stylize, setStylize] = useState<number>(250);
  const [chaos, setChaos] = useState<number>(10);
  const [quality, setQuality] = useState<string>('1');
  const [negativePrompt, setNegativePrompt] = useState<string>('blurry, low resolution, bad anatomy, deformed hands, extra fingers, text, watermark');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `${subject}, `;
    if (style.trim()) prompt += `${style}, `;
    if (camera.trim() || lens.trim()) prompt += `shot on ${camera} ${lens}, `;
    if (lighting.trim()) prompt += `${lighting}, `;
    if (materials.trim()) prompt += `materials: ${materials}, `;
    if (colorPalette.trim()) prompt += `color palette: ${colorPalette}, `;
    if (composition.trim()) prompt += `${composition}, `;
    prompt += `hyperdetailed, 8k resolution`;

    prompt += ` --ar ${aspectRatio} --${version} --stylize ${stylize} --chaos ${chaos} --q ${quality}`;
    if (negativePrompt.trim()) {
      prompt += ` --no ${negativePrompt}`;
    }

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🖼️</span> Midjourney Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build hyper-realistic Midjourney v6.1 & Niji 6 image prompts with camera parameters & flags.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Midjourney v6.1 Parameters
          </h3>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Subject & Scene</label>
            <textarea
              rows={2}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Style & Medium */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Artistic Style / Render Engine</label>
            <input
              type="text"
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Camera & Lens */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Camera Angle</label>
              <input
                type="text"
                value={camera}
                onChange={e => setCamera(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lens Type</label>
              <input
                type="text"
                value={lens}
                onChange={e => setLens(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Lighting & Materials */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lighting</label>
              <input
                type="text"
                value={lighting}
                onChange={e => setLighting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Texture & Materials</label>
              <input
                type="text"
                value={materials}
                onChange={e => setMaterials(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Flags: --ar, --v, --stylize, --chaos */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Midjourney Flags</span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aspect Ratio (--ar)</label>
                <select
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Story / Reel)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Instagram Portrait)</option>
                  <option value="21:9">21:9 (Cinematic)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Version (--v)</label>
                <select
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="v 6.1">v 6.1 (Latest)</option>
                  <option value="v 6.0">v 6.0</option>
                  <option value="v 5.2">v 5.2</option>
                  <option value="niji 6">Niji 6 (Anime)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stylize: {stylize}</label>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={stylize}
                  onChange={e => setStylize(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chaos: {chaos}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={chaos}
                  onChange={e => setChaos(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Negative Prompt (--no)</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
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
                <Sparkles className="w-4 h-4" /> Midjourney Master Prompt
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
            title="Midjourney Prompt"
            toolId="midjourney-prompt-builder"
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
