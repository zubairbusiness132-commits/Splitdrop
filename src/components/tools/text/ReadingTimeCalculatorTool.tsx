import React, { useState } from 'react';
import { Clock, Sliders, FileText, Copy, Check, Upload, Trash2 } from 'lucide-react';

export const ReadingTimeCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState(
    `SplitDrop Reading Time Calculator determines exactly how long it takes an average person, speed reader, or presenter to read or speak your article, blog post, or speech aloud.\n\nSimply paste your manuscript or upload a file to calculate reading speed metrics across standard speed tiers.`
  );
  const [customWpm, setCustomWpm] = useState(200);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const calculateTime = (wpm: number) => {
    if (wordCount === 0) return '0 sec';
    const totalSeconds = Math.ceil((wordCount / wpm) * 60);
    if (totalSeconds < 60) return `${totalSeconds} seconds`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Reading Time Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate estimated reading time, speaking time, and speed-reading metrics.
          </p>
        </div>
      </div>

      {/* Speed Metrics Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Average Reading (200 WPM)</span>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{calculateTime(200)}</p>
          <span className="text-[10px] text-slate-400 block">Standard adult reading pace</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Fast Speed Reading (300 WPM)</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{calculateTime(300)}</p>
          <span className="text-[10px] text-slate-400 block">Skimming / fast comprehension</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Speaking / Presenting (130 WPM)</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">{calculateTime(130)}</p>
          <span className="text-[10px] text-slate-400 block">Keynote speech / Podcast pace</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Custom Pace ({customWpm} WPM)</span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400">{calculateTime(customWpm)}</p>
          <span className="text-[10px] text-slate-400 block">Adjust WPM slider below</span>
        </div>
      </div>

      {/* Custom WPM Slider */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Custom Words Per Minute (WPM)
          </label>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{customWpm} WPM</span>
        </div>
        <input
          type="range"
          min={50}
          max={600}
          step={10}
          value={customWpm}
          onChange={(e) => setCustomWpm(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span>50 WPM (Slow)</span>
          <span>200 WPM (Avg)</span>
          <span>600 WPM (Expert)</span>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" /> Article / Script Content
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{wordCount} words • {charCount} chars</span>
            <label className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.json,.xml,.html"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => { setText(''); onShowToast('Cleared text'); }}
              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write your manuscript here..."
          className="w-full p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
      </div>
    </div>
  );
};
