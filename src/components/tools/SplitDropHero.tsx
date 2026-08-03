import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Share2, ArrowRightLeft, Scissors, Layers, RefreshCw, Copy, Check, Eye } from 'lucide-react';

interface SplitDropHeroProps {
  onShowToast: (msg: string) => void;
}

export const SplitDropHero: React.FC<SplitDropHeroProps> = ({ onShowToast }) => {
  // Mode: 'split' | 'combine'
  const [activeTab, setActiveTab] = useState<'split' | 'combine'>('split');
  
  // Options
  const [trimPadding, setTrimPadding] = useState<boolean>(true);

  // --- SPLIT MODE STATE ---
  const [splitImg, setSplitImg] = useState<HTMLImageElement | null>(null);
  const [splitOrientation, setSplitOrientation] = useState<'v' | 'h'>('v');
  const [splitPct, setSplitPct] = useState<number>(50);
  const splitInputRef = useRef<HTMLInputElement>(null);
  const splitCanvasRef = useRef<HTMLCanvasElement>(null);
  const [splitImgTrim, setSplitImgTrim] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // --- COMBINE MODE STATE ---
  const [imgA, setImgA] = useState<HTMLImageElement | null>(null);
  const [imgB, setImgB] = useState<HTMLImageElement | null>(null);
  const [combineOrientation, setCombineOrientation] = useState<'v' | 'h'>('v');
  const [combinePct, setCombinePct] = useState<number>(50);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const combineCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  // Helper: compute transparent padding auto-trim
  const computeTrim = useCallback((img: HTMLImageElement) => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cx = c.getContext('2d');
    if (!cx) return { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
    cx.drawImage(img, 0, 0);
    try {
      const data = cx.getImageData(0, 0, c.width, c.height).data;
      let minX = c.width, minY = c.height, maxX = 0, maxY = 0, found = false;
      const step = 2;
      for (let y = 0; y < c.height; y += step) {
        for (let x = 0; x < c.width; x += step) {
          if (data[(y * c.width + x) * 4 + 3] > 10) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (!found) return { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
      return { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) };
    } catch {
      return { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
    }
  }, []);

  const getRect = useCallback((img: HTMLImageElement, cachedTrim: { x: number; y: number; w: number; h: number } | null) => {
    if (trimPadding) {
      if (cachedTrim) return cachedTrim;
      return computeTrim(img);
    }
    return { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  }, [trimPadding, computeTrim]);

  // Load Image helper
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Canvas export to Blob
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
    return new Promise(res => canvas.toBlob(res, 'image/png'));
  };

  // --- DRAW SPLIT CANVAS ---
  const drawSplit = useCallback(() => {
    if (!splitImg || !splitCanvasRef.current) return;
    const canvas = splitCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r = getRect(splitImg, splitImgTrim);
    const MAXDIM = 1200;
    const scale = Math.min(1, MAXDIM / Math.max(r.w, r.h));
    const cw = Math.round(r.w * scale);
    const ch = Math.round(r.h * scale);

    canvas.width = cw;
    canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(splitImg, r.x, r.y, r.w, r.h, 0, 0, cw, ch);

    // Draw handle line
    ctx.save();
    ctx.strokeStyle = '#ff5a6e';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255,90,110,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    let handleX = 0, handleY = 0;
    if (splitOrientation === 'v') {
      const x = Math.round((cw * splitPct) / 100);
      ctx.moveTo(x, 0); ctx.lineTo(x, ch);
      handleX = x; handleY = ch / 2;
    } else {
      const y = Math.round((ch * splitPct) / 100);
      ctx.moveTo(0, y); ctx.lineTo(cw, y);
      handleX = cw / 2; handleY = y;
    }
    ctx.stroke();

    // Circle handle
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(handleX, handleY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff5a6e';
    ctx.beginPath(); ctx.arc(handleX, handleY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }, [splitImg, splitImgTrim, splitOrientation, splitPct, getRect]);

  useEffect(() => {
    if (activeTab === 'split') drawSplit();
  }, [activeTab, drawSplit]);

  // --- SPLIT CANVAS DRAG HANDLER ---
  const isDraggingSplit = useRef(false);
  const handleSplitPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingSplit.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSplitFromPointer(e);
  };
  const handleSplitPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingSplit.current) updateSplitFromPointer(e);
  };
  const handleSplitPointerUp = () => { isDraggingSplit.current = false; };

  const updateSplitFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!splitCanvasRef.current) return;
    const rect = splitCanvasRef.current.getBoundingClientRect();
    let pct = 50;
    if (splitOrientation === 'v') {
      pct = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      pct = ((e.clientY - rect.top) / rect.height) * 100;
    }
    setSplitPct(Math.min(95, Math.max(5, Math.round(pct))));
  };

  // --- BUILD SPLIT PARTS FOR EXPORT ---
  const buildSplitParts = () => {
    if (!splitImg) return null;
    const r = getRect(splitImg, splitImgTrim);
    const pct = splitPct / 100;
    const cA = document.createElement('canvas');
    const cB = document.createElement('canvas');

    if (splitOrientation === 'v') {
      const w = Math.round(r.w * pct);
      const rw = r.w - w;
      cA.width = w; cA.height = r.h;
      cA.getContext('2d')?.drawImage(splitImg, r.x, r.y, w, r.h, 0, 0, w, r.h);
      cB.width = rw; cB.height = r.h;
      cB.getContext('2d')?.drawImage(splitImg, r.x + w, r.y, rw, r.h, 0, 0, rw, r.h);
    } else {
      const h = Math.round(r.h * pct);
      const rh = r.h - h;
      cA.width = r.w; cA.height = h;
      cA.getContext('2d')?.drawImage(splitImg, r.x, r.y, r.w, h, 0, 0, r.w, h);
      cB.width = r.w; cB.height = rh;
      cB.getContext('2d')?.drawImage(splitImg, r.x, r.y + h, r.w, rh, 0, 0, r.w, rh);
    }
    return { cA, cB };
  };

  const downloadSplitBoth = async () => {
    const parts = buildSplitParts();
    if (!parts) return;
    const blobA = await canvasToBlob(parts.cA);
    const blobB = await canvasToBlob(parts.cB);
    if (!blobA || !blobB) return;

    const a1 = document.createElement('a'); a1.download = 'split-part-a.png'; a1.href = URL.createObjectURL(blobA); a1.click();
    setTimeout(() => {
      const a2 = document.createElement('a'); a2.download = 'split-part-b.png'; a2.href = URL.createObjectURL(blobB); a2.click();
      onShowToast('Both split parts downloaded!');
    }, 400);
  };

  const shareSplitBoth = async () => {
    const parts = buildSplitParts();
    if (!parts) return;
    const blobA = await canvasToBlob(parts.cA);
    const blobB = await canvasToBlob(parts.cB);
    if (!blobA || !blobB) return;

    const files = [
      new File([blobA], 'split-part-a.png', { type: 'image/png' }),
      new File([blobB], 'split-part-b.png', { type: 'image/png' })
    ];

    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({ files, title: 'Split Parts from SplitDrop' });
        onShowToast('Shared both split images!');
        return;
      } catch {
        // User cancelled share
      }
    }
    downloadSplitBoth();
  };

  // --- COMBINE MODE CALCULATIONS & DRAWING ---
  const combineLayout = useCallback(() => {
    if (!imgA || !imgB) return null;
    const pct = combinePct / 100;
    const MAXDIM = 1200;
    const rA = getRect(imgA, null);
    const rB = getRect(imgB, null);

    if (combineOrientation === 'v') {
      const targetH = Math.min(rA.h, rB.h, MAXDIM);
      const scaleA = targetH / rA.h;
      const scaleB = targetH / rB.h;
      const cropAW = rA.w * pct;
      const cropBW = rB.w * (1 - pct);
      const Lw = Math.max(1, Math.round(cropAW * scaleA));
      const Rw = Math.max(1, Math.round(cropBW * scaleB));
      return {
        pct,
        orient: 'v',
        totalW: Lw + Rw,
        totalH: targetH,
        aSrc: [rA.x, rA.y, cropAW, rA.h] as [number, number, number, number],
        aDst: [0, 0, Lw, targetH] as [number, number, number, number],
        bSrc: [rB.x + rB.w - cropBW, rB.y, cropBW, rB.h] as [number, number, number, number],
        bDst: [Lw, 0, Rw, targetH] as [number, number, number, number],
        seamPos: Lw
      };
    } else {
      const targetW = Math.min(rA.w, rB.w, MAXDIM);
      const scaleA = targetW / rA.w;
      const scaleB = targetW / rB.w;
      const cropAH = rA.h * pct;
      const cropBH = rB.h * (1 - pct);
      const Th = Math.max(1, Math.round(cropAH * scaleA));
      const Bh = Math.max(1, Math.round(cropBH * scaleB));
      return {
        pct,
        orient: 'h',
        totalW: targetW,
        totalH: Th + Bh,
        aSrc: [rA.x, rA.y, rA.w, cropAH] as [number, number, number, number],
        aDst: [0, 0, targetW, Th] as [number, number, number, number],
        bSrc: [rB.x, rB.y + rB.h - cropBH, rB.w, cropBH] as [number, number, number, number],
        bDst: [0, Th, targetW, Bh] as [number, number, number, number],
        seamPos: Th
      };
    }
  }, [imgA, imgB, combinePct, combineOrientation, getRect]);

  const drawCombine = useCallback(() => {
    if (!combineCanvasRef.current || !imgA || !imgB) return;
    const canvas = combineCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const L = combineLayout();
    if (!L) return;

    canvas.width = L.totalW;
    canvas.height = L.totalH;
    ctx.clearRect(0, 0, L.totalW, L.totalH);
    ctx.drawImage(imgA, ...L.aSrc, ...L.aDst);
    ctx.drawImage(imgB, ...L.bSrc, ...L.bDst);

    // Seam line
    ctx.save();
    ctx.strokeStyle = '#ffab00';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255,171,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    if (L.orient === 'v') {
      ctx.moveTo(L.seamPos, 0); ctx.lineTo(L.seamPos, L.totalH);
    } else {
      ctx.moveTo(0, L.seamPos); ctx.lineTo(L.totalW, L.seamPos);
    }
    ctx.stroke();

    // Handle
    const handleX = L.orient === 'v' ? L.seamPos : L.totalW / 2;
    const handleY = L.orient === 'v' ? L.totalH / 2 : L.seamPos;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(handleX, handleY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffab00';
    ctx.beginPath(); ctx.arc(handleX, handleY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }, [combineLayout, imgA, imgB]);

  useEffect(() => {
    if (activeTab === 'combine') drawCombine();
  }, [activeTab, drawCombine]);

  // COMBINE POINTER DRAG
  const isDraggingCombine = useRef(false);
  const handleCombinePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingCombine.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateCombineFromPointer(e);
  };
  const handleCombinePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingCombine.current) updateCombineFromPointer(e);
  };
  const handleCombinePointerUp = () => { isDraggingCombine.current = false; };

  const updateCombineFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!combineCanvasRef.current) return;
    const rect = combineCanvasRef.current.getBoundingClientRect();
    let pct = 50;
    if (combineOrientation === 'v') {
      pct = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      pct = ((e.clientY - rect.top) / rect.height) * 100;
    }
    setCombinePct(Math.min(95, Math.max(5, Math.round(pct))));
  };

  const downloadCombinedImage = async () => {
    if (!combineCanvasRef.current) return;
    const blob = await canvasToBlob(combineCanvasRef.current);
    if (!blob) return;
    const a = document.createElement('a');
    a.download = 'splitdrop-combined.png';
    a.href = URL.createObjectURL(blob);
    a.click();
    onShowToast('Combined image saved!');
  };

  const copyCombinedToClipboard = async () => {
    if (!combineCanvasRef.current) return;
    const blob = await canvasToBlob(combineCanvasRef.current);
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      onShowToast('Copied combined image to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Clipboard not supported, downloading image...');
      downloadCombinedImage();
    }
  };

  const swapImages = () => {
    setImgA(imgB);
    setImgB(imgA);
    onShowToast('Swapped Image A and Image B');
  };

  const handleReset = () => {
    setSplitImg(null);
    setSplitImgTrim(null);
    setImgA(null);
    setImgB(null);
    if (splitInputRef.current) splitInputRef.current.value = '';
    if (inputARef.current) inputARef.current.value = '';
    if (inputBRef.current) inputBRef.current.value = '';
    onShowToast('Reset SplitDrop app');
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all">
      
      {/* Header bar */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
            SD
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              SplitDrop Tool
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fast, secure image and PDF processing
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset All
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Global Option */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white font-bold">Auto-trim padding:</strong> Ignore empty transparent canvas margin
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={trimPadding}
              onChange={(e) => setTrimPadding(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl font-semibold text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" /> Split Image
          </button>
          <button
            onClick={() => setActiveTab('combine')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === 'combine'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Combine Images
          </button>
        </div>

        {/* TAB 1: SPLIT MODE */}
        {activeTab === 'split' && (
          <div className="space-y-5">
            {!splitImg ? (
              <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-3xl bg-indigo-50/30 dark:bg-indigo-950/20 hover:border-indigo-400 transition-colors cursor-pointer text-center group">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg width="32" height="32" fill="none" stroke="#6366F1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <p className="text-base font-bold text-slate-700 dark:text-slate-200">Drop your file here or tap to upload</p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WebP, GIF, BMP</p>
                <button type="button" className="mt-5 px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold shadow-sm text-slate-700 dark:text-slate-200 group-hover:bg-indigo-50">Browse Files</button>
                <input
                  ref={splitInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const img = await loadImage(file);
                        setSplitImg(img);
                        setSplitImgTrim(computeTrim(img));
                        onShowToast('Image loaded into SplitDrop');
                      } catch {
                        onShowToast('Failed to load image');
                      }
                    }
                  }}
                />
              </label>
            ) : (
              <>
                {/* Orientation Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSplitOrientation('v')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      splitOrientation === 'v'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    Vertical Split
                  </button>
                  <button
                    onClick={() => setSplitOrientation('h')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      splitOrientation === 'h'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    Horizontal Split
                  </button>
                </div>

                {/* Canvas Preview Container */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center min-h-[240px]">
                  <canvas
                    ref={splitCanvasRef}
                    onPointerDown={handleSplitPointerDown}
                    onPointerMove={handleSplitPointerMove}
                    onPointerUp={handleSplitPointerUp}
                    className="max-h-[50vh] w-auto max-w-full cursor-grab active:cursor-grabbing rounded-lg object-contain touch-none"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-medium text-white border border-slate-700 shadow-lg">
                    Drag line on canvas to adjust split location
                  </div>
                </div>

                {/* Slider & Presets */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Part A</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{splitPct}%</span>
                    <span>Part B</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={splitPct}
                    onChange={(e) => setSplitPct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex gap-2">
                    {[25, 50, 75].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setSplitPct(pct)}
                        className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 transition-colors"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={downloadSplitBoth}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" /> Download Both Parts
                  </button>
                  <button
                    onClick={shareSplitBoth}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98]"
                  >
                    <Share2 className="w-4 h-4" /> Share Both Parts
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: COMBINE MODE */}
        {activeTab === 'combine' && (
          <div className="space-y-5">
            {/* Two Input Slots */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
              {/* Slot A */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Image A
                </label>
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-2xl hover:border-indigo-400 cursor-pointer bg-indigo-50/20 dark:bg-indigo-950/10 overflow-hidden text-center p-2 relative">
                  {imgA ? (
                    <img src={imgA.src} alt="Thumb A" className="h-full w-full object-contain" />
                  ) : (
                    <>
                      <span className="text-xl">🅰️</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Select A</span>
                    </>
                  )}
                  <input
                    ref={inputARef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const img = await loadImage(file);
                          setImgA(img);
                          onShowToast('Image A loaded');
                        } catch {
                          onShowToast('Failed to load Image A');
                        }
                      }
                    }}
                  />
                </label>
              </div>

              {/* Swap Button */}
              <div className="pt-5">
                <button
                  onClick={swapImages}
                  disabled={!imgA && !imgB}
                  title="Swap Image A and Image B"
                  className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all disabled:opacity-40"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Slot B */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Image B
                </label>
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-2xl hover:border-indigo-400 cursor-pointer bg-indigo-50/20 dark:bg-indigo-950/10 overflow-hidden text-center p-2 relative">
                  {imgB ? (
                    <img src={imgB.src} alt="Thumb B" className="h-full w-full object-contain" />
                  ) : (
                    <>
                      <span className="text-xl">🅱️</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Select B</span>
                    </>
                  )}
                  <input
                    ref={inputBRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const img = await loadImage(file);
                          setImgB(img);
                          onShowToast('Image B loaded');
                        } catch {
                          onShowToast('Failed to load Image B');
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* If both images loaded */}
            {imgA && imgB ? (
              <>
                {/* Orientation buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCombineOrientation('v')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      combineOrientation === 'v'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    Side-by-Side (Left / Right)
                  </button>
                  <button
                    onClick={() => setCombineOrientation('h')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      combineOrientation === 'h'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    Stacked (Top / Bottom)
                  </button>
                </div>

                {/* Canvas Preview */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center min-h-[240px]">
                  <canvas
                    ref={combineCanvasRef}
                    onPointerDown={handleCombinePointerDown}
                    onPointerMove={handleCombinePointerMove}
                    onPointerUp={handleCombinePointerUp}
                    className="max-h-[50vh] w-auto max-w-full cursor-grab active:cursor-grabbing rounded-lg object-contain touch-none"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-medium text-white border border-slate-700 shadow-lg">
                    Drag seam on canvas to adjust ratio
                  </div>
                </div>

                {/* Slider & Presets */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>More Image A</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{combinePct}%</span>
                    <span>More Image B</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={combinePct}
                    onChange={(e) => setCombinePct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex gap-2">
                    {[25, 50, 75].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setCombinePct(pct)}
                        className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 transition-colors"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={downloadCombinedImage}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" /> Save Combined Image
                  </button>
                  <button
                    onClick={copyCombinedToClipboard}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-4">
                Add both Image A and Image B above to generate live combined preview.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
