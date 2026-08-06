import React, { useState } from 'react';
import { Check, X, ArrowLeftRight } from 'lucide-react';

interface ContrastCheckerToolProps {
  onShowToast: (message: string) => void;
}

export const ContrastCheckerTool: React.FC<ContrastCheckerToolProps> = ({ onShowToast }) => {
  const [fgColor, setFgColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#6366f1');

  // Relative luminance calculation according to WCAG 2.1
  const getLuminance = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const rgb = [(num >> 16) & 255, (num >> 8) & 255, num & 255].map(val => {
      val /= 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const getContrastRatio = (fg: string, bg: string) => {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const max = Math.max(l1, l2);
    const min = Math.min(l1, l2);
    return (max + 0.05) / (min + 0.05);
  };

  const ratio = getContrastRatio(fgColor, bgColor);
  const ratioFormatted = ratio.toFixed(2);

  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  const swapColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👁️</span> WCAG Contrast Checker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check color contrast ratios against WCAG 2.1 AA & AAA accessibility guidelines.
          </p>
        </div>

        <button
          onClick={swapColors}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeftRight className="w-4 h-4" /> Swap Foreground / Background
        </button>
      </div>

      {/* Main Ratio Card & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-3xl p-8 flex flex-col justify-between shadow-xl transition-all border border-black/10 min-h-[260px]"
          style={{ backgroundColor: bgColor, color: fgColor }}
        >
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
              Live Preview
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Accessible Text Sample
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              This text tests standard body contrast accessibility across web, mobile & UI components.
            </p>
          </div>

          <div className="pt-4 border-t border-current/20 flex items-center justify-between">
            <span className="text-xs font-semibold">Foreground: {fgColor}</span>
            <span className="text-xs font-semibold">Background: {bgColor}</span>
          </div>
        </div>

        {/* Big Ratio Display */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Contrast Ratio
            </span>
            <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white mt-1">
              {ratioFormatted} : 1
            </div>
          </div>

          {/* WCAG Compliance Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className={`p-3 rounded-2xl border flex items-center justify-between ${aaNormal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
              <div>
                <div className="text-xs font-bold">WCAG AA</div>
                <div className="text-[10px] opacity-80">Normal Text (≥ 4.5:1)</div>
              </div>
              {aaNormal ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>

            <div className={`p-3 rounded-2xl border flex items-center justify-between ${aaLarge ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
              <div>
                <div className="text-xs font-bold">WCAG AA</div>
                <div className="text-[10px] opacity-80">Large Text (≥ 3.0:1)</div>
              </div>
              {aaLarge ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>

            <div className={`p-3 rounded-2xl border flex items-center justify-between ${aaaNormal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
              <div>
                <div className="text-xs font-bold">WCAG AAA</div>
                <div className="text-[10px] opacity-80">Normal Text (≥ 7.0:1)</div>
              </div>
              {aaaNormal ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>

            <div className={`p-3 rounded-2xl border flex items-center justify-between ${aaaLarge ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
              <div>
                <div className="text-xs font-bold">WCAG AAA</div>
                <div className="text-[10px] opacity-80">Large Text (≥ 4.5:1)</div>
              </div>
              {aaaLarge ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {/* Color Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Text Color (Foreground)
            </label>
            <input
              type="text" value={fgColor} onChange={e => setFgColor(e.target.value)}
              className="mt-1 font-mono text-xs uppercase px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Background Color
            </label>
            <input
              type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
              className="mt-1 font-mono text-xs uppercase px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
        </div>
      </div>
    </div>
  );
};
