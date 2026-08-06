import React, { useState } from 'react';
import { Copy } from 'lucide-react';

interface CssClipPathGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface ShapePreset {
  name: string;
  type: 'polygon' | 'circle' | 'ellipse' | 'inset';
  code: string;
}

const SHAPE_PRESETS: ShapePreset[] = [
  { name: 'Triangle', type: 'polygon', code: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { name: 'Trapezoid', type: 'polygon', code: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' },
  { name: 'Parallelogram', type: 'polygon', code: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
  { name: 'Rhombus', type: 'polygon', code: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  { name: 'Pentagon', type: 'polygon', code: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  { name: 'Hexagon', type: 'polygon', code: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  { name: 'Octagon', type: 'polygon', code: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
  { name: 'Star', type: 'polygon', code: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  { name: 'Message Bubble', type: 'polygon', code: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
  { name: 'Circle', type: 'circle', code: 'circle(50% at 50% 50%)' },
  { name: 'Ellipse', type: 'ellipse', code: 'ellipse(50% 30% at 50% 50%)' },
  { name: 'Inset Box', type: 'inset', code: 'inset(10% 20% 10% 20% round 20px)' },
];

export const CssClipPathGeneratorTool: React.FC<CssClipPathGeneratorToolProps> = ({ onShowToast }) => {
  const [selectedShape, setSelectedShape] = useState<ShapePreset>(SHAPE_PRESETS[0]);
  const [customCode, setCustomCode] = useState<string>(SHAPE_PRESETS[0].code);

  const handleSelectShape = (shape: ShapePreset) => {
    setSelectedShape(shape);
    setCustomCode(shape.code);
  };

  const copyCss = () => {
    const css = `clip-path: ${customCode};\n-webkit-clip-path: ${customCode};`;
    navigator.clipboard.writeText(css);
    onShowToast('Clip path CSS copied!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✂️</span> CSS Clip Path Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create custom geometric shapes, polygons, circles & stars using CSS clip-path.
          </p>
        </div>

        <button
          onClick={copyCss}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Copy className="w-4 h-4" /> Copy CSS Code
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="w-full h-72 sm:h-96 rounded-3xl bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        <div
          className="w-56 h-56 sm:w-72 sm:h-72 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300 shadow-2xl flex items-center justify-center text-white font-bold text-sm"
          style={{ clipPath: customCode, WebkitClipPath: customCode }}
        >
          {selectedShape.name}
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Shape Presets
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SHAPE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectShape(preset)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                selectedShape.name === preset.name
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg scale-105'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div
                className="w-10 h-10 bg-current opacity-80"
                style={{ clipPath: preset.code, WebkitClipPath: preset.code }}
              />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editable Code */}
      <div className="glass-card p-5 rounded-2xl space-y-2">
        <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
          Clip-Path Value
        </label>
        <textarea
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          rows={2}
          className="w-full p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs outline-none"
        />
      </div>
    </div>
  );
};
