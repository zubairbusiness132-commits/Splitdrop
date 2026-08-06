import React, { useState } from 'react';
import { Info, Copy, Check, RefreshCw, FileText, Calendar, Printer, Shield } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { getImageMetadata, ImageMetadata, formatBytes } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ImageInfoViewerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const ImageInfoViewerTool: React.FC<ImageInfoViewerToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    const selectedFile = files[0];
    setFile(selectedFile);

    const img = new Image();
    const url = URL.createObjectURL(selectedFile);
    img.onload = async () => {
      setImageObj(img);
      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);
    };
    img.src = url;
  };

  const copyReport = () => {
    if (!metadata) return;
    const report = `Image Information Report
---------------------------
File Name: ${metadata.fileName}
File Size: ${formatBytes(metadata.fileSize)}
Format: ${metadata.format}
Resolution: ${metadata.width} × ${metadata.height} px
Aspect Ratio: ${metadata.aspectRatio}
Color Depth: ${metadata.colorDepth}
Transparency: ${metadata.hasTransparency ? 'Yes (Alpha Channel)' : 'No'}
Last Modified: ${metadata.lastModified}
Estimated Print Size: ${metadata.estimatedPrintSize}
EXIF Tags Found: ${Object.keys(metadata.exifData).length}
---------------------------
Generated with SplitDrop Image Tools`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    onShowToast('Image report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Information Viewer — Inspect Specs & EXIF — SplitDrop"
        description="Free online image information viewer. Inspect resolution, aspect ratio, color depth, transparency, print size & EXIF tags of any JPG, PNG, WebP image."
        canonicalPath="/image-info-viewer.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Image Information Viewer' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🔍 Image Information Viewer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Analyze full technical specifications, EXIF tags, aspect ratio, print size, and transparency details.
        </p>
      </div>

      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          {metadata && (
            <div className="p-6 rounded-3xl glass-panel space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                <div className="flex items-center gap-3">
                  {imageObj && (
                    <img src={imageObj.src} alt="Thumb" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm" />
                  )}
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{metadata.fileName}</h3>
                    <p className="text-xs text-slate-500">{formatBytes(metadata.fileSize)} • {metadata.format}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyReport}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Report' : 'Copy Full Report'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setMetadata(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Inspect Another
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Resolution</span>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{metadata.width} × {metadata.height} px</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Aspect Ratio</span>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{metadata.aspectRatio}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Color Depth & Alpha</span>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{metadata.colorDepth}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Printer className="w-3.5 h-3.5 text-indigo-500" /> Estimated Print Size
                  </span>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{metadata.estimatedPrintSize}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" /> Last Modified
                  </span>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{metadata.lastModified}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" /> Transparency Channel
                  </span>
                  <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {metadata.hasTransparency ? 'Yes (Alpha Present)' : 'No (Opaque)'}
                  </p>
                </div>
              </div>

              {/* EXIF Data Block */}
              <div className="p-5 rounded-2xl glass-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" /> EXIF Metadata Header Info
                </h4>

                {Object.keys(metadata.exifData).length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {Object.entries(metadata.exifData).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
                        <span className="font-bold text-slate-500">{k}:</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No EXIF tags detected or already stripped.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
