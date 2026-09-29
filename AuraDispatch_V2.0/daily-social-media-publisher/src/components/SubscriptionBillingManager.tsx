import React, { useState } from 'react';
import { SubscriptionPlan, SubscriptionTier, UsageLimitsState } from '../types';
import {
  CreditCard,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Crown,
  Lock,
  Layers,
  BarChart2,
  Download,
  Calendar
} from 'lucide-react';

interface SubscriptionBillingManagerProps {
  usageState?: UsageLimitsState;
  onUpgradeTier?: (tier: SubscriptionTier) => Promise<void>;
  loading?: boolean;
}

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    tier: 'Free',
    name: 'Free Tier',
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    monthlyPriceNGN: '₦0 / month',
    description: 'Perfect for exploring AuraCast AI content capabilities.',
    features: [
      '50 AI Generations / month',
      '1 Workspace',
      '2 Social Channels connected',
      'Basic Post Drafter & Preview',
      'Standard Text & Image Generator'
    ],
    limits: {
      aiGenerationsPerMonth: '50 / mo',
      workspaces: '1 Workspace',
      socialChannels: '2 Channels',
      brands: '1 Brand Kit',
      teamMembers: '1 Member'
    }
  },
  {
    tier: 'Pro',
    name: 'Pro Creator',
    monthlyPriceUSD: 29,
    annualPriceUSD: 24,
    monthlyPriceNGN: '₦29,000 / month',
    description: 'Designed for active creators and solo entrepreneurs scaling across platforms.',
    badge: 'Popular for Creators',
    isPopular: true,
    features: [
      '1,000 AI Generations / month',
      'Unlimited Campaigns & Topics',
      'Smart Auto-Scheduling & Calendar',
      'Analytics & AuraCast Insights',
      '1 Custom Brand Kit & Font Upload',
      '5 Connected Social Channels',
      'Advanced Video Studio Project Exports'
    ],
    limits: {
      aiGenerationsPerMonth: '1,000 / mo',
      workspaces: '3 Workspaces',
      socialChannels: '5 Channels',
      brands: '2 Brand Kits',
      teamMembers: '3 Members'
    }
  },
  {
    tier: 'Business',
    name: 'Business & Agency',
    monthlyPriceUSD: 79,
    annualPriceUSD: 64,
    monthlyPriceNGN: '₦79,000 / month',
    description: 'Built for agencies, marketing teams, and brands managing multi-channel workflows.',
    features: [
      '10,000 AI Generations / month',
      'Team Member Collaboration & Roles',
      'Multi-Stage Approval Workflow',
      'Advanced Analytics & ROI Funnel Tracking',
      'AI Inbox Engagement & Comment Auto-Replies',
      'Multiple Brand Kits (Up to 10 Brands)',
      'A/B Split Testing & Trend Radar'
    ],
    limits: {
      aiGenerationsPerMonth: '10,000 / mo',
      workspaces: '10 Workspaces',
      socialChannels: '15 Channels',
      brands: '10 Brand Kits',
      teamMembers: '10 Members'
    }
  },
  {
    tier: 'Enterprise',
    name: 'Enterprise Vault',
    monthlyPriceUSD: 199,
    annualPriceUSD: 159,
    monthlyPriceNGN: '₦199,000 / month',
    description: 'Custom security, SSO integration, dedicated infrastructure, and unlimited scale.',
    badge: 'Maximum Security',
    features: [
      'Unlimited AI Generations',
      'Single Sign-On (SSO) & MFA Enforcement',
      'Advanced Security Vault & Audit Logs',
      'Dedicated Server Infrastructure & Priority Processing',
      'Full API Access & Webhooks Integration',
      'Unlimited Workspaces, Channels & Brands',
      'Dedicated Account Strategist'
    ],
    limits: {
      aiGenerationsPerMonth: 'Unlimited',
      workspaces: 'Unlimited',
      socialChannels: 'Unlimited',
      brands: 'Unlimited',
      teamMembers: 'Unlimited'
    }
  }
];

const DEFAULT_USAGE: UsageLimitsState = {
  currentTier: 'Business',
  billingCycle: 'annual',
  renewsOn: 'September 1, 2026',
  generationsUsed: 384,
  generationsLimit: 10000,
  channelsConnected: 5,
  channelsLimit: 15,
  workspacesUsed: 2,
  workspacesLimit: 10,
  teamMembersCount: 3,
  teamMembersLimit: 10
};

