import React, { useState } from 'react';
import { Calendar, Clock, Gift } from 'lucide-react';

interface AgeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const AgeCalculatorTool: React.FC<AgeCalculatorToolProps> = ({ onShowToast }) => {
  const [dob, setDob] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const calculateAge = () => {
    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next Birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfWeek = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      daysToNextBday,
      dayOfWeek
    };
  };

  const result = calculateAge();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎂</span> Exact Age Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate exact age in years, months, days, total hours & next birthday countdown.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Inputs */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" /> Select Dates
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Age At Date (Target Date)</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Main Result Banner */}
        {result ? (
          <div className="glass-card p-6 rounded-3xl space-y-4 bg-gradient-to-tr from-indigo-600/10 to-purple-600/10 border-indigo-500/30 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Exact Age Result
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
                {result.years} <span className="text-lg font-bold text-slate-500">Years</span> {result.months} <span className="text-lg font-bold text-slate-500">Months</span> {result.days} <span className="text-lg font-bold text-slate-500">Days</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <Gift className="w-8 h-8 text-pink-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Next Birthday in {result.daysToNextBday} days!
                </div>
                <div className="text-[11px] text-slate-500">
                  Will fall on a {result.dayOfWeek}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 rounded-3xl flex items-center justify-center text-xs text-rose-500 font-bold">
            Please enter a valid Date of Birth before Target Date.
          </div>
        )}
      </div>

      {/* Breakdown Stats Grid */}
      {result && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-500" /> Total Lived Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Months</div>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                {result.totalMonths.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Weeks</div>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                {result.totalWeeks.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Days</div>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                {result.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Hours</div>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                {result.totalHours.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Minutes</div>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                {result.totalMinutes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
