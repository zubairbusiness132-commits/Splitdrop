import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeLanguage } from '../../types/resume';
import { EMPTY_RESUME_DATA, SAMPLE_RESUME_DATA } from '../../data/resumeTemplatesData';
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
  Eye,
  Edit3,
  Languages,
  FileText
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../../context/LanguageContext';

let canvasHelper: HTMLCanvasElement | null = null;
let ctxHelper: CanvasRenderingContext2D | null = null;

function convertOklchColor(match: string): string {
  if (typeof document === 'undefined') return match;
  if (!canvasHelper) {
    canvasHelper = document.createElement('canvas');
    ctxHelper = canvasHelper.getContext('2d');
  }
  if (ctxHelper) {
    try {
      ctxHelper.fillStyle = '#123456';
      ctxHelper.fillStyle = match;
      const converted = ctxHelper.fillStyle;
      if (converted && !converted.includes('oklch') && converted !== '#123456') {
        return converted;
      }
      ctxHelper.fillStyle = '#654321';
      ctxHelper.fillStyle = match;
      if (ctxHelper.fillStyle !== '#654321' && !ctxHelper.fillStyle.includes('oklch')) {
        return ctxHelper.fillStyle;
      }
    } catch {
      // ignore
    }
  }
  return '#4f46e5';
}

function replaceOklchInCss(cssText: string): string {
  if (!cssText || !cssText.includes('oklch')) return cssText;
  return cssText.replace(/oklch\([^)]+\)/gi, (match) => convertOklchColor(match));
}

function sanitizeOklchInDocument(clonedDoc: Document) {
  const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
  styleTags.forEach(style => {
    if (style.textContent && style.textContent.includes('oklch')) {
      style.textContent = replaceOklchInCss(style.textContent);
    }
  });

  try {
    Array.from(clonedDoc.styleSheets).forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          Array.from(rules).forEach((rule: any) => {
            if (rule.style && rule.style.cssText && rule.style.cssText.includes('oklch')) {
              rule.style.cssText = replaceOklchInCss(rule.style.cssText);
            }
          });
        }
      } catch {
        // Protection
      }
    });
  } catch {
    // Ignore
  }

  const allElements = Array.from(clonedDoc.querySelectorAll('*')) as HTMLElement[];
  allElements.forEach(el => {
    const styleAttr = el.getAttribute('style');
    if (styleAttr && styleAttr.includes('oklch')) {
      el.setAttribute('style', replaceOklchInCss(styleAttr));
    }
  });
}

