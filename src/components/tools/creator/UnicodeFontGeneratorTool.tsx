import React, { useState } from 'react';
import { Copy, Check, Star, Sparkles, RefreshCw, Type } from 'lucide-react';

const UNICODE_FONTS = [
  { name: 'Bold Sans', convert: (s: string) => s.replace(/[a-zA-Z0-9]/g, c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5A0 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5BA + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
    return c;
  })},
  { name: 'Italic Serif', convert: (s: string) => s.replace(/[a-zA-Z]/g, c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + (code - 97));
    return c;
  })},
  { name: 'Fraktur / Gothic', convert: (s: string) => s.replace(/[a-zA-Z]/g, c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D504 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D51E + (code - 97));
    return c;
  })},
  { name: 'Cursive / Script', convert: (s: string) => s.replace(/[a-zA-Z]/g, c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + (code - 97));
    return c;
  })},
  { name: 'Double Struck', convert: (s: string) => s.replace(/[a-zA-Z0-9]/g, c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7D8 + (code - 48));
    return c;
  })},
  { name: 'Fullwidth', convert: (s: string) => s.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
    if (code === 32) return '  ';
    return c;
  }).join('')},
  { name: 'Small Caps', convert: (s: string) => {
    const map: Record<string, string> = {
      a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
      n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
    };
    return s.toLowerCase().split('').map(c => map[c] || c).join('');
  }},
  { name: 'Inverted / Upside Down', convert: (s: string) => {
    const map: Record<string, string> = {
      a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ı', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
      n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
      'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ',
      'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '┴',
      'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '1': '⇂', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
      '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0', '.': '˙', ',': '\'', '\'': ',', '"': ',,',
      '!': '¡', '?': '¿', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '_': '‾'
    };
    return s.split('').map(c => map[c] || c).reverse().join('');
  }}
];

export const UnicodeFontGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState('Creator Social Suite');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const toggleFav = (fontName: string) => {
    if (favorites.includes(fontName)) {
      setFavorites(favorites.filter((f) => f !== fontName));
      onShowToast(`Removed ${fontName} from favorites`);
    } else {
      setFavorites([...favorites, fontName]);
      onShowToast(`Added ${fontName} to favorites!`);
    }
  };

  const handleCopy = (converted: string, name: string) => {
    navigator.clipboard.writeText(converted);
    setCopiedIdx(name);
    onShowToast(`Copied ${name} font!`);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Unicode Font Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate multiple Unicode text font styles with live input preview, favorites collection, and one-click copy.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Input Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Subscribe to my channel!"
          className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid of Unicode Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNICODE_FONTS.map((font) => {
          const converted = font.convert(text || 'Preview Text');
          const isFav = favorites.includes(font.name);

          return (
            <div
              key={font.name}
              className={`glass-card p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                isFav ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {font.name}
                  </span>
                  <button
                    onClick={() => toggleFav(font.name)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white break-words p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  {converted}
                </p>
              </div>

              <button
                onClick={() => handleCopy(converted, font.name)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {copiedIdx === font.name ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === font.name ? 'Copied Font!' : 'Copy Unicode Font'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
