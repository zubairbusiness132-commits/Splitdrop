import React, { useState } from 'react';
import { Copy, Check, Search, RefreshCw, Download, Trash2, Upload } from 'lucide-react';

export const FindAndReplaceTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState(
    `The quick brown fox jumps over the lazy dog. The fox was energetic and clever. Every fox knows the secret of the forest.`
  );
  const [findText, setFindText] = useState('fox');
  const [replaceText, setReplaceText] = useState('cat');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [copied, setCopied] = useState(false);

  // Match count
  const getMatchCount = (): number => {
    if (!findText) return 0;
    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';
      let pattern = findText;
      if (!useRegex) {
        pattern = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  };

  const matchCount = getMatchCount();

  const handleReplaceAll = () => {
    if (!findText) return;
    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';
      let pattern = findText;
      if (!useRegex) {
        pattern = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const regex = new RegExp(pattern, flags);
      const newText = text.replace(regex, replaceText);
      setText(newText);
      onShowToast(`Replaced ${matchCount} occurrence(s)`);
    } catch (err) {
      onShowToast('Invalid search pattern or regular expression');
    }
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

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied text to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'find_replace_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Find & Replace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search and replace text with case sensitivity, whole word matching, and Regular Expression (Regex) support.
          </p>
        </div>
      </div>

      {/* Find & Replace Controls */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Find Word / Pattern</label>
              {matchCount > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {matchCount} match{matchCount === 1 ? '' : 'es'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Word to find..."
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Replace With</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement text..."
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
              />
              Match Case
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
              />
              Whole Word
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
              />
              Regex
            </label>
          </div>

          <button
            onClick={handleReplaceAll}
            disabled={!findText || matchCount === 0}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Replace All Matches ({matchCount})
          </button>
        </div>
      </div>

      {/* Main Text Content Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Text</label>
          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
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
              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={11}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full p-4 text-sm font-sans rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={!text}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download TXT
          </button>
          <button
            onClick={handleCopy}
            disabled={!text}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  );
};
