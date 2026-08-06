import React, { useState } from 'react';
import { Network, ShieldCheck, AlertTriangle, Copy, Check, Search } from 'lucide-react';

export const HttpHeaderViewerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [rawHeaders, setRawHeaders] = useState<string>(
    `HTTP/1.1 200 OK\nDate: Mon, 06 Aug 2026 12:00:00 GMT\nServer: nginx/1.24.0\nContent-Type: application/json; charset=utf-8\nContent-Length: 1024\nCache-Control: max-age=3600, must-revalidate\nStrict-Transport-Security: max-age=31536000; includeSubDomains\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: GET, POST, OPTIONS`
  );

  const [filterTerm, setFilterTerm] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);

  // Parse HTTP headers
  const parseHeaders = (raw: string) => {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { statusLine: '', headers: [] };

    let statusLine = '';
    let headerLines = lines;

    if (lines[0].toUpperCase().startsWith('HTTP/')) {
      statusLine = lines[0];
      headerLines = lines.slice(1);
    }

    const headers: { key: string; value: string; category: string }[] = [];

    headerLines.forEach((line) => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();

        let category = 'General';
        const k = key.toLowerCase();
        if (k.startsWith('x-') || k.startsWith('access-control-')) category = 'Security & CORS';
        else if (k.includes('security') || k.includes('frame') || k.includes('content-type-options')) category = 'Security';
        else if (k.includes('cache') || k.includes('expires') || k.includes('etag')) category = 'Caching';
        else if (k.includes('content') || k.includes('transfer') || k.includes('accept')) category = 'Content';
        else if (k.includes('server') || k.includes('date') || k.includes('connection')) category = 'Server';

        headers.push({ key, value, category });
      }
    });

    return { statusLine, headers };
  };

  const { statusLine, headers } = parseHeaders(rawHeaders);

  // Filtered Headers
  const filteredHeaders = headers.filter(
    (h) =>
      h.key.toLowerCase().includes(filterTerm.toLowerCase()) ||
      h.value.toLowerCase().includes(filterTerm.toLowerCase())
  );

  // Security Header Audit Check
  const securityAudit = () => {
    const headerKeys = headers.map((h) => h.key.toLowerCase());

    const checks = [
      {
        name: 'Strict-Transport-Security (HSTS)',
        present: headerKeys.includes('strict-transport-security'),
        desc: 'Enforces HTTPS connections and prevents SSL stripping.'
      },
      {
        name: 'X-Frame-Options',
        present: headerKeys.includes('x-frame-options'),
        desc: 'Protects against clickjacking attacks by controlling iframe embedding.'
      },
      {
        name: 'X-Content-Type-Options',
        present: headerKeys.includes('x-content-type-options'),
        desc: 'Prevents MIME-type sniffing by browsers.'
      },
      {
        name: 'Content-Security-Policy (CSP)',
        present: headerKeys.includes('content-security-policy'),
        desc: 'Restricts script sources to prevent XSS and data injection.'
      },
      {
        name: 'Access-Control-Allow-Origin (CORS)',
        present: headerKeys.includes('access-control-allow-origin'),
        desc: 'Specifies which origins are permitted to load resources.'
      }
    ];

    const passed = checks.filter((c) => c.present).length;
    return { checks, score: `${passed}/${checks.length}` };
  };

  const audit = securityAudit();

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    onShowToast(`Copied ${label}!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            HTTP Header Viewer & Security Inspector
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Parse HTTP request or response header blocks, categorize parameters, and audit security compliance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Header Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw HTTP Headers Block</label>
          <textarea
            rows={12}
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            placeholder="Paste raw response or request headers here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Security Audit Badge */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Security Audit Rating
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {audit.score} Passed
            </span>
          </div>

          <div className="space-y-2">
            {audit.checks.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  item.present
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300'
                }`}
              >
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[11px] opacity-80">{item.desc}</p>
                </div>
                {item.present ? (
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Header Table */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Parsed Headers ({headers.length})
            </h3>
            {statusLine && (
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">
                Status: <span className="text-emerald-500">{statusLine}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder="Filter headers..."
              className="bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {filteredHeaders.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No headers matched search term.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50">
                  <th className="p-2.5 font-black text-slate-700 dark:text-slate-300">Header Key</th>
                  <th className="p-2.5 font-black text-slate-700 dark:text-slate-300">Value</th>
                  <th className="p-2.5 font-black text-slate-700 dark:text-slate-300">Category</th>
                  <th className="p-2.5 font-black text-slate-700 dark:text-slate-300 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeaders.map((h, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="p-2.5 font-mono font-bold text-purple-600 dark:text-purple-400">{h.key}</td>
                    <td className="p-2.5 font-mono text-slate-800 dark:text-slate-200 break-all">{h.value}</td>
                    <td className="p-2.5 font-sans font-bold text-slate-400 text-[11px]">{h.category}</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleCopy(`${h.key}: ${h.value}`, h.key)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-200"
                      >
                        {copied === h.key ? <Check className="w-3 h-3 text-emerald-500 inline" /> : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
