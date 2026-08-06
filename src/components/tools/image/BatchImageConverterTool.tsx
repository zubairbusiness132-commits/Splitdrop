import React, { useState } from 'react';
import { RefreshCw, Download, FileCheck, Layers, FileArchive } from 'lucide-react';
import JSZip from 'jszip';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';
import { formatBytes } from '../../../lib/imageUtils';

interface BatchImageConverterToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  convertedBlob?: Blob;
  convertedDataUrl?: string;
  newSize?: number;
}

export const BatchImageConverterTool: React.FC<BatchImageConverterToolProps> = ({ onShowToast, onNavigate }) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>('webp');
  const [quality, setQuality] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Files');
  const [progress, setProgress] = useState<number>(0);

  const handleImageSelected = (files: File[]) => {
    if (!files.length) return;
    const newBatch = files.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      status: 'pending' as const
    }));
    setItems((prev) => [...prev, ...newBatch]);
  };

  const convertBatch = async () => {
    if (!items.length) return;
    setIsProcessing(true);
    setStage('Optimizing');
    setProgress(10);

    const mime = targetFormat === 'png' ? 'image/png' : targetFormat === 'jpg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      item.status = 'processing';
      setItems([...updatedItems]);

      try {
        const blob = await convertSingleFile(item.file, mime, quality / 100);
        item.convertedBlob = blob;
        item.newSize = blob.size;
        item.convertedDataUrl = URL.createObjectURL(blob);
        item.status = 'done';
      } catch (e) {
        item.status = 'error';
      }

      setProgress(Math.round(((i + 1) / updatedItems.length) * 90));
      setItems([...updatedItems]);
    }

    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
    onShowToast(`Successfully converted ${items.length} images to ${targetFormat.toUpperCase()}!`);
  };

  const convertSingleFile = (file: File, mimeType: string, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas error');

        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject('Blob error');
        }, mimeType, q);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject('Image load failed');
      };
      img.src = url;
    });
  };

  const handleDownloadZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.convertedBlob);
    if (!doneItems.length) {
      await convertBatch();
      return;
    }

    setIsProcessing(true);
    setStage('Compressing ZIP');
    setProgress(50);

    const zip = new JSZip();
    doneItems.forEach((it) => {
      const baseName = it.file.name.substring(0, it.file.name.lastIndexOf('.')) || 'converted';
      zip.file(`${baseName}.${targetFormat}`, it.convertedBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `batch_converted_${targetFormat}.zip`;
    link.click();

    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
    onShowToast('Batch ZIP downloaded!');
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Batch Image Converter — Convert Multiple Photos Online — SplitDrop"
        description="Free online batch image converter. Convert multiple photos to PNG, JPG, WebP, BMP, AVIF instantly with bulk ZIP download."
        canonicalPath="/batch-image-converter.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Batch Image Converter' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ⚡ Batch Image Converter
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Convert dozens of photos simultaneously into PNG, JPG, WebP, BMP or AVIF with one-click bulk ZIP export.
        </p>
      </div>

      {items.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} title="Drop multiple images or folder batch" />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Conversion Bar */}
          <div className="p-6 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Format</span>
                <div className="flex items-center gap-1.5">
                  {['webp', 'png', 'jpg', 'bmp', 'avif'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setTargetFormat(fmt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer ${
                        targetFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {(targetFormat === 'jpg' || targetFormat === 'webp') && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Quality</span>
                    <span className="text-indigo-600">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-32 accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={convertBatch}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Start Conversion ({items.length})
              </button>

              <button
                type="button"
                onClick={handleDownloadZip}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <FileArchive className="w-4 h-4" /> Download ZIP
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6 rounded-3xl glass-panel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              <span className="text-xs font-bold text-slate-500 uppercase">File List ({items.length})</span>
              <button
                type="button"
                onClick={() => setItems([])}
                className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Clear List
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{it.file.name}</span>
                      <span className="text-[10px] text-slate-500">{formatBytes(it.file.size)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {it.status === 'done' && (
                      <>
                        <span className="text-xs font-mono text-emerald-500 font-bold">{formatBytes(it.newSize || 0)}</span>
                        <a
                          href={it.convertedDataUrl}
                          download={`${it.file.name.substring(0, it.file.name.lastIndexOf('.'))}.${targetFormat}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Save
                        </a>
                      </>
                    )}

                    {it.status === 'pending' && <span className="text-xs text-slate-400 font-bold">Ready</span>}
                    {it.status === 'processing' && <span className="text-xs text-indigo-500 font-bold animate-pulse">Converting...</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
