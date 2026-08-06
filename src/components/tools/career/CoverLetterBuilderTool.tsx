import React, { useState, useEffect, useRef } from 'react';
import { getActiveCoverLetter, saveActiveCoverLetter } from '../../../lib/resumeStore';
import { CoverLetterData } from '../../../data/careerData';
import { Download, FileCode, FileJson, FileText, Printer, Save, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CoverLetterBuilderToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const CoverLetterBuilderTool: React.FC<CoverLetterBuilderToolProps> = ({ onShowToast }) => {
  const [data, setData] = useState<CoverLetterData>(() => getActiveCoverLetter());
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveActiveCoverLetter(data);
  }, [data]);

  const updateSection = (key: keyof CoverLetterData['sections'], val: string) => {
    setData(prev => ({
      ...prev,
      sections: { ...prev.sections, [key]: val }
    }));
  };

  const updatePersonalInfo = (key: keyof CoverLetterData['personalInfo'], val: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [key]: val }
    }));
  };

  const updateRecipientInfo = (key: keyof CoverLetterData['recipientInfo'], val: string) => {
    setData(prev => ({
      ...prev,
      recipientInfo: { ...prev.recipientInfo, [key]: val }
    }));
  };

  // Export TXT
  const handleExportTxt = () => {
    const textContent = `
${data.personalInfo.fullName}
${data.personalInfo.jobTitle}
${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.address}

Date: ${data.recipientInfo.date}
To: ${data.recipientInfo.hiringManagerName}
Company: ${data.recipientInfo.companyName}
Address: ${data.recipientInfo.companyAddress}
Re: Application for ${data.recipientInfo.jobTitleApplied}

${data.sections.greeting}

${data.sections.introduction}

${data.sections.experience}

${data.sections.skills}

${data.sections.achievements}

${data.sections.closing}
`.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Cover Letter as TXT!');
  };

  // Export JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Cover Letter as JSON!');
  };

  // Export HTML
  const handleExportHtml = () => {
    if (!previewRef.current) return;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.name}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { margin-bottom: 4px; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .meta { font-size: 14px; color: #334155; margin-bottom: 24px; }
    .section { margin-bottom: 16px; }
  </style>
</head>
<body>
  ${previewRef.current.innerHTML}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Cover Letter as HTML!');
  };

  // Export PDF
  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    try {
      onShowToast('Generating PDF...');
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.name.replace(/\s+/g, '_')}.pdf`);
      onShowToast('Downloaded Cover Letter PDF!');
    } catch (e) {
      console.error(e);
      onShowToast('Failed to export PDF');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
          className="text-lg font-bold bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Edit Sections
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Live Preview
            </button>
          </div>

          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>

          <button
            onClick={handleExportHtml}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5" /> HTML
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>

          <button
            onClick={handleExportTxt}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-slate-300"
          >
            <FileText className="w-3.5 h-3.5" /> TXT
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Details */}
          <div className="glass-card p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              1. Sender & Recipient Info
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Your Job Title</label>
                <input
                  type="text"
                  value={data.personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Recipient Name / Committee</label>
                <input
                  type="text"
                  value={data.recipientInfo.hiringManagerName}
                  onChange={(e) => updateRecipientInfo('hiringManagerName', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Company Name</label>
                <input
                  type="text"
                  value={data.recipientInfo.companyName}
                  onChange={(e) => updateRecipientInfo('companyName', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Letter Sections */}
          <div className="glass-card p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              2. Cover Letter Text Sections
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Salutation / Greeting</label>
                <input
                  type="text"
                  value={data.sections.greeting}
                  onChange={(e) => updateSection('greeting', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Introduction Paragraph</label>
                <textarea
                  value={data.sections.introduction}
                  onChange={(e) => updateSection('introduction', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Highlights</label>
                <textarea
                  value={data.sections.experience}
                  onChange={(e) => updateSection('experience', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Skills & Values Alignment</label>
                <textarea
                  value={data.sections.skills}
                  onChange={(e) => updateSection('skills', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Key Achievements</label>
                <textarea
                  value={data.sections.achievements}
                  onChange={(e) => updateSection('achievements', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Closing & Sign-off</label>
                <textarea
                  value={data.sections.closing}
                  onChange={(e) => updateSection('closing', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Live Preview Paper */}
      <div className={`glass-card p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 ${activeTab === 'editor' ? 'hidden md:block' : ''}`}>
        <div ref={previewRef} className="max-w-2xl mx-auto p-8 bg-white text-slate-900 shadow-lg rounded-2xl space-y-6 text-sm font-sans border border-slate-100">
          {/* Header */}
          <div className="border-b-2 border-indigo-600 pb-4">
            <h1 className="text-2xl font-black text-slate-900">{data.personalInfo.fullName}</h1>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{data.personalInfo.jobTitle}</p>
            <p className="text-xs text-slate-500 mt-1">
              {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.address}
            </p>
          </div>

          {/* Date & Recipient */}
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">{data.recipientInfo.date}</p>
            <p className="font-bold text-slate-900 mt-2">{data.recipientInfo.hiringManagerName}</p>
            <p className="font-medium text-slate-800">{data.recipientInfo.companyName}</p>
            <p>{data.recipientInfo.companyAddress}</p>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            <p className="font-bold text-slate-900 text-sm">{data.sections.greeting}</p>
            <p>{data.sections.introduction}</p>
            <p>{data.sections.experience}</p>
            <p>{data.sections.skills}</p>
            <p>{data.sections.achievements}</p>
            <p>{data.sections.closing}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
