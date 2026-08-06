import React, { useState } from 'react';
import { Send, Plus, Trash2, Copy, Check, Clock, Code2, AlertCircle } from 'lucide-react';

export const ApiRequestBuilderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/todos/1');
  
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Accept', value: 'application/json' }
  ]);

  const [body, setBody] = useState<string>('{\n  "title": "SplitDrop Task",\n  "completed": false\n}');
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number | null;
    statusText: string;
    timeMs: number | null;
    data: string;
    headers: { [key: string]: string };
    error: string | null;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Add / remove headers
  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...headers];
    updated[index][field] = val;
    setHeaders(updated);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  // Execute Fetch Request
  const handleSendRequest = async () => {
    if (!url.trim()) {
      onShowToast('Please enter a request URL');
      return;
    }

    setLoading(true);
    setResponse(null);
    const startTime = performance.now();

    try {
      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) {
          headerObj[h.key.trim()] = h.value.trim();
        }
      });

      const options: RequestInit = {
        method,
        headers: headerObj
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      const resHeaders: { [key: string]: string } = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      const textData = await res.text();
      let formattedData = textData;
      try {
        formattedData = JSON.stringify(JSON.parse(textData), null, 2);
      } catch {
        // Leave as raw text if not JSON
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        data: formattedData,
        headers: resHeaders,
        error: null
      });

      onShowToast(`Request completed with status ${res.status}`);
    } catch (err: any) {
      const endTime = performance.now();
      setResponse({
        status: null,
        statusText: 'CORS or Network Error',
        timeMs: Math.round(endTime - startTime),
        data: '',
        headers: {},
        error: err?.message || 'Failed to fetch. Possible CORS restriction or invalid endpoint.'
      });
      onShowToast('Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response?.data) return;
    navigator.clipboard.writeText(response.data);
    setCopied(true);
    onShowToast('Copied response payload!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Browser API Request Builder & Client
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send HTTP requests (GET, POST, PUT, DELETE) and inspect status, headers, and payloads directly in your browser.
          </p>
        </div>
      </div>

      {/* Request URL Bar */}
      <div className="glass-card p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-800 font-extrabold text-xs text-indigo-600 dark:text-indigo-400 px-3 py-2.5 rounded-xl border-none focus:outline-none cursor-pointer"
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/data"
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-mono font-bold rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSendRequest}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {/* Params & Headers & Body Tabs */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('headers')}
              className={`text-xs font-extrabold pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'headers'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Request Headers ({headers.length})
            </button>
            {['POST', 'PUT', 'PATCH'].includes(method) && (
              <button
                onClick={() => setActiveTab('body')}
                className={`text-xs font-extrabold pb-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'body'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Request Body
              </button>
            )}
          </div>
        </div>

        {activeTab === 'headers' && (
          <div className="space-y-3">
            {headers.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Header key (e.g., Authorization)"
                  value={h.key}
                  onChange={(e) => handleHeaderChange(idx, 'key', e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono rounded-xl focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Header value (e.g., Bearer token)"
                  value={h.value}
                  onChange={(e) => handleHeaderChange(idx, 'value', e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono rounded-xl focus:outline-none"
                />
                <button
                  onClick={() => handleRemoveHeader(idx)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddHeader}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Header Row
            </button>
          </div>
        )}

        {activeTab === 'body' && (
          <div>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter JSON or text request payload..."
              className="w-full p-3 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Response Display */}
      {response && (
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Response</span>
              {response.status ? (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    response.status >= 200 && response.status < 300
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {response.status} {response.statusText}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-600">
                  {response.statusText}
                </span>
              )}

              {response.timeMs !== null && (
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {response.timeMs} ms
                </span>
              )}
            </div>

            {response.data && (
              <button
                onClick={handleCopyResponse}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Body'}
              </button>
            )}
          </div>

          {response.error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {response.error}
            </div>
          ) : (
            <textarea
              readOnly
              rows={12}
              value={response.data}
              placeholder="Response output..."
              className="w-full p-4 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
            />
          )}
        </div>
      )}
    </div>
  );
};
