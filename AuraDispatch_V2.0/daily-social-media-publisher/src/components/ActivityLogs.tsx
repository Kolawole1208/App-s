import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw, Terminal, Clock, TrendingUp, BarChart2, MessageSquare, Twitter, Instagram, Facebook, RefreshCw as SyncIcon, AlertCircle as InfoIcon, Zap, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

export default function ActivityLogs({ logs }: ActivityLogsProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'engagement'>('events');
  const [isPolled, setIsPolled] = useState(false);
  const [pollingStatus, setPollingStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 7-day engagement statistics state (trends of comment counts across channels)
  const [trendData, setTrendData] = useState([
    { day: 'Mon', Twitter: 14, Instagram: 22, Facebook: 8, WhatsApp: 4 },
    { day: 'Tue', Twitter: 22, Instagram: 30, Facebook: 15, WhatsApp: 6 },
    { day: 'Wed', Twitter: 19, Instagram: 28, Facebook: 12, WhatsApp: 9 },
    { day: 'Thu', Twitter: 34, Instagram: 45, Facebook: 22, WhatsApp: 14 },
    { day: 'Fri', Twitter: 45, Instagram: 52, Facebook: 30, WhatsApp: 18 },
    { day: 'Sat', Twitter: 60, Instagram: 74, Facebook: 48, WhatsApp: 25 },
    { day: 'Sun', Twitter: 78, Instagram: 92, Facebook: 55, WhatsApp: 32 }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActionTheme = (action: string) => {
    switch (action) {
      case 'generation':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'posting':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'scheduling':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-800';
    }
  };

  // Simulating live polling of Twitter and other platform comments
  const handlePollMetrics = () => {
    setIsPolled(true);
    setSuccessMessage(null);
    setPollingStatus('Opening handshake with social API endpoints...');

    setTimeout(() => {
      setPollingStatus('Parsing incoming Twitter webhook stream metrics...');
      
      setTimeout(() => {
        setPollingStatus('Analyzing comments sentiment and payload index...');

        setTimeout(() => {
          // Increment the last day's counts to simulate dynamic live feedback arriving!
          setTrendData(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            updated[lastIdx] = {
              ...updated[lastIdx],
              Twitter: updated[lastIdx].Twitter + 12,
              Instagram: updated[lastIdx].Instagram + 8,
              Facebook: updated[lastIdx].Facebook + 4,
              WhatsApp: updated[lastIdx].WhatsApp + 2,
            };
            return updated;
          });

          setIsPolled(false);
          setSuccessMessage('Successfully fetched live engagement! Discovered +12 Twitter mentions and +8 Instagram comments in the last hour.');
          setPollingStatus('');
        }, 800);
      }, 800);
    }, 700);
  };

  const handleExportCSV = () => {
    // CSV Header
    const headers = ['Day', 'Twitter Comments', 'Instagram Comments', 'Facebook Comments', 'WhatsApp Comments', 'Total Comments'];
    
    // CSV Rows
    const rows = trendData.map(row => {
      const total = row.Twitter + row.Instagram + row.Facebook + row.WhatsApp;
      return [row.day, row.Twitter, row.Instagram, row.Facebook, row.WhatsApp, total];
    });

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'auracast_7day_comments_metrics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMessage('Successfully exported 7-day comment analytics CSV!');
  };

  // Quick helper to calculate totals
  const totalTwitter = trendData.reduce((acc, curr) => acc + curr.Twitter, 0);
  const totalInstagram = trendData.reduce((acc, curr) => acc + curr.Instagram, 0);
  const totalFacebook = trendData.reduce((acc, curr) => acc + curr.Facebook, 0);
  const totalAll = totalTwitter + totalInstagram + totalFacebook;

  return (
    <div className="bg-slate-900/65 backdrop-blur-xl rounded-2xl border border-slate-800/90 shadow-2xl p-6 ring-1 ring-white/5 relative overflow-hidden group">
      {/* Background radial highlight */}
      <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />

      {/* Title block with Tab Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10 border-b border-slate-800/65 pb-4">
        <div>
          <h2 className="text-base font-display font-semibold text-white tracking-tight">System Events & Social Metrics</h2>
          <p className="text-xs text-slate-450 font-sans mt-0.5">Real-time tracker of operations & audience comments</p>
        </div>

        {/* Dynamic Switch Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-sans rounded-lg transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Events Feed
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-sans rounded-lg transition-all cursor-pointer ${
              activeTab === 'engagement'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Live Comments
          </button>
        </div>
      </div>

      {activeTab === 'events' ? (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 relative z-10 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="p-10 text-center border border-slate-800/60 border-dashed rounded-xl">
              <p className="text-xs text-slate-500 font-sans italic">No background events registered yet today</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl transition-all hover:border-slate-700 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {getStatusIcon(log.status)}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getActionTheme(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  {log.topicTitle && (
                    <p className="text-[10px] font-semibold text-indigo-400 truncate font-sans">
                      Topic: "{log.topicTitle}"
                    </p>
                  )}
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {log.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-5 relative z-10">
          
          {/* Quick Platform Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/85 border border-slate-850 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400 font-sans uppercase">
                <Twitter className="w-3.5 h-3.5" /> Twitter (X)
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white font-sans tracking-tight">{totalTwitter}</span>
                <span className="text-[9px] font-bold text-emerald-400 font-mono">+14.2%</span>
              </div>
              <p className="text-[9px] text-slate-500 font-sans">Total comments this week</p>
            </div>

            <div className="p-3 bg-slate-950/85 border border-slate-850 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-400 font-sans uppercase">
                <Instagram className="w-3.5 h-3.5" /> Instagram
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white font-sans tracking-tight">{totalInstagram}</span>
                <span className="text-[9px] font-bold text-emerald-400 font-mono">+19.5%</span>
              </div>
              <p className="text-[9px] text-slate-500 font-sans">Total comments this week</p>
            </div>

            <div className="p-3 bg-slate-950/85 border border-slate-850 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 font-sans uppercase">
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white font-sans tracking-tight">{totalFacebook}</span>
                <span className="text-[9px] font-bold text-emerald-400 font-mono">+8.4%</span>
              </div>
              <p className="text-[9px] text-slate-500 font-sans">Total comments this week</p>
            </div>

            <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 font-sans uppercase">
                <Zap className="w-3.5 h-3.5" /> Total Index
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white font-sans tracking-tight">{totalAll}</span>
                <span className="text-[9px] font-bold text-indigo-400 font-mono">Live</span>
              </div>
              <p className="text-[9px] text-indigo-400/70 font-sans">Aggregate engagement</p>
            </div>
          </div>

          {/* Interactive Recharts 7-Day Comment Trend Area Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 h-64 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#020617', 
                    borderColor: '#334155', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'sans-serif'
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: '#94a3b8' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'sans-serif', color: '#94a3b8' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Twitter" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTwitter)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Instagram" 
                  stroke="#f472b6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorInstagram)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Facebook" 
                  stroke="#818cf8" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorFacebook)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Simulated API Fetch Trigger to pull in comments count */}
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-300 font-sans flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Webhook & Stream Polling
              </span>
              <span className="text-[9px] text-slate-500 font-sans block leading-normal">
                Trigger real-time fetch simulations to count comments, replies, and mentions on pushed Twitter/X posts.
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold font-sans rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3 h-3 text-indigo-400" />
                Export Metrics CSV
              </button>
              
              <button
                type="button"
                onClick={handlePollMetrics}
                disabled={isPolled}
                className="px-3 py-1.5 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-sans rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <SyncIcon className={`w-3 h-3 ${isPolled ? 'animate-spin' : ''}`} />
                {isPolled ? 'Polling Stream...' : 'Poll Live Comments'}
              </button>
            </div>
          </div>

          {/* Live Action/Feedback Indicators */}
          {isPolled && (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/15 rounded-lg text-[10px] text-indigo-400 font-mono animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{pollingStatus}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/15 rounded-lg text-[10px] text-emerald-400 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
