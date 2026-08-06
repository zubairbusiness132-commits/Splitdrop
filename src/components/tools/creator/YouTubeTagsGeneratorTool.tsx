import React, { useState } from 'react';
import { Copy, Check, Tag, Filter, RefreshCw, Layers } from 'lucide-react';

export const YouTubeTagsGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('React JS Tutorial');
  const [selectedTagTypes, setSelectedTagTypes] = useState<string[]>(['Short', 'Long-tail', 'SEO', 'Related']);
  const [copied, setCopied] = useState(false);

  const generateTagDatabase = () => {
    const raw = topic.trim() || 'video';
    const lower = raw.toLowerCase();

    const shortTags = [
      raw,
      `${raw} 2026`,
      `${raw} guide`,
      `${raw} tips`,
      `${raw} course`,
      `${raw} basic`,
      `${raw} pro`,
      `${raw} code`
    ];

    const longTailTags = [
      `how to learn ${lower} step by step`,
      `best ${lower} tutorial for beginners`,
      `${lower} complete breakdown and setup`,
      `mastering ${lower} in 2026`,
      `top secrets of ${lower} explained`,
      `${lower} common mistakes to avoid`
    ];

    const seoTags = [
      `${lower} studio`,
      `${lower} high ranking keywords`,
      `${lower} crash course`,
      `learn ${lower} fast`,
      `${lower} examples and projects`,
      `why use ${lower}`
    ];

    const relatedTags = [
      `web development`,
      `software engineering`,
      `tech tutorial`,
      `coding for beginners`,
      `programming guide`,
      `computer science`
    ];

    const list: { name: string; category: string }[] = [];

    if (selectedTagTypes.includes('Short')) {
      shortTags.forEach(t => list.push({ name: t, category: 'Short Tag' }));
    }
    if (selectedTagTypes.includes('Long-tail')) {
      longTailTags.forEach(t => list.push({ name: t, category: 'Long-tail' }));
    }
    if (selectedTagTypes.includes('SEO')) {
      seoTags.forEach(t => list.push({ name: t, category: 'SEO Keyword' }));
    }
    if (selectedTagTypes.includes('Related')) {
      relatedTags.forEach(t => list.push({ name: t, category: 'Related' }));
    }

    return list;
  };

  const tagsList = generateTagDatabase();
  const commaSeparated = tagsList.map(t => t.name).join(', ');
  const totalChars = commaSeparated.length;

  const toggleType = (type: string) => {
    if (selectedTagTypes.includes(type)) {
      if (selectedTagTypes.length === 1) return; // Keep at least one
      setSelectedTagTypes(selectedTagTypes.filter(t => t !== type));
    } else {
      setSelectedTagTypes([...selectedTagTypes, type]);
    }
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(commaSeparated);
    setCopied(true);
    onShowToast('Tags copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Tags Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate Short, Long-tail, SEO, and Related tags for YouTube Studio tag field (500 limit).
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Video Topic / Focus Keyword
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photoshop Tutorial, Fitness Workout, Crypto News"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tag Categories</label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Short', 'Long-tail', 'SEO', 'Related'].map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedTagTypes.includes(t)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 gap-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Tags</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">{tagsList.length}</p>
          </div>
          <div className="h-8 w-px bg-slate-300/40 dark:bg-slate-700/50" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">YouTube Limit</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              <span className={totalChars > 500 ? 'text-red-500' : 'text-emerald-500'}>{totalChars}</span>
              <span className="text-xs font-semibold text-slate-400"> / 500 chars</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" /> Copied Comma-Separated!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy All Tags (Comma Separated)
            </>
          )}
        </button>
      </div>

      {/* Individual Tags Display */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Generated Tag Chips
        </h3>
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl glass-card border border-slate-200/70 dark:border-slate-800 min-h-[140px]">
          {tagsList.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-indigo-500/50 transition-all shadow-2xs"
            >
              <span>{tag.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                {tag.category}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
