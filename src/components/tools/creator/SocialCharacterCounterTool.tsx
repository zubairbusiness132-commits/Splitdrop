import React, { useState } from 'react';
import { Copy, Check, Hash, FileText, Clock, AlertTriangle, ShieldCheck, Trash2, Sparkles, Youtube, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export const SocialCharacterCounterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState(`🔥 Build Fullstack Web Apps Fast!
Learn how to create scalable web applications using React, Tailwind CSS, and TypeScript.
Subscribe to the channel for weekly coding tutorials! #webdev #coding #react`);
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const readingTimeSeconds = Math.ceil((wordCount / 200) * 60);

  const platformLimits = [
    { platform: 'YouTube Title', limit: 100, icon: <Youtube className="w-3.5 h-3.5 text-red-500" /> },
    { platform: 'YouTube Description', limit: 5000, icon: <Youtube className="w-3.5 h-3.5 text-red-500" /> },
    { platform: 'Instagram Caption', limit: 2200, icon: <Instagram className="w-3.5 h-3.5 text-pink-500" /> },
    { platform: 'Instagram Bio', limit: 150, icon: <Instagram className="w-3.5 h-3.5 text-pink-500" /> },
    { platform: 'TikTok Caption', limit: 2200, icon: <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" /> },
    { platform: 'Twitter / X Post', limit: 280, icon: <Twitter className="w-3.5 h-3.5 text-sky-400" /> },
    { platform: 'Facebook Post', limit: 63206, icon: <Facebook className="w-3.5 h-3.5 text-blue-600" /> },
    { platform: 'LinkedIn Post', limit: 3000, icon: <Linkedin className="w-3.5 h-3.5 text-blue-500" /> },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUppercase = () => {
    setText(text.toUpperCase());
    onShowToast('Converted to UPPERCASE');
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
    onShowToast('Converted to lowercase');
  };

  const handleRemoveExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
    onShowToast('Removed extra spaces');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Social Character & Word Counter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time character, word, sentence, and reading time counter with multi-platform limit gauges.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Characters</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{charCount}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Words</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{wordCount}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sentences</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{sentenceCount}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Reading Time</span>
          <p className="text-2xl font-black text-emerald-500">{readingTimeSeconds}s</p>
        </div>
      </div>

      {/* Main Text Input + Utilities */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Content Text Editor</label>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleUppercase}
              className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white cursor-pointer transition-all"
            >
              UPPERCASE
            </button>
            <button
              onClick={handleLowercase}
              className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white cursor-pointer transition-all"
            >
              lowercase
            </button>
            <button
              onClick={handleRemoveExtraSpaces}
              className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white cursor-pointer transition-all"
            >
              Remove Extra Spaces
            </button>
            <button
              onClick={() => { setText(''); onShowToast('Cleared text!'); }}
              className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Type or paste your social post content here..."
          className="w-full p-4 font-sans text-xs leading-relaxed bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />

        <div className="flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Text!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Platform Limit Gauges */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Platform Character Limit Gauges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {platformLimits.map((pl) => {
            const isOver = charCount > pl.limit;
            const pct = Math.min(100, Math.round((charCount / pl.limit) * 100));

            return (
              <div
                key={pl.platform}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                  isOver
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'glass-card border-slate-200/70 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {pl.icon}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{pl.platform}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isOver ? 'text-rose-500' : 'text-slate-400'}`}>
                    {charCount}/{pl.limit}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${
                      isOver ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
