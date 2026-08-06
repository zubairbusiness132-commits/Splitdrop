import React, { useState } from 'react';
import { Copy, Check, Megaphone, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

const CTA_TYPES = ['Subscribe CTA', 'Like CTA', 'Comment CTA', 'Share CTA', 'Website / Link CTA'] as const;
type CtaType = typeof CTA_TYPES[number];

const TONES = ['High-Converting', 'Friendly & Warm', 'Urgent & FOMO', 'Minimalist & Clean', 'Funny & Relatable'] as const;
type Tone = typeof TONES[number];

export const CtaGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [ctaType, setCtaType] = useState<CtaType>('Subscribe CTA');
  const [tone, setTone] = useState<Tone>('High-Converting');
  const [channelOrProduct, setChannelOrProduct] = useState('My Tech Channel');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateCtas = () => {
    const target = channelOrProduct.trim() || 'the channel';

    const database: Record<CtaType, Record<Tone, string[]>> = {
      'Subscribe CTA': {
        'High-Converting': [
          `If you want to master this skill every week, hit that SUBSCRIBE button and turn on notifications! 🔥`,
          `Join 50,000+ creators getting weekly tutorials! Click SUBSCRIBE now so you never miss an episode. 🚀`,
          `Subscribe to ${target} today for actionable step-by-step guides delivered every single week!`
        ],
        'Friendly & Warm': [
          `If this helped you out today, I'd really appreciate it if you subscribed to support the channel! ❤️`,
          `Thanks so much for watching! Consider subscribing if you'd like to stick around for future videos. 😊`,
          `Welcome to the community! Don't forget to hit subscribe to stay connected with us.`
        ],
        'Urgent & FOMO': [
          `Don't miss out on next week's exclusive breakdown! Hit SUBSCRIBE right now before you forget! ⚠️`,
          `Subscribe now! Our next video will only be relevant for a limited time—stay ahead of the curve! ⚡`
        ],
        'Minimalist & Clean': [
          `Subscribe for weekly tutorials: [Link]`,
          `Hit Subscribe for more videos.`,
          `New videos every Tuesday. Click Subscribe.`
        ],
        'Funny & Relatable': [
          `Subscribing is 100% free and gives you good karma. Hit that button! 😄`,
          `If you don't subscribe, an algorithm angel loses its wings. Click subscribe! 😇`,
          `Hit subscribe or your next coffee will be cold. Don't risk it!`
        ]
      },
      'Like CTA': {
        'High-Converting': [
          `Smash the LIKE button right now if you found even one valuable tip in this video! 👍`,
          `Hitting LIKE helps the algorithm share this free guide with more people. Takes 1 second! ⚡`,
          `Give this video a thumbs up to tell YouTube you want more content like this!`
        ],
        'Friendly & Warm': [
          `If you enjoyed spending time with us today, leaving a like means the world to me! 🙏`,
          `A quick like helps support all the hard work that goes into making these videos for you.`
        ],
        'Urgent & FOMO': [
          `Quick! Hit LIKE right now so YouTube recommends part 2 to your feed automatically!`
        ],
        'Minimalist & Clean': [
          `Like this video if it helped.`,
          `Drop a like if you enjoyed this.`,
          `Thumbs up for more guides.`
        ],
        'Funny & Relatable': [
          `Smash that like button like it owes you money! 😂`,
          `Boop the like button gently. It appreciates you.`
        ]
      },
      'Comment CTA': {
        'High-Converting': [
          `Which tip was your favorite? Drop a comment below with your thoughts right now! 💬`,
          `What are you currently struggling with? Comment below and I will reply to every single one! 👇`,
          `Tell me in the comments: Option A or Option B? I want to hear your perspective!`
        ],
        'Friendly & Warm': [
          `I love reading your comments! Let me know how your project is going below. 😊`,
          `Got any questions? Ask away in the comments, I am always happy to help!`
        ],
        'Urgent & FOMO': [
          `Comment 'INFO' below in the next 24 hours to get my private cheat sheet for free!`
        ],
        'Minimalist & Clean': [
          `Leave your feedback in the comments.`,
          `What do you think? Comment below.`,
          `Drop your questions in the comments.`
        ],
        'Funny & Relatable': [
          `Comment down below even if it's just your favorite emoji. Help me confuse the algorithm! 🤪`
        ]
      },
      'Share CTA': {
        'High-Converting': [
          `Know someone who needs this guide? Click SHARE to send this video directly to them! 📤`,
          `Share this video with a friend or colleague who is working on ${target} right now!`
        ],
        'Friendly & Warm': [
          `Sharing is caring! Feel free to share this video with anyone who might find it useful.`
        ],
        'Urgent & FOMO': [
          `Share this urgent breakdown with your team before they make this critical mistake!`
        ],
        'Minimalist & Clean': [
          `Share this video with a friend.`,
          `Pass this along to your team.`,
          `Click share to spread the word.`
        ],
        'Funny & Relatable': [
          `Share this with that one friend who always forgets how to do this! 😂`
        ]
      },
      'Website / Link CTA': {
        'High-Converting': [
          `Ready to level up? Click the top link in the description to grab your free templates now! 🔗`,
          `Get instant access to ${target} by clicking the link in the description below! 🚀`,
          `Download the full source code and resources at the link in the description!`
        ],
        'Friendly & Warm': [
          `Check out our website at the link in the description if you'd like to learn more!`,
          `All resources mentioned in this video are linked cleanly in the description below.`
        ],
        'Urgent & FOMO': [
          `Limited spots available! Click the link below immediately to claim your free pass! ⏳`
        ],
        'Minimalist & Clean': [
          `Link in description: [URL]`,
          `Visit our website to get started.`,
          `Resources linked below.`
        ],
        'Funny & Relatable': [
          `The link is waiting in the description like a loyal golden retriever. Go click it! 🐶`
        ]
      }
    };

    return database[ctaType]?.[tone] || database['Subscribe CTA']['High-Converting'];
  };

  const ctaList = generateCtas();

  const handleCopy = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    onShowToast('CTA phrase copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            CTA (Call to Action) Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate high-converting Call-To-Action scripts for Subscribe, Like, Comment, Share & Links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Objective</label>
          <select
            value={ctaType}
            onChange={(e) => setCtaType(e.target.value as CtaType)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {CTA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Communication Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {TONES.map((tn) => (
              <option key={tn} value={tn}>
                {tn}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Channel / Product Name</label>
          <input
            type="text"
            value={channelOrProduct}
            onChange={(e) => setChannelOrProduct(e.target.value)}
            placeholder="e.g. Code Academy, Tech Master"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Generated List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Generated {ctaType} Script Options ({tone})
        </h3>

        <div className="space-y-3">
          {ctaList.map((ctaText, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{ctaText}</p>

              <button
                onClick={() => handleCopy(ctaText, idx)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
