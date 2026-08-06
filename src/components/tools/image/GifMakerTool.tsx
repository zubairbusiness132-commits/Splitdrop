import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, RefreshCw, Film, Trash2, Repeat, MoveHorizontal } from 'lucide-react';
import { GifWriter } from 'omggif';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface GifMakerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface FrameItem {
  id: string;
  file: File;
  img: HTMLImageElement;
}

type Direction = 'forward' | 'reverse' | 'bounce';

export const GifMakerTool: React.FC<GifMakerToolProps> = ({ onShowToast, onNavigate }) => {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [frameDelay, setFrameDelay] = useState<number>(300); // in ms
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(400);
  const [direction, setDirection] = useState<Direction>('forward');

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);

  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(20);

    const newFrames: FrameItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = url;
      });
      newFrames.push({ id: Math.random().toString(36).substring(2, 9), file, img });
    }

    if (newFrames.length > 0 && frames.length === 0) {
      const first = newFrames[0].img;
      const w = first.naturalWidth || first.width;
      const h = first.naturalHeight || first.height;
      const aspect = w / h;
      setWidth(400);
      setHeight(Math.round(400 / aspect));
    }

    setFrames((prev) => [...prev, ...newFrames]);
    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
  };

  const removeFrame = (id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  // Get active frame sequence based on direction
  const getSequence = () => {
    if (!frames.length) return [];
    if (direction === 'reverse') return [...frames].reverse();
    if (direction === 'bounce') return [...frames, ...[...frames].slice(1, -1).reverse()];
    return frames;
  };

  // Live player loop
  useEffect(() => {
    const seq = getSequence();
    if (!seq.length || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentFrameIdx((prev) => (prev + 1) % seq.length);
    }, frameDelay);

    return () => clearInterval(timer);
  }, [frames, direction, frameDelay, isPlaying]);

  // Render current frame to canvas preview
  useEffect(() => {
    const seq = getSequence();
    if (!seq.length || !canvasRef.current) return;
    const activeFrame = seq[currentFrameIdx % seq.length];
    if (!activeFrame) return;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const imgW = activeFrame.img.naturalWidth || activeFrame.img.width;
    const imgH = activeFrame.img.naturalHeight || activeFrame.img.height;
    const scale = Math.min(width / imgW, height / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const x = (width - renderW) / 2;
    const y = (height - renderH) / 2;

    ctx.drawImage(activeFrame.img, x, y, renderW, renderH);
  }, [frames, direction, currentFrameIdx, width, height]);

  // Encode GIF using omggif
  const handleGenerateGif = async () => {
    const seq = getSequence();
    if (!seq.length) return;

    setIsProcessing(true);
    setStage('Encoding GIF Frames');
    setProgress(20);

    try {
      const buffer = new Uint8Array(width * height * seq.length * 5 + 1024);
      const writer = new GifWriter(buffer, width, height, { loop: 0 });

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context error');

      const delayCentiseconds = Math.max(1, Math.round(frameDelay / 10));

      for (let i = 0; i < seq.length; i++) {
        setStage('Optimizing');
        setProgress(20 + Math.round(((i + 1) / seq.length) * 70));

        const frame = seq[i];
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        const imgW = frame.img.naturalWidth || frame.img.width;
        const imgH = frame.img.naturalHeight || frame.img.height;
        const scale = Math.min(width / imgW, height / imgH);
        const renderW = imgW * scale;
        const renderH = imgH * scale;
        const x = (width - renderW) / 2;
        const y = (height - renderH) / 2;
        ctx.drawImage(frame.img, x, y, renderW, renderH);

        const imgData = ctx.getImageData(0, 0, width, height).data;

        // Simple 256 color quantizer mapping
        const palette: number[] = [];
        const indexedPixels = new Uint8Array(width * height);

        for (let p = 0; p < imgData.length; p += 4) {
          const r = imgData[p];
          const g = imgData[p + 1];
          const b = imgData[p + 2];

          // Quantize RGB to 256 colors (3 bits R, 3 bits G, 2 bits B)
          const rQuant = (r >> 5) & 7;
          const gQuant = (g >> 5) & 7;
          const bQuant = (b >> 6) & 3;
          const colorIndex = (rQuant << 5) | (gQuant << 2) | bQuant;

          if (palette[colorIndex] === undefined) {
            // Reconstruct RGB integer color
            const rFull = (rQuant * 255) / 7;
            const gFull = (gQuant * 255) / 7;
            const bFull = (bQuant * 255) / 3;
            palette[colorIndex] = (rFull << 16) | (gFull << 8) | bFull;
          }

          indexedPixels[p / 4] = colorIndex;
        }

        // Ensure palette is padded to 256 entries
        const fullPalette = new Array(256).fill(0);
        palette.forEach((col, idx) => {
          fullPalette[idx] = col;
        });

        writer.addFrame(0, 0, width, height, Array.from(indexedPixels), {
          delay: delayCentiseconds,
          palette: fullPalette
        });
      }

      const gifBytes = buffer.subarray(0, writer.end());
      const blob = new Blob([gifBytes], { type: 'image/gif' });
      setGeneratedBlob(blob);

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast('Animated GIF created successfully!');
    } catch (err) {
      setIsProcessing(false);
      onShowToast('Failed to compile GIF frames.');
    }
  };

  const handleDownload = () => {
    if (!generatedBlob) {
      handleGenerateGif();
      return;
    }
    const url = URL.createObjectURL(generatedBlob);
    const link = document.createElement('a');
    link.download = `animated_${Date.now()}.gif`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded GIF!');
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="GIF Maker — Create Animated GIFs Online — SplitDrop"
        description="Free online GIF maker. Convert photo sequences into smooth animated GIFs with custom speed, dimensions, loop & bounce directions."
        canonicalPath="/gif-maker.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'GIF Maker' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🎬 GIF Maker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Combine photo frames into animated GIFs with custom speed, frame sizing, and loop direction controls.
        </p>
      </div>

      {frames.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} title="Drop multiple frames to create GIF animation" />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Frame Delay (Speed)</span>
                  <span className="text-indigo-600">{frameDelay}ms</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={frameDelay}
                  onChange={(e) => setFrameDelay(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-500 text-[10px]">Width (px)</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(50, parseInt(e.target.value) || 100))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[10px]">Height (px)</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(50, parseInt(e.target.value) || 100))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Play Direction */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Play Order</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['forward', 'reverse', 'bounce'] as Direction[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDirection(d)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                        direction === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add More Frames */}
              <div className="pt-2">
                <label
                  htmlFor="add-gif-frames"
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Film className="w-4 h-4 text-indigo-500" /> Add More Frames ({frames.length})
                </label>
                <input
                  id="add-gif-frames"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleImageSelected(Array.from(e.target.files));
                  }}
                />
              </div>
            </div>

            {/* Animation Preview */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Interactive GIF Player</span>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause' : 'Play Animation'}
                  </button>
                </div>

                <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <canvas ref={canvasRef} className="max-h-80 object-contain rounded-xl" />
                </div>

                {/* Frames Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2">
                  {frames.map((item, idx) => (
                    <div key={item.id} className="relative group shrink-0">
                      <img
                        src={item.img.src}
                        alt="Frame"
                        className={`w-12 h-12 rounded-xl object-cover border-2 ${
                          currentFrameIdx === idx ? 'border-indigo-500 scale-105' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFrame(item.id)}
                        className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-600 text-white cursor-pointer opacity-90 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setFrames([])}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Frames
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Animated .GIF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
