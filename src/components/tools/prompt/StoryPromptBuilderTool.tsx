import React, { useState } from 'react';
import { BookOpen, Sparkles, Sliders } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface StoryPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const StoryPromptBuilderTool: React.FC<StoryPromptBuilderToolProps> = ({ onShowToast }) => {
  const [genre, setGenre] = useState<string>('Sci-Fi');
  const [protagonist, setProtagonist] = useState<string>('An isolated orbital satellite engineer who detects an anomalous radio frequency');
  const [flaw, setFlaw] = useState<string>('Reluctance to trust ground control due to past betrayal');
  const [setting, setSetting] = useState<string>('Sub-orbital research station orbiting Europa in the year 2184');
  const [incitingIncident, setIncitingIncident] = useState<string>('The anomalous signal repeats a message addressed directly to her by name');
  const [tone, setTone] = useState<string>('Tense, Atmospheric, Psychological & Suspenseful');
  const [pov, setPov] = useState<string>('First-Person Limited');
  const [targetAudience, setTargetAudience] = useState<string>('Young Adult / Adult Speculative Fiction');
  const [twist, setTwist] = useState<string>('The signal is not originating from space, but from deep within her own station');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Act as an award-winning ${genre} fiction author and story architect.\n\n`;
    prompt += `[STORY OVERVIEW & GENRE]\nGenre: ${genre} | Target Audience: ${targetAudience}\n\n`;
    prompt += `[CHARACTER & CORE CONFLICT]\nProtagonist: ${protagonist}\nFatal Character Flaw: ${flaw}\nSetting & World: ${setting}\n\n`;
    prompt += `[INCITING INCIDENT & TWIST]\nInciting Event: ${incitingIncident}\nClimactic Twist / Moral: ${twist}\n\n`;
    prompt += `[ATMOSPHERE & STYLE]\nTone: ${tone} | Point of View: ${pov}\n\n`;
    prompt += `[TASK]\nWrite an immersive 3-chapter story outline plus a gripping 500-word opening Chapter 1 scene that hooks the reader from line one.`;

    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📖</span> Story Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate narrative prompts across Horror, Sci-Fi, Fantasy, Adventure, Islamic Stories, Kids Stories & Mysteries.
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
        <div className="glass-card p-6 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-500" /> Genre & Character Architect
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['Horror', 'Sci-Fi', 'Fantasy', 'Adventure', 'Islamic Story', 'Kids Story', 'Motivational', 'Crime', 'Mystery', 'Romance'].map(g => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  genre === g
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Protagonist */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Protagonist & Role</label>
            <textarea
              rows={2}
              value={protagonist}
              onChange={e => setProtagonist(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Setting & Incident */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Setting & World Building</label>
            <input
              type="text"
              value={setting}
              onChange={e => setSetting(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Inciting Incident</label>
            <textarea
              rows={2}
              value={incitingIncident}
              onChange={e => setIncitingIncident(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Tone & Twist */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Atmospheric Tone</label>
              <input
                type="text"
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Climactic Twist / Moral</label>
              <input
                type="text"
                value={twist}
                onChange={e => setTwist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Story Master Prompt
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
            title="Story Prompt"
            toolId="story-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setIncitingIncident(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
