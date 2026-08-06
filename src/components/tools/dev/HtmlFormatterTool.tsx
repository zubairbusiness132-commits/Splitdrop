import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Eye, Code, Trash2, Upload } from 'lucide-react';

export const HtmlFormatterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [htmlInput, setHtmlInput] = useState<string>(
    `<div class="card"><h1>Hello SplitDrop</h1><p>Online HTML Beautifier & Formatter.</p><ul><li>Clean markup</li><li>Live iframe preview</li></ul></div>`
  );

  const [tab, setTab] = useState<'code' | 'preview'>('code');
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  // Pure JS HTML Beautifier helper
  const formatHtml = (html: string) => {
    if (!html.trim()) return '';

    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    let xml = html.replace(reg, '$1\r\n$2$3');
    let padCount = 0;
    const pad = ' '.repeat(indent);

    xml.split('\r\n').forEach((node) => {
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

    return formatted.trim();
  };

  const formattedOutput = formatHtml(htmlInput);

  const handleMinify = () => {
    const minified = htmlInput
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
    setHtmlInput(minified);
    onShowToast('Minified HTML!');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setHtmlInput(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    onShowToast('Copied formatted HTML!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!formattedOutput) return;
    const blob = new Blob([formattedOutput], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded .html file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            HTML Formatter & Live Preview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Beautify, indent, minify, or preview rendered HTML document markups in real-time.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indentation:</span>
          {[2, 4].map((i) => (
            <button
              key={i}
              onClick={() => setIndent(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                indent === i
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {i} Spaces
            </button>
          ))}

          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Minify HTML
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setTab('code')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'code' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Code View
          </button>
          <button
            onClick={() => setTab('preview')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'preview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Render Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw HTML Markup Input</label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .html
                <input
                  type="file"
                  accept=".html,.htm,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setHtmlInput(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste raw HTML here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {tab === 'code' ? 'Formatted HTML Output' : 'Live Iframe Output'}
            </label>

            {tab === 'code' ? (
              <textarea
                readOnly
                rows={14}
                value={formattedOutput}
                placeholder="Formatted HTML output preview..."
                className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none"
              />
            ) : (
              <iframe
                srcDoc={htmlInput}
                title="Live HTML Preview"
                className="w-full h-[280px] rounded-2xl bg-white border border-slate-200/80 dark:border-slate-800"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!formattedOutput}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .HTML
            </button>
            <button
              onClick={handleCopy}
              disabled={!formattedOutput}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Formatted HTML'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
