import React, { useState } from 'react';
import { Fingerprint, Copy, Check, Download, RefreshCw, Layers } from 'lucide-react';

export const UuidGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [braces, setBraces] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const generateSingleUuid = () => {
    let uuid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

    if (removeHyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    if (braces) {
      uuid = `{${uuid}}`;
    }
    return uuid;
  };

  const [uuids, setUuids] = useState<string[]>(() => {
    return Array.from({ length: 5 }, () => generateSingleUuid());
  });

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateSingleUuid());
    setUuids(newUuids);
    onShowToast(`Generated ${count} UUIDs`);
  };

  const handleCopySingle = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    onShowToast('Copied UUID to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const text = uuids.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    onShowToast('Copied all UUIDs to clipboard!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    const text = uuids.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded TXT file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            UUID v4 Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate secure RFC 4122 compliant version-4 Universally Unique Identifiers in bulk locally.
          </p>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-20 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              Uppercase
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={removeHyphens}
                onChange={(e) => setRemoveHyphens(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              No Hyphens
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={braces}
                onChange={(e) => setBraces(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              Braces {'{}'}
            </label>
          </div>

          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4 animate-spin-hover" />
            Generate New
          </button>
        </div>
      </div>

      {/* Generated List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Generated UUIDs ({uuids.length})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'Copied All!' : 'Copy All'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {uuids.map((uuid, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 group hover:border-indigo-500/50 transition-all"
            >
              <code className="text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold select-all break-all">
                {uuid}
              </code>
              <button
                onClick={() => handleCopySingle(uuid, idx)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                title="Copy single UUID"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
