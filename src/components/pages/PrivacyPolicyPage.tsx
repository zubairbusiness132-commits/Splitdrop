import React from 'react';
import { ShieldCheck, Lock, HardDrive, Cookie, EyeOff, CheckCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block mb-3">
          <ShieldCheck className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Effective Date: August 2026 • SplitDrop Client-Side Security Guarantee
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        {/* Highlight Banner */}
        <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              100% In-Browser Local Processing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              SplitDrop operates completely inside your local web browser. Your private images, PDF documents, and resume data are never sent to external servers or cloud databases.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" /> 1. No Data Uploads
          </h2>
          <p>
            When you compress an image, merge or split PDFs, generate QR codes, or build a resume using SplitDrop, the execution occurs strictly within your browser's RAM memory using WebAssembly, HTML5 Canvas, and JavaScript libraries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-indigo-600" /> 2. Local Storage & Cookies
          </h2>
          <p>
            SplitDrop uses <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">localStorage</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">IndexedDB</code> to store your draft resumes, dark mode theme preferences, and active language selections locally on your device. You can clear this data anytime by clearing your browser site storage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600" /> 3. Advertising & Analytics
          </h2>
          <p>
            We may display non-intrusive advertisements (Google AdSense) and anonymous performance metrics (Google Analytics) to support the free hosting of SplitDrop. Third-party ad vendors use cookies to serve ads based on non-personal site visits.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            4. Contacting Us
          </h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact us via email at{' '}
            <a href="mailto:support@splitdrop.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              support@splitdrop.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
};
