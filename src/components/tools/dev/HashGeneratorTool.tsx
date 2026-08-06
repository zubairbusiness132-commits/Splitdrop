import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Download, Upload, Trash2, FileText } from 'lucide-react';
import CryptoJS from 'crypto-js';

export const HashGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('Hello SplitDrop Developer Tools!');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [hashes, setHashes] = useState<{
    md5: string;
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
  }>({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: ''
  });

  useEffect(() => {
    if (!inputText) {
      setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }

    try {
      const md5 = CryptoJS.MD5(inputText).toString();
      const sha1 = CryptoJS.SHA1(inputText).toString();
      const sha256 = CryptoJS.SHA256(inputText).toString();
      const sha384 = CryptoJS.SHA384(inputText).toString();
      const sha512 = CryptoJS.SHA512(inputText).toString();

      setHashes({
        md5: uppercase ? md5.toUpperCase() : md5,
        sha1: uppercase ? sha1.toUpperCase() : sha1,
        sha256: uppercase ? sha256.toUpperCase() : sha256,
        sha384: uppercase ? sha384.toUpperCase() : sha384,
        sha512: uppercase ? sha512.toUpperCase() : sha512
      });
    } catch (err) {
      console.error('Hash calculation error:', err);
    }
  }, [inputText, uppercase]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content !== undefined) {
        setInputText(content);
        setFileName(file.name);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopyHash = (label: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(label);
    onShowToast(`Copied ${label} hash!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = () => {
    const content = `Hash Summary Report\nInput File/Text: ${fileName || 'Direct Text Input'}\n\nMD5: ${hashes.md5}\nSHA-1: ${hashes.sha1}\nSHA-256: ${hashes.sha256}\nSHA-384: ${hashes.sha384}\nSHA-512: ${hashes.sha512}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hash-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded hash report!');
  };

  const hashList = [
    { key: 'MD5', val: hashes.md5, length: '128-bit' },
    { key: 'SHA-1', val: hashes.sha1, length: '160-bit' },
    { key: 'SHA-256', val: hashes.sha256, length: '256-bit' },
    { key: 'SHA-384', val: hashes.sha384, length: '384-bit' },
    { key: 'SHA-512', val: hashes.sha512, length: '512-bit' }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Hash Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic checksum hashes in real-time.
          </p>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" />
            Input Text or Upload File
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              Uppercase
            </label>

            <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                setInputText('');
                setFileName(null);
                onShowToast('Cleared input');
              }}
              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setFileName(null);
          }}
          placeholder="Type or paste content here..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
        {fileName && (
          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            Loaded file: {fileName}
          </p>
        )}
      </div>

      {/* Output Hashes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Calculated Checksums
          </span>
          <button
            onClick={handleDownload}
            disabled={!inputText}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>

        <div className="space-y-3">
          {hashList.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {item.key}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                    {item.length}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyHash(item.key, item.val)}
                  disabled={!item.val}
                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1"
                >
                  {copiedKey === item.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedKey === item.key ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                  {item.val || 'Waiting for input...'}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
