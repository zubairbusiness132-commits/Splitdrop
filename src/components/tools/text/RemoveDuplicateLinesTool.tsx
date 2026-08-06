import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Upload, Filter, ListFilter } from 'lucide-react';

export const RemoveDuplicateLinesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState(
    `apple\nBanana\napple\ncherry\nbanana\napple\ndate\nbanana\ncherry`
  );
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimSpaces, setTrimSpaces] = useState(true);
  const [copied, setCopied] = useState(false);

  const processText = () => {
    if (!inputText) return { result: '', totalOriginal: 0, totalUnique: 0, duplicatesRemoved: 0 };

    const lines = inputText.split('\n');
    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    lines.forEach((line) => {
      let key = line;
      if (trimSpaces) key = key.trim();
      if (!caseSensitive) key = key.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(trimSpaces ? line.trim() : line);
      }
    });

    const result = uniqueLines.join('\n');
    const totalOriginal = lines.length;
    const totalUnique = uniqueLines.length;
    const duplicatesRemoved = totalOriginal - totalUnique;

    return { result, totalOriginal, totalUnique, duplicatesRemoved };
  };

  const { result, totalOriginal, totalUnique, duplicatesRemoved } = processText();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    onShowToast('Copied unique lines to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deduplicated_lines.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded deduplicated text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Remove Duplicate Lines
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detect and purge duplicate lines from text files or lists with case & spacing controls.
          </p>
        </div>
      </div>

      {/* Controls & Options */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Case Sensitive
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={trimSpaces}
              onChange={(e) => setTrimSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Trim Spaces
          </label>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 text-xs font-extrabold">
          <span className="text-slate-400">Original: {totalOriginal}</span>
          <span className="text-indigo-600 dark:text-indigo-400">Unique: {totalUnique}</span>
          <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg">
            Removed: {duplicatesRemoved}
          </span>
        </div>
      </div>

      {/* Side-by-side or stacked Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input Text (Duplicates)</label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  accept=".txt,.md,.json,.xml,.html,.csv"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputText(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text with duplicate lines here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Cleaned Unique Lines Preview</label>
            <textarea
              readOnly
              rows={12}
              value={result}
              placeholder="Deduplicated result will appear here..."
              className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!result}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>
            <button
              onClick={handleCopy}
              disabled={!result}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Unique!' : 'Copy Unique Lines'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
