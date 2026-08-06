import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Upload, ArrowUpDown, Shuffle } from 'lucide-react';

type SortMode = 'az' | 'za' | 'length-asc' | 'length-desc' | 'random' | 'reverse';

export const SortLinesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState(
    `Watermelon\nApple\nBanana\nDragonfruit\nCherry\nElderberry\nFig`
  );
  const [sortMode, setSortMode] = useState<SortMode>('az');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const getSortedText = () => {
    if (!inputText) return '';
    const lines = inputText.split('\n');

    switch (sortMode) {
      case 'az':
        return [...lines].sort((a, b) => {
          const strA = caseSensitive ? a : a.toLowerCase();
          const strB = caseSensitive ? b : b.toLowerCase();
          return strA.localeCompare(strB);
        }).join('\n');

      case 'za':
        return [...lines].sort((a, b) => {
          const strA = caseSensitive ? a : a.toLowerCase();
          const strB = caseSensitive ? b : b.toLowerCase();
          return strB.localeCompare(strA);
        }).join('\n');

      case 'length-asc':
        return [...lines].sort((a, b) => a.length - b.length).join('\n');

      case 'length-desc':
        return [...lines].sort((a, b) => b.length - a.length).join('\n');

      case 'reverse':
        return [...lines].reverse().join('\n');

      case 'random':
        const shuffled = [...lines];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.join('\n');

      default:
        return inputText;
    }
  };

  const sortedResult = getSortedText();

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
    navigator.clipboard.writeText(sortedResult);
    setCopied(true);
    onShowToast('Copied sorted lines!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sortedResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sorted_lines.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded sorted lines file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Sort Lines
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sort text lines alphabetically (A–Z, Z–A), by line length, reverse, or random shuffle.
          </p>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSortMode('az')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortMode === 'az'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            A–Z
          </button>

          <button
            onClick={() => setSortMode('za')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortMode === 'za'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Z–A
          </button>

          <button
            onClick={() => setSortMode('length-asc')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortMode === 'length-asc'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Shortest First
          </button>

          <button
            onClick={() => setSortMode('length-desc')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortMode === 'length-desc'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Longest First
          </button>

          <button
            onClick={() => setSortMode('reverse')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortMode === 'reverse'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Reverse Order
          </button>

          <button
            onClick={() => setSortMode('random')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              sortMode === 'random'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" /> Random Shuffle
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
          />
          Case Sensitive
        </label>
      </div>

      {/* Grid Text Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Original Lines</label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input
                  type="file"
                  accept=".txt,.md,.json,.xml,.html"
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
            placeholder="Type or paste lines to sort..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Sorted Lines Output</label>
            <textarea
              readOnly
              rows={12}
              value={sortedResult}
              placeholder="Sorted output will appear here..."
              className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!sortedResult}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>
            <button
              onClick={handleCopy}
              disabled={!sortedResult}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Sorted!' : 'Copy Sorted Lines'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
