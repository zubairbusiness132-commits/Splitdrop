import React, { useState } from 'react';
import { Copy, Check, Instagram, Sparkles, RefreshCw, Hash, Tag } from 'lucide-react';

const CATEGORIES = [
  'Reels', 'Posts', 'Stories', 'Business', 'Travel', 'Food', 
  'Fashion', 'Fitness', 'Education', 'Motivation', 'Personal Brand'
] as const;

type Category = typeof CATEGORIES[number];

export const InstagramCaptionGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('Weekend Vibes');
  const [category, setCategory] = useState<Category>('Posts');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateCaptions = (): string[] => {
    const keyword = topic.trim() || 'this moment';

    const database: Record<Category, string[]> = {
      Reels: [
        `Watch until the end to see how ${keyword} turned out! 😱🔥\nDrop a comment if you would try this! 👇 #reels #viral #${keyword.replace(/\s+/g, '')}`,
        `The secret to ${keyword} nobody tells you about... ✨ Save this reel for later! 📌 #reelsinstagram #trending`,
        `POV: You finally figured out ${keyword} 🚀 Drop a ❤️ if you relate! #instagramreels #explorepage`
      ],
      Posts: [
        `Finding beauty in ${keyword} everyday. ✨ Life is short, make every post count! 📸\n\nWhat are your thoughts on this? Let me know below! 👇\n.#lifestyle #${keyword.replace(/\s+/g, '')} #photooftheday`,
        `Current status: Obsessed with ${keyword} 💭 Here is your daily reminder to do what makes your soul shine. ✨\n.#positivevibes #gramoftheday`,
        `Capturing ${keyword} in its purest form. 🌟 Swipe left to see the behind-the-scenes! ➡️`
      ],
      Stories: [
        `Quick question about ${keyword}! Vote in the poll above! 👆🔥`,
        `Behind the scenes of ${keyword}... stay tuned for something big! 👀✨`,
        `Tap for a surprise! 🤫 What do you think about ${keyword}?`
      ],
      Business: [
        `Transform your approach to ${keyword} with these 3 proven steps! 📈💼\n\n1️⃣ Step One: Start consistency.\n2️⃣ Step Two: Optimize your workflow.\n3️⃣ Step Three: Measure results.\n\n🔗 Click the link in bio to learn more! #businessgrowth #${keyword.replace(/\s+/g, '')}`,
        `Why ${keyword} is the game-changer your business needs in 2026. 🚀 Save this post and share it with a colleague! 📌 #entrepreneurship #business`
      ],
      Travel: [
        `Wanderlust and ${keyword} 🌍 Airplane mode: ON.✈️\n\nIs ${keyword} on your travel bucket list? Let me know in the comments! 🗺️✨ #travelgram #wanderlust`,
        `Lost in the magic of ${keyword}. 🌄 Memories that will last a lifetime. ✨ #exploremore #travelphotography`
      ],
      Food: [
        `Good food, good mood, and ${keyword}! 🍕🥗 Deliciousness on a plate. 😋\n\nTag a friend who would love this! 👇 #foodie #instafood #${keyword.replace(/\s+/g, '')}`,
        `Cooking up some ${keyword} magic today! 👩‍🍳 Here is your sign to indulge in something yummy. 🍩✨ #foodstagram`
      ],
      Fashion: [
        `OOTD featuring ${keyword} 👗✨ Serving looks and good energy all day. 💅\n\nWhich piece is your favorite? Comment 1 or 2! 👇 #fashionstyle #ootd`,
        `Style is a way to say who you are without speaking. Embracing ${keyword} today! 👠✨ #streetstyle #fashioninspo`
      ],
      Fitness: [
        `No excuses! Crushing ${keyword} today 💪 Every workout brings you one step closer to your goals. 🔥\n\nSave this for your next gym session! 🏋️‍♂️ #fitnessmotivation #workout`,
        `Mindset + Work = Results. Today's focus: ${keyword} 🏃‍♀️ Let's get it! 🔥 #fitlife #healthyliving`
      ],
      Education: [
        `Did you know this about ${keyword}? 🧠 Here are 3 facts that will change how you think:\n\n💡 Fact 1: Knowledge is leverage.\n💡 Fact 2: Practice makes progress.\n💡 Fact 3: Never stop learning.\n\nSave this post! 📌 #education #learning`,
        `Mastering ${keyword} in 60 seconds! 📚 Bookmark this guide for reference later! 📌 #elearning #tipsandtricks`
      ],
      Motivation: [
        `Your potential is limitless when you focus on ${keyword}. 🚀 Don't wait for opportunity. Create it. ✨\n\nDouble tap if you needed to hear this today! ❤️ #motivation #mindset`,
        `Small daily habits around ${keyword} lead to massive long-term transformations. 🌟 Keep pushing! 💪 #inspiration #goals`
      ],
      'Personal Brand': [
        `Building in public: My honest journey with ${keyword}. 🌟 The wins, the lessons, and what comes next.\n\nThank you for being part of this community! ❤️ #personalbrand #entrepreneur`,
        `Authenticity over perfection. Here is what ${keyword} taught me this week. 💭 What lessons are you reflecting on? 👇`
      ]
    };

    return database[category] || database['Posts'];
  };

  const captions = generateCaptions();

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    onShowToast('Instagram caption copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Instagram Caption Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate engagement-driven Instagram captions with formatting, emojis, line breaks, and hashtags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic / Focus Keyword</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Summer Outfits, Coding Tips, Coffee Morning"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category / Type</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === cat
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Caption Output Options */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Generated Instagram Caption Variations ({category})
        </h3>

        <div className="space-y-4">
          {captions.map((captionText, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 hover:border-pink-500/40 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  Option #{idx + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{captionText.length} Chars</span>
              </div>

              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed font-sans">
                {captionText}
              </p>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleCopy(captionText, idx)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied Caption!' : 'Copy Caption'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
