import React, { useState } from 'react';
import { Copy, Check, Lightbulb, Star, Compass, Tag, Layers } from 'lucide-react';

const CATEGORIES = [
  'Tech', 'Gaming', 'Education', 'Finance', 'Cooking', 
  'Islamic', 'AI', 'Travel', 'Health', 'Lifestyle'
] as const;

type Category = typeof CATEGORIES[number];

export const YouTubeVideoIdeaGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tech');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const getIdeasForCategory = (cat: Category) => {
    const ideasDatabase: Record<Category, { title: string; format: string; audience: string; angle: string }[]> = {
      Tech: [
        { title: 'I Built a Full AI Assistant for $0 (Complete Guide)', format: 'Step-by-step Tutorial', audience: 'Developers & Tech Enthusiasts', angle: 'High utility cost-saving setup' },
        { title: 'Why Everyone Is Selling Their Laptops for THIS Device', format: 'Tech Review / Comparison', audience: 'Gadget Buyers & Techies', angle: 'Bold curiosity statement' },
        { title: '10 Secret Browser Extensions You Never Knew Existed', format: 'Listicle / Product Hunt', audience: 'Students & Professionals', angle: 'Productivity supercharges' }
      ],
      Gaming: [
        { title: 'Can You Beat This Game Without Taking Any Damage?', format: 'Gaming Challenge', audience: 'Gamers & Stream Fans', angle: 'Extreme difficulty restriction' },
        { title: 'The Entire Story of [Game Name] Explained', format: 'Lore Breakdown / Video Essay', audience: 'Story Enthusiasts', angle: 'Deep analytical narrative' },
        { title: '10 Hidden Secrets in [Game] That Everyone Missed', format: 'Top 10 Easter Eggs', audience: 'Casual & Hardcore Players', angle: 'Nostalgia & discovery' }
      ],
      Education: [
        { title: 'How to Learn Any Skill 10x Faster (Science-Backed)', format: 'Educational Essay', audience: 'Students & Lifelong Learners', angle: 'Scientific neuro-hacking tips' },
        { title: 'The History of [Event] That Schools Never Taught You', format: 'Historical Narrative', audience: 'History Buffs', angle: 'Untold true stories' },
        { title: '5 Math Tricks That Make Complex Calculations Instant', format: 'Educational Quick Hacks', audience: 'Students & Exam Takers', angle: 'Instant problem solving' }
      ],
      Finance: [
        { title: 'How I Would Invest $1,000 in 2026 (Step-By-Step)', format: 'Financial Plan', audience: 'Beginner Investors', angle: 'Realistic actionable blueprint' },
        { title: 'The Hidden Traps of Credit Cards (And How to Win)', format: 'Personal Finance Breakdown', audience: 'Young Adults', angle: 'Financial literacy empowerment' },
        { title: '3 Passive Income Streams That Actually Work Today', format: 'Business Case Study', audience: 'Side Hustlers', angle: 'Honest proof-based guide' }
      ],
      Cooking: [
        { title: 'Making 5-Star Gourmet Meals on a $5 Budget', format: 'Budget Cooking Challenge', audience: 'Home Cooks & Students', angle: 'High culinary value for low cost' },
        { title: 'I Tested the Most Viral TikTok Recipes (Pass or Fail?)', format: 'Food Review', audience: 'Foodies & Gen Z', angle: 'Curiosity testing viral trends' },
        { title: 'The Ultimate 15-Minute Meal for Busy Weeknights', format: 'Quick Recipe Guide', audience: 'Busy Professionals', angle: 'Speed and high flavor' }
      ],
      Islamic: [
        { title: '5 Daily Habits of Prophet Muhammad (PBUH) for Peace', format: 'Spiritual Inspiration', audience: 'Muslim Youth & Families', angle: 'Sunnah practices for mental clarity' },
        { title: 'How to Build Consistency in Daily Prayers (Salah Guide)', format: 'Practical Practical Guide', audience: 'Muslims seeking routine', angle: 'Overcoming procrastination in worship' },
        { title: 'The Beautiful Lessons Behind Surah Al-Kahf', format: 'Tafseer & Reflection', audience: 'Quran Learners', angle: 'Deep spiritual insights' }
      ],
      AI: [
        { title: 'How to Automate Your Entire Job Using Free AI Tools', format: 'AI Workflow Showcase', audience: 'Knowledge Workers', angle: 'Productivity 10x multiplier' },
        { title: 'I Asked AI to Build a Business in 24 Hours (Results)', format: 'AI Challenge', audience: 'Entrepreneurs', angle: 'Real-world experiment' },
        { title: '10 Mind-Blowing AI Websites You Should Bookmark', format: 'Top List Showcase', audience: 'General Tech Audience', angle: 'Disruptive web tools' }
      ],
      Travel: [
        { title: 'I Traveled to the Cheapest Country in the World for $100', format: 'Travel Vlog', audience: 'Backpackers & Travelers', angle: 'Budget extreme adventure' },
        { title: '10 Crucial Travel Mistakes You Must Avoid in 2026', format: 'Travel Advice', audience: 'Tourists', angle: 'Safety & money saving hacks' },
        { title: 'The Hidden Paradise No Tourist Knows About', format: 'Hidden Gems Showcase', audience: 'Wanderlust Explorers', angle: 'Exotic secret discovery' }
      ],
      Health: [
        { title: 'What Happens to Your Body When You Walk 10,000 Steps Daily', format: 'Health Experiment', audience: 'Fitness Seekers', angle: 'Physical transformation science' },
        { title: '5 Daily Stretches to Fix Posture and Back Pain', format: 'Physical Therapy Guide', audience: 'Desk Workers', angle: 'Instant relief routines' },
        { title: 'The Truth About Intermittent Fasting (Science Explained)', format: 'Nutrition Deep Dive', audience: 'Weight Loss Audience', angle: 'Myth busting' }
      ],
      Lifestyle: [
        { title: 'I Tried Waking Up at 5 AM for 30 Days (Life Changed)', format: 'Lifestyle Challenge', audience: 'Self-Improvement Buffs', angle: 'Habit transformation' },
        { title: 'How to Organize Your Entire Room in 1 Hour (Minimalist)', format: 'Decluttering Guide', audience: 'Homeowners & Students', angle: 'Aesthetic minimalist living' },
        { title: 'The Art of Being Alone: How to Enjoy Solitude', format: 'Personal Growth Essay', audience: 'Introverts & Thinkers', angle: 'Mental wellness & self love' }
      ]
    };

    return ideasDatabase[cat] || ideasDatabase['Tech'];
  };

  const ideas = getIdeasForCategory(selectedCategory);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    onShowToast('Video concept copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toggleFavorite = (title: string) => {
    if (favorites.includes(title)) {
      setFavorites(favorites.filter(f => f !== title));
      onShowToast('Removed from saved ideas');
    } else {
      setFavorites([...favorites, title]);
      onShowToast('Saved idea to favorites!');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            YouTube Video Idea Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover viral video topics complete with formats, target audience profiles, and strategic angles.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Creator Niche:</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas list */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Viral Concepts for {selectedCategory} ({ideas.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ideas.map((idea, idx) => {
            const isFav = favorites.includes(idea.title);
            return (
              <div
                key={idx}
                className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {idea.format}
                    </span>
                    <button
                      onClick={() => toggleFavorite(idea.title)}
                      className={`p-1 rounded cursor-pointer ${isFav ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {idea.title}
                  </h4>

                  <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                    <p>🎯 <strong className="text-slate-700 dark:text-slate-300">Audience:</strong> {idea.audience}</p>
                    <p>⚡ <strong className="text-slate-700 dark:text-slate-300">Hook Angle:</strong> {idea.angle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(`${idea.title}\nFormat: ${idea.format}\nAudience: ${idea.audience}`, idx)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied Idea!' : 'Copy Concept'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
