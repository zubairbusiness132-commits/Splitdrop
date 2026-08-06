import React, { useState, useEffect, useRef } from 'react';
import { Palette, Download, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata, rgbToHex } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface BackgroundColorChangerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type Mode = 'transparent' | 'chroma'; // transparent = replace alpha, chroma = sample solid color
type BgType = 'solid' | 'gradient' | 'blur';

export const BackgroundColorChangerTool: React.FC<BackgroundColorChangerToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<Mode>('transparent');
  const [bgType, setBgType] = useState<BgType>('solid');
  const [solidColor, setSolidColor] = useState<string>('#4F46E5');
  const [gradientStart, setGradientStart] = useState<string>('#3B82F6');
  const [gradientEnd, setGradientEnd] = useState<string>('#9333EA');
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [blurAmount, setBlurAmount] = useState<number>(20);

  // Chroma key sampling for replacing non-transparent solid bg
  const [targetKeyColor, setTargetKeyColor] = useState<string>('#FFFFFF');
  const [tolerance, setTolerance] = useState<number>(30);

  const [outputFormat, setOutputFormat] = useState<string>('png');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setProgress(70);

      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);

      if (meta.hasTransparency) {
        setMode('transparent');
      } else {
        setMode('chroma');
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    };
    img.src = url;
  };

  // Render on canvas whenever inputs change
  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = imageObj.naturalWidth || imageObj.width;
    const height = imageObj.naturalHeight || imageObj.height;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background
    if (bgType === 'solid') {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgType === 'gradient') {
      const rad = (gradientAngle * Math.PI) / 180;
      const x2 = width * Math.cos(rad);
      const y2 = height * Math.sin(rad);
      const grad = ctx.createLinearGradient(0, 0, Math.abs(x2), Math.abs(y2));
      grad.addColorStop(0, gradientStart);
      grad.addColorStop(1, gradientEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (bgType === 'blur') {
      ctx.save();
      ctx.filter = `blur(${blurAmount}px)`;
      // scale up slightly to cover canvas edges
      ctx.drawImage(imageObj, -20, -20, width + 40, height + 40);
      ctx.restore();
    }

    // 2. Draw Foreground Image
    if (mode === 'transparent') {
      ctx.drawImage(imageObj, 0, 0, width, height);
    } else {
      // Chroma key replacement mode
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(imageObj, 0, 0, width, height);
      const imgData = tempCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const rTarget = parseInt(targetKeyColor.slice(1, 3), 16) || 255;
      const gTarget = parseInt(targetKeyColor.slice(3, 5), 16) || 255;
      const bTarget = parseInt(targetKeyColor.slice(5, 7), 16) || 255;

      const maxDiff = (tolerance / 100) * 441.67; // sqrt(255^2 * 3)

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt((r - rTarget) ** 2 + (g - gTarget) ** 2 + (b - bTarget) ** 2);
        if (dist <= maxDiff) {
          data[i + 3] = 0; // replace with transparency
        }
      }

      tempCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, width, height);
    }
  }, [imageObj, mode, bgType, solidColor, gradientStart, gradientEnd, gradientAngle, blurAmount, targetKeyColor, tolerance]);

  const sampleKeyColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'chroma' || !imageObj || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(imageObj, 0, 0);
    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(p[0], p[1], p[2]);
    setTargetKeyColor(hex);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(85);

    setTimeout(() => {
      const mime = outputFormat === 'jpg' ? 'image/jpeg' : outputFormat === 'webp' ? 'image/webp' : 'image/png';
      const dataUrl = canvasRef.current?.toDataURL(mime, 0.95);
      if (dataUrl) {
        const link = document.createElement('a');
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
        link.download = `${baseName}_new_bg.${outputFormat}`;
        link.href = dataUrl;
        link.click();
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast(`Image downloaded in ${outputFormat.toUpperCase()}!`);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Background Color Changer — Replace Image BG Online — SplitDrop"
        description="Free online background color changer. Replace transparent or solid photo backgrounds with solid colors, gradients, or blur effects instantly."
        canonicalPath="/background-color-changer.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Background Color Changer' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🎨 Background Color Changer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Replace photo backgrounds with custom HEX/RGB solid colors, smooth gradients, or soft ambient blur.
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Options Panel */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              {/* Mode Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Source Background Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('transparent')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'transparent'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Transparent PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('chroma')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'chroma'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Solid BG Key
                  </button>
                </div>
              </div>

              {/* Chroma Key Controls */}
              {mode === 'chroma' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Target BG Color to Remove</span>
                    <input
                      type="color"
                      value={targetKeyColor}
                      onChange={(e) => setTargetKeyColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Click on canvas image to sample background color directly.</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Tolerance</span>
                      <span>{tolerance}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={tolerance}
                      onChange={(e) => setTolerance(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* New BG Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Background Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['solid', 'gradient', 'blur'] as BgType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBgType(t)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        bgType === t
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* BG Controls */}
              {bgType === 'solid' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Solid Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {bgType === 'gradient' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">Start Color</span>
                      <input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-full h-8 rounded-lg cursor-pointer border-0"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">End Color</span>
                      <input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-full h-8 rounded-lg cursor-pointer border-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Angle</span>
                      <span>{gradientAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={gradientAngle}
                      onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {bgType === 'blur' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Blur Strength</span>
                    <span>{blurAmount}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Format Select */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['png', 'jpg', 'webp'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase cursor-pointer ${
                        outputFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Preview & Actions */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 mb-2 block">Live Canvas Preview</span>
                <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <canvas
                    ref={canvasRef}
                    onClick={sampleKeyColor}
                    className="max-h-80 object-contain rounded-xl cursor-crosshair"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
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
                  <Download className="w-4 h-4" /> Download Result ({outputFormat.toUpperCase()})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
