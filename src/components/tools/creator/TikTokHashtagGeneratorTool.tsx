import React, { useState } from 'react';
import { Copy, Check, Hash, Sparkles, Star, Flame } from 'lucide-react';

export const TikTokHashtagGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Coding');
  const [favorites, setFavorites] = useState<string[]>(['#fyp', '#viral', '#learnontiktok']);
  const [copiedAll, setCopiedAll] = useState(false);

  const getTikTokHashtags = () => {
    const raw = topic.trim().toLowerCase().replace(/\s+/g, '') || 'viral';

    return {
      'FYP & Main Stream': ['#fyp', '#foryou', '#foryoupage', '#viral', '#trending', '#fypシ', '#viralvideo', '#tiktok', '#xyzbca'],
      'Topic Specific': [`#${raw}`, `#${raw}tok`, `#${raw}tips`, `#${raw}hacks`, `#${raw}tutorial`, `#learn${raw}`, `#${raw}life`, `#best${raw}`],
      'Community & Niche': [`#${raw}community`, `#${raw}creator`, `#${raw}squad`, `#${raw}101`, `#${raw}mastery`, `#${raw}secrets`],
      'Growth & Engagement': ['#learnontiktok', '#tiktokviral', '#subscribetomychannel', '#blowthisup', '#featureme', '#trendingsound']
    };
  };

  const hashtagGroups = getTikTokHashtags();
  const allTagsFlat = Object.values(hashtagGroups).flat();
  const formattedAll = allTagsFlat.join(' ');

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formattedAll);
    setCopiedAll(true);
    onShowToast('Copied all TikTok hashtags!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const toggleFavorite = (tag: string) => {
    if (favorites.includes(tag)) {
      setFavorites(favorites.filter((t) => t !== tag));
      onShowToast(`Removed ${tag} from favorites`);
    } else {
      setFavorites([...favorites, tag]);
      onShowToast(`Saved ${tag} to favorites!`);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            TikTok Hashtag Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate FYP and niche TikTok hashtag clusters with built-in favorites manager and one-click copy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche Keyword</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Fitness, Gaming, Cooking, AI"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <button
            onClick={handleCopyAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Copied All Hashtags!' : `Copy All (${allTagsFlat.length})`}</span>
          </button>
        </div>
      </div>

      {/* Favorites Stack */}
      {favorites.length > 0 && (
        <div className="glass-card p-4 rounded-2xl border border-purple-500/30 space-y-2 bg-purple-500/5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-amber-500 flex items-center gap-1.5 uppercase">
              <Star className="w-4 h-4 fill-current" /> Favorites Manager ({favorites.length})
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(favorites.join(' '));
                onShowToast('Copied favorite hashtags!');
              }}
              className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Copy Saved Tags
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {favorites.map((fav) => (
              <span
                key={fav}
                onClick={() => toggleFavorite(fav)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold cursor-pointer transition-all border border-amber-500/40 flex items-center gap-1"
                title="Click to remove from favorites"
              >
                <span>{fav}</span>
                <span className="text-[10px] opacity-60">×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(hashtagGroups).map(([groupTitle, tags]) => (
          <div key={groupTitle} className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-purple-500" /> {groupTitle} ({tags.length})
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tags.join(' '));
                  onShowToast(`Copied ${groupTitle}!`);
                }}
                className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Set
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isFav = favorites.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      navigator.clipboard.writeText(tag);
                      onShowToast(`Copied ${tag}`);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleFavorite(tag);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                      isFav
                        ? 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                        : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20'
                    }`}
                    title="Left-click to copy, Right-click to favorite"
                  >
                    <span>{tag}</span>
                    {isFav && <Star className="w-2.5 h-2.5 fill-current text-amber-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
