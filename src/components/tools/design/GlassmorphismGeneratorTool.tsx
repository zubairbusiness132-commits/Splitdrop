import React, { useState } from 'react';
import { Copy, Sparkles } from 'lucide-react';

interface GlassmorphismGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const GlassmorphismGeneratorTool: React.FC<GlassmorphismGeneratorToolProps> = ({ onShowToast }) => {
  const [blur, setBlur] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(0.25);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderOpacity, setBorderOpacity] = useState<number>(0.3);
  const [borderColor, setBorderColor] = useState<string>('#ffffff');
  const [shadowBlur, setShadowBlur] = useState<number>(20);
  const [shadowOpacity, setShadowOpacity] = useState<number>(0.1);
  const [enableGlow, setEnableGlow] = useState<boolean>(false);
  const [glowColor, setGlowColor] = useState<string>('#6366f1');

  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  };

  const bgRgba = hexToRgba(bgColor, opacity);
  const borderRgba = hexToRgba(borderColor, borderOpacity);
  const shadowRgba = hexToRgba('#000000', shadowOpacity);
  const glowRgba = enableGlow ? `, 0 0 25px ${hexToRgba(glowColor, 0.5)}` : '';

  const getCssString = () => {
    return `background: ${bgRgba};\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: ${borderWidth}px solid ${borderRgba};\nbox-shadow: 0 8px 32px 0 ${shadowRgba}${glowRgba};`;
  };

  const cssValue = getCssString();

  const copyCss = () => {
    navigator.clipboard.writeText(cssValue);
    onShowToast('Glassmorphism CSS copied!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✨</span> Glassmorphism Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate frosted glass UI effects with blur, opacity, translucent borders & glows.
          </p>
        </div>

        <button
          onClick={copyCss}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Copy className="w-4 h-4" /> Copy Glass CSS
        </button>
      </div>

      {/* Live Preview with Vibrant Background Elements */}
      <div className="w-full h-72 sm:h-96 rounded-3xl relative overflow-hidden bg-slate-900 flex items-center justify-center p-8 border border-slate-800">
        {/* Decorative background spheres */}
        <div className="absolute top-8 left-12 w-44 h-44 rounded-full bg-pink-500 blur-xl opacity-70 animate-pulse" />
        <div className="absolute bottom-8 right-12 w-52 h-52 rounded-full bg-indigo-500 blur-xl opacity-70 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400 blur-2xl opacity-40" />

        {/* The Glass Container */}
        <div
          className="relative z-10 w-full max-w-sm p-6 sm:p-8 rounded-3xl transition-all text-white space-y-3"
          style={{
            background: bgRgba,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            border: `${borderWidth}px solid ${borderRgba}`,
            boxShadow: `0 8px 32px 0 ${shadowRgba}${glowRgba}`
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">
              ✨
            </div>
            <div>
              <h4 className="font-bold text-sm">Glassmorphism Card</h4>
              <p className="text-[11px] text-white/70">Frosted Glass UI Preview</p>
            </div>
          </div>
          <p className="text-xs text-white/80 leading-relaxed pt-1">
            Modern UI design trend using backdrop blur and subtle border highlights.
          </p>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Blur & Opacity
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Backdrop Blur</span>
              <span>{blur}px</span>
            </div>
            <input
              type="range" min="0" max="40" value={blur}
              onChange={e => setBlur(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Background Opacity</span>
              <span>{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.01" value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Tint</span>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Border Highlight
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Border Width</span>
              <span>{borderWidth}px</span>
            </div>
            <input
              type="range" min="0" max="5" value={borderWidth}
              onChange={e => setBorderWidth(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Border Opacity</span>
              <span>{Math.round(borderOpacity * 100)}%</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.01" value={borderOpacity}
              onChange={e => setBorderOpacity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Border Color</span>
            <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Shadow & Glow
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Shadow Opacity</span>
              <span>{Math.round(shadowOpacity * 100)}%</span>
            </div>
            <input
              type="range" min="0" max="0.5" step="0.01" value={shadowOpacity}
              onChange={e => setShadowOpacity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Enable Ambient Glow</span>
            <input type="checkbox" checked={enableGlow} onChange={e => setEnableGlow(e.target.checked)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
          </div>
          {enableGlow && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Glow Color</span>
              <input type="color" value={glowColor} onChange={e => setGlowColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
