import React, { useState } from 'react';
import { TargetAudiencePersona, ContentPillar, WeeklyCampaignPlan, MarketingStrategy } from '../types';
import { 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  Target, 
  Users, 
  Layers, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Compass, 
  RefreshCw,
  MessageSquare,
  BarChart3,
  Flame,
  Globe
} from 'lucide-react';

interface StrategyEngineProps {
  strategy?: MarketingStrategy;
  onGenerateStrategy: (params: {
    brandDescription: string;
    goals: string[];
    targetAudience?: string;
    preferredPlatforms?: string[];
    postingFrequency?: string;
  }) => Promise<void>;
  onSparkTopic: (topic: string, channels: string[], toneGoal?: string) => Promise<void>;
  loading: boolean;
  activeConnectedChannels: string[];
}

const PRESET_EXAMPLES = [
  {
    label: "Christian Motivational & Growth Page",
    prompt: "I run a Christian motivational page targeting young Nigerians aged 18-32 with daily spiritual encouragement, career guidance, and mental discipline.",
    goals: ["Brand Awareness", "Community Engagement", "Leads & Growth"]
  },
  {
    label: "Creative Agency & Design Hub",
    prompt: "We are an elite digital branding agency providing UI/UX design, social video production, and visual storytelling for high-growth startups in Africa.",
    goals: ["Thought Leadership", "Leads & Sales", "Brand Awareness"]
  },
  {
    label: "E-commerce & Lifestyle Brand",
    prompt: "A modern African streetwear brand focusing on sustainable fashion, urban youth culture, and high-energy lifestyle storytelling.",
    goals: ["Brand Awareness", "Leads & Sales", "Community Engagement"]
  }
];

const AVAILABLE_GOALS = [
  "Brand Awareness",
  "Community Engagement",
  "Leads & Sales",
  "Thought Leadership",
  "Customer Retention",
  "Viral Organic Reach"
];

const ALL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'youtube', label: 'YouTube Shorts' }
];

