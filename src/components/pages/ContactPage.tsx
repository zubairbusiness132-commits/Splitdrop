import React, { useState } from 'react';
import { Mail, Send, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';

interface ContactPageProps {
  onShowToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:support@splitdrop.com?subject=${encodeURIComponent(subject || 'SplitDrop Feedback')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoUrl;
    onShowToast('Opening mail client...');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 my-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block mb-3">
          <Mail className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Contact Us & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Have a question, feature request, or bug report? We'd love to hear from you.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
        
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-900 dark:text-slate-100 font-bold">
            Direct Email Support: <a href="mailto:support@splitdrop.com" className="underline text-indigo-600 dark:text-indigo-400">support@splitdrop.com</a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Feedback / Feature Request / Bug Report"
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Send Message via Mail Client
          </button>
        </form>
      </div>
    </div>
  );
};
