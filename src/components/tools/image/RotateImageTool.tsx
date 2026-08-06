import React, { useState, useEffect } from 'react';
import { RotateCcw, RotateCw, Download, RefreshCw, Layers } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface RotateImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface ProcessedFileItem {
  file: File;
  previewUrl: string;
  angle: number;
}

export const RotateImageTool: React.FC<RotateImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<number>(90);
  const [items, setItems] = useState<ProcessedFileItem[]>([]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const handleImageSelected = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    setFiles(selectedFiles);
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(30);

    setTimeout(() => {
      setStage('Processing');
      setProgress(70);
      renderRotations(selectedFiles, angle);
    }, 200);
  };

  const renderRotations = (fileList: File[], rotAngle: number) => {
    const list: ProcessedFileItem[] = [];
    let count = 0;

    fileList.forEach((file) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const rad = (rotAngle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));

        const w = img.width;
        const h = img.height;

        canvas.width = w * cos + h * sin;
        canvas.height = w * sin + h * cos;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rad);
          ctx.drawImage(img, -w / 2, -h / 2);
        }

        const outUrl = canvas.toDataURL(file.type || 'image/png');
        list.push({ file, previewUrl: outUrl, angle: rotAngle });
        count++;

        if (count === fileList.length) {
          setItems(list);
          setStage('Completed');
          setProgress(100);
          setTimeout(() => setIsProcessing(false), 300);
        }
      };
      img.src = url;
    });
  };

  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
    if (files.length) {
      setIsProcessing(true);
      setStage('Processing');
      setProgress(50);
      renderRotations(files, newAngle);
    }
  };

  const handleDownloadItem = (item: ProcessedFileItem) => {
    const link = document.createElement('a');
    const baseName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || 'rotated';
    const ext = item.file.name.split('.').pop() || 'png';
    link.download = `${baseName}_rotated_${item.angle}deg.${ext}`;
    link.href = item.previewUrl;
    link.click();
    onShowToast('Rotated image downloaded!');
  };

  const handleDownloadAll = () => {
    items.forEach((item, idx) => {
      setTimeout(() => handleDownloadItem(item), idx * 200);
    });
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Rotate Image Online — 90°, 180°, Custom Angle — SplitDrop"
        description="Free online image rotator. Rotate JPG, PNG, WebP images by 90°, 180°, 270° or custom angles with batch support and instant browser download."
        canonicalPath="/rotate-image.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Rotate Image' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🔄 Rotate Image
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Rotate single or batch images clockwise, counter-clockwise, or at any custom angle.
        </p>
      </div>

      {files.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Preset Buttons & Slider */}
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => handleAngleChange(deg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      angle === deg
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Rotate {deg}°
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAngleChange((angle - 90 + 360) % 360)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Rotate -90°"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAngleChange((angle + 90) % 360)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Rotate +90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Custom Angle Slider</span>
                <span className="text-indigo-600 dark:text-indigo-400">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => handleAngleChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Grid Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-3xl glass-card space-y-3 flex flex-col justify-between">
                <div className="max-h-60 overflow-hidden rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <img src={item.previewUrl} alt={item.file.name} className="max-h-48 object-contain rounded-xl" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.file.name}</p>
                  <button
                    type="button"
                    onClick={() => handleDownloadItem(item)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Rotated
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Global Actions */}
          <div className="flex items-center justify-between gap-4 p-6 rounded-3xl glass-panel">
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setItems([]);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset / Clear
            </button>

            {items.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadAll}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Layers className="w-4 h-4" /> Download All ({items.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
