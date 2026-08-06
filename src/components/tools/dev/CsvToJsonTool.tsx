import React, { useState } from 'react';
import { FileSpreadsheet, FileJson, Copy, Check, Download, Upload, Trash2, AlertCircle } from 'lucide-react';

export const CsvToJsonTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [csvInput, setCsvInput] = useState<string>(
    `id,name,role,email\n1,Alice Johnson,Fullstack Developer,alice@example.com\n2,Bob Smith,UI/UX Designer,bob@example.com\n3,Charlie Davis,DevOps Engineer,charlie@example.com`
  );

  const [delimiter, setDelimiter] = useState<string>(',');
  const [copied, setCopied] = useState(false);

  // Simple robust CSV parser
  const parseCsvToJson = (text: string) => {
    if (!text.trim()) return { jsonStr: '', parsedObj: null, error: null };

    try {
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) return { jsonStr: '', parsedObj: null, error: 'CSV is empty.' };

      // Helper to parse line with quotes support
      const parseLine = (line: string) => {
        const result: string[] = [];
        let cur = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const headers = parseLine(lines[0]);
      const dataRows = lines.slice(1);

      const jsonArray = dataRows.map((line) => {
        const values = parseLine(line);
        const obj: { [key: string]: any } = {};
        headers.forEach((header, idx) => {
          let val: any = values[idx] !== undefined ? values[idx] : '';
          // Auto cast numbers or booleans
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val)) && val !== '') val = Number(val);
          obj[header] = val;
        });
        return obj;
      });

      const jsonStr = JSON.stringify(jsonArray, null, 2);
      return { jsonStr, parsedObj: jsonArray, error: null };
    } catch (err: any) {
      return { jsonStr: '', parsedObj: null, error: err?.message || 'Failed to parse CSV' };
    }
  };

  const { jsonStr, parsedObj, error } = parseCsvToJson(csvInput);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setCsvInput(content);
        onShowToast(`Loaded CSV: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!jsonStr) return;
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    onShowToast('Copied JSON to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonStr) return;
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded JSON file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileJson className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            CSV to JSON Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert CSV spreadsheets or TSV files into clean JSON objects & arrays locally.
          </p>
        </div>
      </div>

      {/* Delimiter Selection */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CSV Delimiter:</span>
        {[
          { label: 'Comma (,)', val: ',' },
          { label: 'Semicolon (;)', val: ';' },
          { label: 'Tab (\\t)', val: '\t' },
          { label: 'Pipe (|)', val: '|' }
        ].map((d) => (
          <button
            key={d.val}
            onClick={() => setDelimiter(d.val)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              delimiter === d.val
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" /> Raw CSV Text
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .csv
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setCsvInput(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="Paste CSV text here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* JSON Preview */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Converted JSON Output</label>
            {error ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs space-y-2 min-h-[280px]">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Parsing Error:
                </p>
                <p className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 whitespace-pre-wrap break-all">
                  {error}
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                rows={14}
                value={jsonStr}
                placeholder="JSON output preview..."
                className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!jsonStr || !!error}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .JSON
            </button>
            <button
              onClick={handleCopy}
              disabled={!jsonStr || !!error}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
