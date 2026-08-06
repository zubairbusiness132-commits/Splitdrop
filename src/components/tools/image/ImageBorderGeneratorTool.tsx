import React, { useState, useEffect, useRef } from 'react';
import { Square, Download, RefreshCw, Sliders } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ImageBorderGeneratorToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'rounded';

export const ImageBorderGeneratorTool: React.FC<ImageBorderGeneratorToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [borderWidth, setBorderWidth] = useState<number>(20);
  const [borderColor, setBorderColor] = useState<string>('#4F46E5');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('solid');
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [isOuter, setIsOuter] = useState<boolean>(true); // outer expands canvas, inner overlays inside image

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

  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const imgW = imageObj.naturalWidth || imageObj.width;
    const imgH = imageObj.naturalHeight || imageObj.height;

    const bw = Math.max(0, borderWidth);

    let canvasW = imgW;
    let canvasH = imgH;

    if (isOuter) {
      canvasW += bw * 2;
      canvasH += bw * 2;
    }

    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasW, canvasH);

    const imgX = isOuter ? bw : 0;
    const imgY = isOuter ? bw : 0;

    // Draw base image
    ctx.drawImage(imageObj, imgX, imgY, imgW, imgH);

    // Draw border
    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.fillStyle = borderColor;
    ctx.lineWidth = bw;

    if (borderStyle === 'dashed') {
      ctx.setLineDash([bw * 2, bw]);
    } else if (borderStyle === 'dotted') {
      ctx.setLineDash([bw, bw]);
    } else {
      ctx.setLineDash([]);
    }

    if (borderStyle === 'rounded') {
      const rad = borderRadius;
      const bx = isOuter ? bw / 2 : bw / 2;
      const by = isOuter ? bw / 2 : bw / 2;
      const bwW = isOuter ? canvasW - bw : imgW - bw;
      const bwH = isOuter ? canvasH - bw : imgH - bw;

      ctx.beginPath();
      ctx.roundRect(bx, by, bwW, bwH, rad);
      ctx.stroke();
    } else if (borderStyle === 'double') {
      const halfBw = bw / 3;
      ctx.lineWidth = halfBw;

      // Outer line
      const b1X = isOuter ? halfBw / 2 : halfBw / 2;
      const b1Y = isOuter ? halfBw / 2 : halfBw / 2;
      const b1W = isOuter ? canvasW - halfBw : imgW - halfBw;
      const b1H = isOuter ? canvasH - halfBw : imgH - halfBw;
      ctx.strokeRect(b1X, b1Y, b1W, b1H);

      // Inner line
      const b2X = isOuter ? bw - halfBw / 2 : bw - halfBw / 2;
      const b2Y = isOuter ? bw - halfBw / 2 : bw - halfBw / 2;
      const b2W = isOuter ? canvasW - (bw - halfBw) * 2 : imgW - (bw - halfBw) * 2;
      const b2H = isOuter ? canvasH - (bw - halfBw) * 2 : imgH - (bw - halfBw) * 2;
      ctx.strokeRect(b2X, b2Y, b2W, b2H);
    } else {
      // Solid / Dashed / Dotted
      const bx = isOuter ? bw / 2 : bw / 2;
      const by = isOuter ? bw / 2 : bw / 2;
      const bwW = isOuter ? canvasW - bw : imgW - bw;
      const bwH = isOuter ? canvasH - bw : imgH - bw;
      ctx.strokeRect(bx, by, bwW, bwH);
    }

    ctx.restore();
  }, [imageObj, borderWidth, borderColor, borderStyle, borderRadius, isOuter]);

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
        link.download = `${baseName}_bordered.${outputFormat}`;
        link.href = dataUrl;
        link.click();
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast(`Bordered image downloaded in ${outputFormat.toUpperCase()}!`);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Border Generator — Add Custom Borders Online — SplitDrop"
        description="Free online image border generator. Add solid, dashed, dotted, double or rounded borders with custom width & colors to photos."
        canonicalPath="/image-border.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Image Border Generator' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🖼️ Image Border Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Add custom solid, dashed, dotted, double, or rounded borders to photos with instant color & width controls.
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
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Border Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['solid', 'dashed', 'dotted', 'double', 'rounded'] as BorderStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setBorderStyle(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                        borderStyle === st
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Expand Canvas (Outer Border)</span>
                <input
                  type="checkbox"
                  checked={isOuter}
                  onChange={(e) => setIsOuter(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Width Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Border Width</span>
                  <span className="text-indigo-600">{borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {borderStyle === 'rounded' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Corner Radius</span>
                    <span className="text-indigo-600">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="100"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Border Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Border Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
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
                <span className="text-xs font-bold text-slate-500 mb-2 block">Border Preview</span>
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
                  <Download className="w-4 h-4" /> Download Bordered Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
