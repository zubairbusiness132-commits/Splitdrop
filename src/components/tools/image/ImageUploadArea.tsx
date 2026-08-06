import React, { useEffect, useRef } from 'react';
import { Upload, Camera, Clipboard, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface ImageUploadAreaProps {
  onImageSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  multiple?: boolean;
  accept?: string;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageSelected,
  title,
  subtitle,
  multiple = false,
  accept = 'image/*'
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const pastedFile = new File([blob], `pasted_image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`, {
              type: blob.type
            });
            imageFiles.push(pastedFile);
          }
        }
      }

      if (imageFiles.length > 0) {
        onImageSelected(multiple ? imageFiles : [imageFiles[0]]);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected, multiple]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (validFiles.length > 0) {
        onImageSelected(multiple ? validFiles : [validFiles[0]]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="p-8 sm:p-10 border-2 border-dashed border-indigo-300/80 dark:border-indigo-900/50 rounded-3xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center group flex flex-col items-center justify-center space-y-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50/90 dark:bg-slate-800/90 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-md shadow-indigo-500/10">
        <Upload className="w-8 h-8 animate-bounce" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {title || t('selectImageUpload', 'Drop image here, or click to browse')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {subtitle || t('supportsImageFormats', 'Supports JPG, PNG, WebP, AVIF, BMP, GIF & TIFF')}
        </p>
      </div>

      {/* Buttons Row: Browse, Paste, Camera */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Browse Files
        </button>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.read().then(async (items) => {
              for (const item of items) {
                const imageType = item.types.find(t => t.startsWith('image/'));
                if (imageType) {
                  const blob = await item.getType(imageType);
                  const file = new File([blob], `pasted_${Date.now()}.${imageType.split('/')[1] || 'png'}`, { type: imageType });
                  onImageSelected(multiple ? [file] : [file]);
                  return;
                }
              }
            }).catch(() => {
              alert('Please press Ctrl+V or Cmd+V directly anywhere on screen to paste an image from clipboard.');
            });
          }}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          <Clipboard className="w-3.5 h-3.5 text-indigo-500" />
          Paste (Ctrl+V)
        </button>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-500" />
          Camera
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onImageSelected(Array.from(e.target.files));
          }
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onImageSelected([e.target.files[0]]);
          }
        }}
      />
    </div>
  );
};
