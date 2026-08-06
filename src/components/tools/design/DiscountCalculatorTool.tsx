import React, { useState } from 'react';
import { Tag, Sparkles } from 'lucide-react';

interface DiscountCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const DiscountCalculatorTool: React.FC<DiscountCalculatorToolProps> = ({ onShowToast }) => {
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [taxPercent, setTaxPercent] = useState<number>(8);

  const discountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterDiscount = originalPrice - discountAmount;
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏷️</span> Shopping Discount Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate final sale price, discount savings & total tax payable instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-indigo-500" /> Price & Discount Inputs
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Original Price ($)</label>
            <input
              type="number" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Discount Percentage (%)</span>
              <span>{discountPercent}% OFF</span>
            </div>
            <div className="flex gap-2">
              {[10, 15, 20, 25, 30, 50].map(pct => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    discountPercent === pct
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range" min="0" max="90" value={discountPercent}
              onChange={e => setDiscountPercent(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Sales Tax Rate (%)</span>
              <span>{taxPercent}%</span>
            </div>
            <input
              type="number" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="glass-card p-6 rounded-3xl space-y-6 flex flex-col justify-between bg-gradient-to-tr from-emerald-600/10 to-indigo-600/10 border-emerald-500/30">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Final Pay Amount
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 font-bold text-xs">
                Saved ${discountAmount.toFixed(2)} ({discountPercent}%)
              </span>
            </div>
            <div className="text-5xl font-black text-slate-900 dark:text-white mt-2">
              ${finalPrice.toFixed(2)}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Original Price:</span>
              <span className="font-mono line-through text-slate-400">${originalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Discount Savings:</span>
              <span className="font-mono">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sales Tax ({taxPercent}%):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">+${taxAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
