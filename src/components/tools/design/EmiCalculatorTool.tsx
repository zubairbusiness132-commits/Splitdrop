import React, { useState } from 'react';
import { DollarSign, PieChart, Table } from 'lucide-react';

interface EmiCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const EmiCalculatorTool: React.FC<EmiCalculatorToolProps> = ({ onShowToast }) => {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(15);

  const calculateEmi = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total months

    if (p <= 0 || r <= 0 || n <= 0) return null;

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    // Amortization Schedule (Yearly)
    const schedule = [];
    let balance = p;
    let accumulatedInterest = 0;

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        const interestForMonth = balance * r;
        const principalForMonth = emi - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      if (balance < 0) balance = 0;
      accumulatedInterest += yearlyInterest;

      schedule.push({
        year: yr,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance
      });
    }

    return {
      emi,
      totalPayment,
      totalInterest,
      principalPct: (p / totalPayment) * 100,
      interestPct: (totalInterest / totalPayment) * 100,
      schedule
    };
  };

  const result = calculateEmi();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏦</span> Loan EMI Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate Equated Monthly Installment (EMI), total interest & amortization schedule.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Loan Controls */}
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Loan Parameters
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Loan Amount</span>
              <span>${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <input
              type="range" min="10000" max="1000000" step="5000" value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Annual Interest Rate (%)</span>
              <span>{interestRate}%</span>
            </div>
            <input
              type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <input
              type="range" min="1" max="25" step="0.1" value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Loan Tenure (Years)</span>
              <span>{tenureYears} Years</span>
            </div>
            <input
              type="number" value={tenureYears} onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
            <input
              type="range" min="1" max="30" value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Banner */}
        {result && (
          <div className="glass-card p-6 rounded-3xl space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Monthly EMI Amount
              </span>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1">
                ${Math.round(result.emi).toLocaleString()}
                <span className="text-xs font-semibold text-slate-500 block sm:inline sm:ml-2">/ month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50">
                <div className="text-[10px] font-bold text-indigo-600 uppercase">Total Interest Payable</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  ${Math.round(result.totalInterest).toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200/50">
                <div className="text-[10px] font-bold text-purple-600 uppercase">Total Amount Paid</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  ${Math.round(result.totalPayment).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Principal vs Interest Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-600">Principal ({result.principalPct.toFixed(1)}%)</span>
                <span className="text-purple-600">Interest ({result.interestPct.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${result.principalPct}%` }} className="bg-indigo-600 h-full" />
                <div style={{ width: `${result.interestPct}%` }} className="bg-purple-500 h-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Amortization Schedule Table */}
      {result && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Table className="w-4 h-4 text-indigo-500" /> Yearly Amortization Schedule
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Principal Paid</th>
                  <th className="py-3 px-4">Interest Paid</th>
                  <th className="py-3 px-4">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">${Math.round(row.principal).toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-purple-600 font-semibold">${Math.round(row.interest).toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">${Math.round(row.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
