import React, { useState, useEffect } from 'react';
import { FlipHorizontal, FlipVertical, Download, RefreshCw, Sparkles } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface FlipImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const FlipImageTool: React.FC<FlipImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
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

  useEffect(() => {
    if (!imageObj) return;

    const canvas = document.createElement('canvas');
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imageObj, 0, 0);
    ctx.restore();

    setPreviewUrl(canvas.toDataURL(file?.type || 'image/png'));
  }, [imageObj, flipH, flipV, file]);

  const handleDownload = () => {
    if (!previewUrl || !file) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(85);

    setTimeout(() => {
      const link = document.createElement('a');
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'flipped';
      const ext = file.name.split('.').pop() || 'png';
      link.download = `${baseName}_flipped.${ext}`;
      link.href = previewUrl;
      link.click();

      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
      onShowToast('Flipped image downloaded!');
    }, 200);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Flip Image Online — Horizontal & Vertical Mirror — SplitDrop"
        description="Free online image flipper. Flip JPG, PNG, WebP images horizontally or vertically to mirror photos instantly in your browser."
        canonicalPath="/flip-image.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Flip Image' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ⇄ Flip Image
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Flip images horizontally, vertically, or both to create mirror effects instantly.
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

          {/* Controls & Preview */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setFlipH(!flipH)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  flipH
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" /> Horizontal Flip {flipH && '✓'}
              </button>

              <button
                type="button"
                onClick={() => setFlipV(!flipV)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  flipV
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipVertical className="w-4 h-4" /> Vertical Flip {flipV && '✓'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFlipH(true);
                  setFlipV(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-purple-200 dark:border-purple-800"
              >
                <Sparkles className="w-3.5 h-3.5" /> Full Mirror
              </button>
            </div>

            {/* Canvas Preview */}
            {previewUrl && (
              <div className="max-h-96 overflow-hidden rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800">
                <img src={previewUrl} alt="Flipped Preview" className="max-h-80 object-contain rounded-xl shadow-lg" />
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
                  setFlipH(false);
                  setFlipV(false);
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
                <Download className="w-4 h-4" /> Download Flipped Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
