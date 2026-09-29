import React from 'react';
import { CompetitorIntelligenceData, CompetitorProfile } from '../types';
import {
  LineChart,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Eye,
  CheckCircle2,
  Award,
  ShieldAlert
} from 'lucide-react';

interface CompetitorIntelligenceProps {
  competitorData?: CompetitorIntelligenceData;
  onAddCompetitor?: (name: string, handle: string, platform: string) => void;
}

const DEFAULT_COMPETITOR_DATA: CompetitorIntelligenceData = {
  trackedCompetitors: [
    {
      id: 'comp_1',
      name: 'MediaFlow Global',
      handle: '@mediaflow_app',
      platform: 'Instagram & TikTok',
      followerCount: '142,000',
      postingFrequency: '4 posts/day',
      topContentType: 'Vertical Short Videos (Reels)',
      avgEngagementRate: 6.8,
      popularPostsCount: 48,
      aiOpportunityAlerts: [
        'Receiving 3.2x higher engagement on short-form video than image carousels.',
        'Audience asking repeatedly for pricing transparency in post comments.'
      ]
    },
    {
      id: 'comp_2',
      name: 'ContentPulse AI',
      handle: '@contentpulse_ai',
      platform: 'LinkedIn & Twitter',
      followerCount: '89,500',
      postingFrequency: '2 posts/day',
      topContentType: 'Text Articles & Polls',
      avgEngagementRate: 4.2,
      popularPostsCount: 22,
      aiOpportunityAlerts: [
        'Lacks active Instagram Reel presence — major market void for vertical video.',
        'High comment activity on workflow automation templates.'
      ]
    }
  ],
  aiStrategicInsights: [
    'Competitor A (@mediaflow_app) is receiving significantly higher engagement on short-form video reels.',
    'Competitor B (@contentpulse_ai) posts consistently at 9:00 AM EST, leaving evening peak hours (7:00 PM - 9:00 PM) open for audience capture.',
    'Audience sentiment reveals 38% dissatisfaction with competitor onboarding speed.'
  ],
  unclaimedOpportunities: [
    'Publish 3 vertical video shorts per week comparing AI speed vs manual editing.',
    'Offer an downloadable "Enterprise Brand Kit Template" in caption link.',
    'Target the evening 8:00 PM posting window when competitor posting drops by 70%.',
    'Host a bi-weekly LinkedIn Live Q&A session addressing customer pain points.',
    'Leverage interactive poll questions on YouTube Community posts for instant audience feedback.'
  ]
};

export default function CompetitorIntelligence({
  competitorData = DEFAULT_COMPETITOR_DATA
}: CompetitorIntelligenceProps) {
  const data = competitorData || DEFAULT_COMPETITOR_DATA;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Competitor Intelligence & Market Benchmark Matrix
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                2 Competitors Monitored
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Track competitor posting cadence, top formats, audience engagement gaps, and strategic market opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* AI STRATEGIC WARNING BANNER */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Aura Copilot Strategic Intelligence Insight</span>
        </div>

        <ul className="space-y-1.5 text-xs text-slate-200 font-sans pl-2">
          {data.aiStrategicInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* TRACKED COMPETITORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.trackedCompetitors.map((comp) => (
          <div
            key={comp.id}
            className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-sans">{comp.name}</h3>
                <span className="text-xs font-mono text-cyan-400">{comp.handle} • {comp.platform}</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded block">
                  {comp.avgEngagementRate}% Avg Eng.
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">{comp.followerCount} Followers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">Posting Frequency</span>
                <strong className="text-slate-200">{comp.postingFrequency}</strong>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">Top Format</span>
                <strong className="text-cyan-300">{comp.topContentType}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Observed Audience Gaps:</span>
              <div className="space-y-1">
                {comp.aiOpportunityAlerts.map((alert, i) => (
                  <div key={i} className="text-xs text-amber-200/90 bg-amber-950/30 border border-amber-500/30 p-2 rounded-lg font-sans">
                    💡 {alert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5 UNCLAIMED BRAND OPPORTUNITIES */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 uppercase">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>5 Growth Opportunities Your Brand Isn't Currently Utilizing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.unclaimedOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
              <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase block">Opportunity #{idx + 1}</span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">{opp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
