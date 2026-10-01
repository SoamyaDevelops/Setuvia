import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';
import SetuviaLogo from '../components/SetuviaLogo';
import { Nav } from '../components/layout/Nav';

export default function LegalPage({ initialTab = 'privacy' }) {
  const location = useLocation();
  const isTerms = location.pathname.includes('/terms') || initialTab === 'terms';
  const [activeTab, setActiveTab] = useState(isTerms ? 'terms' : 'privacy');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
      <Nav />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8 glass px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <SetuviaLogo size={44} className="w-11 h-11" />
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Setuvia Legal & Governance
            </h1>
            <p className="text-sm text-muted-foreground">Compliance, Security, and Customer Trust Commitments</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-foreground text-background font-bold shadow-md'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-foreground text-background font-bold shadow-md'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
        </div>

        {/* Content Box */}
        <div className="glass-strong noise border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl space-y-6 text-sm text-muted-foreground leading-relaxed">
          {activeTab === 'privacy' ? (
            <>
              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-foreground" />
                  1. Information We Collect
                </h2>
                <p>
                  Setuvia collects information necessary to deliver autonomous customer issue resolution, including your name, email address, and profile photo when authenticating through Google Identity Services. We also store session records and support inquiry payloads strictly for resolving support cases.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">
                  2. AI Processing & Google Gemini Guardrails
                </h2>
                <p>
                  Customer inquiries and uploaded documents are analyzed by Google Gemini AI models strictly to identify billing discrepancies, extract relevant metadata, and draft resolution options. 
                  <strong className="text-foreground font-semibold"> All sensitive Personally Identifiable Information (PII) is masked</strong> prior to model dispatch. Your customer data is never used to train public or foundational AI models.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">
                  3. Data Security & Encryption
                </h2>
                <p>
                  All customer transactions and audit entries are encrypted using industry-standard TLS 1.3 in transit and AES-256 at rest. Financial actions (such as refund authorizations) are recorded in an immutable ledger with role-based access control.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">
                  4. Your Rights (DPDP & GDPR Compliance)
                </h2>
                <p>
                  You possess the statutory right to request erasure, modification, or export of your account data and support history at any time. Submit statutory requests through the Setuvia Administration portal.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground" />
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing the Setuvia platform, Customer Portal, Agent OS, or Governance Console, you agree to comply with these Terms of Service. If you are using Setuvia on behalf of an enterprise entity, you represent that you possess the requisite authority to bind that organization.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">
                  2. Role-Based Clearance & Authorized Use
                </h2>
                <p>
                  Access to operational workspaces is governed by cryptographic clearance roles: Customer, Agent, or Administrator. Users may not attempt to circumvent policy thresholds, reverse engineer resolution algorithms, or deploy automated scraping tools against Setuvia APIs.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">
                  3. Deterministic Policy Guardrails
                </h2>
                <p>
                  Autonomous resolutions, refunds, and compensations calculated by Setuvia are strictly bounded by enterprise policy rules (e.g., automated refund caps and manager multi-sig requirements). The system reserves the right to intercept and route high-value transactions to human senior leads.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">
                  4. Limitation of Liability
                </h2>
                <p>
                  Setuvia provides resolution intelligence on an "as-is" and "as-available" basis. We are committed to 99.9% platform availability as defined in our enterprise service level agreements.
                </p>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}
