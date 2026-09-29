import React, { useState } from 'react';
import { AnalyticsIntelligence, PostPerformanceSummary } from '../types';
import {
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointer,
  Sparkles,
  Zap,
  Award,
  AlertTriangle,
  Clock,
  Smartphone,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  BrainCircuit,
  Filter,
  Lightbulb
} from 'lucide-react';

interface AuraCastInsightsProps {
  analytics?: AnalyticsIntelligence;
  onRefreshAnalytics: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_ANALYTICS_SEED: AnalyticsIntelligence = {
  lastUpdated: new Date().toISOString(),
  metrics: {
    totalFollowers: 24850,
    followersNetGain: 3420,
    followersGrowthPercent: 15.9,
    engagementRate: 6.4,
    likes: 18420,
    comments: 2980,
    shares: 4150,
    saves: 3890,
    reach: 128400,
    impressions: 340200,
    clicks: 5210
  },
  bestPlatform: 'Instagram Reels & Stories',
  bestPostingTime: '7:00 PM – 9:00 PM GMT+1',
  aiInsights: [
    {
      id: 'insight_1',
      type: 'insight',
      title: 'Motivational vs. Educational Performance',
      observation: 'Your motivational posts received 42% more engagement than educational posts.',
      actionableRecommendation: 'Increase weekly motivational quotes and reel hooks from 2 → 4 posts.',
      impactScore: 'High'
    },
    {
      id: 'insight_2',
      type: 'insight',
      title: 'Platform Visual Affinity',
      observation: 'Instagram performs 3.2x better for your high-contrast visual graphic cards than Twitter.',
      actionableRecommendation: 'Auto-convert text posts into Instagram carousel image slides.',
      impactScore: 'High'
    },
    {
      id: 'insight_3',
      type: 'insight',
      title: 'Optimal Evening Audience Peak',
      observation: 'Posts published between 7–9 PM have 68% higher initial comment volume.',
      actionableRecommendation: 'Schedule your top-priority video posts exclusively in the 7–9 PM time slot.',
      impactScore: 'Critical'
    }
  ],
  recommendations: [
    'Next week, increase motivational content allocation from 2 → 4 posts.',
    'Repurpose top 3 text quotes into short vertical Reels with background music.',
    'Add a direct comment keyword CTA ("Comment RESET below") to double share rate.'
  ],
  bestPerformingPosts: [
    {
      id: 'post_top_1',
      title: '3 Morning Habits of High Performers',
      platform: 'Instagram Reel',
      engagementRate: 9.8,
      likes: 4210,
      comments: 680,
      shares: 1240,
      saves: 1100,
      postedAt: '3 days ago',
      contentType: 'Short Video Reel'
    },
    {
      id: 'post_top_2',
      title: 'Stop Overthinking Your Next Big Move',
      platform: 'Instagram / Twitter',
      engagementRate: 8.4,
      likes: 3100,
      comments: 420,
      shares: 980,
      saves: 850,
      postedAt: '5 days ago',
      contentType: 'Quote Graphic'
    }
  ],
  worstPerformingPosts: [
    {
      id: 'post_low_1',
      title: 'Comprehensive Q3 Social Media Industry Report',
      platform: 'Facebook Feed',
      engagementRate: 1.8,
      likes: 120,
      comments: 14,
      shares: 8,
      saves: 12,
      postedAt: '1 week ago',
      contentType: 'Long Text Article'
    }
  ],
  platformBreakdown: [
    { platform: 'Instagram', followers: 12400, engagementRate: 7.8, totalPosts: 42, topPostingTime: '8:00 PM' },
    { platform: 'TikTok', followers: 6800, engagementRate: 8.2, totalPosts: 28, topPostingTime: '7:30 PM' },
    { platform: 'Twitter / X', followers: 3200, engagementRate: 4.1, totalPosts: 65, topPostingTime: '12:00 PM' },
    { platform: 'Facebook', followers: 1600, engagementRate: 2.3, totalPosts: 18, topPostingTime: '6:00 PM' },
    { platform: 'YouTube Shorts', followers: 850, engagementRate: 6.9, totalPosts: 12, topPostingTime: '9:00 PM' }
  ]
};

export default function AuraCastInsights({
  analytics = DEFAULT_ANALYTICS_SEED,
  onRefreshAnalytics,
  loading
}: AuraCastInsightsProps) {
  const [appliedRecIdx, setAppliedRecIdx] = useState<number | null>(null);

  const data = analytics || DEFAULT_ANALYTICS_SEED;

  const handleApplyRec = (idx: number) => {
    setAppliedRecIdx(idx);
    setTimeout(() => setAppliedRecIdx(null), 3000);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                AuraCast Analytics & AI Intelligence
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1">
                <BrainCircuit className="w-2.5 h-2.5 text-cyan-400" />
                Performance AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Is AuraCast helping you grow? Real-time ROI tracking, audience metrics, and AI strategic recommendations.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshAnalytics}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Intelligence</span>
        </button>
      </div>

      {/* TOP KEY PERFORMANCE INDICATORS GRID (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Followers Growth */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Followers</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {data.metrics.totalFollowers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{data.metrics.followersGrowthPercent}% ({data.metrics.followersNetGain})</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Engagement</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono">
            {data.metrics.engagementRate}%
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Industry Avg: 2.4%
          </div>
        </div>

        {/* Reach */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Total Reach</span>
            <Eye className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {(data.metrics.reach / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] font-mono text-purple-300">
            {(data.metrics.impressions / 1000).toFixed(1)}k Impressions
          </div>
        </div>

        {/* Likes & Comments */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Likes & Comments</span>
            <Heart className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-300 font-mono">
            {(data.metrics.likes + data.metrics.comments).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {data.metrics.comments} Comments
          </div>
        </div>

        {/* Shares & Saves */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Shares & Saves</span>
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-300 font-mono">
            {(data.metrics.shares + data.metrics.saves).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {data.metrics.saves} Saved Posts
          </div>
        </div>

        {/* Link Clicks */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Link Clicks</span>
            <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-indigo-300 font-mono">
            {data.metrics.clicks.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Bio Link Conversions
          </div>
        </div>
      </div>

      {/* QUICK INSIGHT HIGHLIGHTS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-950/60 to-slate-950/80 border border-purple-500/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider block">
              🏆 #1 Top Performing Channel
            </span>
            <p className="text-sm font-bold text-white font-display">
              {data.bestPlatform}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-950/60 to-slate-950/80 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider block">
              ⏰ Peak Engagement Posting Window
            </span>
            <p className="text-sm font-bold text-white font-display">
              {data.bestPostingTime}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN 🧠 AI INTELLIGENCE & RECOMMENDATIONS BOARD */}
      <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>🧠 AI Performance Intelligence & Insights</span>
          </div>
          <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30">
            Live Pattern Recognition
          </span>
        </div>

        {/* AI INSIGHT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.aiInsights?.map((ins, idx) => (
            <div
              key={ins.id || idx}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-400" />
                    {ins.title}
                  </span>
                  <span className="text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    Impact: {ins.impactScore}
                  </span>
                </div>

                <p className="text-xs font-semibold text-white leading-relaxed font-sans bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  "{ins.observation}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 mt-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block">
                  ⚡ AI Recommendation:
                </span>
                <p className="text-[11px] text-slate-300 font-sans">
                  {ins.actionableRecommendation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI ACTIONABLE RECOMMENDATION EXPLICIT BANNER */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-indigo-950 border border-cyan-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Next Week Strategic Optimization Directive:</span>
            </div>
            <p className="text-xs text-white font-medium font-sans">
              "Next week, increase motivational content allocation from <strong>2 → 4 posts</strong>."
            </p>
          </div>

          <button
            onClick={() => handleApplyRec(0)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 border border-white/10"
          >
            {appliedRecIdx === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Strategy Updated!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Apply Strategy Directive</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BEST PERFORMING VS. WORST PERFORMING POSTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEST PERFORMING POSTS */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>🔥 Best-Performing Content</span>
          </div>

          <div className="space-y-3">
            {data.bestPerformingPosts?.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-sans">{post.title}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {post.engagementRate}% ER
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>{post.platform} • {post.contentType}</span>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>🔄 {post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORST PERFORMING POSTS */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>⚠️ Lowest Engagement Diagnosis</span>
          </div>

          <div className="space-y-3">
            {data.worstPerformingPosts?.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-rose-500/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-sans">{post.title}</span>
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {post.engagementRate}% ER
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>{post.platform} • {post.contentType}</span>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>🔄 {post.shares}</span>
                  </div>
                </div>

                <p className="text-[10.5px] font-sans text-rose-300 bg-rose-950/20 p-2 rounded border border-rose-500/20">
                  💡 <strong>AI Diagnosis:</strong> Long dense text articles underperform on Facebook. Convert key takeaways into a 3-slide visual carousel or short reel hook.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PLATFORM BREAKDOWN TABLE */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block pb-2 border-b border-slate-800">
          📊 Platform Performance Breakdown
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Followers</th>
                <th className="py-2.5 px-3">Avg Engagement Rate</th>
                <th className="py-2.5 px-3">Total Published</th>
                <th className="py-2.5 px-3">Peak Posting Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.platformBreakdown?.map((plat, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white font-mono">{plat.platform}</td>
                  <td className="py-3 px-3 font-mono">{plat.followers.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">{plat.engagementRate}%</td>
                  <td className="py-3 px-3 font-mono">{plat.totalPosts} posts</td>
                  <td className="py-3 px-3 font-mono text-amber-300">{plat.topPostingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
