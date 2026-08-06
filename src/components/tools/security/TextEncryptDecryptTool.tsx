import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, Copy, Key, Eye, EyeOff, Check, RefreshCw } from 'lucide-react';

interface TextEncryptDecryptToolProps {
  onShowToast: (message: string) => void;
}

export const TextEncryptDecryptTool: React.FC<TextEncryptDecryptToolProps> = ({ onShowToast }) => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [outputText, setOutputText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleProcess = () => {
    if (!inputText) {
      onShowToast('Please enter text to process.');
      return;
    }
    if (!secretKey) {
      onShowToast('Please enter a secret key/password.');
      return;
    }

    try {
      if (mode === 'encrypt') {
        const encrypted = CryptoJS.AES.encrypt(inputText, secretKey).toString();
        setOutputText(encrypted);
        onShowToast('Text encrypted successfully!');
      } else {
        const bytes = CryptoJS.AES.decrypt(inputText, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
          throw new Error('Invalid secret key or corrupted ciphertext.');
        }
        setOutputText(decrypted);
        onShowToast('Text decrypted successfully!');
      }
    } catch {
      setOutputText('');
      onShowToast('Decryption failed. Please check your secret key.');
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Result copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🔒</span> Text Encrypt & Decrypt
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Encrypt secret messages with military-grade AES-256 password protection entirely inside your browser.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1 max-w-xs">
        <button
          onClick={() => {
            setMode('encrypt');
            setOutputText('');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'encrypt'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Encrypt
        </button>

        <button
          onClick={() => {
            setMode('decrypt');
            setOutputText('');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'decrypt'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" /> Decrypt
        </button>
      </div>

      {/* Inputs */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
            {mode === 'encrypt' ? 'Plain Text to Encrypt' : 'Encrypted Ciphertext'}
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Type sensitive message here...' : 'Paste U2FsdGVkX1... cipher here'}
            className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
            Encryption Secret Password / Key
          </label>
          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter strong passphrase..."
              className="w-full py-3 px-4 pr-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {mode === 'encrypt' ? 'Encrypt Message' : 'Decrypt Message'}
        </button>
      </div>

      {/* Output Panel */}
      {outputText && (
        <div className="glass-card p-6 rounded-3xl space-y-4 border-2 border-indigo-500/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {mode === 'encrypt' ? 'Encrypted Output (AES-256)' : 'Decrypted Plaintext'}
            </span>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>

          <textarea
            readOnly
            rows={4}
            value={outputText}
            className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-indigo-600 dark:text-indigo-400 focus:outline-none select-all resize-none font-bold"
          />
        </div>
      )}
    </div>
  );
};
