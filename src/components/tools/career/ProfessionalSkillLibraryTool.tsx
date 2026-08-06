import React, { useState } from 'react';
import { SKILL_LIBRARY } from '../../../data/careerData';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { Search, Plus, Check, Lightbulb } from 'lucide-react';

export const ProfessionalSkillLibraryTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [resume, setResume] = useState(() => getActiveResume());

  const categories = ['All', ...SKILL_LIBRARY.map(s => s.category)];

  const activeSkillNames = new Set((resume.skills || []).map(s => s.name.toLowerCase()));

  const handleAddSkill = (skillName: string) => {
    const current = getActiveResume();
    if (activeSkillNames.has(skillName.toLowerCase())) {
      onShowToast(`"${skillName}" is already in your active resume!`);
      return;
    }
    const updatedSkills = [...(current.skills || []), { id: `skill_${Date.now()}`, name: skillName, level: 85 }];
    const updated = { ...current, skills: updatedSkills };
    saveActiveResume(updated);
    setResume(updated);
    onShowToast(`Added "${skillName}" to active resume skills!`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-600" /> Professional Skill Library (500+ Industry Terms)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search and click any skill to immediately insert it into your active resume.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills (e.g. React, Financial Modeling, SEO)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-6">
        {SKILL_LIBRARY.filter(catGroup => selectedCat === 'All' || catGroup.category === selectedCat).map((catGroup) => {
          const filteredSkills = catGroup.skills.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
          if (filteredSkills.length === 0) return null;

          return (
            <div key={catGroup.category} className="glass-card p-5 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {catGroup.category} ({filteredSkills.length})
              </h3>

              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((sk) => {
                  const isAdded = activeSkillNames.has(sk.name.toLowerCase());
                  return (
                    <button
                      key={sk.name}
                      onClick={() => handleAddSkill(sk.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-60" />}
                      <span>{sk.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
