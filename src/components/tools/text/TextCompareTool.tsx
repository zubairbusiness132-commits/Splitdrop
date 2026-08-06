import React, { useState } from 'react';
import { GitCompare, ArrowLeftRight, Trash2, Plus, Minus, Check, Copy } from 'lucide-react';

export const TextCompareTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [originalText, setOriginalText] = useState(
    `SplitDrop is a fast browser-based tool suite.\nIt supports image splitting and PDF merging.\nEverything runs 100% locally in your browser.`
  );
  const [modifiedText, setModifiedText] = useState(
    `SplitDrop is an ultra-fast browser-based tool suite.\nIt supports image splitting, text editing, and PDF merging.\nEverything runs 100% locally in your private browser.`
  );

  const origLines = originalText.split('\n');
  const modLines = modifiedText.split('\n');

  // Simple line-by-line diff algorithm
  let addedCount = 0;
  let removedCount = 0;
  let identicalCount = 0;

  const maxLines = Math.max(origLines.length, modLines.length);
  const diffComparison = [];

  for (let i = 0; i < maxLines; i++) {
    const orig = origLines[i];
    const mod = modLines[i];

    if (orig === mod) {
      if (orig !== undefined) identicalCount++;
      diffComparison.push({ type: 'same', orig, mod, lineNum: i + 1 });
    } else if (orig === undefined) {
      addedCount++;
      diffComparison.push({ type: 'added', mod, lineNum: i + 1 });
    } else if (mod === undefined) {
      removedCount++;
      diffComparison.push({ type: 'removed', orig, lineNum: i + 1 });
    } else {
      addedCount++;
      removedCount++;
      diffComparison.push({ type: 'modified', orig, mod, lineNum: i + 1 });
    }
  }

  const similarityPercentage = maxLines > 0 ? Math.round((identicalCount / maxLines) * 100) : 100;

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
    onShowToast('Swapped text blocks!');
  };

  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
    onShowToast('Cleared both text blocks');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Text Compare / Diff Tool
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare two blocks of text or code to highlight added, removed, and modified lines with similarity scores.
          </p>
        </div>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Similarity</span>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{similarityPercentage}%</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-emerald-500/30 text-center bg-emerald-500/5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" /> Added Lines
          </span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">+{addedCount}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-rose-500/30 text-center bg-rose-500/5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
            <Minus className="w-3 h-3" /> Removed Lines
          </span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">-{removedCount}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Identical Lines</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{identicalCount}</p>
        </div>
      </div>

      {/* Input Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Original Text (Left)</label>
          </div>
          <textarea
            rows={8}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Original text..."
            className="w-full p-3.5 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Modified Text (Right)</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
              </button>
              <button
                onClick={handleClear}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            rows={8}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            placeholder="Modified text..."
            className="w-full p-3.5 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Line-by-Line Diff Breakdown
        </h3>

        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto space-y-1 border border-slate-800 max-h-[350px] overflow-y-auto">
          {diffComparison.map((item, idx) => {
            if (item.type === 'same') {
              return (
                <div key={idx} className="flex gap-4 opacity-75 hover:opacity-100 px-2 py-0.5 rounded">
                  <span className="w-8 text-slate-600 text-right select-none">{item.lineNum}</span>
                  <span className="text-slate-400 select-none"> </span>
                  <span className="whitespace-pre-wrap">{item.orig}</span>
                </div>
              );
            }

            if (item.type === 'added') {
              return (
                <div key={idx} className="flex gap-4 bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border-l-2 border-emerald-500">
                  <span className="w-8 text-emerald-500/60 text-right select-none">{item.lineNum}</span>
                  <span className="text-emerald-400 font-bold select-none">+</span>
                  <span className="whitespace-pre-wrap">{item.mod}</span>
                </div>
              );
            }

            if (item.type === 'removed') {
              return (
                <div key={idx} className="flex gap-4 bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded border-l-2 border-rose-500">
                  <span className="w-8 text-rose-500/60 text-right select-none">{item.lineNum}</span>
                  <span className="text-rose-400 font-bold select-none">-</span>
                  <span className="whitespace-pre-wrap">{item.orig}</span>
                </div>
              );
            }

            if (item.type === 'modified') {
              return (
                <div key={idx} className="space-y-0.5 my-1">
                  <div className="flex gap-4 bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded border-l-2 border-rose-500">
                    <span className="w-8 text-rose-500/60 text-right select-none">{item.lineNum}</span>
                    <span className="text-rose-400 font-bold select-none">-</span>
                    <span className="whitespace-pre-wrap">{item.orig}</span>
                  </div>
                  <div className="flex gap-4 bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border-l-2 border-emerald-500">
                    <span className="w-8 text-emerald-500/60 text-right select-none">{item.lineNum}</span>
                    <span className="text-emerald-400 font-bold select-none">+</span>
                    <span className="whitespace-pre-wrap">{item.mod}</span>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
