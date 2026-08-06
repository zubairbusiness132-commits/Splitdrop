import React, { useState } from 'react';
import { Copy, Check, Twitter, Sparkles, AlertCircle } from 'lucide-react';

const TWITTER_STYLES = ['Short', 'Professional', 'Funny', 'Minimal', 'Business'] as const;
type TwitterStyle = typeof TWITTER_STYLES[number];

export const TwitterBioGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [name, setName] = useState('Alex');
  const [niche, setNiche] = useState('Builds Web Apps');
  const [handle, setHandle] = useState('alexcode');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateBios = (): Record<TwitterStyle, string[]> => {
    const user = name.trim() || 'Alex';
    const rawNiche = niche.trim() || 'Software & AI';

    return {
      Short: [
        `${user} | ${rawNiche} 🚀 | Thoughts & shipping code daily.`,
        `Building ${rawNiche} • Tech enthusiast • 📩 DM open`
      ],
      Professional: [
        `Senior Lead in ${rawNiche}. Helping teams scale digital products. Ex-startup founder | ✍️ Writing about tech & design.`,
        `Specialist in ${rawNiche} 💡 | Turning complex problems into simple software solutions | 📍 SF / Remote`
      ],
      Funny: [
        `99% coffee, 1% ${rawNiche} code. ☕💀\nI fix bugs that I created 5 minutes ago.`,
        `Professional ${rawNiche} enthusiast. My internet tabs are currently at 84 and counting. 🙈`
      ],
      Minimal: [
        `${user}. ${rawNiche}.`,
        `doing ${rawNiche}. 🌐`
      ],
      Business: [
        `Official X account for ${user} Studio. Premier ${rawNiche} solutions for enterprise teams. 📈\n👇 Learn more below`,
        `Building the future of ${rawNiche}. ✨ Scaling software for 50k+ daily active users. DM for partnerships.`
      ]
    };
  };

  const bioData = generateBios();

  const handleCopy = (bioText: string, idx: number) => {
    navigator.clipboard.writeText(bioText);
    setCopiedIdx(idx);
    onShowToast('Twitter bio copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Twitter className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            Twitter (X) Bio Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate punchy, high-impact Twitter / X bios adhering to the strict 160 character profile limit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name / Handle</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche / Focus Area</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Web3, AI Tools, Indiemaking"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TWITTER_STYLES.map((styleName) => {
          const list = bioData[styleName];

          return (
            <div key={styleName} className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {styleName} Style
                </span>
                <span className="text-[10px] font-bold text-slate-400">{list.length} Variations</span>
              </div>

              <div className="space-y-3">
                {list.map((bioText, idx) => {
                  const len = bioText.length;
                  const isOver = len > 160;
                  const itemKey = `${styleName}-${idx}`;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {len} / 160 Chars {isOver ? '(Over X Limit)' : '✓ Fits Bio'}
                        </span>
                        <button
                          onClick={() => handleCopy(bioText, idx)}
                          className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <p className="text-xs font-sans text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed font-medium">
                        {bioText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
