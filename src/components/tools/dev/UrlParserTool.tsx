import React, { useState } from 'react';
import { Link2, Copy, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';

export const UrlParserTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [urlInput, setUrlInput] = useState<string>(
    'https://api.splitdrop.com:443/v1/tools/search?category=dev&sort=popular&lang=en#results'
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse URL helper
  const parseUrl = (rawUrl: string) => {
    if (!rawUrl.trim()) return { parsed: null, queryParams: [], error: null };

    try {
      const u = new URL(rawUrl);
      const queryParams: { key: string; value: string }[] = [];
      u.searchParams.forEach((value, key) => {
        queryParams.push({ key, value });
      });

      return {
        parsed: {
          href: u.href,
          protocol: u.protocol,
          hostname: u.hostname,
          port: u.port || (u.protocol === 'https:' ? '443 (default)' : u.protocol === 'http:' ? '80 (default)' : 'N/A'),
          pathname: u.pathname,
          search: u.search || 'None',
          hash: u.hash || 'None',
          origin: u.origin
        },
        queryParams,
        error: null
      };
    } catch (err: any) {
      return { parsed: null, queryParams: [], error: 'Invalid URL string format. Ensure it includes a protocol (e.g., https://).' };
    }
  };

  const { parsed, queryParams, error } = parseUrl(urlInput);

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(label);
    onShowToast(`Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            URL Component Parser
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Break down complex URL strings into protocol, host, port, path, fragment hash, and query parameter pairs.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target URL String</label>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com:8080/path?key=value#hash"
          className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-bold"
        />
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {parsed && !error && (
        <div className="space-y-6">
          {/* Component Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Protocol', val: parsed.protocol },
              { label: 'Hostname', val: parsed.hostname },
              { label: 'Port', val: parsed.port },
              { label: 'Path', val: parsed.pathname },
              { label: 'Raw Search Query', val: parsed.search },
              { label: 'Hash / Fragment', val: parsed.hash }
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </span>
                  <button
                    onClick={() => handleCopy(item.val, item.label)}
                    className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                  >
                    {copiedKey === item.label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white break-all">
                  {item.val}
                </p>
              </div>
            ))}
          </div>

          {/* Query Parameters Table */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Extracted Query Parameters ({queryParams.length})
              </h3>
            </div>

            {queryParams.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No query parameters found in URL string.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50">
                      <th className="p-2.5 font-black text-slate-700 dark:text-slate-300">Key (Parameter)</th>
                      <th className="p-2.5 font-black text-slate-700 dark:text-slate-300">Value</th>
                      <th className="p-2.5 font-black text-slate-700 dark:text-slate-300 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryParams.map((qp, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-purple-600 dark:text-purple-400">{qp.key}</td>
                        <td className="p-2.5 font-mono text-slate-800 dark:text-slate-200 break-all">{qp.value}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => handleCopy(`${qp.key}=${qp.value}`, `Param ${qp.key}`)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-200"
                          >
                            Copy Pair
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
      )}
    </div>
  );
};
