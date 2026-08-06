import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Lock, Unlock, Sparkles } from 'lucide-react';

interface ColorPaletteGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface PaletteColor {
  hex: string;
  locked: boolean;
}

export const ColorPaletteGeneratorTool: React.FC<ColorPaletteGeneratorToolProps> = ({ onShowToast }) => {
  const [paletteType, setPaletteType] = useState<'random' | 'monochrome' | 'complementary' | 'analogous' | 'triadic'>('random');
  const [baseColor, setBaseColor] = useState<string>('#6366f1');
  const [colors, setColors] = useState<PaletteColor[]>([
    { hex: '#6366f1', locked: false },
    { hex: '#818cf8', locked: false },
    { hex: '#a5b4fc', locked: false },
    { hex: '#c7d2fe', locked: false },
    { hex: '#e0e7ff', locked: false }
  ]);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = () => {
    let newHexes: string[] = [];

    if (paletteType === 'random') {
      newHexes = Array.from({ length: 5 }, () =>
        '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      );
    } else {
      const h = Math.floor(Math.random() * 360);
      if (paletteType === 'monochrome') {
        newHexes = [10, 30, 50, 70, 90].map(l => hslToHex(h, 60, l));
      } else if (paletteType === 'complementary') {
        const comp = (h + 180) % 360;
        newHexes = [
          hslToHex(h, 70, 40),
          hslToHex(h, 60, 60),
          hslToHex(h, 30, 85),
          hslToHex(comp, 60, 60),
          hslToHex(comp, 70, 40)
        ];
      } else if (paletteType === 'analogous') {
        newHexes = [-40, -20, 0, 20, 40].map(offset => hslToHex((h + offset + 360) % 360, 65, 55));
      } else if (paletteType === 'triadic') {
        const h2 = (h + 120) % 360;
        const h3 = (h + 240) % 360;
        newHexes = [
          hslToHex(h, 70, 50),
          hslToHex(h, 40, 75),
          hslToHex(h2, 70, 50),
          hslToHex(h3, 70, 50),
          hslToHex(h3, 40, 75)
        ];
      }
    }

    setColors(colors.map((c, i) => (c.locked ? c : { hex: newHexes[i] || c.hex, locked: false })));
  };

  const toggleLock = (index: number) => {
    setColors(colors.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    onShowToast(`Copied ${hex}!`);
  };

  const exportJson = () => {
    const data = JSON.stringify(colors.map(c => c.hex), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.json';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Palette JSON exported!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨</span> Color Palette Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate harmonious monochromatic, triadic, complementary or random palettes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generatePalette}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Generate Palette
          </button>
          <button
            onClick={exportJson}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Palette Swatches Row */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 h-96 sm:h-80">
        {colors.map((col, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-4 flex flex-col justify-between shadow-lg transition-all relative group"
            style={{ backgroundColor: col.hex }}
          >
            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleLock(idx)}
                className="p-2 rounded-xl bg-slate-900/40 backdrop-blur-md text-white hover:bg-slate-900/60 transition-colors"
              >
                {col.locked ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-white/70" />}
              </button>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl text-white flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase">{col.hex}</span>
              <button
                onClick={() => copyColor(col.hex)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Harmony Selector */}
      <div className="glass-card p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Palette Harmony Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {(['random', 'monochrome', 'complementary', 'analogous', 'triadic'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                setPaletteType(type);
                generatePalette();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                paletteType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
