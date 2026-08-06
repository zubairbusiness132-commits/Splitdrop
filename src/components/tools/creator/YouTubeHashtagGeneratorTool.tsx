import React, { useState } from 'react';
import { Copy, Check, Hash, TrendingUp, Layers, Sparkles } from 'lucide-react';

export const YouTubeHashtagGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('AI Tools');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const getHashtagGroups = () => {
    const raw = topic.trim().replace(/\s+/g, '') || 'YouTube';
    const lower = raw.toLowerCase();

    return {
      'High Volume': [
        `#${lower}`,
        `#${lower}2026`,
        `#viral`,
        `#youtube`,
        `#trending`
      ],
      'Medium Volume': [
        `#${lower}tutorial`,
        `#${lower}tips`,
        `#${lower}guide`,
        `#${lower}hacks`,
        `#${lower}mastery`
      ],
      'Long Tail': [
        `#${lower}forbeginners`,
        `#${lower}stepbystep`,
        `#${lower}explained`,
        `#best${lower}video`,
        `#${lower}secrets`
      ],
      'Trending Style': [
        `#shorts`,
        `#youtubeshorts`,
        `#creator`,
        `#tech`,
        `#contentcreator`
      ]
    };
  };

  const groups = getHashtagGroups();
  const allHashtags = Object.values(groups).flat().join(' ');

  const handleCopyAll = () => {
    navigator.clipboard.writeText(allHashtags);
    setCopiedAll(true);
    onShowToast('All hashtags copied to clipboard!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyGroup = (groupName: string, tags: string[]) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedSection(groupName);
    onShowToast(`${groupName} hashtags copied!`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Hashtag Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate categorized YouTube hashtags for High Volume, Medium Volume, Long Tail & Trending reach.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche or Video Keyword</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Graphic Design, Fitness, Gaming"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleCopyAll}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" /> Copied All Hashtags!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy All Hashtags
            </>
          )}
        </button>
      </div>

      {/* Categorized Hashtags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groups).map(([groupTitle, tags]) => (
          <div
            key={groupTitle}
            className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                {groupTitle}
              </span>
              <button
                onClick={() => handleCopyGroup(groupTitle, tags)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === groupTitle ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Group
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 text-xs font-bold"
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
