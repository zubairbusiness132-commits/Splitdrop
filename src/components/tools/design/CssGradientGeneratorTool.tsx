import React, { useState } from 'react';
import { Copy, Download, RefreshCw, ArrowLeftRight, Plus, Trash2, Sparkles } from 'lucide-react';

interface CssGradientGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export const CssGradientGeneratorTool: React.FC<CssGradientGeneratorToolProps> = ({ onShowToast }) => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState<number>(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#6366f1', position: 0 },
    { id: '2', color: '#a855f7', position: 50 },
    { id: '3', color: '#ec4899', position: 100 }
  ]);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  const getCssString = () => {
    const stopsString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsString})`;
    } else if (gradientType === 'radial') {
      return `radial-gradient(circle at center, ${stopsString})`;
    } else {
      return `conic-gradient(from ${angle}deg at 50% 50%, ${stopsString})`;
    }
  };

  const cssValue = getCssString();

  const addStop = () => {
    if (stops.length >= 10) {
      onShowToast('Maximum 10 color stops reached');
      return;
    }
    const newId = Date.now().toString();
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const lastPos = stops[stops.length - 1]?.position || 50;
    const newPos = Math.min(100, Math.max(0, lastPos + 10));
    setStops([...stops, { id: newId, color: randomColor, position: newPos }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) {
      onShowToast('Minimum 2 color stops required');
      return;
    }
    setStops(stops.filter(s => s.id !== id));
  };

  const updateStopColor = (id: string, color: string) => {
    setStops(stops.map(s => s.id === id ? { ...s, color } : s));
  };

  const updateStopPosition = (id: string, position: number) => {
    setStops(stops.map(s => s.id === id ? { ...s, position } : s));
  };

  const reverseGradient = () => {
    const reversed = stops.map(s => ({
      ...s,
      position: 100 - s.position
    }));
    setStops(reversed);
    onShowToast('Gradient reversed');
  };

  const randomGradient = () => {
    const types: ('linear' | 'radial' | 'conic')[] = ['linear', 'radial', 'conic'];
    const randType = types[Math.floor(Math.random() * types.length)];
    const randAngle = Math.floor(Math.random() * 360);
    const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 stops
    const newStops: ColorStop[] = [];
    for (let i = 0; i < count; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const position = Math.round((i / (count - 1)) * 100);
      newStops.push({ id: i.toString(), color, position });
    }
    setGradientType(randType);
    setAngle(randAngle);
    setStops(newStops);
    onShowToast('Random gradient generated');
  };

  const copyCss = () => {
    const code = `background: ${cssValue};`;
    navigator.clipboard.writeText(code);
    onShowToast('CSS copied to clipboard!');
  };

  const downloadCss = () => {
    const content = `.custom-gradient {\n  background: ${cssValue};\n}`;
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.css';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('CSS file downloaded!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨</span> CSS Gradient Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Design custom linear, radial, or conic gradients with live preview & export options.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={randomGradient}
            className="px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Random
          </button>
          <button
            onClick={reverseGradient}
            className="px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Reverse
          </button>
          <button
            onClick={copyCss}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Copy CSS
          </button>
          <button
            onClick={downloadCss}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div
        className="w-full h-56 sm:h-72 rounded-3xl shadow-inner border border-white/20 transition-all flex items-end p-6"
        style={{ background: cssValue }}
      >
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white text-xs font-mono">
          background: {cssValue};
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type & Angle settings */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Gradient Type & Angle
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {(['linear', 'radial', 'conic'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setGradientType(type)}
                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  gradientType === type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {gradientType !== 'radial' && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Angle ({angle}°)</span>
                <span>{angle}deg</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Color Stops Manager */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Color Stops ({stops.length})
            </h3>
            <button
              onClick={addStop}
              className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stop
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {sortedStops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStopColor(stop.id, e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateStopColor(stop.id, e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white uppercase"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Pos</span>
                    <span>{stop.position}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => updateStopPosition(stop.id, Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5"
                  />
                </div>
                <button
                  onClick={() => removeStop(stop.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
