import React, { useState, useEffect, useRef } from 'react';
import { Grid, LayoutGrid, Download, RefreshCw, Trash2, ArrowLeftRight, Plus } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ImageCollageMakerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type CollageLayout = 'grid' | 'masonry' | 'vertical' | 'horizontal';

interface ImageItem {
  id: string;
  file: File;
  img: HTMLImageElement;
}

export const ImageCollageMakerTool: React.FC<ImageCollageMakerToolProps> = ({ onShowToast, onNavigate }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [layout, setLayout] = useState<CollageLayout>('grid');
  const [gap, setGap] = useState<number>(12);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [cornerRadius, setCornerRadius] = useState<number>(16);
  const [canvasWidth, setCanvasWidth] = useState<number>(1200);

  const [outputFormat, setOutputFormat] = useState<string>('png');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(20);

    const newItems: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = url;
      });
      newItems.push({ id: Math.random().toString(36).substring(2, 9), file, img });
    }

    setImages((prev) => [...prev, ...newItems]);
    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  useEffect(() => {
    if (!images.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = images.length;
    let cols = 2;
    if (layout === 'grid') {
      cols = count <= 2 ? count : count <= 4 ? 2 : count <= 9 ? 3 : 4;
    } else if (layout === 'vertical') {
      cols = 1;
    } else if (layout === 'horizontal') {
      cols = count;
    } else if (layout === 'masonry') {
      cols = 2;
    }

    const rows = Math.ceil(count / cols);
    const targetW = canvasWidth;

    const cellW = (targetW - gap * (cols + 1)) / cols;
    const cellH = cellW; // square cell or aspect cell

    const targetH = gap * (rows + 1) + cellH * rows;

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);

    images.forEach((item, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;

      const x = gap + c * (cellW + gap);
      const y = gap + r * (cellH + gap);

      ctx.save();
      ctx.beginPath();
      if (cornerRadius > 0) {
        ctx.roundRect(x, y, cellW, cellH, Math.min(cornerRadius, cellW / 2, cellH / 2));
      } else {
        ctx.rect(x, y, cellW, cellH);
      }
      ctx.clip();

      // Cover fill image inside cell
      const imgW = item.img.naturalWidth || item.img.width;
      const imgH = item.img.naturalHeight || item.img.height;
      const scale = Math.max(cellW / imgW, cellH / imgH);
      const renderW = imgW * scale;
      const renderH = imgH * scale;
      const offsetX = x + (cellW - renderW) / 2;
      const offsetY = y + (cellH - renderH) / 2;

      ctx.drawImage(item.img, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    });
  }, [images, layout, gap, bgColor, cornerRadius, canvasWidth]);

  const handleDownload = () => {
    if (!canvasRef.current || !images.length) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(85);

    setTimeout(() => {
      const mime = outputFormat === 'jpg' ? 'image/jpeg' : outputFormat === 'webp' ? 'image/webp' : 'image/png';
      const dataUrl = canvasRef.current?.toDataURL(mime, 0.95);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `collage_${Date.now()}.${outputFormat}`;
        link.href = dataUrl;
        link.click();
      }

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast(`Collage downloaded in ${outputFormat.toUpperCase()}!`);
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Collage Maker — Create Photo Grids Online — SplitDrop"
        description="Free online photo collage maker. Combine 2, 3, 4, 6, 9+ photos into custom grid, masonry, horizontal or vertical layouts with spacing & corner controls."
        canonicalPath="/image-collage.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Image Collage Maker' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🧩 Image Collage Maker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Combine multiple photos into beautiful grid, masonry, or row layouts with rounded gaps and custom background fill.
        </p>
      </div>

      {images.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} title="Drop 2 or more images to build collage" />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Collage Settings */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Layout Arrangement</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'grid', label: '🔲 Grid' },
                    { id: 'masonry', label: '📊 Masonry' },
                    { id: 'vertical', label: '☰ Vertical' },
                    { id: 'horizontal', label: '|| Horizontal' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLayout(l.id as CollageLayout)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                        layout === l.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Spacing / Gap</span>
                    <span className="text-indigo-600">{gap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={gap}
                    onChange={(e) => setGap(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Corner Radius</span>
                    <span className="text-indigo-600">{cornerRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Add More Images Button */}
              <div className="pt-2">
                <label
                  htmlFor="add-more-input"
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Plus className="w-4 h-4 text-indigo-500" /> Add More Photos ({images.length})
                </label>
                <input
                  id="add-more-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleImageSelected(Array.from(e.target.files));
                  }}
                />
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

            {/* Collage Canvas & Manage Thumbnails */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Collage Canvas Preview</span>
                  <span className="text-xs text-indigo-600 font-bold">{images.length} Images Loaded</span>
                </div>

                <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <canvas ref={canvasRef} className="max-h-80 object-contain rounded-xl" />
                </div>

                {/* Thumbnails list */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2">
                  {images.map((item) => (
                    <div key={item.id} className="relative group shrink-0">
                      <img src={item.img.src} alt="Thumb" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                      <button
                        type="button"
                        onClick={() => removeImage(item.id)}
                        className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-600 text-white cursor-pointer opacity-90 group-hover:opacity-100"
                        title="Remove Image"
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
                  onClick={() => setImages([])}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear All Photos
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Collage ({outputFormat.toUpperCase()})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
