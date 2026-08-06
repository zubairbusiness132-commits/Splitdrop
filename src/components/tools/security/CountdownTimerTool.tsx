import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Repeat } from 'lucide-react';

interface CountdownTimerToolProps {
  onShowToast: (message: string) => void;
}

export const CountdownTimerTool: React.FC<CountdownTimerToolProps> = ({ onShowToast }) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);

  const [totalSeconds, setTotalSeconds] = useState<number>(300);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const applyCustomTime = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) {
      onShowToast('Please set a duration greater than 0.');
      return;
    }
    setIsRunning(false);
    setTotalSeconds(total);
    setTimeLeft(total);
    onShowToast(`Timer set to ${hours}h ${minutes}m ${seconds}s.`);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playAlarm();
      onShowToast('⏰ Countdown finished!');
      if (repeat) {
        setTimeLeft(totalSeconds);
      } else {
        setIsRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, repeat, totalSeconds]);

  const playAlarm = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 600;
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {}
  };

  const formatDisplay = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⏲️</span> Custom Countdown Timer & Alarm
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configurable countdown timer with audio alarm alert and auto-repeat support.
        </p>
      </div>

      {/* Main Clock */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-6">
        <div className="font-mono text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-widest">
          {formatDisplay(timeLeft)}
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg"
          >
            {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(totalSeconds);
            }}
            className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setRepeat(!repeat)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              repeat
                ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
            }`}
            title="Toggle Repeat Mode"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Set Countdown Duration</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">HOURS</label>
            <input
              type="number"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">MINUTES</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">SECONDS</label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={applyCustomTime}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md"
        >
          Set Duration
        </button>
      </div>
    </div>
  );
};
