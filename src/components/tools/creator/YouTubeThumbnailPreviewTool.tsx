import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Monitor, Smartphone, Search, ListVideo, Sun, Moon, Check } from 'lucide-react';

export const YouTubeThumbnailPreviewTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [videoTitle, setVideoTitle] = useState('Build a Fullstack AI App in 30 Minutes! (Complete Tutorial)');
  const [channelName, setChannelName] = useState('Tech Masterclass');
  const [views, setViews] = useState('142K views');
  const [timeAgo, setTimeAgo] = useState('2 days ago');
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile' | 'search' | 'suggested'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      onShowToast('Thumbnail uploaded successfully!');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Thumbnail Preview Tool
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test how your video thumbnail looks on Desktop, Mobile, Search Results, and Suggested Sidebar feeds.
          </p>
        </div>
      </div>

      {/* Control panel & upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Thumbnail Metadata
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Thumbnail</label>
            <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white/50 dark:bg-slate-900/50 cursor-pointer transition-all">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Choose Image File</span>
              <span className="text-[10px] text-slate-400">16:9 Aspect Ratio Recommended</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Title</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Channel Name</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Views</label>
              <input
                type="text"
                value={views}
                onChange={(e) => setViews(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Ago</label>
              <input
                type="text"
                value={timeAgo}
                onChange={(e) => setTimeAgo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mockup mode bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop Feed
              </button>
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile Feed
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'search'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Search className="w-3.5 h-3.5" /> Search Result
              </button>
              <button
                onClick={() => setActiveTab('suggested')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'suggested'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ListVideo className="w-3.5 h-3.5" /> Sidebar Suggested
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-xl">
              <button
                onClick={() => setPreviewTheme('dark')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  previewTheme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Dark YouTube Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewTheme('light')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  previewTheme === 'light' ? 'bg-amber-500 text-white' : 'text-slate-400'
                }`}
                title="Light YouTube Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Realistic YouTube UI Display Canvas */}
          <div
            className={`p-6 rounded-3xl transition-all shadow-xl min-h-[360px] flex items-center justify-center border ${
              previewTheme === 'dark'
                ? 'bg-[#0f0f0f] text-white border-slate-800'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* Desktop Mockup */}
            {activeTab === 'desktop' && (
              <div className="w-full max-w-sm space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 group shadow-lg">
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold font-mono">
                    12:45
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                    {channelName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold leading-tight line-clamp-2">{videoTitle}</h4>
                    <p className="text-xs text-slate-400">{channelName}</p>
                    <p className="text-[11px] text-slate-400">{views} • {timeAgo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Mockup */}
            {activeTab === 'mobile' && (
              <div className="w-[300px] border-4 border-slate-700 rounded-3xl p-3 bg-black space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                  <img src={thumbnailUrl} alt="Mobile thumbnail preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                    12:45
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {channelName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight line-clamp-2 text-white">{videoTitle}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{channelName} • {views}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Result Mockup */}
            {activeTab === 'search' && (
              <div className="w-full flex flex-col sm:flex-row gap-4 max-w-xl items-start">
                <div className="relative aspect-video w-full sm:w-60 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img src={thumbnailUrl} alt="Search thumbnail preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                    12:45
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold line-clamp-2">{videoTitle}</h4>
                  <p className="text-xs text-slate-400">{views} • {timeAgo}</p>
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-[9px] text-white font-bold flex items-center justify-center">
                      {channelName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-slate-400">{channelName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    In this video tutorial, learn how to build modern software projects with high performance...
                  </p>
                </div>
              </div>
            )}

            {/* Suggested Sidebar Mockup */}
            {activeTab === 'suggested' && (
              <div className="w-full max-w-sm flex gap-3">
                <div className="relative aspect-video w-40 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <img src={thumbnailUrl} alt="Suggested thumbnail preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                    12:45
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold line-clamp-2">{videoTitle}</h4>
                  <p className="text-[11px] text-slate-400">{channelName}</p>
                  <p className="text-[10px] text-slate-400">{views} • {timeAgo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
