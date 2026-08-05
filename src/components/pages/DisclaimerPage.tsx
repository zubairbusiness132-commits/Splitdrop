import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

interface DisclaimerPageProps {
  onNavigate: (path: string) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block mb-3">
          <AlertCircle className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Website Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          General Information & Accuracy Disclaimer
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">General Information Only</h2>
          <p>
            The information and tools provided by SplitDrop are for general utility, productivity, and informational purposes only. All processing is executed client-side in the user's browser memory.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">No Professional Advice</h2>
          <p>
            The Resume Builder templates, wording suggestions, and ATS completeness scores are created as self-help drafting tools and do not constitute professional career or recruitment advisory services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">External Links & Ads</h2>
          <p>
            SplitDrop may contain links or advertisements leading to external third-party websites. SplitDrop has no control over the content or privacy policies of third-party sites.
          </p>
        </section>
      </div>
    </div>
  );
};
