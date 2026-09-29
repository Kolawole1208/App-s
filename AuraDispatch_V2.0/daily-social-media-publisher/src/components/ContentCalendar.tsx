import React, { useState } from 'react';
import { TopicItem, SocialChannel } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Heart,
  Share2,
  List,
  Grid,
  Zap,
  MoreVertical,
  ArrowRight,
  Edit3,
  CalendarDays,
  Tag
} from 'lucide-react';

interface ContentCalendarProps {
  topics: TopicItem[];
  channels: SocialChannel[];
  onRescheduleTopic: (topicId: string, newDate: string, newScheduledFor?: string) => Promise<void>;
  onUpdateTopicStatus: (topicId: string, newStatus: TopicItem['status']) => Promise<void>;
  onSelectTopic: (topicId: string) => void;
  onPublishTopic: (topicId: string) => Promise<void>;
  loading: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  draft: {
    label: 'Draft',
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-700',
    dot: 'bg-slate-400'
  },
  generating: {
    label: 'Generating AI',
    bg: 'bg-purple-900/40',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400 animate-pulse'
  },
  generated: {
    label: 'AI Generated',
    bg: 'bg-indigo-900/40',
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-400'
  },
  ai_generated: {
    label: 'AI Generated',
    bg: 'bg-indigo-900/40',
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-400'
  },
  needs_approval: {
    label: 'Needs Approval',
    bg: 'bg-amber-900/40',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400'
  },
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-cyan-900/40',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-400'
  },
  published: {
    label: 'Published',
    bg: 'bg-emerald-900/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400'
  },
  failed: {
    label: 'Failed',
    bg: 'bg-rose-900/40',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400'
  }
};

