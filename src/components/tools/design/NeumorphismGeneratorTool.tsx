import React, { useState } from 'react';
import { Copy } from 'lucide-react';

interface NeumorphismGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const NeumorphismGeneratorTool: React.FC<NeumorphismGeneratorToolProps> = ({ onShowToast }) => {
  const [bgColor, setBgColor] = useState<string>('#e0e5ec');
  const [size, setSize] = useState<number>(200);
  const [radius, setRadius] = useState<number>(50);
  const [distance, setDistance] = useState<number>(20);
  const [intensity, setIntensity] = useState<number>(0.15);
  const [blur, setBlur] = useState<number>(40);
  const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
  const [lightDir, setLightDir] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left');

  // Helper to adjust color brightness
  const adjustColor = (hex: string, percent: number) => {
    let num = parseInt(hex.replace('#', ''), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = (num >> 8 & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const darkShadow = adjustColor(bgColor, -20 * (intensity * 5));
  const lightShadow = adjustColor(bgColor, 20 * (intensity * 5));

  const getOffsets = () => {
    switch (lightDir) {
      case 'top-left': return { darkX: distance, darkY: distance, lightX: -distance, lightY: -distance };
      case 'top-right': return { darkX: -distance, darkY: distance, lightX: distance, lightY: -distance };
      case 'bottom-left': return { darkX: distance, darkY: -distance, lightX: -distance, lightY: distance };
      case 'bottom-right': return { darkX: -distance, darkY: -distance, lightX: distance, lightY: distance };
    }
  };

  const { darkX, darkY, lightX, lightY } = getOffsets();

  const getBoxShadow = () => {
    if (shape === 'pressed') {
      return `inset ${darkX}px ${darkY}px ${blur}px ${darkShadow}, inset ${lightX}px ${lightY}px ${blur}px ${lightShadow}`;
    }
    return `${darkX}px ${darkY}px ${blur}px ${darkShadow}, ${lightX}px ${lightY}px ${blur}px ${lightShadow}`;
  };

  const getGradientBg = () => {
    if (shape === 'concave') {
      return `linear-gradient(145deg, ${darkShadow}, ${lightShadow})`;
    } else if (shape === 'convex') {
      return `linear-gradient(145deg, ${lightShadow}, ${darkShadow})`;
    }
    return bgColor;
  };

  const boxShadowValue = getBoxShadow();
  const backgroundValue = getGradientBg();

  const getCssCode = () => {
    return `border-radius: ${radius}px;\nbackground: ${backgroundValue};\nbox-shadow: ${boxShadowValue};`;
  };

  const copyCss = () => {
    navigator.clipboard.writeText(getCssCode());
    onShowToast('Neumorphism CSS copied!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔲</span> Neumorphism Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate soft UI extruded or inset neumorphic shadows and shapes.
          </p>
        </div>

        <button
          onClick={copyCss}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Copy className="w-4 h-4" /> Copy CSS Code
        </button>
      </div>

      {/* Live Preview Box with matching background */}
      <div
        className="w-full h-72 sm:h-96 rounded-3xl flex items-center justify-center p-8 transition-colors border border-slate-300 dark:border-slate-800"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="transition-all flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 p-4"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${radius}px`,
            background: backgroundValue,
            boxShadow: boxShadowValue
          }}
        >
          Soft UI
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Shape & Direction */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Shape Style
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {(['flat', 'concave', 'convex', 'pressed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  shape === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">Light Source</label>
            <div className="grid grid-cols-2 gap-2">
              {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={() => setLightDir(dir)}
                  className={`py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all ${
                    lightDir === dir
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {dir.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Size & Radius
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Distance (Depth)</span>
              <span>{distance}px</span>
            </div>
            <input
              type="range" min="5" max="50" value={distance}
              onChange={e => setDistance(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Blur Radius</span>
              <span>{blur}px</span>
            </div>
            <input
              type="range" min="10" max="100" value={blur}
              onChange={e => setBlur(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Corner Radius</span>
              <span>{radius}px</span>
            </div>
            <input
              type="range" min="0" max={Math.round(size / 2)} value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Color & Intensity */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Color & Shadow
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Color</span>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Intensity</span>
              <span>{Math.round(intensity * 100)}%</span>
            </div>
            <input
              type="range" min="0.05" max="0.4" step="0.01" value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Box Size</span>
              <span>{size}px</span>
            </div>
            <input
              type="range" min="120" max="300" value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
