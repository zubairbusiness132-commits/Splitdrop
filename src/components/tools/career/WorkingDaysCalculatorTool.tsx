import React, { useState } from 'react';
import { Calendar, Check, Clock } from 'lucide-react';

export const WorkingDaysCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [includeSaturday, setIncludeSaturday] = useState<boolean>(false); // 5-day week default
  const [holidaysCount, setHolidaysCount] = useState<number>(10);

  const start = new Date(startDate);
  const end = new Date(endDate);

  let workingDays = 0;
  let totalCalendarDays = 0;

  if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
    const cur = new Date(start);
    while (cur <= end) {
      totalCalendarDays++;
      const dayOfWeek = cur.getDay(); // 0 = Sun, 6 = Sat
      if (dayOfWeek !== 0 && (includeSaturday || dayOfWeek !== 6)) {
        workingDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  const netWorkingDays = Math.max(0, workingDays - holidaysCount);
  const workingHours = netWorkingDays * 8;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" /> Working Days & Business Hours Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculate net working business days between two dates excluding weekends and public holidays.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl text-center space-y-2 border-indigo-500/30">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Net Business Working Days</span>
        <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {netWorkingDays} Working Days
        </div>
        <p className="text-xs text-slate-400">({workingHours.toLocaleString()} Billable Business Hours @ 8 hrs/day)</p>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Public Holidays Count to Subtract</label>
            <input
              type="number"
              value={holidaysCount}
              onChange={(e) => setHolidaysCount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-4 sm:pt-0">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={includeSaturday}
                onChange={(e) => setIncludeSaturday(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600"
              />
              <span>6-Day Work Week (Include Saturdays)</span>
            </label>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Calendar Days:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{totalCalendarDays} Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Gross Working Days (before holidays):</span>
            <span className="font-semibold text-slate-900 dark:text-white">{workingDays} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
