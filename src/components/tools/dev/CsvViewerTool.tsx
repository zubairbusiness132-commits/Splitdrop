import React, { useState, useMemo } from 'react';
import { Table, Search, Download, Upload, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const CsvViewerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [csvRaw, setCsvRaw] = useState<string>(
    `ID,Name,Department,Salary,Location,Status\n101,Sarah Connor,Engineering,95000,San Francisco,Active\n102,John Doe,Marketing,68000,New York,Active\n103,Jane Smith,Product,105000,Seattle,Active\n104,Alex Johnson,Design,82000,Austin,On Leave\n105,Michael Scott,Sales,75000,Scranton,Active\n106,Pam Beesly,Design,62000,Scranton,Active\n107,Jim Halpert,Sales,88000,Scranton,Active\n108,Dwight Schrute,Sales,92000,Scranton,Active`
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Parse CSV helper
  const parsedData = useMemo(() => {
    if (!csvRaw.trim()) return { headers: [], rows: [] };

    const lines = csvRaw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };

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
        } else if (char === ',' && !inQuotes) {
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
    const rows = lines.slice(1).map(parseLine);

    return { headers, rows };
  }, [csvRaw]);

  // Filter & Search
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return parsedData.rows;
    const term = searchTerm.toLowerCase();
    return parsedData.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(term))
    );
  }, [parsedData.rows, searchTerm]);

  // Sorting
  const sortedRows = useMemo(() => {
    if (sortColumn === null) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortColumn] || '';
      const valB = b[sortColumn] || '';

      const numA = Number(valA);
      const numB = Number(valB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortAsc ? numA - numB : numB - numA;
      }
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [filteredRows, sortColumn, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handleSort = (colIndex: number) => {
    if (sortColumn === colIndex) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(colIndex);
      setSortAsc(true);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setCsvRaw(content);
        setCurrentPage(1);
        onShowToast(`Loaded CSV file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleExportFiltered = () => {
    if (parsedData.headers.length === 0) return;
    const lines = [
      parsedData.headers.join(','),
      ...sortedRows.map((r) => r.join(','))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported-csv-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported filtered CSV!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Interactive CSV Viewer & Data Grid
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, sort, filter, and paginate large CSV datasets directly in your web browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5" /> Upload CSV
            <input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={() => { setCsvRaw(''); onShowToast('Cleared CSV'); }}
            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search all columns..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Page size & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportFiltered}
            disabled={sortedRows.length === 0}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {parsedData.headers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold space-y-2">
            <Table className="w-8 h-8 mx-auto text-slate-300" />
            <p>No CSV data loaded. Paste text or upload a CSV file above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 select-none">
                  {parsedData.headers.map((header, idx) => (
                    <th
                      key={idx}
                      onClick={() => handleSort(idx)}
                      className="p-3 font-black text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{header}</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={parsedData.headers.length} className="p-8 text-center text-slate-400 italic">
                      No matching rows found for query "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-all"
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {sortedRows.length > 0 && (
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>
              Showing {Math.min(sortedRows.length, (currentPage - 1) * pageSize + 1)} - {Math.min(sortedRows.length, currentPage * pageSize)} of {sortedRows.length} rows
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
