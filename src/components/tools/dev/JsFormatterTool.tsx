import React, { useState } from 'react';
import { FileCode2, Copy, Check, Download, Trash2, Upload } from 'lucide-react';

export const JsFormatterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [jsInput, setJsInput] = useState<string>(
    `function calculateStats(items){let total=0;items.forEach(item=>{total+=item.price;});return{count:items.length,total:total,avg:total/items.length};}const data=[{price:10},{price:20},{price:30}];console.log(calculateStats(data));`
  );

  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  // Pure browser-based JS beautifier logic
  const beautifyJs = (code: string) => {
    if (!code.trim()) return '';

    let pad = ' '.repeat(indent);
    let indentLevel = 0;
    let formatted = '';

    // Normalize spacing
    let clean = code
      .replace(/\s*\{\s*/g, ' {\n')
      .replace(/\s*;\s*/g, ';\n')
      .replace(/\s*\}\s*/g, '\n}\n');

    const lines = clean.split('\n');

    lines.forEach((line) => {
      let trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      formatted += pad.repeat(indentLevel) + trimmed + '\n';

      if (trimmed.endsWith('{')) {
        indentLevel++;
      }
    });

    return formatted.trim();
  };

  const formattedOutput = beautifyJs(jsInput);

  const handleMinify = () => {
    const minified = jsInput
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // remove comments
      .replace(/\s+/g, ' ')
      .replace(/\s*([\{\}\(\)\;\,\=\+\-\*\/\:\?])\s*/g, '$1')
      .trim();
    setJsInput(minified);
    onShowToast('Minified JavaScript!');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setJsInput(content);
        onShowToast(`Loaded JS file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    onShowToast('Copied formatted JavaScript!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!formattedOutput) return;
    const blob = new Blob([formattedOutput], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${Date.now()}.js`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded .js file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JavaScript Formatter & Beautifier
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Format, beautify, un-minify, or compact JavaScript & TypeScript code directly in your browser.
          </p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indentation:</span>
          {[2, 4].map((i) => (
            <button
              key={i}
              onClick={() => setIndent(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                indent === i
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {i} Spaces
            </button>
          ))}

          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Minify JS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw JS / TS Code Input</label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .js
                <input
                  type="file"
                  accept=".js,.ts,.jsx,.tsx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setJsInput(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={jsInput}
            onChange={(e) => setJsInput(e.target.value)}
            placeholder="Paste JS / TS code here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Formatted JavaScript Output</label>
            <textarea
              readOnly
              rows={14}
              value={formattedOutput}
              placeholder="Formatted JS preview..."
              className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!formattedOutput}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .JS
            </button>
            <button
              onClick={handleCopy}
              disabled={!formattedOutput}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Formatted JS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
