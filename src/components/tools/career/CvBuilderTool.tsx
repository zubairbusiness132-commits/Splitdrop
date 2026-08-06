import React, { useState, useRef } from 'react';
import { Download, Plus, Trash2, GraduationCap, BookOpen, Award, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CvPublication {
  id: string;
  title: string;
  journal: string;
  year: string;
  doi?: string;
}

interface CvResearchGrant {
  id: string;
  title: string;
  agency: string;
  amount: string;
  year: string;
}

interface CvData {
  fullName: string;
  degreeTitle: string;
  email: string;
  phone: string;
  institution: string;
  biography: string;
  education: { id: string; degree: string; institution: string; year: string; thesisTitle: string }[];
  publications: CvPublication[];
  grants: CvResearchGrant[];
  teaching: { id: string; course: string; institution: string; period: string }[];
}

export const CvBuilderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [cv, setCv] = useState<CvData>({
    fullName: 'Dr. Eleanor Vance, Ph.D.',
    degreeTitle: 'Associate Professor of Computer Science',
    email: 'eleanor.vance@university.edu',
    phone: '+1 (555) 019-2831',
    institution: 'Stanford University Department of Computer Science',
    biography: 'Academic researcher specializing in distributed consensus algorithms, high-density machine learning infrastructure, and verified formal methods with 12+ peer-reviewed journal publications.',
    education: [
      { id: 'e1', degree: 'Ph.D. in Computer Science', institution: 'MIT', year: '2019', thesisTitle: 'Provably Secure High-Throughput Consensus in Asynchronous Networks' },
      { id: 'e2', degree: 'M.S. in Software Engineering', institution: 'UC Berkeley', year: '2015', thesisTitle: 'Distributed Memory Caching Models' }
    ],
    publications: [
      { id: 'p1', title: 'Formal Verification of Fault-Tolerant State Machine Replication', journal: 'ACM Transactions on Computer Systems (TOCS)', year: '2023', doi: '10.1145/3581234' },
      { id: 'p2', title: 'Sub-Millisecond Consensus in WAN Environments', journal: 'IEEE Symposium on Security & Privacy', year: '2021', doi: '10.1109/SP.2021.9812' }
    ],
    grants: [
      { id: 'g1', title: 'NSF CAREER: Resilient Cloud Consensus Architecture', agency: 'National Science Foundation', amount: '$550,000', year: '2022 - 2027' }
    ],
    teaching: [
      { id: 't1', course: 'CS 244B: Distributed Systems', institution: 'Stanford University', period: '2021 - Present' }
    ]
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    try {
      onShowToast('Rendering Academic CV PDF...');
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cv.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Academic_CV.pdf`);
      onShowToast('Downloaded Academic CV PDF!');
    } catch (e) {
      console.error(e);
      onShowToast('Failed to export PDF');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> Academic & Research Curriculum Vitae (CV) Builder
          </h2>
          <p className="text-xs text-slate-500">
            Full-density multi-page academic curriculum vitae generator with publications, grants, and teaching records.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" /> Export CV PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">1. Academic Credentials</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Full Name & Title</label>
              <input
                type="text"
                value={cv.fullName}
                onChange={(e) => setCv(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Academic Title</label>
              <input
                type="text"
                value={cv.degreeTitle}
                onChange={(e) => setCv(prev => ({ ...prev, degreeTitle: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Email</label>
              <input
                type="text"
                value={cv.email}
                onChange={(e) => setCv(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Affiliation / University</label>
              <input
                type="text"
                value={cv.institution}
                onChange={(e) => setCv(prev => ({ ...prev, institution: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Research Biography</label>
            <textarea
              value={cv.biography}
              onChange={(e) => setCv(prev => ({ ...prev, biography: e.target.value }))}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <hr className="border-slate-200 dark:border-slate-800 my-2" />

          {/* Publications Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Publications & Papers ({cv.publications.length})
              </h4>
              <button
                onClick={() => setCv(prev => ({
                  ...prev,
                  publications: [...prev.publications, { id: `p_${Date.now()}`, title: 'New Research Paper Title', journal: 'Journal Name', year: '2024' }]
                }))}
                className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Publication
              </button>
            </div>

            {cv.publications.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Paper #{idx + 1}</span>
                  <button
                    onClick={() => setCv(prev => ({ ...prev, publications: prev.publications.filter(x => x.id !== p.id) }))}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setCv(prev => ({ ...prev, publications: prev.publications.map(x => x.id === p.id ? { ...x, title: newTitle } : x) }));
                  }}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  placeholder="Paper Title"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Academic CV Preview */}
        <div ref={previewRef} className="p-8 bg-white text-slate-900 rounded-3xl shadow-lg border border-slate-200 space-y-6 text-xs font-serif leading-relaxed">
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">{cv.fullName}</h1>
            <p className="text-xs font-semibold text-slate-700 font-sans">{cv.degreeTitle}</p>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">{cv.institution} • {cv.email} • {cv.phone}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Research Profile
            </h2>
            <p className="text-slate-700 leading-normal">{cv.biography}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Education & Academic Background
            </h2>
            <div className="space-y-2">
              {cv.education.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{e.degree} — {e.institution}</span>
                    <span>{e.year}</span>
                  </div>
                  {e.thesisTitle && <p className="italic text-slate-600">Thesis: "{e.thesisTitle}"</p>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Peer-Reviewed Publications
            </h2>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-800">
              {cv.publications.map((p) => (
                <li key={p.id}>
                  <span className="font-semibold">"{p.title}."</span> <em>{p.journal}</em> ({p.year}). {p.doi && <span className="text-[10px] text-slate-500 font-mono">DOI: {p.doi}</span>}
                </li>
              ))}
            </ol>
          </div>

          {cv.grants.length > 0 && (
            <div>
              <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Research Grants & Fellowships
              </h2>
              <div className="space-y-1 text-slate-800">
                {cv.grants.map((g) => (
                  <div key={g.id} className="flex justify-between">
                    <span><strong>{g.title}</strong> — {g.agency} ({g.amount})</span>
                    <span>{g.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
