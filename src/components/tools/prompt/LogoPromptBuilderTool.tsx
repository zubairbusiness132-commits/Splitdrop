import React, { useState } from 'react';
import { Tag, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface LogoPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const LogoPromptBuilderTool: React.FC<LogoPromptBuilderToolProps> = ({ onShowToast }) => {
  const [industry, setIndustry] = useState<string>('Tech');
  const [brandName, setBrandName] = useState<string>('Apex AI');
  const [logoStyle, setLogoStyle] = useState<string>('Minimalist Abstract Geometry');
  const [symbolism, setSymbolism] = useState<string>('Interlocking neural nodes forming an ascending mountain peak');
  const [colorPalette, setColorPalette] = useState<string>('Electric Cyan and Deep Navy Blue gradient');
  const [vibe, setVibe] = useState<string>('Sleek, Futuristic, Professional & High-Tech');
  const [background, setBackground] = useState<string>('Clean Flat Solid White Background');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Minimalist vector logo mark for a ${industry} brand named "${brandName}".\n`;
    prompt += `Style: ${logoStyle}.\n`;
    prompt += `Symbolism & Concept: ${symbolism}.\n`;
    prompt += `Color Palette: ${colorPalette}.\n`;
    prompt += `Aesthetic Vibe: ${vibe}.\n`;
    prompt += `Background: ${background}.\n\n`;
    prompt += `[VECTOR GRAPHIC RULES]\nFlat 2D vector graphic design, clean symmetry, sharp vector lines, high contrast, suitable for modern tech brand mark, isolated design. No 3D photorealism, no realistic textures, no complex shadows, no realistic photos.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏷️</span> Logo Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate vector logo prompts across Tech, Business, Medical, Finance, Gaming, Luxury & Minimalist styles.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Industry & Style Presets
          </h3>

          {/* Categories */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Industry Category</label>
            <div className="flex flex-wrap gap-1.5">
              {['Business', 'Tech', 'Restaurant', 'Education', 'Medical', 'Finance', 'Gaming', 'Fashion', 'Minimal', 'Luxury'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setIndustry(cat);
                    if (cat === 'Gaming') {
                      setLogoStyle('Mascot & Gaming Emblem');
                      setSymbolism('Cybernetic Dragon with glowing neon eyes');
                      setColorPalette('Neon Purple and Electric Gold');
                    } else if (cat === 'Luxury') {
                      setLogoStyle('Elegant Minimalist Monogram');
                      setSymbolism('Intertwined serif initials L & V');
                      setColorPalette('Rose Gold and Obsidian Black');
                    }
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    industry === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand / Business Name</label>
            <input
              type="text"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Logo Style */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Logo Type / Style</label>
            <input
              type="text"
              value={logoStyle}
              onChange={e => setLogoStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Symbolism */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Iconography / Symbol Concept</label>
            <textarea
              rows={2}
              value={symbolism}
              onChange={e => setSymbolism(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Color Palette & Background */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Palette</label>
              <input
                type="text"
                value={colorPalette}
                onChange={e => setColorPalette(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Style</label>
              <input
                type="text"
                value={background}
                onChange={e => setBackground(e.target.value)}
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
                <Sparkles className="w-4 h-4" /> Logo Master Prompt
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
            title="Logo Prompt"
            toolId="logo-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setSymbolism(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
