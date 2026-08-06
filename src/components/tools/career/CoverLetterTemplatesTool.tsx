import React from 'react';
import { COVER_LETTER_TEMPLATES_LIST, getDefaultCoverLetter } from '../../../data/careerData';
import { saveActiveCoverLetter } from '../../../lib/resumeStore';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CoverLetterTemplatesToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const CoverLetterTemplatesTool: React.FC<CoverLetterTemplatesToolProps> = ({ onShowToast, onNavigate }) => {
  const handleSelectTemplate = (templateId: string, name: string) => {
    const templateData = getDefaultCoverLetter(templateId);
    saveActiveCoverLetter(templateData);
    onShowToast(`Loaded ${name} template!`);
    if (onNavigate) {
      onNavigate('/cover-letter-builder.html');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Choose a Industry-Tailored Cover Letter Template
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select any role template below to load pre-written professional wording directly into your editable Cover Letter Builder.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COVER_LETTER_TEMPLATES_LIST.map((tpl) => (
          <div
            key={tpl.id}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all group cursor-pointer"
            onClick={() => handleSelectTemplate(tpl.id, tpl.name)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {tpl.category}
                </span>
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tpl.name}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-formatted introduction, achievements, and call to action optimized for {tpl.role} hiring managers.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectTemplate(tpl.id, tpl.name);
              }}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>Use {tpl.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
