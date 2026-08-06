import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Upload, Sparkles, Sliders } from 'lucide-react';

export const TextCleanerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState(
    `   <h1>Welcome to SplitDrop Text Cleaner!</h1>  \n\tThis tool    cleans messy text.\n\n\n\t\t- Removes extra spaces   and tabs.\n- Strips <p>HTML tags</p> if needed.\n\t- Normalizes line breaks.\n  `
  );

  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeTabs, setRemoveTabs] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [normalizeLineBreaks, setNormalizeLineBreaks] = useState(true);
  const [removeDuplicateSpaces, setRemoveDuplicateSpaces] = useState(true);
  const [trimText, setTrimText] = useState(true);
  const [stripHtmlTags, setStripHtmlTags] = useState(false);
  const [copied, setCopied] = useState(false);

  const getCleanedText = () => {
    let text = inputText;

    if (!text) return '';

    if (stripHtmlTags) {
      text = text.replace(/<[^>]*>/g, '');
    }

    if (removeTabs) {
      text = text.replace(/\t/g, ' ');
    }

    if (normalizeLineBreaks) {
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    if (removeDuplicateSpaces) {
      text = text.replace(/[  ]+/g, ' ');
    }

    if (removeExtraSpaces) {
      text = text.split('\n').map(line => line.trim()).join('\n');
    }

    if (removeEmptyLines) {
      text = text.split('\n').filter(line => line.length > 0).join('\n');
    }

    if (trimText) {
      text = text.trim();
    }

    return text;
  };

  const cleanedResult = getCleanedText();

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
    navigator.clipboard.writeText(cleanedResult);
    setCopied(true);
    onShowToast('Copied cleaned text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([cleanedResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded cleaned text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Text Cleaner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sanitize and format messy text by stripping extra spaces, tabs, duplicate breaks, and HTML tags.
          </p>
        </div>
      </div>

      {/* Cleaning Options Toggles */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Cleaning Rules & Filters
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Remove Leading/Trailing Line Spaces
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeDuplicateSpaces}
              onChange={(e) => setRemoveDuplicateSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Remove Duplicate Spaces
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeTabs}
              onChange={(e) => setRemoveTabs(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Convert Tabs to Spaces
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Remove Empty Lines
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={normalizeLineBreaks}
              onChange={(e) => setNormalizeLineBreaks(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Normalize Line Breaks (\\n)
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimText}
              onChange={(e) => setTrimText(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Trim Full Document
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-indigo-600 dark:text-indigo-400">
            <input
              type="checkbox"
              checked={stripHtmlTags}
              onChange={(e) => setStripHtmlTags(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            Strip HTML Tags (&lt;tag&gt;)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw Messy Text Input</label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
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
            placeholder="Paste messy text here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Cleaned & Formatted Preview</label>
            <textarea
              readOnly
              rows={12}
              value={cleanedResult}
              placeholder="Cleaned output will appear here..."
              className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!cleanedResult}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>
            <button
              onClick={handleCopy}
              disabled={!cleanedResult}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Cleaned!' : 'Copy Cleaned Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
