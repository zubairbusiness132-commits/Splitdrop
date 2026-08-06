import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Copy, Trash2, ArrowRight } from 'lucide-react';

interface JsonValidatorToolProps {
  onShowToast: (message: string) => void;
}

export const JsonValidatorTool: React.FC<JsonValidatorToolProps> = ({ onShowToast }) => {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "name": "SplitDrop",\n  "status": "online",\n  "tools": 22,\n  "features": ["JSON", "Validator"]\n}');
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [formattedJson, setFormattedJson] = useState<string>('');

  const validateJson = (input: string) => {
    setJsonInput(input);
    if (!input.trim()) {
      setIsValid(null);
      setErrorMessage('');
      setErrorLine(null);
      setFormattedJson('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      setErrorMessage('');
      setErrorLine(null);
      setFormattedJson(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setIsValid(false);
      setFormattedJson('');
      const msg = err.message || 'Invalid JSON syntax';
      setErrorMessage(msg);

      // Extract line number if present in error message
      const lineMatch = msg.match(/line (\d+)/i) || msg.match(/position (\d+)/i);
      if (lineMatch) {
        const pos = parseInt(lineMatch[1], 10);
        if (msg.includes('position')) {
          // Calculate line from position
          const lines = input.substring(0, pos).split('\n');
          setErrorLine(lines.length);
        } else {
          setErrorLine(pos);
        }
      } else {
        setErrorLine(null);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Copied to clipboard!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✅</span> JSON Validator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validate JSON syntax locally with exact line & error position reporting.
          </p>
        </div>

        {isValid !== null && (
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
            isValid 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isValid ? 'Valid JSON Syntax' : 'Invalid JSON Syntax'}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            JSON Input
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setJsonInput('');
                validateJson('');
              }}
              className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          value={jsonInput}
          onChange={(e) => validateJson(e.target.value)}
          placeholder="Paste JSON text here..."
          rows={10}
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
        />

        {isValid === false && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-1">
            <div className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Syntax Error Detected
            </div>
            <p className="font-mono">{errorMessage}</p>
            {errorLine && <p className="font-bold">Error likely around Line {errorLine}</p>}
          </div>
        )}

        {isValid === true && formattedJson && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Valid JSON Code — Formatted Preview
              </span>
              <button
                onClick={() => copyToClipboard(formattedJson)}
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Formatted
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto max-h-60">
              {formattedJson}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
