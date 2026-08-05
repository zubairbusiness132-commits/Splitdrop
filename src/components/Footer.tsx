import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                100% Client-Side Privacy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your images and PDFs are processed entirely in your browser. Nothing is ever uploaded to external servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Instant Processing Speed
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No queue times or upload bottlenecks. Experience sub-second image splitting, conversion, and compression.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Free & Unlimited
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No subscription, watermarks, or daily caps. High quality output for creators and professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Col 1 Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
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
              Image Tools
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} className="hover:text-indigo-600 transition-colors">
                  SplitDrop Image Splitter & Merger
                </a>
              </li>
              <li>
                <a href="/image-compressor.html" onClick={(e) => { e.preventDefault(); onNavigate('/image-compressor.html'); }} className="hover:text-indigo-600 transition-colors">
                  Image Compressor
                </a>
              </li>
              <li>
                <a href="/image-converter.html" onClick={(e) => { e.preventDefault(); onNavigate('/image-converter.html'); }} className="hover:text-indigo-600 transition-colors">
                  Image Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 PDF & Utilities */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              PDF & Utilities
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="/pdf-merge.html" onClick={(e) => { e.preventDefault(); onNavigate('/pdf-merge.html'); }} className="hover:text-indigo-600 transition-colors">
                  PDF Merge Tool
                </a>
              </li>
              <li>
                <a href="/pdf-split.html" onClick={(e) => { e.preventDefault(); onNavigate('/pdf-split.html'); }} className="hover:text-indigo-600 transition-colors">
                  PDF Splitter & Extractor
                </a>
              </li>
              <li>
                <a href="/qr-generator.html" onClick={(e) => { e.preventDefault(); onNavigate('/qr-generator.html'); }} className="hover:text-indigo-600 transition-colors">
                  QR Code Generator
                </a>
              </li>
              <li>
                <a href="/resume-builder.html" onClick={(e) => { e.preventDefault(); onNavigate('/resume-builder.html'); }} className="hover:text-indigo-600 transition-colors">
                  Resume Builder
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>© 2026 SplitDrop. All Rights Reserved.</p>
          <p className="text-[11px]">Made with ❤️ for creators.</p>
        </div>
      </div>
    </footer>
  );
};
