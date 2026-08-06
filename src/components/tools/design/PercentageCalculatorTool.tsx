import React, { useState } from 'react';
import { Percent } from 'lucide-react';

interface PercentageCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const PercentageCalculatorTool: React.FC<PercentageCalculatorToolProps> = ({ onShowToast }) => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<string>('15');
  const [m1Y, setM1Y] = useState<string>('200');

  // Mode 2: X is what percentage of Y?
  const [m2X, setM2X] = useState<string>('30');
  const [m2Y, setM2Y] = useState<string>('200');

  // Mode 3: Percentage Increase/Decrease from X to Y
  const [m3X, setM3X] = useState<string>('100');
  const [m3Y, setM3Y] = useState<string>('150');

  // Mode 4: Percentage Difference between X and Y
  const [m4X, setM4X] = useState<string>('80');
  const [m4Y, setM4Y] = useState<string>('100');

  // Calculations
  const res1 = (parseFloat(m1X) / 100) * parseFloat(m1Y);
  const res2 = (parseFloat(m2X) / parseFloat(m2Y)) * 100;

  const m3Diff = parseFloat(m3Y) - parseFloat(m3X);
  const res3 = (m3Diff / parseFloat(m3X)) * 100;

  const m4Avg = (parseFloat(m4X) + parseFloat(m4Y)) / 2;
  const res4 = (Math.abs(parseFloat(m4X) - parseFloat(m4Y)) / m4Avg) * 100;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>%</span> Percentage Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate percentage amounts, proportions, increases, decreases & differences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1 */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-indigo-500" /> What is X% of Y?
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="number" value={m1X} onChange={e => setM1X(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <span className="text-xs font-bold text-slate-500">% of</span>
            <input
              type="number" value={m1Y} onChange={e => setM1Y(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <span className="text-xs font-bold text-slate-500">=</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900">
            <div className="text-[10px] font-bold text-indigo-500 uppercase">Result</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {Number.isFinite(res1) ? res1.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'}
            </div>
          </div>
        </div>

        {/* Mode 2 */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-purple-500" /> X is what % of Y?
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="number" value={m2X} onChange={e => setM2X(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <span className="text-xs font-bold text-slate-500">is what % of</span>
            <input
              type="number" value={m2Y} onChange={e => setM2Y(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900">
            <div className="text-[10px] font-bold text-purple-500 uppercase">Result</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {Number.isFinite(res2) ? `${res2.toFixed(2)}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Mode 3 */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-emerald-500" /> % Increase / Decrease
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">From</span>
            <input
              type="number" value={m3X} onChange={e => setM3X(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <span className="text-xs font-bold text-slate-500">to</span>
            <input
              type="number" value={m3Y} onChange={e => setM3Y(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900">
            <div className="text-[10px] font-bold text-emerald-500 uppercase">
              {res3 >= 0 ? 'Percentage Increase' : 'Percentage Decrease'}
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {Number.isFinite(res3) ? `${res3 > 0 ? '+' : ''}${res3.toFixed(2)}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Mode 4 */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-amber-500" /> % Difference Between
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="number" value={m4X} onChange={e => setM4X(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <span className="text-xs font-bold text-slate-500">and</span>
            <input
              type="number" value={m4Y} onChange={e => setM4Y(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900">
            <div className="text-[10px] font-bold text-amber-500 uppercase">Difference</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {Number.isFinite(res4) ? `${res4.toFixed(2)}%` : '0%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
