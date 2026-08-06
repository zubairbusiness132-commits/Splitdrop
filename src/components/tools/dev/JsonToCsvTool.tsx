import React, { useState } from 'react';
import { FileJson, FileSpreadsheet, Copy, Check, Download, Upload, Trash2, AlertCircle } from 'lucide-react';

export const JsonToCsvTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [jsonInput, setJsonInput] = useState<string>(
    `[\n  { "id": 1, "name": "Alice Johnson", "role": "Fullstack Developer", "email": "alice@example.com" },\n  { "id": 2, "name": "Bob Smith", "role": "UI/UX Designer", "email": "bob@example.com" },\n  { "id": 3, "name": "Charlie Davis", "role": "DevOps Engineer", "email": "charlie@example.com" }\n]`
  );

  const [copied, setCopied] = useState(false);

  // Convert JSON to CSV helper
  const convertJsonToCsv = (jsonStr: string) => {
    if (!jsonStr.trim()) return { csv: '', headers: [], rows: [], error: null };

    try {
      let parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          parsed = [parsed];
        } else {
          return { csv: '', headers: [], rows: [], error: 'JSON input must be an array of objects or an object.' };
        }
      }

      if (parsed.length === 0) {
        return { csv: '', headers: [], rows: [], error: 'JSON array is empty.' };
      }

      // Extract all unique headers across objects
      const headersSet = new Set<string>();
      parsed.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach((k) => headersSet.add(k));
        }
      });

      const headers = Array.from(headersSet);
      if (headers.length === 0) {
        return { csv: '', headers: [], rows: [], error: 'No object keys found in JSON.' };
      }

      const rows: string[][] = [];

      parsed.forEach((item) => {
        const row = headers.map((header) => {
          const val = item[header];
          if (val === undefined || val === null) return '';
          if (typeof val === 'object') return JSON.stringify(val);
          return String(val);
        });
        rows.push(row);
      });

      // Escape CSV values
      const escapeCsvCell = (cell: string) => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      };

      const csvLines = [
        headers.map(escapeCsvCell).join(','),
        ...rows.map((r) => r.map(escapeCsvCell).join(','))
      ];

      return {
        csv: csvLines.join('\n'),
        headers,
        rows,
        error: null
      };
    } catch (err: any) {
      return { csv: '', headers: [], rows: [], error: err?.message || 'Invalid JSON syntax' };
    }
  };

  const { csv, headers, rows, error } = convertJsonToCsv(jsonInput);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setJsonInput(content);
        onShowToast(`Loaded JSON: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!csv) return;
    navigator.clipboard.writeText(csv);
    setCopied(true);
    onShowToast('Copied CSV to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded CSV file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JSON to CSV Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert JSON array data to CSV format with live table preview and instant CSV file export.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-indigo-500" /> JSON Input Data
            </label>
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
            placeholder="Paste JSON array here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* CSV Preview / Error */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Converted CSV Text Output</label>
            {error ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs space-y-2 min-h-[280px]">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Conversion Error:
                </p>
                <p className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 whitespace-pre-wrap break-all">
                  {error}
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                rows={14}
                value={csv}
                placeholder="CSV output preview..."
                className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!csv || !!error}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .CSV
            </button>
            <button
              onClick={handleCopy}
              disabled={!csv || !!error}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Table Preview */}
      {!error && headers.length > 0 && (
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            CSV Table Data Preview ({rows.length} Rows)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50">
                  {headers.map((h, i) => (
                    <th key={i} className="p-2.5 font-black text-slate-700 dark:text-slate-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 font-mono text-slate-800 dark:text-slate-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
