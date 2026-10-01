// Mocked Supabase client with persistent local session for MVP
// Allows real authentication guards, role-based access, and sign-out flows

const STORAGE_KEY = 'setuvia_auth_session';

export const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredSession = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error(e);
  }
};

let currentUserRole = 'customer';

export const supabase = {
  auth: {
    getUser: async () => {
      const session = getStoredSession();
      return { data: { user: session }, error: null };
    },
    getSession: () => getStoredSession(),
    signUp: async ({ email, password, role = 'customer', name }) => {
      const user = {
        id: 'usr_' + Date.now(),
        name: name || (email ? email.split('@')[0] : 'User'),
        email: email,
        role: role,
        provider: 'email',
        created_at: new Date().toISOString()
      };
      currentUserRole = role;
      setStoredSession(user);
      return { data: { user }, error: null };
    },
    signInWithPassword: async ({ email, password, role: fallbackRole }) => {
      let role = fallbackRole || 'customer';
      if (email.includes('agent')) role = 'agent';
      else if (email.includes('admin')) role = 'admin';
      
      currentUserRole = role;
      const user = {
        id: 'usr_' + Date.now(),
        name: email ? email.split('@')[0] : 'User',
        email,
        role,
        provider: 'email',
        last_sign_in: new Date().toISOString()
      };
      setStoredSession(user);
      return { data: { user }, error: null };
    },
    signInWithOAuth: async ({ provider = 'google', userProfile, role = 'customer' }) => {
      currentUserRole = role;
      const user = {
        id: 'usr_g_' + Date.now(),
        name: userProfile?.name || 'Google User',
        email: userProfile?.email || 'user@gmail.com',
        avatar: userProfile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=0f172a&color=fff`,
        role: role,
        provider: 'google',
        last_sign_in: new Date().toISOString()
      };
      setStoredSession(user);
      return { data: { user }, error: null };
    },
    signOut: async () => {
      setStoredSession(null);
      return { error: null };
    }
  },
  from: (table) => ({
    insert: async (payload) => {
      if (payload && payload.role) {
        currentUserRole = payload.role;
        const session = getStoredSession();
        if (session) {
          session.role = payload.role;
          setStoredSession(session);
        }
      }
      return { data: payload, error: null };
    },
    select: (fields) => ({
      eq: (field, value) => ({
        single: async () => {
          const session = getStoredSession();
          return { data: { role: session?.role || currentUserRole }, error: null };
        }
      })
    })
  })
};
