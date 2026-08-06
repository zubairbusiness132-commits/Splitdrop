import React, { useState, useEffect, useRef } from 'react';
import { Layout, Download, RefreshCw, Type, Sparkles } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ImageFrameGeneratorToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type FrameStyle = 'polaroid' | 'shadow' | 'minimal' | 'rounded' | 'glass' | 'instagram' | 'white' | 'black';

export const ImageFrameGeneratorTool: React.FC<ImageFrameGeneratorToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [frameStyle, setFrameStyle] = useState<FrameStyle>('polaroid');
  const [caption, setCaption] = useState<string>('Memories ✨');
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (frameStyle === 'polaroid') {
      const paddingSide = Math.round(imgW * 0.08);
      const paddingTop = Math.round(imgH * 0.08);
      const paddingBottom = Math.round(imgH * 0.28);

      canvas.width = imgW + paddingSide * 2;
      canvas.height = imgH + paddingTop + paddingBottom;

      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0,0,0,0.12)';
      ctx.shadowBlur = 20;
      ctx.drawImage(imageObj, paddingSide, paddingTop, imgW, imgH);
      ctx.shadowColor = 'transparent';

      if (caption) {
        ctx.fillStyle = '#1E293B';
        ctx.font = `bold ${Math.max(16, Math.round(paddingBottom * 0.3))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(caption, canvas.width / 2, canvas.height - paddingBottom * 0.35);
      }
    } else if (frameStyle === 'shadow') {
      const pad = Math.round(Math.min(imgW, imgH) * 0.12);
      canvas.width = imgW + pad * 2;
      canvas.height = imgH + pad * 2;

      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = Math.round(pad * 0.8);
      ctx.shadowOffsetY = Math.round(pad * 0.3);
      ctx.drawImage(imageObj, pad, pad, imgW, imgH);
    } else if (frameStyle === 'minimal') {
      const border = Math.round(Math.min(imgW, imgH) * 0.04);
      canvas.width = imgW + border * 2;
      canvas.height = imgH + border * 2;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(imageObj, border, border, imgW, imgH);

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    } else if (frameStyle === 'rounded') {
      const pad = Math.round(Math.min(imgW, imgH) * 0.08);
      const rad = Math.round(pad * 1.2);
      canvas.width = imgW + pad * 2;
      canvas.height = imgH + pad * 2;

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pad, pad, imgW, imgH, rad);
      ctx.clip();
      ctx.drawImage(imageObj, pad, pad, imgW, imgH);
      ctx.restore();
    } else if (frameStyle === 'glass') {
      const pad = Math.round(Math.min(imgW, imgH) * 0.15);
      canvas.width = imgW + pad * 2;
      canvas.height = imgH + pad * 2;

      // Draw blurred image as background
      ctx.save();
      ctx.filter = 'blur(30px) brightness(0.9)';
      ctx.drawImage(imageObj, -20, -20, canvas.width + 40, canvas.height + 40);
      ctx.restore();

      // Semi-transparent frosted glass overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 24;
      ctx.drawImage(imageObj, pad, pad, imgW, imgH);
    } else if (frameStyle === 'instagram') {
      const side = Math.max(imgW, imgH) + Math.round(Math.max(imgW, imgH) * 0.3);
      canvas.width = side;
      canvas.height = side;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, side, side);

      // Header handle
      ctx.fillStyle = '#0F172A';
      ctx.font = `bold ${Math.round(side * 0.035)}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('@splitdrop_app', Math.round(side * 0.05), Math.round(side * 0.08));

      const imgX = (side - imgW) / 2;
      const imgY = Math.round(side * 0.12);
      ctx.drawImage(imageObj, imgX, imgY, imgW, imgH);

      // Footer likes & caption
      ctx.fillStyle = '#64748B';
      ctx.font = `${Math.round(side * 0.028)}px sans-serif`;
      ctx.fillText('❤️ 1,284 likes', Math.round(side * 0.05), imgY + imgH + Math.round(side * 0.05));
      ctx.fillStyle = '#0F172A';
      ctx.fillText(caption || 'Shared via SplitDrop Tool Suite', Math.round(side * 0.05), imgY + imgH + Math.round(side * 0.09));
    } else if (frameStyle === 'white') {
      const pad = Math.round(Math.min(imgW, imgH) * 0.15);
      canvas.width = imgW + pad * 2;
      canvas.height = imgH + pad * 2;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.strokeRect(pad - 1, pad - 1, imgW + 2, imgH + 2);
      ctx.drawImage(imageObj, pad, pad, imgW, imgH);
    } else if (frameStyle === 'black') {
      const pad = Math.round(Math.min(imgW, imgH) * 0.15);
      canvas.width = imgW + pad * 2;
      canvas.height = imgH + pad * 2;

      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = 1;
      ctx.strokeRect(pad - 1, pad - 1, imgW + 2, imgH + 2);
      ctx.drawImage(imageObj, pad, pad, imgW, imgH);
    }
  }, [imageObj, frameStyle, caption]);

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
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'framed';
        link.download = `${baseName}_framed.${outputFormat}`;
        link.href = dataUrl;
        link.click();
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast(`Framed image downloaded in ${outputFormat.toUpperCase()}!`);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Frame Generator — Polaroid, Shadow & Art Frames — SplitDrop"
        description="Free online image frame generator. Add Polaroid, Shadow, Glass, Minimal, Instagram, White Gallery & Black frames with custom caption text to photos."
        canonicalPath="/image-frame.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Image Frame Generator' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          📸 Image Frame Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Transform ordinary photos into Polaroid, Shadow, Frosted Glass, or Art Gallery framed masterpieces.
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
            {/* Options */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Frame Preset Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'polaroid', label: '📷 Polaroid' },
                    { id: 'shadow', label: '🌤️ Soft Shadow' },
                    { id: 'glass', label: '✨ Frosted Glass' },
                    { id: 'instagram', label: '📱 Instagram' },
                    { id: 'minimal', label: '▫️ Minimal' },
                    { id: 'rounded', label: '🔳 Dark Rounded' },
                    { id: 'white', label: '⚪ White Gallery' },
                    { id: 'black', label: '🖤 Black Gallery' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFrameStyle(item.id as FrameStyle)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                        frameStyle === item.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {(frameStyle === 'polaroid' || frameStyle === 'instagram') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-500" /> Caption Text
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter frame text..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
              )}

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
                <span className="text-xs font-bold text-slate-500 mb-2 block">Framed Preview</span>
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
                  <Download className="w-4 h-4" /> Download Framed Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
