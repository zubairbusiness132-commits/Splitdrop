import React, { useState, useEffect, useRef } from 'react';
import { Type, Image as ImageIcon, Download, RefreshCw, Sliders } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface WatermarkImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'repeat';

export const WatermarkImageTool: React.FC<WatermarkImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [type, setType] = useState<WatermarkType>('text');

  // Text options
  const [wmText, setWmText] = useState<string>('CONFIDENTIAL');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [fontSize, setFontSize] = useState<number>(48);
  const [shadow, setShadow] = useState<boolean>(true);

  // Image watermark options
  const [wmImageFile, setWmImageFile] = useState<File | null>(null);
  const [wmImageObj, setWmImageObj] = useState<HTMLImageElement | null>(null);

  // Common options
  const [opacity, setOpacity] = useState<number>(50); // 0..100
  const [rotation, setRotation] = useState<number>(-30); // degrees
  const [position, setPosition] = useState<Position>('repeat');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

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

  const handleWmImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const wmFile = e.target.files[0];
      setWmImageFile(wmFile);
      const img = new Image();
      const url = URL.createObjectURL(wmFile);
      img.onload = () => setWmImageObj(img);
      img.src = url;
    }
  };

  // Render Watermark Canvas
  useEffect(() => {
    if (!imageObj) return;

    const timer = setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = imageObj.naturalWidth || imageObj.width;
      canvas.height = imageObj.naturalHeight || imageObj.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw base image
      ctx.drawImage(imageObj, 0, 0);

      ctx.save();
      ctx.globalAlpha = opacity / 100;

      if (type === 'text' && wmText) {
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        if (shadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 8;
        }

        const textMetrics = ctx.measureText(wmText);
        const textWidth = textMetrics.width;

        if (position === 'repeat') {
          const gapX = textWidth + 120;
          const gapY = fontSize + 120;
          for (let x = -canvas.width; x < canvas.width * 2; x += gapX) {
            for (let y = -canvas.height; y < canvas.height * 2; y += gapY) {
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate((rotation * Math.PI) / 180);
              ctx.fillText(wmText, 0, 0);
              ctx.restore();
            }
          }
        } else {
          let posX = canvas.width / 2;
          let posY = canvas.height / 2;

          if (position === 'top-left') { posX = 40; posY = fontSize + 40; }
          else if (position === 'top-right') { posX = canvas.width - textWidth - 40; posY = fontSize + 40; }
          else if (position === 'bottom-left') { posX = 40; posY = canvas.height - 40; }
          else if (position === 'bottom-right') { posX = canvas.width - textWidth - 40; posY = canvas.height - 40; }

          ctx.translate(posX, posY);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(wmText, 0, 0);
        }
      } else if (type === 'image' && wmImageObj) {
        const wmW = (wmImageObj.width * fontSize) / 50;
        const wmH = (wmImageObj.height * fontSize) / 50;

        if (position === 'repeat') {
          for (let x = 0; x < canvas.width; x += wmW + 100) {
            for (let y = 0; y < canvas.height; y += wmH + 100) {
              ctx.save();
              ctx.translate(x + wmW / 2, y + wmH / 2);
              ctx.rotate((rotation * Math.PI) / 180);
              ctx.drawImage(wmImageObj, -wmW / 2, -wmH / 2, wmW, wmH);
              ctx.restore();
            }
          }
        } else {
          let posX = canvas.width / 2;
          let posY = canvas.height / 2;

          if (position === 'top-left') { posX = wmW / 2 + 30; posY = wmH / 2 + 30; }
          else if (position === 'top-right') { posX = canvas.width - wmW / 2 - 30; posY = wmH / 2 + 30; }
          else if (position === 'bottom-left') { posX = wmW / 2 + 30; posY = canvas.height - wmH / 2 - 30; }
          else if (position === 'bottom-right') { posX = canvas.width - wmW / 2 - 30; posY = canvas.height - wmH / 2 - 30; }

          ctx.translate(posX, posY);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(wmImageObj, -wmW / 2, -wmH / 2, wmW, wmH);
        }
      }

      ctx.restore();
      setPreviewUrl(canvas.toDataURL(file?.type || 'image/png'));
    }, 150);

    return () => clearTimeout(timer);
  }, [imageObj, type, wmText, textColor, fontFamily, fontSize, shadow, wmImageObj, opacity, rotation, position, file]);

  const handleDownload = () => {
    if (!previewUrl || !file) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(85);

    setTimeout(() => {
      const link = document.createElement('a');
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'watermarked';
      const ext = file.name.split('.').pop() || 'png';
      link.download = `${baseName}_watermarked.${ext}`;
      link.href = previewUrl;
      link.click();

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast('Watermarked image downloaded!');
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Watermark Image Online Free — SplitDrop"
        description="Free online image watermarker. Add custom text or image watermarks to JPG, PNG, WebP with custom opacity, rotation, shadow, fonts, and repeat tile patterns."
        canonicalPath="/image-watermark.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Watermark Image' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          💧 Watermark Image
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Protect your photos with customizable text or logo watermarks, tile repeat patterns & position controls.
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

          {/* Settings Panel */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <button
                type="button"
                onClick={() => setType('text')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  type === 'text'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Text Watermark
              </button>
              <button
                type="button"
                onClick={() => setType('image')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  type === 'image'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Logo / Image Watermark
              </button>
            </div>

            {/* Type Specific Fields */}
            {type === 'text' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Watermark Text</label>
                  <input
                    type="text"
                    value={wmText}
                    onChange={(e) => setWmText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Font</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-9 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Watermark Logo / Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWmImageSelected}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-950 dark:file:text-indigo-400 cursor-pointer"
                />
              </div>
            )}

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Opacity</span>
                  <span className="text-indigo-600">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Size</span>
                  <span className="text-indigo-600">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Rotation</span>
                  <span className="text-indigo-600">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Position Select */}
            <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Position / Pattern</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'repeat', label: 'Tile Repeat Pattern' },
                  { id: 'center', label: 'Center' },
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-right', label: 'Bottom Right' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPosition(p.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      position === p.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Canvas */}
            {previewUrl && (
              <div className="max-h-96 overflow-hidden rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800">
                <img src={previewUrl} alt="Watermarked Preview" className="max-h-80 object-contain rounded-xl shadow-lg" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setImageObj(null);
                  setPreviewUrl(null);
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
                <Download className="w-4 h-4" /> Download Watermarked Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
