import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, FileCheck2 } from 'lucide-react';
import SetuviaLogo from '../components/SetuviaLogo';
import { Nav } from '../components/layout/Nav';

export default function PrivacyPolicy() {
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
              <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
              <span>Official Compliance Document</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Effective Date: October 1, 2026 • Setuvia Neural Resolution Core
            </p>
          </div>
        </div>

        {/* Document Body */}
        <div className="glass-strong noise border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 text-sm text-muted-foreground leading-relaxed">
          
          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-foreground" />
              1. Information We Collect
            </h2>
            <p className="mb-2">
              Setuvia ("we", "our", or "the Platform") collects information to provide verified, policy-governed customer issue resolution. The information processed includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs text-muted-foreground/90">
              <li><strong className="text-foreground">Authentication Data:</strong> When signing in through Google Identity Services or standard credentials, we receive your name, email address, and verified profile image.</li>
              <li><strong className="text-foreground">Support Payloads:</strong> Case inquiry descriptions, uploaded billing receipts, hotel/airline folios, and medical discharge summaries provided during resolution sessions.</li>
              <li><strong className="text-foreground">System Telemetry:</strong> Anonymized interaction latency, session tokens, and deterministic rule execution outcomes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-foreground" />
              2. AI Processing & Google Gemini Safety Guardrails
            </h2>
            <p className="mb-2">
              Setuvia integrates Google Gemini models (including Gemini 3.1 Flash-Lite) to extract bill itemizations and draft preliminary resolution steps.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs text-muted-foreground/90">
              <li><strong className="text-foreground">PII Masking:</strong> Sensitive identifiers (including Aadhaar, PAN numbers, tax IDs, and bank account numbers) are masked using local cryptographic filters before being sent to LLM endpoints.</li>
              <li><strong className="text-foreground">No Model Training:</strong> Your private inquiries, financial claims, and uploaded documents are strictly ephemeral and are <strong className="text-foreground">never used to train public or foundational AI models</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-foreground" />
              3. Data Storage & Encryption
            </h2>
            <p>
              All customer sessions, communication logs, and audit entries are encrypted with <strong className="text-foreground">TLS 1.3 in transit</strong> and <strong className="text-foreground">AES-256 at rest</strong>. Automated actions and manager overrides are stored in an append-only immutable ledger to preserve transparency and prevent fraud.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-foreground" />
              4. Data Retention & Your Statutory Rights (GDPR & DPDP)
            </h2>
            <p className="mb-2">
              In compliance with global data protection standards (including the Indian Digital Personal Data Protection Act and GDPR):
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs text-muted-foreground/90">
              <li>You may request complete erasure of your support case history at any time ("Right to be Forgotten").</li>
              <li>You may export an immutable JSON transcript of all case interactions and telemetry.</li>
              <li>To exercise these rights, submit a formal request via the Setuvia Administration portal or contact compliance@setuvia.ai.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
            <span>Setuvia Governance & Legal Desk</span>
            <Link to="/terms" className="text-foreground hover:underline">
              View Terms of Service ➔
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
