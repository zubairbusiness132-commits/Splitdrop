import React from 'react';
import { FileText, ShieldCheck, Check, Sparkles, Image as ImageIcon, HardDrive, Calendar } from 'lucide-react';

export interface FileInfoItem {
  fileName: string;
  originalSize: number;
  processedSize?: number;
  savedSize?: number;
  compressionPercent?: number;
  dimensions?: { width: number; height: number };
  pageCount?: number;
  format?: string;
  lastModified?: number | Date;
  status?: 'idle' | 'processing' | 'done' | 'error';
  progress?: number; // 0-100
  processingStep?: string;
}

interface FileInfoPanelProps {
  item: FileInfoItem;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateNum?: number | Date): string {
  if (!dateNum) return 'Just now';
  const d = new Date(dateNum);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export const FileInfoPanel: React.FC<FileInfoPanelProps> = ({ item, className = '' }) => {
  const isImage = item.format ? !item.format.toLowerCase().includes('pdf') : true;
  const savedBytes = item.savedSize ?? (item.processedSize && item.originalSize ? item.originalSize - item.processedSize : 0);
  const compPct = item.compressionPercent ?? (item.originalSize && item.processedSize ? ((savedBytes / item.originalSize) * 100).toFixed(1) : undefined);

  return (
    <div className={`glass-card p-4 sm:p-5 rounded-2xl space-y-3 ${className}`}>
      
      {/* Header & File Title */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/60 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
            {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
              {item.fileName}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2 mt-0.5">
              <span>{formatBytes(item.originalSize)}</span>
              {item.lastModified && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(item.lastModified)}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Privacy Badge */}
        <div className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Local Private
        </div>
      </div>

      {/* Progress & Processing Step Animation */}
      {item.status === 'processing' && (
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {item.processingStep || 'Processing file in browser memory...'}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black">{item.progress || 50}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${item.progress || 50}%` }}
            />
          </div>
        </div>
      )}

      {/* Metadata Grid Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        
        {/* Format */}
        {item.format && (
          <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Format</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase">{item.format}</span>
          </div>
        )}

        {/* Resolution / Dimensions */}
        {item.dimensions && (
          <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Resolution</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.dimensions.width} × {item.dimensions.height} px</span>
          </div>
        )}

        {/* Page Count for PDF */}
        {item.pageCount !== undefined && (
          <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Total Pages</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.pageCount} Pages</span>
          </div>
        )}

        {/* Processed Size & Compression */}
        {item.processedSize !== undefined && item.processedSize > 0 && (
          <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase block">Processed Size</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
              {formatBytes(item.processedSize)} {compPct ? `(-${compPct}%)` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
