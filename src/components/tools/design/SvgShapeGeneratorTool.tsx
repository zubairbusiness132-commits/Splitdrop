import React, { useState } from 'react';
import { Copy, Download, Sparkles } from 'lucide-react';

interface SvgShapeGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const SvgShapeGeneratorTool: React.FC<SvgShapeGeneratorToolProps> = ({ onShowToast }) => {
  const [shapeType, setShapeType] = useState<'circle' | 'rectangle' | 'triangle' | 'star' | 'hexagon' | 'blob' | 'arrow'>('star');
  const [fillColor, setFillColor] = useState<string>('#6366f1');
  const [strokeColor, setStrokeColor] = useState<string>('#a855f7');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [size, setSize] = useState<number>(200);
  const [cornerRadius, setCornerRadius] = useState<number>(12);
  const [blobSeed, setBlobSeed] = useState<number>(1);

  // Generate smooth organic blob SVG path
  const generateBlobPath = (seed: number) => {
    const points = 6;
    const center = 100;
    const radius = 60;
    const pathPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variation = Math.sin(seed * 2 + i * 3) * 20 + Math.cos(seed * 1.5 + i * 2) * 15;
      const r = radius + variation;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      pathPoints.push({ x, y });
    }

    let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 0; i < points; i++) {
      const p0 = pathPoints[i];
      const p1 = pathPoints[(i + 1) % points];
      const cx = (p0.x + p1.x) / 2;
      const cy = (p0.y + p1.y) / 2;
      d += ` Q ${p0.x} ${p0.y}, ${cx} ${cy}`;
    }
    return d + ' Z';
  };

  const renderShapeElement = () => {
    switch (shapeType) {
      case 'circle':
        return <circle cx="100" cy="100" r="70" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />;
      case 'rectangle':
        return <rect x="30" y="30" width="140" height="140" rx={cornerRadius} ry={cornerRadius} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />;
      case 'triangle':
        return <polygon points="100,20 180,170 20,170" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />;
      case 'star':
        return <polygon points="100,20 123,70 178,70 133,103 150,155 100,122 50,155 67,103 22,70 77,70" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />;
      case 'hexagon':
        return <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />;
      case 'blob':
        return <path d={generateBlobPath(blobSeed)} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />;
      case 'arrow':
        return <polygon points="100,20 170,90 130,90 130,180 70,180 70,90 30,90" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    }
  };

  const getSvgString = () => {
    const content = shapeType === 'circle' ? `<circle cx="100" cy="100" r="70" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`
      : shapeType === 'rectangle' ? `<rect x="30" y="30" width="140" height="140" rx="${cornerRadius}" ry="${cornerRadius}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`
      : shapeType === 'triangle' ? `<polygon points="100,20 180,170 20,170" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
      : shapeType === 'star' ? `<polygon points="100,20 123,70 178,70 133,103 150,155 100,122 50,155 67,103 22,70 77,70" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
      : shapeType === 'hexagon' ? `<polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
      : shapeType === 'blob' ? `<path d="${generateBlobPath(blobSeed)}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
      : `<polygon points="100,20 170,90 130,90 130,180 70,180 70,90 30,90" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">\n  ${content}\n</svg>`;
  };

  const copySvg = () => {
    navigator.clipboard.writeText(getSvgString());
    onShowToast('SVG code copied!');
  };

  const downloadSvg = () => {
    const blob = new Blob([getSvgString()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shapeType}-shape.svg`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('SVG file downloaded!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📐</span> SVG Shape Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate vector circles, stars, polygons & organic blobs with SVG export.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copySvg}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4" /> Copy SVG Code
          </button>
          <button
            onClick={downloadSvg}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download SVG
          </button>
        </div>
      </div>

      {/* Live SVG Preview Box */}
      <div className="w-full h-72 sm:h-80 rounded-3xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-8 border border-slate-200 dark:border-slate-800">
        <svg viewBox="0 0 200 200" style={{ width: `${size}px`, height: `${size}px` }}>
          {renderShapeElement()}
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shape Types */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Shape Type
            </h3>
            {shapeType === 'blob' && (
              <button
                onClick={() => setBlobSeed(s => s + 1)}
                className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> New Blob
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['star', 'circle', 'rectangle', 'triangle', 'hexagon', 'blob', 'arrow'] as const).map(type => (
              <button
                key={type}
                onClick={() => setShapeType(type)}
                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  shapeType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Colors & Stroke */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Colors & Stroke
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fill Color</span>
            <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Stroke Color</span>
            <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Stroke Width</span>
              <span>{strokeWidth}px</span>
            </div>
            <input
              type="range" min="0" max="20" value={strokeWidth}
              onChange={e => setStrokeWidth(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Size & Options */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Dimensions
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Render Size</span>
              <span>{size}px</span>
            </div>
            <input
              type="range" min="100" max="300" value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {shapeType === 'rectangle' && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Corner Radius</span>
                <span>{cornerRadius}px</span>
              </div>
              <input
                type="range" min="0" max="50" value={cornerRadius}
                onChange={e => setCornerRadius(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
