import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Layers, SlidersHorizontal, Share2 } from 'lucide-react';

const CATEGORIES = [
  'Tutorial', 'Review', 'Gaming', 'Education', 'Tech', 
  'Finance', 'AI', 'Vlog', 'Shorts', 'News', 'Islamic', 'Entertainment'
] as const;

type Category = typeof CATEGORIES[number];

const STYLES = ['High CTR & Curiosity', 'How-To & Guides', 'Listicles & Top 10', 'Debate & Questions', 'Urgency & Secret Formula'];

export const YouTubeTitleGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('React 19 & Next.js');
  const [category, setCategory] = useState<Category>('Tech');
  const [style, setStyle] = useState('High CTR & Curiosity');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateTitles = () => {
    const raw = topic.trim() || 'My Video Topic';
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1);

    const titleTemplates: Record<Category, string[]> = {
      Tutorial: [
        `How to Master ${cap} in 10 Minutes (Step-by-step)`,
        `Stop Doing ${cap} Wrong! Do THIS Instead`,
        `The Ultimate ${cap} Tutorial for Beginners (2026)`,
        `Learn ${cap} From Scratch: Complete Practical Guide`,
        `5 Easy Steps to Master ${cap} Fast!`,
        `${cap} Explained Simply (No Experience Needed)`
      ],
      Review: [
        `Is ${cap} ACTUALLY Worth It? Honest Unfiltered Review`,
        `I Tried ${cap} For 30 Days (Real Results)`,
        `${cap} Review: Don't Buy Until You Watch THIS!`,
        `The Truth About ${cap} (Pros, Cons & Regrets)`,
        `${cap} vs The Competition: Which One Wins?`,
        `Why Everyone Is Talking About ${cap}!`
      ],
      Gaming: [
        `I Spent 100 Hours Testing ${cap} (INSANE RESULTS)`,
        `The Most BROKEN ${cap} Strategy You Must Try`,
        `Noob vs Pro in ${cap}: Impossible Challenge!`,
        `Only 1% Of Players Know This ${cap} Secret`,
        `I Unlocked Everything in ${cap} So You Don't Have To`,
        `10 Secret Tips for ${cap} You Missed!`
      ],
      Education: [
        `The Shocking Truth About ${cap} (Explained)`,
        `Everything You Need to Know About ${cap}`,
        `Why ${cap} Will Change Everything in 2026`,
        `The Hidden Math/Science Behind ${cap}`,
        `${cap}: 5 Deep Insights Most People Miss`,
        `A Complete Breakdown of ${cap} Made Simple`
      ],
      Tech: [
        `The Future of ${cap} Is HERE (Full Breakdown)`,
        `Why ${cap} Changes EVERYTHING For Tech in 2026`,
        `I Built a Project Using ${cap} in 24 Hours!`,
        `${cap} Top Features You Need to Use Right Now`,
        `Don't Ignore ${cap}: The Next Big Revolution`,
        `The Ultimate Tech Setup with ${cap}`
      ],
      Finance: [
        `How to Make Money with ${cap} in 2026 (Beginner Guide)`,
        `The ${cap} Mistake Costing You Thousands!`,
        `How I Turned ${cap} into Passive Income`,
        `3 ${cap} Strategies That ACTUALLY Work`,
        `Is ${cap} Still Profitable? Honest Analysis`,
        `The Smart Way to Invest in ${cap}`
      ],
      AI: [
        `I Replaced My Workflow with ${cap} AI (Mind Blown)`,
        `10 Secret ${cap} AI Prompts You Didn't Know Exist`,
        `${cap} AI Just Made Everything Else Obsolete!`,
        `How to Use ${cap} AI Like a Pro in 5 Minutes`,
        `The DARK Side of ${cap} AI No One Is Talking About`,
        `Automate Your Entire Life with ${cap} AI`
      ],
      Vlog: [
        `A Day in My Life Testing ${cap} (Unexpected Ending)`,
        `I Tried ${cap} For a Week and THIS Happened!`,
        `We Needs to Talk About ${cap}...`,
        `My HONEST Thoughts on ${cap} After 1 Year`,
        `Behind the Scenes of ${cap} (Raw & Uncut)`,
        `A Life-Changing Experience with ${cap}`
      ],
      Shorts: [
        `Do THIS for ${cap}! 😱 #Shorts`,
        `Secret ${cap} Trick You Need NOW! 🔥`,
        `Stop Doing ${cap} Like This! ❌`,
        `${cap} In 30 Seconds! ⚡`,
        `Mind-Blowing ${cap} Hack! 💡`,
        `You Won't Believe This ${cap} Secret! 🚀`
      ],
      News: [
        `BREAKING: Major Update on ${cap} Announced!`,
        `What Just Happened to ${cap}? Full Report`,
        `The Real Reason Behind the ${cap} Crisis`,
        `Everything Changing About ${cap} Starting Today`,
        `Why ${cap} Is Trending Worldwide Right Now`,
        `What You Must Know About ${cap} Today`
      ],
      Islamic: [
        `The Powerful Blessings of ${cap} in Islam`,
        `How to Practice ${cap} According to Sunnah`,
        `Beautiful Daily Guide to ${cap} for Peace`,
        `Understanding ${cap}: Meaning & Spiritual Rewards`,
        `3 Important Lessons About ${cap} Every Muslim Should Know`,
        `The Spiritual Impact of ${cap} in Daily Life`
      ],
      Entertainment: [
        `Top 10 Craziest Moments in ${cap} (Ranked)`,
        `Reacting to the Most Unbelievable ${cap} Videos!`,
        `I Tried ${cap} Challenge (Extreme Mode)`,
        `The Funniest ${cap} Fail Compilation Ever`,
        `We Tested Every Single ${cap} So You Don't Have To`,
        `10 Secrets Hidden in ${cap} You Never Noticed`
      ]
    };

    let base = titleTemplates[category] || titleTemplates['Tech'];

    if (style.includes('How-To')) {
      base = base.map(t => t.startsWith('How') ? t : `How To Master ${raw}: ${t}`);
    } else if (style.includes('Listicles')) {
      base = base.map((t, idx) => `Top ${ (idx + 1) * 3 } Secrets About ${raw} You Must Know`);
    } else if (style.includes('Debate')) {
      base = base.map(t => `Is ${raw} Overrated? ${t}`);
    } else if (style.includes('Urgency')) {
      base = base.map(t => `⚠️ URGENT: Watch Before Doing ${raw}!`);
    }

    return base;
  };

  const titles = generateTitles();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    onShowToast('Title copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Title Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate viral, high-CTR, SEO-optimized titles tailored to your topic and niche.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Video Topic / Keywords
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Python Basics, iPhone 16 Review"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> Category Preset
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" /> Formula Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white cursor-pointer"
          >
            {STYLES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills Quick Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-[11px] font-bold text-slate-400">Quick Category:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Generated Suggestions Grid */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Suggested Video Titles ({titles.length})
          </h3>
          <button
            onClick={() => onShowToast('Refreshed title formulas!')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-shuffle Formulas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {titles.map((titleText, idx) => {
            const charCount = titleText.length;
            const isOptimal = charCount >= 45 && charCount <= 70;
            return (
              <div
                key={idx}
                className="glass-card p-4 rounded-2xl flex flex-col justify-between gap-3 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/40 transition-all group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Option {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isOptimal
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}
                      title={isOptimal ? 'Optimal title length for YouTube SEO' : 'Slightly short/long for YouTube search'}
                    >
                      {charCount} Chars
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {titleText}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {category} • {style}
                  </span>
                  <button
                    onClick={() => handleCopy(titleText, idx)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Title
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
