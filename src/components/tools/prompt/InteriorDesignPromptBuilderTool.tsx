import React, { useState } from 'react';
import { Sofa, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface InteriorDesignPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const InteriorDesignPromptBuilderTool: React.FC<InteriorDesignPromptBuilderToolProps> = ({ onShowToast }) => {
  const [room, setRoom] = useState<string>('Living Room');
  const [style, setStyle] = useState<string>('Modern Japandi Minimalist');
  const [materials, setMaterials] = useState<string>('Light oak herringbone wood flooring, micro-cement walls, bouclé fabric sofa');
  const [colorPalette, setColorPalette] = useState<string>('Warm Beige, Soft Sage Green, Cream & Matte Black accents');
  const [lighting, setLighting] = useState<string>('Floor-to-ceiling panoramic glass windows with soft afternoon sunlight');
  const [furniture, setFurniture] = useState<string>('Low-profile beige sectional sofa, ceramic coffee table, fiddle-leaf fig plant');
  const [cameraAngle, setCameraAngle] = useState<string>('Wide-Angle Eye-Level Architectural Photography');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Architectural Digest interior design photography of a ${style} ${room}.\n`;
    prompt += `Flooring & Wall Materials: ${materials}.\n`;
    prompt += `Color Palette: ${colorPalette}.\n`;
    prompt += `Furniture & Decor: ${furniture}.\n`;
    prompt += `Lighting Setup: ${lighting}.\n`;
    prompt += `Camera Perspective: ${cameraAngle}.\n\n`;
    prompt += `[ARCHITECTURAL VISUALIZATION STANDARDS]\nHigh resolution, crisp render, 8k resolution, realistic sunlight ray scattering, hyperrealistic interior architecture, balanced composition, interior design portfolio standard.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛋️</span> Interior Design Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate AI prompts for interior architecture, luxury villas, cafes, bedrooms, kitchens & modern offices.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Space & Aesthetics
          </h3>

          {/* Rooms */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Room / Space Type</label>
            <div className="flex flex-wrap gap-1.5">
              {['Bedroom', 'Kitchen', 'Living Room', 'Office', 'Restaurant', 'Cafe', 'Hotel', 'Luxury Villa'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoom(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    room === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Design Aesthetic Style</label>
            <input
              type="text"
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Materials */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Materials & Surfaces</label>
            <textarea
              rows={2}
              value={materials}
              onChange={e => setMaterials(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Furniture & Palette */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Furniture & Accents</label>
              <input
                type="text"
                value={furniture}
                onChange={e => setFurniture(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Palette</label>
              <input
                type="text"
                value={colorPalette}
                onChange={e => setColorPalette(e.target.value)}
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
                <Sparkles className="w-4 h-4" /> ArchViz Master Prompt
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
            title="Interior Design Prompt"
            toolId="interior-design-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setFurniture(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
