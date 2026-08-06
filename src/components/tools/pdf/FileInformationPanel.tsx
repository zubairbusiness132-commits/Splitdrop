import React from 'react';
import { FileText, ShieldCheck, Clock, Layers, HardDrive, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { formatBytes } from '../../../lib/pdfUtils';
import { useLanguage } from '../../../context/LanguageContext';

export interface FileInformationProps {
  fileName: string;
  fileSize: number;
  pageCount?: number;
  pdfVersion?: string;
  uploadTime?: string;
  status?: 'Idle' | 'Reading PDF' | 'Analyzing' | 'Processing' | 'Preparing Download' | 'Completed' | 'Error';
  statusProgress?: number; // 0 to 100
  estimatedOutputSize?: string;
  className?: string;
}

export const FileInformationPanel: React.FC<FileInformationProps> = ({
  fileName,
  fileSize,
  pageCount,
  pdfVersion = 'v1.7',
  uploadTime,
  status = 'Idle',
  statusProgress,
  estimatedOutputSize,
  className = ''
}) => {
  const { t } = useLanguage();
  const formattedUploadTime = uploadTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`glass-card p-5 rounded-2xl space-y-4 border border-indigo-200/40 dark:border-indigo-900/30 ${className}`}>
      {/* Top Header & Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('fileInformation', 'File Information')}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {fileName}
            </p>
          </div>
        </div>

        {/* Local Privacy Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('privacyBadge', '100% Local • Private in Browser')}</span>
        </div>
      </div>

      {/* Grid of Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-0.5">
            <HardDrive className="w-3 h-3 text-indigo-500" /> {t('originalSize', 'Original Size')}
          </span>
          <p className="font-extrabold text-slate-800 dark:text-slate-200">{formatBytes(fileSize)}</p>
        </div>

        {pageCount !== undefined && (
          <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-0.5">
              <Layers className="w-3 h-3 text-indigo-500" /> {t('pageCount', 'Page Count')}
            </span>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">{pageCount} {pageCount === 1 ? 'Page' : 'Pages'}</p>
          </div>
        )}

        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3 h-3 text-violet-500" /> {t('pdfVersion', 'PDF Version')}
          </span>
          <p className="font-extrabold text-slate-800 dark:text-slate-200">{pdfVersion}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-0.5">
            <Clock className="w-3 h-3 text-amber-500" /> {t('uploadTime', 'Upload Time')}
          </span>
          <p className="font-extrabold text-slate-800 dark:text-slate-200">{formattedUploadTime}</p>
        </div>
      </div>

      {/* Processing Status & Estimated Output */}
      {status !== 'Idle' && (
        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              {status === 'Completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              )}
              <span>{t('status', 'Status')}: <strong className="text-indigo-600 dark:text-indigo-400">{status}</strong></span>
            </span>
            {estimatedOutputSize && (
              <span className="text-slate-500 dark:text-slate-400">
                {t('estimatedOutput', 'Est. Output')}: <strong className="text-slate-800 dark:text-slate-200 font-bold">{estimatedOutputSize}</strong>
              </span>
            )}
          </div>

          {statusProgress !== undefined && (
            <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, statusProgress))}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
