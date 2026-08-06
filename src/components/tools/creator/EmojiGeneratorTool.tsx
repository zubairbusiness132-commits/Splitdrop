import React, { useState } from 'react';
import { Copy, Check, Smile, Search, Star, Clock, Sparkles, Flame } from 'lucide-react';

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys & Emotion',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓']
  },
  {
    name: 'Hands & People',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🧠', '🫀', '🫁', '👀', '👁️', '👅', '👄']
  },
  {
    name: 'Creator & Hype',
    emojis: ['🔥', '🚀', '⚡', '💡', '✨', '💎', '🎯', '👑', '💯', '📌', '📢', '🎬', '📸', '🎥', '📹', '🎨', '🎙️', '🎚️', '📻', '📺', '🔔', '📣', '🎉', '🎊', '🏆', '🥇', '💰', '💵', '📈', '📊', '🌐', '🔗', '⏳', '⏰', '⌛', '🧠', '🤖', '💻', '📱', '🕹️', '🎮', '🔴', '🟩', '⭐', '🌟', '💥', '💣']
  },
  {
    name: 'Objects & Symbols',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '🔄', '⚡', '❌', '✅', '⚠️', '🚨', '🛑', '⛔', '➕', '➖', '❓', '❗', '💬', '💭', '🗯️', '🔒', '🔓', '🔑']
  }
];

const EMOJI_COMBOS = [
  { label: 'Viral & Fire', combo: '🔥🚀' },
  { label: 'Sparkle & Crown', combo: '✨👑' },
  { label: 'Lightning & Analytics', combo: '⚡📊' },
  { label: 'Bullseye & Idea', combo: '🎯💡' },
  { label: 'Subscribe & Bell', combo: '🔔🔴' },
  { label: 'Diamond & Money', combo: '💎💰' },
  { label: 'Trophy & Winner', combo: '🏆🥇' },
  { label: 'Warning & Important', combo: '⚠️📌' },
  { label: 'AI & Robot Tech', combo: '🤖💻' },
  { label: 'Camera & Action', combo: '🎬🎥' }
];

export const EmojiGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [search, setSearch] = useState('');
  const [recents, setRecents] = useState<string[]>(['🔥', '🚀', '⚡', '✨']);
  const [favorites, setFavorites] = useState<string[]>(['👑', '🎯', '💎']);
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const handleCopyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopiedEmoji(emoji);
    onShowToast(`Copied ${emoji} to clipboard!`);

    // Add to recents
    setRecents(prev => [emoji, ...prev.filter(e => e !== emoji)].slice(0, 15));

    setTimeout(() => setCopiedEmoji(null), 2000);
  };

  const toggleFavorite = (emoji: string) => {
    if (favorites.includes(emoji)) {
      setFavorites(favorites.filter(e => e !== emoji));
      onShowToast(`Removed ${emoji} from favorites`);
    } else {
      setFavorites([...favorites, emoji]);
      onShowToast(`Added ${emoji} to favorites!`);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Smile className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Emoji Generator & Creator Picker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and copy single emojis or viral creator combinations with one-click clipboard action.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter emojis..."
          className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Combo Presets Bar */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" /> Creator Social Combos
        </h3>
        <div className="flex flex-wrap gap-2">
          {EMOJI_COMBOS.map((comboItem) => (
            <button
              key={comboItem.label}
              onClick={() => handleCopyEmoji(comboItem.combo)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-500 text-xs font-bold text-slate-900 dark:text-white transition-all cursor-pointer shadow-2xs"
            >
              <span className="text-base">{comboItem.combo}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{comboItem.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recents & Favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recents.length > 0 && (
          <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase">
              <Clock className="w-3.5 h-3.5" /> Recent Emojis
            </h4>
            <div className="flex flex-wrap gap-2">
              {recents.map((e) => (
                <button
                  key={e}
                  onClick={() => handleCopyEmoji(e)}
                  className="w-9 h-9 text-lg rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1 uppercase">
              <Star className="w-3.5 h-3.5 fill-current" /> Favorites
            </h4>
            <div className="flex flex-wrap gap-2">
              {favorites.map((e) => (
                <button
                  key={e}
                  onClick={() => handleCopyEmoji(e)}
                  className="w-9 h-9 text-lg rounded-xl bg-white dark:bg-slate-800 border border-amber-500/30 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emoji Categories Grid */}
      <div className="space-y-6">
        {EMOJI_CATEGORIES.map((cat) => {
          const filtered = search
            ? cat.emojis.filter(() => cat.name.toLowerCase().includes(search.toLowerCase()))
            : cat.emojis;

          if (filtered.length === 0) return null;

          return (
            <div key={cat.name} className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {cat.name} ({filtered.length})
              </h3>

              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2 p-4 rounded-2xl glass-card border border-slate-200/70 dark:border-slate-800">
                {filtered.map((emoji, idx) => {
                  const isFav = favorites.includes(emoji);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCopyEmoji(emoji)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggleFavorite(emoji);
                      }}
                      className={`relative w-10 h-10 text-xl rounded-xl transition-all flex items-center justify-center cursor-pointer group ${
                        copiedEmoji === emoji
                          ? 'bg-emerald-500 text-white scale-110 shadow-md'
                          : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 hover:scale-110 hover:border-indigo-500'
                      }`}
                      title="Left-click to copy, Right-click to favorite"
                    >
                      <span>{emoji}</span>
                      {isFav && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white dark:border-slate-900" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
