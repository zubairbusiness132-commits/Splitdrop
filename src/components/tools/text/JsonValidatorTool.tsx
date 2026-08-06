import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, Braces, Copy, Check, Upload, Trash2, FileText } from 'lucide-react';

export const JsonValidatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [jsonString, setJsonString] = useState(
    `{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "user": "Developer",\n    "roles": ["admin", "editor"],\n    "active": true\n  }\n}`
  );
  const [copied, setCopied] = useState(false);

  const validateJson = () => {
    if (!jsonString.trim()) {
      return { isValid: null, message: 'Please enter JSON string to validate', stats: null };
    }

    try {
      const parsed = JSON.parse(jsonString);

      // Inspect statistics
      const sizeBytes = new Blob([jsonString]).size;
      let keyCount = 0;
      let arrayCount = 0;
      let objectCount = 0;

      const traverse = (obj: any) => {
        if (Array.isArray(obj)) {
          arrayCount++;
          obj.forEach(traverse);
        } else if (typeof obj === 'object' && obj !== null) {
          objectCount++;
          keyCount += Object.keys(obj).length;
          Object.values(obj).forEach(traverse);
        }
      };

      traverse(parsed);

      return {
        isValid: true,
        message: 'Valid JSON! No syntax errors detected.',
        stats: {
          sizeBytes,
          keyCount,
          arrayCount,
          objectCount,
          rootType: Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed
        }
      };
    } catch (err: any) {
      return {
        isValid: false,
        message: err?.message || 'Syntax Error in JSON string',
        stats: null
      };
    }
  };

  const validationResult = validateJson();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setJsonString(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    onShowToast('Copied JSON string!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Braces className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JSON Validator & Inspector
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check JSON syntax validity, locate structural errors, and inspect node counts.
          </p>
        </div>
      </div>

      {/* Validation Result Status Banner */}
      {validationResult.isValid !== null && (
        <div
          className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            validationResult.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {validationResult.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-rose-500 shrink-0" />
            )}
            <div>
              <p className="text-sm font-black">
                {validationResult.isValid ? 'JSON Syntax Passed' : 'Syntax Error Detected'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">{validationResult.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Structural Stats */}
      {validationResult.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Root Type</span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {validationResult.stats.rootType}
            </p>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Keys</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {validationResult.stats.keyCount}
            </p>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Arrays Count</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {validationResult.stats.arrayCount}
            </p>
          </div>

          <div className="glass-card p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">File Size</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {validationResult.stats.sizeBytes} B
            </p>
          </div>
        </div>
      )}

      {/* JSON Code Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">JSON String</label>
          <div className="flex items-center gap-2">
            <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload JSON
              <input
                type="file"
                accept=".json,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => { setJsonString(''); onShowToast('Cleared input'); }}
              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={jsonString}
          onChange={(e) => setJsonString(e.target.value)}
          placeholder="Paste JSON string here..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />

        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleCopy}
            disabled={!jsonString}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};
