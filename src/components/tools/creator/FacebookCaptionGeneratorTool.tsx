import React, { useState } from 'react';
import { Copy, Check, Facebook, MessageSquare, Share2 } from 'lucide-react';

const FB_CATEGORIES = [
  'Business', 'Festival', 'Events', 'Travel', 'Technology', 'Marketing', 'Personal'
] as const;

type FbCategory = typeof FB_CATEGORIES[number];

export const FacebookCaptionGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('New Product Launch');
  const [category, setCategory] = useState<FbCategory>('Business');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateFbCaptions = (): string[] => {
    const raw = topic.trim() || 'this announcement';

    const database: Record<FbCategory, string[]> = {
      Business: [
        `🚨 Exciting Announcement! 🚨\n\nWe are thrilled to share big updates regarding ${raw}! Our team has been working hard behind the scenes to deliver the best quality for you.\n\n👉 What do you think about this update? Drop your comments below and tag a friend who needs to see this!\n\n#BusinessUpdate #${raw.replace(/\s+/g, '')} #CompanyNews`,
        `Growth happens when strategy meets execution. Here is how we are taking ${raw} to the next level this quarter! 📈\n\nVisit our website or leave a comment below to get started today!`
      ],
      Festival: [
        `✨ Wishing everyone a joyful and blessed celebration for ${raw}! 🎉 May your home be filled with peace, love, happiness, and prosperity.\n\nHow are you celebrating today? Share your festive photos in the comments! 👇❤️ #FestiveVibes #HappyCelebration`,
        `Warmest greetings to you and your family on this special occasion of ${raw}! 🌺 Enjoy every moment with your loved ones! ✨`
      ],
      Events: [
        `🎉 Join us live for ${raw}! You won't want to miss this incredible experience.\n\n📅 Date: This Weekend\n📍 Location: Online & On-site\n\n👉 Click the link below to reserve your spot now before tickets run out! #EventAlert #SpecialEvent`,
        `Counting down the days to ${raw}! ⏳ Who else is excited? Let us know in the comments if you'll be joining us!`
      ],
      Travel: [
        ` Traveling opens your heart, broadens your mind, and fills your life with stories to tell. Today's adventure: ${raw}! 🏞️✈️\n\nHave you ever visited this place? What is your favorite travel memory? Share below! 👇 #TravelDiaries #Wanderlust`,
        `Chasing horizons and discovering ${raw}. Life is either a daring adventure or nothing at all! 🌄✨`
      ],
      Technology: [
        `💡 The future of technology is evolving faster than ever. Today we are diving deep into ${raw}! 💻🤖\n\nHow do you think this innovation will shape our daily lives? Share your thoughts with us in the comments! #TechNews #Innovation`,
        `Tech Spotlight: ${raw}! 🚀 Here is everything you need to know about this breakthrough tool in 2026.`
      ],
      Marketing: [
        `🎯 Marketing 101: Why ${raw} is the key to converting leads into loyal customers in 2026!\n\nCheck out these 3 core pillars:\n1️⃣ Clear messaging\n2️⃣ Strong Call-To-Action\n3️⃣ Authentic storytelling\n\nLike & share if you found this helpful! 📢 #DigitalMarketing #GrowthHacks`,
        `Struggling with reach? Here is how focusing on ${raw} can double your organic engagement this month!`
      ],
      Personal: [
        ` Grateful for new milestones and quiet moments. Reflecting today on ${raw} and how far we've come. ❤️\n\nHope everyone is having a wonderful week! Tell me what made you smile today? 😊 #Gratitude #LifeLessons`,
        `Sometimes all you need is a fresh perspective and a focus on ${raw}. Cheers to new beginnings! ✨`
      ]
    };

    return database[category] || database['Business'];
  };

  const captions = generateFbCaptions();

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    onShowToast('Facebook caption copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Facebook Caption Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate engaging, story-driven Facebook post captions with formatting, emojis, and discussion call-to-actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Post Subject / Event Name</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Annual Community Workshop, New Coffee Shop"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FbCategory)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {FB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FB_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === cat
                ? 'bg-blue-600 text-white shadow-md'
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
          Generated Facebook Post Captions ({category})
        </h3>

        <div className="space-y-4">
          {captions.map((captionText, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
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
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied Facebook Caption!' : 'Copy Facebook Caption'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
