import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Hash, Copy, FileText, Upload, Check } from 'lucide-react';

interface ShaChecksumGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const ShaChecksumGeneratorTool: React.FC<ShaChecksumGeneratorToolProps> = ({ onShowToast }) => {
  const [sourceType, setSourceType] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [hashes, setHashes] = useState<{
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
  }>({ sha1: '', sha256: '', sha384: '', sha512: '' });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const calculateTextHashes = (text: string) => {
    setTextInput(text);
    if (!text) {
      setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }
    const sha1 = CryptoJS.SHA1(text).toString();
    const sha256 = CryptoJS.SHA256(text).toString();
    const sha384 = CryptoJS.SHA384(text).toString();
    const sha512 = CryptoJS.SHA512(text).toString();
    setHashes({ sha1, sha256, sha384, sha512 });
  };

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map((value) => value.toString(16).padStart(2, '0'));
    return hexCodes.join('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size });
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();

      const [sha1Buffer, sha256Buffer, sha384Buffer, sha512Buffer] = await Promise.all([
        crypto.subtle.digest('SHA-1', buffer),
        crypto.subtle.digest('SHA-256', buffer),
        crypto.subtle.digest('SHA-384', buffer),
        crypto.subtle.digest('SHA-512', buffer),
      ]);

      setHashes({
        sha1: arrayBufferToHex(sha1Buffer),
        sha256: arrayBufferToHex(sha256Buffer),
        sha384: arrayBufferToHex(sha384Buffer),
        sha512: arrayBufferToHex(sha512Buffer),
      });

      onShowToast(`SHA hashes calculated for ${file.name}`);
    } catch {
      onShowToast('Failed to calculate file checksum.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (hashValue: string, keyName: string) => {
    if (!hashValue) return;
    navigator.clipboard.writeText(hashValue);
    setCopiedKey(keyName);
    onShowToast(`${keyName.toUpperCase()} copied!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>#️⃣</span> SHA Checksum Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes for text strings or files locally.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1 max-w-xs">
        <button
          onClick={() => {
            setSourceType('text');
            setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            sourceType === 'text'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Text Input
        </button>

        <button
          onClick={() => {
            setSourceType('file');
            setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            sourceType === 'file'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> File Checksum
        </button>
      </div>

      {sourceType === 'text' ? (
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Input Text
          </label>
          <textarea
            rows={4}
            value={textInput}
            onChange={(e) => calculateTextHashes(e.target.value)}
            placeholder="Type or paste content to compute SHA hashes in real-time..."
            className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      ) : (
        <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <Upload className="w-10 h-10 text-indigo-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select File for Checksum</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Compute exact cryptographic hashes for files of any format locally without uploading.
          </p>
          <label className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-md">
            Choose File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          {fileInfo && (
            <div className="text-xs font-mono text-slate-600 dark:text-slate-300 pt-2">
              File: <span className="font-bold">{fileInfo.name}</span> ({(fileInfo.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {isProcessing && <p className="text-xs text-indigo-500 font-bold animate-pulse">Calculating hashes...</p>}
        </div>
      )}

      {/* Hashes Output Cards */}
      <div className="space-y-4">
        {[
          { label: 'SHA-1', keyName: 'sha1', value: hashes.sha1 },
          { label: 'SHA-256', keyName: 'sha256', value: hashes.sha256 },
          { label: 'SHA-384', keyName: 'sha384', value: hashes.sha384 },
          { label: 'SHA-512', keyName: 'sha512', value: hashes.sha512 },
        ].map((item) => (
          <div key={item.keyName} className="glass-card p-4 sm:p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {item.label}
              </span>
              {item.value && (
                <button
                  onClick={() => handleCopy(item.value, item.keyName)}
                  className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  {copiedKey === item.keyName ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === item.keyName ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all min-h-[42px] flex items-center">
              {item.value || <span className="text-slate-400 italic">Awaiting input...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
