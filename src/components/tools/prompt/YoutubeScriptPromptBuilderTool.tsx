import React, { useState } from 'react';
import { Video, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface YoutubeScriptPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const YoutubeScriptPromptBuilderTool: React.FC<YoutubeScriptPromptBuilderToolProps> = ({ onShowToast }) => {
  const [videoType, setVideoType] = useState<string>('Long Video');
  const [category, setCategory] = useState<string>('Technology');
  const [topic, setTopic] = useState<string>('How Quantum Computing Will Break Modern Encryption in 5 Years');
  const [targetDuration, setTargetDuration] = useState<string>('8 - 10 Minutes');
  const [hookStrategy, setHookStrategy] = useState<string>('Bold Pattern Interrupt: "Your bank password is useless in 2028."');
  const [hostPersona, setHostPersona] = useState<string>('Engaging, Energetic Tech Analyst with clear analogies');
  const [cta, setCta] = useState<string>('Subscribe & download free Quantum Security Cheat Sheet link in description');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an elite YouTube Creator & Scriptwriter specializing in ${category}.\n\n`;
    prompt += `[VIDEO META]\nFormat: ${videoType} | Target Length: ${targetDuration} | Category: ${category}\nTopic: "${topic}"\n\n`;
    prompt += `[HOST PERSONA & TONE]\nHost Voice: ${hostPersona}\n\n`;
    prompt += `[VIRAL HOOK STRATEGY (0:00 - 0:30)]\n${hookStrategy}\n\n`;
    prompt += `[CALL TO ACTION]\nPrimary CTA: ${cta}\n\n`;
    prompt += `[REQUIRED SCRIPT FORMAT & STRUCTURE]\n`;
    prompt += `1. **0:00 - 0:30**: Pattern Interrupt Hook + Stakes & Big Promise.\n`;
    prompt += `2. **0:30 - 2:00**: Context & The Big Problem statement.\n`;
    prompt += `3. **2:00 - 7:00**: 3 Core Key Takeaways with real-world analogies.\n`;
    prompt += `4. **7:00 - End**: Climax, Resolution & Natural Channel CTA.\n\n`;
    prompt += `Please format the entire script with clear columns for [HOST ON-CAMERA SPOKEN DIALOGUE], [B-ROLL / ON-SCREEN VISUAL CUES], and [SFX / MUSIC CUES].`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📹</span> YouTube Script Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate scriptwriting prompts for YouTube Shorts, Long Videos, Explainers, Podcasts & Tech channels.
          </p>
        </div>

        <button
          onClick={() => setIsLibraryOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" /> Ready-Made Templates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-500" /> Video Format & Strategy
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Format</label>
            <div className="flex flex-wrap gap-1.5">
              {['Shorts', 'Long Video', 'Podcast', 'Explainer', 'Movie Explanation', 'Education', 'Finance', 'Islamic', 'Technology'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setVideoType(type);
                    if (type === 'Shorts') setTargetDuration('60 Seconds');
                    else if (type === 'Long Video') setTargetDuration('8 - 10 Minutes');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    videoType === type
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Title / Core Topic</label>
            <textarea
              rows={2}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Hook Strategy & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hook Strategy (First 5s)</label>
              <input
                type="text"
                value={hookStrategy}
                onChange={e => setHookStrategy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Duration</label>
              <input
                type="text"
                value={targetDuration}
                onChange={e => setTargetDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Persona & CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Host Persona</label>
              <input
                type="text"
                value={hostPersona}
                onChange={e => setHostPersona(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Call to Action (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={e => setCta(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Scriptwriting Master Prompt
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {finalPrompt.length} chars
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto border border-slate-800 select-all">
              {finalPrompt}
            </div>
          </div>

          <PromptExportActions
            promptText={finalPrompt}
            title="YouTube Script Prompt"
            toolId="youtube-script-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setTopic(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
