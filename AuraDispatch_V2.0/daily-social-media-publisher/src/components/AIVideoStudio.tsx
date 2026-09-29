import React, { useState } from 'react';
import { AdvancedVideoStudioProject, VideoScene } from '../types';
import {
  Video,
  Film,
  Sparkles,
  Play,
  Pause,
  Volume2,
  RefreshCw,
  Copy,
  Check,
  Download,
  Calendar,
  Layers,
  FileText,
  Clock,
  Zap,
  Music,
  Share2,
  Tv,
  Smartphone,
  Eye,
  Sliders,
  Sparkle
} from 'lucide-react';

interface AIVideoStudioProps {
  onGenerateVideoProject: (prompt: string, format: AdvancedVideoStudioProject['format']) => Promise<void>;
  onSaveProjectToCalendar: (project: AdvancedVideoStudioProject) => Promise<void>;
  project?: AdvancedVideoStudioProject;
  loading: boolean;
}

const FORMAT_OPTIONS = [
  { id: 'TikTok (9:16)', label: 'TikTok (9:16 Vertical)', icon: Smartphone },
  { id: 'Instagram Reel (9:16)', label: 'Instagram Reel (9:16)', icon: Film },
  { id: 'YouTube Shorts (9:16)', label: 'YouTube Shorts (9:16)', icon: Tv },
  { id: 'Square Feed (1:1)', label: 'Square Feed (1:1)', icon: Layers },
  { id: 'Landscape (16:9)', label: 'Landscape (16:9)', icon: Tv }
] as const;

const SAMPLE_PROJECT_SEED: AdvancedVideoStudioProject = {
  id: 'vid_seed_1',
  title: '3 Morning Habits of High Performers',
  conceptPrompt: '3 Morning Habits of High Performers',
  format: 'Instagram Reel (9:16)',
  hook: 'Stop making this #1 mistake before 8:00 AM!',
  voiceoverScript: `Stop making this #1 mistake before 8:00 AM! Most people grab their phones the second they wake up. Here are 3 habits that actually double your focus. Number one: Drink 500ml of water before touching screen. Number two: Spend 5 minutes on quiet reflection or scripture. Number three: Write down your top 1 non-negotiable goal for the day. Save this reel and try it tomorrow!`,
  bRollSuggestions: [
    'Macro shot of smartphone screen lighting up in dark room',
    'Pouring fresh water into clear glass with morning sunray',
    'Close up of hand writing in leather journal',
    'AuraCast typographic overlay text'
  ],
  backgroundMusicMood: 'Energetic Upbeat Lofi Beats',
  callToAction: 'Save this reel & share with a friend who needs a morning reset!',
  captionText: `Transform your mornings in 15 minutes flat. ☕✨\n\n1️⃣ Hydrate before scrolling\n2️⃣ Silence & reflection\n3️⃣ 1 Non-negotiable daily win\n\nComment 'HABITS' below to get our free morning checklist sent straight to your DMs!`,
  hashtags: ['#MorningRoutine', '#HighPerformance', '#GrowthMindset', '#ReelsViral', '#AuraCast'],
  createdAt: new Date().toISOString(),
  scenes: [
    {
      sceneNumber: 1,
      timeCode: '0:00 - 0:03',
      visualDescription: 'Extreme close-up of phone screen glowing on nightstand. Hand reaches out to hit snooze.',
      voiceoverScript: 'Stop making this #1 mistake before 8:00 AM!',
      bRollSuggestion: 'Dark moody bedroom lighting with dramatic contrast',
      captionSubtitles: 'STOP MAKING THIS MISTAKE! 🚨',
      screenText: 'MORNING RESET'
    },
    {
      sceneNumber: 2,
      timeCode: '0:03 - 0:09',
      visualDescription: 'Fresh water pouring into a tall glass with soft morning sunlight streaming through window.',
      voiceoverScript: 'Number one: Drink 500ml of water before touching any screen.',
      bRollSuggestion: 'Cinematic slow-motion 60fps water splashes',
      captionSubtitles: '1️⃣ Hydrate Before Scrolling 💦',
      screenText: 'HABIT 1: HYDRATION'
    },
    {
      sceneNumber: 3,
      timeCode: '0:09 - 0:18',
      visualDescription: 'Person sitting peacefully with a open journal, writing top priorities in morning light.',
      voiceoverScript: 'Number two: Spend 5 minutes on quiet reflection. Number three: Write 1 non-negotiable goal.',
      bRollSuggestion: 'Overhead flatlay shot of coffee, notebook and pen',
      captionSubtitles: '2️⃣ 5 Mins Silence\n3️⃣ 1 Key Goal 🎯',
      screenText: 'HABIT 2 & 3: FOCUS'
    },
    {
      sceneNumber: 4,
      timeCode: '0:18 - 0:30',
      visualDescription: 'Confident smile to camera, pointing to screen where link in bio CTA appears with pulse animation.',
      voiceoverScript: 'Save this reel and try it tomorrow morning!',
      bRollSuggestion: 'Dynamic text animation with sound effect cue',
      captionSubtitles: 'SAVE THIS REEL! 💾',
      screenText: 'LINK IN BIO'
    }
  ]
};

