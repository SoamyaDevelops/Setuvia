import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, Scale, Building2 } from 'lucide-react';
import SetuviaLogo from '../components/SetuviaLogo';
import { Nav } from '../components/layout/Nav';

export default function TermsOfService() {
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
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/40">
          <SetuviaLogo size={48} className="w-12 h-12" />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] bg-foreground/10 text-foreground mb-2">
              <FileText className="w-3.5 h-3.5 text-foreground" />
              <span>Enterprise User Agreement</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Effective Date: October 1, 2026 • Setuvia Autonomous Resolution Platform
            </p>
          </div>
        </div>

        {/* Document Body */}
        <div className="glass-strong noise border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 text-sm text-muted-foreground leading-relaxed">
          
          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-foreground" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Setuvia platform, Customer Portal, Agent OS, or Governance Console (collectively, the "Services"), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of an enterprise or entity, you represent and warrant that you hold legitimate authority to bind that entity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-foreground" />
              2. Clearance Roles & Operational Workspaces
            </h2>
            <p className="mb-2">
              Access to features is segmented into explicit cryptographic clearance levels:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs text-muted-foreground/90">
              <li><strong className="text-foreground">Customer Workspace:</strong> Intended solely for authenticated end users initiating inquiries and tracking resolution outcomes.</li>
              <li><strong className="text-foreground">Agent OS Workspace:</strong> Authorized customer success specialists and leads reviewing active queues and drafting policy replies.</li>
              <li><strong className="text-foreground">Admin & Governance Console:</strong> Senior executives managing organizational guardrails, audit ledgers, and macro business insights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-foreground" />
              3. Deterministic Policy Guardrails & Action Limits
            </h2>
            <p>
              Setuvia operates with strict, code-enforced guardrails. Automated refunds, compensation payouts, and ledger updates are governed by organizational threshold rules. Any financial action exceeding preset safety limits (e.g., refunds over ₹5,000) is systematically intercepted and requires multi-sig human manager authorization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-foreground" />
              4. Service Availability & Limitation of Liability
            </h2>
            <p>
              Setuvia provides its autonomous resolution services with a target uptime SLA of 99.9%. While our deterministic engines verify all numerical outputs against uploaded receipts and tariffs, Setuvia does not substitute for licensed legal or statutory tax counsel.
            </p>
          </section>

          <div className="pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
            <span>Setuvia Enterprise Governance</span>
            <Link to="/privacy" className="text-foreground hover:underline">
              View Privacy Policy ➔
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
