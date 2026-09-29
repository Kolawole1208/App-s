import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Calendar,
  Palette,
  BarChart3,
  Brain,
  MessageSquare,
  Users,
  Flame,
  Coins,
  ArrowRight,
  CheckCircle2,
  Zap,
  PlayCircle,
  ShieldCheck,
  RefreshCw,
  Globe,
  Send,
  FileText,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Share2,
  HelpCircle,
  X
} from 'lucide-react';

interface AIMarketingCommandCenterProps {
  activeModuleCount?: number;
  onNavigateToModule?: (moduleId: string) => void;
}

const PILLARS = [
  { id: 'strategy', number: '1', name: 'AI Strategy Generator', icon: Brain, status: 'Active (Q4 Plan)', color: 'from-purple-500 to-indigo-600' },
  { id: 'campaign', number: '2', name: 'AI Campaign Builder', icon: Layers, status: 'Synced (5 Channels)', color: 'from-indigo-500 to-blue-600' },
  { id: 'calendar', number: '3', name: 'Calendar & Scheduler', icon: Calendar, status: '7 Posts Scheduled', color: 'from-cyan-500 to-teal-600' },
  { id: 'brandkit', number: '4', name: 'Brand Kit Identity', icon: Palette, status: 'Aura Premium Active', color: 'from-emerald-500 to-teal-600' },
  { id: 'analytics', number: '5', name: 'Analytics & Insights', icon: BarChart3, status: '+28% Growth Rate', color: 'from-amber-500 to-yellow-600' },
  { id: 'learning', number: '6', name: 'AI Self-Optimization', icon: Sparkles, status: 'Self-Tuning Live', color: 'from-rose-500 to-pink-600' },
  { id: 'inbox', number: '7', name: 'Unified Social Inbox', icon: MessageSquare, status: '12 Auto-Replies Drafted', color: 'from-purple-500 to-rose-600' },
  { id: 'team', number: '8', name: 'Team Approval Queue', icon: Users, status: '3 Approvals Pending', color: 'from-indigo-500 to-cyan-600' },
  { id: 'trends', number: '9', name: 'Trend & Competitors', icon: Flame, status: '2 Competitors Monitored', color: 'from-amber-500 to-rose-600' },
  { id: 'conversion', number: '10', name: 'Lead & Revenue Attrib.', icon: Coins, status: '₦2.5M Revenue Tracked', color: 'from-emerald-500 to-cyan-600' }
];

const FOUR_STEPS = [
  {
    num: '1',
    title: 'Generate AI Strategy',
    icon: Brain,
    iconColor: 'text-amber-400',
    targetModule: 'strategy',
    desc: 'Enter your brand goals or target audience. AuraCast creates a multi-channel growth playbook with viral hooks.'
  },
  {
    num: '2',
    title: 'Auto-Create Content',
    icon: Sparkles,
    iconColor: 'text-indigo-400',
    targetModule: 'brandkit',
    desc: 'AI generates high-converting captions, custom branded graphic cards, hashtag sets, and video scripts.'
  },
  {
    num: '3',
    title: 'Schedule & Publish',
    icon: Calendar,
    iconColor: 'text-cyan-400',
    targetModule: 'calendar',
    desc: 'Queue your posts into the interactive calendar. AuraCast dispatches content directly to Instagram, TikTok, X, and LinkedIn.'
  },
  {
    num: '4',
    title: 'Analyze & Scale',
    icon: TrendingUp,
    iconColor: 'text-emerald-400',
    targetModule: 'analytics',
    desc: 'Track engagement rates, lead conversions, and audience sentiment while AI self-learns what drives top revenue.'
  }
];

const FLYWHEEL_STEPS = [
  { step: '1', title: 'Strategy', desc: 'AI analyzes niche & generates 30-day growth playbook' },
  { step: '2', title: 'Content', desc: 'Multi-channel video scripts, copy, & visual assets generated' },
  { step: '3', title: 'Schedule', desc: 'Auto-queues posts for peak audience activity hours' },
  { step: '4', title: 'Publish', desc: 'Direct API dispatch to Instagram, TikTok, LinkedIn, X, Facebook, YouTube' },
  { step: '5', title: 'Engage', desc: 'AI Inbox monitors comments and drafts instant responses' },
  { step: '6', title: 'Analyze', desc: 'Full-funnel attribution tracks CTR, leads, and revenue' },
  { step: '7', title: 'Optimize', desc: 'AI Self-Learner adapts future hooks based on top performance' }
];

