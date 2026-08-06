import React, { useState } from 'react';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { Layers, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface CustomSection {
  id: string;
  title: string;
  visible: boolean;
}

export const ResumeSectionManagerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [resume, setResume] = useState<ResumeData>(() => getActiveResume());
  const [sections, setSections] = useState<CustomSection[]>([
    { id: 'personalInfo', title: 'Personal Contact & Header', visible: true },
    { id: 'summary', title: 'Professional Summary', visible: true },
    { id: 'experience', title: 'Work Experience History', visible: true },
    { id: 'education', title: 'Education & Degrees', visible: true },
    { id: 'skills', title: 'Key Technical Skills', visible: true },
    { id: 'projects', title: 'Featured Portfolio Projects', visible: true },
    { id: 'certifications', title: 'Certifications & Credentials', visible: true }
  ]);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setSections(updated);
    onShowToast('Updated section order');
  };

  const moveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setSections(updated);
    onShowToast('Updated section order');
  };

  const toggleVisibility = (idx: number) => {
    const updated = [...sections];
    updated[idx].visible = !updated[idx].visible;
    setSections(updated);
    onShowToast(`Section "${updated[idx].title}" ${updated[idx].visible ? 'shown' : 'hidden'}`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" /> Resume Section Manager
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reorder sections, toggle visibility, or add custom sections to customize your resume structure.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
              sec.visible
                ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{sec.title}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-300"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              </button>

              <button
                onClick={() => moveDown(idx)}
                disabled={idx === sections.length - 1}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-300"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              </button>

              <button
                onClick={() => toggleVisibility(idx)}
                className={`p-1.5 rounded-lg transition-all ${
                  sec.visible
                    ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
                title={sec.visible ? 'Hide Section' : 'Show Section'}
              >
                {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
