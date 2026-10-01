import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase, getStoredSession } from '../supabaseClient';
import SetuviaLogo from '../components/SetuviaLogo';

export default function AdminShell() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const [insights, setInsights] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');
  const [testResult, setTestResult] = useState(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/api/insights'),
      axios.get('http://localhost:3000/api/audit')
    ]).then(([insightsRes, auditRes]) => {
      setInsights(insightsRes.data);
      setAuditLogs(auditRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSimulateRefund = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/cases/CASE-48291/actions', {
        action: 'ISSUE_REFUND',
        payload: { amount: 6800 },
        actor: 'agent' // Agent simulating
      });
      setTestResult({ success: true, msg: 'Refund approved' });
    } catch (error) {
      setTestResult({ success: false, msg: error.response?.data?.error || 'Failed' });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col overflow-x-hidden selection:bg-foreground selection:text-background">
      {/* Premium Header */}
      <header className="glass-strong border-b border-white/10 text-white p-4 flex justify-between items-center relative z-20 shadow-xl">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center group">
            <SetuviaLogo size={38} className="w-9 h-9" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-2">
              Setuvia <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold border border-white/10">Governance</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-white/20 mx-2 hidden md:block"></div>
          <nav className="text-sm hidden md:flex gap-1 font-medium bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
            <Link to="/" className="px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all">Overview</Link>
            <button onClick={() => setActiveTab('insights')} className={`px-4 py-1.5 rounded-md transition-all duration-300 ${activeTab === 'insights' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>Macro Insights</button>
            <button onClick={() => setActiveTab('operations')} className={`px-4 py-1.5 rounded-md transition-all duration-300 ${activeTab === 'operations' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>Audit & Governance</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block mr-2">
            <div className="text-sm font-semibold text-white">{session?.name || 'Sarah Jenkins'}</div>
            <div className="text-[10px] text-fuchsia-400 uppercase tracking-widest font-bold flex items-center gap-1 justify-end">
              <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse"></div> {session?.role?.toUpperCase() || 'DIRECTOR'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-slate-800 flex items-center justify-center">
            {session?.avatar ? (
              <img src={session.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=8b5cf6&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <button onClick={handleSignOut} className="text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition border border-transparent hover:border-white/20 ml-2">Exit</button>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full relative">
        
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/10 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-400/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        {activeTab === 'insights' ? (
          <div className="animate-slide-up relative z-10">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Macro Insights</h2>
                <p className="text-slate-500 mt-2 text-lg">AI-synthesized operational intelligence across all support channels.</p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4 min-w-[140px] flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/10 rounded-full filter blur-[15px] group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-800">92%</div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Global CSAT</div>
                    </div>
                 </div>
                 <div className="bg-white border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4 min-w-[140px] flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-violet-400/10 rounded-full filter blur-[15px] group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="w-10 h-10 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-800">₹68k</div>
                      <div className="text-[10px] text-violet-600 font-bold uppercase tracking-widest">Saved Today</div>
                    </div>
                 </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="h-64 bg-slate-200/50 rounded-2xl animate-pulse"></div>
                <div className="h-64 bg-slate-200/50 rounded-2xl animate-pulse"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {insights.map(insight => (
                  <div key={insight.id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                    
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-100 gap-4 relative z-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-rose-200">
                            {insight.category} Alert
                          </span>
                          <span className="text-sm text-slate-400 font-medium">{insight.period}</span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-slate-900">{insight.inferred}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
                      <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-inner">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          Observed Telemetry
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-end border-b border-slate-200/60 pb-3">
                            <div>
                              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Impacted Cases</div>
                              <div className="text-xl font-bold text-slate-800">{insight.observed.issueCount} <span className="text-sm font-medium text-slate-400">tickets</span></div>
                            </div>
                            <div className="w-12 h-10 bg-slate-200 rounded overflow-hidden flex items-end gap-0.5 p-1">
                              <div className="flex-1 bg-slate-400 rounded-t h-[30%]"></div>
                              <div className="flex-1 bg-slate-400 rounded-t h-[50%]"></div>
                              <div className="flex-1 bg-rose-400 rounded-t h-[90%] shadow-[0_0_8px_rgba(251,113,133,0.5)]"></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-end border-b border-slate-200/60 pb-3">
                            <div>
                              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Financial Exposure</div>
                              <div className="text-xl font-bold text-rose-500">₹{insight.observed.totalDiscrepancy.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Root Cause Analysis</div>
                            <div className="text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm">{insight.observed.mainDriver}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-7 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 rounded-2xl p-6 border border-indigo-100 shadow-[0_4px_15px_rgba(99,102,241,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/10 rounded-full filter blur-[40px]"></div>
                        
                        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2 relative z-10">
                          <span className="bg-indigo-600 text-white p-1 rounded shadow-md">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                          </span>
                          System Recommendation
                        </h4>
                        
                        <p className="text-slate-700 text-[15px] leading-relaxed relative z-10 font-medium">
                          {insight.recommended}
                        </p>
                        
                        <div className="mt-6 flex gap-3 relative z-10">
                          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
                            Approve Rule Generation
                          </button>
                          <button className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                            View Affected Cases
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-slide-up relative z-10">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Audit Engine</h2>
                <p className="text-slate-500 mt-2 text-lg">Immutable, real-time ledger of automated guardrails and system actions.</p>
              </div>
              <div className="flex flex-col items-end gap-2 bg-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-900/20 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs font-mono">Sandbox:</span>
                  <button 
                    onClick={handleSimulateRefund}
                    className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-400 transition-colors shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Simulate Agent Refund (₹6800)
                  </button>
                </div>
                {testResult && (
                  <div className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-2 font-bold w-full justify-center ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    {testResult.success ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    )}
                    {testResult.msg}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">System Transaction Log</h3>
                <div className="flex gap-2">
                  <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Live Monitoring</span>
                  <span className="relative flex h-4 w-4 ml-1 mt-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Actor</th>
                      <th className="px-6 py-4">Action Intended</th>
                      <th className="px-6 py-4">Target Resource</th>
                      <th className="px-6 py-4 text-right">System Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {auditLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{log.role}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{log.action}</td>
                        <td className="px-6 py-4 font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit inline-block border border-indigo-100">{log.target}</td>
                        <td className="px-6 py-4 text-right">
                          {log.detail?.status === 'BLOCKED_BY_RULE' ? (
                            <div className="flex flex-col items-end">
                              <span className="text-rose-600 font-bold flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 text-xs">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                {log.detail.error || 'Blocked'}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Policy Enforcement</span>
                            </div>
                          ) : (
                            <span className="text-emerald-600 font-bold flex items-center gap-1.5 justify-end bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-xs w-fit ml-auto">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              Execution Successful
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
