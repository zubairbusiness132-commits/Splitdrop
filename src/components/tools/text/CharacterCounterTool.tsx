import React, { useState } from 'react';
import { Copy, Check, Trash2, Upload, Download, Hash, AlignLeft } from 'lucide-react';

export const CharacterCounterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState(
    'SplitDrop Character Counter displays precise character metrics including total length, spaces, non-space characters, letters (A-Z), numbers (0-9), and special symbols.'
  );
  const [copied, setCopied] = useState(false);

  // Character Breakdown
  const totalChars = text.length;
  const spaces = (text.match(/\s/g) || []).length;
  const charsNoSpaces = totalChars - spaces;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const numbers = (text.match(/[0-9]/g) || []).length;
  const symbols = totalChars - letters - numbers - spaces;

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
    onShowToast('Copied text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setText('');
    onShowToast('Reset text input');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character_counter_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Character Counter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed breakdown of characters, spaces, letters, numbers, and symbols.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Characters</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{totalChars.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Without Spaces</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{charsNoSpaces.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Spaces</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{spaces.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Letters (A-Z)</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">{letters.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Numbers (0-9)</span>
          <p className="text-2xl font-black text-sky-500 mt-1">{numbers.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Symbols</span>
          <p className="text-2xl font-black text-purple-500 mt-1">{symbols.toLocaleString()}</p>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-indigo-500" /> Enter Text / Upload File
          </label>
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
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to see real-time character stats..."
          className="w-full p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs text-slate-400">Live calculation enabled</span>
          <div className="flex items-center gap-2">
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
    </div>
  );
};
