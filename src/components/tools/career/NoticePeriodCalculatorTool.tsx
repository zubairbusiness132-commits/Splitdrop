import React, { useState } from 'react';
import { Calendar, DollarSign, Clock } from 'lucide-react';

export const NoticePeriodCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [resignationDate, setResignationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [noticeDays, setNoticeDays] = useState<number>(60); // Default 60 days
  const [monthlySalary, setMonthlySalary] = useState<number>(100000);
  const [buyoutDays, setBuyoutDays] = useState<number>(15);

  // Calculate Last Working Day
  const resign = new Date(resignationDate);
  const lastWorkingDay = new Date(resign);
  lastWorkingDay.setDate(lastWorkingDay.getDate() + noticeDays);

  const formattedLwd = isNaN(lastWorkingDay.getTime()) ? 'Invalid Date' : lastWorkingDay.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const perDaySalary = monthlySalary / 30;
  const estimatedBuyoutAmount = Math.round(perDaySalary * buyoutDays);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" /> Notice Period & LWD Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculate your exact last working day (LWD) and notice buyout cost estimation.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl text-center space-y-2 border-indigo-500/30">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Estimated Last Working Day (LWD)</span>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {formattedLwd}
        </div>
        <p className="text-xs text-slate-400">Based on {noticeDays} Days Notice Period</p>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Resignation Submission Date</label>
            <input
              type="date"
              value={resignationDate}
              onChange={(e) => setResignationDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Notice Period (Days)</label>
            <select
              value={noticeDays}
              onChange={(e) => setNoticeDays(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value={15}>15 Days</option>
              <option value={30}>30 Days (1 Month)</option>
              <option value={45}>45 Days</option>
              <option value={60}>60 Days (2 Months)</option>
              <option value={90}>90 Days (3 Months)</option>
            </select>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800 my-2" />

        <h3 className="font-bold text-slate-900 dark:text-white">Notice Buyout Estimation</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Gross Monthly In-Hand Salary</label>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Days to Buy Out</label>
            <input
              type="number"
              value={buyoutDays}
              onChange={(e) => setBuyoutDays(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-200 flex justify-between items-center font-bold">
          <span>Estimated Notice Buyout Value:</span>
          <span className="text-base text-indigo-600 dark:text-indigo-400">${estimatedBuyoutAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
