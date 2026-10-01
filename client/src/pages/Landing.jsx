import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Bot,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Terminal,
  ChevronRight,
  MessageSquare,
  Users
} from 'lucide-react';
import { PulseSphere } from '../components/effects/PulseSphere';
import { Nav } from '../components/layout/Nav';
import { CursorBlob } from '../components/effects/CursorBlob';
import SetuviaLogo from '../components/SetuviaLogo';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('triage');

  const stats = [
    { label: 'Autonomous Resolution', value: '99.4%', sub: 'Zero-touch resolution' },
    { label: 'Mean Resolution Speed', value: '3.8s', sub: 'Instant AI response' },
    { label: 'Dual Gemini Engines', value: 'Active', sub: 'Load-balanced models' },
    { label: 'Audit Compliance', value: '100%', sub: 'Policy validated' },
  ];

  const pillars = [
    {
      icon: Bot,
      title: 'Autonomous AI Triage',
      desc: 'Multi-turn intelligent triage powered by load-balanced Gemini models with automatic sentiment analysis and urgency routing.',
      to: '/customer',
      cta: 'Open Customer Portal',
      badge: 'Real-time AI',
    },
    {
      icon: Cpu,
      title: 'Agent Co-Pilot OS',
      desc: 'High-leverage agent workspace with live auto-drafting, policy inspection, action validation, and one-click execution.',
      to: '/agent',
      cta: 'Launch Agent Workspace',
      badge: 'Human-in-the-Loop',
    },
    {
      icon: Shield,
      title: 'Immutable Governance',
      desc: 'Strict policy state machines verify every refund, message, and SLA threshold before execution to ensure enterprise safety.',
      to: '/admin',
      cta: 'Explore Admin Console',
      badge: 'Zero Hallucination',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background">
      <CursorBlob />
      <Nav />

      {/* HERO SECTION */}
      <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Subtle grid background */}
        <div className="absolute inset-0 grid-bg opacity-70" aria-hidden="true" />
        
        {/* 3D PulseSphere Hero Canvas */}
        <PulseSphere />
        
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-6 w-full text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Live Pill Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-foreground/80 mb-8 border border-white/10 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse-glow" />
              <span>LIVE • AI-NATIVE RESOLUTION ENGINE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-display text-5xl md:text-7xl lg:text-[7.5rem] leading-[0.92] mb-8 mx-auto max-w-4xl tracking-tight">
              Instant Answers.<br />
              <span className="text-muted-foreground">Autonomous Trust.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
              Setuvia transforms chaotic customer complaints into verified, policy-governed resolutions in real time using multi-model Gemini AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/customer"
                data-cursor-hover
                className="skeu-btn rounded-full px-8 py-4 text-sm font-semibold inline-flex items-center gap-3 bg-foreground text-background hover:scale-[1.03] transition-all shadow-xl"
              >
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                <span>Launch Customer Portal</span>
              </Link>
              <Link
                to="/agent"
                data-cursor-hover
                className="skeu-btn rounded-full px-7 py-4 text-sm font-semibold inline-flex items-center gap-2 bg-secondary text-foreground hover:scale-[1.02] transition-all border border-border"
              >
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span>Agent Workspace</span>
              </Link>
            </div>

            {/* Portal quick routes */}
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground mt-8">
              <Link to="/admin" data-cursor-hover className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                Admin Console <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="w-1 h-1 rounded-full bg-border" />
              <Link to="/login" data-cursor-hover className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                Role Selector <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK STATS STRIP */}
      <section className="mx-auto max-w-7xl px-6 relative z-10 -mt-8">
        <div className="glass-strong rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden shadow-2xl">
          {stats.map((s) => (
            <div key={s.label} className="p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">{s.label}</p>
              <p className="text-2xl md:text-3xl font-display font-bold mt-2 text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE ENGINE VELOCITY & INTELLIGENCE PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 mt-28 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
              <Activity className="w-3.5 h-3.5 text-foreground" /> Live Operations Feed
            </div>
            <h2 className="text-display text-3xl md:text-5xl font-bold">Autonomous Engine at Work</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Gemini Balanced
            </span>
          </div>
        </div>

        {/* Interactive Engine Card */}
        <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/10 noise relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Case Card */}
            <div className="clay p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase bg-foreground/10 text-foreground border border-border">
                    CASE-48291
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">Just now</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  Double billing on deluxe suite & minibar charges
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  "I was billed $420 twice for Room 402 and need the duplicate charge refunded to my card immediately."
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Urgency
                </span>
                <Link to="/customer" className="text-xs font-mono text-foreground hover:underline inline-flex items-center gap-1">
                  Simulate <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* AI Decision Pipeline */}
            <div className="clay p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono uppercase tracking-wider text-foreground">Gemini AI Synthesis</span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-background/50 border border-border/60">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Detected Intent</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">Billing Discrepancy & Refund Request</p>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50 border border-border/60">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Proposed Action</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">Process Partial Refund ($420.00) + Confirmation Notice</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Confidence: 98.7%</span>
                <span className="text-foreground">Latency: 410ms</span>
              </div>
            </div>

            {/* Policy & Governance Guardrail */}
            <div className="clay p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono uppercase tracking-wider text-foreground">Policy Guardrails</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-foreground/5 border border-border/40">
                    <span className="text-muted-foreground">Amount within auto-threshold:</span>
                    <span className="font-mono text-emerald-400">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-foreground/5 border border-border/40">
                    <span className="text-muted-foreground">Duplicate receipt match:</span>
                    <span className="font-mono text-emerald-400">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-foreground/5 border border-border/40">
                    <span className="text-muted-foreground">Audit log commit:</span>
                    <span className="font-mono text-foreground">IMMUTABLE</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Action Validator</span>
                <span className="text-xs font-mono text-emerald-400">State: READY</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THE THREE PILLARS */}
      <section className="mx-auto max-w-7xl px-6 mt-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 font-mono">The Architecture</p>
          <h2 className="text-display text-4xl md:text-5xl font-bold tracking-tight">Built for Zero-Defect Resolution.</h2>
          <p className="text-sm md:text-base text-muted-foreground mt-4">
            A three-tier operating model connecting real-time customers, empowered human agents, and executive oversight.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="clay p-8 group hover:-translate-y-1.5 transition-all flex flex-col justify-between border border-border"
              data-cursor-hover
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="rounded-2xl w-14 h-14 bg-foreground text-background flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <p.icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-foreground/10 text-muted-foreground">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold mb-3 text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/40">
                <Link
                  to={p.to}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:gap-3 transition-all"
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMMERSIVE CTA BANNER */}
      <section className="mx-auto max-w-7xl px-6 my-28 relative z-10 w-full">
        <div className="relative glass-strong rounded-3xl p-10 md:p-16 overflow-hidden noise border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-pulse opacity-60" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <Sparkles className="w-7 h-7 text-foreground mb-4" />
            <h2 className="text-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Experience the New Standard in Customer Resolution.
            </h2>
            <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed max-w-2xl">
              Switch seamlessly between Customer, Agent, and Admin roles to test the autonomous triage engine, call transcripts, and live action validation.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/customer"
                data-cursor-hover
                className="skeu-btn rounded-2xl px-6 py-4 text-sm font-semibold inline-flex items-center gap-2 bg-foreground text-background shadow-lg"
              >
                <span>Launch Customer Live Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                data-cursor-hover
                className="skeu-btn rounded-2xl px-6 py-4 text-sm font-semibold inline-flex items-center gap-2 bg-secondary text-foreground border border-border"
              >
                <span>Switch Portal Role</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-10 mt-auto bg-background/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <SetuviaLogo size={22} className="w-5 h-5" />
            <span className="font-display font-bold text-foreground tracking-tight text-sm">SETUVIA</span>
            <span>•</span>
            <span>AI-Native Resolution Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="opacity-40">•</span>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
