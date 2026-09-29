import React from 'react';
import { CampaignConversionAttribution, ConversionFunnelStage } from '../types';
import {
  DollarSign,
  TrendingUp,
  ArrowRight,
  MousePointerClick,
  Users,
  CheckCircle2,
  BarChart3,
  Sparkles,
  PieChart,
  Coins
} from 'lucide-react';

interface LeadConversionTrackerProps {
  attributions?: CampaignConversionAttribution[];
}

const DEFAULT_ATTRIBUTIONS: CampaignConversionAttribution[] = [
  {
    id: 'attr_1',
    campaignTitle: 'Q4 Product Launch - Instagram Reel & TikTok',
    platform: 'Instagram Reel & TikTok',
    roiMultiplier: 14.2,
    funnel: {
      impressions: 12500,
      clicks: 430,
      leads: 42,
      customers: 8,
      revenue: 850000,
      formattedRevenue: '₦850,000 ($5,200 USD)'
    }
  },
  {
    id: 'attr_2',
    campaignTitle: '3 Proven Hooks for B2B Engagement',
    platform: 'LinkedIn Article & Carousel',
    roiMultiplier: 18.5,
    funnel: {
      impressions: 24800,
      clicks: 920,
      leads: 85,
      customers: 14,
      revenue: 1650000,
      formattedRevenue: '₦1,650,000 ($10,100 USD)'
    }
  }
];

export default function LeadConversionTracker({
  attributions = DEFAULT_ATTRIBUTIONS
}: LeadConversionTrackerProps) {
  const dataList = attributions.length > 0 ? attributions : DEFAULT_ATTRIBUTIONS;

  const totalRevenueFormatted = '₦2,500,000 ($15,300 USD)';
  const totalLeads = dataList.reduce((acc, curr) => acc + curr.funnel.leads, 0);
  const totalCustomers = dataList.reduce((acc, curr) => acc + curr.funnel.customers, 0);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/10">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Full-Funnel Lead & Revenue Conversion Tracking
              </h2>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                Content → Revenue Attribution
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Connect social impressions and engagement directly to paid customer conversions and actual revenue.
            </p>
          </div>
        </div>

        {/* REVENUE TOTAL HERO STAT */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-2xl text-right">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Total Influenced Revenue</span>
          <strong className="text-base font-display font-bold text-white tracking-tight">{totalRevenueFormatted}</strong>
        </div>
      </div>

      {/* SUMMARY STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Leads Captured</span>
          <strong className="text-lg font-mono font-bold text-cyan-300">{totalLeads} Qualified Leads</strong>
        </div>
        <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Closed Customers</span>
          <strong className="text-lg font-mono font-bold text-emerald-300">{totalCustomers} Paying Clients</strong>
        </div>
        <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Avg Conversion Rate</span>
          <strong className="text-lg font-mono font-bold text-indigo-300">17.8% (Lead to Sale)</strong>
        </div>
        <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Average Campaign ROI</span>
          <strong className="text-lg font-mono font-bold text-amber-300">16.3x ROI</strong>
        </div>
      </div>

      {/* CAMPAIGN CONVERSION FUNNELS */}
      <div className="space-y-4">
        {dataList.map((attr) => (
          <div key={attr.id} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {attr.platform}
                </span>
                <h3 className="text-sm font-bold text-white font-sans mt-1">{attr.campaignTitle}</h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                  {attr.roiMultiplier}x ROI Multiplier
                </span>
                <span className="text-xs font-mono text-slate-300 block mt-1 font-bold">
                  {attr.funnel.formattedRevenue}
                </span>
              </div>
            </div>

            {/* VISUAL PIPELINE FUNNEL STEPPER */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center font-mono">
              {/* STEP 1: IMPRESSIONS */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 relative">
                <span className="text-[9px] text-slate-400 uppercase block">1. Impressions</span>
                <strong className="text-sm text-slate-200">{attr.funnel.impressions.toLocaleString()}</strong>
                <span className="text-[9px] text-slate-500 block mt-0.5">Reach</span>
              </div>

              {/* STEP 2: CLICKS */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">2. Clicks</span>
                <strong className="text-sm text-cyan-300">{attr.funnel.clicks.toLocaleString()}</strong>
                <span className="text-[9px] text-cyan-500/80 block mt-0.5">3.4% CTR</span>
              </div>

              {/* STEP 3: LEADS */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">3. Leads</span>
                <strong className="text-sm text-indigo-300">{attr.funnel.leads}</strong>
                <span className="text-[9px] text-indigo-400/80 block mt-0.5">9.7% Conv</span>
              </div>

              {/* STEP 4: CUSTOMERS */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">4. Customers</span>
                <strong className="text-sm text-emerald-300">{attr.funnel.customers}</strong>
                <span className="text-[9px] text-emerald-500/80 block mt-0.5">19% Close</span>
              </div>

              {/* STEP 5: REVENUE */}
              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/40">
                <span className="text-[9px] text-emerald-300 uppercase block font-bold">5. Revenue</span>
                <strong className="text-xs text-white">{attr.funnel.formattedRevenue}</strong>
                <span className="text-[9px] text-emerald-400 block mt-0.5 font-bold">Banked</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
