import React, { useState } from 'react';
import { TeamWorkspace, TeamMember, ApprovalWorkflowPost, TeamRole } from '../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageCircle,
  FileEdit,
  Building2,
  Lock,
  ChevronRight,
  Eye,
  Check,
  X,
  Sparkles,
  ArrowRight,
  UserCheck,
  Layers
} from 'lucide-react';

interface TeamCollaborationProps {
  workspaceData?: TeamWorkspace;
  onInviteMember: (name: string, email: string, role: TeamRole) => Promise<void>;
  onApprovePost: (postId: string) => Promise<void>;
  onRequestChanges: (postId: string, note: string) => Promise<void>;
  onSubmitPostForReview: (post: Omit<ApprovalWorkflowPost, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  loading: boolean;
}

const DEFAULT_WORKSPACE_SEED: TeamWorkspace = {
  organizationName: 'AuraCast Global Media',
  members: [
    {
      id: 'usr_1',
      name: 'Alex Rivera',
      email: 'alex@auracast.ai',
      role: 'Owner',
      assignedCount: 12,
      status: 'active'
    },
    {
      id: 'usr_2',
      name: 'Sarah Chen',
      email: 'sarah.c@auracast.ai',
      role: 'Marketing Manager',
      assignedCount: 8,
      status: 'active'
    },
    {
      id: 'usr_3',
      name: 'Marcus Vance',
      email: 'marcus.v@auracast.ai',
      role: 'Content Creator',
      assignedCount: 15,
      status: 'active'
    },
    {
      id: 'usr_4',
      name: 'Elena Rostova',
      email: 'elena.r@auracast.ai',
      role: 'Reviewer',
      assignedCount: 5,
      status: 'active'
    }
  ],
  approvalQueue: [
    {
      id: 'appr_1',
      topicTitle: 'Q4 Product Launch - AI Video Feature Reel',
      creatorName: 'Marcus Vance',
      reviewerName: 'Sarah Chen',
      platform: 'Instagram Reel & TikTok',
      contentType: 'Vertical Short Video',
      postContent: '🚀 Stop spending 10+ hours editing videos! Watch how AuraCast generates studio-grade vertical shorts with voiceovers in under 60 seconds.',
      scheduledTime: 'Tomorrow at 5:00 PM',
      status: 'pending_review',
      workflowStage: 'Review',
      version: 2,
      versionHistory: [
        { version: 1, editedBy: 'Marcus Vance', timestamp: '3 hours ago', content: 'Draft version without voiceover mention.', note: 'Initial draft created' },
        { version: 2, editedBy: 'Marcus Vance', timestamp: '2 hours ago', content: '🚀 Stop spending 10+ hours editing videos! Watch how AuraCast generates studio-grade vertical shorts with voiceovers in under 60 seconds.', note: 'Added hook & CTA' }
      ],
      comments: [
        { id: 'cm_1', author: 'Sarah Chen', text: 'Great energy in the opening hook. Ensure brand watermark is placed in top right.', timestamp: '1 hour ago' }
      ],
      createdAt: '2 hours ago'
    },
    {
      id: 'appr_2',
      topicTitle: '3 Proven Hooks for B2B Engagement',
      creatorName: 'Marcus Vance',
      reviewerName: 'Sarah Chen',
      platform: 'LinkedIn Article',
      contentType: 'Infographic Carousel',
      postContent: 'Consistency beats intensity in B2B marketing. Here are the top 3 hook frameworks analyzed across 10,000 top-performing posts.',
      scheduledTime: 'Friday at 9:00 AM',
      status: 'approved',
      workflowStage: 'Approved',
      version: 1,
      versionHistory: [
        { version: 1, editedBy: 'Marcus Vance', timestamp: '1 day ago', content: 'Consistency beats intensity in B2B marketing. Here are the top 3 hook frameworks analyzed across 10,000 top-performing posts.' }
      ],
      comments: [
        { id: 'cm_2', author: 'Sarah Chen', text: 'Approved for distribution. Excellent engagement stats.', timestamp: '18 hours ago' }
      ],
      approvalTimestamp: 'Yesterday at 4:15 PM',
      reviewerNote: 'Approved by Sarah Chen. Clear messaging and great graphic aesthetic.',
      createdAt: '1 day ago'
    },
    {
      id: 'appr_3',
      topicTitle: 'Weekly Community Q&A Highlight',
      creatorName: 'Elena Rostova',
      reviewerName: 'Sarah Chen',
      platform: 'YouTube Community Post',
      contentType: 'Text & Poll',
      postContent: 'Which AI workflow saved you the most time this month? Vote below!',
      scheduledTime: 'In 3 days',
      status: 'changes_requested',
      workflowStage: 'Draft',
      version: 1,
      versionHistory: [
        { version: 1, editedBy: 'Elena Rostova', timestamp: '3 hours ago', content: 'Which AI workflow saved you the most time this month? Vote below!' }
      ],
      comments: [
        { id: 'cm_3', author: 'Sarah Chen', text: 'Please refine options before publishing.', timestamp: '2 hours ago' }
      ],
      rejectionReason: 'Missing poll choices for Shorts vs Reels comparisons.',
      reviewerNote: 'Please add 4 poll choices specifically referencing YouTube shorts vs Instagram Reels.',
      createdAt: '3 hours ago'
    }
  ]
};

const ROLES_LIST: { role: TeamRole; badgeColor: string; description: string }[] = [
  { role: 'Owner', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30', description: 'Full admin rights & billing control' },
  { role: 'Admin', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', description: 'Manages team & platform integrations' },
  { role: 'Marketing Manager', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', description: 'Approves content & oversees campaigns' },
  { role: 'Content Creator', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', description: 'Drafts posts & video scripts' },
  { role: 'Reviewer', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30', description: 'Evaluates compliance & brand guidelines' },
  { role: 'Viewer', badgeColor: 'bg-slate-800 text-slate-400 border-slate-700', description: 'Read-only analytics & reporting' }
];

export default function TeamCollaboration({
  workspaceData = DEFAULT_WORKSPACE_SEED,
  onInviteMember,
  onApprovePost,
  onRequestChanges,
  onSubmitPostForReview,
  loading
}: TeamCollaborationProps) {
  const data = workspaceData || DEFAULT_WORKSPACE_SEED;

  const [activeTab, setActiveTab] = useState<'queue' | 'members' | 'new_post'>('queue');
  const [filterQueueStatus, setFilterQueueStatus] = useState<string>('all');

  // Invite Member Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('Content Creator');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Changes Request Form
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [changeNote, setChangeNote] = useState('');

  // Submit New Post for Review
  const [newTopic, setNewTopic] = useState('');
  const [newPlatform, setNewPlatform] = useState('Instagram');
  const [newContent, setNewContent] = useState('');
  const [newScheduledTime, setNewScheduledTime] = useState('Tomorrow at 10:00 AM');
  const [postSubmitSuccess, setPostSubmitSuccess] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    try {
      await onInviteMember(inviteName, inviteEmail, inviteRole);
      setInviteName('');
      setInviteEmail('');
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newContent.trim()) return;
    try {
      await onSubmitPostForReview({
        topicTitle: newTopic,
        creatorName: 'Marcus Vance (Creator)',
        platform: newPlatform,
        contentType: 'Social Post',
        postContent: newContent,
        scheduledTime: newScheduledTime,
        workflowStage: 'Review',
        version: 1,
        versionHistory: [{ version: 1, editedBy: 'Marcus Vance', timestamp: 'Just now', content: newContent }],
        comments: []
      });
      setNewTopic('');
      setNewContent('');
      setPostSubmitSuccess(true);
      setTimeout(() => setPostSubmitSuccess(false), 3000);
      setActiveTab('queue');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQueue = data.approvalQueue.filter((p) => {
    if (filterQueueStatus === 'all') return true;
    return p.status === filterQueueStatus;
  });

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Team Collaboration & Editorial Approval Workflows
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5 text-cyan-400" />
                Enterprise Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Creator → Reviewer → Manager Approval → Automated Multi-Channel Publishing Pipeline.
            </p>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('queue')}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Approval Queue ({data.approvalQueue.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Team Members ({data.members.length})
          </button>
          <button
            onClick={() => setActiveTab('new_post')}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'new_post'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + Submit Post
          </button>
        </div>
      </div>

      {/* SUITABLE ORGANIZATIONS BADGES */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
        <span className="font-bold text-slate-300 uppercase text-[10px]">🏢 Suitable For:</span>
        {['Companies', 'Agencies', 'NGOs & Non-Profits', 'Schools', 'Churches', 'Government Orgs', 'SMEs'].map((org) => (
          <span key={org} className="bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded text-slate-300">
            ✓ {org}
          </span>
        ))}
      </div>

      {/* TAB 1: EDITORIAL APPROVAL QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Pending Content Approvals
            </h3>

            <div className="flex items-center gap-1.5">
              {['all', 'pending_review', 'approved', 'changes_requested'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterQueueStatus(st)}
                  className={`text-[10px] font-mono capitalize px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    filterQueueStatus === st
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQueue.map((post) => (
              <div
                key={post.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3.5 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                      {post.platform}
                    </span>

                    {post.status === 'pending_review' && (
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                        ⏳ Pending Review
                      </span>
                    )}
                    {post.status === 'approved' && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                        ✅ Approved
                      </span>
                    )}
                    {post.status === 'changes_requested' && (
                      <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                        💬 Feedback Needed
                      </span>
                    )}
                  </div>

                  {/* WORKFLOW STAGE STEPPER PIPELINE */}
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Content Lifecycle Stage:</span>
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      {['Draft', 'Review', 'Approved', 'Scheduled', 'Published'].map((stage, idx) => {
                        const isCurrent = post.workflowStage === stage || (post.status === 'approved' && stage === 'Approved') || (post.status === 'changes_requested' && stage === 'Draft');
                        return (
                          <div key={stage} className="flex items-center gap-0.5">
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              isCurrent
                                ? 'bg-cyan-500 text-slate-950 font-black'
                                : 'text-slate-500 bg-slate-950'
                            }`}>
                              {stage}
                            </span>
                            {idx < 4 && <span className="text-slate-600">→</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans leading-tight">
                    {post.topicTitle}
                  </h4>

                  <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span>Creator: <strong className="text-slate-200">{post.creatorName}</strong></span>
                      <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-bold">
                        v{post.version || 1}
                      </span>
                    </div>
                    {post.reviewerName && (
                      <div>Reviewer: <span className="text-slate-200 font-bold">{post.reviewerName}</span></div>
                    )}
                    {post.approvalTimestamp && (
                      <div className="text-emerald-400">Approved At: {post.approvalTimestamp}</div>
                    )}
                    <div>Target Schedule: <span className="text-slate-300">{post.scheduledTime}</span></div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans leading-relaxed">
                    "{post.postContent}"
                  </div>

                  {post.rejectionReason && (
                    <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-2 text-[10px] font-sans text-rose-200 space-y-0.5">
                      <strong className="block font-mono uppercase font-bold text-rose-300">Rejection Reason:</strong>
                      <p>{post.rejectionReason}</p>
                    </div>
                  )}

                  {post.reviewerNote && (
                    <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 text-[11px] font-sans text-amber-200/90 space-y-0.5">
                      <strong className="block font-mono text-[9px] uppercase font-bold">Reviewer / Manager Notes:</strong>
                      <p>{post.reviewerNote}</p>
                    </div>
                  )}

                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Reviewer Comments ({post.comments.length}):</span>
                      {post.comments.map((cm) => (
                        <div key={cm.id} className="text-[10px] font-sans text-slate-300">
                          <strong className="text-cyan-300">{cm.author}:</strong> "{cm.text}" <span className="text-[9px] text-slate-500 font-mono">({cm.timestamp})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* APPROVAL ACTION CONTROLS */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {post.status === 'pending_review' ? (
                    <>
                      <button
                        onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                        className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        onClick={() => onApprovePost(post.id)}
                        className="text-[10px] font-mono bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/40 transition-all cursor-pointer font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approve Post</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 italic">
                      Workflow stage complete
                    </span>
                  )}
                </div>

                {/* REQUEST CHANGES NOTE MODAL / INLINE INPUT */}
                {selectedPostId === post.id && (
                  <div className="pt-2 space-y-2 bg-slate-900 p-3 rounded-xl border border-amber-500/30">
                    <textarea
                      value={changeNote}
                      onChange={(e) => setChangeNote(e.target.value)}
                      placeholder="Add specific feedback for creator..."
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2 rounded-lg focus:outline-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedPostId(null)}
                        className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onRequestChanges(post.id, changeNote);
                          setSelectedPostId(null);
                          setChangeNote('');
                        }}
                        className="text-[10px] font-mono bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded"
                      >
                        Send Feedback
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TEAM MEMBERS & ROLES */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MEMBERS LIST */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Workspace Roster ({data.members.length} Active Users)
            </h3>

            <div className="space-y-2">
              {data.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold font-mono text-sm">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{member.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border ${
                      ROLES_LIST.find((r) => r.role === member.role)?.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}>
                      {member.role}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {member.assignedCount} Posts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INVITE NEW MEMBER FORM */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Invite New Team Member</span>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. david@company.com"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.role} — {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !inviteName.trim() || !inviteEmail.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition-all cursor-pointer border border-white/10 disabled:opacity-50"
              >
                {inviteSuccess ? 'Invitation Sent!' : 'Send Team Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMIT NEW POST FOR APPROVAL */}
      {activeTab === 'new_post' && (
        <div className="max-w-2xl mx-auto bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
            <FileEdit className="w-4 h-4 text-cyan-400" />
            <span>Submit Post to Editorial Review Queue</span>
          </div>

          <form onSubmit={handleCreatePostSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Campaign Topic Title</label>
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. Q4 Growth Case Study Reel"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
                >
                  {['Instagram', 'YouTube', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Schedule</label>
                <input
                  type="text"
                  value={newScheduledTime}
                  onChange={(e) => setNewScheduledTime(e.target.value)}
                  placeholder="e.g. Tomorrow at 5:00 PM"
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Post Draft Content</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Write the exact caption, copy, or script here..."
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newTopic.trim() || !newContent.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all cursor-pointer border border-white/10"
            >
              {postSubmitSuccess ? 'Submitted for Review!' : 'Submit to Manager for Approval'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
