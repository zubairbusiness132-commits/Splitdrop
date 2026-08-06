import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Copy, Check } from 'lucide-react';

interface StopwatchToolProps {
  onShowToast: (message: string) => void;
}

export const StopwatchTool: React.FC<StopwatchToolProps> = ({ onShowToast }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (elapsedTime > 0) {
      setLaps([elapsedTime, ...laps]);
    }
  };

  const formatTime = (timeMs: number) => {
    const ms = Math.floor((timeMs % 1000) / 10);
    const secs = Math.floor((timeMs / 1000) % 60);
    const mins = Math.floor((timeMs / (1000 * 60)) % 60);
    const hrs = Math.floor(timeMs / (1000 * 60 * 60));

    const formattedMs = ms.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedHrs = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';

    return `${formattedHrs}${formattedMins}:${formattedSecs}.${formattedMs}`;
  };

  const copyResults = () => {
    if (laps.length === 0) return;
    const text = laps
      .map((lap, idx) => `Lap ${laps.length - idx}: ${formatTime(lap)}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Lap results copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⏱️</span> Millisecond Precision Stopwatch
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          High precision stopwatch with lap split recording and one-click export.
        </p>
      </div>

      {/* Stopwatch Display */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-8 flex flex-col items-center justify-center">
        <div className="font-mono text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-widest">
          {formatTime(elapsedTime)}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartPause}
            className={`w-14 h-14 rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Record Lap"
          >
            <Flag className="w-5 h-5" />
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Reset Stopwatch"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Recorded Laps ({laps.length})
            </h3>
            <button
              onClick={copyResults}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Laps'}
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {laps.map((lap, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs font-mono text-slate-900 dark:text-white"
              >
                <span className="font-bold text-slate-400">Lap {laps.length - idx}</span>
                <span className="font-bold tracking-wider">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
