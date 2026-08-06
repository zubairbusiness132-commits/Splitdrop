import React, { useState } from 'react';
import { Copy, Check, Smile, Sparkles, Trash2, Plus, Star } from 'lucide-react';

const EMOJI_PALETTE = [
  '🔥', '✨', '🚀', '❤️', '💡', '💯', '📸', '⚡', '🎉', '🌟', 
  '💎', '🎯', '👑', '🥳', '👇', '📌', '🏆', '👀', '🤐', '☕',
  '🌊', '🍃', '🧠', '💻', '🎨', '🍕', '🌈', '🕊️', '🌸', '💬'
];

const PRESET_COMBOS = [
  { name: 'Fire & Sparkles', string: '🔥✨🚀' },
  { name: 'Celebration', string: '🎉🥳👑' },
  { name: 'Important Note', string: '📌💡👇' },
  { name: 'Creative Vibe', string: '🎨✨📸' },
  { name: 'Tech & Code', string: '💻⚡🧠' },
  { name: 'Nature & Zen', string: '🍃🌸🕊️' }
];

export const EmojiCombinerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [sequence, setSequence] = useState<string>('🔥✨🚀');
  const [recents, setRecents] = useState<string[]>(['🔥✨🚀']);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const addEmoji = (emoji: string) => {
    const nextSeq = sequence + emoji;
    setSequence(nextSeq);
  };

  const handleCopy = (textToCopy: string = sequence) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onShowToast('Copied emoji sequence!');

    if (!recents.includes(textToCopy)) {
      setRecents([textToCopy, ...recents.slice(0, 7)]);
    }

    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = (combo: string) => {
    if (favorites.includes(combo)) {
      setFavorites(favorites.filter(f => f !== combo));
      onShowToast('Removed from favorites');
    } else {
      setFavorites([combo, ...favorites]);
      onShowToast('Saved combo to favorites!');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-500" />
            Emoji Combiner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build, combine, and arrange custom emoji strings with presets, favorites manager, and instant clipboard copy.
          </p>
        </div>
      </div>

      {/* Output Canvas / Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Emoji Combination Canvas
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSequence('')}
              className="px-2.5 py-1 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button
              onClick={() => toggleFavorite(sequence)}
              className="px-2.5 py-1 text-xs font-bold text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Star className={`w-3.5 h-3.5 ${favorites.includes(sequence) ? 'fill-current' : ''}`} /> Favorite
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 min-h-[70px] flex items-center justify-between">
          <span className="text-2xl tracking-widest break-all font-sans select-all">
            {sequence || <span className="text-xs text-slate-400 font-sans tracking-normal">Click emojis below to build combo...</span>}
          </span>

          <button
            onClick={() => handleCopy(sequence)}
            disabled={!sequence}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Combo!' : 'Copy Combo'}</span>
          </button>
        </div>
      </div>

      {/* Preset Combinations */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Preset Popular Combinations
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_COMBOS.map((combo) => (
            <button
              key={combo.name}
              onClick={() => setSequence(combo.string)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span className="text-sm">{combo.string}</span>
              <span className="text-[10px] text-slate-400">({combo.name})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emoji Picker Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Emoji Library Grid (Click to Append)
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
          {EMOJI_PALETTE.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="p-3 text-xl rounded-xl hover:bg-amber-500/10 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
