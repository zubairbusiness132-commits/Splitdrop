import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  date: string;
}

interface ExpenseTrackerToolProps {
  onShowToast: (message: string) => void;
}

export const ExpenseTrackerTool: React.FC<ExpenseTrackerToolProps> = ({ onShowToast }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-transactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', type: 'income', amount: 3500, category: 'Salary', note: 'Monthly Pay', date: new Date().toISOString().split('T')[0] },
      { id: '2', type: 'expense', amount: 120, category: 'Groceries', note: 'Weekly produce', date: new Date().toISOString().split('T')[0] }
    ];
  });

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      onShowToast('Enter a valid amount.');
      return;
    }

    const item: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parsedAmt,
      category,
      note: note.trim() || category,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([item, ...transactions]);
    setAmount('');
    setNote('');
    onShowToast(`Added $${parsedAmt} ${type}`);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    onShowToast('Transaction removed.');
  };

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const exportCSV = () => {
    if (transactions.length === 0) return;
    const header = 'Type,Amount,Category,Note,Date\n';
    const rows = transactions
      .map((t) => `${t.type},${t.amount},"${t.category}","${t.note}",${t.date}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported CSV report!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💰</span> Income & Expense Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track personal cash flow, log income and expenses, and export CSV reports locally.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Balance</span>
          <p className={`text-xl font-black mt-1 ${netBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            ${netBalance.toFixed(2)}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Total Income
          </span>
          <p className="text-xl font-black text-emerald-500 mt-1">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Total Expenses
          </span>
          <p className="text-xl font-black text-rose-500 mt-1">${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={addTransaction} className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1 max-w-xs">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-500'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-500'
            }`}
          >
            Income
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="General">General</option>
            <option value="Salary">Salary</option>
            <option value="Food">Food / Groceries</option>
            <option value="Rent">Rent / Housing</option>
            <option value="Bills">Bills & Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
          </select>

          <input
            type="text"
            placeholder="Note / Description"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Log Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="space-y-2">
        {transactions.map((t) => (
          <div key={t.id} className="glass-card p-4 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">{t.note}</span>
              <span className="text-[10px] text-slate-400">
                {t.category} • {t.date}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteTransaction(t.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
