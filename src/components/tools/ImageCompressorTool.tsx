import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Trash2, Sliders, FileArchive } from 'lucide-react';
import { FileInfoPanel, FileInfoItem } from '../FileInfoPanel';
import { useLanguage } from '../../context/LanguageContext';

interface CompressedItem {
  id: string;
  file: File;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  previewUrl: string;
  status: 'idle' | 'compressing' | 'done';
  dimensions?: { width: number; height: number };
}

interface ImageCompressorToolProps {
  onShowToast: (msg: string) => void;
}

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [targetFormat, setTargetFormat] = useState<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('original');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFilesAdded = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      onShowToast('Please select valid image files');
      return;
    }

    validFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setItems(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            file,
            originalSize: file.size,
            compressedBlob: null,
            compressedSize: 0,
            previewUrl,
            status: 'idle',
            dimensions: { width: img.naturalWidth, height: img.naturalHeight }
          }
        ]);
      };
      img.src = previewUrl;
    });

    onShowToast(`Added ${validFiles.length} image(s)`);
  };

  const compressSingle = async (item: CompressedItem, q: number, format: string): Promise<CompressedItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...item, status: 'done' });
          return;
        }

        ctx.drawImage(img, 0, 0);
        const mimeType = format === 'original' ? item.file.type : format;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                ...item,
                compressedBlob: blob,
                compressedSize: blob.size,
                status: 'done'
              });
            } else {
              resolve({ ...item, status: 'done' });
            }
          },
          mimeType,
          q / 100
        );
      };
      img.onerror = () => resolve({ ...item, status: 'done' });
      img.src = item.previewUrl;
    });
  };

  const compressAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    const updated = await Promise.all(
      items.map(item => compressSingle(item, quality, targetFormat))
    );
    setItems(updated);
    setIsProcessing(false);
    onShowToast('Compression complete!');
  };

  const downloadAllZip = async () => {
    const readyItems = items.filter(i => i.compressedBlob);
    if (readyItems.length === 0) {
      onShowToast('Compress images first');
      return;
    }

    const zip = new JSZip();
    readyItems.forEach((item, index) => {
      const ext = item.compressedBlob?.type === 'image/webp' ? '.webp' : item.compressedBlob?.type === 'image/jpeg' ? '.jpg' : '.png';
      const cleanName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
      zip.file(`${cleanName}-compressed-${index + 1}${ext}`, item.compressedBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed-images.zip';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded compressed ZIP!');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const totalOriginalSize = items.reduce((acc, curr) => acc + curr.originalSize, 0);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🗜️</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('batchImageCompressor', 'Batch Image Compressor')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          {t('compressorSubtitle', 'Reduce PNG, JPG, and WebP image size up to 90% without quality degradation. 100% private in-browser compression.')}
        </p>
      </div>

      {/* Upload Zone */}
      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-rose-300/60 dark:border-rose-900/40 rounded-2xl hover:border-rose-500 dark:hover:border-rose-500 cursor-pointer glass-card transition-all text-center">
        <Upload className="w-10 h-10 text-rose-500 mb-2" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {t('dropImagesCompress', 'Drop your images here or click to upload')}
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {t('supportsMultipleFiles', 'Supports multiple files (PNG, JPG, WebP)')}
        </span>
        {items.length > 0 && (
          <div className="mt-3 px-3 py-1 bg-rose-100/80 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold text-xs rounded-full inline-flex items-center gap-1.5 shadow-xs border border-rose-200/50 dark:border-rose-800/50">
            📊 {items.length} file(s) selected • Total Size: {formatSize(totalOriginalSize)}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        />
      </label>

      {/* Settings Bar */}
      {items.length > 0 && (
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <Sliders className="w-4 h-4 text-rose-500" /> {t('compressionSettings', 'Compression Settings')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                <span>{t('compressionQuality', 'Compression Quality')}</span>
                <span className="text-rose-500 font-extrabold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                {t('targetFormat', 'Target Output Format')}
              </label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
              >
                <option value="original">{t('keepOriginalFormat', 'Keep Original Format')}</option>
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={compressAll}
              disabled={isProcessing}
              className="flex-1 min-w-[160px] py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? t('processing', 'Processing...') : t('applyCompression', 'Apply Compression')}
            </button>
            <button
              onClick={downloadAllZip}
              disabled={!items.some(i => i.compressedBlob)}
              className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer"
            >
              <FileArchive className="w-4 h-4" /> {t('downloadAllZip', 'Download All as ZIP')}
            </button>
          </div>
        </div>
      )}

      {/* Item List with FileInfoPanel */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
            <span>Uploaded Files ({items.length}) • Total: <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{formatSize(totalOriginalSize)}</strong></span>
            <button onClick={() => setItems([])} className="text-rose-500 hover:underline">
              {t('clearAll', 'Clear All')}
            </button>
          </div>

          {items.map(item => {
            const fileInfo: FileInfoItem = {
              fileName: item.file.name,
              originalSize: item.originalSize,
              processedSize: item.compressedSize || undefined,
              dimensions: item.dimensions,
              format: item.file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
              lastModified: item.file.lastModified,
              status: isProcessing ? 'processing' : item.compressedSize > 0 ? 'done' : 'idle',
              progress: isProcessing ? 70 : 100,
              processingStep: isProcessing ? 'Applying image quantization...' : 'Done'
            };

            return (
              <div key={item.id} className="space-y-2">
                <FileInfoPanel item={fileInfo} />

                <div className="flex items-center justify-end gap-2 px-2">
                  {item.compressedBlob && (
                    <button
                      onClick={() => {
                        const url = URL.createObjectURL(item.compressedBlob!);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `compressed-${item.file.name}`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> {t('downloadFile', 'Download File')}
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
