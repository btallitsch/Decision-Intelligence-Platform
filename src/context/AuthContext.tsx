import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithGoogle, signOut, subscribeToAuthState } from '@/firebase/auth';

// ─── Types ─────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  authLoading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
    // user state will update via onAuthStateChanged
  };

  const logOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
