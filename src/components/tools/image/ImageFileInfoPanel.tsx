import React from 'react';
import { ShieldCheck, FileImage, HardDrive, Layers, Maximize2, Sparkles } from 'lucide-react';
import { formatBytes } from '../../../lib/imageUtils';

interface ImageFileInfoPanelProps {
  fileName: string;
  originalSize: number;
  processedSize?: number;
  format: string;
  width?: number;
  height?: number;
  colorProfile?: string;
  hasTransparency?: boolean;
}

export const ImageFileInfoPanel: React.FC<ImageFileInfoPanelProps> = ({
  fileName,
  originalSize,
  processedSize,
  format,
  width,
  height,
  colorProfile = '24-bit sRGB',
  hasTransparency = false
}) => {
  return (
    <div className="p-5 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-3">
      {/* Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <FileImage className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
            {fileName}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] border border-emerald-200/60 dark:border-emerald-800/60">
          <ShieldCheck className="w-3 h-3" /> 100% Local Browser Processing
        </span>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-indigo-500" /> File Size
          </span>
          <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
            {formatBytes(originalSize)}
            {processedSize !== undefined && (
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                New: {formatBytes(processedSize)}
              </span>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-500" /> Format
          </span>
          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 uppercase">
            {format}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-blue-500" /> Resolution
          </span>
          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
            {width && height ? `${width} × ${height} px` : 'Auto'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Depth & Alpha
          </span>
          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
            {colorProfile} {hasTransparency ? '(Alpha)' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
