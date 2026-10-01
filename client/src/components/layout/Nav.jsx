import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStoredSession, supabase } from '../../supabaseClient';
import { Sparkles, Shield, User, Terminal, ArrowRight, LogIn, LogOut } from 'lucide-react';
import SetuviaLogo from '../SetuviaLogo';

export const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState(getStoredSession());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSession(getStoredSession());
  }, [location.pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/customer', label: 'Customer Portal', requiresAuth: true },
    { to: '/agent', label: 'Agent OS', requiresAuth: true },
    { to: '/admin', label: 'Admin Console', requiresAuth: true },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 pt-4">
        <nav className={`glass-strong rounded-2xl flex items-center justify-between px-4 py-2.5 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/40 border-white/20' : ''}`}>
          
          {/* Brand Logo */}
          <Link to="/" data-cursor-hover className="flex items-center gap-3 group">
            <SetuviaLogo size={36} className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="logo-liquid text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                SETUVIA
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse-glow" />
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    data-cursor-hover
                    className={`relative px-4 py-2 text-sm tracking-tight rounded-xl transition-all font-medium flex items-center gap-1.5 ${
                      isActive
                        ? 'text-foreground bg-foreground/10 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl glass text-foreground flex items-center gap-1.5 border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="capitalize">{session.role}</span>
                </span>
                <button
                  onClick={handleSignOut}
                  data-cursor-hover
                  title="Sign Out"
                  className="skeu-btn rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                data-cursor-hover
                className="skeu-btn rounded-xl px-4 py-2 text-xs font-semibold bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
};
