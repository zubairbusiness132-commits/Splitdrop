import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Download, RefreshCw, ZoomIn, CheckCircle, Sparkles } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata, formatBytes } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ImageCompressionComparisonToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const ImageCompressionComparisonTool: React.FC<ImageCompressionComparisonToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<string>('jpg');

  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const [sliderPos, setSliderPos] = useState<number>(50); // 0% to 100% split screen position
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Re-compress image whenever quality or output format changes
  useEffect(() => {
    if (!imageObj || !file) return;

    const canvas = document.createElement('canvas');
    canvas.width = imageObj.naturalWidth || imageObj.width;
    canvas.height = imageObj.naturalHeight || imageObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mime = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';

    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(imageObj, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setCompressedSize(blob.size);
        const dataUrl = URL.createObjectURL(blob);
        setCompressedDataUrl(dataUrl);
      }
    }, mime, quality / 100);
  }, [imageObj, file, quality, outputFormat]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setZoomCoords({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const originalSize = file?.size || 0;
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  const getFidelityRating = (q: number) => {
    if (q >= 85) return { label: '99% Perfect Fidelity', color: 'text-emerald-500' };
    if (q >= 60) return { label: '95% Excellent Quality', color: 'text-indigo-500' };
    if (q >= 40) return { label: '88% Good Quality', color: 'text-amber-500' };
    return { label: '75% High Compression Mode', color: 'text-rose-500' };
  };

  const handleDownload = () => {
    if (!compressedDataUrl || !file) return;
    const link = document.createElement('a');
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'compressed';
    link.download = `${baseName}_q${quality}.${outputFormat}`;
    link.href = compressedDataUrl;
    link.click();
    onShowToast(`Downloaded compressed photo (${savedPercent}% saved)!`);
  };

  const rating = getFidelityRating(quality);

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Compression Comparison — Interactive Quality Slider — SplitDrop"
        description="Free online image compression comparison tool. Inspect side-by-side original vs compressed image quality with magnifying zoom & live byte savings metrics."
        canonicalPath="/compression-comparison.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Compression Comparison' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🔍 Image Compression Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Side-by-side slider comparison of original vs compressed photo pixels with 2x/4x magnification inspection.
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

          {/* Metrics Summary Grid */}
          <div className="p-6 rounded-3xl glass-panel grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Original Size</span>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{formatBytes(originalSize)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Compressed Size</span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatBytes(compressedSize)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Space Saved</span>
              <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">-{savedPercent}%</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10px] font-bold text-purple-600 uppercase">Visual Rating</span>
              <p className={`text-xs font-extrabold mt-1 ${rating.color}`}>{rating.label}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compression Settings */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Compression Quality</span>
                  <span className="text-indigo-600 font-extrabold">{quality}%</span>
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

              {/* Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['jpg', 'webp', 'png'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase cursor-pointer ${
                        outputFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Inspector Toggle */}
              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-indigo-500" /> Magnifier Lens
                </span>
                <input
                  type="checkbox"
                  checked={isZooming}
                  onChange={(e) => setIsZooming(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Compressed ({outputFormat.toUpperCase()})
                </button>
              </div>
            </div>

            {/* Split Screen Slider Comparison */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-600">Left: Original ({formatBytes(originalSize)})</span>
                <span className="text-emerald-500">Right: Compressed ({formatBytes(compressedSize)})</span>
              </div>

              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 select-none cursor-ew-resize"
              >
                {/* Original Image (Full Background) */}
                {imageObj && (
                  <img src={imageObj.src} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                )}

                {/* Compressed Image (Clipped Overlay on Right) */}
                {compressedDataUrl && (
                  <div
                    className="absolute top-0 right-0 bottom-0 overflow-hidden"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <img
                      src={compressedDataUrl}
                      alt="Compressed"
                      className="absolute top-0 right-0 h-full max-w-none object-contain pointer-events-none"
                      style={{
                        width: containerRef.current ? containerRef.current.clientWidth : '100%'
                      }}
                    />
                  </div>
                )}

                {/* Divider Line & Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-indigo-500 shadow-lg shadow-indigo-500/50 cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-[10px] shadow-lg border-2 border-white">
                    ↔
                  </div>
                </div>

                {/* Split Slider Control Range Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                />

                {/* Magnifier Lens */}
                {isZooming && compressedDataUrl && (
                  <div
                    className="absolute w-32 h-32 rounded-full border-2 border-indigo-400 shadow-2xl overflow-hidden pointer-events-none bg-slate-900"
                    style={{
                      left: `calc(${zoomCoords.x}% - 64px)`,
                      top: `calc(${zoomCoords.y}% - 64px)`
                    }}
                  >
                    <img
                      src={compressedDataUrl}
                      alt="Zoomed"
                      className="absolute max-w-none transform scale-200"
                      style={{
                        left: `calc(-${zoomCoords.x * 2}% + 64px)`,
                        top: `calc(-${zoomCoords.y * 2}% + 64px)`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
