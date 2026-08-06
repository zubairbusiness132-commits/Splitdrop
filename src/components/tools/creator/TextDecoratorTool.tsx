import React, { useState } from 'react';
import { Copy, Check, Sparkles, Smile, Star, Type } from 'lucide-react';

const DECORATION_TEMPLATES = [
  { name: 'Stars & Sparkles', wrap: (s: string) => `✨⭐ ${s} ⭐✨` },
  { name: 'Line Dividers', wrap: (s: string) => `─── [ ${s} ] ───` },
  { name: 'Double Borders', wrap: (s: string) => `╔═════════════════╗\n║ ${s} ║\n╚═════════════════╝` },
  { name: 'Minimal Dots', wrap: (s: string) => `· · · ${s} · · ·` },
  { name: 'Arrows', wrap: (s: string) => `➽➔ ${s} ➔➽` },
  { name: 'Flowers & Hearts', wrap: (s: string) => `❀✿ ${s} ✿❀` },
  { name: 'Corner Box', wrap: (s: string) => `┌─── ${s} ───┐` },
  { name: 'Wave Lines', wrap: (s: string) => `〰️〰️ ${s} 〰️〰️` },
  { name: 'Fancy Wing Brackets', wrap: (s: string) => `༺ ${s} ༻` },
  { name: 'Diamond Wrap', wrap: (s: string) => `◆◇ ${s} ◇◆` }
];

export const TextDecoratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState('WELCOME TO MY BIO');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedName(name);
    onShowToast(`Copied ${name} decorated text!`);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Text Decorator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Decorate text with stars, lines, boxes, symbols, arrows, circles, and minimal separators for bios and post headers.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Headline / Bio Header</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. WELCOME TO MY CHANNEL"
          className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid of Decorated Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DECORATION_TEMPLATES.map((tmpl) => {
          const decorated = tmpl.wrap(inputText || 'Decorated Text');

          return (
            <div
              key={tmpl.name}
              className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {tmpl.name}
                </span>

                <pre className="text-xs font-mono font-medium text-slate-900 dark:text-white break-words p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 whitespace-pre-wrap">
                  {decorated}
                </pre>
              </div>

              <button
                onClick={() => handleCopy(decorated, tmpl.name)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {copiedName === tmpl.name ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedName === tmpl.name ? 'Copied!' : 'Copy Decoration'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
