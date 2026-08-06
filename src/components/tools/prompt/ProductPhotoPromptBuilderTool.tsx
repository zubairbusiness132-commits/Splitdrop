import React, { useState } from 'react';
import { Camera, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface ProductPhotoPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ProductPhotoPromptBuilderTool: React.FC<ProductPhotoPromptBuilderToolProps> = ({ onShowToast }) => {
  const [platform, setPlatform] = useState<string>('Amazon');
  const [productName, setProductName] = useState<string>('Luxury Matte Black Skincare Serum Bottle with Gold Cap');
  const [surface, setSurface] = useState<string>('Smooth White Italian Marble Podium with subtle water droplets');
  const [background, setBackground] = useState<string>('Minimalist Warm Sand Dune Studio Backdrop with soft shadows');
  const [lighting, setLighting] = useState<string>('Professional Studio Softbox Lighting with natural sun rays through window blinds');
  const [cameraLens, setCameraLens] = useState<string>('Macro 100mm f/2.8 Prime Lens, Eye-Level Hero Shot');
  const [stylePreset, setStylePreset] = useState<string>('Luxury Minimal E-Commerce');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Commercial product photography of a ${productName}.\n`;
    prompt += `Style & Platform Target: ${stylePreset} for ${platform}.\n`;
    prompt += `Surface & Podium: Placed elegantly on a ${surface}.\n`;
    prompt += `Background: ${background}.\n`;
    prompt += `Lighting: ${lighting}.\n`;
    prompt += `Camera Setup: Shot on ${cameraLens}.\n\n`;
    prompt += `[COMMERCIAL STANDARDS]\nHyper-detailed, crisp focus on product branding label, subtle glass reflections, studio quality color grading, professional commercial ad standard, 8k resolution, zero noise.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📸</span> Product Photography Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate commercial studio photography prompts for Amazon, Flipkart, luxury brands & e-commerce.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Commercial Presets
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['Amazon', 'Flipkart', 'E-commerce', 'Luxury', 'Minimal', 'Studio Hero', 'Cosmetics'].map(p => (
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

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Name & Package Details</label>
            <textarea
              rows={2}
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Surface & Background */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Surface / Podium</label>
              <input
                type="text"
                value={surface}
                onChange={e => setSurface(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Backdrop</label>
              <input
                type="text"
                value={background}
                onChange={e => setBackground(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Lighting & Lens */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Studio Lighting</label>
              <input
                type="text"
                value={lighting}
                onChange={e => setLighting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Camera & Lens</label>
              <input
                type="text"
                value={cameraLens}
                onChange={e => setCameraLens(e.target.value)}
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
                <Sparkles className="w-4 h-4" /> Commercial Product Prompt
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
            title="Product Photography Prompt"
            toolId="product-photo-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setProductName(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