export default function StrategyEngine({
  strategy,
  onGenerateStrategy,
  onSparkTopic,
  loading,
  activeConnectedChannels
}: StrategyEngineProps) {
  const [brandInput, setBrandInput] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Brand Awareness', 'Community Engagement']);
  const [audienceInput, setAudienceInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'whatsapp', 'facebook']);
  const [frequencyInput, setFrequencyInput] = useState('5 Days / Week');
  const [isFormOpen, setIsFormOpen] = useState(!strategy);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'persona' | 'pillars'>('roadmap');
  const [sparkingTopic, setSparkingTopic] = useState<string | null>(null);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const togglePlatform = (platId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platId) ? prev.filter(p => p !== platId) : [...prev, platId]
    );
  };

  const handleApplyPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
    setBrandInput(preset.prompt);
    setSelectedGoals(preset.goals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandInput.trim()) return;

    await onGenerateStrategy({
      brandDescription: brandInput.trim(),
      goals: selectedGoals,
      targetAudience: audienceInput.trim() || undefined,
      preferredPlatforms: selectedPlatforms,
      postingFrequency: frequencyInput
    });

    setIsFormOpen(false);
  };

  const handleSparkClick = async (topic: string, channels: string[], toneGoal?: string) => {
    setSparkingTopic(topic);
    try {
      // Fallback to active connected channels or default
      const finalChannels = channels && channels.length > 0 
        ? channels 
        : activeConnectedChannels.length > 0 ? activeConnectedChannels : ['instagram', 'facebook'];
      await onSparkTopic(topic, finalChannels, toneGoal);
    } finally {
      setSparkingTopic(null);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/10">
            <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                AI Marketing Strategy Engine
              </h2>
              <span className="text-[9px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded tracking-widest uppercase">
                30-Day Campaign Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Plan → Create → Publish → Engage. Autonomous marketing strategy and 4-week roadmap generator.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="self-start sm:self-auto text-xs font-bold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          {isFormOpen ? <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> : <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
          {isFormOpen ? 'Close Generator Form' : strategy ? 'Refine / Generate New Strategy' : 'Build New Strategy'}
        </button>
      </div>

      {/* Generator Input Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-950/70 border border-purple-500/20 rounded-xl p-5 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Define Your Brand Vision & Audience</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Gemini-Powered CMO</span>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Quick Preset Blueprints
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_EXAMPLES.map((pr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(pr)}
                  className="text-[11px] font-sans bg-slate-900 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{pr.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Brand Description & Niche <span className="text-purple-400">*</span>
            </label>
            <textarea
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="e.g., I run a Christian motivational page targeting young Nigerians with daily faith encouragement, career wisdom, and mental growth tips..."
              rows={3}
              required
              className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl p-3 text-slate-200 placeholder-slate-500 font-sans leading-relaxed"
            />
          </div>

          {/* Primary Goals */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Primary Marketing Objectives
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`text-[11px] font-sans px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-purple-200 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Target className={`w-3 h-3 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span>{goal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional details: Target Audience & Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Target Audience Details (Optional)
              </label>
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                placeholder="e.g. Gen Z & Millennials in Nigeria, UK & US Diaspora"
                className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-purple-500/60 rounded-xl px-3 py-2 text-slate-200 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Target Channels
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PLATFORMS.map((pl) => {
                  const active = selectedPlatforms.includes(pl.id);
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => togglePlatform(pl.id)}
                      className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                        active
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {pl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading || !brandInput.trim()}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
                <span>Architecting 30-Day Marketing Strategy & Content Pillars...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Generate 30-Day AI Marketing Strategy & Campaign Roadmap</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Strategy Content Overview */}
      {strategy ? (
        <div className="space-y-6">
          {/* Active Strategy Header Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                  Active Brand Blueprint
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Target Frequency: <strong className="text-slate-200">{strategy.postingFrequency}</strong>
                </span>
              </div>
              <h3 className="text-sm font-display font-semibold text-white tracking-tight leading-snug">
                "{strategy.brandNameOrNiche}"
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {strategy.primaryGoals.map((g, i) => (
                  <span key={i} className="text-[9.5px] font-sans font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-purple-400" />
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* View Mode Navigation Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'roadmap' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>4-Week Roadmap</span>
              </button>
              <button
                onClick={() => setActiveTab('persona')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'persona' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Audience Persona</span>
              </button>
              <button
                onClick={() => setActiveTab('pillars')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'pillars' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pillars & Gap Analysis</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 4-WEEK CAMPAIGN ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>30-Day Content Execution Roadmap (Week by Week)</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-sans">
                  Click <span className="text-emerald-400 font-bold">⚡ Spark Post</span> to send any topic directly into your workspace.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategy.weeklyPlan?.map((week) => (
                  <div key={week.weekNumber} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-purple-500/30 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          Week {week.weekNumber}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {week.objective}
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-white font-sans leading-snug">
                        {week.theme}
                      </h5>

                      {/* Content pillars used */}
                      <div className="flex flex-wrap gap-1">
                        {week.contentPillars?.map((p, idx) => (
                          <span key={idx} className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            #{p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actionable topics for this week */}
                    <div className="space-y-2 pt-2 border-t border-slate-850">
                      <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        Actionable Campaign Posts
                      </span>
                      {week.suggestedTopics?.map((top, idx) => {
                        const isSparkingThis = sparkingTopic === top.topic;
                        return (
                          <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-all">
                            <p className="text-xs text-slate-200 font-sans font-medium leading-relaxed">
                              "{top.topic}"
                            </p>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.2 rounded font-semibold border border-indigo-500/20">
                                  {top.format}
                                </span>
                                {top.suggestedChannels?.map((ch) => (
                                  <span key={ch} className="text-[8.5px] font-mono text-slate-400 uppercase font-bold">
                                    • {ch}
                                  </span>
                                ))}
                              </div>

                              <button
                                onClick={() => handleSparkClick(top.topic, top.suggestedChannels, top.toneGoal)}
                                disabled={loading || isSparkingThis}
                                className="text-[10px] font-bold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 shadow-xs"
                              >
                                {isSparkingThis ? (
                                  <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3 text-amber-300" />
                                )}
                                <span>{isSparkingThis ? 'Sparking...' : 'Spark Post'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIENCE PERSONA */}
          {activeTab === 'persona' && strategy.targetPersona && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Target Customer Persona</h4>
                    <p className="text-sm font-bold text-white font-sans">{strategy.targetPersona.name}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span className="text-slate-500 font-mono">Age Demographic:</span>
                    <span className="font-semibold text-white">{strategy.targetPersona.ageGroup}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span className="text-slate-500 font-mono">Core Region:</span>
                    <span className="font-semibold text-white">{strategy.targetPersona.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                    Preferred Channels
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.targetPersona.preferredPlatforms?.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                    Customer Pain Points
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    {strategy.targetPersona.painPoints?.map((pp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{pp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-850">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    Aspirations & Desired Outcomes
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    {strategy.targetPersona.aspirations?.map((asp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{asp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT PILLARS & GAP ANALYSIS */}
          {activeTab === 'pillars' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Content Pillars */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Strategic Content Pillars
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {strategy.contentPillars?.map((pil, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-sans">{pil.title}</span>
                          <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/20">
                            {pil.percentageAllocation}% Allocation
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                          {pil.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor / Gap Analysis */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Competitor & Content Gap Advantage
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/60 border border-slate-850 p-4 rounded-xl">
                    {strategy.competitorGapAnalysis}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        !isFormOpen && (
          <div className="p-8 text-center text-xs text-slate-500 font-sans italic border border-dashed border-slate-800 rounded-xl">
            No strategy defined yet. Click "Build New Strategy" above to generate your 30-day marketing plan.
          </div>
        )
      )}
    </div>
  );
}
