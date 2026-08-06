import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, Play, Pause, RefreshCw } from 'lucide-react';

export const UnixTimestampConverterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [currentNow, setCurrentNow] = useState<number>(Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState<boolean>(true);

  // Convert Unix -> Date state
  const [unixInput, setUnixInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [isMs, setIsMs] = useState<boolean>(false);

  // Convert Date -> Unix state
  const [dateInput, setDateInput] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live timer
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Compute Unix -> Date output
  const getUnixToDateResult = () => {
    if (!unixInput.trim()) return null;
    const num = Number(unixInput);
    if (isNaN(num)) return { error: 'Invalid numeric timestamp' };

    const msTimestamp = isMs ? num : num * 1000;
    const dateObj = new Date(msTimestamp);

    if (isNaN(dateObj.getTime())) return { error: 'Timestamp out of range' };

    return {
      iso: dateObj.toISOString(),
      utc: dateObj.toUTCString(),
      local: dateObj.toLocaleString(),
      dateOnly: dateObj.toLocaleDateString(),
      timeOnly: dateObj.toLocaleTimeString(),
      seconds: Math.floor(msTimestamp / 1000),
      milliseconds: msTimestamp
    };
  };

  // Compute Date -> Unix output
  const getDateToUnixResult = () => {
    if (!dateInput) return null;
    const dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) return { error: 'Invalid date selection' };

    const ms = dateObj.getTime();
    return {
      seconds: Math.floor(ms / 1000),
      milliseconds: ms,
      utc: dateObj.toUTCString(),
      local: dateObj.toLocaleString()
    };
  };

  const unixResult = getUnixToDateResult();
  const dateResult = getDateToUnixResult();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    onShowToast(`Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Unix Timestamp Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert epoch timestamps (seconds & milliseconds) to human readable UTC/Local dates and vice versa.
          </p>
        </div>
      </div>

      {/* Live Current Epoch Clock Header */}
      <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Current Unix Epoch Time
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                {currentNow}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ({new Date(currentNow * 1000).toLocaleTimeString()})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            {isLive ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
            {isLive ? 'Pause Clock' : 'Resume Clock'}
          </button>

          <button
            onClick={() => {
              setUnixInput(currentNow.toString());
              setIsMs(false);
              onShowToast('Loaded current timestamp');
            }}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Use Current
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Unix -> Date */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Unix Epoch → Date
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold">
              <label className="cursor-pointer flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <input
                  type="radio"
                  name="unit"
                  checked={!isMs}
                  onChange={() => setIsMs(false)}
                  className="text-indigo-600"
                />
                Seconds
              </label>
              <label className="cursor-pointer flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <input
                  type="radio"
                  name="unit"
                  checked={isMs}
                  onChange={() => setIsMs(true)}
                  className="text-indigo-600"
                />
                Milliseconds
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Enter Unix Timestamp
            </label>
            <input
              type="text"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="e.g. 1718000000"
              className="w-full p-3 text-sm font-mono rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {unixResult && ('error' in unixResult ? (
            <p className="text-xs text-rose-500 font-bold">{unixResult.error}</p>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Local Time</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{unixResult.local}</span>
                  <button
                    onClick={() => handleCopy(unixResult.local, 'Local Time')}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                  >
                    {copiedKey === 'Local Time' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">UTC Time (GMT)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">{unixResult.utc}</span>
                  <button
                    onClick={() => handleCopy(unixResult.utc, 'UTC Time')}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                  >
                    {copiedKey === 'UTC Time' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">ISO 8601 Format</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">{unixResult.iso}</span>
                  <button
                    onClick={() => handleCopy(unixResult.iso, 'ISO 8601 String')}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                  >
                    {copiedKey === 'ISO 8601 String' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Date -> Unix */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Date & Time → Unix Epoch
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full p-3 text-sm font-mono rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {dateResult && ('error' in dateResult ? (
            <p className="text-xs text-rose-500 font-bold">{dateResult.error}</p>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Unix Timestamp (Seconds)</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{dateResult.seconds}</span>
                  <button
                    onClick={() => handleCopy(dateResult.seconds.toString(), 'Unix Seconds')}
                    className="px-2.5 py-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
                  >
                    {copiedKey === 'Unix Seconds' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Unix Timestamp (Milliseconds)</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black text-purple-600 dark:text-purple-400">{dateResult.milliseconds}</span>
                  <button
                    onClick={() => handleCopy(dateResult.milliseconds.toString(), 'Unix Milliseconds')}
                    className="px-2.5 py-1 text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100 cursor-pointer flex items-center gap-1"
                  >
                    {copiedKey === 'Unix Milliseconds' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
