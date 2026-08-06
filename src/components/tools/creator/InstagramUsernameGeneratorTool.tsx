import React, { useState } from 'react';
import { Copy, Check, Instagram, RefreshCw, User, Sparkles } from 'lucide-react';

const USERNAME_CATEGORIES = ['Short', 'Professional', 'Creative', 'Minimal', 'Random'] as const;
type UsernameCategory = typeof USERNAME_CATEGORIES[number];

export const InstagramUsernameGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [name, setName] = useState('Alex');
  const [keyword, setKeyword] = useState('Code');
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const generateUsernames = (): Record<UsernameCategory, string[]> => {
    const rawName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'alex';
    const rawKey = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'studio';

    return {
      Short: [
        `i${rawName}`,
        `${rawName}x`,
        `the${rawName}`,
        `${rawName}_`,
        `${rawName}hq`,
        `im${rawName}`
      ],
      Professional: [
        `${rawName}.${rawKey}`,
        `${rawName}${rawKey}official`,
        `${rawName}_${rawKey}_hq`,
        `real${rawName}${rawKey}`,
        `${rawName}${rawKey}studio`,
        `${rawName}consulting`
      ],
      Creative: [
        `${rawName}creates`,
        `${rawName}_in_${rawKey}land`,
        `vibe.with.${rawName}`,
        `${rawName}verse`,
        `${rawName}.aesthetics`,
        `beyond${rawName}`
      ],
      Minimal: [
        `${rawName}`,
        `${rawName}.${rawName[0] || 'x'}`,
        `_${rawName}_`,
        `.${rawName}.`,
        `${rawName}v`,
        `by${rawName}`
      ],
      Random: [
        `${rawName}${Math.floor(Math.random() * 899 + 100)}`,
        `${rawName}_${rawKey}_${Math.floor(Math.random() * 89 + 10)}`,
        `its${rawName}${rawKey}`,
        `daily.${rawName}.${rawKey}`,
        `${rawName}_the_${rawKey}`,
        `just${rawName}`
      ]
    };
  };

  const usernameData = generateUsernames();

  const handleCopy = (username: string) => {
    navigator.clipboard.writeText(`@${username}`);
    setCopiedIdx(username);
    onShowToast(`Copied @${username} to clipboard!`);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Instagram Username Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate clean, brandable Instagram handles categorized into Short, Professional, Creative, Minimal & Random.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your First Name / Brand Word</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex, Sarah, Pixel"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche / Topic Word (Optional)</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Code, Design, Fits"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {USERNAME_CATEGORIES.map((cat) => {
          const list = usernameData[cat];

          return (
            <div key={cat} className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {cat} Style
                </span>
                <span className="text-[10px] font-bold text-slate-400">{list.length} Options</span>
              </div>

              <div className="space-y-1.5">
                {list.map((u) => (
                  <button
                    key={u}
                    onClick={() => handleCopy(u)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center justify-between group cursor-pointer border border-slate-200/50 dark:border-slate-800 transition-all"
                  >
                    <span>@{u}</span>
                    <span className="flex items-center gap-1 text-[10px] font-sans text-pink-600 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedIdx === u ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedIdx === u ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
