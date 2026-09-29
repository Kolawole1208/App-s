import React, { useState } from 'react';
import { AutonomousCampaign, CampaignPost } from '../types';
import WorkflowPipelineHeader from './WorkflowPipelineHeader';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Send,
  RefreshCw,
  Edit3,
  Video,
  Image as ImageIcon,
  Hash,
  ArrowRight,
  Zap,
  Globe,
  Tag,
  Clock,
  ThumbsUp,
  MessageSquare,
  Play,
  Film,
  X,
  Share2
} from 'lucide-react';

interface AutonomousCampaignBuilderProps {
  campaign?: AutonomousCampaign;
  onGenerateCampaign: (params: { prompt: string; durationDays: number }) => Promise<void>;
  onApproveCampaign: (campaignId: string, postIds?: string[]) => Promise<void>;
  loading: boolean;
}

const PRESET_PROMPTS = [
  {
    title: '🍽️ 14-Day Restaurant Grand Opening',
    prompt: 'Create a 14-day campaign to promote my new restaurant launch with daily food teasers, chef stories, special menu perks, and booking CTAs.'
  },
  {
    title: '🚀 7-Day SaaS Product Launch Sprint',
    prompt: 'Create a 7-day hype campaign to launch our new AI productivity tool targeting tech founders and remote workers.'
  },
  {
    title: '🔥 30-Day Brand Growth & Lead Engine',
    prompt: 'Build a 30-day comprehensive brand awareness and lead generation campaign for a premium fitness coaching business.'
  },
  {
    title: '📱 14-Day Mobile App Downloads Boost',
    prompt: 'Create a 14-day viral campaign focused on driving user downloads and app signups for a personal finance app.'
  }
];

const PLATFORM_ICONS: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white' },
  whatsapp: { label: 'WhatsApp', color: 'bg-emerald-600 text-white' },
  facebook: { label: 'Facebook', color: 'bg-blue-600 text-white' },
  twitter: { label: 'Twitter / X', color: 'bg-slate-800 text-white' },
  youtube: { label: 'YouTube', color: 'bg-red-600 text-white' }
};

