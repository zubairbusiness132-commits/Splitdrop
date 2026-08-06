import React, { useState, useRef } from 'react';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { Download, FileCode, FileJson, FileText, Printer, Share2, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const ResumeExportTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [resume] = useState<ResumeData>(() => getActiveResume());
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Resume JSON file!');
  };

  const handleExportTxt = () => {
    const txt = `
${resume.personalInfo.fullName.toUpperCase()}
${resume.personalInfo.jobTitle}
${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.address}

SUMMARY
${resume.personalInfo.summary}

EXPERIENCE
${resume.experience.map(e => `• ${e.title} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})\n  ${e.description}`).join('\n\n')}

EDUCATION
${resume.education.map(e => `• ${e.degree} - ${e.institution} (${e.startDate} - ${e.endDate})`).join('\n')}

SKILLS
${resume.skills.map(s => s.name).join(', ')}
`.trim();

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Resume TXT file!');
  };

  const handleExportPdf = async () => {
    if (!printRef.current) return;
    try {
      onShowToast('Generating high-resolution PDF...');
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.name.replace(/\s+/g, '_')}.pdf`);
      onShowToast('Downloaded PDF Resume!');
    } catch (e) {
      console.error(e);
      onShowToast('Failed to export PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleExportPdf}
          className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:border-emerald-500/50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Export PDF</h4>
            <p className="text-[11px] text-slate-400">High Resolution Vector PDF</p>
          </div>
        </button>

        <button
          onClick={handleExportJson}
          className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:border-indigo-500/50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Export JSON</h4>
            <p className="text-[11px] text-slate-400">Backup Raw Data Schema</p>
          </div>
        </button>

        <button
          onClick={handleExportTxt}
          className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:border-purple-500/50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Export TXT</h4>
            <p className="text-[11px] text-slate-400">Plain Text Copy</p>
          </div>
        </button>

        <button
          onClick={handlePrint}
          className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:border-amber-500/50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Print Document</h4>
            <p className="text-[11px] text-slate-400">Direct Browser Print</p>
          </div>
        </button>
      </div>

      {/* Render Document Box */}
      <div className="glass-card p-8 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Export Preview</h3>
        <div ref={printRef} className="p-8 bg-white text-slate-900 rounded-2xl shadow-lg space-y-4 text-xs font-sans max-w-2xl mx-auto border border-slate-100">
          <div className="border-b border-slate-200 pb-3">
            <h1 className="text-xl font-bold text-slate-900">{resume.personalInfo.fullName}</h1>
            <p className="text-xs font-semibold text-indigo-600">{resume.personalInfo.jobTitle}</p>
            <p className="text-[11px] text-slate-500">{resume.personalInfo.email} • {resume.personalInfo.phone} • {resume.personalInfo.address}</p>
          </div>
          <p className="text-slate-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      </div>
    </div>
  );
};
