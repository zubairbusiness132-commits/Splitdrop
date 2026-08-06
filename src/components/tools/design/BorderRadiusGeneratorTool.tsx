import React, { useState } from 'react';
import { Copy, Link, Unlink } from 'lucide-react';

interface BorderRadiusGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const BorderRadiusGeneratorTool: React.FC<BorderRadiusGeneratorToolProps> = ({ onShowToast }) => {
  const [isLinked, setIsLinked] = useState<boolean>(false);
  const [isElliptical, setIsElliptical] = useState<boolean>(false);

  // Normal radii (or Horizontal)
  const [tl, setTl] = useState<number>(24);
  const [tr, setTr] = useState<number>(24);
  const [br, setBr] = useState<number>(24);
  const [bl, setBl] = useState<number>(24);

  // Elliptical Vertical radii
  const [tlV, setTlV] = useState<number>(24);
  const [trV, setTrV] = useState<number>(24);
  const [brV, setBrV] = useState<number>(24);
  const [blV, setBlV] = useState<number>(24);

  const updateAllHoriz = (val: number) => {
    setTl(val);
    setTr(val);
    setBr(val);
    setBl(val);
  };

  const updateAllVert = (val: number) => {
    setTlV(val);
    setTrV(val);
    setBrV(val);
    setBlV(val);
  };

  const getRadiusString = () => {
    if (!isElliptical) {
      if (tl === tr && tr === br && br === bl) {
        return `${tl}px`;
      }
      return `${tl}px ${tr}px ${br}px ${bl}px`;
    } else {
      const hStr = `${tl}px ${tr}px ${br}px ${bl}px`;
      const vStr = `${tlV}px ${trV}px ${brV}px ${blV}px`;
      return `${hStr} / ${vStr}`;
    }
  };

  const cssValue = getRadiusString();

  const copyCss = () => {
    const code = `border-radius: ${cssValue};`;
    navigator.clipboard.writeText(code);
    onShowToast('CSS copied to clipboard!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⭕</span> Border Radius Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Design custom rounded, asymmetrical, or elliptical box corners easily.
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
      <div className="w-full h-64 sm:h-80 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-8 relative">
        <div
          className="w-48 h-48 sm:w-60 sm:h-60 bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl transition-all flex items-center justify-center p-4 text-white text-xs font-mono font-bold text-center"
          style={{ borderRadius: cssValue }}
        >
          border-radius: {cssValue};
        </div>
      </div>

      {/* Controls Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const next = !isLinked;
              setIsLinked(next);
              if (next) updateAllHoriz(tl);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isLinked
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isLinked ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
            {isLinked ? 'Corners Linked' : 'Corners Unlinked'}
          </button>

          <button
            onClick={() => setIsElliptical(!isElliptical)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isElliptical
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isElliptical ? 'Elliptical Mode ON' : 'Elliptical Mode OFF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Horizontal / Standard Corners */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {isElliptical ? 'Horizontal Radii' : 'Corner Radii'}
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Top-Left</span>
                <span>{tl}px</span>
              </div>
              <input
                type="range" min="0" max="150" value={tl}
                onChange={e => {
                  const val = Number(e.target.value);
                  setTl(val);
                  if (isLinked) updateAllHoriz(val);
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Top-Right</span>
                <span>{tr}px</span>
              </div>
              <input
                type="range" min="0" max="150" value={tr}
                onChange={e => {
                  const val = Number(e.target.value);
                  setTr(val);
                  if (isLinked) updateAllHoriz(val);
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Bottom-Right</span>
                <span>{br}px</span>
              </div>
              <input
                type="range" min="0" max="150" value={br}
                onChange={e => {
                  const val = Number(e.target.value);
                  setBr(val);
                  if (isLinked) updateAllHoriz(val);
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Bottom-Left</span>
                <span>{bl}px</span>
              </div>
              <input
                type="range" min="0" max="150" value={bl}
                onChange={e => {
                  const val = Number(e.target.value);
                  setBl(val);
                  if (isLinked) updateAllHoriz(val);
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Elliptical Vertical Corners */}
        {isElliptical && (
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Vertical Radii (Elliptical)
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Top-Left Vertical</span>
                  <span>{tlV}px</span>
                </div>
                <input
                  type="range" min="0" max="150" value={tlV}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setTlV(val);
                    if (isLinked) updateAllVert(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Top-Right Vertical</span>
                  <span>{trV}px</span>
                </div>
                <input
                  type="range" min="0" max="150" value={trV}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setTrV(val);
                    if (isLinked) updateAllVert(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Bottom-Right Vertical</span>
                  <span>{brV}px</span>
                </div>
                <input
                  type="range" min="0" max="150" value={brV}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setBrV(val);
                    if (isLinked) updateAllVert(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Bottom-Left Vertical</span>
                  <span>{blV}px</span>
                </div>
                <input
                  type="range" min="0" max="150" value={blV}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setBlV(val);
                    if (isLinked) updateAllVert(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
