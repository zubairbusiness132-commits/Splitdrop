import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, CheckCircle2 } from 'lucide-react';

export const ColorConverterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [hex, setHex] = useState<string>('#6366f1');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // HEX to RGB
  const hexToRgb = (hexStr: string) => {
    let cleanHex = hexStr.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    if (cleanHex.length !== 6) return null;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  };

  const rgb = hexToRgb(hex) || { r: 99, g: 102, b: 241 };

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c, m, y, k };
  };

  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  // Contrast Ratio Calculation
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWhite = Number(((1 + 0.05) / (lum + 0.05)).toFixed(2));
  const contrastBlack = Number(((lum + 0.05) / (0 + 0.05)).toFixed(2));

  const formats = [
    { label: 'HEX', val: hex.toUpperCase() },
    { label: 'RGB', val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CMYK', val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` }
  ];

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFormat(label);
    onShowToast(`Copied ${label} format!`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Color Converter & Accessibility Inspector
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert color values between HEX, RGB, HSL, and CMYK with WCAG contrast ratio checks.
          </p>
        </div>
      </div>

      {/* Primary Picker & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select or Enter Color Value</label>
          
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-slate-200 dark:border-slate-700 p-1 bg-transparent"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#HEX"
              className="flex-1 p-3 text-lg font-mono font-extrabold uppercase rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div
            className="w-full h-28 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: hex, color: contrastWhite >= 4.5 ? '#FFFFFF' : '#000000' }}
          >
            {hex.toUpperCase()} Color Swatch
          </div>
        </div>

        {/* Accessibility Contrast Ratio */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> WCAG Accessibility Contrast
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">On Dark (#000000)</span>
              <p className="text-2xl font-black">{contrastBlack}:1</p>
              <p className="text-[11px] font-bold text-emerald-400">
                {contrastBlack >= 4.5 ? '✓ Passes WCAG AA' : '✗ Fails Contrast'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">On Light (#FFFFFF)</span>
              <p className="text-2xl font-black">{contrastWhite}:1</p>
              <p className="text-[11px] font-bold text-indigo-600">
                {contrastWhite >= 4.5 ? '✓ Passes WCAG AA' : '✗ Fails Contrast'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Color Format Conversions Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {formats.map((f) => (
          <div key={f.label} className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{f.label}</span>
              <button
                onClick={() => handleCopy(f.val, f.label)}
                className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
              >
                {copiedFormat === f.label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white break-all">{f.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
