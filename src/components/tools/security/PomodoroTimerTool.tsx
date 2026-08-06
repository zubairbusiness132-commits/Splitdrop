import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Volume2 } from 'lucide-react';

interface PomodoroTimerToolProps {
  onShowToast: (message: string) => void;
}

export const PomodoroTimerTool: React.FC<PomodoroTimerToolProps> = ({ onShowToast }) => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [initialDuration, setInitialDuration] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(25);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      playAlarmSound();
      onShowToast('🎉 Pomodoro Session Completed! Take a well-deserved break.');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    } catch {}
  };

  const setPreset = (mins: number) => {
    setIsRunning(false);
    const secs = mins * 60;
    setInitialDuration(secs);
    setTimeLeft(secs);
    setCustomMinutes(mins);
  };

  const handleCustomApply = () => {
    if (customMinutes < 1) return;
    setPreset(customMinutes);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = ((initialDuration - timeLeft) / initialDuration) * 100;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⏱️</span> Pomodoro Focus Timer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Boost productivity with 25, 30, 45, 50 minute timeboxing intervals and offline audio alerts.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {[25, 30, 45, 50].map((mins) => (
          <button
            key={mins}
            onClick={() => setPreset(mins)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              customMinutes === mins
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {mins} Min Focus
          </button>
        ))}

        <button
          onClick={() => setPreset(5)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
        >
          5 Min Break
        </button>

        <button
          onClick={() => setPreset(15)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all"
        >
          15 Min Long Break
        </button>
      </div>

      {/* Timer Display Circle */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-6 flex flex-col items-center justify-center">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-slate-200 dark:stroke-slate-800 fill-none"
              strokeWidth="10"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-indigo-600 dark:stroke-indigo-400 fill-none transition-all duration-1000"
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPct) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-widest">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">
              {isRunning ? 'Focusing...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg"
          >
            {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(initialDuration);
            }}
            className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Custom Duration input */}
      <div className="glass-card p-6 rounded-3xl space-y-3 max-w-sm mx-auto">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Custom Duration (Minutes)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            onClick={handleCustomApply}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            Set Custom
          </button>
        </div>
      </div>
    </div>
  );
};
