import React from 'react';
import { Sparkles, ShieldCheck, Zap, Heart, Globe, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      
      {/* Hero Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs inline-block mb-3 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
          SplitDrop Mission & Engineering
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          About SplitDrop
        </h1>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          Reimagining web tools with 100% client-side privacy, sub-second speed, and zero server storage requirements.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        {/* Mission Statement */}
        <div className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Our Core Mission
          </h2>
          <p>
            SplitDrop was created to solve a pervasive problem on the modern web: traditional file tools force users to upload their confidential documents, private family photographs, and resume details to unknown third-party cloud servers.
          </p>
          <p>
            We engineered SplitDrop to process everything locally inside your device using HTML5 Canvas, PDF-lib, JSZip, and modern Web APIs.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="glass-card p-5 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Absolute Privacy</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Zero cloud uploads. Your data stays completely in your browser memory.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <Zap className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Instant Execution</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              No uploading wait time. Experience instant compression, splitting, and rendering.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <Heart className="w-6 h-6 text-emerald-500 mb-2" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Free Forever</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              No account mandatory, no hidden paywalls, and no forced watermarks.
            </p>
          </div>
        </div>

        {/* Tools Included */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> The SplitDrop Suite
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <li className="glass-card p-3 rounded-xl font-semibold">
              ✨ <strong>SplitDrop Image Splitter & Merger</strong>: Split or combine images seamlessly.
            </li>
            <li className="glass-card p-3 rounded-xl font-semibold">
              🗜️ <strong>Batch Image Compressor</strong>: Reduce PNG, JPG, WebP file sizes.
            </li>
            <li className="glass-card p-3 rounded-xl font-semibold">
              🔄 <strong>Batch Image Converter</strong>: Convert formats instantly.
            </li>
            <li className="glass-card p-3 rounded-xl font-semibold">
              📚 <strong>PDF Merge & Splitter</strong>: Reorder, combine, or extract PDF pages.
            </li>
            <li className="glass-card p-3 rounded-xl font-semibold">
              📱 <strong>Dynamic QR Code Generator</strong>: Custom vector QR codes.
            </li>
            <li className="glass-card p-3 rounded-xl font-semibold">
              📄 <strong>Professional Resume Builder</strong>: Multi-template ATS resume builder.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
