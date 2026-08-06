import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Key, ShieldCheck } from 'lucide-react';

interface RandomPasswordGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const RandomPasswordGeneratorTool: React.FC<RandomPasswordGeneratorToolProps> = ({ onShowToast }) => {
  const [length, setLength] = useState<number>(16);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const generatePassword = () => {
    let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
      lowercaseChars = lowercaseChars.replace(/[l]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
    }

    let allowedChars = '';
    if (useUppercase) allowedChars += uppercaseChars;
    if (useLowercase) allowedChars += lowercaseChars;
    if (useNumbers) allowedChars += numberChars;
    if (useSymbols) allowedChars += symbolChars;

    if (!allowedChars) {
      onShowToast('Select at least one character set!');
      return;
    }

    let pass = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      pass += allowedChars[array[i] % allowedChars.length];
    }

    setPassword(pass);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar]);

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;
    if (useUppercase) score++;
    if (useLowercase) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', pct: '25%' };
    if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', pct: '50%' };
    if (score <= 5) return { label: 'Strong', color: 'bg-emerald-500', pct: '75%' };
    return { label: 'Very Strong', color: 'bg-indigo-500', pct: '100%' };
  };

  const strength = getStrength();

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    onShowToast('Password copied to clipboard!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔑</span> Random Password Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate strong, cryptographically secure random passwords instantly in your browser.
          </p>
        </div>

        <button
          onClick={copyPassword}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Copy className="w-4 h-4" /> Copy Password
        </button>
      </div>

      {/* Main Password Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Generated Password
          </span>
          <button
            onClick={generatePassword}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xl sm:text-2xl font-bold tracking-wider break-all flex items-center justify-between gap-3">
          <span>{password}</span>
          <button onClick={copyPassword} className="p-2 text-slate-400 hover:text-white transition-colors shrink-0">
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Strength Meter */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Security Strength:</span>
            <span className="text-slate-900 dark:text-white">{strength.label}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.pct }} />
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Password Length
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Length</span>
              <span>{length} Characters</span>
            </div>
            <input
              type="range" min="6" max="64" value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Character Sets
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useUppercase} onChange={e => setUseUppercase(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span>Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useLowercase} onChange={e => setUseLowercase(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span>Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span>Symbols (!@#$)</span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span>Exclude Similar Chars (1, l, I, 0, O)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