export default function AIMarketingCommandCenter({
  activeModuleCount = 10,
  onNavigateToModule
}: AIMarketingCommandCenterProps) {
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showPillarsModal, setShowPillarsModal] = useState(false);
  const [showFlywheelModal, setShowFlywheelModal] = useState(false);

  useEffect(() => {
    const handleOpenHowItWorks = () => setShowHowItWorksModal(true);
    const handleOpenPillars = () => setShowPillarsModal(true);

    window.addEventListener('open-how-it-works', handleOpenHowItWorks);
    window.addEventListener('open-pillars-modal', handleOpenPillars);

    return () => {
      window.removeEventListener('open-how-it-works', handleOpenHowItWorks);
      window.removeEventListener('open-pillars-modal', handleOpenPillars);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 🌟 HERO BANNER SECTION (CLEAN & PROFESSIONAL) */}
      <div 
        className="relative bg-[#0B192C] border border-slate-800/90 rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.04) 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px'
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Autonomous AI Marketing System</span>
          </div>

          <p className="text-base md:text-lg font-display text-slate-100 leading-relaxed font-normal">
            We're building the future of autonomous social media marketing. Plan, generate, schedule, engage, and grow your audience seamlessly with an AI-powered command center.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* 🎯 MAIN "HOW AURACAST WORKS" BUTTON */}
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <HelpCircle className="w-4 h-4 text-slate-950 fill-slate-950/20" />
              <span>How AuraCast Works</span>
            </button>

            {/* 🏛️ 10 CORE OS PILLARS BUTTON */}
            <button
              onClick={() => setShowPillarsModal(true)}
              className="bg-slate-900/90 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>10 Core OS Pillars</span>
            </button>

            <button
              onClick={() => onNavigateToModule && onNavigateToModule('strategy')}
              className="bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Start Your AI Campaign</span>
            </button>

            <button
              onClick={() => setShowFlywheelModal(true)}
              className="bg-slate-950/80 hover:bg-slate-900 text-cyan-300 border border-slate-800 font-mono font-bold text-xs px-4 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Explore AI Flywheel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🏛️ CLEAN & PROFESSIONAL PILLARS SUMMARY STRIP */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-sm font-serif font-bold text-white tracking-wide">
                10 Core AI Marketing Operating System Pillars
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                10/10 Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              All ten specialized growth, content, scheduling, inbox, and analytics modules are active and synchronized.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPillarsModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View All 10 Pillars</span>
        </button>
      </div>

      {/* 🚀 "HOW AURACAST WORKS" MODAL DIALOG */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full space-y-6 shadow-2xl relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800/80 relative z-10">
              <div className="space-y-1 max-w-xl">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Interactive Onboarding Guide</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                  How AuraCast Works
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Four simple steps stand between you and an automated, revenue-generating social media presence.
                </p>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 STEPS GRID INSIDE MODAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {FOUR_STEPS.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.num}
                    onClick={() => {
                      setShowHowItWorksModal(false);
                      onNavigateToModule?.(step.targetModule);
                    }}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 transition-all duration-200 cursor-pointer group shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-serif font-bold text-amber-400 text-xs shadow-inner">
                          {step.num}
                        </div>
                        <IconComponent className={`w-5 h-5 ${step.iconColor}`} />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center text-[11px] font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Explore Phase</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 relative z-10">
              <span className="text-[10px] font-mono text-slate-400">
                ⚡ Need custom marketing advice? Open <strong className="text-amber-400">Aura Copilot</strong> anytime.
              </span>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🏛️ "10 CORE OS PILLARS" MODAL DIALOG */}
      {showPillarsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 md:p-8 max-w-5xl w-full space-y-6 shadow-2xl relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800/80 relative z-10">
              <div className="space-y-1 max-w-xl">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Full AI Operating System Architecture</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                  10 Core AI Marketing OS Pillars
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Every module works together in an autonomous loop to handle research, creation, scheduling, inbox replies, and revenue conversion.
                </p>
              </div>
              <button
                onClick={() => setShowPillarsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 10 PILLARS GRID INSIDE MODAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowPillarsModal(false);
                      onNavigateToModule?.(p.id);
                    }}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-2xl space-y-3 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${p.color} flex items-center justify-center text-white shadow-md border border-white/10 group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-amber-400">
                          #{p.number}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-serif font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                          {p.name}
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400 block mt-1 font-bold">
                          ✓ {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center text-[10px] font-mono font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>Open Module</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 relative z-10">
              <span className="text-[10px] font-mono text-emerald-400">
                ✓ 10/10 Operating System Pillars fully synchronized & active
              </span>
              <button
                onClick={() => setShowPillarsModal(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
              >
                Close Pillars View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS FLYWHEEL MODAL */}
      {showFlywheelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  The AuraCast Autonomous AI Growth Flywheel
                </h3>
              </div>
              <button onClick={() => setShowFlywheelModal(false)} className="text-slate-400 hover:text-white cursor-pointer font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              When a user says <strong className="text-cyan-300">"I don't know what to post,"</strong> AuraCast executes a continuous 7-step autonomous flywheel:
            </p>

            <div className="space-y-2">
              {FLYWHEEL_STEPS.map((s) => (
                <div key={s.step} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-3 font-mono text-xs">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 text-slate-950 font-black flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <strong className="text-amber-300 font-bold block">{s.title} Phase</strong>
                    <span className="text-[11px] text-slate-300 font-sans">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFlywheelModal(false)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs py-3 rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              Close Flywheel View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