interface ResumeBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const ResumeBuilderTool: React.FC<ResumeBuilderToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();

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
    return [{ ...EMPTY_RESUME_DATA, id: 'res-default', name: 'My Resume', updatedAt: Date.now() }];
  });

  const [activeResumeId, setActiveResumeId] = useState<string>(() => savedResumes[0].id);
  const activeResume = savedResumes.find(r => r.id === activeResumeId) || savedResumes[0];

  const [history, setHistory] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);

  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('splitdrop_resumes', JSON.stringify(savedResumes));
    } catch {
      // Storage error
    }
  }, [savedResumes]);

  const handleDataChange = (newData: ResumeData) => {
    setHistory(prev => [...prev.slice(-20), activeResume]);
    setFuture([]);
    setSavedResumes(prev => prev.map(r => r.id === activeResume.id ? { ...newData, updatedAt: Date.now() } : r));
  };

  const handleLoadSampleResume = () => {
    const sample: ResumeData = {
      ...SAMPLE_RESUME_DATA,
      id: activeResume.id,
      name: activeResume.name && activeResume.name !== 'My Resume' ? activeResume.name : 'Sample Resume (Alex Morgan)',
      updatedAt: Date.now()
    };
    handleDataChange(sample);
    onShowToast('Loaded sample resume data!');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setFuture(prev => [activeResume, ...prev]);
    setSavedResumes(prev => prev.map(r => r.id === previous.id ? previous : r));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(prev => prev.slice(1));
    setHistory(prev => [...prev, activeResume]);
    setSavedResumes(prev => prev.map(r => r.id === next.id ? next : r));
  };

  const handleCreateNewResume = () => {
    const newRes: ResumeData = {
      ...EMPTY_RESUME_DATA,
      id: `res-${Date.now()}`,
      name: `Resume ${savedResumes.length + 1}`,
      updatedAt: Date.now()
    };
    setSavedResumes(prev => [newRes, ...prev]);
    setActiveResumeId(newRes.id);
    onShowToast('Created new empty resume');
  };

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

  const handleDeleteResume = (id: string) => {
    if (savedResumes.length <= 1) return;
    const filtered = savedResumes.filter(r => r.id !== id);
    setSavedResumes(filtered);
    setActiveResumeId(filtered[0].id);
    onShowToast('Deleted resume');
  };

  const handleDownloadPDF = async () => {
    const element = previewRef.current || (document.querySelector('.resume-preview') as HTMLElement) || (document.getElementById('resume-preview-sheet') as HTMLElement);

    if (!element) {
      onShowToast('Resume preview element not found.');
      return;
    }

    onShowToast('Generating downloadable PDF...');

    try {
      const imgElements = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        imgElements.map(
          img =>
            new Promise<void>(resolve => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }
            })
        )
      );

      const exportPdfFromCanvas = (canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const isLetter = activeResume.styling.paperSize === 'Letter';
        const paperFormat = isLetter ? 'letter' : 'a4';

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: paperFormat
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = pdfWidth / imgWidth;
        const calculatedImgHeight = imgHeight * ratio;

        let heightLeft = calculatedImgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, calculatedImgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft > 1) {
          position -= pdfHeight;
          pdf.addPage(paperFormat, 'portrait');
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, calculatedImgHeight, undefined, 'FAST');
          heightLeft -= pdfHeight;
        }

        const rawName = activeResume.personalInfo.fullName?.trim();
        const cleanName = rawName ? rawName.replace(/[^a-zA-Z0-9_\-]/g, '_') : 'My';
        const fileName = `${cleanName}_Resume.pdf`;

        try {
          pdf.save(fileName);
        } catch (saveError) {
          const blob = pdf.output('blob');
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        }
      };

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        onclone: clonedDoc => {
          sanitizeOklchInDocument(clonedDoc);
          clonedDoc.documentElement.classList.remove('dark');
          if (clonedDoc.body) {
            clonedDoc.body.classList.remove('dark');
          }
          const clonedSheet = (clonedDoc.querySelector('.resume-preview') as HTMLElement) || clonedDoc.getElementById('resume-preview-sheet');
          if (clonedSheet) {
            let parent: HTMLElement | null = clonedSheet;
            while (parent && parent !== clonedDoc.body) {
              parent.style.display = 'block';
              parent.style.visibility = 'visible';
              parent.style.opacity = '1';
              parent.style.transform = 'none';
              parent.style.maxHeight = 'none';
              parent.style.overflow = 'visible';
              parent = parent.parentElement;
            }
            clonedSheet.style.boxShadow = 'none';
            clonedSheet.style.margin = '0';
            clonedSheet.style.transform = 'none';
            clonedSheet.style.borderRadius = '0';
          }
        }
      });

      exportPdfFromCanvas(canvas);
      onShowToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      onShowToast('PDF generation failed. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

  const handleLanguageChange = (lang: ResumeLanguage) => {
    handleDataChange({
      ...activeResume,
      language: lang
    });
    onShowToast(`Switched language to ${lang.toUpperCase()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 p-4 sm:p-6 space-y-6">
      
      {/* TOP TOOLBAR HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel shadow-sm">
        
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
          
          <div className="flex items-center gap-1 glass-card p-1 rounded-xl text-xs font-semibold">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 pl-1 pr-0.5">Layout</span>
            <button
              onClick={() => {
                handleDataChange({
                  ...activeResume,
                  styling: {
                    ...activeResume.styling,
                    layoutPreset: 'modern',
                    fontFamily: 'Inter, sans-serif',
                    marginSize: 'normal',
                    lineHeight: 'normal'
                  }
                });
                onShowToast('Switched to Modern layout & font preset');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                (activeResume.styling.layoutPreset || 'modern') === 'modern'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🚀 Modern
            </button>
            <button
              onClick={() => {
                handleDataChange({
                  ...activeResume,
                  styling: {
                    ...activeResume.styling,
                    layoutPreset: 'classic',
                    fontFamily: 'Georgia, serif',
                    marginSize: 'spacious',
                    lineHeight: 'relaxed'
                  }
                });
                onShowToast('Switched to Classic layout & font preset');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeResume.styling.layoutPreset === 'classic'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs font-serif'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-serif'
              }`}
            >
              📜 Classic
            </button>
          </div>

          <div className="flex items-center gap-1.5 glass-card px-2 py-1 rounded-xl text-xs font-semibold hover:border-indigo-400 transition-colors">
            <Languages className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <select
              value={activeResume.language || 'en'}
              onChange={(e) => handleLanguageChange(e.target.value as ResumeLanguage)}
              className="bg-transparent text-slate-800 dark:text-slate-100 font-bold text-xs focus:outline-none cursor-pointer pr-1 py-0.5"
            >
              <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇺🇸 English (EN)</option>
              <option value="es" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇪🇸 Español (ES)</option>
              <option value="fr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇫🇷 Français (FR)</option>
              <option value="de" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇩🇪 Deutsch (DE)</option>
              <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇮🇳 हिन्दी (HI)</option>
              <option value="ur" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇵🇰 اردو (UR)</option>
              <option value="ar" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇸🇦 العربية (AR)</option>
              <option value="zh" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🇨🇳 中文 (ZH)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-xl glass-btn disabled:opacity-30 text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-2 rounded-xl glass-btn disabled:opacity-30 text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleLoadSampleResume}
            className="px-3 py-2 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer"
            title="Load Sample Resume for Demo"
          >
            <FileText className="w-4 h-4 text-indigo-600" /> Load Sample
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 glass-btn text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print Resume"
          >
            <Printer className="w-4 h-4" /> Print
          </button>

          <button
            onClick={handleDownloadHTML}
            className="hidden sm:flex items-center gap-1 px-3 py-2 glass-btn text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer"
            title="Download HTML"
          >
            <FileCode className="w-4 h-4" /> HTML
          </button>

          <button
            onClick={handleExportJSON}
            className="hidden sm:flex items-center gap-1 px-3 py-2 glass-btn text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer"
            title="Export JSON"
          >
            <FileJson className="w-4 h-4" /> JSON
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
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
