import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Trash2, Sliders, Check, FileArchive } from 'lucide-react';

interface CompressedItem {
  id: string;
  file: File;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  previewUrl: string;
  status: 'idle' | 'compressing' | 'done';
}

interface ImageCompressorToolProps {
  onShowToast: (msg: string) => void;
}

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({ onShowToast }) => {
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
    const newItems: CompressedItem[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        originalSize: file.size,
        compressedBlob: null,
        compressedSize: 0,
        previewUrl: URL.createObjectURL(file),
        status: 'idle'
      }));

    if (newItems.length === 0) {
      onShowToast('Please select valid image files');
      return;
    }

    setItems(prev => [...prev, ...newItems]);
    onShowToast(`Added ${newItems.length} image(s)`);
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

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-4xl mb-2 inline-block">🗜️</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Batch Image Compressor
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          Reduce PNG, JPG, and WebP image size up to 90% without quality degradation. 100% private in-browser compression.
        </p>
      </div>

      {/* Upload Zone */}
      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl hover:border-rose-500 dark:hover:border-rose-500 cursor-pointer bg-gray-50/50 dark:bg-slate-800/30 transition-all text-center mb-6">
        <Upload className="w-10 h-10 text-rose-500 mb-2" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          Drop your images here or click to upload
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Supports multiple files (PNG, JPG, WebP)
        </span>
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
        <div className="p-5 mb-6 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <Sliders className="w-4 h-4 text-rose-500" /> Compression Settings
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                <span>Compression Quality</span>
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
                Target Output Format
              </label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="original">Keep Original Format</option>
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/webp">WebP (Best Size)</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={compressAll}
              disabled={isProcessing}
              className="flex-1 min-w-[160px] py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? 'Compressing...' : 'Apply Compression'}
            </button>
            <button
              onClick={downloadAllZip}
              disabled={!items.some(i => i.compressedBlob)}
              className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-40"
            >
              <FileArchive className="w-4 h-4" /> Download All as ZIP
            </button>
          </div>
        </div>
      )}

      {/* Item List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
            <span>Uploaded Files ({items.length})</span>
            <button onClick={() => setItems([])} className="text-rose-500 hover:underline">
              Clear All
            </button>
          </div>

          {items.map(item => {
            const sizeSaved = item.compressedSize ? item.originalSize - item.compressedSize : 0;
            const pctSaved = item.compressedSize ? ((sizeSaved / item.originalSize) * 100).toFixed(1) : '0';

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40"
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-14 h-14 object-cover rounded-xl bg-gray-200 dark:bg-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {item.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-gray-500 dark:text-slate-400">
                      Original: {formatSize(item.originalSize)}
                    </span>
                    {item.compressedSize > 0 && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatSize(item.compressedSize)} (-{pctSaved}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {item.compressedBlob ? (
                  <button
                    onClick={() => {
                      const url = URL.createObjectURL(item.compressedBlob!);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `compressed-${item.file.name}`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
