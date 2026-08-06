import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Download, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, stripExifFromImage, ImageMetadata, formatBytes } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ExifRemoverToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface ExifCleanedResult {
  file: File;
  cleanedBlob: Blob;
  originalSize: number;
  newSize: number;
  metadata: ImageMetadata;
}

export const ExifRemoverTool: React.FC<ExifRemoverToolProps> = ({ onShowToast, onNavigate }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ExifCleanedResult[]>([]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const handleImageSelected = async (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    setFiles(selectedFiles);
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(20);

    const list: ExifCleanedResult[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setStage('Analyzing');
      setProgress(Math.round(((i + 1) / selectedFiles.length) * 50));

      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = url;
      });

      const meta = await getImageMetadata(file, img);
      setStage('Processing');
      setProgress(Math.round(((i + 1) / selectedFiles.length) * 80));

      const { cleanedBlob, originalSize, newSize } = await stripExifFromImage(file);
      list.push({ file, cleanedBlob, originalSize, newSize, metadata: meta });
    }

    setResults(list);
    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleDownloadItem = (res: ExifCleanedResult) => {
    const url = URL.createObjectURL(res.cleanedBlob);
    const link = document.createElement('a');
    const baseName = res.file.name.substring(0, res.file.name.lastIndexOf('.')) || 'cleaned';
    const ext = res.file.name.split('.').pop() || 'jpg';
    link.download = `${baseName}_no_exif.${ext}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Cleaned image downloaded!');
  };

  const handleDownloadAll = () => {
    results.forEach((res, idx) => {
      setTimeout(() => handleDownloadItem(res), idx * 200);
    });
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="EXIF Data Remover — Strip GPS, Camera & Metadata — SplitDrop"
        description="Free online EXIF metadata remover. Strip GPS coordinates, camera serial numbers, author name & device info from photos while preserving high image quality."
        canonicalPath="/exif-remover.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'EXIF Remover' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🛡️ EXIF Metadata Remover
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Wipe hidden GPS location tags, camera model, author info, and device details from photos for complete privacy.
        </p>
      </div>

      {files.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Results Grid */}
          <div className="space-y-4">
            {results.map((res, idx) => (
              <div key={idx} className="p-6 rounded-3xl glass-panel space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{res.file.name}</h3>
                      <p className="text-xs text-slate-500">
                        {formatBytes(res.originalSize)} → {formatBytes(res.newSize)} (EXIF Metadata Removed)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadItem(res)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Cleaned
                  </button>
                </div>

                {/* Detected & Stripped Items List */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Removed Metadata Tags:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                    <div>• GPS Location & Altitude</div>
                    <div>• Camera Model & Lens</div>
                    <div>• Device Serial Number</div>
                    <div>• Date & Time Original</div>
                    <div>• Author & Copyright</div>
                    <div>• Software & Firmware</div>
                  </div>
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
                setResults([]);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clean Another Image
            </button>

            {results.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadAll}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download All Cleaned ({results.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
