import React, { useState } from 'react';
import { Copy, Check, Anchor, Share2, Sparkles, Youtube, Instagram, Linkedin, Facebook } from 'lucide-react';

const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn'] as const;
type Platform = typeof PLATFORMS[number];

export const ViralHookGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Coding Skills');
  const [platform, setPlatform] = useState<Platform>('YouTube');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateHooks = () => {
    const raw = topic.trim() || 'this topic';

    const hooksDatabase: Record<Platform, string[]> = {
      YouTube: [
        `If you are still doing ${raw} like this in 2026, stop immediately!`,
        `I spent 100 hours analyzing ${raw} so you don't have to...`,
        `The single biggest mistake 99% of people make with ${raw}.`,
        `9 out of 10 creators get ${raw} wrong. Here is why...`,
        `Here is the $10,000 secret about ${raw} no one wants you to know!`
      ],
      Instagram: [
        `3 ${raw} hacks that feel illegal to know 🤫`,
        `Save this post before you attempt ${raw}! 📌`,
        `Nobody is talking about this secret ${raw} trick... 🔥`,
        `How I mastered ${raw} in 3 easy steps ✨`,
        `Unpopular opinion: Most ${raw} advice is completely wrong.`
      ],
      TikTok: [
        `You won't believe what happens if you try ${raw} like this... 😱`,
        `Stop scrolling! If you care about ${raw}, watch this! ⚡`,
        `The secret ${raw} hack that changed my life in 24 hours!`,
        `Part 1 of ${raw} tips you actually need to know! 🚀`,
        `This ONE ${raw} trick will save you hours of work!`
      ],
      Facebook: [
        `Here is why ${raw} is becoming the most discussed topic this year.`,
        `Did you know this surprising fact about ${raw}?`,
        `A quick guide to ${raw} for anyone looking to upgrade their skills.`,
        `Why traditional methods for ${raw} no longer work in 2026.`,
        `5 proven strategies for ${raw} that bring real results.`
      ],
      LinkedIn: [
        `I interviewed 50 experts on ${raw}. Here are the top 5 takeaways:`,
        `The hard truth about ${raw} that most professionals ignore:`,
        `How we scaled our ${raw} workflow by 300% without spending a dollar.`,
        `3 counter-intuitive lessons I learned from 5 years of ${raw}:`,
        `If I had to start learning ${raw} again from scratch today, I would do this:`
      ]
    };

    return hooksDatabase[platform] || hooksDatabase['YouTube'];
  };

  const hooks = generateHooks();

  const handleCopy = (hookText: string, idx: number) => {
    navigator.clipboard.writeText(hookText);
    setCopiedIdx(idx);
    onShowToast('Hook copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Anchor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Viral Hook Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate retention-grabbing first lines for videos and posts on YouTube, Instagram, TikTok, Facebook & LinkedIn.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic / Core Angle</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Graphic Design, Passive Income, Fitness"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Social Platform</label>
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

      {/* Platform selector tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              platform === p
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {p === 'YouTube' && <Youtube className="w-3.5 h-3.5 text-red-500" />}
            {p === 'Instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
            {p === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
            {p === 'Facebook' && <Facebook className="w-3.5 h-3.5 text-blue-600" />}
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Generated Hooks Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Viral Opening Hooks for {platform}
        </h3>

        <div className="space-y-3">
          {hooks.map((hookText, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{hookText}</p>
              </div>

              <button
                onClick={() => handleCopy(hookText, idx)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? 'Copied!' : 'Copy Hook'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
