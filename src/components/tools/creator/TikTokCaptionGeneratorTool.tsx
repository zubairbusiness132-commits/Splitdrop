import React, { useState } from 'react';
import { Copy, Check, Sparkles, Zap, Flame, RefreshCw } from 'lucide-react';

const TIKTOK_CATEGORIES = ['Entertainment', 'Comedy', 'Education', 'Gaming', 'Lifestyle', 'Technology'] as const;
type TikTokCategory = typeof TIKTOK_CATEGORIES[number];

export const TikTokCaptionGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Secret Hack');
  const [category, setCategory] = useState<TikTokCategory>('Education');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateTikTokCaptions = (): string[] => {
    const raw = topic.trim() || 'this topic';

    const database: Record<TikTokCategory, string[]> = {
      Entertainment: [
        `You won't believe what happens at the end! 😱 Wait for it... 🔥 #fyp #viral #${raw.replace(/\s+/g, '')}`,
        `This is your sign to try ${raw} today! ✨ Comment your thoughts below! 👇 #foryou #trending`,
        `Rating ${raw} on a scale of 1-10! 🤯 What should I try next? #fypシ #entertainment`
      ],
      Comedy: [
        `Tell me why ${raw} always happens when I am not prepared 💀😭 #relatable #comedy #fyp`,
        `My last 2 brain cells trying to figure out ${raw} 🤪 #humor #funny #foryoupage`,
        `Nobody: \nMe explaining ${raw} to my friends at 3 AM: 💀🤣 #memes #viralvideo`
      ],
      Education: [
        `3 secrets about ${raw} that feel illegal to know! 🤫 Save this before it gets deleted! 📌 #learnontiktok #tipsandtricks`,
        `Stop doing ${raw} wrong! Here is the correct way in 15 seconds ⏱️ #tech #tutorial #fyp`,
        `How to master ${raw} step-by-step 🧠 Bookmark this video! #education #studenthacks`
      ],
      Gaming: [
        `The most insane ${raw} play you will see all day! 🎮🔥 Rate this 1-10! 👇 #gaming #gamer #fyp`,
        `How to unlock ${raw} in 2026! 🚀 Share this with your squad! 🕹️ #gamingontiktok #gamers`,
        `POV: You finally mastered ${raw} after 100 attempts 🏆 #gameplay #streamer`
      ],
      Lifestyle: [
        `Spend a productive day with me doing ${raw} ✨ Aesthetic vlog vibes! 🌿 #lifestyle #vlog #fyp`,
        `My honest review of ${raw} after 30 days... 💭 Worth the hype? #dailyvlog #aesthetic`,
        `Get ready with me while we talk about ${raw} 💄✨ #grwm #lifestyleblogger`
      ],
      Technology: [
        `This AI tool for ${raw} changes EVERYTHING! 🤖💥 Link in bio to try it! #tech #ai #innovation`,
        `The ultimate tech hack for ${raw} you need in 2026 💻⚡ #technology #productivity`,
        `3 hidden software tricks for ${raw}! 🚀 #software #coding #techhacks`
      ]
    };

    return database[category] || database['Education'];
  };

  const captions = generateTikTokCaptions();

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    onShowToast('TikTok caption copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            TikTok Caption Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate retention-focused TikTok captions with viral hooks, emojis, and FYP hashtag clusters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic / Focus Angle</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. iPhone Hidden Feature, Morning Routine"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TikTokCategory)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {TIKTOK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TIKTOK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === cat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Generated Captions */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Viral TikTok Captions ({category})
        </h3>

        <div className="space-y-3">
          {captions.map((captionText, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Hook Variation #{idx + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{captionText.length} Chars</span>
              </div>

              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed font-sans">
                {captionText}
              </p>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleCopy(captionText, idx)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied TikTok Caption!' : 'Copy TikTok Caption'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
