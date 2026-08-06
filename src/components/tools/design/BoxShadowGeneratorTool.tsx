import React, { useState } from 'react';
import { Copy, Plus, Trash2, Layers } from 'lucide-react';

interface BoxShadowGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export const BoxShadowGeneratorTool: React.FC<BoxShadowGeneratorToolProps> = ({ onShowToast }) => {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: '1', x: 0, y: 10, blur: 25, spread: -5, color: '#000000', opacity: 0.1, inset: false },
    { id: '2', x: 0, y: 8, blur: 10, spread: -6, color: '#000000', opacity: 0.1, inset: false }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('1');
  const [boxBg, setBoxBg] = useState<string>('#ffffff');
  const [previewBg, setPreviewBg] = useState<string>('#f1f5f9');

  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  };

  const getCssString = () => {
    if (layers.length === 0) return 'none';
    return layers.map(l => {
      const rgba = hexToRgba(l.color, l.opacity);
      const insetStr = l.inset ? 'inset ' : '';
      return `${insetStr}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
    }).join(', ');
  };

  const cssValue = getCssString();

  const addLayer = () => {
    if (layers.length >= 6) {
      onShowToast('Maximum 6 shadow layers allowed');
      return;
    }
    const newId = Date.now().toString();
    const newLayer: ShadowLayer = {
      id: newId,
      x: 0,
      y: 15,
      blur: 30,
      spread: 0,
      color: '#000000',
      opacity: 0.15,
      inset: false
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) {
      onShowToast('At least 1 shadow layer required');
      return;
    }
    const filtered = layers.filter(l => l.id !== id);
    setLayers(filtered);
    if (activeLayerId === id) {
      setActiveLayerId(filtered[0].id);
    }
  };

  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0];

  const updateActiveLayer = (updates: Partial<ShadowLayer>) => {
    setLayers(layers.map(l => l.id === activeLayer.id ? { ...l, ...updates } : l));
  };

  const copyCss = () => {
    const code = `box-shadow: ${cssValue};`;
    navigator.clipboard.writeText(code);
    onShowToast('CSS copied to clipboard!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📦</span> Box Shadow Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create layered, realistic CSS box shadows with live interactive preview.
          </p>
        </div>

        <button
          onClick={copyCss}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Copy className="w-4 h-4" /> Copy CSS Code
        </button>
      </div>

      {/* Live Preview Arena */}
      <div
        className="w-full h-64 sm:h-80 rounded-3xl flex items-center justify-center p-8 transition-colors border border-slate-200/60 dark:border-slate-800 relative overflow-hidden"
        style={{ backgroundColor: previewBg }}
      >
        <div
          className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl transition-all flex items-center justify-center font-bold text-xs text-slate-500"
          style={{
            backgroundColor: boxBg,
            boxShadow: cssValue
          }}
        >
          Preview Box
        </div>

        {/* Canvas BG Controller */}
        <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500">Box:</span>
          <input type="color" value={boxBg} onChange={e => setBoxBg(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
          <span className="text-[11px] font-bold text-slate-500 ml-2">Canvas:</span>
          <input type="color" value={previewBg} onChange={e => setPreviewBg(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layer list */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Layers ({layers.length})
            </h3>
            <button
              onClick={addLayer}
              className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Layer
            </button>
          </div>

          <div className="space-y-2">
            {layers.map((layer, idx) => (
              <div
                key={layer.id}
                onClick={() => setActiveLayerId(layer.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  layer.id === activeLayer.id
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Shadow Layer #{idx + 1} {layer.inset ? '(Inset)' : ''}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Layer Controls */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Layer Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>X Offset</span>
                <span>{activeLayer.x}px</span>
              </div>
              <input
                type="range" min="-100" max="100" value={activeLayer.x}
                onChange={e => updateActiveLayer({ x: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Y Offset</span>
                <span>{activeLayer.y}px</span>
              </div>
              <input
                type="range" min="-100" max="100" value={activeLayer.y}
                onChange={e => updateActiveLayer({ y: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Blur Radius</span>
                <span>{activeLayer.blur}px</span>
              </div>
              <input
                type="range" min="0" max="100" value={activeLayer.blur}
                onChange={e => updateActiveLayer({ blur: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Spread Radius</span>
                <span>{activeLayer.spread}px</span>
              </div>
              <input
                type="range" min="-50" max="50" value={activeLayer.spread}
                onChange={e => updateActiveLayer({ spread: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Opacity</span>
                <span>{Math.round(activeLayer.opacity * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.01" value={activeLayer.opacity}
                onChange={e => updateActiveLayer({ opacity: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Shadow Color</label>
              <input
                type="color" value={activeLayer.color}
                onChange={e => updateActiveLayer({ color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Inset Shadow</label>
              <input
                type="checkbox" checked={activeLayer.inset}
                onChange={e => updateActiveLayer({ inset: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
