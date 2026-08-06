import React, { useState } from 'react';
import { Copy, Check, Link, ArrowLeftRight, Download, Trash2 } from 'lucide-react';

export const UrlEncoderDecoderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState('https://splitdrop.com/search?query=hello world&category=text tools#top');
  const [copied, setCopied] = useState(false);

  const encodeUrl = () => {
    try {
      return encodeURIComponent(inputText);
    } catch {
      return 'Error: Invalid input for URL encoding';
    }
  };

  const decodeUrl = () => {
    try {
      return decodeURIComponent(inputText);
    } catch {
      return 'Error: Invalid URI component for decoding';
    }
  };

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const outputText = mode === 'encode' ? encodeUrl() : decodeUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast(`Copied ${mode === 'encode' ? 'Encoded' : 'Decoded'} URL!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `url_${mode}d.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Link className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            URL Encoder / Decoder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Encode special characters into web-safe URL formats or decode percent-encoded (%20) links back to plain text.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 glass-card p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Encode URL (Plain → Web Safe)
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Decode URL (%20 → Plain)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Input URL / Text
            </label>
            <button
              onClick={() => { setInputText(''); onShowToast('Cleared input'); }}
              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter URL to encode or decode..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize">
              {mode}d URL Output
            </label>
            <textarea
              readOnly
              rows={10}
              value={outputText}
              placeholder="Output will appear here..."
              className="w-full p-4 text-xs font-mono break-all rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!outputText}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
