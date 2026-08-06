import React, { useState } from 'react';
import { CAREER_COLOR_THEMES } from '../../../data/careerData';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { Palette, Check, ArrowRight } from 'lucide-react';

export const ResumeColorThemesTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [resume, setResume] = useState(() => getActiveResume());
  const [customHex, setCustomHex] = useState<string>(resume.styling?.primaryColor || '#2563eb');

  const handleSelectTheme = (primaryColor: string, name: string) => {
    const current = getActiveResume();
    const updated = {
      ...current,
      styling: {
        ...current.styling,
        primaryColor
      }
    };
    saveActiveResume(updated);
    setResume(updated);
    onShowToast(`Applied ${name} color theme!`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" /> Resume Color Themes & Styling
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Apply high-contrast, WCAG-tested corporate color palettes to your active resume headers and accent borders.
        </p>
      </div>

      {/* Color Presets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAREER_COLOR_THEMES.map((theme) => {
          const isSelected = resume.styling?.primaryColor === theme.primary;
          return (
            <div
              key={theme.id}
              onClick={() => handleSelectTheme(theme.primary, theme.name)}
              className={`glass-card p-5 rounded-3xl space-y-3 cursor-pointer border transition-all ${
                isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: theme.primary }} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{theme.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Primary HEX: <code className="font-mono">{theme.primary}</code>
              </div>

              {/* Sample Mini Preview */}
              <div className="p-3 rounded-xl bg-white text-slate-900 border border-slate-200 space-y-1 text-[10px]">
                <div className="font-bold text-xs" style={{ color: theme.primary }}>Sample Candidate Name</div>
                <div className="w-full h-1 rounded" style={{ backgroundColor: theme.primary }} />
                <div className="text-slate-500">Professional Experience Heading</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Picker */}
      <div className="glass-card p-6 rounded-3xl max-w-md mx-auto space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Custom HEX Color Picker</h3>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
          />
          <input
            type="text"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
          />
          <button
            onClick={() => handleSelectTheme(customHex, 'Custom HEX')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
