import React, { useState } from 'react';
import { Copy, Check, Trash2, Download, FileText, Clock, AlignLeft, Upload, RefreshCw } from 'lucide-react';

export const WordCounterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState(
    `Welcome to SplitDrop Word Counter!\n\nThis browser-based tool calculates real-time word count, total character count, characters without spaces, sentences, paragraphs, reading time, and estimated speaking duration.\n\nYou can type directly, paste text, or drag and drop text files (.txt, .md, .json, .xml, .html) directly into the box below.`
  );
  const [copiedText, setCopiedText] = useState(false);
  const [copiedStats, setCopiedStats] = useState(false);

  // Stats calculation
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  
  // Reading speed ~200 wpm, Speaking speed ~130 wpm
  const readingSeconds = Math.ceil((words / 200) * 60);
  const speakingSeconds = Math.ceil((words / 130) * 60);

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds} sec`;
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    onShowToast('Copied text to clipboard!');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyStats = () => {
    const statsSummary = `Word Count: ${words}\nCharacters: ${characters}\nCharacters (no spaces): ${charsNoSpaces}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nReading Time: ${formatDuration(readingSeconds)}\nSpeaking Time: ${formatDuration(speakingSeconds)}`;
    navigator.clipboard.writeText(statsSummary);
    setCopiedStats(true);
    onShowToast('Copied statistics summary!');
    setTimeout(() => setCopiedStats(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word_counter_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Word Counter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time word, character, sentence, paragraph, reading time, and speaking time counter.
          </p>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Words</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{words.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Characters</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{characters.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">No Spaces</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{charsNoSpaces.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Sentences</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{sentences.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Paragraphs</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{paragraphs.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center col-span-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-emerald-500" /> Read Time
          </span>
          <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatDuration(readingSeconds)}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center col-span-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Speak Time
          </span>
          <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">{formatDuration(speakingSeconds)}</p>
        </div>
      </div>

      {/* Input Area + Controls */}
      <div className="space-y-3" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-indigo-500" /> Text Input / File Drop Zone
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <label className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.json,.xml,.html,.csv"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={handleCopyStats}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedStats ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStats ? 'Stats Copied' : 'Copy Stats'}
            </button>
            <button
              onClick={() => { setText(''); onShowToast('Cleared text!'); }}
              className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here, or drag & drop a text file..."
          className="w-full p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400">
            Supports TXT, MD, HTML, XML, JSON drag & drop file imports.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!text}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>

            <button
              onClick={handleCopyText}
              disabled={!text}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedText ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
