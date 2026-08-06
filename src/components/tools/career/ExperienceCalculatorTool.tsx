import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Award } from 'lucide-react';

interface JobPeriod {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const ExperienceCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [jobs, setJobs] = useState<JobPeriod[]>([
    { id: 'j1', company: 'Acme Corp', role: 'Senior Developer', startDate: '2021-06-01', endDate: '', isCurrent: true },
    { id: 'j2', company: 'Global Tech', role: 'Software Engineer', startDate: '2018-01-15', endDate: '2021-05-30', isCurrent: false }
  ]);

  const addJob = () => {
    setJobs(prev => [
      ...prev,
      { id: `j_${Date.now()}`, company: 'Company Name', role: 'Role Title', startDate: '2016-01-01', endDate: '2017-12-31', isCurrent: false }
    ]);
  };

  const removeJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  // Calculate Total Experience
  let totalDays = 0;
  jobs.forEach(j => {
    const start = new Date(j.startDate);
    const end = j.isCurrent ? new Date() : new Date(j.endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diff = end.getTime() - start.getTime();
      if (diff > 0) {
        totalDays += Math.floor(diff / (1000 * 60 * 60 * 24));
      }
    }
  });

  const years = Math.floor(totalDays / 365.25);
  const remainingDaysAfterYears = totalDays % 365.25;
  const months = Math.floor(remainingDaysAfterYears / 30.4375);
  const days = Math.floor(remainingDaysAfterYears % 30.4375);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" /> Total Work Experience Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculate precise career experience across multiple jobs in years, months, and days.
        </p>
      </div>

      {/* Main Result Card */}
      <div className="glass-card p-6 rounded-3xl text-center space-y-2 border-indigo-500/30">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Total Work Experience</span>
        <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {years} Years, {months} Months, {days} Days
        </div>
        <p className="text-xs text-slate-400">({totalDays.toLocaleString()} Total Calendar Days)</p>
      </div>

      {/* Jobs Form */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Employment Timeline</h3>
          <button
            onClick={addJob}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Employment
          </button>
        </div>

        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={j.company}
                  onChange={(e) => {
                    const val = e.target.value;
                    setJobs(prev => prev.map(x => x.id === j.id ? { ...x, company: val } : x));
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={j.role}
                  onChange={(e) => {
                    const val = e.target.value;
                    setJobs(prev => prev.map(x => x.id === j.id ? { ...x, role: val } : x));
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Role Title"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Start Date</label>
                  <input
                    type="date"
                    value={j.startDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setJobs(prev => prev.map(x => x.id === j.id ? { ...x, startDate: val } : x));
                    }}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {!j.isCurrent && (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">End Date</label>
                    <input
                      type="date"
                      value={j.endDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJobs(prev => prev.map(x => x.id === j.id ? { ...x, endDate: val } : x));
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={j.isCurrent}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setJobs(prev => prev.map(x => x.id === j.id ? { ...x, isCurrent: val } : x));
                      }}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Present Role</span>
                  </label>

                  <button
                    onClick={() => removeJob(j.id)}
                    className="p-2 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
