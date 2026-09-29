import React from 'react';
import { TrendRadarData, TrendTopic } from '../types';
import {
  Flame,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Hash,
  Compass,
  Zap,
  Play,
  Layers,
  Award
} from 'lucide-react';

interface TrendRadarProps {
  trendData?: TrendRadarData;
  onCreateTrendContent: (topic: TrendTopic) => void;
}

const DEFAULT_TRENDS: TrendRadarData = {
  lastUpdated: 'Live Updates (2 mins ago)',
  trendingTopics: [
    {
      id: 'tr_1',
      topic: 'AI Video Generators & Autonomous Agents in B2B Marketing',
      category: 'Artificial Intelligence',
      hashtags: ['AIVideo', 'AutonomousAgents', 'FutureOfWork', 'B2BMarketing'],
      viralScore: 98.6,
      searchVolumeGrowth: '+420% this week',
      format: 'Vertical Short Video',
      summary: 'Short-form videos showing side-by-side speed comparisons of manual video editing vs 60-second AI generation are going viral on Reels & TikTok.',
      recommendedAction: 'Create a 15-second screen recording demonstrating AuraCast generating a full multi-channel video script.'
    },
    {
      id: 'tr_2',
      topic: 'Unfiltered Founder Stories & Vulnerable Leadership',
      category: 'Leadership & Entrepreneurship',
      hashtags: ['FounderStory', 'BuildInPublic', 'LeadershipMindset', 'GrowthHacking'],
      viralScore: 94.2,
      searchVolumeGrowth: '+280% this week',
      format: 'Short Text & Poll',
      summary: 'Founders posting raw breakdowns of failed product launches or hard-won lessons are seeing 4.5x higher comment-to-view ratios on LinkedIn & Twitter.',
      recommendedAction: 'Draft a text post sharing 3 non-obvious mistakes made during early growth and poll your audience.'
    },
    {
      id: 'tr_3',
      topic: 'Carousel Infographics on Productivity Stack 2026',
      category: 'Productivity & SaaS',
      hashtags: ['ProductivityStack', 'SaaSGrowth', 'TechTools2026', 'WorkflowAutomation'],
      viralScore: 91.5,
      searchVolumeGrowth: '+190% this week',
      format: 'Carousel Infographic',
      summary: 'Slide carousels listing 5 minimalist productivity tools are generating high save and bookmark rates.',
      recommendedAction: 'Publish a 5-slide carousel highlighting your daily content automation stack.'
    }
  ]
};

export default function TrendRadar({
  trendData = DEFAULT_TRENDS,
  onCreateTrendContent
}: TrendRadarProps) {
  const data = trendData || DEFAULT_TRENDS;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-rose-500/20 border border-white/10 animate-pulse">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Viral Content Intelligence & Trend Radar
              </h2>
              <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded uppercase">
                🔥 Real-Time Pulse
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Live detection of viral topics, breakout hashtags, popular formats, and emerging industry conversations.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {data.lastUpdated}
        </span>
      </div>

      {/* TRENDS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {data.trendingTopics.map((trend) => (
          <div
            key={trend.id}
            className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between group transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded">
                  {trend.category}
                </span>

                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  {trend.searchVolumeGrowth}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white font-sans leading-snug group-hover:text-amber-300 transition-colors">
                {trend.topic}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Format: {trend.format}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Viral Score: <strong className="text-emerald-400">{trend.viralScore}/100</strong>
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                "{trend.summary}"
              </p>

              {/* HASHTAGS */}
              <div className="flex flex-wrap gap-1">
                {trend.hashtags.map((h) => (
                  <span key={h} className="text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    #{h}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[10px] font-sans text-amber-200/90 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
                <strong className="font-mono text-[9px] uppercase font-bold text-amber-300 block">AI Recommended Hook:</strong>
                {trend.recommendedAction}
              </div>

              <button
                onClick={() => onCreateTrendContent(trend)}
                className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Create Content Around This Trend</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
