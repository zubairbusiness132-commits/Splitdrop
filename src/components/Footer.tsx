import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl pt-12 pb-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 text-center sm:text-left">
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('zeroServerUploads', '100% Client-Side Privacy')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('zeroServerUploadsDesc', 'Your images and PDFs are processed entirely in your browser. Nothing is ever uploaded to external servers.')}
              </p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/60 text-amber-500 shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('instantSpeed', 'Instant Processing Speed')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('instantSpeedDesc', 'No queue times or upload bottlenecks. Experience sub-second image splitting, conversion, and compression.')}
              </p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-500 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('freeForever', 'Free & Unlimited')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('freeForeverDesc', 'No subscription, watermarks, or daily caps. High quality output for creators and professionals.')}
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Col 1 Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                SD
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">SplitDrop</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Production-grade free online tools suite for creators, developers, designers, and students.
            </p>
          </div>

          {/* Col 2 Image Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('imageTools', 'Image Tools')}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href={getLinkUrl('/')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  SplitDrop Image Splitter & Merger
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/image-compressor.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-compressor.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image Compressor
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/image-converter.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-converter.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 PDF & Utilities */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('pdfAndUtilities', 'PDF & Utilities')}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href={getLinkUrl('/pdf-merge.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/pdf-merge.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Merge Tool
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/pdf-split.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/pdf-split.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Splitter & Extractor
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/qr-generator.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/qr-generator.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  QR Code Generator
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/resume-builder.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/resume-builder.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume Builder
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 Platform & Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('platformAndSupport', 'Platform & Support')}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href={getLinkUrl('/dashboard.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/dashboard.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
                  ⭐ User Dashboard
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/categories.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/categories.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ⚡ Tool Categories Directory
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/help.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/help.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ❓ Help Center & Guides
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/changelog.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/changelog.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  📜 Changelog & Updates
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/feedback.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/feedback.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  💬 Send Feedback
                </a>
              </li>
              <li className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <a href={getLinkUrl('/privacy.html')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/privacy.html')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('privacy', 'Privacy Policy')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>{t('copyright', '© 2026 SplitDrop. All Rights Reserved.')}</p>
          <p className="text-[11px]">{t('madeWithLove', 'Made with ❤️ for creators.')}</p>
        </div>
      </div>
    </footer>
  );
};