const PLATFORM_ICONS: Record<string, { label: string; color: string }> = {
  instagram: { label: 'IG', color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white' },
  whatsapp: { label: 'WA', color: 'bg-emerald-600 text-white' },
  facebook: { label: 'FB', color: 'bg-blue-600 text-white' },
  twitter: { label: 'X', color: 'bg-slate-800 text-white' },
  youtube: { label: 'YT', color: 'bg-red-600 text-white' }
};

export default function ContentCalendar({
  topics,
  channels,
  onRescheduleTopic,
  onUpdateTopicStatus,
  onSelectTopic,
  onPublishTopic,
  loading
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 10)); // August 2026 anchor
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [draggedTopicId, setDraggedTopicId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [rescheduleDateInput, setRescheduleDateInput] = useState<string>('');
  const [rescheduleTimeInput, setRescheduleTimeInput] = useState<string>('09:30');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar days for month view
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const calendarCells = [];
  // Padding cells before first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dayNumber: d, dateStr: dayStr });
  }

  // Filter topics
  const filteredTopics = topics.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) {
      if (statusFilter === 'generated' && (t.status === 'generated' || t.status === 'ai_generated')) {
        // match
      } else {
        return false;
      }
    }
    if (platformFilter !== 'all') {
      if (!t.publishChannels || !t.publishChannels.includes(platformFilter)) {
        return false;
      }
    }
    return true;
  });

  // Group topics by date
  const topicsByDate: Record<string, TopicItem[]> = {};
  filteredTopics.forEach(t => {
    const dStr = t.date ? t.date.split('T')[0] : t.scheduledFor ? t.scheduledFor.split('T')[0] : new Date().toISOString().split('T')[0];
    if (!topicsByDate[dStr]) topicsByDate[dStr] = [];
    topicsByDate[dStr].push(t);
  });

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, topicId: string) => {
    e.dataTransfer.setData('text/plain', topicId);
    setDraggedTopicId(topicId);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDropTargetDate(dateStr);
  };

  const handleDragLeave = () => {
    setDropTargetDate(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const topicId = e.dataTransfer.getData('text/plain') || draggedTopicId;
    setDropTargetDate(null);
    setDraggedTopicId(null);

    if (topicId && targetDateStr) {
      const topicToMove = topics.find(t => t.id === topicId);
      if (topicToMove && topicToMove.date !== targetDateStr) {
        const isoScheduled = `${targetDateStr}T${rescheduleTimeInput}:00.000Z`;
        await onRescheduleTopic(topicId, targetDateStr, isoScheduled);
      }
    }
  };

  const openRescheduleModal = (t: TopicItem) => {
    setEditingTopic(t);
    const d = t.date || new Date().toISOString().split('T')[0];
    setRescheduleDateInput(d);
  };

  const handleSaveRescheduleModal = async () => {
    if (editingTopic && rescheduleDateInput) {
      const isoScheduled = `${rescheduleDateInput}T${rescheduleTimeInput}:00.000Z`;
      await onRescheduleTopic(editingTopic.id, rescheduleDateInput, isoScheduled);
      setEditingTopic(null);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* Calendar Top Control Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <CalendarIcon className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                AI Content Calendar & Scheduling Hub
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded tracking-widest uppercase">
                Drag & Drop Control Center
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Plan, organize, approval-queue, and reschedule posts across all connected channels.
            </p>
          </div>
        </div>

        {/* View Switchers & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-between lg:justify-end">
          {/* Month Navigator */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-200 px-3 min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/20 transition-all cursor-pointer ml-1"
            >
              Today
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filter Hub:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="generated">AI Generated</option>
            <option value="needs_approval">Needs Approval</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Social Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter / X</option>
            <option value="youtube">YouTube Shorts</option>
          </select>
        </div>
      </div>

      {/* MONTH GRID VIEW */}
      {viewMode === 'month' && (
        <div className="space-y-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div key={`empty_${idx}`} className="bg-slate-950/20 border border-slate-800/30 rounded-xl min-h-[110px]" />
                );
              }

              const { dayNumber, dateStr } = cell;
              const dayTopics = topicsByDate[dateStr] || [];
              const isDropTarget = dropTargetDate === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dateStr}
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  className={`min-h-[120px] p-2 bg-slate-950/60 border rounded-xl flex flex-col justify-between transition-all ${
                    isDropTarget
                      ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-500/50'
                      : isToday
                      ? 'border-indigo-500/50 bg-indigo-950/20'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/50">
                    <span className={`text-xs font-mono font-bold ${isToday ? 'text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded' : 'text-slate-400'}`}>
                      {dayNumber}
                    </span>
                    {dayTopics.length > 0 && (
                      <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                        {dayTopics.length} posts
                      </span>
                    )}
                  </div>

                  {/* Day Topics List */}
                  <div className="space-y-1.5 mt-1.5 flex-1 overflow-y-auto max-h-[160px] custom-scrollbar">
                    {dayTopics.map((t) => {
                      const statusCfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onClick={() => onSelectTopic(t.id)}
                          className={`p-2 rounded-lg border text-left cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all space-y-1 ${statusCfg.bg} ${statusCfg.border}`}
                          title="Click to view in Studio or Drag to Reschedule"
                        >
                          <div className="flex items-center justify-between gap-1">
                            {/* Status Indicator */}
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                              <span className={`text-[9px] font-mono font-bold ${statusCfg.text}`}>
                                {statusCfg.label}
                              </span>
                            </div>

                            {/* Reschedule trigger icon */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRescheduleModal(t);
                              }}
                              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800"
                              title="Quick Reschedule Date/Time"
                            >
                              <Clock className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <p className="text-[10px] font-sans font-medium text-slate-200 line-clamp-2 leading-tight">
                            {t.topic}
                          </p>

                          {/* Platforms Icons */}
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-1">
                              {t.publishChannels?.map((ch) => {
                                const plat = PLATFORM_ICONS[ch];
                                return plat ? (
                                  <span
                                    key={ch}
                                    className={`text-[8px] font-mono font-bold px-1 rounded ${plat.color}`}
                                  >
                                    {plat.label}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TIMELINE LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-sans italic border border-dashed border-slate-800 rounded-xl">
              No content items matching the selected filter criteria.
            </div>
          ) : (
            filteredTopics.map((t) => {
              const statusCfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer hover:bg-slate-900/60"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-cyan-400" />
                        {t.date || t.scheduledFor?.split('T')[0] || 'Unscheduled'}
                      </span>

                      {t.toneGoal && (
                        <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase font-semibold">
                          #{t.toneGoal}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white font-sans leading-relaxed">
                      "{t.topic}"
                    </h4>

                    {/* Captions Preview */}
                    {t.generatedContent && (
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-1 italic">
                        "{t.generatedContent.caption}"
                      </p>
                    )}
                  </div>

                  {/* Channels & Action Controls */}
                  <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                    <div className="flex items-center gap-1">
                      {t.publishChannels?.map((ch) => {
                        const plat = PLATFORM_ICONS[ch];
                        return plat ? (
                          <span key={ch} className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${plat.color}`}>
                            {plat.label}
                          </span>
                        ) : null;
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRescheduleModal(t);
                        }}
                        className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Reschedule</span>
                      </button>

                      {t.status !== 'published' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPublishTopic(t.id);
                          }}
                          disabled={loading}
                          className="text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Publish Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* QUICK RESCHEDULE MODAL */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Reschedule Post Execution</span>
              </div>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 font-sans font-semibold">
                "{editingTopic.topic}"
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Select Execution Date
                </label>
                <input
                  type="date"
                  value={rescheduleDateInput}
                  onChange={(e) => setRescheduleDateInput(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Select Target Posting Time
                </label>
                <input
                  type="time"
                  value={rescheduleTimeInput}
                  onChange={(e) => setRescheduleTimeInput(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingTopic(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRescheduleModal}
                className="text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
