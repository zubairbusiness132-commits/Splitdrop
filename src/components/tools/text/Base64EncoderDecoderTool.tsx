import React, { useState } from 'react';
import { Copy, Check, Binary, Download, Trash2, Upload } from 'lucide-react';

export const Base64EncoderDecoderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState('SplitDrop Local Text Tools Suite 2026');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const encodeBase64 = () => {
    try {
      // Handle UTF-8 strings cleanly
      return btoa(
        encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g, (match, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } catch {
      return 'Error: Cannot encode invalid input to Base64';
    }
  };

  const decodeBase64 = () => {
    try {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(inputText.trim()), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return 'Error: Invalid Base64 string';
    }
  };

  const outputText = mode === 'encode' ? encodeBase64() : decodeBase64();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast(`Copied ${mode === 'encode' ? 'Base64' : 'Decoded'} text!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64_${mode}d.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Base64 Encoder / Decoder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Safely encode text or binary data into Base64 format or decode Base64 strings back to standard UTF-8 text.
          </p>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="flex items-center gap-2 glass-card p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Encode to Base64
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Decode Base64
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Input Text
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  accept=".txt,.md,.json,.xml,.html"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputText(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text or Base64 code..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize">
              {mode}d Output
            </label>
            <textarea
              readOnly
              rows={10}
              value={outputText}
              placeholder="Result will appear here..."
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
