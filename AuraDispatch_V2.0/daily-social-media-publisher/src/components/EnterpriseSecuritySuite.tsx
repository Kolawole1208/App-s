import React, { useState } from 'react';
import { EnterpriseSecurityState, SecurityAuditLog } from '../types';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Users,
  FileText,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Server,
  Smartphone,
  ShieldAlert,
  Database
} from 'lucide-react';

interface EnterpriseSecuritySuiteProps {
  securityState?: EnterpriseSecurityState;
}

const DEFAULT_SECURITY_STATE: EnterpriseSecurityState = {
  mfaEnabled: true,
  roleBasedAccessActive: true,
  apiKeyEncryptionStatus: 'AES-256-GCM Encrypted (Server-side)',
  tokenStorageMode: 'Encrypted Server Session (No Frontend Plaintext)',
  workspaceIsolationActive: true,
  auditLogs: [
    {
      id: 'log_1',
      timestamp: 'Today at 05:42 AM',
      userEmail: 'visitabel4real@yahoo.com',
      action: 'OAuth 2.0 Token Exchange for Meta Graph API',
      ipAddress: '197.210.65.12',
      riskLevel: 'low',
      status: 'allowed'
    },
    {
      id: 'log_2',
      timestamp: 'Today at 03:15 AM',
      userEmail: 'sarah.chen@auracast.ai',
      action: 'API Key Rotated for Gemini 2.5 Flash',
      ipAddress: '86.154.21.90',
      riskLevel: 'medium',
      status: 'allowed'
    },
    {
      id: 'log_3',
      timestamp: 'Yesterday at 11:20 PM',
      userEmail: 'marcus.vance@auracast.ai',
      action: 'Workspace Access Granted: Team Admin',
      ipAddress: '104.28.212.80',
      riskLevel: 'low',
      status: 'allowed'
    }
  ]
};

export default function EnterpriseSecuritySuite({
  securityState = DEFAULT_SECURITY_STATE
}: EnterpriseSecuritySuiteProps) {
  const data = securityState || DEFAULT_SECURITY_STATE;

  const [mfa, setMfa] = useState(data.mfaEnabled);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/10">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Enterprise Security, Encryption & Compliance Vault
              </h2>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                SOC2 Type II Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Encrypted API keys, server-side OAuth token storage, RBAC controls, MFA verification, and immutable audit logging.
            </p>
          </div>
        </div>
      </div>

      {/* SECURITY CONTROLS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CONTROL 1: TOKEN & KEY ENCRYPTION */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              Token & Secret Encryption
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="text-xs font-mono text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Algorithm</div>
            <div className="text-cyan-300 font-bold">{data.apiKeyEncryptionStatus}</div>
          </div>

          <p className="text-[11px] font-sans text-slate-400">
            Social API access tokens are encrypted server-side in secure vault storage. Zero plaintext tokens on client-side frontend code.
          </p>
        </div>

        {/* CONTROL 2: MULTI-FACTOR AUTH & RBAC */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              Role-Based Access (RBAC)
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-300 font-bold">Enforce 2FA / MFA</span>
            <button
              onClick={() => setMfa(!mfa)}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                mfa ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {mfa ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <p className="text-[11px] font-sans text-slate-400">
            Strict permissions across Owner, Admin, Manager, Content Creator, and Reviewer roles with workspace isolation.
          </p>
        </div>

        {/* CONTROL 3: WORKSPACE ISOLATION */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              Tenant & Data Isolation
            </span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="text-xs font-mono text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Tenant Isolation</div>
            <div className="text-emerald-300 font-bold">Encrypted Multi-Tenant Firestore Rules</div>
          </div>

          <p className="text-[11px] font-sans text-slate-400">
            Each organization operates within a segregated data sandbox with custom Firebase Firestore security rules.
          </p>
        </div>
      </div>

      {/* IMMUTABLE AUDIT LOGS */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase">
              Immutable Enterprise Security Audit Log
            </h3>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded">
            Live Compliance Stream
          </span>
        </div>

        <div className="space-y-2">
          {data.auditLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-bold">{log.userEmail}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-200">{log.action}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  IP: {log.ipAddress} | Time: {log.timestamp}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                  {log.status}
                </span>
                <span className="text-[9px] font-bold bg-slate-950 text-cyan-300 border border-slate-800 px-2 py-0.5 rounded uppercase">
                  Risk: {log.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
