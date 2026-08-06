import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, FileCode2, Copy, Check, Upload, Trash2 } from 'lucide-react';

export const XmlValidatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [xmlString, setXmlString] = useState(
    `<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don't forget SplitDrop XML Validator!</body>\n</note>`
  );
  const [copied, setCopied] = useState(false);

  const validateXml = () => {
    if (!xmlString.trim()) {
      return { isValid: null, message: 'Please enter XML to validate', stats: null };
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      const parserErrors = xmlDoc.getElementsByTagName('parsererror');
      if (parserErrors.length > 0) {
        return {
          isValid: false,
          message: parserErrors[0].textContent || 'XML Parsing Error',
          stats: null
        };
      }

      // Calculate statistics
      const sizeBytes = new Blob([xmlString]).size;
      const allNodes = xmlDoc.getElementsByTagName('*');
      const rootNodeName = xmlDoc.documentElement ? xmlDoc.documentElement.nodeName : 'Unknown';

      return {
        isValid: true,
        message: 'Valid XML! Structure and closing tags are well-formed.',
        stats: {
          sizeBytes,
          elementCount: allNodes.length,
          rootNodeName
        }
      };
    } catch (err: any) {
      return {
        isValid: false,
        message: err?.message || 'Syntax error in XML string',
        stats: null
      };
    }
  };

  const validationResult = validateXml();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setXmlString(content);
        onShowToast(`Loaded XML file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlString);
    setCopied(true);
    onShowToast('Copied XML text!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            XML Validator & Syntax Checker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check XML document well-formedness, tag opening/closing match, and XML tree integrity.
          </p>
        </div>
      </div>

      {/* Validation Banner */}
      {validationResult.isValid !== null && (
        <div
          className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            validationResult.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {validationResult.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-rose-500 shrink-0" />
            )}
            <div>
              <p className="text-sm font-black">
                {validationResult.isValid ? 'XML Document Well-Formed' : 'XML Parsing Error'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">{validationResult.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {validationResult.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Root Tag Element</span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              &lt;{validationResult.stats.rootNodeName}&gt;
            </p>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total XML Elements</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {validationResult.stats.elementCount}
            </p>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Document Size</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {validationResult.stats.sizeBytes} B
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">XML Document Text</label>
          <div className="flex items-center gap-2">
            <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload XML
              <input
                type="file"
                accept=".xml,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => { setXmlString(''); onShowToast('Cleared input'); }}
              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={xmlString}
          onChange={(e) => setXmlString(e.target.value)}
          placeholder="Paste XML document here..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />

        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleCopy}
            disabled={!xmlString}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy XML'}
          </button>
        </div>
      </div>
    </div>
  );
};
