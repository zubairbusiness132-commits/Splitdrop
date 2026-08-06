import React, { useState } from 'react';
import { Copy, Trash2, Download, Code, Sparkles, CheckCircle2 } from 'lucide-react';

interface XmlFormatterToolProps {
  onShowToast: (message: string) => void;
}

export const XmlFormatterTool: React.FC<XmlFormatterToolProps> = ({ onShowToast }) => {
  const [xmlInput, setXmlInput] = useState<string>(
    '<?xml version="1.0" encoding="UTF-8"?><root><user id="1"><name>John Doe</name><role>Admin</role></user><user id="2"><name>Jane Smith</name><role>Developer</role></user></root>'
  );
  const [xmlOutput, setXmlOutput] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);

  const formatXml = (raw: string, indent: number) => {
    if (!raw.trim()) {
      setXmlOutput('');
      return;
    }

    try {
      let formatted = '';
      const reg = /(>)(<)(\/*)/g;
      let xml = raw.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      const lines = xml.split('\r\n');

      lines.forEach((line) => {
        let indentStr = '';
        if (line.match(/.+<\/\w[^>]*>$/)) {
          indentStr = ' '.repeat(pad * indent);
        } else if (line.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
          indentStr = ' '.repeat(pad * indent);
        } else if (line.match(/^<\w[^>]*[^\/]>$/)) {
          indentStr = ' '.repeat(pad * indent);
          pad += 1;
        } else {
          indentStr = ' '.repeat(pad * indent);
        }
        formatted += indentStr + line + '\n';
      });

      setXmlOutput(formatted.trim());
    } catch {
      setXmlOutput(raw);
    }
  };

  const minifyXml = () => {
    if (!xmlInput.trim()) return;
    const minified = xmlInput.replace(/>\s+</g, '><').trim();
    setXmlOutput(minified);
    onShowToast('XML Minified!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Copied to clipboard!');
  };

  const downloadXml = () => {
    const blob = new Blob([xmlOutput || xmlInput], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('XML Downloaded!');
  };

  React.useEffect(() => {
    formatXml(xmlInput, indentSize);
  }, [xmlInput, indentSize]);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📄</span> XML Formatter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Beautify, indent, or minify raw XML markup code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Indent:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Raw XML Input
            </label>
            <button
              onClick={() => setXmlInput('')}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder="Paste raw XML here..."
            rows={12}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Formatted Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={minifyXml}
                className="px-2.5 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Minify
              </button>
              <button
                onClick={() => copyToClipboard(xmlOutput)}
                className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button
                onClick={downloadXml}
                className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> XML
              </button>
            </div>
          </div>
          <textarea
            value={xmlOutput}
            readOnly
            rows={12}
            className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs outline-none"
          />
        </div>
      </div>
    </div>
  );
};
