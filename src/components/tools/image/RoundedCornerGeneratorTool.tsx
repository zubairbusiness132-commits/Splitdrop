import React, { useState, useEffect, useRef } from 'react';
import { Circle, Square, Lock, Unlock, Download, RefreshCw } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface RoundedCornerGeneratorToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const RoundedCornerGeneratorTool: React.FC<RoundedCornerGeneratorToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [isCircle, setIsCircle] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  const [radiusTL, setRadiusTL] = useState<number>(30);
  const [radiusTR, setRadiusTR] = useState<number>(30);
  const [radiusBR, setRadiusBR] = useState<number>(30);
  const [radiusBL, setRadiusBL] = useState<number>(30);

  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [transparentBg, setTransparentBg] = useState<boolean>(true);
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

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    };
    img.src = url;
  };

  const updateGlobalRadius = (val: number) => {
    setRadiusTL(val);
    setRadiusTR(val);
    setRadiusBR(val);
    setRadiusBL(val);
  };

  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const w = imageObj.naturalWidth || imageObj.width;
    const h = imageObj.naturalHeight || imageObj.height;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    if (!transparentBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.save();
    ctx.beginPath();

    if (isCircle) {
      const minDim = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      ctx.arc(cx, cy, minDim / 2, 0, Math.PI * 2);
    } else {
      const rtl = Math.min(radiusTL, w / 2, h / 2);
      const rtr = Math.min(radiusTR, w / 2, h / 2);
      const rbr = Math.min(radiusBR, w / 2, h / 2);
      const rbl = Math.min(radiusBL, w / 2, h / 2);

      ctx.moveTo(rtl, 0);
      ctx.lineTo(w - rtr, 0);
      ctx.quadraticCurveTo(w, 0, w, rtr);
      ctx.lineTo(w, h - rbr);
      ctx.quadraticCurveTo(w, h, w - rbr, h);
      ctx.lineTo(rbl, h);
      ctx.quadraticCurveTo(0, h, 0, h - rbl);
      ctx.lineTo(0, rtl);
      ctx.quadraticCurveTo(0, 0, rtl, 0);
    }

    ctx.closePath();
    ctx.clip();
    ctx.drawImage(imageObj, 0, 0, w, h);
    ctx.restore();
  }, [imageObj, isCircle, radiusTL, radiusTR, radiusBR, radiusBL, bgColor, transparentBg]);

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
        link.download = `${baseName}_rounded.${outputFormat}`;
        link.href = dataUrl;
        link.click();
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast(`Rounded image downloaded in ${outputFormat.toUpperCase()}!`);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Rounded Corner Generator — Round Photo Corners Online — SplitDrop"
        description="Free online rounded corner generator for photos. Customize individual corner radii, create circle crops or rounded rectangles with transparent or color background."
        canonicalPath="/rounded-corners.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Rounded Corner Generator' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ⭕ Rounded Corner Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Smooth photo corners, create circular avatars, or adjust individual corner radii with live canvas preview.
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
            {/* Controls */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shape Mode</span>
                <button
                  type="button"
                  onClick={() => setIsCircle(!isCircle)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    isCircle ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isCircle ? <Circle className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  {isCircle ? 'Circle Avatar Mode' : 'Custom Corners'}
                </button>
              </div>

              {!isCircle && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Lock All Corners</span>
                    <button
                      type="button"
                      onClick={() => setIsLocked(!isLocked)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 cursor-pointer"
                    >
                      {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                  </div>

                  {isLocked ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>All Corners Radius</span>
                        <span>{radiusTL}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="250"
                        value={radiusTL}
                        onChange={(e) => updateGlobalRadius(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-400 text-[10px]">Top-Left ({radiusTL}px)</span>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          value={radiusTL}
                          onChange={(e) => setRadiusTL(parseInt(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px]">Top-Right ({radiusTR}px)</span>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          value={radiusTR}
                          onChange={(e) => setRadiusTR(parseInt(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px]">Bottom-Left ({radiusBL}px)</span>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          value={radiusBL}
                          onChange={(e) => setRadiusBL(parseInt(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 text-[10px]">Bottom-Right ({radiusBR}px)</span>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          value={radiusBR}
                          onChange={(e) => setRadiusBR(parseInt(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Background Options */}
              <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Transparent Background</span>
                  <input
                    type="checkbox"
                    checked={transparentBg}
                    onChange={(e) => {
                      setTransparentBg(e.target.checked);
                      if (!e.target.checked && outputFormat === 'png') setOutputFormat('jpg');
                    }}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                {!transparentBg && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Corner Fill Color</span>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                )}
              </div>

              {/* Output Format */}
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

            {/* Preview */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 mb-2 block">Interactive Preview</span>
                <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <canvas ref={canvasRef} className="max-h-80 object-contain rounded-xl" />
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
                  <Download className="w-4 h-4" /> Download Rounded Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
