import React, { useState } from 'react';
import { saveActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { SAMPLE_RESUME_DATA } from '../../../data/resumeTemplatesData';
import { Upload, FileJson, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const ResumeImportTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ResumeData | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
            setImportedData(parsed as ResumeData);
            setImportStatus('Successfully validated JSON resume structure!');
          } else {
            setImportStatus('Error: Invalid JSON resume schema format.');
          }
        } else {
          // Plain Text / HTML fallback parser
          const sample: ResumeData = {
            ...SAMPLE_RESUME_DATA,
            id: `imported_${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            updatedAt: Date.now(),
            personalInfo: {
              ...SAMPLE_RESUME_DATA.personalInfo,
              fullName: file.name.replace(/\.[^/.]+$/, ''),
              email: 'imported@email.com',
              phone: '+1 555-0000',
              jobTitle: 'Professional Candidate',
              summary: text.slice(0, 300)
            }
          };
          setImportedData(sample);
          setImportStatus('Imported plain text resume structure!');
        }
      } catch (err) {
        setImportStatus('Error parsing uploaded file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!importedData) return;
    saveActiveResume(importedData);
    onShowToast('Resume imported successfully into active suite!');
    if (onNavigate) {
      onNavigate('/resume-builder.html');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Upload className="w-5 h-5 text-indigo-600" /> Import Existing Resume
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload a previously exported SplitDrop `.json` file or plain `.txt` / `.html` document to restore your resume.
        </p>
      </div>

      <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-indigo-500/30 text-center space-y-4 hover:border-indigo-500/60 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto">
          <FileJson className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Click to browse or drop resume file here
          </p>
          <p className="text-[11px] text-slate-400">Supports .json, .txt, .html files (100% Client-Side Private)</p>
        </div>

        <input
          type="file"
          accept=".json,.txt,.html"
          onChange={handleFileUpload}
          className="hidden"
          id="resume-file-input"
        />

        <label
          htmlFor="resume-file-input"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shadow-md"
        >
          Select File from Device
        </label>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          importStatus.startsWith('Error')
            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
        }`}>
          {importStatus.startsWith('Error') ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{importStatus}</span>
        </div>
      )}

      {importedData && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Import Preview</h3>
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl">
            <p><strong>Candidate:</strong> {importedData.personalInfo.fullName}</p>
            <p><strong>Job Title:</strong> {importedData.personalInfo.jobTitle}</p>
            <p><strong>Email:</strong> {importedData.personalInfo.email}</p>
          </div>

          <button
            onClick={handleConfirmImport}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Confirm & Set as Active Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
