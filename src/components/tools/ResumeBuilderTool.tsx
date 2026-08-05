import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeLanguage } from '../../types/resume';
import { DEFAULT_RESUME_DATA } from '../../data/resumeTemplatesData';
import { ResumeEditor } from './resume/ResumeEditor';
import { ResumePreview } from './resume/ResumePreview';
import { 
  Download, 
  Printer, 
  RotateCcw, 
  RotateCw, 
  FileCode, 
  FileJson, 
  Check, 
  Sparkles,
  Eye,
  Edit3,
  Languages
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResumeBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ResumeBuilderTool: React.FC<ResumeBuilderToolProps> = ({ onShowToast }) => {
  // Saved resumes state from localStorage
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>(() => {
    try {
      const stored = localStorage.getItem('splitdrop_resumes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Storage unavailable
    }
    return [{ ...DEFAULT_RESUME_DATA, id: 'res-default', updatedAt: Date.now() }];
  });

  const [activeResumeId, setActiveResumeId] = useState<string>(() => savedResumes[0].id);

  // Active resume object
  const activeResume = savedResumes.find(r => r.id === activeResumeId) || savedResumes[0];

  // Undo / Redo history stacks
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);

  // Mobile View Toggle: 'editor' | 'preview'
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save active resume to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('splitdrop_resumes', JSON.stringify(savedResumes));
    } catch {
      // Storage error
    }
  }, [savedResumes]);

  // Update active resume & save to history
  const handleDataChange = (newData: ResumeData) => {
    setHistory(prev => [...prev.slice(-20), activeResume]);
    setFuture([]);
    setSavedResumes(prev => prev.map(r => r.id === activeResume.id ? { ...newData, updatedAt: Date.now() } : r));
  };

  // Undo Handler
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setFuture(prev => [activeResume, ...prev]);
    setSavedResumes(prev => prev.map(r => r.id === previous.id ? previous : r));
  };

  // Redo Handler
  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(prev => prev.slice(1));
    setHistory(prev => [...prev, activeResume]);
    setSavedResumes(prev => prev.map(r => r.id === next.id ? next : r));
  };

  // Create new resume
  const handleCreateNewResume = () => {
    const newRes: ResumeData = {
      ...DEFAULT_RESUME_DATA,
      id: `res-${Date.now()}`,
      name: `Resume ${savedResumes.length + 1}`,
      updatedAt: Date.now()
    };
    setSavedResumes(prev => [newRes, ...prev]);
    setActiveResumeId(newRes.id);
    onShowToast('Created new blank resume');
  };

  // Duplicate resume
  const handleDuplicateResume = (id: string) => {
    const target = savedResumes.find(r => r.id === id);
    if (!target) return;
    const dup: ResumeData = {
      ...target,
      id: `res-${Date.now()}`,
      name: `${target.name} (Copy)`,
      updatedAt: Date.now()
    };
    setSavedResumes(prev => [dup, ...prev]);
    setActiveResumeId(dup.id);
    onShowToast('Duplicated resume!');
  };

  // Delete resume
  const handleDeleteResume = (id: string) => {
    if (savedResumes.length <= 1) return;
    const filtered = savedResumes.filter(r => r.id !== id);
    setSavedResumes(filtered);
    setActiveResumeId(filtered[0].id);
    onShowToast('Deleted resume');
  };

  // Export PDF
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    onShowToast('Generating high-res PDF...');
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: activeResume.styling.paperSize === 'Letter' ? 'letter' : 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      onShowToast('PDF downloaded successfully!');
    } catch {
      window.print();
    }
  };

  // Print Resume
  const handlePrint = () => {
    window.print();
  };

  // Download HTML
  const handleDownloadHTML = () => {
    if (!previewRef.current) return;
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${activeResume.personalInfo.fullName} - Resume</title>
  <style>
    body { font-family: ${activeResume.styling.fontFamily}; padding: 20px; background: #f8fafc; }
    .resume-sheet { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div className="resume-sheet">
    ${previewRef.current.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('HTML file exported!');
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(activeResume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeResume.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Resume JSON!');
  };

  // Import JSON
  const handleImportJSON = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.personalInfo) {
        const imported: ResumeData = {
          ...parsed,
          id: `res-${Date.now()}`,
          updatedAt: Date.now()
        };
        setSavedResumes(prev => [imported, ...prev]);
        setActiveResumeId(imported.id);
        onShowToast('Imported Resume successfully!');
      }
    } catch {
      onShowToast('Invalid JSON file format');
    }
  };

  // Language change
  const handleLanguageChange = (lang: ResumeLanguage) => {
    handleDataChange({
      ...activeResume,
      language: lang
    });
    onShowToast(`Switched language to ${lang.toUpperCase()}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* TOP TOOLBAR HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Title & Saved Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            📄
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activeResume.name}
                onChange={(e) => handleDataChange({ ...activeResume, name: e.target.value })}
                className="font-black text-base sm:text-lg text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> Auto-saved in browser
            </span>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <Languages className="w-3.5 h-3.5 text-indigo-600 ml-1" />
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-1 rounded-lg ${activeResume.language === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-2 py-1 rounded-lg ${activeResume.language === 'hi' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => handleLanguageChange('ur')}
              className={`px-2 py-1 rounded-lg ${activeResume.language === 'ur' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              اردو
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`px-2 py-1 rounded-lg ${activeResume.language === 'ar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              عربي
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Download PDF & Print */}
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            title="Print Resume"
          >
            <Printer className="w-4 h-4" /> Print
          </button>

          {/* HTML & JSON Exports */}
          <button
            onClick={handleDownloadHTML}
            className="hidden sm:flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
            title="Download HTML"
          >
            <FileCode className="w-4 h-4" /> HTML
          </button>

          <button
            onClick={handleExportJSON}
            className="hidden sm:flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
            title="Export JSON"
          >
            <FileJson className="w-4 h-4" /> JSON
          </button>
        </div>
      </div>

      {/* MOBILE TOGGLE SWITCH (Editor / Live Preview) */}
      <div className="lg:hidden flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 font-semibold text-xs">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileView === 'editor' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> Resume Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileView === 'preview' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Live Preview
        </button>
      </div>

      {/* MAIN TWO-COLUMN SPLIT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
        
        {/* LEFT PANEL: RESUME EDITOR */}
        <div className={`lg:col-span-5 h-[750px] ${mobileView === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <ResumeEditor
            data={activeResume}
            onChange={handleDataChange}
            savedResumes={savedResumes}
            onSelectResume={(id) => setActiveResumeId(id)}
            onCreateNewResume={handleCreateNewResume}
            onDuplicateResume={handleDuplicateResume}
            onDeleteResume={handleDeleteResume}
            onImportJson={handleImportJSON}
            onExportJson={handleExportJSON}
            onShowToast={onShowToast}
          />
        </div>

        {/* RIGHT PANEL: LIVE RESUME PREVIEW */}
        <div className={`lg:col-span-7 h-[750px] overflow-y-auto ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <ResumePreview
            data={activeResume}
            previewRef={previewRef}
          />
        </div>
      </div>
    </div>
  );
};