export default function AutonomousCampaignBuilder({
  campaign,
  onGenerateCampaign,
  onApproveCampaign,
  loading
}: AutonomousCampaignBuilderProps) {
  const [promptInput, setPromptInput] = useState<string>('Create a 14-day campaign to promote my new restaurant.');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [activePlatformTab, setActivePlatformTab] = useState<Record<string, string>>({});
  const [editingPost, setEditingPost] = useState<CampaignPost | null>(null);
  const [approvedPostIds, setApprovedPostIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'image' | 'approved'>('all');

  const handleRunBuilder = async () => {
    if (!promptInput.trim()) return;
    await onGenerateCampaign({ prompt: promptInput, durationDays });
  };

  const handleApproveAll = async () => {
    if (campaign) {
      await onApproveCampaign(campaign.id);
    }
  };

  const handleApproveSingle = (postId: string) => {
    setApprovedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setPromptInput(presetPrompt);
    if (presetPrompt.includes('7-day')) setDurationDays(7);
    else if (presetPrompt.includes('14-day')) setDurationDays(14);
    else if (presetPrompt.includes('30-day')) setDurationDays(30);
  };

  const setPostPlatformTab = (postId: string, platformKey: string) => {
    setActivePlatformTab(prev => ({ ...prev, [postId]: platformKey }));
  };

  // Filter posts
  const filteredPosts = campaign?.posts?.filter(p => {
    if (activeFilter === 'video') return p.contentType === 'Short Video Reel';
    if (activeFilter === 'image') return p.contentType === 'Image Post' || p.contentType === 'Carousel';
    if (activeFilter === 'approved') return approvedPostIds.includes(p.id) || p.status === 'approved';
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      <WorkflowPipelineHeader campaignTitle={campaign?.campaignName} currentStage={campaign ? 'review' : 'generate'} />
      
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/10">
            <Bot className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                AI Autonomous Campaign Builder
              </h2>
              <span className="text-[9px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-purple-400" />
                AI Marketing Employee Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Turn 1 simple prompt into a complete, ready-to-deploy multi-day campaign with video scripts, captions, and schedules.
            </p>
          </div>
        </div>

        {campaign && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPromptInput('');
              }}
              className="text-xs font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Create New Campaign</span>
            </button>
          </div>
        )}
      </div>

      {/* PROMPT & INPUT HUB (Shown when creating or tweaking) */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Describe Your Marketing Campaign Objective</span>
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1">Duration:</span>
            {[7, 14, 21, 30].map(days => (
              <button
                key={days}
                onClick={() => setDurationDays(days)}
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  durationDays === days
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g., Create a 14-day campaign to promote my new restaurant grand opening..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl p-3.5 text-xs font-sans focus:outline-none transition-all shadow-inner leading-relaxed"
          />
          <button
            onClick={handleRunBuilder}
            disabled={loading || !promptInput.trim()}
            className="mt-3 w-full sm:w-auto sm:absolute sm:bottom-3 sm:right-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI Employee Building Campaign...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>Deploy AI Employee & Build {durationDays}-Day Campaign</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2 pt-1 border-t border-slate-800/60">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Launch Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p.prompt)}
                className="text-left bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 p-2.5 rounded-xl transition-all cursor-pointer group space-y-1"
              >
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 font-sans">
                  {p.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CAMPAIGN REVIEW SCREEN */}
      {campaign && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Campaign Overview Banner */}
          <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-950/80 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-purple-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded uppercase">
                    Autonomous Campaign Active
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {campaign.id}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mt-1">
                  {campaign.campaignName}
                </h3>
              </div>

              {/* TOP ACTION BUTTONS: Approve All | Edit | Regenerate */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleApproveAll}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer border border-emerald-400/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                  <span>Approve All {campaign.posts?.length || durationDays} Posts</span>
                </button>

                <button
                  onClick={handleRunBuilder}
                  disabled={loading}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Campaign Core Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  🎯 Campaign Objective
                </span>
                <p className="text-slate-200 font-sans font-medium">
                  {campaign.objective}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  👥 Target Audience
                </span>
                <p className="text-slate-200 font-sans font-medium line-clamp-2">
                  {campaign.audience}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  📌 Content Pillars
                </span>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {campaign.contentPillars?.map((pillar, idx) => (
                    <span
                      key={idx}
                      className="text-[9.5px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* POSTS REVIEW STREAM HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">
                Review Campaign ({campaign.posts?.length || 0} Posts Generated)
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                100% Scheduled & Auto-Mapped
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono font-bold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Posts ({campaign.posts?.length})
              </button>
              <button
                onClick={() => setActiveFilter('video')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'video' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reels & Videos
              </button>
              <button
                onClick={() => setActiveFilter('image')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'image' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Images
              </button>
            </div>
          </div>

          {/* POST CARDS STREAM */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isApproved = approvedPostIds.includes(post.id) || post.status === 'approved';
              const activePlatform = activePlatformTab[post.id] || 'instagram';
              const activeVariationText = post.platformVariations?.[activePlatform] || post.caption;

              return (
                <div
                  key={post.id}
                  className={`bg-slate-950/80 border rounded-2xl p-5 space-y-4 transition-all ${
                    isApproved
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-slate-800 hover:border-cyan-500/30'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white bg-cyan-600/30 border border-cyan-500/40 px-2.5 py-1 rounded-lg">
                        Day {post.dayNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {post.date} @ {post.scheduledTime || '09:30 AM'}
                      </span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase">
                        {post.contentType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveSingle(post.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isApproved ? 'Approved' : 'Approve Post'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Topic Title */}
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      "{post.topic}"
                    </h4>
                    {post.contentPillar && (
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                        Pillar: <strong className="text-slate-200">{post.contentPillar}</strong>
                      </span>
                    )}
                  </div>

                  {/* Caption & Hashtags Box */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                    <p className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                      {post.caption}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.hashtags?.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-cyan-400 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Short-Video Reel Storyboard (If Reel or Video) */}
                  {post.shortVideoIdea && (
                    <div className="bg-purple-950/20 border border-purple-500/30 p-4 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-purple-400" />
                          <span>Short-Video Reel Storyboard & Hook</span>
                        </span>
                        <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          15-30s Short Reel
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                            🎣 Opening Hook (0-3s):
                          </span>
                          <p className="text-slate-200 font-medium italic">
                            "{post.shortVideoIdea.hook}"
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                            🎵 Trending Audio Suggestion:
                          </span>
                          <p className="text-purple-300 font-mono text-[11px]">
                            {post.shortVideoIdea.audioSuggestion}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-purple-500/20">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                          🎬 Visual Scene Breakdown:
                        </span>
                        <p className="text-xs text-slate-300 font-sans">
                          {post.shortVideoIdea.sceneDescription}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Image Prompt Box */}
                  {post.imagePrompt && (
                    <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-cyan-400" />
                          <span>AI Image / Graphic Generation Prompt</span>
                        </span>
                        <p className="text-xs text-slate-300 font-sans italic">
                          "{post.imagePrompt}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Platform Variations Tabs */}
                  {post.platformVariations && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          📱 Platform Tailored Variations:
                        </span>
                        <div className="flex items-center gap-1">
                          {Object.keys(post.platformVariations).map((platKey) => {
                            const plat = PLATFORM_ICONS[platKey];
                            const isActive = activePlatform === platKey;

                            return (
                              <button
                                key={platKey}
                                onClick={() => setPostPlatformTab(post.id, platKey)}
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                                }`}
                              >
                                {plat ? plat.label : platKey}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 font-sans italic">
                        {activeVariationText}
                      </div>
                    </div>
                  )}

                  {/* CTA Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      CTA: {post.callToAction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
