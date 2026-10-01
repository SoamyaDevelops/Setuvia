import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';
import SetuviaLogo from './SetuviaLogo';

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-up">
      <div className="w-full max-w-2xl bg-[#0f1115] border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <SetuviaLogo size={32} className="w-8 h-8" />
            <div>
              <h2 className="text-base font-display font-bold text-foreground flex items-center gap-2">
                Setuvia Legal & Governance
              </h2>
              <p className="text-xs text-muted-foreground">Compliance, Security & User Agreement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 pt-4 pb-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-foreground text-background font-bold shadow-sm'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-foreground text-background font-bold shadow-sm'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 text-xs text-muted-foreground leading-relaxed space-y-4 py-2">
          {activeTab === 'privacy' ? (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-foreground" />
                  1. Information We Collect
                </h3>
                <p>
                  Setuvia collects information necessary to deliver autonomous customer issue resolution, including your name, email address, and profile photo when authenticating through Google Identity Services. We also store session records and support inquiry payloads strictly for resolving support cases.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  2. AI Processing & Google Gemini Guardrails
                </h3>
                <p>
                  Customer inquiries and uploaded documents are analyzed by Google Gemini AI models strictly to identify billing discrepancies, extract relevant metadata, and draft resolution options. 
                  <strong className="text-foreground font-semibold"> All sensitive Personally Identifiable Information (PII) is masked</strong> prior to model dispatch. Your customer data is never used to train public or foundational AI models.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  3. Data Security & Encryption
                </h3>
                <p>
                  All customer transactions and audit entries are encrypted using industry-standard TLS 1.3 in transit and AES-256 at rest. Financial actions (such as refund authorizations) are recorded in an immutable ledger with role-based access control.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  4. Your Rights (DPDP & GDPR Compliance)
                </h3>
                <p>
                  You possess the statutory right to request erasure, modification, or export of your account data and support history at any time. Submit statutory requests through the Setuvia Administration portal.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing the Setuvia platform, Customer Portal, Agent OS, or Governance Console, you agree to comply with these Terms of Service. If you are using Setuvia on behalf of an enterprise entity, you represent that you possess the requisite authority to bind that organization.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  2. Role-Based Clearance & Authorized Use
                </h3>
                <p>
                  Access to operational workspaces is governed by cryptographic clearance roles: Customer, Agent, or Administrator. Users may not attempt to circumvent policy thresholds, reverse engineer resolution algorithms, or deploy automated scraping tools against Setuvia APIs.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  3. Deterministic Policy Guardrails
                </h3>
                <p>
                  Autonomous resolutions, refunds, and compensations calculated by Setuvia are strictly bounded by enterprise policy rules (e.g., automated refund caps and manager multi-sig requirements). The system reserves the right to intercept and route high-value transactions to human senior leads.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  4. Limitation of Liability
                </h3>
                <p>
                  Setuvia provides resolution intelligence on an "as-is" and "as-available" basis. We are committed to 99.9% platform availability as defined in our enterprise service level agreements.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground/60">
            Last updated: October 2026 • Setuvia Engine v2.4
          </span>
          <button
            type="button"
            onClick={onClose}
            className="skeu-btn px-4 py-2 rounded-xl text-xs font-semibold bg-foreground text-background hover:scale-105 active:scale-95 transition-all"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