export default function AIVideoStudio({
  onGenerateVideoProject,
  onSaveProjectToCalendar,
  project = SAMPLE_PROJECT_SEED,
  loading
}: AIVideoStudioProps) {
  const [promptInput, setPromptInput] = useState('Create a 30-second motivational Reel on overcoming creative burnout');
  const [selectedFormat, setSelectedFormat] = useState<AdvancedVideoStudioProject['format']>('Instagram Reel (9:16)');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [copiedScript, setCopiedScript] = useState(false);
  const [savedToCalendar, setSavedToCalendar] = useState(false);

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    await onGenerateVideoProject(promptInput, selectedFormat);
  };

  const handleCopyScript = () => {
    if (project?.voiceoverScript) {
      navigator.clipboard.writeText(project.voiceoverScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleSaveToCalendar = async () => {
    if (project) {
      await onSaveProjectToCalendar(project);
      setSavedToCalendar(true);
      setTimeout(() => setSavedToCalendar(false), 3000);
    }
  };

  const activeScene = project?.scenes?.[currentSceneIdx] || project?.scenes?.[0];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 border border-white/10">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                AI Short-Video Studio
              </h2>
              <span className="text-[9px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1">
                <Video className="w-2.5 h-2.5 text-rose-400" />
                TikTok / Reels / Shorts Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Generate scene-by-scene storyboards, viral hooks, voiceover scripts, B-roll guides, and simulated reel player.
            </p>
          </div>
        </div>

        {project && (
          <button
            onClick={handleSaveToCalendar}
            disabled={loading}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all cursor-pointer border border-white/10"
          >
            {savedToCalendar ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Scheduled in Calendar!</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-white" />
                <span>Schedule Video in Calendar</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* GENERATION INPUT HUB */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Video Concept & Topic Prompt</span>
          </label>

          {/* Format Picker */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {FORMAT_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFormat(f.id as any)}
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedFormat === f.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.id.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g., Create a 30-second Reel on 3 morning habits for high performance..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-xs font-sans focus:outline-none transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !promptInput.trim()}
            className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI Scripting & Storyboarding...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4 text-white" />
                <span>Generate Video Studio Storyboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* VIDEO STUDIO WORKSPACE */}
      {project && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLS: SCENE-BY-SCENE STORYBOARD & SCRIPT */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hook & Overview Banner */}
            <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>Viral Hook Breakdown (0-3s)</span>
                </span>
                <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                  Format: {project.format}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white font-display">
                "{project.hook}"
              </h3>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  Music: <strong className="text-slate-200">{project.backgroundMusicMood}</strong>
                </span>
                <span className="text-cyan-400 font-bold">
                  {project.scenes?.length || 4} Storyboard Scenes
                </span>
              </div>
            </div>

            {/* SCENE STORYBOARD CARDS */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Scene-By-Scene Production Storyboard</span>
              </h3>

              {project.scenes?.map((scene, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSceneIdx(idx)}
                  className={`bg-slate-950/80 border rounded-2xl p-4 space-y-3 transition-all cursor-pointer ${
                    currentSceneIdx === idx
                      ? 'border-rose-500/60 bg-rose-950/10 shadow-lg shadow-rose-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-white bg-rose-600 px-2 py-0.5 rounded-md">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-rose-400" />
                        {scene.timeCode}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                      Text Overlay: {scene.screenText}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                        🎥 Visual Shot / Action:
                      </span>
                      <p className="text-slate-200 font-sans leading-relaxed">
                        {scene.visualDescription}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                        🎙️ Voiceover Line:
                      </span>
                      <p className="text-rose-200 font-sans font-medium italic">
                        "{scene.voiceoverScript}"
                      </p>
                    </div>
                  </div>

                  {scene.bRollSuggestion && (
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-400 font-mono">
                      🎬 <strong>B-Roll Guide:</strong> {scene.bRollSuggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* VOICEOVER SCRIPT BOX */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Complete Voiceover Script (Teleprompter Mode)</span>
                </span>
                <button
                  onClick={handleCopyScript}
                  className="text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 transition-all cursor-pointer flex items-center gap-1"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-200 font-sans leading-relaxed p-4 bg-slate-900 rounded-xl border border-slate-800 italic whitespace-pre-line">
                "{project.voiceoverScript}"
              </p>
            </div>
          </div>

          {/* RIGHT 5 COLS: INTERACTIVE 9:16 REEL PLAYER PREVIEW */}
          <div className="lg:col-span-5 space-y-4 sticky top-6">
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl flex flex-col items-center">
              <div className="flex items-center justify-between w-full pb-2 border-b border-slate-800 text-xs font-mono font-bold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-rose-400" />
                  Simulated Vertical Reel Frame
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  9:16 HD
                </span>
              </div>

              {/* 9:16 VERTICAL REEL FRAME */}
              <div className="w-full max-w-[280px] aspect-[9/16] bg-slate-900 rounded-2xl border-4 border-slate-800 overflow-hidden relative shadow-2xl flex flex-col justify-between p-4 text-white">
                {/* Top Overlay Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono z-10">
                  <span className="font-bold text-rose-400 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                    REEL PREVIEW
                  </span>
                  <span className="text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                    {activeScene?.timeCode}
                  </span>
                </div>

                {/* Center Dynamic Visual Scene Card */}
                <div className="my-auto space-y-3 text-center z-10 p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10">
                  <span className="text-[9px] font-mono text-rose-300 font-bold uppercase tracking-wider block">
                    Scene {activeScene?.sceneNumber} Visual
                  </span>
                  <p className="text-xs font-bold text-white line-clamp-3 leading-snug">
                    {activeScene?.visualDescription}
                  </p>
                  <div className="bg-rose-600/90 text-white text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block shadow-lg">
                    {activeScene?.screenText}
                  </div>
                </div>

                {/* Bottom Captions & Audio Ticker */}
                <div className="space-y-2 z-10 pt-2 border-t border-white/10">
                  <div className="bg-black/60 p-2 rounded-xl border border-white/10 text-[10.5px] font-bold text-amber-300 text-center leading-snug">
                    "{activeScene?.captionSubtitles}"
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <Music className="w-3 h-3 text-rose-400 animate-spin" />
                      {project.backgroundMusicMood}
                    </span>
                    <span className="font-bold text-rose-400">AuraCast AI</span>
                  </div>
                </div>
              </div>

              {/* Player Scene Controls */}
              <div className="flex items-center gap-2 w-full pt-1">
                {project.scenes?.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setCurrentSceneIdx(sIdx)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      currentSceneIdx === sIdx
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Scene {sIdx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
