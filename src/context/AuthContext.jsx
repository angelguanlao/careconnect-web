import { createContext, useContext, useState, useCallback } from 'react';
import { defaultUser } from '../data/mockData.js';

// Demo auth + user store (no backend). The user record is persisted so profile
// edits survive a refresh, mirroring the desktop build.
const USER_KEY = 'careconnect.user';
const AuthContext = createContext(null);

function loadUser() {
  try {
    return { ...defaultUser, ...JSON.parse(localStorage.getItem(USER_KEY) || '{}') };
  } catch {
    return { ...defaultUser };
  }
}

export function AuthProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState(loadUser);

  const signIn = useCallback((email, remember) => {
    if (remember) localStorage.setItem('careconnect.rememberEmail', email);
    else localStorage.removeItem('careconnect.rememberEmail');
    setUser((u) => ({ ...u, lastLogin: new Date().toISOString(), email: email || u.email }));
    setSignedIn(true);
  }, []);

  const signOut = useCallback(() => setSignedIn(false), []);

  const updateUser = useCallback((patch) => {
    setUser((u) => {
      const next = { ...u, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = { signedIn, user, signIn, signOut, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
