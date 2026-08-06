import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Download, Lock, Unlock, ArrowLeft } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ImageResizerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const ImageResizerTool: React.FC<ImageResizerToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [percentage, setPercentage] = useState<number>(50);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1.3333);

  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp' | 'bmp'>('png');
  const [quality, setQuality] = useState<number>(90);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | undefined>(undefined);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(20);

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    img.onload = async () => {
      setImageObj(img);
      setStage('Analyzing');
      setProgress(50);

      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);

      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      setWidth(origW);
      setHeight(origH);
      setAspectRatio(origW / origH);

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    };
    img.src = objectUrl;
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && aspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && aspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handlePercentageChange = (val: number) => {
    setPercentage(val);
    if (imageObj) {
      const origW = imageObj.naturalWidth || imageObj.width;
      const origH = imageObj.naturalHeight || imageObj.height;
      setWidth(Math.round((origW * val) / 100));
      setHeight(Math.round((origH * val) / 100));
    }
  };

  // Generate preview
  useEffect(() => {
    if (!imageObj || width <= 0 || height <= 0) return;

    const timer = setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageObj, 0, 0, width, height);

      const mime = exportFormat === 'jpg' ? 'image/jpeg' : `image/${exportFormat}`;
      const dataUrl = canvas.toDataURL(mime, quality / 100);
      setPreviewUrl(dataUrl);

      // Estimate byte size from base64
      const head = `data:${mime};base64,`;
      const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setProcessedSize(sizeInBytes);
    }, 150);

    return () => clearTimeout(timer);
  }, [imageObj, width, height, exportFormat, quality]);

  const handleDownload = () => {
    if (!previewUrl || !file) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(80);

    setTimeout(() => {
      const link = document.createElement('a');
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
      link.download = `${baseName}_resized_${width}x${height}.${exportFormat}`;
      link.href = previewUrl;
      link.click();

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 400);
      onShowToast('Resized image downloaded!');
    }, 300);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Resizer — Resize JPG, PNG, WebP Online Free"
        description="Free online image resizer. Resize images by exact pixels, width, height, or percentage. Lock aspect ratio & instant browser download with zero server uploads."
        canonicalPath="/image-resizer.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Image Resizer' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          📐 Image Resizer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Resize JPG, PNG, WebP, AVIF & GIF images by custom width, height, or percentage in seconds.
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
              processedSize={processedSize}
              format={metadata.format}
              width={width}
              height={height}
              colorProfile={metadata.colorDepth}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Controls Panel */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResizeMode('dimensions')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    resizeMode === 'dimensions'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  By Dimensions (px)
                </button>
                <button
                  type="button"
                  onClick={() => setResizeMode('percentage')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    resizeMode === 'percentage'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  By Percentage (%)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  lockAspect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
              </button>
            </div>

            {/* Inputs Grid */}
            {resizeMode === 'dimensions' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Width (pixels)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Height (pixels)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Resize Percentage</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{percentage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={percentage}
                  onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Resized size: {width} × {height} px
                </p>
              </div>
            )}

            {/* Export Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Output Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="png">PNG (Lossless & Alpha)</option>
                  <option value="jpg">JPG (High Compression)</option>
                  <option value="webp">WebP (Modern Compact)</option>
                  <option value="bmp">BMP (Bitmap)</option>
                </select>
              </div>

              {exportFormat !== 'png' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Quality</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setMetadata(null);
                  setImageObj(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Select Different Image
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Resized Image
              </button>
            </div>
          </div>

          {/* Live Preview Canvas */}
          {previewUrl && (
            <div className="p-6 rounded-3xl glass-card space-y-3 text-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Preview</h4>
              <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950/20 p-2 flex items-center justify-center border border-slate-200/40 dark:border-slate-800/40">
                <img src={previewUrl} alt="Resized Preview" className="max-h-80 object-contain rounded-xl shadow-lg" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
