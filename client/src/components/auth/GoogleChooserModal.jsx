import { useState } from 'react';
import { X, Plus, Check, Loader2, ArrowRight } from 'lucide-react';

export const GoogleChooserModal = ({ isOpen, onClose, onSelectAccount, defaultRole = 'customer' }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      suggestedRole: 'customer',
      badge: 'Personal • Customer'
    },
    {
      name: 'Alex Morgan',
      email: 'alex.morgan@support.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      suggestedRole: 'agent',
      badge: 'Workspace • Agent OS'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@enterprise.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
      suggestedRole: 'admin',
      badge: 'Enterprise • Admin'
    }
  ];

  const handleAccountClick = (account) => {
    setSelectedEmail(account.email);
    setIsSigningIn(true);
    setTimeout(() => {
      onSelectAccount({
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        role: defaultRole || account.suggestedRole
      });
    }, 700);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName.trim() || customEmail.split('@')[0];
    const account = {
      name,
      email: customEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=fff`,
      suggestedRole: defaultRole
    };
    handleAccountClick(account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-up">
      <div className="relative w-full max-w-md bg-[#16181b] border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden noise">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSigningIn}
          data-cursor-hover
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <svg className="w-7 h-7 mb-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h2 className="text-xl font-display font-bold text-foreground">Choose an account</h2>
          <p className="text-xs text-muted-foreground mt-1">
            to continue to <strong className="text-foreground font-semibold">Setuvia</strong>
          </p>
        </div>

        {/* Signing In Progress State */}
        {isSigningIn && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-foreground animate-spin" />
            <p className="text-sm font-medium text-foreground">Signing in as {selectedEmail}...</p>
            <p className="text-xs font-mono text-muted-foreground">Authenticating OAuth credentials</p>
          </div>
        )}

        {/* Account List */}
        {!isSigningIn && (
          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleAccountClick(acc)}
                data-cursor-hover
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary/80 border border-border/50 hover:border-border transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-white transition-colors truncate">
                      {acc.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{acc.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/10 text-muted-foreground group-hover:text-foreground shrink-0 border border-border/40">
                  {acc.badge}
                </span>
              </button>
            ))}

            {/* Custom Account Toggle */}
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                data-cursor-hover
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-transparent hover:bg-secondary/40 border border-dashed border-border/80 transition-colors text-left text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Use another Google account</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="p-3.5 rounded-2xl bg-secondary/30 border border-border/80 space-y-2.5 mt-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Enter Google credentials</p>
                <input
                  type="text"
                  placeholder="Your Name (e.g. John Doe)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/60"
                />
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/60"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="skeu-btn px-4 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background flex items-center gap-1"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border/40 text-center text-[11px] text-muted-foreground/70">
          To continue, Google will share your name, email address, and profile picture with Setuvia.
        </div>

      </div>
    </div>
  );
};
