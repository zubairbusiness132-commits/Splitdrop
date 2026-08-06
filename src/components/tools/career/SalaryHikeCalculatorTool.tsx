import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export const SalaryHikeCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [currentCtc, setCurrentCtc] = useState<number>(80000);
  const [offeredCtc, setOfferedCtc] = useState<number>(115000);

  const absoluteIncrease = Math.max(0, offeredCtc - currentCtc);
  const percentageHike = currentCtc > 0 ? ((absoluteIncrease / currentCtc) * 100).toFixed(1) : '0';

  const currentMonthly = Math.round(currentCtc / 12);
  const offeredMonthly = Math.round(offeredCtc / 12);
  const monthlyDifference = offeredMonthly - currentMonthly;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" /> Salary Hike Percentage Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculate your exact percentage raise, absolute annual increase, and monthly take-home bump.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl text-center space-y-2 border-emerald-500/30">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Salary Hike Percentage</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white">
          +{percentageHike}% Hike
        </div>
        <p className="text-xs text-slate-400">+${absoluteIncrease.toLocaleString()} Annual Increase</p>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Current Annual Compensation (CTC)</label>
            <input
              type="number"
              value={currentCtc}
              onChange={(e) => setCurrentCtc(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">New Offered Annual Compensation (CTC)</label>
            <input
              type="number"
              value={offeredCtc}
              onChange={(e) => setOfferedCtc(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-500">Current Monthly Gross:</span>
            <span className="text-slate-900 dark:text-white">${currentMonthly.toLocaleString()} / mo</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-slate-500">New Offered Monthly Gross:</span>
            <span className="text-slate-900 dark:text-white">${offeredMonthly.toLocaleString()} / mo</span>
          </div>
          <hr className="border-slate-200 dark:border-slate-800 my-1" />
          <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
            <span>Monthly Increment Difference:</span>
            <span>+${monthlyDifference.toLocaleString()} / mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
