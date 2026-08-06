import React, { useState } from 'react';
import { Copy, Check, Facebook, Hash, TrendingUp, Sparkles } from 'lucide-react';

export const FacebookHashtagGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Digital Marketing');
  const [copiedAll, setCopiedAll] = useState(false);

  const getFacebookHashtags = () => {
    const raw = topic.trim().toLowerCase().replace(/\s+/g, '') || 'marketing';

    return {
      'Trending & High-Reach': [`#${raw}`, `#${raw}2026`, `#${raw}life`, `#${raw}community`, `#${raw}trending`, `#${raw}viral`],
      'Business & Professional': [`#${raw}business`, `#${raw}strategy`, `#${raw}expert`, `#${raw}tips`, `#${raw}solutions`, `#${raw}growth`],
      'Community & Discussion': [`#${raw}group`, `#${raw}discussion`, `#${raw}network`, `#${raw}hub`, `#${raw}insights`, `#${raw}talk`],
      'Event & Campaign': [`#${raw}event`, `#${raw}live`, `#${raw}launch`, `#${raw}today`, `#${raw}news`, `#${raw}official`]
    };
  };

  const hashtagGroups = getFacebookHashtags();
  const allTagsFlat = Object.values(hashtagGroups).flat();
  const formattedAll = allTagsFlat.join(' ');

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formattedAll);
    setCopiedAll(true);
    onShowToast('Copied all Facebook hashtags!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Facebook Hashtag Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate trending-style Facebook hashtags categorized for business posts, community discussions, and campaign launches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic Keyword</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Small Business, Real Estate, E-Commerce"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <button
            onClick={handleCopyAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Copied All Hashtags!' : `Copy All (${allTagsFlat.length})`}</span>
          </button>
        </div>
      </div>

      {/* Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(hashtagGroups).map(([groupTitle, tags]) => (
          <div key={groupTitle} className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> {groupTitle} ({tags.length})
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tags.join(' '));
                  onShowToast(`Copied ${groupTitle}!`);
                }}
                className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Set
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => {
                    navigator.clipboard.writeText(tag);
                    onShowToast(`Copied ${tag}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold cursor-pointer transition-all border border-blue-500/20"
                  title="Click to copy single tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
