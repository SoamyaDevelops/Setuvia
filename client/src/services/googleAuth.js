// Official Google Identity Services & OAuth helper

export const initGoogleOAuth = ({ clientId, onAuthSuccess, onAuthError }) => {
  if (typeof window === 'undefined') return;

  const actualClientId = clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!actualClientId) {
    console.warn('[GoogleAuth] VITE_GOOGLE_CLIENT_ID is not configured.');
    return null;
  }

  try {
    if (window.google?.accounts?.oauth2) {
      return window.google.accounts.oauth2.initTokenClient({
        client_id: actualClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            onAuthError?.(tokenResponse.error);
            return;
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const profile = await res.json();
            onAuthSuccess?.({
              name: profile.name || profile.given_name,
              email: profile.email,
              avatar: profile.picture,
              token: tokenResponse.access_token
            });
          } catch (err) {
            onAuthError?.(err);
          }
        },
      });
    }
  } catch (err) {
    console.error('[GoogleAuth] Init failed:', err);
  }

  return null;
};
