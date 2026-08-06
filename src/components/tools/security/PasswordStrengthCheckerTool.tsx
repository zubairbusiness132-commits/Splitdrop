import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, AlertTriangle, Clock, KeyRound } from 'lucide-react';

interface PasswordStrengthCheckerToolProps {
  onShowToast: (message: string) => void;
}

export const PasswordStrengthCheckerTool: React.FC<PasswordStrengthCheckerToolProps> = ({ onShowToast }) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const analyzePassword = () => {
    if (!password) {
      return {
        score: 0,
        rating: 'Empty',
        color: 'text-slate-400',
        bg: 'bg-slate-200 dark:bg-slate-800',
        entropy: 0,
        crackTime: 'Instant',
        checks: [],
        suggestions: ['Type or paste a password above to test its strength.']
      };
    }

    let poolSize = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 32;

    const length = password.length;
    const entropy = Math.round(length * Math.log2(poolSize || 1));

    // Crack time estimation based on 10 billion guesses/sec
    const combinations = Math.pow(poolSize || 1, length);
    const secondsToCrack = combinations / 10000000000;

    let crackTime = 'Instant';
    if (secondsToCrack > 315360000000) crackTime = 'Trillions of years';
    else if (secondsToCrack > 3153600000) crackTime = 'Billions of years';
    else if (secondsToCrack > 31536000) crackTime = 'Years';
    else if (secondsToCrack > 86400 * 30) crackTime = 'Months';
    else if (secondsToCrack > 86400) crackTime = 'Days';
    else if (secondsToCrack > 3600) crackTime = 'Hours';
    else if (secondsToCrack > 60) crackTime = 'Minutes';
    else if (secondsToCrack > 1) crackTime = 'Seconds';

    const checks = [
      { label: 'At least 12 characters long', met: length >= 12 },
      { label: 'Includes uppercase letters (A-Z)', met: hasUpper },
      { label: 'Includes lowercase letters (a-z)', met: hasLower },
      { label: 'Includes numbers (0-9)', met: hasNumber },
      { label: 'Includes special symbols (!@#$)', met: hasSymbol },
      { label: 'Avoids common sequential words/patterns', met: !/1234|qwerty|password|admin/i.test(password) }
    ];

    const suggestions: string[] = [];
    if (length < 12) suggestions.push('Increase length to 12 or more characters for maximum resistance.');
    if (!hasUpper) suggestions.push('Add uppercase characters (A-Z).');
    if (!hasLower) suggestions.push('Add lowercase characters (a-z).');
    if (!hasNumber) suggestions.push('Mix in numbers (0-9).');
    if (!hasSymbol) suggestions.push('Include special symbols like !@#$%^&*.');
    if (/1234|qwerty|password|admin/i.test(password)) suggestions.push('Remove common dictionary words or keyboard patterns.');

    let rating = 'Weak';
    let color = 'text-rose-500';
    let bg = 'bg-rose-500';
    let score = 1;

    if (entropy >= 80 && length >= 12 && hasUpper && hasLower && hasNumber && hasSymbol) {
      rating = 'Very Strong';
      color = 'text-indigo-500';
      bg = 'bg-indigo-500';
      score = 4;
    } else if (entropy >= 60 && length >= 10) {
      rating = 'Strong';
      color = 'text-emerald-500';
      bg = 'bg-emerald-500';
      score = 3;
    } else if (entropy >= 35) {
      rating = 'Medium';
      color = 'text-amber-500';
      bg = 'bg-amber-500';
      score = 2;
    }

    return { score, rating, color, bg, entropy, crackTime, checks, suggestions };
  };

  const analysis = analyzePassword();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🛡️</span> Password Strength Checker
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Test and analyze password security, crack time estimate, and entropy score 100% locally in your browser.
        </p>
      </div>

      {/* Input Area */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Enter Password to Test
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste password here..."
            className="w-full py-3.5 px-4 pr-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength Progress Meter */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500">Overall Rating:</span>
            <span className={analysis.color}>{analysis.rating}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step <= analysis.score ? analysis.bg : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl text-center">
          <Clock className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">Estimated Crack Time</span>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{analysis.crackTime}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl text-center">
          <KeyRound className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">Entropy Score</span>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{analysis.entropy} bits</p>
        </div>

        <div className="glass-card p-5 rounded-2xl text-center">
          <ShieldCheck className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">Length</span>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{password.length} chars</p>
        </div>
      </div>

      {/* Checks & Recommendations */}
      {password && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Security Criteria Checklist</h3>
            <div className="space-y-2">
              {analysis.checks.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {check.met ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className={check.met ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Improvement Suggestions</h3>
            {analysis.suggestions.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {analysis.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                🎉 Great job! Your password meets all major security standards.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
