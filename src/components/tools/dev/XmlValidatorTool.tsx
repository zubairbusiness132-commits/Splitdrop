import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Trash2, Copy } from 'lucide-react';

interface XmlValidatorToolProps {
  onShowToast: (message: string) => void;
}

export const XmlValidatorTool: React.FC<XmlValidatorToolProps> = ({ onShowToast }) => {
  const [xmlInput, setXmlInput] = useState<string>(
    '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n  <book id="bk101">\n    <author>Gambardella, Matthew</author>\n    <title>XML Developer\'s Guide</title>\n  </book>\n</catalog>'
  );
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateXml = (input: string) => {
    setXmlInput(input);
    if (!input.trim()) {
      setIsValid(null);
      setErrorMessage('');
      return;
    }

    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(input, 'application/xml');
      const parserError = dom.querySelector('parsererror');

      if (parserError) {
        setIsValid(false);
        setErrorMessage(parserError.textContent || 'XML Parsing Error');
      } else {
        setIsValid(true);
        setErrorMessage('');
      }
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Invalid XML Markup');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Copied to clipboard!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> XML Validator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validate XML documents for syntax correctness and unmatched tag errors.
          </p>
        </div>

        {isValid !== null && (
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
            isValid 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isValid ? 'Valid XML Syntax' : 'Invalid XML Syntax'}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            XML Markup Input
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setXmlInput('');
                validateXml('');
              }}
              className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          value={xmlInput}
          onChange={(e) => validateXml(e.target.value)}
          placeholder="Paste XML markup here..."
          rows={10}
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
        />

        {isValid === false && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-1">
            <div className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> XML Syntax Error
            </div>
            <p className="font-mono whitespace-pre-wrap">{errorMessage}</p>
          </div>
        )}

        {isValid === true && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs space-y-2">
            <div className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> XML Document is Well-Formed!
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              No tag mismatch, illegal character, or structural syntax errors detected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
