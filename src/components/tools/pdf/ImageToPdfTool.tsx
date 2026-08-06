import React, { useState } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { Upload, ArrowUp, ArrowDown, Trash2, FileCheck, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { formatBytes } from '../../../lib/pdfUtils';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const ImageToPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [images, setImages] = useState<ImageItem[]>([]);
  
  // Options
  const [paperSize, setPaperSize] = useState<'A4' | 'Letter'>('A4');
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>('Portrait');
  const [margin, setMargin] = useState<'None' | 'Small' | 'Large'>('Small');
  const [fitMode, setFitMode] = useState<'Contain' | 'Cover' | 'Fill'>('Contain');
  const [compression, setCompression] = useState<number>(0.85);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  const handleFilesAdded = (files: FileList | File[]) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'];
    const selected = Array.from(files).filter(f => validTypes.includes(f.type) || /\.(jpe?g|png|webp|bmp|gif)$/i.test(f.name));

    if (selected.length === 0) {
      onShowToast('Please select valid image files (JPG, PNG, WebP, BMP, GIF)');
      return;
    }

    const newItems: ImageItem[] = selected.map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl: URL.createObjectURL(f)
    }));

    setImages(prev => [...prev, ...newItems]);
    onShowToast(`Added ${newItems.length} image(s)`);
  };

  const moveImage = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setImages(copy);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const resetAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setIsProcessing(false);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(15);

    try {
      await new Promise(r => setTimeout(r, 200));
      setStage('Analyzing');
      setProgress(35);

      const pdfDoc = await PDFDocument.create();

      // Determine dimensions
      let baseWidth = paperSize === 'A4' ? PageSizes.A4[0] : PageSizes.Letter[0];
      let baseHeight = paperSize === 'A4' ? PageSizes.A4[1] : PageSizes.Letter[1];

      if (orientation === 'Landscape') {
        const tmp = baseWidth;
        baseWidth = baseHeight;
        baseHeight = tmp;
      }

      const marginPx = margin === 'None' ? 0 : margin === 'Small' ? 20 : 40;

      setStage('Processing');
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const pct = Math.round(35 + ((i + 1) / images.length) * 45);
        setProgress(pct);

        const imgBuffer = await item.file.arrayBuffer();
        let pdfImg;

        try {
          if (item.file.type === 'image/png' || item.file.name.endsWith('.png')) {
            pdfImg = await pdfDoc.embedPng(imgBuffer);
          } else {
            pdfImg = await pdfDoc.embedJpg(imgBuffer);
          }
        } catch {
          // Canvas fallback conversion to JPEG
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
            img.src = item.previewUrl;
          });
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 600;
          if (ctx) ctx.drawImage(img, 0, 0);
          const convertedDataUrl = canvas.toDataURL('image/jpeg', compression);
          const res = await fetch(convertedDataUrl);
          const convertedBuf = await res.arrayBuffer();
          pdfImg = await pdfDoc.embedJpg(convertedBuf);
        }

        const page = pdfDoc.addPage([baseWidth, baseHeight]);
        const availWidth = baseWidth - marginPx * 2;
        const availHeight = baseHeight - marginPx * 2;

        let drawW = availWidth;
        let drawH = availHeight;
        let drawX = marginPx;
        let drawY = marginPx;

        const imgRatio = pdfImg.width / pdfImg.height;
        const pageRatio = availWidth / availHeight;

        if (fitMode === 'Contain') {
          if (imgRatio > pageRatio) {
            drawW = availWidth;
            drawH = availWidth / imgRatio;
          } else {
            drawH = availHeight;
            drawW = availHeight * imgRatio;
          }
          drawX = marginPx + (availWidth - drawW) / 2;
          drawY = marginPx + (availHeight - drawH) / 2;
        } else if (fitMode === 'Cover') {
          if (imgRatio > pageRatio) {
            drawH = availHeight;
            drawW = availHeight * imgRatio;
          } else {
            drawW = availWidth;
            drawH = availWidth / imgRatio;
          }
          drawX = marginPx + (availWidth - drawW) / 2;
          drawY = marginPx + (availHeight - drawH) / 2;
        }

        page.drawImage(pdfImg, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH
        });
      }

      setStage('Preparing Download');
      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Images_to_PDF_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('PDF created and downloaded successfully!');
    } catch (err) {
      console.error('Image to PDF error:', err);
      onShowToast('Failed to convert images to PDF');
    } finally {
      setTimeout(() => setIsProcessing(false), 800);
    }
  };

  const totalInputSize = images.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🖼️</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('imageToPdfTitle', 'Image to PDF Converter')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('imageToPdfSubtitle', 'Convert JPG, PNG, WebP, BMP, and GIF images to a clean PDF document instantly with zero uploads.')}
        </p>
      </div>

      {/* Drop Zone */}
      {images.length === 0 ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('dropImagesHere', 'Drop images here or click to browse')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('supportsImageFormats', 'Supports JPG, PNG, WebP, BMP, GIF')}
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
          />
        </label>
      ) : (
        <div className="space-y-6">
          {/* File Information Panel */}
          <FileInformationPanel
            fileName={`${images.length} Image(s) Loaded`}
            fileSize={totalInputSize}
            pageCount={images.length}
            status={isProcessing ? stage : 'Idle'}
            statusProgress={progress}
            estimatedOutputSize={formatBytes(totalInputSize * 0.9)}
          />

          {/* Options Panel */}
          <div className="p-5 rounded-2xl glass-card space-y-4 border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" /> {t('pdfOptions', 'PDF Layout & Options')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t('paperSize', 'Paper Size')}
                </label>
                <select
                  value={paperSize}
                  onChange={e => setPaperSize(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input font-semibold"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="Letter">US Letter</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t('orientation', 'Orientation')}
                </label>
                <select
                  value={orientation}
                  onChange={e => setOrientation(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input font-semibold"
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t('margin', 'Page Margin')}
                </label>
                <select
                  value={margin}
                  onChange={e => setMargin(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input font-semibold"
                >
                  <option value="None">No Margin (0mm)</option>
                  <option value="Small">Small (10mm)</option>
                  <option value="Large">Large (20mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t('imageFit', 'Image Fit')}
                </label>
                <select
                  value={fitMode}
                  onChange={e => setFitMode(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input font-semibold"
                >
                  <option value="Contain">Contain (Fit aspect)</option>
                  <option value="Cover">Cover (Fill page)</option>
                  <option value="Fill">Fill (Stretch)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Thumbnails Reorder Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">
                Image Queue ({images.length})
              </span>
              <div className="flex items-center gap-3">
                <label className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                  + Add More
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                  />
                </label>
                <button onClick={resetAll} className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer">
                  {t('clearAll', 'Reset All')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={img.id} className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50">
                  <img src={img.previewUrl} alt="Thumbnail" className="w-14 h-14 object-cover rounded-xl border border-slate-200/80 shrink-0" />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{img.file.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{formatBytes(img.file.size)} • Page #{idx + 1}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1.5 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Progress or Download Button */}
          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={generatePdf}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              {t('convertImagesToPdf', 'Convert Images to PDF')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
