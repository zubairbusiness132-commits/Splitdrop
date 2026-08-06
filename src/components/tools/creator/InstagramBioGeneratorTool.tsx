import React, { useState } from 'react';
import { Copy, Check, Instagram, Sparkles, User, ShieldCheck } from 'lucide-react';

const BIO_CATEGORIES = [
  'Business', 'Creator', 'Freelancer', 'Student', 'Influencer', 
  'Islamic', 'Tech', 'Gamer', 'Fitness', 'Photographer'
] as const;

type BioCategory = typeof BIO_CATEGORIES[number];

export const InstagramBioGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [name, setName] = useState('Alex Morgan');
  const [keyword, setKeyword] = useState('Web Developer');
  const [category, setCategory] = useState<BioCategory>('Tech');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateBios = (): string[] => {
    const user = name.trim() || 'Your Name';
    const key = keyword.trim() || 'Creator';

    const database: Record<BioCategory, string[]> = {
      Business: [
        `💼 ${user} | ${key}\n🚀 Helping brands scale 10x faster\n📈 100+ Happy Clients Served\n👇 Download Free Growth Checklist\n🔗 linkin.bio/alex`,
        `🏢 Official ${key} Studio\n✨ High-Quality Solutions & Consulting\n📍 Global Services | 🚀 Fast Turnaround\n📩 DM for Business Inquiries\n👇 Tap link below!`
      ],
      Creator: [
        `✨ ${user} • ${key}\n🎥 Content Creator & Visual Storyteller\n💡 Turning ideas into viral realities\n💌 Collabs: alex@example.com\n👇 Watch my latest video!`,
        `🎨 ${key} Enthusiast | ${user}\n🌟 Daily Inspo & Creative Projects\n👇 Grab my free creative presets below!`
      ],
      Freelancer: [
        `💻 ${user} | Freelance ${key}\n⚡ Available for Remote Projects\n⭐ 5-Star Rated | High-Quality Delivery\n👇 Check my Portfolio & Work`,
        `🛠️ Fullstack ${key} Specialist\n🎨 UI/UX & Clean Modern Code\n📩 DM "PROJECT" to work together!\n👇 My Portfolio:`
      ],
      Student: [
        `🎓 ${user} | ${key} Student\n📚 Learning, building & sharing everyday\n✨ Journey to 2026 Grad\n👇 Read my blog articles below!`,
        `🧠 CS & ${key} Enthusiast\n🚀 Building side projects in public\n🌱 Always learning | Stay curious`
      ],
      Influencer: [
        `✨ ${user} | ${key} Ambassador\n🌟 Inspiring daily lifestyle & fashion\n📍 Based in LA / NYC\n📩 Partnerships: press@domain.com\n👇 Shop my favorite gear!`,
        `💫 ${key} Creator\n💖 Spread Positivity & Good Energy\n👇 Discount codes & links below!`
      ],
      Islamic: [
        `🤲 ${user} | Al-Hamdulillah\n📖 Daily Islamic Reminders & ${key}\n✨ "Indeed, with hardship comes ease." (94:6)\n📍 Seeking Knowledge & Good Deeds`,
        `🌙 ${user} • Believer & ${key}\n🕋 Striving for Jannah step by step\n✨ Spread Kindness & Peace`
      ],
      Tech: [
        `👨‍💻 ${user} | Senior ${key}\n🚀 Building the future with React & AI\n☕ Powered by Coffee & Clean Code\n👇 Check out my GitHub repos!`,
        `⚡ ${key} Engineer\n🤖 AI Enthusiast & Tech Blogger\n👇 My Latest Tech Guide:`
      ],
      Gamer: [
        `🎮 ${user} | Streamer & ${key}\n🏆 Top 1% Competitive Player\n🔴 Live Streams Mon-Fri 8 PM\n👇 Join my Discord Community!`,
        `🕹️ Pro ${key} Gamer\n💥 High Plays & Setup Reviews\n👇 Twitch Channel Link:`
      ],
      Fitness: [
        `🏋️‍♂️ ${user} | Certified ${key} Coach\n🔥 Helping you transform body & mind\n💪 1-on-1 Online Coaching Open\n👇 Claim your Free Meal Plan!`,
        `🏃‍♀️ ${key} & Fitness Journey\n🥗 Healthy Eating & Daily Workouts\n👇 Join my 30-Day Challenge!`
      ],
      Photographer: [
        `📸 ${user} | Professional ${key}\n🎞️ Capturing raw emotion & golden hours\n📍 Available for Worldwide Bookings\n👇 View Portfolio Gallery:`,
        `📷 Visual Artist & ${key}\n✨ Lightroom Presets & Prints\n📩 Bookings via DM`
      ]
    };

    return database[category] || database['Tech'];
  };

  const bios = generateBios();

  const handleCopy = (bioText: string, idx: number) => {
    navigator.clipboard.writeText(bioText);
    setCopiedIdx(idx);
    onShowToast('Instagram bio copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Instagram Bio Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate aesthetic, professional Instagram bios tailored for 10 profile categories with character limit validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name / Handle</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche / Role</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Graphic Designer, UI/UX"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BioCategory)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {BIO_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {BIO_CATEGORIES.map((cat) => (
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

      {/* Generated Bios */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Generated Instagram Bios ({category})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bios.map((bioText, idx) => {
            const charLen = bioText.length;
            const isOver = charLen > 150;

            return (
              <div
                key={idx}
                className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-pink-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400">
                      Preset #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {charLen} / 150 Chars {isOver ? '(Over Limit)' : '✓ Valid'}
                    </span>
                  </div>

                  <p className="text-xs font-mono whitespace-pre-line text-slate-900 dark:text-white leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    {bioText}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(bioText, idx)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied Bio!' : 'Copy Instagram Bio'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
