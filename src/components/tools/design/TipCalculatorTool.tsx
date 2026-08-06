import React, { useState } from 'react';
import { Users, DollarSign, Utensils } from 'lucide-react';

interface TipCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const TipCalculatorTool: React.FC<TipCalculatorToolProps> = ({ onShowToast }) => {
  const [billAmount, setBillAmount] = useState<number>(85);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(3);

  const tipAmount = (billAmount * tipPercent) / 100;
  const totalAmount = billAmount + tipAmount;
  const perPersonTotal = totalAmount / (peopleCount || 1);
  const perPersonTip = tipAmount / (peopleCount || 1);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🍽️</span> Restaurant Tip & Split Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate tip amounts and split bill totals evenly among friends or group members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Bill Amount ($)</label>
            <input
              type="number" value={billAmount} onChange={e => setBillAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Tip Percentage</span>
              <span>{tipPercent}%</span>
            </div>
            <div className="flex gap-2">
              {[10, 15, 18, 20, 25].map(pct => (
                <button
                  key={pct}
                  onClick={() => setTipPercent(pct)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    tipPercent === pct
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range" min="0" max="50" value={tipPercent}
              onChange={e => setTipPercent(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Number of People</span>
              <span>{peopleCount} People</span>
            </div>
            <input
              type="range" min="1" max="20" value={peopleCount}
              onChange={e => setPeopleCount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="glass-card p-6 rounded-3xl space-y-6 flex flex-col justify-between bg-gradient-to-tr from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Total Per Person
            </span>
            <div className="text-5xl font-black text-slate-900 dark:text-white mt-1">
              ${perPersonTotal.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Tip per person: ${perPersonTip.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Tip</div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                ${tipAmount.toFixed(2)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Bill + Tip</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
