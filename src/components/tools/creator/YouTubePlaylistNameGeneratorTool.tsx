import React, { useState } from 'react';
import { Copy, Check, Download, Music, Layers, ListFilter } from 'lucide-react';

export const YouTubePlaylistNameGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('React & Web Development');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePlaylists = () => {
    const raw = topic.trim() || 'Tutorials';
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1);

    return [
      { style: 'Mastery & Course Style', names: [`The Complete ${cap} Masterclass (2026)`, `${cap} Zero to Hero Full Course`, `Mastering ${cap}: The Ultimate Series`, `${cap} Step-by-Step Practical Blueprint`] },
      { style: 'Binge-Worthy & Modern', names: [`${cap} Deep Dives & Case Studies`, `Everything You Need for ${cap}`, `${cap} Project Building Marathons`, `The Best ${cap} Videos Collection`] },
      { style: 'Minimalist & Pro', names: [`${cap} 101`, `${cap} Essentials`, `${cap} Toolkit`, `${cap} Lab Series`] },
      { style: 'Challenge & Quick Hits', names: [`${cap} 30-Day Transformation`, `${cap} Quick Tips & Hacks`, `10-Minute ${cap} Lessons`, `${cap} Daily Workouts`] }
    ];
  };

  const playlistGroups = generatePlaylists();
  const allNames = playlistGroups.flatMap(g => g.names);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    onShowToast('Playlist name copied!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = allNames.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playlist-names-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    onShowToast('Downloaded playlist names as TXT!');
  };

  const handleDownloadJson = () => {
    const data = JSON.stringify(playlistGroups, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playlist-names-${topic.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    onShowToast('Downloaded playlist names as JSON!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Playlist Name Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate searchable, organized, high-retention playlist titles with copy & download exports.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Playlist Subject / Niche</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Python Projects, Quran Recitation, Workout Routines"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadTxt}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4" /> TXT
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4" /> JSON
          </button>
        </div>
      </div>

      {/* Playlist name categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlistGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <ListFilter className="w-4 h-4" /> {group.style}
            </h3>

            <div className="space-y-2">
              {group.names.map((name, itemIdx) => {
                const uniqueIdx = groupIdx * 10 + itemIdx;
                return (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <span>{name}</span>
                    <button
                      onClick={() => handleCopy(name, uniqueIdx)}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all shrink-0 ml-2"
                    >
                      {copiedIndex === uniqueIdx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
