import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Heart, Trash2, History } from 'lucide-react';

interface RandomColorGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const RandomColorGeneratorTool: React.FC<RandomColorGeneratorToolProps> = ({ onShowToast }) => {
  const [hex, setHex] = useState<string>('#6366f1');
  const [history, setHistory] = useState<string[]>(['#6366f1']);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop_fav_colors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const hexToRgb = (h: string) => {
    let c = h.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const rgbaStr = `rgba(${r}, ${g}, ${b}, 1.0)`;
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;

  const generateNewColor = () => {
    const newHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setHex(newHex);
    setHistory(prev => [newHex, ...prev.slice(0, 19)]);
  };

  const toggleFavorite = (colorHex: string) => {
    let updated: string[];
    if (favorites.includes(colorHex)) {
      updated = favorites.filter(c => c !== colorHex);
      onShowToast('Removed from favorites');
    } else {
      updated = [...favorites, colorHex];
      onShowToast('Saved to favorites!');
    }
    setFavorites(updated);
    try {
      localStorage.setItem('splitdrop_fav_colors', JSON.stringify(updated));
    } catch {}
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Copied ${text}`);
  };

  // Keyboard shortcut listener (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateNewColor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎲</span> Random Color Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate random colors instantly. Press Spacebar or click Generate.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toggleFavorite(hex)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              favorites.includes(hex)
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-slate-200 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.includes(hex) ? 'fill-current text-rose-500' : ''}`} />
            {favorites.includes(hex) ? 'Saved' : 'Save Color'}
          </button>
          <button
            onClick={generateNewColor}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Generate Color
          </button>
        </div>
      </div>

      {/* Main Color Banner */}
      <div
        className="w-full h-72 sm:h-80 rounded-3xl p-8 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden"
        style={{ backgroundColor: hex }}
      >
        <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-xs font-mono w-max">
          Press Spacebar to randomize
        </div>

        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl text-white max-w-sm space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">HEX Code</span>
          <div className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-wider">
            {hex}
          </div>
          <button
            onClick={() => copyText(hex)}
            className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Copy HEX Code
          </button>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">RGB</div>
            <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">{rgbStr}</div>
          </div>
          <button onClick={() => copyText(rgbStr)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">HSL</div>
            <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">{hslStr}</div>
          </div>
          <button onClick={() => copyText(hslStr)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">RGBA</div>
            <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">{rgbaStr}</div>
          </div>
          <button onClick={() => copyText(rgbaStr)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Favorites & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" /> Saved Favorites ({favorites.length})
          </h3>
          {favorites.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No favorite colors saved yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {favorites.map(c => (
                <div
                  key={c}
                  onClick={() => setHex(c)}
                  className="w-10 h-10 rounded-xl cursor-pointer shadow-md border border-white/20 transition-transform hover:scale-110 relative group flex items-center justify-center"
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(c);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 bg-black/60 rounded text-white text-[10px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-indigo-500" /> Recent History
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((c, i) => (
              <div
                key={i}
                onClick={() => setHex(c)}
                className="w-8 h-8 rounded-lg cursor-pointer shadow-sm border border-white/20 transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
