import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HOMEPAGE_FAQS } from '../../data/toolsData';
import { HelpCircle, Keyboard, Shield, Lightbulb, ChevronDown, BookOpen } from 'lucide-react';

interface HelpPageProps {
  onNavigate: (path: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const keyboardShortcuts = [
    { key: 'Ctrl + K  /  ⌘ + K', desc: t('shortcutSearch', 'Open global search modal') },
    { key: 'Ctrl + D  /  ⌘ + D', desc: t('shortcutFavorite', 'Bookmark / Favorite active tool') },
    { key: 'Ctrl + /  /  ⌘ + /', desc: t('shortcutHelp', 'Toggle Help Center modal / page') },
    { key: 'Esc', desc: t('shortcutEsc', 'Close any open dialog or modal') },
  ];

  const tips = [
    {
      title: t('tip1Title', 'Batch Image Processing'),
      desc: t('tip1Desc', 'You can select or drop multiple PNG/JPG images into the Image Compressor or Batch Converter to process them simultaneously and download as a single ZIP file.')
    },
    {
      title: t('tip2Title', 'Drag-and-Drop Splitter'),
      desc: t('tip2Desc', 'On the SplitDrop Hero tool, drag the seam line directly across the canvas image to visually select where to split your graphic with sub-pixel precision.')
    },
    {
      title: t('tip3Title', '100% Offline Capability'),
      desc: t('tip3Desc', 'Bookmark SplitDrop as a PWA or leave the tab open. All calculations, PDF manipulation, and image conversions run directly in your web browser memory.')
    },
    {
      title: t('tip4Title', 'Instant Local Storage'),
      desc: t('tip4Desc', 'Your resumes, encrypted notes, habits, and tool statistics are stored safely in local browser storage without creating any user account.')
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      
      {/* Page Title */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold mx-auto">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('helpCenterTitle', 'Help Center & Documentation')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('helpCenterSubtitle', 'Everything you need to know about using SplitDrop, browser processing, keyboard shortcuts, and tips.')}
        </p>
      </div>

      {/* Keyboard Shortcuts Section */}
      <section className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{t('keyboardShortcuts', 'Keyboard Shortcuts')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {keyboardShortcuts.map((item, i) => (
            <div key={i} className="glass-card p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-[11px] font-bold shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>{t('proTipsAndTricks', 'Pro Tips & Productivity Hacks')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-black">#0{i + 1}</span>
                {tip.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Guarantee Section */}
      <section className="glass-panel p-6 rounded-3xl space-y-3 bg-emerald-500/5 border border-emerald-500/20">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span>{t('privacyGuarantee', 'Privacy & Offline Guarantee')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('privacyDesc', 'SplitDrop operates on a strict zero-server privacy architecture. When you compress an image, merge a PDF, convert code, or build a resume, all computation happens 100% inside your browser device memory. No data is transmitted to external servers.')}
        </p>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{t('frequentlyAskedQuestions', 'Frequently Asked Questions')}</span>
        </h2>
        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
