import React, { useState } from 'react';
import { Copy, Check, Instagram, Facebook, Linkedin, Twitter, Layout, Sparkles } from 'lucide-react';

const FORMAT_PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'Threads'] as const;
type FormatPlatform = typeof FORMAT_PLATFORMS[number];

export const SocialMediaPostFormatterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [platform, setPlatform] = useState<FormatPlatform>('Instagram');
  const [rawText, setRawText] = useState(
    `Welcome to our channel!\n\nHere is what we are building today:\n1. Clean UI layouts\n2. High-speed browser tools\n3. Responsive designs\n\nLet us know your thoughts in the comments below!\n\n#SplitDrop #SocialMedia #CreatorTools`
  );
  const [copied, setCopied] = useState(false);

  // Formatter converts double newlines to invisible separator characters (U+2800) for IG/FB
  const formatPostText = (text: string, plat: FormatPlatform): string => {
    if (!text.trim()) return '';

    if (plat === 'Instagram' || plat === 'Facebook') {
      // Replace empty lines with braille whitespace or clean bullet padding
      return text.replace(/\n\n/g, '\n⠀\n');
    }

    if (plat === 'LinkedIn') {
      // Add clean bullet markers and uppercase headings
      return text.replace(/^([A-Z\s]{4,}:)/gm, '📌 $1');
    }

    if (plat === 'Twitter' || plat === 'Threads') {
      // Trim extra spaces
      return text.trim();
    }

    return text;
  };

  const formattedText = formatPostText(rawText, platform);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    onShowToast(`Copied formatted post for ${platform}!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Social Media Post Formatter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Format posts preserving paragraph breaks, line spacing, and bullet points without awkward collapsing on social apps.
          </p>
        </div>
      </div>

      {/* Platform Select */}
      <div className="flex flex-wrap gap-2">
        {FORMAT_PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              platform === p
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {p === 'Instagram' && <Instagram className="w-3.5 h-3.5" />}
            {p === 'Facebook' && <Facebook className="w-3.5 h-3.5" />}
            {p === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5" />}
            {p === 'Twitter' && <Twitter className="w-3.5 h-3.5" />}
            <span>{p} Format</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Text Input */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Raw Unformatted Text
          </label>
          <textarea
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Type or paste your post content here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Formatted Mockup Preview */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Formatted Preview ({platform})
              </label>
              <span className="text-[10px] font-bold text-slate-400">{formattedText.length} Chars</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 min-h-[260px] shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Preview Profile</h4>
                  <p className="text-[10px] text-slate-400">Formatted for {platform}</p>
                </div>
              </div>

              <p className="text-xs font-sans text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                {formattedText}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Formatted Post!' : `Copy Formatted ${platform} Post`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
