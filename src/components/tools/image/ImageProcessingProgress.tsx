import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export type ProcessingStage =
  | 'Reading Image'
  | 'Reading Files'
  | 'Analyzing'
  | 'Processing'
  | 'Optimizing'
  | 'Generating Preview'
  | 'Generating Previews'
  | 'Encoding GIF Frames'
  | 'Compressing ZIP'
  | 'Preparing Download'
  | 'Completed';

interface ImageProcessingProgressProps {
  stage: ProcessingStage;
  progress: number; // 0 to 100
}

const STAGES: ProcessingStage[] = [
  'Reading Image',
  'Analyzing',
  'Processing',
  'Generating Preview',
  'Preparing Download',
  'Completed'
];

export const ImageProcessingProgress: React.FC<ImageProcessingProgressProps> = ({ stage, progress }) => {
  const currentIdx = STAGES.indexOf(stage);

  return (
    <div className="p-5 rounded-2xl glass-panel border border-indigo-200/50 dark:border-indigo-900/50 space-y-4 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stage === 'Completed' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
          ) : (
            <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
          )}
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
            {stage}
          </span>
        </div>
        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage Chips */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400 pt-1">
        {STAGES.map((s, idx) => {
          const isDone = idx < currentIdx || stage === 'Completed';
          const isCurrent = s === stage;
          return (
            <span
              key={s}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                isDone
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : isCurrent
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {s}
            </span>
          );
        })}
      </div>
    </div>
  );
};
