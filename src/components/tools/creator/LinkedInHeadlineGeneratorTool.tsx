import React, { useState } from 'react';
import { Copy, Check, Linkedin, Briefcase, Award, Sparkles } from 'lucide-react';

const LINKEDIN_ROLES = [
  'Developer', 'Designer', 'Student', 'HR', 'Marketing', 
  'Sales', 'AI Engineer', 'Teacher', 'Doctor', 'Business'
] as const;

type LinkedInRole = typeof LINKEDIN_ROLES[number];

export const LinkedInHeadlineGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [role, setRole] = useState<LinkedInRole>('Developer');
  const [skills, setSkills] = useState('React, TypeScript, Cloud Architecture');
  const [company, setCompany] = useState('Google');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateHeadlines = (): string[] => {
    const rawSkills = skills.trim() || 'Software Systems';
    const rawCompany = company.trim() || 'Tech Lead';

    const database: Record<LinkedInRole, string[]> = {
      Developer: [
        `Senior Full Stack Developer | Specialist in ${rawSkills} | Ex-${rawCompany} | Building scalable cloud applications`,
        `Software Engineer @ ${rawCompany} 🚀 | ${rawSkills} | Passionate about high-performance architecture & open source`,
        `Full Stack Developer | Helping startups launch 10x faster with ${rawSkills} | Tech Speaker & Content Creator`
      ],
      Designer: [
        `Lead Product Designer @ ${rawCompany} ✨ | UX/UI Specialist | ${rawSkills} | Crafting intuitive user journeys`,
        `Senior UI/UX Designer | ${rawSkills} | Transforming complex ideas into pixel-perfect digital experiences`,
        `Product Designer & Design Systems Lead | Specializing in ${rawSkills} | Design Mentor & Advisor`
      ],
      Student: [
        `Computer Science Student @ Top University | Aspiring ${role} | Experienced in ${rawSkills} | Seeking 2026 Internships`,
        `Future Tech Leader & Developer | CS Major | Hands-on experience with ${rawSkills} | Open to software roles`
      ],
      HR: [
        `Talent Acquisition Specialist @ ${rawCompany} 🤝 | Scaling high-growth tech teams | ${rawSkills} | Hiring top talent!`,
        `People & Culture Manager | Driving employee engagement & talent strategy | ${rawSkills} | We are hiring!`
      ],
      Marketing: [
        `Growth Marketing Lead @ ${rawCompany} 📈 | ${rawSkills} | Scaling B2B SaaS revenue through data-driven campaigns`,
        `Digital Marketing Specialist | Specialist in ${rawSkills} | Helping brands generate 7-figure revenue pipelines`
      ],
      Sales: [
        `Account Executive @ ${rawCompany} 💼 | B2B Enterprise Sales | Exceeding 150% quota targets | ${rawSkills}`,
        `Sales Development Director | Helping companies accelerate revenue growth with ${rawSkills} | Consultative Sales Specialist`
      ],
      'AI Engineer': [
        `AI / ML Research Engineer @ ${rawCompany} 🤖 | LLMs, Generative AI & ${rawSkills} | Building the next-gen AI applications`,
        `Senior Machine Learning Specialist | Architecting production ML pipelines with ${rawSkills} | AI Speaker`
      ],
      Teacher: [
        `Educator & Curriculum Developer | Empowering students through STEM & ${rawSkills} | Ex-${rawCompany} Advisor`,
        `Professor & Learning Facilitator | Specializing in ${rawSkills} | Innovative Pedagogy & E-Learning Leader`
      ],
      Doctor: [
        `Consultant Physician | Passionate about Healthcare Tech, Clinical Research & ${rawSkills} | Ex-${rawCompany}`,
        `Medical Practitioner & Healthcare Innovator | Combining Clinical Excellence with Digital Health (${rawSkills})`
      ],
      Business: [
        `Founder & CEO @ ${rawCompany} 🚀 | Building scalable products | Specializing in ${rawSkills} | Angel Investor`,
        `Business Strategist & Management Consultant | Helping Fortune 500 companies optimize operations & ${rawSkills}`
      ]
    };

    return database[role] || database['Developer'];
  };

  const headlines = generateHeadlines();

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    onShowToast('LinkedIn headline copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            LinkedIn Headline Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate keyword-optimized, high-converting professional headlines tailored for 10 career paths.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role / Career Path</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as LinkedInRole)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {LINKEDIN_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Skills / Keywords</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, Cloud Architecture"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company / Organization</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Google, Microsoft, Startup Inc"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {LINKEDIN_ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === r
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Generated Headlines */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Generated LinkedIn Headline Formats ({role})
        </h3>

        <div className="space-y-3">
          {headlines.map((headlineText, idx) => {
            const len = headlineText.length;
            const isOver = len > 220; // LinkedIn limit

            return (
              <div
                key={idx}
                className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 hover:border-sky-500/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    Headline Formula #{idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {len} / 220 Chars {isOver ? '(Over Limit)' : '✓ Valid'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed font-sans">
                  {headlineText}
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleCopy(headlineText, idx)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIdx === idx ? 'Copied Headline!' : 'Copy Headline'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
