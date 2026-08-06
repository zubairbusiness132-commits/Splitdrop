import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Copy, Check, AlertCircle, Clock, Calendar } from 'lucide-react';

export const JwtDecoderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const SAMPLE_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6IkRldmVsb3BlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjo0MTAyNDQ0ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const [jwtToken, setJwtToken] = useState<string>(SAMPLE_JWT);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Decode helper
  const decodeJwt = (token: string) => {
    if (!token.trim()) return { header: null, payload: null, signature: null, error: null };

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: null,
        error: 'Invalid JWT structure. A valid JWT contains three base64url-encoded parts separated by dots (header.payload.signature).'
      };
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerObj = JSON.parse(base64UrlDecode(parts[0]));
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
      const signatureStr = parts[2];

      return {
        header: headerObj,
        payload: payloadObj,
        signature: signatureStr,
        error: null
      };
    } catch (err: any) {
      return {
        header: null,
        payload: null,
        signature: null,
        error: err?.message || 'Failed to parse JSON content from Base64 decoded JWT parts.'
      };
    }
  };

  const decoded = decodeJwt(jwtToken);

  // Format dates from claims
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString() + ' (' + date.toUTCString() + ')';
  };

  const getExpiryStatus = (exp?: number) => {
    if (!exp) return { label: 'No Expiration Claim', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      const diffSec = now - exp;
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      let text = `${diffSec}s ago`;
      if (diffDays > 0) text = `${diffDays}d ago`;
      else if (diffHours > 0) text = `${diffHours}h ago`;
      else if (diffMin > 0) text = `${diffMin}m ago`;

      return { label: `Expired (${text})`, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' };
    } else {
      const diffSec = exp - now;
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      let text = `in ${diffSec}s`;
      if (diffDays > 0) text = `in ${diffDays}d`;
      else if (diffHours > 0) text = `in ${diffHours}h`;
      else if (diffMin > 0) text = `in ${diffMin}m`;

      return { label: `Valid (${text})`, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
  };

  const expStatus = getExpiryStatus(decoded.payload?.exp);

  const handleCopy = (text: string, type: 'header' | 'payload') => {
    navigator.clipboard.writeText(text);
    if (type === 'header') {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
    onShowToast(`Copied JWT ${type}!`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JWT Decoder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Locally decode JSON Web Tokens (JWT) to inspect Header, Claims Payload, and Expiration state.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side Privacy
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Encoded JWT Token</label>
          <button
            onClick={() => {
              setJwtToken(SAMPLE_JWT);
              onShowToast('Loaded sample JWT');
            }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Load Sample Token
          </button>
        </div>

        <textarea
          rows={4}
          value={jwtToken}
          onChange={(e) => setJwtToken(e.target.value)}
          placeholder="Paste encoded JWT string here (eyJhbGciOi...)"
          className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed break-all"
        />
      </div>

      {/* Error state */}
      {decoded.error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-3 font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{decoded.error}</p>
        </div>
      )}

      {/* Decoded Content */}
      {decoded.payload && !decoded.error && (
        <div className="space-y-6">
          {/* Claims Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Issued Time (iat)
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatDate(decoded.payload.iat)}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Expiry Time (exp)
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${expStatus.color}`}>
                  {expStatus.label}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatDate(decoded.payload.exp)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Header (Algorithm & Token Type)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'header')}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer transition-all flex items-center gap-1"
                >
                  {copiedHeader ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedHeader ? 'Copied' : 'Copy'}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-rose-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Payload (Data Claims)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'payload')}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer transition-all flex items-center gap-1"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedPayload ? 'Copied' : 'Copy'}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-purple-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
