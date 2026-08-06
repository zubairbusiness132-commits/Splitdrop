import React from 'react';
import { Loader2, CheckCircle2, FileSearch, Cpu, Download, FileText } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export type ProcessingStage = 'Reading PDF' | 'Analyzing' | 'Processing' | 'Preparing Download' | 'Completed';

interface PdfProcessingProgressProps {
  currentStage: ProcessingStage;
  percent?: number;
  message?: string;
  className?: string;
}

const STAGES: { key: ProcessingStage; labelKey: string; defaultLabel: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'Reading PDF', labelKey: 'readingPdf', defaultLabel: 'Reading PDF', icon: FileText },
  { key: 'Analyzing', labelKey: 'analyzingPdf', defaultLabel: 'Analyzing', icon: FileSearch },
  { key: 'Processing', labelKey: 'processingPdf', defaultLabel: 'Processing', icon: Cpu },
  { key: 'Preparing Download', labelKey: 'preparingDownload', defaultLabel: 'Preparing Download', icon: Download },
  { key: 'Completed', labelKey: 'completed', defaultLabel: 'Completed', icon: CheckCircle2 }
];

export const PdfProcessingProgress: React.FC<PdfProcessingProgressProps> = ({
  currentStage,
  percent = 50,
  message,
  className = ''
}) => {
  const { t } = useLanguage();
  const currentIdx = STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className={`glass-card p-6 rounded-2xl text-center space-y-5 border border-indigo-200/50 dark:border-indigo-900/40 shadow-lg ${className}`}>
      {/* Header & Spinner */}
      <div className="flex flex-col items-center justify-center space-y-2">
        {currentStage === 'Completed' ? (
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        ) : (
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          {currentStage === 'Completed' ? t('processingCompleted', 'Processing Completed!') : t('processingYourPdf', 'Processing Your PDF...')}
        </h3>
        {message && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {message}
          </p>
        )}
      </div>

      {/* Stage Stepper */}
      <div className="grid grid-cols-5 gap-1.5 pt-2">
        {STAGES.map((s, idx) => {
          const isDone = idx < currentIdx || currentStage === 'Completed';
          const isCurrent = idx === currentIdx && currentStage !== 'Completed';
          const IconComp = s.icon;

          return (
            <div key={s.key} className="flex flex-col items-center text-center space-y-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900 animate-pulse'
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <IconComp className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-[10px] font-semibold leading-tight ${isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {t(s.labelKey, s.defaultLabel)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
};
