import React, { useState } from 'react';
import { Copy, RefreshCw, Hash } from 'lucide-react';

interface RandomNumberGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const RandomNumberGeneratorTool: React.FC<RandomNumberGeneratorToolProps> = ({ onShowToast }) => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(5);
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [results, setResults] = useState<number[]>([12, 45, 67, 89, 93]);

  const generateNumbers = () => {
    if (min >= max) {
      onShowToast('Min must be strictly less than Max');
      return;
    }

    const range = max - min + 1;
    if (!allowRepeats && count > range) {
      onShowToast(`Cannot pick ${count} unique numbers in a range of ${range}`);
      return;
    }

    const nums: number[] = [];
    if (!allowRepeats) {
      const pool = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        nums.push(pool[idx]);
        pool.splice(idx, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + min);
      }
    }

    if (sortOrder === 'asc') nums.sort((a, b) => a - b);
    if (sortOrder === 'desc') nums.sort((a, b) => b - a);

    setResults(nums);
    onShowToast(`Generated ${nums.length} random numbers`);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join(', '));
    onShowToast('Numbers copied to clipboard!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔢</span> Random Number Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate random numbers with customizable range, quantity & sorting rules.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyResults}
            className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4" /> Copy Numbers
          </button>
          <button
            onClick={generateNumbers}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Generate
          </button>
        </div>
      </div>

      {/* Main Results Display */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Generated Output ({results.length} items)
        </span>
        <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto">
          {results.map((n, idx) => (
            <div
              key={idx}
              className="px-4 py-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-mono text-xl font-black shadow-sm"
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Options Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Minimum (Min)</label>
          <input
            type="number" value={min} onChange={e => setMin(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
          />
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Maximum (Max)</label>
          <input
            type="number" value={max} onChange={e => setMax(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
          />
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity (Count)</label>
          <input
            type="number" min="1" max="1000" value={count} onChange={e => setCount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
          />
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Allow Repeats</span>
            <input type="checkbox" checked={allowRepeats} onChange={e => setAllowRepeats(e.target.checked)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Sort Order</label>
            <select
              value={sortOrder} onChange={e => setSortOrder(e.target.value as any)}
              className="w-full px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              <option value="none">None (Raw)</option>
              <option value="asc">Ascending (1 to 9)</option>
              <option value="desc">Descending (9 to 1)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
