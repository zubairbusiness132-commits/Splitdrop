import React, { useState } from 'react';
import { DollarSign, ArrowLeftRight, Settings } from 'lucide-react';

interface CurrencyCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const DEFAULT_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.2,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 155.5,
  CHF: 0.91,
  SGD: 1.35
};

export const CurrencyCalculatorTool: React.FC<CurrencyCalculatorToolProps> = ({ onShowToast }) => {
  const [rates, setRates] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('splitdrop_custom_rates');
      return saved ? JSON.parse(saved) : DEFAULT_RATES;
    } catch {
      return DEFAULT_RATES;
    }
  });

  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('EUR');

  const [showRateSettings, setShowRateSettings] = useState<boolean>(false);

  const convert = () => {
    const fromRate = rates[fromCurr] || 1;
    const toRate = rates[toCurr] || 1;
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const updateRate = (curr: string, val: number) => {
    const updated = { ...rates, [curr]: val };
    setRates(updated);
    try {
      localStorage.setItem('splitdrop_custom_rates', JSON.stringify(updated));
    } catch {}
    onShowToast(`Updated ${curr} exchange rate`);
  };

  const swapCurrencies = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const result = convert();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💱</span> Manual Currency Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fast offline currency converter with customizable exchange rates.
          </p>
        </div>

        <button
          onClick={() => setShowRateSettings(!showRateSettings)}
          className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <Settings className="w-4 h-4" /> {showRateSettings ? 'Hide Exchange Rates' : 'Edit Exchange Rates'}
        </button>
      </div>

      {/* Main Conversion Cards */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Amount & Currency</label>
            <input
              type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-slate-900 dark:text-white"
            />
            <select
              value={fromCurr} onChange={e => setFromCurr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {Object.keys(rates).map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Converted Amount</label>
            <div className="w-full px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurr}
            </div>
            <select
              value={toCurr} onChange={e => setToCurr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {Object.keys(rates).map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customizable Exchange Rate Table */}
      {showRateSettings && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Custom Exchange Rates (1 USD = X Currency)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(rates).map(([curr, rate]) => (
              <div key={curr} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">{curr}</label>
                <input
                  type="number" step="0.01" value={rate}
                  onChange={e => updateRate(curr, Number(e.target.value))}
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border text-xs font-mono font-bold"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
