import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { History, Sparkles, CheckCircle2, Rocket, Bug } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const { t } = useLanguage();

  const releases = [
    {
      version: 'v3.2.0',
      date: 'August 2026',
      badge: t('latestRelease', 'Latest Release'),
      highlights: [
        'Added User Productivity Dashboard with local stats, favorite management & recent tools history.',
        'Added dedicated Category Browsing for PDF, Image, Creator, Career, Developer, Design, Prompt & Security tools.',
        'Implemented Advanced Search with multi-tag indexing, auto-complete suggestions, and recent searches.',
        'Introduced keyboard shortcuts (Ctrl+K search, Ctrl+D favorite, Esc close).',
        'Enhanced offline PWA support and smart install banner with real-time connectivity status.'
      ],
      fixes: [
        'Optimized bundle size with code-splitting across all 100+ tool modules.',
        'Improved WCAG contrast and keyboard focus outline visibility.'
      ]
    },
    {
      version: 'v3.1.0',
      date: 'July 2026',
      badge: 'Major Update',
      highlights: [
        'Added 20+ Security, Privacy & Productivity tools including Password Generator, QR Scanner, Encrypted Notes, and Habit Tracker.',
        'Added AI Prompt Builder tool suite for ChatGPT, Gemini, Claude, Midjourney, Veo, and Flux.',
        'Integrated 18 multi-language localizations (Spanish, French, German, Japanese, Arabic, Hindi, etc.).'
      ],
      fixes: [
        'Fixed canvas high-DPI scaling rendering glitches on Retina screens.',
        'Improved PDF page reordering touch response on iOS Safari.'
      ]
    },
    {
      version: 'v3.0.0',
      date: 'June 2026',
      badge: 'Core Platform',
      highlights: [
        'Initial release of SplitDrop image splitter & merger with real-time drag-to-adjust cut line.',
        'Full suite of career tools: Resume Builder, Cover Letter Builder, ATS Resume Checker, CTC & Salary Calculators.',
        'PWA support with service worker offline caching.'
      ],
      fixes: [
        'Initial production rollout.'
      ]
    }
  ];

  const roadmap = [
    { title: 'Offline WebAssembly AI Model Integration', desc: 'Running lightweight local ONNX models for background removal without cloud APIs.' },
    { title: 'Multi-Document Split Screen Comparison', desc: 'Side-by-side comparative preview for PDF pages and images.' },
    { title: 'Custom Quick Action Shortcuts Bar', desc: 'Allowing users to pin top 5 tools directly to the top navigation header.' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      
      {/* Title */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold mx-auto">
          <History className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('changelogTitle', 'Changelog & Version History')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('changelogSubtitle', 'Track recent platform updates, bug fixes, performance optimizations, and future roadmap goals.')}
        </p>
      </div>

      {/* Releases Timeline */}
      <div className="space-y-6">
        {releases.map((rel, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{rel.version}</span>
                <span className="text-xs font-semibold text-slate-400">{rel.date}</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                {rel.badge}
              </span>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> New Features & Improvements
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {rel.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bug Fixes */}
            {rel.fixes && rel.fixes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-amber-500" /> Bug Fixes & Optimizations
                </h3>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {rel.fixes.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Future Roadmap Section */}
      <section className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{t('futureRoadmap', 'Future Roadmap')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roadmap.map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase">Phase 0{i + 1}</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