export default function SubscriptionBillingManager({
  usageState = DEFAULT_USAGE,
  onUpgradeTier,
  loading = false
}: SubscriptionBillingManagerProps) {
  const usage = usageState || DEFAULT_USAGE;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedTierForCheckout, setSelectedTierForCheckout] = useState<SubscriptionTier | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const handleConfirmUpgrade = async (tier: SubscriptionTier) => {
    setUpgrading(true);
    try {
      if (onUpgradeTier) {
        await onUpgradeTier(tier);
      }
      setUpgradeSuccess(`Successfully switched your workspace plan to ${tier}!`);
      setSelectedTierForCheckout(null);
      setTimeout(() => setUpgradeSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-white/10">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Subscription & Commercial Tier Billing Manager
              </h2>
              <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Active: {usage.currentTier} Plan
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Manage workspace subscription plans, usage quotas, team seat allocations, and billing invoices.
            </p>
          </div>
        </div>

        {/* BILLING CYCLE TOGGLE */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[9px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {upgradeSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/50 p-3.5 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{upgradeSuccess}</span>
        </div>
      )}

      {/* ACTIVE PLAN USAGE METERS BAR */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Current Workspace Quotas ({usage.currentTier} Tier)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Renews on: <strong className="text-slate-200">{usage.renewsOn}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* AI GENERATIONS METERS */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase">AI Generations</span>
              <strong className="text-amber-300 font-bold">
                {usage.generationsUsed} / {usage.generationsLimit === -1 ? '∞' : usage.generationsLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{
                  width: usage.generationsLimit === -1 ? '15%' : `${Math.min(100, (usage.generationsUsed / usage.generationsLimit) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* SOCIAL CHANNELS METERS */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase">Channels Connected</span>
              <strong className="text-cyan-300 font-bold">
                {usage.channelsConnected} / {usage.channelsLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.channelsConnected / usage.channelsLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* WORKSPACES METERS */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase">Workspaces Used</span>
              <strong className="text-indigo-300 font-bold">
                {usage.workspacesUsed} / {usage.workspacesLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.workspacesUsed / usage.workspacesLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* TEAM SEATS METERS */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase">Team Members</span>
              <strong className="text-emerald-300 font-bold">
                {usage.teamMembersCount} / {usage.teamMembersLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.teamMembersCount / usage.teamMembersLimit) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PLAN COMPARISON CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEFAULT_PLANS.map((plan) => {
          const isCurrent = usage.currentTier === plan.tier;
          const displayPrice = billingCycle === 'annual' ? plan.annualPriceUSD : plan.monthlyPriceUSD;

          return (
            <div
              key={plan.tier}
              className={`bg-slate-950/90 border rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between relative ${
                plan.isPopular
                  ? 'border-amber-500/60 shadow-amber-500/10 shadow-2xl ring-1 ring-amber-500/30'
                  : 'border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-indigo-600 text-slate-950 font-black text-[9px] uppercase px-3 py-0.5 rounded-full shadow-md font-mono">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-display">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">${displayPrice}</span>
                    <span className="text-xs text-slate-400 font-mono">/ mo</span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">{plan.monthlyPriceNGN}</div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block">Plan Features & Entitlements:</span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <button
                  disabled={isCurrent}
                  onClick={() => setSelectedTierForCheckout(plan.tier)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                      : plan.isPopular
                      ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 text-slate-950 hover:opacity-95 shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCurrent ? (
                    <span>Active Plan</span>
                  ) : (
                    <>
                      <span>Select {plan.tier} Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIMULATED CHECKOUT MODAL */}
      {selectedTierForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" /> Upgrade to {selectedTierForCheckout} Plan
              </h3>
              <button onClick={() => setSelectedTierForCheckout(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-sans">
              <p>
                Confirm switching your workspace plan to <strong className="text-white">{selectedTierForCheckout}</strong> ({billingCycle} cycle).
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Selected Tier:</span>
                  <strong className="text-cyan-300">{selectedTierForCheckout}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Billing Interval:</span>
                  <strong className="text-amber-300 uppercase">{billingCycle}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 text-white">
                  <span>Instant Access:</span>
                  <strong className="text-emerald-400">Activated Immediately</strong>
                </div>
              </div>

              <button
                disabled={upgrading}
                onClick={() => handleConfirmUpgrade(selectedTierForCheckout)}
                className="w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {upgrading ? 'Processing Upgrade...' : `Confirm & Switch to ${selectedTierForCheckout}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
