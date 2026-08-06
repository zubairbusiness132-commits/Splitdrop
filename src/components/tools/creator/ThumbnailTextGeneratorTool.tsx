import React, { useState } from 'react';
import { Copy, Check, Type, Sparkles, Layers } from 'lucide-react';

const PRESETS = [
  { name: 'VIRAL & CTR', texts: ['MUST WATCH!', 'DON\'T DO THIS!', 'SHOCKING TRUTH', 'THIS CHANGES EVERYTHING', 'IT\'S OVER!'] },
  { name: 'SECRETS & HACKS', texts: ['100% SECRET', 'THE REAL HACK', 'WHY NO ONE TALKS', 'HIDDEN FEATURE', 'UNLOCKED!'] },
  { name: 'VALUE & FREE', texts: ['100% FREE', 'SAVE $1,000!', 'ZERO COST', 'FREE TOOL', 'EASY STEP'] },
  { name: 'COMPARISON', texts: ['PRO VS NOOB', 'BEFORE & AFTER', 'GOOD VS BAD', 'NEW VS OLD', '$10 VS $1,000'] },
  { name: 'URGENCY', texts: ['STOP NOW!', 'WATCH FIRST', 'DO NOT BUY!', 'FIX THIS NOW', 'URGENT UPDATE'] }
];

export const ThumbnailTextGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('React 19');
  const [selectedText, setSelectedText] = useState('DONT DO THIS!');
  const [copied, setCopied] = useState(false);

  const customText = `${topic.toUpperCase()} ${selectedText}`;

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    onShowToast('Thumbnail text copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Thumbnail Text Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate punchy 1-4 word high-CTR text formulas designed specifically for YouTube thumbnail overlays.
          </p>
        </div>
      </div>

      {/* Inputs & Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Custom Subject Keyword
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic Keyword (1-2 Words)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI, Crypto, Python"
              className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 space-y-1">
            <p className="font-bold">💡 Creator Pro Tip:</p>
            <p className="text-[11px] leading-relaxed">Keep thumbnail text under 4 words total! Large, high-contrast, bold text gets 3x higher click-through rate on mobile devices.</p>
          </div>
        </div>

        {/* Big Bold Visual Mockup Card */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            High-CTR Visual Overlay Preview
          </h3>

          <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-indigo-500/30 overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-widest shadow-lg">
                MUST WATCH
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-yellow-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] uppercase tracking-tight leading-none italic">
                {customText}
              </h1>
            </div>

            <button
              onClick={() => handleCopy(customText)}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-black shadow-xl transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Overlay Text!' : 'Copy Overlay Text'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formula Presets */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Proven Thumbnail Text Formulas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESETS.map((preset) => (
            <div key={preset.name} className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {preset.name}
              </span>

              <div className="space-y-1.5 pt-1">
                {preset.texts.map((txt) => (
                  <button
                    key={txt}
                    onClick={() => {
                      setSelectedText(txt);
                      handleCopy(`${topic.toUpperCase()} ${txt}`);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-black text-slate-900 dark:text-white flex items-center justify-between group cursor-pointer border border-transparent hover:border-indigo-200/50"
                  >
                    <span>{txt}</span>
                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-600 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
