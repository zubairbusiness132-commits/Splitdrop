import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Key, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface PasswordGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const PasswordGeneratorTool: React.FC<PasswordGeneratorToolProps> = ({ onShowToast }) => {
  const [length, setLength] = useState<number>(18);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [avoidSimilar, setAvoidSimilar] = useState<boolean>(true);
  const [excludeChars, setExcludeChars] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (avoidSimilar) {
      uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
      lowercaseChars = lowercaseChars.replace(/[il]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
    }

    if (excludeChars) {
      const charsToExclude = excludeChars.split('');
      charsToExclude.forEach((ch) => {
        const escapeRegExp = ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(escapeRegExp, 'g');
        uppercaseChars = uppercaseChars.replace(reg, '');
        lowercaseChars = lowercaseChars.replace(reg, '');
        numberChars = numberChars.replace(reg, '');
        symbolChars = symbolChars.replace(reg, '');
      });
    }

    let allowedChars = '';
    if (useUppercase) allowedChars += uppercaseChars;
    if (useLowercase) allowedChars += lowercaseChars;
    if (useNumbers) allowedChars += numberChars;
    if (useSymbols) allowedChars += symbolChars;

    if (!allowedChars) {
      onShowToast('Please select at least one character set!');
      return;
    }

    let pass = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      pass += allowedChars[array[i] % allowedChars.length];
    }

    setPassword(pass);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, avoidSimilar, excludeChars]);

  const getEntropyAndStrength = () => {
    if (!password) return { entropy: 0, label: 'Weak', color: 'bg-rose-500', pct: '10%' };
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    const entropy = Math.round(password.length * Math.log2(poolSize || 1));

    if (entropy < 40) return { entropy, label: 'Weak', color: 'bg-rose-500', pct: '25%' };
    if (entropy < 65) return { entropy, label: 'Medium', color: 'bg-amber-500', pct: '50%' };
    if (entropy < 90) return { entropy, label: 'Strong', color: 'bg-emerald-500', pct: '75%' };
    return { entropy, label: 'Very Strong', color: 'bg-indigo-500', pct: '100%' };
  };

  const { entropy, label, color, pct } = getEntropyAndStrength();

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    onShowToast('Password copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔐</span> Security Password Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate customized, cryptographically secure passwords locally in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generatePassword}
            className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate Again
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Password'}
          </button>
        </div>
      </div>

      {/* Main Password Box */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generated Password</span>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
            {length} characters • {entropy} bits entropy
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full py-4 px-5 pr-14 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 font-mono text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 select-all focus:outline-none tracking-wider"
          />
          <button
            onClick={handleCopy}
            className="absolute right-3 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            title="Copy Password"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Security Level:</span>
            <span className="text-slate-900 dark:text-white font-bold">{label}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${color}`} style={{ width: pct }} />
          </div>
        </div>
      </div>

      {/* Options Panel */}
      <div className="glass-card p-6 rounded-3xl space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Generator Options</h3>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Password Length</span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
              {length}
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Checkbox Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={(e) => setUseLowercase(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Special Symbols (!@#$...)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={avoidSimilar}
              onChange={(e) => setAvoidSimilar(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Avoid Similar (i, l, 1, L, o, 0, O)</span>
          </label>
        </div>

        {/* Exclude Custom Chars Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exclude Specific Characters</label>
          <input
            type="text"
            placeholder="e.g. @#$"
            value={excludeChars}
            onChange={(e) => setExcludeChars(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
