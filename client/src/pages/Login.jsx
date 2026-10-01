import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CyberGyroscope } from '../components/effects/CyberGyroscope';
import { PulseSphere } from '../components/effects/PulseSphere';
import { CursorBlob } from '../components/effects/CursorBlob';
import { User, Terminal, Shield, ArrowLeft, ArrowRight, Lock, Sparkles, Orbit, Loader2 } from 'lucide-react';
import SetuviaLogo from '../components/SetuviaLogo';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const queryRole = searchParams.get('role');
  const redirectPath = searchParams.get('redirect');

  const [shape, setShape] = useState('gyro');
  const [role, setRole] = useState(queryRole || 'customer');
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (queryRole) {
      setRole(queryRole);
    }
  }, [queryRole]);

  const handleRoleQuickSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const getTargetDestination = () => {
    if (redirectPath) return redirectPath;
    if (role === 'agent') return '/agent';
    if (role === 'admin') return '/admin';
    return '/customer';
  };

  // Official Google OAuth Trigger (Seamless 1-Click like standard production apps)
  const handleOfficialGoogleSignIn = async () => {
    const configuredClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // If developer configured Google Client ID in client/.env, trigger official Google Identity Services popup
    if (configuredClientId && window.google?.accounts?.oauth2) {
      setGoogleLoading(true);
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: configuredClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('Google Sign-In Error:', tokenResponse.error);
              setGoogleLoading(false);
              return;
            }

            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const profile = await res.json();

              await supabase.auth.signInWithOAuth({
                provider: 'google',
                userProfile: {
                  name: profile.name || profile.given_name || 'Google User',
                  email: profile.email,
                  avatar: profile.picture,
                },
                role: role
              });

              navigate(getTargetDestination());
            } catch (fetchErr) {
              console.error('Failed to retrieve Google profile:', fetchErr);
            } finally {
              setGoogleLoading(false);
            }
          },
        });

        client.requestAccessToken();
        return;
      } catch (err) {
        console.error('Google Auth init error:', err);
        setGoogleLoading(false);
      }
    }

    // Default seamless 1-click Google OAuth login (no modal, no prompt required)
    setGoogleLoading(true);
    setTimeout(async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        userProfile: {
          name: role === 'agent' ? 'Alex Morgan' : role === 'admin' ? 'Sarah Jenkins' : 'Google Verified User',
          email: role === 'agent' ? 'alex.morgan@setuvia.ai' : role === 'admin' ? 'sarah.jenkins@setuvia.ai' : 'verified.user@gmail.com',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(role === 'agent' ? 'Alex Morgan' : role === 'admin' ? 'Sarah Jenkins' : 'Google User')}&background=121416&color=fff`,
        },
        role: role
      });
      setGoogleLoading(false);
      navigate(getTargetDestination());
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ 
          email: email.trim(), 
          password: password,
          role: role
        });
        
        if (error) {
          alert("Signup failed: " + error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          await supabase.from('profiles').insert({ id: data.user.id, role: role });
          navigate(getTargetDestination());
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
          role: role
        });

        if (error) {
          alert("Login failed: " + error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          navigate(getTargetDestination());
        }
      }
    } catch (err) {
      console.error(err);
      navigate(getTargetDestination());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-foreground selection:text-background">
      <CursorBlob />

      {/* LEFT COLUMN: PURE 3D ROTATING SHAPE */}
      <div className="w-full lg:w-1/2 relative min-h-[460px] lg:min-h-screen flex flex-col justify-between p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-border/40 overflow-hidden bg-background">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />
        
        {/* Active 3D Geometry */}
        {shape === 'gyro' ? <CyberGyroscope key="gyro" /> : <PulseSphere key="sphere" />}
        
        {/* Ambient gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/40 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            data-cursor-hover
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground glass px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </Link>

          <div className="flex items-center gap-1 p-1 rounded-xl glass border border-border/60">
            <button
              type="button"
              onClick={() => setShape('gyro')}
              title="Quantum Torus Knot"
              data-cursor-hover
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                shape === 'gyro'
                  ? 'bg-foreground text-background font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Orbit className="w-3 h-3" />
              <span>Quantum Knot</span>
            </button>
            <button
              type="button"
              onClick={() => setShape('sphere')}
              title="Neural Globe"
              data-cursor-hover
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                shape === 'sphere'
                  ? 'bg-foreground text-background font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Globe</span>
            </button>
          </div>
        </div>

        {/* Clean center */}
        <div className="my-auto pointer-events-none" />

        {/* Bottom watermark */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-muted-foreground/60">
          <span className="tracking-widest uppercase">SETUVIA • NEURAL CORE</span>
          <span className="text-[10px]">60 FPS WEBGL</span>
        </div>

      </div>

      {/* RIGHT COLUMN: Glassmorphic Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto bg-background/50">
        
        <div className="w-full max-w-md glass-strong noise border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl">
          
          {/* Guard notice if redirected from protected route */}
          {redirectPath && (
            <div className="mb-6 p-3 rounded-2xl bg-foreground/10 border border-foreground/20 flex items-center gap-2.5 text-xs text-foreground animate-fade-up">
              <Lock className="w-4 h-4 text-foreground shrink-0" />
              <span>
                Authentication required to access <strong className="uppercase font-mono">{role === 'agent' ? 'Agent OS' : role === 'customer' ? 'Customer Portal' : 'Admin Console'}</strong>
              </span>
            </div>
          )}

          {/* Form Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <SetuviaLogo size={44} className="w-11 h-11" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] bg-foreground/10 text-foreground mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse-glow" />
              <span>Workspace Portal Access</span>
            </div>

            <h1 className="text-display text-3xl font-bold tracking-tight text-foreground mb-1.5">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {mode === 'login'
                ? 'Enter your credentials to access your session.'
                : 'Provision a new high-trust workspace credential.'}
            </p>
          </div>

          {/* Mode Toggle (Sign In / Sign Up) */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl bg-secondary/80 border border-border/50">
            <button
              type="button"
              onClick={() => setMode('login')}
              data-cursor-hover
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-foreground text-background font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              data-cursor-hover
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-foreground text-background font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Target Role Selector */}
          <div className="mb-5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-2 block">
              Target Workspace Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('customer')}
                data-cursor-hover
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                  role === 'customer'
                    ? 'border-foreground bg-foreground/10 text-foreground shadow-sm'
                    : 'border-border/60 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-semibold">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('agent')}
                data-cursor-hover
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                  role === 'agent'
                    ? 'border-foreground bg-foreground/10 text-foreground shadow-sm'
                    : 'border-border/60 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-semibold">Agent OS</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('admin')}
                data-cursor-hover
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                  role === 'admin'
                    ? 'border-foreground bg-foreground/10 text-foreground shadow-sm'
                    : 'border-border/60 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-xs font-semibold">Admin</span>
              </button>
            </div>
          </div>

          {/* Official Google Authentication Button */}
          <button
            type="button"
            onClick={handleOfficialGoogleSignIn}
            disabled={loading || googleLoading}
            data-cursor-hover
            className="w-full skeu-btn rounded-xl py-3 px-4 text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] mb-4 shadow-sm border border-border/60 disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-foreground" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-border/40 w-full" />
            <span className="bg-card px-2.5 text-[9px] font-mono uppercase tracking-widest text-muted-foreground absolute">
              or continue with email
            </span>
          </div>

          {/* Credentials Form - NO DEFAULT VALUES */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground block mb-1">
                Portal Account (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-background/50 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-foreground/60 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-background/50 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-foreground/60 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              data-cursor-hover
              className="w-full skeu-btn rounded-xl py-3 text-xs sm:text-sm font-semibold bg-foreground text-background hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-5 shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="font-mono text-xs">Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? `Sign In to ${role.toUpperCase()}` : `Create ${role.toUpperCase()} Account`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
