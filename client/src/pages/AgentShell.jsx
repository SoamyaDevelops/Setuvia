import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase, getStoredSession } from '../supabaseClient';
import SetuviaLogo from '../components/SetuviaLogo';

export default function AgentShell() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [draft, setDraft] = useState("Hi, I understand there is confusion regarding the room charges and potential duplicate entries. We are looking into this and will process a refund if applicable.");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = () => {
    axios.get('http://localhost:3000/api/cases')
      .then(res => {
        setCases(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cases', err);
        setLoading(false);
      });
  };

  const handleSelectCase = async (caseId) => {
    setSelectedCase(caseId);
    try {
      const res = await axios.get(`http://localhost:3000/api/cases/${caseId}`);
      setCaseDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendDraft = async () => {
    if (!selectedCase) return;
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:3000/api/cases/${selectedCase}/actions`, {
        action: 'ANSWER',
        payload: { message: draft },
        actor: 'agent'
      });
      // Refresh case details and cases list
      await handleSelectCase(selectedCase);
      fetchCases();
      setDraft("");
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col overflow-hidden selection:bg-foreground selection:text-background">
      {/* Premium Header */}
      <header className="glass-strong border-b border-white/10 text-white p-4 flex justify-between items-center relative z-20 shadow-xl">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center group">
            <SetuviaLogo size={38} className="w-9 h-9" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-2">
              Setuvia <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold border border-white/10">Agent OS</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-white/20 mx-2 hidden md:block"></div>
          <nav className="text-sm hidden md:flex gap-1 font-medium bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
            <Link to="/" className="px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all">Overview</Link>
            <button onClick={() => setActiveTab('inbox')} className={`px-4 py-1.5 rounded-md transition-all duration-300 ${activeTab === 'inbox' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>Inbox Queue</button>
            <button onClick={() => setActiveTab('customers')} className={`px-4 py-1.5 rounded-md transition-all duration-300 ${activeTab === 'customers' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>CRM</button>
            <button onClick={() => setActiveTab('cx')} className={`px-4 py-1.5 rounded-md transition-all duration-300 ${activeTab === 'cx' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>Intelligence</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block mr-2">
            <div className="text-sm font-semibold text-white">{session?.name || 'Alex Morgan'}</div>
            <div className="text-[10px] text-teal-400 uppercase tracking-widest font-bold flex items-center gap-1 justify-end">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div> {session?.role?.toUpperCase() || 'AGENT'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-slate-800 flex items-center justify-center">
            {session?.avatar ? (
              <img src={session.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-white">{(session?.name || 'A').slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <button onClick={handleSignOut} className="text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition border border-transparent hover:border-white/20 ml-2">Exit</button>
        </div>
      </header>
      
      <main className="flex-1 p-4 lg:p-6 mx-auto w-full max-w-[1600px] flex gap-6 overflow-hidden">
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 animate-slide-up w-full flex flex-col h-[calc(100vh-120px)] relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full filter blur-[80px] opacity-70 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-900">Customer Directory</h2>
                  <p className="text-slate-500 text-sm mt-1">Unified view of all clients across multiple channels.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-72">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search by ID, name, or email..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-inner" />
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filter
                  </button>
                </div>
              </div>
              <div className="overflow-auto border border-slate-200/80 rounded-xl flex-1 shadow-sm bg-white relative z-10">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 backdrop-blur-md border-b border-slate-200/80">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Customer Profile</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Lifetime Value</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Churn Risk AI</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Last Contact</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'CUST-8812', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', status: 'Active', ltv: '₹2,48,000', risk: 'Medium', riskPct: 42, last: '30m ago', avatar: 'PS', tier: 'Platinum' },
                      { id: 'CUST-4419', name: 'Rahul Varma', email: 'rahul.v@outlook.com', status: 'At Risk', ltv: '₹5,10,000', risk: 'High', riskPct: 78, last: '2 hrs ago', avatar: 'RV', tier: 'Enterprise' },
                      { id: 'CUST-9011', name: 'Ananya Deshmukh', email: 'ananya.d@techcorp.in', status: 'Active', ltv: '₹8,90,000', risk: 'Low', riskPct: 12, last: '4 hrs ago', avatar: 'AD', tier: 'Corporate VIP' },
                      { id: 'CUST-3211', name: 'Vikram Malhotra', email: 'vikram.m@luxurytravel.com', status: 'At Risk', ltv: '₹14,20,000', risk: 'High', riskPct: 82, last: '6 hrs ago', avatar: 'VM', tier: 'Black Card' },
                      { id: 'CUST-1944', name: 'Sneha Patel', email: 'sneha.patel@gmail.com', status: 'Active', ltv: '₹1,85,000', risk: 'Low', riskPct: 8, last: '12 hrs ago', avatar: 'SP', tier: 'Gold' },
                      { id: 'CUST-7722', name: 'Karan Mehra', email: 'karan.m@gmail.com', status: 'Escalated', ltv: '₹3,40,000', risk: 'Severe', riskPct: 94, last: '1 day ago', avatar: 'KM', tier: 'Platinum' },
                      { id: 'CUST-5510', name: 'Rohan Singhania', email: 'rohan.singhania@apexholding.com', status: 'Active', ltv: '₹42,00,000', risk: 'Medium', riskPct: 55, last: '3 hrs ago', avatar: 'RS', tier: 'Strategic Tier 1' },
                      { id: 'CUST-6102', name: 'Natasha Rao', email: 'natasha.rao@fintechventures.io', status: 'In Review', ltv: '₹19,50,000', risk: 'Low', riskPct: 20, last: '8 hrs ago', avatar: 'NR', tier: 'Enterprise' },
                      { id: 'CUST-7821', name: 'Arjun Nair', email: 'arjun@techforward.ai', status: 'Active', ltv: '₹6,75,000', risk: 'Low', riskPct: 14, last: '10 hrs ago', avatar: 'AN', tier: 'Scale Partner' },
                      { id: 'CUST-3904', name: 'Meera Iyer', email: 'meera.iyer@zenithcapital.in', status: 'Escalated', ltv: '₹85,00,000', risk: 'Severe', riskPct: 91, last: '15 hrs ago', avatar: 'MI', tier: 'Institutional' }
                    ].map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">{c.avatar}</div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors flex items-center gap-2">
                                {c.name}
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">{c.tier}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.email} • {c.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            c.status === 'At Risk' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            c.status === 'Escalated' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>{c.status}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800 font-mono">{c.ltv}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                              <div className={`h-full rounded-full ${c.risk === 'Severe' || c.risk === 'High' ? 'bg-gradient-to-r from-orange-400 to-rose-500' : c.risk === 'Medium' ? 'bg-gradient-to-r from-amber-300 to-orange-400' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`} style={{ width: `${c.riskPct}%` }}></div>
                            </div>
                            <span className={`text-xs font-bold ${c.risk === 'Severe' || c.risk === 'High' ? 'text-rose-600' : c.risk === 'Medium' ? 'text-orange-500' : 'text-emerald-600'}`}>{c.risk} ({c.riskPct}%)</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">{c.last}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">Open Case</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cx' && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 md:p-8 animate-slide-up w-full flex flex-col h-[calc(100vh-120px)] relative overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Operational Telemetry</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">Manager Command & Intelligence</h2>
                <p className="text-slate-500 text-sm">Real-time throughput, resolution containment, and agent workload distribution.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium">Auto-Triage: ACTIVE</span>
                <span className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold">Gemini 3.1 Flash-Lite Engine</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Autonomous Containment</div>
                <div className="text-3xl font-display font-bold text-slate-900">74.8%</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">↑ +4.2% this week</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Avg Resolution Time</div>
                <div className="text-3xl font-display font-bold text-slate-900">2m 14s</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">↓ -48s vs manual queue</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">First Contact Resolution</div>
                <div className="text-3xl font-display font-bold text-slate-900">91.2%</div>
                <div className="text-xs text-teal-600 font-semibold mt-1">Industry benchmark: 76%</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Active SLA Compliance</div>
                <div className="text-3xl font-display font-bold text-slate-900">99.4%</div>
                <div className="text-xs text-slate-500 font-medium mt-1">0 breach escalations in 48h</div>
              </div>
            </div>

            {/* Team Roster & Channel Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Roster */}
              <div className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Active Agent Team Roster</span>
                  <span className="text-xs font-mono font-normal text-slate-400">4 Online</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Alex Morgan', role: 'Senior Support Lead', load: '4 cases', status: 'Online', score: '98% CSAT' },
                    { name: 'David Chen', role: 'Fintech & Insurance Specialist', load: '3 cases', status: 'In Review', score: '96% CSAT' },
                    { name: 'Sarah Jenkins', role: 'Director / Escalations', load: '2 cases', status: 'Online', score: '100% CSAT' },
                    { name: 'AI Auto-Pilot Agent', role: 'Autonomous Resolution Engine', load: '142 resolved', status: 'Active (24/7)', score: '94% CSAT' }
                  ].map((agent, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                          {agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{agent.name}</div>
                          <div className="text-[10px] text-slate-500">{agent.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-800">{agent.load}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{agent.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Omnichannel Traffic */}
              <div className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Channel Volume & Latency</h3>
                <div className="space-y-4">
                  {[
                    { channel: 'WhatsApp Concierge', share: '42%', avgLatency: '1.2s', color: 'bg-emerald-500' },
                    { channel: 'Web Portal Realtime Chat', share: '34%', avgLatency: '0.8s', color: 'bg-blue-500' },
                    { channel: 'Corporate Email Desk', share: '16%', avgLatency: '4.5m', color: 'bg-indigo-500' },
                    { channel: 'Emergency Hotline (IVR)', share: '8%', avgLatency: '12s', color: 'bg-rose-500' }
                  ].map((ch, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 font-semibold">{ch.channel}</span>
                        <span className="text-slate-500 font-mono">{ch.share} • {ch.avgLatency}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${ch.color} rounded-full`} style={{ width: ch.share }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[calc(100vh-100px)]">
            
            {/* INBOX COLUMN */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex flex-col h-full overflow-hidden animate-slide-up relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-blue-500"></div>
              
              <div className="flex justify-between items-center mb-5 mt-2">
                <h2 className="font-bold text-slate-800 text-lg tracking-tight">Active Queue</h2>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                  </span>
                  <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-md text-xs border border-slate-200">{cases.length}</span>
                </div>
              </div>

              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search cases..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4 custom-scrollbar">
                {loading ? <div className="animate-pulse space-y-3"><div className="h-20 bg-slate-100 rounded-xl"></div><div className="h-20 bg-slate-100 rounded-xl"></div></div> : null}
                {!loading && cases.length === 0 ? (
                  <div className="text-center mt-10 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="font-bold text-slate-700 text-sm">Inbox Zero</h3>
                    <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
                  </div>
                ) : null}
                {cases.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => handleSelectCase(c.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      selectedCase === c.id 
                        ? 'bg-gradient-to-br from-teal-50 to-white border-teal-300 shadow-[0_4px_12px_rgba(20,184,166,0.15)] ring-1 ring-teal-400/50 scale-[1.02]' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {selectedCase === c.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-xl"></div>}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border ${
                        c.status === 'CLOSED' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                      }`}>{c.status}</span>
                      <span className="text-[10px] text-slate-400 font-medium">2m ago</span>
                    </div>
                    <div className="font-bold text-[13px] leading-snug text-slate-800 group-hover:text-teal-700 transition-colors">{c.issue_type}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-2 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">{c.id}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MAIN CASE COLUMN */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl flex flex-col h-full animate-fade-in overflow-hidden relative">
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-50 rounded-full filter blur-[80px] opacity-60 pointer-events-none"></div>
              
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-bold text-xl text-slate-900">Case Workspace</h2>
                  {selectedCase && (
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                      <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{selectedCase}</span>
                      {caseDetails && <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200">{caseDetails.status}</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></button>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                </div>
              </div>
              
              {!caseDetails ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 relative z-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">No Case Selected</h3>
                  <p className="text-sm text-center max-w-xs">Select a case from the active queue to view details, AI summaries, and draft responses.</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 h-full relative z-10 overflow-hidden">
                  
                  {/* AI Summary Card */}
                  <div className="p-5 border-b border-slate-100 shrink-0">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 p-4 rounded-xl border border-indigo-100/60 shadow-[0_2px_10px_rgba(79,70,229,0.05)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full filter blur-[30px]"></div>
                      <h3 className="font-bold text-xs flex items-center gap-1.5 mb-2.5">
                        <span className="bg-indigo-600 text-white p-1 rounded shadow-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 tracking-wide uppercase">AI Summary</span>
                      </h3>
                      <p className="text-slate-700 text-[13px] leading-relaxed relative z-10">{caseDetails.summary}</p>
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/50">
                    <div className="flex items-center justify-center mb-6 sticky top-0 z-10">
                      <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Interaction History</span>
                    </div>
                    
                    <div className="space-y-6">
                      {caseDetails.timeline && caseDetails.timeline.map((evt, idx) => (
                        <div key={idx} className={`flex flex-col ${evt.actor === 'customer' ? 'items-start' : 'items-end'} animate-slide-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                          <span className="text-[11px] font-semibold text-slate-500 mb-1.5 flex gap-2 items-center">
                            {evt.actor === 'customer' ? (
                              <><div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">C</div> {evt.actor} <span className="font-mono text-[10px] font-medium text-slate-400">{new Date(evt.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></>
                            ) : (
                              <><span className="font-mono text-[10px] font-medium text-slate-400">{new Date(evt.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> {evt.actor} <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">A</div></>
                            )}
                          </span>
                          <div className={`p-4 rounded-2xl max-w-[85%] text-[13px] shadow-sm leading-relaxed border ${
                            evt.actor === 'customer' 
                              ? 'bg-white border-slate-200 rounded-tl-sm text-slate-700' 
                              : 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-800 rounded-tr-sm shadow-[0_4px_12px_rgba(13,148,136,0.2)]'
                          }`}>
                            <div className={`text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 ${evt.actor === 'customer' ? 'text-slate-400' : 'text-teal-200'}`}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                              {evt.action}
                            </div>
                            <div>{evt.result ? JSON.parse(evt.result).message || evt.result : ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
    
                  {/* Composer */}
                  <div className="p-5 bg-white border-t border-slate-100 shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-[11px] uppercase font-bold tracking-wider text-teal-600 flex gap-1.5 items-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Draft Reply
                      </h4>
                      <span className="text-[10px] bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100/50 font-bold tracking-wide flex items-center gap-1 shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                        AI Ghostwritten
                      </span>
                    </div>
                    <div className="relative">
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[13px] text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-inner custom-scrollbar"
                        rows={3}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <button className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></button>
                        <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors">Discard</button>
                        <button 
                          onClick={handleSendDraft}
                          disabled={actionLoading || !draft}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none transition-all shadow-md flex items-center gap-2"
                        >
                          {actionLoading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
                          ) : (
                            <>Approve & Send <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CUSTOMER 360 COLUMN */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-5 h-full overflow-y-auto animate-slide-up relative" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="font-display font-bold text-slate-800 text-lg">Customer 360</h2>
                <button className="text-teal-600 bg-teal-50 px-2 py-1 rounded text-xs font-bold hover:bg-teal-100 transition-colors">View All</button>
              </div>
              
              {caseDetails ? (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-md flex items-center justify-center text-indigo-700 font-display font-bold text-xl relative">
                      C
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">VIP Customer</div>
                      <div className="font-mono mt-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block">{caseDetails.customer_id || 'CUST-123'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Priority</div>
                      <div className="font-bold text-indigo-600 capitalize text-sm">{caseDetails.priority}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Risk Level</div>
                      <div className="font-bold text-orange-500 text-sm">Moderate</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                      Recent Activity
                    </h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pl-4">
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-emerald-400 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-[14px]"></div>
                        <div className="text-xs text-slate-600 bg-white border border-slate-100 rounded-lg p-2 shadow-sm w-full font-medium">Logged in via iOS App <span className="block text-[9px] text-slate-400 font-normal mt-0.5">2 hours ago</span></div>
                      </div>
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-blue-400 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-[14px]"></div>
                        <div className="text-xs text-slate-600 bg-white border border-slate-100 rounded-lg p-2 shadow-sm w-full font-medium">Viewed invoice INV-83921 <span className="block text-[9px] text-slate-400 font-normal mt-0.5">3 hours ago</span></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                      Sentiment Trend
                    </h3>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <div className="flex items-end gap-1.5 h-16 w-full">
                        <div className="flex-1 bg-emerald-400 rounded-t h-[80%] hover:bg-emerald-500 transition-colors cursor-pointer relative group"></div>
                        <div className="flex-1 bg-emerald-400 rounded-t h-[90%] hover:bg-emerald-500 transition-colors cursor-pointer relative group"></div>
                        <div className="flex-1 bg-emerald-400 rounded-t h-[70%] hover:bg-emerald-500 transition-colors cursor-pointer relative group"></div>
                        <div className="flex-1 bg-amber-400 rounded-t h-[40%] hover:bg-amber-500 transition-colors cursor-pointer relative group"></div>
                        <div className="flex-1 bg-rose-400 rounded-t h-[15%] hover:bg-rose-500 transition-colors cursor-pointer relative group">
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg font-medium z-20">Current Case (Frustrated)</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
                        <span>Last Wk</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-slate-400 h-[60%] p-6">
                  <svg className="mb-4 text-slate-200" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <p className="text-sm font-medium">Select a case to load rich Customer 360 profile data</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
