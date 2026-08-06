import React, { useState } from 'react';
import { getResumeVersions, saveResumeVersions, saveActiveResume, getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { Folder, Copy, Trash2, Edit2, Check, Plus, Download, HardDrive } from 'lucide-react';

export const ResumeVersionManagerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [versions, setVersions] = useState<ResumeData[]>(() => getResumeVersions());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const activeResume = getActiveResume();

  const handleSelectActive = (version: ResumeData) => {
    saveActiveResume(version);
    onShowToast(`Switched active resume to "${version.name}"`);
  };

  const handleDuplicate = (version: ResumeData) => {
    const copy: ResumeData = {
      ...version,
      id: `resume_${Date.now()}`,
      name: `${version.name} (Copy)`,
      updatedAt: Date.now()
    };
    const updated = [copy, ...versions];
    setVersions(updated);
    saveResumeVersions(updated);
    onShowToast(`Duplicated "${version.name}"`);
  };

  const handleDelete = (id: string) => {
    if (versions.length <= 1) {
      onShowToast('Cannot delete the only remaining resume version!');
      return;
    }
    const updated = versions.filter(v => v.id !== id);
    setVersions(updated);
    saveResumeVersions(updated);
    if (activeResume.id === id) {
      saveActiveResume(updated[0]);
    }
    onShowToast('Version deleted.');
  };

  const handleStartRename = (v: ResumeData) => {
    setEditingId(v.id);
    setEditingName(v.name);
  };

  const handleSaveRename = (id: string) => {
    const updated = versions.map(v => v.id === id ? { ...v, name: editingName, updatedAt: Date.now() } : v);
    setVersions(updated);
    saveResumeVersions(updated);
    setEditingId(null);
    onShowToast('Renamed version!');
  };

  const handleCreateNew = () => {
    const newVersion: ResumeData = {
      ...activeResume,
      id: `resume_${Date.now()}`,
      name: `New Resume Variant ${versions.length + 1}`,
      updatedAt: Date.now()
    };
    const updated = [newVersion, ...versions];
    setVersions(updated);
    saveResumeVersions(updated);
    saveActiveResume(newVersion);
    onShowToast('Created new resume version!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-600" /> Local Resume Version Manager
          </h2>
          <p className="text-xs text-slate-500">
            Store, duplicate, and manage tailored resume variants (e.g. Frontend vs Manager) safely inside browser localStorage.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Create New Variant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {versions.map((v) => {
          const isActive = activeResume.id === v.id;
          return (
            <div
              key={v.id}
              className={`glass-card p-5 rounded-3xl space-y-4 flex flex-col justify-between border transition-all ${
                isActive ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {isActive ? 'Active Version' : 'Saved Variant'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(v.updatedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                {editingId === v.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-indigo-500 bg-white dark:bg-slate-900"
                    />
                    <button
                      onClick={() => handleSaveRename(v.id)}
                      className="p-2 rounded-lg bg-emerald-600 text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{v.name}</h3>
                    <button
                      onClick={() => handleStartRename(v)}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {v.personalInfo.fullName} • {v.personalInfo.jobTitle} • {v.experience?.length || 0} Jobs Listed
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {!isActive && (
                  <button
                    onClick={() => handleSelectActive(v)}
                    className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                  >
                    Set Active
                  </button>
                )}

                <button
                  onClick={() => handleDuplicate(v)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  title="Duplicate Variant"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(v.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-semibold"
                  title="Delete Version"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
