import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, Printer, Share2, Star, BookOpen, FileText, Code2 } from 'lucide-react';

interface PromptExportActionsProps {
  promptText: string;
  title: string;
  toolId: string;
  onShowToast: (msg: string) => void;
  onOpenLibrary?: () => void;
}

export const PromptExportActions: React.FC<PromptExportActionsProps> = ({
  promptText,
  title,
  toolId,
  onShowToast,
  onOpenLibrary
}) => {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('splitdrop_prompt_favs') || '[]');
      setIsFavorite(savedFavs.some((f: any) => f.title === title && f.prompt === promptText));
    } catch {
      setIsFavorite(false);
    }
  }, [promptText, title]);

  const handleCopy = () => {
    if (!promptText.trim()) {
      onShowToast('Prompt is empty!');
      return;
    }
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    onShowToast('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);

    // Save to recently used history
    try {
      const history = JSON.parse(localStorage.getItem('splitdrop_prompt_history') || '[]');
      const filtered = history.filter((h: any) => h.prompt !== promptText);
      const updated = [{ title, prompt: promptText, date: new Date().toISOString(), toolId }, ...filtered].slice(0, 20);
      localStorage.setItem('splitdrop_prompt_history', JSON.stringify(updated));
    } catch {}
  };

  const handleDownloadTxt = () => {
    if (!promptText.trim()) return;
    const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded TXT prompt!');
  };

  const handleDownloadMd = () => {
    if (!promptText.trim()) return;
    const mdContent = `# ${title}\n\n\`\`\`markdown\n${promptText}\n\`\`\`\n\n*Generated with SplitDrop AI Prompt Builder Suite*`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompt.md`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded Markdown prompt!');
  };

  const handlePrint = () => {
    if (!promptText.trim()) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onShowToast('Print pop-up blocked by browser.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Printable Prompt</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            h1 { font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
            pre { background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px; white-space: pre-wrap; word-break: break-word; font-family: monospace; font-size: 14px; }
            .footer { margin-top: 30px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${promptText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <div class="footer">Generated via SplitDrop AI Prompt Builder Suite</div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async () => {
    if (!promptText.trim()) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: promptText,
          url: window.location.href
        });
        onShowToast('Shared successfully!');
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const toggleFavorite = () => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('splitdrop_prompt_favs') || '[]');
      let updated;
      if (isFavorite) {
        updated = savedFavs.filter((f: any) => !(f.title === title && f.prompt === promptText));
        onShowToast('Removed from favorites');
      } else {
        updated = [{ title, prompt: promptText, date: new Date().toISOString(), toolId }, ...savedFavs];
        onShowToast('Added to favorites!');
      }
      localStorage.setItem('splitdrop_prompt_favs', JSON.stringify(updated));
      setIsFavorite(!isFavorite);
    } catch {
      onShowToast('Failed to save favorite');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
      {/* Left: Quick status or Library Launcher */}
      <div className="flex items-center gap-2">
        {onOpenLibrary && (
          <button
            onClick={onOpenLibrary}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Prompt Templates Library
          </button>
        )}
      </div>

      {/* Right: Export Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={toggleFavorite}
          title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
          className={`p-2 rounded-xl border text-xs font-bold transition-all ${
            isFavorite
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
        </button>

        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-1.5"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
        </button>

        <button
          onClick={handleDownloadTxt}
          title="Download as Plain Text (.txt)"
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="hidden sm:inline">TXT</span>
        </button>

        <button
          onClick={handleDownloadMd}
          title="Download as Markdown (.md)"
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <Code2 className="w-4 h-4 text-purple-500" />
          <span className="hidden sm:inline">MD</span>
        </button>

        <button
          onClick={handlePrint}
          title="Print Prompt"
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          onClick={handleShare}
          title="Share Prompt"
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
