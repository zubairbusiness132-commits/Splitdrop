import React, { useState } from 'react';
import { Copy, Check, Download, Braces, Trash2, Upload, AlertCircle, CheckCircle, ChevronRight, ChevronDown, ListTree, Code2 } from 'lucide-react';

// Recursive Collapsible Tree View Component
const JsonTreeNode: React.FC<{ data: any; name?: string; isLast?: boolean }> = ({ data, name, isLast = true }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (data === null) return <span className="text-rose-400 font-mono">null</span>;
  if (typeof data === 'boolean') return <span className="text-amber-500 font-mono">{String(data)}</span>;
  if (typeof data === 'number') return <span className="text-emerald-500 font-mono">{data}</span>;
  if (typeof data === 'string') return <span className="text-sky-500 font-mono">"{data}"</span>;

  const isArray = Array.isArray(data);
  const keys = Object.keys(data);
  const isEmpty = keys.length === 0;

  return (
    <div className="pl-4 border-l border-slate-200/50 dark:border-slate-800 my-0.5">
      <div className="flex items-center gap-1 font-mono text-xs cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
        {!isEmpty && (
          <span className="text-slate-400">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 inline" /> : <ChevronRight className="w-3.5 h-3.5 inline" />}
          </span>
        )}
        {name && <span className="text-purple-600 dark:text-purple-400 font-bold">{name}: </span>}
        <span className="text-slate-500 dark:text-slate-400 font-bold">
          {isArray ? `Array[${keys.length}]` : `Object{${keys.length}}`}
        </span>
      </div>

      {isOpen && !isEmpty && (
        <div className="space-y-0.5">
          {keys.map((key, idx) => (
            <div key={key}>
              <JsonTreeNode data={data[key]} name={isArray ? `[${key}]` : key} isLast={idx === keys.length - 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const JsonFormatterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [jsonInput, setJsonInput] = useState(
    `{\n  "appName": "SplitDrop Developer Tools",\n  "version": "2.0.0",\n  "features": ["JSON Formatter", "JWT Decoder", "Regex Tester"],\n  "settings": {\n    "darkTheme": true,\n    "clientSideOnly": true\n  }\n}`
  );
  const [indent, setIndent] = useState<number | string>(2);
  const [viewMode, setViewMode] = useState<'formatted' | 'tree'>('formatted');
  const [copied, setCopied] = useState(false);

  const getFormattedJson = () => {
    if (!jsonInput.trim()) return { parsed: null, output: '', isValid: true, error: null };
    try {
      const parsed = JSON.parse(jsonInput);
      const space = indent === 'tab' ? '\t' : Number(indent);
      const output = JSON.stringify(parsed, null, space);
      return { parsed, output, isValid: true, error: null };
    } catch (err: any) {
      return { parsed: null, output: '', isValid: false, error: err?.message || 'Invalid JSON syntax' };
    }
  };

  const { parsed, output, isValid, error } = getFormattedJson();

  const handleMinify = () => {
    try {
      const p = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(p));
      onShowToast('Minified JSON!');
    } catch {
      onShowToast('Cannot minify: Invalid JSON syntax');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setJsonInput(content);
        onShowToast(`Loaded JSON file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    onShowToast('Copied formatted JSON!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded JSON file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Braces className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JSON Formatter & Tree Viewer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Beautify, minify, inspect node tree structures, and copy or export clean JSON files.
          </p>
        </div>
      </div>

      {/* Formatting controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indentation:</span>
          {[2, 4, 'tab'].map((i) => (
            <button
              key={String(i)}
              onClick={() => setIndent(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                indent === i
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {i === 'tab' ? 'Tabs' : `${i} Spaces`}
            </button>
          ))}

          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Minify / Compact
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('formatted')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'formatted' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Code View
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'tree' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" /> Tree View
          </button>
        </div>
      </div>

      {/* Inputs / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw JSON Input</label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .json
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setJsonInput(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            rows={14}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste raw JSON here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {viewMode === 'formatted' ? 'Formatted JSON Code' : 'Collapsible Node Tree'}
            </label>
            {isValid ? (
              viewMode === 'formatted' ? (
                <textarea
                  readOnly
                  rows={14}
                  value={output}
                  placeholder="Formatted JSON preview..."
                  className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
                />
              ) : (
                <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 min-h-[300px] max-h-[350px] overflow-y-auto">
                  <JsonTreeNode data={parsed} />
                </div>
              )
            ) : (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs space-y-2 min-h-[280px]">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Syntax Error:
                </p>
                <p className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 whitespace-pre-wrap break-all">
                  {error}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!isValid || !output}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .JSON
            </button>
            <button
              onClick={handleCopy}
              disabled={!isValid || !output}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Formatted JSON'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
