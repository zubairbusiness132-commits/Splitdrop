import React, { useState } from 'react';
import { Copy, Check, Hash, Globe, Share2 } from 'lucide-react';

const PLATFORMS = [
  'YouTube', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter (X)', 'Pinterest', 'Threads'
] as const;

type Platform = typeof PLATFORMS[number];

export const UniversalHashtagGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Artificial Intelligence');
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [copiedAll, setCopiedAll] = useState(false);

  const generateUniversalHashtags = (): string[] => {
    const raw = topic.trim().toLowerCase().replace(/\s+/g, '') || 'topic';

    const baseTags = [
      `#${raw}`, `#${raw}2026`, `#${raw}trends`, `#${raw}tech`, `#${raw}life`,
      `#${raw}tips`, `#${raw}hacks`, `#${raw}daily`, `#${raw}world`, `#${raw}community`,
      `#${raw}guide`, `#best${raw}`, `#${raw}hub`, `#${raw}inspiration`, `#${raw}expert`
    ];

    switch (platform) {
      case 'YouTube':
        return [...baseTags, '#shorts', '#youtube', '#youtuber', '#subscribe', '#viralvideo'];
      case 'Instagram':
        return [...baseTags, '#reelsinstagram', '#explorepage', '#gramoftheday', '#instadaily', '#photooftheday'];
      case 'TikTok':
        return [...baseTags, '#fyp', '#foryou', '#viral', '#learnontiktok', '#trending'];
      case 'Facebook':
        return [...baseTags, '#facebookpost', '#facebooklive', '#community', '#discussion', '#trendingtopic'];
      case 'LinkedIn':
        return [...baseTags, '#careers', '#innovation', '#technology', '#leadership', '#futureofwork'];
      case 'Twitter (X)':
        return [...baseTags, '#techX', '#buildinpublic', '#trendingnow', '#updates'];
      case 'Pinterest':
        return [...baseTags, '#pinterestinspo', '#diy', '#ideas', '#aesthetic', '#pinsoftheday'];
      case 'Threads':
        return [...baseTags, '#threadstrending', '#threadsapp', '#dailythoughts', '#textposts'];
      default:
        return baseTags;
    }
  };

  const hashtags = generateUniversalHashtags();
  const formattedTags = hashtags.join(' ');

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formattedTags);
    setCopiedAll(true);
    onShowToast(`Copied ${hashtags.length} hashtags for ${platform}!`);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Universal Hashtag Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate platform-tailored hashtag clusters for 8 major social media platforms in one click.
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
            placeholder="e.g. Graphic Design, Fitness, Startup"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Target</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Platform Buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              platform === p
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Output Hashtags */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <Hash className="w-4 h-4" /> Optimized Hashtags for {platform} ({hashtags.length})
          </h3>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy All Hashtags'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              onClick={() => {
                navigator.clipboard.writeText(tag);
                onShowToast(`Copied ${tag}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer transition-all border border-indigo-500/20"
              title="Click to copy single tag"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
