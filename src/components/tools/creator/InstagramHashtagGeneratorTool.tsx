import React, { useState } from 'react';
import { Copy, Check, Hash, Instagram, Layers, Sparkles } from 'lucide-react';

const HASHTAG_GROUPS = [
  'Popular Hashtags',
  'Niche Hashtags',
  'Long-tail Hashtags',
  'Local Hashtags',
  'Reels Hashtags'
] as const;

type HashtagGroup = typeof HASHTAG_GROUPS[number];

export const InstagramHashtagGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Fitness');
  const [copiedAll, setCopiedAll] = useState(false);

  const getHashtags = (): Record<HashtagGroup, string[]> => {
    const raw = topic.trim().toLowerCase().replace(/\s+/g, '');
    const cleanTopic = raw || 'instagram';

    return {
      'Popular Hashtags': [
        `#${cleanTopic}`, `#${cleanTopic}life`, `#${cleanTopic}gram`, `#${cleanTopic}daily`, `#${cleanTopic}love`,
        `#${cleanTopic}community`, `#${cleanTopic}world`, `#${cleanTopic}oftheday`, `#${cleanTopic}inspiration`, `#${cleanTopic}style`
      ],
      'Niche Hashtags': [
        `#${cleanTopic}tips`, `#${cleanTopic}hacks`, `#${cleanTopic}expert`, `#${cleanTopic}guide`, `#${cleanTopic}hub`,
        `#${cleanTopic}secrets`, `#${cleanTopic}strategy`, `#${cleanTopic}creator`, `#${cleanTopic}addict`, `#${cleanTopic}society`
      ],
      'Long-tail Hashtags': [
        `#best${cleanTopic}tips`, `#howto${cleanTopic}`, `#daily${cleanTopic}inspo`, `#${cleanTopic}forbeginners`, `#${cleanTopic}motivationtoday`,
        `#${cleanTopic}transformation`, `#real${cleanTopic}results`, `#${cleanTopic}lifestyleblog`
      ],
      'Local Hashtags': [
        `#${cleanTopic}usa`, `#${cleanTopic}uk`, `#${cleanTopic}nyc`, `#${cleanTopic}london`, `#${cleanTopic}india`,
        `#${cleanTopic}mumbai`, `#${cleanTopic}dubai`, `#${cleanTopic}toronto`
      ],
      'Reels Hashtags': [
        `#reels${cleanTopic}`, `#${cleanTopic}reels`, `#reelsinstagram`, `#trendingreels`, `#viralreels`,
        `#explorepage`, `#reelsviral`, `#instareels`
      ]
    };
  };

  const hashtagData = getHashtags();
  const allHashtagsFlat = Object.values(hashtagData).flat();
  const allHashtagsFormatted = allHashtagsFlat.join(' ');
  const totalCharCount = allHashtagsFormatted.length;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(allHashtagsFormatted);
    setCopiedAll(true);
    onShowToast('All hashtags copied to clipboard!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyGroup = (groupName: string, tags: string[]) => {
    navigator.clipboard.writeText(tags.join(' '));
    onShowToast(`Copied ${groupName}!`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Instagram Hashtag Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate categorized popular, niche, long-tail, local, and Reels hashtags with real-time character metrics.
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
            placeholder="e.g. Travel, Photography, Marketing"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <button
            onClick={handleCopyAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Copied All Hashtags!' : `Copy All (${allHashtagsFlat.length})`}</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Total Generated Hashtags: <span className="text-pink-600 dark:text-pink-400">{allHashtagsFlat.length}</span>
        </span>
        <span>Character Count: <span className="text-indigo-600 dark:text-indigo-400">{totalCharCount}</span> / 2200 max</span>
      </div>

      {/* Categorized Hashtag Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HASHTAG_GROUPS.map((group) => {
          const tags = hashtagData[group];
          const groupFormatted = tags.join(' ');

          return (
            <div key={group} className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5 text-pink-500" />
                  {group} ({tags.length})
                </h3>
                <button
                  onClick={() => handleCopyGroup(group, tags)}
                  className="text-[10px] font-extrabold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                    className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold cursor-pointer transition-all border border-pink-500/20"
                    title="Click to copy single tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
