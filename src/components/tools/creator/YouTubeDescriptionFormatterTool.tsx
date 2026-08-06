import React, { useState } from 'react';
import { Copy, Check, Wand2, RefreshCw, LayoutList, AlignLeft } from 'lucide-react';

export const YouTubeDescriptionFormatterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [rawText, setRawText] = useState(`In this video I am going to show you python programming tutorial.
Here are the links:
website: www.example.com
github: github.com/username
socials: twitter.com/username

topics covered in video
intro
installation
writing first script
summary

subscribe to channel and like the video! #python #coding`);

  const [bulletStyle, setBulletStyle] = useState('•');
  const [sectionDivider, setSectionDivider] = useState('📌');
  const [copied, setCopied] = useState(false);

  const formatDescription = () => {
    if (!rawText.trim()) return '';

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const formattedLines: string[] = [];

    lines.forEach((line) => {
      // Check if line looks like a header or section title
      const isHeaderCandidate = line.length < 35 && !line.includes(':') && !line.includes('http') && !line.startsWith('#');
      
      if (isHeaderCandidate && line === line.toLowerCase() && line.length > 3) {
        // Capitalize header
        formattedLines.push(`\n${sectionDivider} ${line.toUpperCase()}:`);
      } else if (line.startsWith('www.') || line.includes('.com') || line.includes('http')) {
        // Sanitize link
        const cleanUrl = line.startsWith('http') ? line : `https://${line.replace(/^(website:|github:|socials:)/i, '').trim()}`;
        formattedLines.push(`🔗 ${cleanUrl}`);
      } else if (line.startsWith('#')) {
        formattedLines.push(`\n${line}`);
      } else {
        formattedLines.push(`${bulletStyle} ${line}`);
      }
    });

    return formattedLines.join('\n');
  };

  const formattedOutput = formatDescription();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    onShowToast('Formatted description copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Video Description Formatter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Clean up messy description text with auto-capitalized headers, sanitized links, and bullet icons.
          </p>
        </div>
      </div>

      {/* Formatting Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bullet Symbol Style</label>
          <div className="flex gap-2">
            {['•', '⚡', '▶', '👉', '📌'].map((sym) => (
              <button
                key={sym}
                onClick={() => setBulletStyle(sym)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bulletStyle === sym
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {sym} Bullet
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Header Section Icon</label>
          <div className="flex gap-2">
            {['📌', '🔥', '🚀', '⚡', '📂'].map((ic) => (
              <button
                key={ic}
                onClick={() => setSectionDivider(ic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sectionDivider === ic
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {ic} Icon
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste Messy Raw Text</label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={14}
            className="w-full p-4 font-mono text-xs leading-relaxed bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Cleaned Output</label>
              <span className="text-[10px] font-bold text-slate-400">{formattedOutput.length} Chars</span>
            </div>
            <textarea
              readOnly
              value={formattedOutput}
              rows={14}
              className="w-full p-4 font-mono text-xs leading-relaxed bg-slate-950 text-indigo-400 rounded-2xl border border-slate-800 focus:outline-none shadow-inner resize-none"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer mt-3"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" /> Copied Formatted Output!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Formatted Description
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
