import React, { useState, useEffect, useRef } from 'react';
import { Grid, Undo, Redo, Download, RefreshCw, Brush } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface PixelateImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const PixelateImageTool: React.FC<PixelateImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [pixelSize, setPixelSize] = useState<number>(12);
  const [brushSize, setBrushSize] = useState<number>(36);

  // Undo / Redo Stack
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(30);

    const img = new Image();
    const url = URL.createObjectURL(selectedFile);
    img.onload = async () => {
      setImageObj(img);
      setStage('Analyzing');
      setProgress(60);

      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = imageObj.naturalWidth || imageObj.width;
    canvas.height = imageObj.naturalHeight || imageObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(imageObj, 0, 0);
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, [imageObj]);

  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, data]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && canvasRef.current) {
      const prevIndex = historyIndex - 1;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[prevIndex], 0, 0);
        setHistoryIndex(prevIndex);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && canvasRef.current) {
      const nextIndex = historyIndex + 1;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[nextIndex], 0, 0);
        setHistoryIndex(nextIndex);
      }
    }
  };

  const pixelateAtPoint = (x: number, y: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = brushSize;
    const bx = Math.max(0, Math.floor(x - radius));
    const by = Math.max(0, Math.floor(y - radius));
    const bw = Math.min(canvas.width - bx, radius * 2);
    const bh = Math.min(canvas.height - by, radius * 2);

    if (bw <= 0 || bh <= 0) return;

    const size = Math.max(2, pixelSize);

    // Downscale then upscale
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.max(1, Math.floor(bw / size));
    offCanvas.height = Math.max(1, Math.floor(bh / size));
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = false;
    offCtx.drawImage(canvas, bx, by, bw, bh, 0, 0, offCanvas.width, offCanvas.height);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height, bx, by, bw, bh);
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    pixelateAtPoint(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    pixelateAtPoint(x, y);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const handleFullPixelate = () => {
    if (!canvasRef.current || !imageObj) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.max(2, pixelSize);
    const w = canvas.width;
    const h = canvas.height;

    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.floor(w / size));
    off.height = Math.max(1, Math.floor(h / size));
    const offCtx = off.getContext('2d');
    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = false;
    offCtx.drawImage(imageObj, 0, 0, off.width, off.height);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, off.width, off.height, 0, 0, w, h);
    saveCanvasState();
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(85);

    setTimeout(() => {
      const dataUrl = canvasRef.current?.toDataURL(file.type || 'image/png');
      if (dataUrl) {
        const link = document.createElement('a');
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'pixelated';
        const ext = file.name.split('.').pop() || 'png';
        link.download = `${baseName}_pixelated.${ext}`;
        link.href = dataUrl;
        link.click();
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast('Pixelated image downloaded!');
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Pixelate Image Online Free — SplitDrop"
        description="Free online pixelate tool. Censor sensitive photos, faces, or text in JPG, PNG, WebP images with custom pixel size slider & brush paint tool."
        canonicalPath="/pixelate-image.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Pixelate Image' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          👾 Pixelate Image
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Censor photos or create retro pixel art effects with interactive paint brush & slider.
        </p>
      </div>

      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          {metadata && (
            <ImageFileInfoPanel
              fileName={metadata.fileName}
              originalSize={metadata.fileSize}
              format={metadata.format}
              width={metadata.width}
              height={metadata.height}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Controls Bar */}
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFullPixelate}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Grid className="w-3.5 h-3.5" /> Pixelate Entire Image
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Pixel Block Size</span>
                  <span className="text-indigo-600">{pixelSize}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={pixelSize}
                  onChange={(e) => setPixelSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Brush Size</span>
                  <span className="text-indigo-600">{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="relative max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="max-h-80 object-contain rounded-xl cursor-crosshair"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setImageObj(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Select Different Image
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Pixelated Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
