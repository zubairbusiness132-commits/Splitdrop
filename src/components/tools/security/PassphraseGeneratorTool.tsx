import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, KeyRound, Check } from 'lucide-react';

interface PassphraseGeneratorToolProps {
  onShowToast: (message: string) => void;
}

const WORD_LIST = [
  'correct', 'horse', 'battery', 'staple', 'rocket', 'galaxy', 'quantum', 'shield',
  'shadow', 'phoenix', 'dragon', 'falcon', 'thunder', 'crystal', 'anchor', 'bridge',
  'castle', 'desert', 'forest', 'island', 'jungle', 'kingdom', 'lantern', 'mountain',
  'ocean', 'planet', 'river', 'silver', 'sunset', 'timber', 'valley', 'volcano',
  'whisper', 'winter', 'beacon', 'breeze', 'canyon', 'harbor', 'summit', 'meadow',
  'orbit', 'cosmic', 'symphony', 'harmony', 'zenith', 'vortex', 'compass', 'frontier'
];

export const PassphraseGeneratorTool: React.FC<PassphraseGeneratorToolProps> = ({ onShowToast }) => {
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [capitalize, setCapitalize] = useState<boolean>(true);
  const [includeNumber, setIncludeNumber] = useState<boolean>(true);
  const [includeSymbol, setIncludeSymbol] = useState<boolean>(true);
  const [passphrase, setPassphrase] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassphrase = () => {
    const selectedWords: string[] = [];
    const array = new Uint32Array(wordCount + 2);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < wordCount; i++) {
      let word = WORD_LIST[array[i] % WORD_LIST.length];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      selectedWords.push(word);
    }

    if (includeNumber) {
      const randomNum = (array[wordCount] % 90) + 10;
      selectedWords.push(randomNum.toString());
    }

    if (includeSymbol) {
      const symbols = ['!', '@', '#', '$', '%', '&', '*'];
      const symbol = symbols[array[wordCount + 1] % symbols.length];
      selectedWords.push(symbol);
    }

    setPassphrase(selectedWords.join(separator));
    setCopied(false);
  };

  useEffect(() => {
    generatePassphrase();
  }, [wordCount, separator, capitalize, includeNumber, includeSymbol]);

  const handleCopy = () => {
    if (!passphrase) return;
    navigator.clipboard.writeText(passphrase);
    setCopied(true);
    onShowToast('Passphrase copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🗝️</span> Random Passphrase Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate easy-to-remember yet cryptographically secure diceware-style passphrases locally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generatePassphrase}
            className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate Again
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Passphrase'}
          </button>
        </div>
      </div>

      {/* Main Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Generated Passphrase</span>

        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={passphrase}
            className="w-full py-4 px-5 pr-14 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 font-mono text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 select-all focus:outline-none tracking-wider"
          />
          <button
            onClick={handleCopy}
            className="absolute right-3 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="glass-card p-6 rounded-3xl space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Passphrase Settings</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Word Count</span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
              {wordCount} Words
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Word Separator</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="-">Hyphen (-)</option>
              <option value=" ">Space ( )</option>
              <option value=".">Period (.)</option>
              <option value="_">Underscore (_)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end space-y-3">
            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={capitalize}
                onChange={(e) => setCapitalize(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Capitalize Words</span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumber}
                onChange={(e) => setIncludeNumber(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Include Numbers</span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbol}
                onChange={(e) => setIncludeSymbol(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Include Symbols</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
