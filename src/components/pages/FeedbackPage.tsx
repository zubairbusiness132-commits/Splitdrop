import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { saveFeedback, getFeedbackList, exportFeedbackJSON, FeedbackRecord } from '../../lib/userStore';
import { MessageSquare, Star, Download, Send, CheckCircle2, History } from 'lucide-react';

interface FeedbackPageProps {
  onShowToast: (msg: string) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onShowToast }) => {
  const { t } = useLanguage();

  const [type, setType] = useState<'bug' | 'feature' | 'general' | 'praise'>('general');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackRecord[]>(() => getFeedbackList());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      onShowToast(t('enterMessage', 'Please enter a feedback message'));
      return;
    }

    const record = saveFeedback({
      type,
      rating,
      message: message.trim(),
    });

    setFeedbackHistory(getFeedbackList());
    setSubmitted(true);
    setMessage('');
    onShowToast(t('feedbackSavedLocally', 'Feedback saved locally in your browser!'));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4">
      
      {/* Title Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold mx-auto">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('feedbackTitle', 'Browser-Only Feedback Form')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('feedbackSubtitle', 'Share your thoughts, report bugs, or suggest features. All feedback is stored locally in your browser with instant JSON export.')}
        </p>
      </div>

      {/* Feedback Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('thankYouFeedback', 'Thank You for Your Feedback!')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t('feedbackSavedDesc', 'Your feedback record has been added to local browser storage. You can export all records as a JSON file below anytime.')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                {t('submitAnother', 'Submit Another Response')}
              </button>
              <button
                onClick={() => exportFeedbackJSON()}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t('exportJSON', 'Export Feedback JSON')}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('feedbackType', 'Feedback Category')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'general', label: '💬 General' },
                  { id: 'feature', label: '💡 Feature Request' },
                  { id: 'bug', label: '🐛 Bug Report' },
                  { id: 'praise', label: '❤️ Praise' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      type === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'glass-card border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('rating', 'Overall Rating')}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('yourFeedbackMessage', 'Your Detailed Feedback')}
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('feedbackPlaceholder', 'What do you love about SplitDrop? What features would you like to see next? Any bugs?')}
                className="w-full p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                🔒 No personal data transmitted. 100% local.
              </span>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t('saveFeedbackBtn', 'Save Feedback Locally')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Local Feedback History Table */}
      {feedbackHistory.length > 0 && (
        <section className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('localFeedbackHistory', 'Saved Local Feedback Records')}</span>
            </h2>
            <button
              onClick={() => exportFeedbackJSON()}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {feedbackHistory.map((fb) => (
              <div key={fb.id} className="glass-card p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                    {fb.type}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{fb.rating}/5</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-2">
                      {new Date(fb.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {fb.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
