import React, { useState } from 'react';
import { Copy, Check, Linkedin, Download, FileText, Sparkles } from 'lucide-react';

export const LinkedInSummaryGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [name, setName] = useState('Sarah Jenkins');
  const [title, setTitle] = useState('Senior Full Stack Engineer');
  const [years, setYears] = useState('6+');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, AWS, System Design');
  const [achievements, setAchievements] = useState('Architected high-throughput microservices handling 10M+ daily requests, improved page speed load by 45%');
  const [contactEmail, setContactEmail] = useState('sarah.jenkins@example.com');
  const [copied, setCopied] = useState(false);

  const generateSummary = (): string => {
    return `👋 Hi there! I'm ${name}, a ${title} with ${years} years of professional experience building high-performance, scalable web applications.

🚀 WHAT I DO:
I specialize in converting complex business requirements into clean, maintainable codebases. My primary focus spans front-end architecture, backend microservices, and automated CI/CD cloud deployments.

💡 CORE COMPETENCIES & TECH STACK:
• Technical Skills: ${skills}
• Engineering Mindset: Clean Architecture, Performance Optimization, Agile / Scrum Methodology, Test-Driven Development

🏆 KEY HIGHLIGHTS & IMPACT:
• ${achievements}
• Led cross-functional engineering teams of 8+ developers to deliver enterprise software on time and within budget.

📫 LET'S CONNECT:
I'm always passionate about collaborating on innovative software projects, tech mentorship, or discussing modern web engineering. 
📩 Email: ${contactEmail}
💬 DM me here on LinkedIn!`;
  };

  const [customText, setCustomText] = useState(generateSummary());

  const handleUpdateTemplate = () => {
    setCustomText(generateSummary());
    onShowToast('Updated LinkedIn summary template!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    onShowToast('LinkedIn summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([customText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${name.toLowerCase().replace(/\s+/g, '_')}_linkedin_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('Downloaded LinkedIn Summary TXT!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            LinkedIn Summary Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate polished, structured LinkedIn About sections with key achievements, tech stack, and direct contact details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Professional Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Years of Experience</label>
          <input
            type="text"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skills & Technical Stack</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Email</label>
          <input
            type="text"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Career Highlight / Impact</label>
          <input
            type="text"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={handleUpdateTemplate}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Re-generate Summary Text
        </button>
      </div>

      {/* Editor & Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Generated LinkedIn About Summary (Editable)
          </label>
          <span className="text-[10px] font-bold text-slate-400">{customText.length} Characters</span>
        </div>

        <textarea
          rows={12}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
        />

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy LinkedIn Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
