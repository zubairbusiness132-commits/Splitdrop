import React, { useState } from 'react';
import { Wallet, PieChart, DollarSign } from 'lucide-react';

export const CtcCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [grossCtc, setGrossCtc] = useState<number>(120000);
  const [basicPct, setBasicPct] = useState<number>(50); // 50% Basic
  const [hraPct, setHraPct] = useState<number>(20); // 20% HRA
  const [pfPct, setPfPct] = useState<number>(12); // 12% PF

  const basicAnnual = Math.round(grossCtc * (basicPct / 100));
  const hraAnnual = Math.round(grossCtc * (hraPct / 100));
  const pfAnnual = Math.round(basicAnnual * (pfPct / 100));
  const gratuityAnnual = Math.round(basicAnnual * 0.0481); // standard gratuity
  const specialAllowanceAnnual = Math.max(0, grossCtc - basicAnnual - hraAnnual - pfAnnual - gratuityAnnual);

  const netAnnualTakeHome = basicAnnual + hraAnnual + specialAllowanceAnnual - pfAnnual;
  const netMonthlyInHand = Math.round(netAnnualTakeHome / 12);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-600" /> CTC to In-Hand Salary Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculate net monthly take-home salary after PF, Gratuity, and Allowance deductions.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl text-center space-y-2 border-indigo-500/30">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Estimated Monthly In-Hand Take-Home</span>
        <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          ${netMonthlyInHand.toLocaleString()} <span className="text-sm font-semibold text-slate-400">/ month</span>
        </div>
        <p className="text-xs text-slate-400">(${(netMonthlyInHand * 12).toLocaleString()} Estimated Net Annual)</p>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-500 mb-1">Total Annual Package (CTC)</label>
          <input
            type="number"
            value={grossCtc}
            onChange={(e) => setGrossCtc(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Payslip Component Breakdown</h3>
          <div className="flex justify-between">
            <span className="text-slate-500">Basic Salary (50%):</span>
            <span className="font-semibold text-slate-900 dark:text-white">${Math.round(basicAnnual / 12).toLocaleString()} / mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">House Rent Allowance (HRA):</span>
            <span className="font-semibold text-slate-900 dark:text-white">${Math.round(hraAnnual / 12).toLocaleString()} / mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Special Allowances:</span>
            <span className="font-semibold text-slate-900 dark:text-white">${Math.round(specialAllowanceAnnual / 12).toLocaleString()} / mo</span>
          </div>
          <div className="flex justify-between text-rose-500">
            <span>Provident Fund (PF Deduction):</span>
            <span className="font-semibold">-${Math.round(pfAnnual / 12).toLocaleString()} / mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
