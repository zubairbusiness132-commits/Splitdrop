import React from 'react';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block mb-3">
          <FileText className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Last Updated: August 2026 • SplitDrop Online Tools Suite
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SplitDrop, you agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Free License & Permitted Use</h2>
          <p>
            SplitDrop provides free, browser-based tools for personal, commercial, and educational use. You may split, compress, convert images, merge or split PDFs, generate QR codes, and export resumes without subscription fees or watermarks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. User Responsibility & File Ownership</h2>
          <p>
            You retain 100% ownership of all files and data processed through SplitDrop. Because all processing occurs locally on your browser, SplitDrop does not store, review, or backed-up your processed files.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
          <p>
            SplitDrop tools are provided "as is" without warranty of any kind. Under no circumstances shall SplitDrop or its operators be held liable for any damages or file loss resulting from the use or inability to use our website.
          </p>
        </section>
      </div>
    </div>
  );
};
