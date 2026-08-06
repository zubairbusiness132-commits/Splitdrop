import React, { useState, useEffect, useRef } from 'react';
import { Crop, RotateCw, ZoomIn, ZoomOut, Download, RefreshCw } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface CropImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type AspectPreset = 'free' | '1:1' | '4:3' | '16:9' | '9:16' | 'A4' | 'instagram' | 'youtube' | 'facebook';

export const CropImageTool: React.FC<CropImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [preset, setPreset] = useState<AspectPreset>('free');
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  // Crop box coordinates in normalized percentages [0..100]
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png');

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
    const objectUrl = URL.createObjectURL(selectedFile);
    img.onload = async () => {
      setImageObj(img);
      setStage('Analyzing');
      setProgress(60);

      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);

      setCropBox({ x: 10, y: 10, width: 80, height: 80 });

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    };
    img.src = objectUrl;
  };

  const applyPresetRatio = (p: AspectPreset) => {
    setPreset(p);
    if (!imageObj) return;

    let targetRatio = 1;
    if (p === '1:1' || p === 'instagram') targetRatio = 1;
    else if (p === '4:3') targetRatio = 4 / 3;
    else if (p === '16:9' || p === 'youtube' || p === 'facebook') targetRatio = 16 / 9;
    else if (p === '9:16') targetRatio = 9 / 16;
    else if (p === 'A4') targetRatio = 1 / 1.414;
    else return;

    const imgAspect = (imageObj.naturalWidth || 800) / (imageObj.naturalHeight || 600);

    let newWidth = 80;
    let newHeight = (newWidth / targetRatio) * imgAspect;

    if (newHeight > 80) {
      newHeight = 80;
      newWidth = (newHeight * targetRatio) / imgAspect;
    }

    setCropBox({
      x: (100 - newWidth) / 2,
      y: (100 - newHeight) / 2,
      width: Math.max(10, Math.min(100, newWidth)),
      height: Math.max(10, Math.min(100, newHeight))
    });
  };

  // Generate Cropped Result
  useEffect(() => {
    if (!imageObj) return;

    const timer = setTimeout(() => {
      const origW = imageObj.naturalWidth;
      const origH = imageObj.naturalHeight;

      const cropX = (cropBox.x / 100) * origW;
      const cropY = (cropBox.y / 100) * origH;
      const cropW = (cropBox.width / 100) * origW;
      const cropH = (cropBox.height / 100) * origH;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(cropW));
      canvas.height = Math.max(1, Math.round(cropH));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      ctx.drawImage(
        imageObj,
        cropX, cropY, cropW, cropH,
        0, 0, canvas.width, canvas.height
      );
      ctx.restore();

      const mime = exportFormat === 'jpg' ? 'image/jpeg' : `image/${exportFormat}`;
      setPreviewUrl(canvas.toDataURL(mime, 0.92));
    }, 150);

    return () => clearTimeout(timer);
  }, [imageObj, cropBox, rotation, zoom, exportFormat]);

  const handleDownload = () => {
    if (!previewUrl || !file) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(85);

    setTimeout(() => {
      const link = document.createElement('a');
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'cropped';
      link.download = `${baseName}_cropped.${exportFormat}`;
      link.href = previewUrl;
      link.click();

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast('Cropped image downloaded!');
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Crop Image Online Free — SplitDrop"
        description="Free online image cropper. Crop JPG, PNG, WebP with custom aspect ratios, Instagram, YouTube, Facebook presets, zoom and rotation tools."
        canonicalPath="/crop-image.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Crop Image' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ✂️ Crop Image
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Crop photos with precision presets for social media, rotation, zoom, and live preview.
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
            {/* Aspect Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preset Ratios</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'free', label: 'Free Crop' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '4:3', label: '4:3 Standard' },
                  { id: '16:9', label: '16:9 Widescreen' },
                  { id: '9:16', label: '9:16 Story/Reels' },
                  { id: 'A4', label: 'A4 Document' },
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'youtube', label: 'YouTube Thumb' },
                  { id: 'facebook', label: 'Facebook Cover' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPresetRatio(p.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      preset === p.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation & Zoom Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-indigo-500" /> Rotate Crop ({rotation}°)
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom: {zoom}%
                </span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Interactive Canvas Crop Area */}
            <div className="relative max-h-96 overflow-hidden rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800">
              {previewUrl && (
                <div
                  className="relative transition-transform duration-200"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <img
                    src={previewUrl}
                    alt="Cropped Preview"
                    className="max-h-80 object-contain rounded-xl shadow-2xl"
                  />
                </div>
              )}
            </div>

            {/* Format & Download */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="flex items-center gap-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <option value="png">PNG Format</option>
                  <option value="jpg">JPG Format</option>
                  <option value="webp">WebP Format</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setImageObj(null);
                    setPreviewUrl(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> New File
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Cropped Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
