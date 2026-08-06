import React, { useState } from 'react';
import { Video, Film, Sparkles, Sliders, BookOpen } from 'lucide-react';
import { PromptExportActions } from './PromptExportActions';
import { PromptLibraryModal } from './PromptLibraryModal';

interface VeoPromptBuilderToolProps {
  onShowToast: (msg: string) => void;
}

export const VeoPromptBuilderTool: React.FC<VeoPromptBuilderToolProps> = ({ onShowToast }) => {
  const [subject, setSubject] = useState<string>('A futuristic astronaut standing on a glowing crystal ridge overlooking a bioluminescent alien forest');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [duration, setDuration] = useState<string>('5s');
  const [cameraMotion, setCameraMotion] = useState<string>('Slow Forward Dolly & Crane Up');
  const [lighting, setLighting] = useState<string>('Volumetric Neon Rays & Golden Hour Rim Lighting');
  const [mood, setMood] = useState<string>('Epic, Mystical & Cinematic');
  const [style, setStyle] = useState<string>('Photorealistic Live-Action 35mm Film');
  const [lens, setLens] = useState<string>('24mm Anamorphic Wide-Angle Lens');
  const [characters, setCharacters] = useState<string>('Futuristic explorer in matte-black reflective spacesuit');
  const [environment, setEnvironment] = useState<string>('Alien planet with twin moons rising, light fog, bioluminescent flora');
  const [soundEffects, setSoundEffects] = useState<string>('Subtle wind howling, crystalline hums, distant thunder');
  const [music, setMusic] = useState<string>('Low orchestral drone rising into ambient synth pad');
  const [quality, setQuality] = useState<string>('4K, 60fps, Hyperdetailed, IMAX cinematic color grade');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const generatePrompt = () => {
    let prompt = `Cinematic ${style} sequence:\n`;
    prompt += `${subject}. `;
    if (environment.trim()) prompt += `Environment: ${environment}. `;
    if (characters.trim()) prompt += `Character Details: ${characters}. `;
    prompt += `\n\n[CAMERA & LENS]\n${cameraMotion}, shot on ${lens}. `;
    prompt += `\n[LIGHTING & ATMOSPHERE]\n${lighting}, mood is ${mood}. `;
    prompt += `\n[AUDIO CUES]\nSound FX: ${soundEffects}. Music: ${music}. `;
    prompt += `\n\n[SPECIFICATIONS]\nAspect Ratio: ${aspectRatio} | Duration: ${duration} | Quality: ${quality}`;
    return prompt;
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎬</span> Veo Video Prompt Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate cinematic AI video prompts for Google Veo, Sora & Runway with precise camera, lighting & sound cues.
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
            <Sliders className="w-4 h-4 text-indigo-500" /> Cinematic Parameters
          </h3>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject & Action</label>
            <textarea
              rows={2}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {/* Aspect Ratio & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="16:9">16:9 (Landscape / Film)</option>
                <option value="9:16">9:16 (Shorts / Reels)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="21:9">21:9 (Ultrawide IMAX)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="5s">5 Seconds</option>
                <option value="10s">10 Seconds</option>
                <option value="15s">15 Seconds</option>
              </select>
            </div>
          </div>

          {/* Camera Motion & Lens */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Camera Movement</label>
              <input
                type="text"
                value={cameraMotion}
                onChange={e => setCameraMotion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lens Type</label>
              <input
                type="text"
                value={lens}
                onChange={e => setLens(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Lighting & Mood */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lighting Setup</label>
              <input
                type="text"
                value={lighting}
                onChange={e => setLighting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Atmospheric Mood</label>
              <input
                type="text"
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Environment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Environment & Setting</label>
            <input
              type="text"
              value={environment}
              onChange={e => setEnvironment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Sound & Music */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sound Effects (SFX)</label>
              <input
                type="text"
                value={soundEffects}
                onChange={e => setSoundEffects(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Music Cues</label>
              <input
                type="text"
                value={music}
                onChange={e => setMusic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Output */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Veo Video Master Prompt
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
            title="Veo Video Prompt"
            toolId="veo-prompt-builder"
            onShowToast={onShowToast}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(text) => setSubject(text)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
