import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, Download, RefreshCw, FileArchive, Trash2 } from 'lucide-react';

interface ConvertItem {
  id: string;
  file: File;
  previewUrl: string;
  targetFormat: string;
  convertedBlob: Blob | null;
  status: 'idle' | 'converting' | 'done';
}

interface ImageConverterToolProps {
  onShowToast: (msg: string) => void;
}

export const ImageConverterTool: React.FC<ImageConverterToolProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [globalTarget, setGlobalTarget] = useState<'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp'>('image/png');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (files: FileList | File[]) => {
    const newItems: ConvertItem[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        targetFormat: globalTarget,
        convertedBlob: null,
        status: 'idle'
      }));

    if (newItems.length === 0) {
      onShowToast('Please select valid image files');
      return;
    }

    setItems(prev => [...prev, ...newItems]);
    onShowToast(`Added ${newItems.length} image(s)`);
  };

  const convertSingle = async (item: ConvertItem): Promise<ConvertItem> => {
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

        // Fill white background for non-alpha formats like JPEG
        if (item.targetFormat === 'image/jpeg' || item.targetFormat === 'image/bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            resolve({
              ...item,
              convertedBlob: blob,
              status: 'done'
            });
          },
          item.targetFormat,
          0.92
        );
      };
      img.onerror = () => resolve({ ...item, status: 'done' });
      img.src = item.previewUrl;
    });
  };

  const convertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    const updated = await Promise.all(
      items.map(item => convertSingle({ ...item, targetFormat: globalTarget }))
    );
    setItems(updated);
    setIsProcessing(false);
    onShowToast('Conversion finished!');
  };

  const downloadAllZip = async () => {
    const readyItems = items.filter(i => i.convertedBlob);
    if (readyItems.length === 0) {
      onShowToast('Convert images first');
      return;
    }

    const zip = new JSZip();
    readyItems.forEach((item, index) => {
      let ext = '.png';
      if (item.targetFormat === 'image/jpeg') ext = '.jpg';
      if (item.targetFormat === 'image/webp') ext = '.webp';
      if (item.targetFormat === 'image/bmp') ext = '.bmp';

      const cleanName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
      zip.file(`${cleanName}-converted-${index + 1}${ext}`, item.convertedBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-images.zip';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded converted ZIP!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-4xl mb-2 inline-block">🔄</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Image Format Converter
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          Convert PNG, JPG, WebP, GIF, and BMP files in batch mode. Fast, private, lossless quality output.
        </p>
      </div>

      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl hover:border-amber-500 dark:hover:border-amber-500 cursor-pointer bg-gray-50/50 dark:bg-slate-800/30 transition-all text-center mb-6">
        <Upload className="w-10 h-10 text-amber-500 mb-2" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          Drop image files here to convert
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Supports PNG, JPG, WebP, BMP, GIF
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        />
      </label>

      {items.length > 0 && (
        <div className="p-5 mb-6 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">
              Convert All To:
            </span>
            <select
              value={globalTarget}
              onChange={(e) => setGlobalTarget(e.target.value as any)}
              className="p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-slate-200"
            >
              <option value="image/png">PNG (.png)</option>
              <option value="image/jpeg">JPG / JPEG (.jpg)</option>
              <option value="image/webp">WebP (.webp)</option>
              <option value="image/bmp">BMP (.bmp)</option>
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={convertAll}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Converting...' : 'Convert Images'}
            </button>
            <button
              onClick={downloadAllZip}
              disabled={!items.some(i => i.convertedBlob)}
              className="py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-40 flex items-center gap-2"
            >
              <FileArchive className="w-4 h-4" /> Download ZIP
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40"
            >
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="w-12 h-12 object-cover rounded-xl bg-gray-200 dark:bg-slate-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Target: {globalTarget.replace('image/', '').toUpperCase()}
                </p>
              </div>

              {item.convertedBlob ? (
                <button
                  onClick={() => {
                    let ext = '.png';
                    if (item.targetFormat === 'image/jpeg') ext = '.jpg';
                    if (item.targetFormat === 'image/webp') ext = '.webp';
                    if (item.targetFormat === 'image/bmp') ext = '.bmp';

                    const cleanName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
                    const url = URL.createObjectURL(item.convertedBlob!);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${cleanName}-converted${ext}`;
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
                  onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                  className="p-2.5 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
