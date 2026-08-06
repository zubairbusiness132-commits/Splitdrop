import React, { useState } from 'react';
import { Copy, Check, Download, Sparkles, Youtube, Globe, Hash, FileText } from 'lucide-react';

export const YouTubeDescriptionGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [videoTitle, setVideoTitle] = useState('How to Build Fullstack Apps Fast');
  const [intro, setIntro] = useState('In this video, you will learn the exact step-by-step process to build scalable fullstack web applications without spending months coding.');
  const [mainPoints, setMainPoints] = useState('• Setting up the modern project structure\n• Integrating database & authentication\n• Styling with responsive Tailwind CSS\n• Deploying to production server');
  const [cta, setCta] = useState('If you enjoyed this video, please LIKE and SUBSCRIBE for more weekly tech tutorials!');
  const [channelLink, setChannelLink] = useState('https://youtube.com/@MyAwesomeChannel');
  const [socialLinks, setSocialLinks] = useState('🌐 Website: https://example.com\n🐦 Twitter/X: https://x.com/myhandle\n💬 Discord: https://discord.gg/community');
  const [hashtags, setHashtags] = useState('#WebDev #Coding #React #Fullstack #Tutorial');
  const [copied, setCopied] = useState(false);

  const fullDescription = `📌 ABOUT THIS VIDEO
${videoTitle}
${intro}

⏱️ IN THIS VIDEO:
${mainPoints}

🔔 SUBSCRIBE & SUPPORT:
${cta}
👉 Subscribe Here: ${channelLink}

🔗 CONNECT WITH ME:
${socialLinks}

#️⃣ HASHTAGS:
${hashtags}

---------------------------------------------------
Thanks for watching! Feel free to leave a comment with any questions.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullDescription);
    setCopied(true);
    onShowToast('Description copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([fullDescription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${videoTitle.toLowerCase().replace(/[^a-z0-0]/g, '-').slice(0, 30)}-description.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('Downloaded description TXT file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Description Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build structured, professional video descriptions with Intro, Timestamps, CTAs, Links & Hashtags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-4 glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Description Builder Fields
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Title</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Intro Hook / Summary</label>
            <textarea
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Main Topics / Bullet Points</label>
            <textarea
              rows={3}
              value={mainPoints}
              onChange={(e) => setMainPoints(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Call to Action (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subscribe Link</label>
              <input
                type="text"
                value={channelLink}
                onChange={(e) => setChannelLink(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Social Links & Websites</label>
            <textarea
              rows={2}
              value={socialLinks}
              onChange={(e) => setSocialLinks(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-500" /> Formatted Description Output
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {fullDescription.length} / 5000 Chars
              </span>
            </div>

            <textarea
              readOnly
              value={fullDescription}
              rows={16}
              className="w-full p-4 font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none shadow-inner resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Copied Description!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Description
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
            >
              <Download className="w-4 h-4" /> Download TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
