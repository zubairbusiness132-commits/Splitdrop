import React, { useState } from 'react';
import { TEMPLATE_STYLES, SAMPLE_RESUME_DATA } from '../../../data/resumeTemplatesData';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { Check, Layout, Sparkles, ArrowRight } from 'lucide-react';

export const ResumeTemplateGalleryTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeResume] = useState(() => getActiveResume());

  const categories = ['All', 'Popular', 'Corporate', 'Design', 'Minimalist', 'Classic', 'ATS Friendly'];

  const filteredTemplates = activeCategory === 'All'
    ? TEMPLATE_STYLES
    : TEMPLATE_STYLES.filter(t => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const handleApplyTemplate = (tplId: string, name: string) => {
    const current = getActiveResume();
    const updated = {
      ...current,
      styling: {
        ...current.styling,
        templateStyle: tplId as any
      }
    };
    saveActiveResume(updated);
    onShowToast(`Applied ${name} template to active resume!`);
    if (onNavigate) {
      onNavigate('/resume-builder.html');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Layout className="w-5 h-5 text-indigo-600" /> Resume Template Gallery (30+ Designs)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Browse ATS-optimized layouts. Clicking any design instantly applies its layout structure and typography to your active resume.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isSelected = activeResume.styling?.templateStyle === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`glass-card p-5 rounded-3xl space-y-4 flex flex-col justify-between border transition-all ${
                isSelected ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {tpl.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>

                {/* Template Mock Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-[10px]">
                  <div className="w-2/3 h-2.5 rounded bg-indigo-600/80" />
                  <div className="w-1/2 h-2 rounded bg-slate-300 dark:bg-slate-700" />
                  <hr className="border-slate-200 dark:border-slate-800 my-1" />
                  <div className="space-y-1">
                    <div className="w-full h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="w-5/6 h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="w-4/6 h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tpl.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tpl.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleApplyTemplate(tpl.id, tpl.name)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  isSelected
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <span>{isSelected ? 'Currently Selected' : `Apply ${tpl.name}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
