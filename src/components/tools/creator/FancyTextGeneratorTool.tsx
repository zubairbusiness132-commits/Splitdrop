import React, { useState } from 'react';
import { Copy, Check, Type, Sparkles } from 'lucide-react';

const FANCY_STYLES: Array<{ name: string; mapText: (text: string) => string }> = [
  {
    name: 'Mathematical Bold',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + (code - 48));
        return c;
      }).join('');
    }
  },
  {
    name: 'Mathematical Italic',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + (code - 97));
        return c;
      }).join('');
    }
  },
  {
    name: 'Mathematical Script / Cursive',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + (code - 97));
        return c;
      }).join('');
    }
  },
  {
    name: 'Circled / Bubble',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + (code - 97));
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
        if (code === 48) return '⓪';
        return c;
      }).join('');
    }
  },
  {
    name: 'Double-Struck / Outline',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7D8 + (code - 48));
        return c;
      }).join('');
    }
  },
  {
    name: 'Monospace',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + (code - 48));
        return c;
      }).join('');
    }
  },
  {
    name: 'Small Caps',
    mapText: (str) => {
      const map: Record<string, string> = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
        n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
      };
      return str.toLowerCase().split('').map(c => map[c] || c).join('');
    }
  },
  {
    name: 'Squared Negative',
    mapText: (str) => {
      return str.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F170 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F170 + (code - 97));
        return c;
      }).join('');
    }
  }
];

export const FancyTextGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState('SplitDrop Fancy Text');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleCopy = (convertedText: string, styleName: string) => {
    navigator.clipboard.writeText(convertedText);
    setCopiedName(styleName);
    onShowToast(`Copied ${styleName} text!`);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Fancy Text Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert plain text into stylized Unicode fonts including Bold, Italic, Script, Bubble, Outline, Monospace, and Small Caps.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Type Your Text Here</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. Follow me on Instagram!"
          className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FANCY_STYLES.map((style) => {
          const formatted = style.mapText(inputText || 'Sample Text');

          return (
            <div
              key={style.name}
              className="glass-card p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {style.name}
                </span>

                <p className="text-sm font-medium text-slate-900 dark:text-white break-words p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  {formatted}
                </p>
              </div>

              <button
                onClick={() => handleCopy(formatted, style.name)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {copiedName === style.name ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedName === style.name ? 'Copied!' : 'Copy Styled Text'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
