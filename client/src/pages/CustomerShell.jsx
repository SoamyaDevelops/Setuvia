import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Activity, User, CheckCircle, Clock, MessageSquare, Menu, X, ArrowLeft, Send, Sparkles, Shield, Bot } from 'lucide-react';
import { CursorBlob } from '../components/effects/CursorBlob';
import { supabase, getStoredSession } from '../supabaseClient';
import SetuviaLogo from '../components/SetuviaLogo';

export default function CustomerShell() {
  const session = getStoredSession();
  const [messages, setMessages] = useState([
    { id: 1, type: 'agent', text: `Welcome to Setuvia Support, ${session?.name || 'Jane Doe'}. Our autonomous AI engine is active and ready to assist you. What can we resolve for you today?`, time: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input, time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/cases/CASE-48291/actions', {
        action: 'MESSAGE',
        payload: { message: input },
        actor: 'customer'
      });
      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'agent', 
        text: res.data.result || "Thank you. Your request was analyzed and processed by our resolution pipeline.",
        time: new Date().toISOString()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'agent', 
        text: "We received your message and dispatched it to the AI resolution queue.",
        time: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans p-3 md:p-6 relative overflow-hidden selection:bg-foreground selection:text-background">
      <CursorBlob />
      
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-foreground/5 rounded-full filter blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-6xl h-[90vh] md:h-[820px] glass-strong noise border border-white/10 rounded-3xl shadow-2xl flex relative z-10 overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`absolute md:relative w-80 h-full bg-background/70 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          
          {/* Header */}
          <div className="p-5 border-b border-border/40">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" data-cursor-hover className="flex items-center gap-2.5">
                <SetuviaLogo size={32} className="w-8 h-8" />
                <span className="logo-liquid text-base font-extrabold tracking-tight">SETUVIA</span>
              </Link>
              <button className="md:hidden text-muted-foreground p-1" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60 border border-border/40">
              {session?.avatar ? (
                <img src={session.avatar} alt="Profile" className="w-9 h-9 rounded-xl object-cover border border-white/10" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-foreground/10 text-foreground flex items-center justify-center font-bold text-xs">
                  {(session?.name || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{session?.name || 'Jane Doe'}</p>
                <p className="text-[10px] font-mono text-muted-foreground truncate">{session?.email || 'Verified Customer'}</p>
              </div>
            </div>
          </div>

          {/* Timeline & Case Progress */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Active Case</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  IN PROGRESS
                </span>
              </div>

              <div className="clay p-4 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                  <span className="font-mono text-xs font-bold text-foreground">CASE-48291</span>
                  <span className="text-[10px] font-mono text-muted-foreground">High Priority</span>
                </div>
                
                {/* Stepper */}
                <div className="relative pl-5 border-l border-border/60 space-y-4 text-xs">
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 bg-foreground rounded-full" />
                    <p className="font-semibold text-foreground">Ticket Registered</p>
                    <p className="text-[10px] text-muted-foreground font-mono">10:00 AM • Omnichannel</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 bg-foreground rounded-full animate-pulse-glow" />
                    <p className="font-semibold text-foreground">AI Triage & Synthesis</p>
                    <p className="text-[10px] text-muted-foreground font-mono">10:01 AM • Gemini 1.5</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 border border-foreground/50 rounded-full bg-background" />
                    <p className="font-semibold text-muted-foreground">Policy Guardrail Check</p>
                    <p className="text-[10px] text-muted-foreground font-mono">In evaluation</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 border border-border rounded-full bg-background" />
                    <p className="font-semibold text-muted-foreground">Settlement & Close</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">Navigation</h2>
              <div className="space-y-1.5 text-xs font-medium">
                <Link to="/" data-cursor-hover className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                  <ArrowLeft size={14} /> Back to Overview
                </Link>
                <Link to="/agent" data-cursor-hover className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                  <Bot size={14} /> Switch to Agent OS
                </Link>
                <Link to="/admin" data-cursor-hover className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                  <Shield size={14} /> Admin Audit Console
                </Link>
              </div>
            </div>
          </div>

          {/* Footer with Logout */}
          <div className="p-4 border-t border-border/40">
            <button
              onClick={handleLogout}
              data-cursor-hover
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
            >
              <LogOut size={14} /> Sign Out Session
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden bg-background/40">
          
          {/* Header */}
          <header className="bg-background/80 backdrop-blur-xl border-b border-border/40 px-5 py-3.5 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-muted-foreground p-1 -ml-1 hover:text-foreground" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-base text-foreground">Setuvia AI Concierge</h1>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">Connected to Load-Balanced Gemini Cluster</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full glass text-muted-foreground">
                SLA: 99.8%
              </span>
            </div>
          </header>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="flex justify-center my-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground glass px-3 py-1 rounded-full border border-border/40">
                Encrypted Session • Ticket CASE-48291
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                
                {msg.type !== 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-foreground text-background flex items-center justify-center mr-2.5 shrink-0 mt-1 shadow-md">
                    <Sparkles size={13} strokeWidth={2.5} />
                  </div>
                )}
                
                <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                  <div className={`px-4 py-3 text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-foreground text-background font-medium rounded-2xl rounded-br-sm shadow-md'
                      : 'glass border border-white/10 text-foreground rounded-2xl rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground mt-1 px-1">
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-up">
                <div className="w-7 h-7 rounded-xl bg-foreground text-background flex items-center justify-center mr-2.5 shrink-0 mt-1">
                  <Bot size={13} />
                </div>
                <div className="glass border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.3s]" />
                  <span className="text-xs font-mono text-muted-foreground ml-2">Synthesizing resolution...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          <div className="border-t border-border/40 p-4 bg-background/80 backdrop-blur-md">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your issue or ask for updates..."
                className="flex-1 bg-background/50 border border-border rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                data-cursor-hover
                className="skeu-btn rounded-full px-5 py-3 text-xs font-semibold bg-foreground text-background disabled:opacity-40 flex items-center gap-1.5 shadow-md"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
