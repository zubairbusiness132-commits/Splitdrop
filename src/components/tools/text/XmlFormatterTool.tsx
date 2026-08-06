import React, { useState } from 'react';
import { Copy, Check, Download, FileCode2, Trash2, Upload, AlertCircle } from 'lucide-react';

export const XmlFormatterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [xmlInput, setXmlInput] = useState(
    `<root><user id="101"><name>SplitDrop</name><role>Admin</role></user><tools><tool>XML Formatter</tool><tool>JSON Validator</tool></tools></root>`
  );
  const [indent, setIndent] = useState<number | string>(2);
  const [copied, setCopied] = useState(false);

  // Pure browser-based XML formatting
  const formatXml = (xml: string) => {
    if (!xml.trim()) return { output: '', isValid: true, error: null };

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length > 0) {
        return { output: '', isValid: false, error: parserError[0].textContent || 'XML Parsing Error' };
      }

      // Prettify DOM
      const pad = indent === 'tab' ? '\t' : ' '.repeat(Number(indent));
      let formatted = '';
      const reg = /(>)(<)(\/*)/g;
      let xmlStr = xml.replace(reg, '$1\r\n$2$3');
      let padCount = 0;

      xmlStr.split('\r\n').forEach((node) => {
        let indentLevel = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indentLevel = 0;
        } else if (node.match(/^<\/\w/)) {
          if (padCount !== 0) {
            padCount -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indentLevel = 1;
        } else {
          indentLevel = 0;
        }

        let padding = '';
        for (let i = 0; i < padCount; i++) {
          padding += pad;
        }

        formatted += padding + node + '\r\n';
        padCount += indentLevel;
      });

      return { output: formatted.trim(), isValid: true, error: null };
    } catch (err: any) {
      return { output: '', isValid: false, error: err?.message || 'Invalid XML syntax' };
    }
  };

  const { output, isValid, error } = formatXml(xmlInput);

  const handleMinify = () => {
    const minified = xmlInput.replace(/>\s+</g, '><').trim();
    setXmlInput(minified);
    onShowToast('Minified XML!');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setXmlInput(content);
        onShowToast(`Loaded XML file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    onShowToast('Copied formatted XML!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded XML file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            XML Formatter & Prettifier
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Format, indent, prettify, or minify XML markups and documents directly in your browser.
          </p>
        </div>
      </div>

      {/* Formatting controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indentation:</span>
          {[2, 4, 'tab'].map((i) => (
            <button
              key={String(i)}
              onClick={() => setIndent(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                indent === i
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {i === 'tab' ? 'Tabs' : `${i} Spaces`}
            </button>
          ))}

          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Minify XML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw XML Input</label>
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
                onClick={() => { setXmlInput(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            rows={14}
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder="Paste raw XML here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Formatted XML Output</label>
            {isValid ? (
              <textarea
                readOnly
                rows={14}
                value={output}
                placeholder="Formatted XML preview..."
                className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs space-y-2 min-h-[280px]">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> XML Parse Error:
                </p>
                <p className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 whitespace-pre-wrap break-all">
                  {error}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!isValid || !output}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .XML
            </button>
            <button
              onClick={handleCopy}
              disabled={!isValid || !output}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Formatted XML'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
