import React, { useState } from 'react';
import { Copy, Check, Star, AtSign, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  'Tech', 'Gaming', 'Lifestyle', 'Education', 'Finance', 
  'Vlog', 'Entertainment', 'Cooking', 'Fitness', 'Beauty', 'AI'
] as const;

export const YouTubeChannelNameGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [keyword, setKeyword] = useState('Pixel');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Tech');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [checkHandle, setCheckHandle] = useState('@pixel_tech_hub');

  const generateNames = () => {
    const raw = keyword.trim() || 'Creator';
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1);

    const templates: Record<string, string[]> = {
      Tech: [`${cap} Tech Lab`, `The ${cap} Byte`, `Code with ${cap}`, `${cap} Digital`, `Next ${cap} Tech`, `Future ${cap}`],
      Gaming: [`${cap} Gaming Hub`, `${cap} Plays`, `The ${cap} Arcade`, `${cap} Unlocked`, `Extreme ${cap}`, `${cap} Guild`],
      Lifestyle: [`${cap} Living`, `${cap} Mindset`, `The ${cap} Life`, `Simply ${cap}`, `Daily ${cap}`, `${cap} Vibe`],
      Education: [`${cap} Academy`, `Learn ${cap}`, `${cap} Masterclass`, `${cap} Explained`, `The ${cap} Scholar`, `Study ${cap}`],
      Finance: [`${cap} Wealth`, `${cap} Capital`, `${cap} Money Mindset`, `The ${cap} Investor`, `${cap} Finance Hub`, `Smart ${cap}`],
      Vlog: [`Life of ${cap}`, `${cap} Unfiltered`, `${cap}'s World`, `The ${cap} Journey`, `${cap} Daily`, `Meet ${cap}`],
      Entertainment: [`${cap} Show`, `${cap} Reacts`, `${cap} Unlimited`, `The ${cap} Lounge`, `Pure ${cap}`, `${cap} Fever`],
      Cooking: [`${cap} Kitchen`, `Cook With ${cap}`, `${cap} Bites`, `The ${cap} Chef`, `${cap} Flavor Lab`, `Tasty ${cap}`],
      Fitness: [`${cap} Fitness`, `Train With ${cap}`, `${cap} Gym Lab`, `${cap} Iron`, `Stronger ${cap}`, `${cap} Pulse`],
      Beauty: [`${cap} Glow`, `${cap} Beauty Studio`, `Chic ${cap}`, `${cap} Vanity`, `${cap} Style`, `Elegance ${cap}`],
      AI: [`${cap} AI Hub`, `${cap} Neural`, `AI with ${cap}`, `${cap} Intelligence`, `${cap} Bot Lab`, `Automated ${cap}`]
    };

    return templates[category] || templates['Tech'];
  };

  const nameList = generateNames();

  const toggleFavorite = (name: string) => {
    if (favorites.includes(name)) {
      setFavorites(favorites.filter(f => f !== name));
      onShowToast('Removed from favorites');
    } else {
      setFavorites([...favorites, name]);
      onShowToast('Saved to favorites!');
    }
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    onShowToast('Channel name copied!');
    setTimeout(() => setCopiedName(null), 2000);
  };

  // Handle format validation
  const validateHandle = (handleStr: string) => {
    const clean = handleStr.startsWith('@') ? handleStr.slice(1) : handleStr;
    const errors: string[] = [];

    if (clean.length < 3 || clean.length > 30) {
      errors.push('Length must be between 3 and 30 characters');
    }
    if (/\s/.test(clean)) {
      errors.push('No spaces allowed in YouTube handle');
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(clean)) {
      errors.push('Only letters, numbers, underscores (_), and dots (.) are allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      formatted: `@${clean.toLowerCase().replace(/\s+/g, '_')}`
    };
  };

  const handleCheckResult = validateHandle(checkHandle);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Channel Name Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate creative channel names, save favorites, and validate YouTube handle formats.
          </p>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Keyword / Seed Word
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Pixel, Apex, Code, Zen, Nova"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Niche Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
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

      {/* Name Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Generated Channel Name Concepts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {nameList.map((name) => {
            const handle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
            const isFav = favorites.includes(name);

            return (
              <div
                key={name}
                className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{name}</h4>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-medium truncate">{handle}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFavorite(name)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isFav ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => handleCopy(name)}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors"
                  >
                    {copiedName === name ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Handle Checker Section */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <AtSign className="w-4 h-4" /> YouTube Handle Format Validation Checker
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={checkHandle}
            onChange={(e) => setCheckHandle(e.target.value)}
            placeholder="@yourhandle"
            className="w-full px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            {handleCheckResult.isValid ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Valid YouTube Handle Format
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                <AlertCircle className="w-4 h-4" /> Invalid Handle Format
              </span>
            )}
          </div>

          {!handleCheckResult.isValid && (
            <ul className="text-xs text-rose-500/90 space-y-1 list-disc list-inside">
              {handleCheckResult.errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}

          {handleCheckResult.isValid && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Suggested Clean Format: <code className="font-mono text-indigo-600 dark:text-indigo-400">{handleCheckResult.formatted}</code>
            </p>
          )}
        </div>
      </div>

      {/* Saved Favorites */}
      {favorites.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" /> Saved Favorite Names ({favorites.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => (
              <span
                key={fav}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2"
              >
                {fav}
                <button onClick={() => toggleFavorite(fav)} className="text-slate-400 hover:text-rose-500 text-xs">×</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
