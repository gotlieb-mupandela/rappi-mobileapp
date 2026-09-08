import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppUser } from '../lib/types';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'rsh.user.v1';

/** Demo storefront account (matches rappi-webapp README). */
const DEMO = { email: 'shop@rappi.com', password: 'rappi123' };

type AuthResult = { ok: true } | { ok: false; message: string };

type AuthState = {
  user: AppUser | null;
  ready: boolean;
  supabase: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function nameFromEmail(email: string): string {
  const handle = email.split('@')[0] || 'Athlete';
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setUser(JSON.parse(raw) as AppUser))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = (u: AppUser | null) => {
    setUser(u);
    if (u) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u)).catch(() => {});
    else AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  const value = useMemo<AuthState>(
    () => ({
      user,
      ready,
      supabase: isSupabaseConfigured(),
      signIn: async (email, password) => {
        const e = email.trim().toLowerCase();
        if (!e || !password) return { ok: false, message: 'Enter your email and password.' };
        const sb = getSupabase();
        if (sb) {
          const { data, error } = await sb.auth.signInWithPassword({ email: e, password });
          if (error) return { ok: false, message: error.message };
          persist({ email: e, name: data.user?.user_metadata?.name ?? nameFromEmail(e), guest: false });
          return { ok: true };
        }
        // Local demo auth: accept the demo account or any email with a 4+ char password.
        if ((e === DEMO.email && password === DEMO.password) || password.length >= 4) {
          persist({ email: e, name: nameFromEmail(e), guest: false });
          return { ok: true };
        }
        return { ok: false, message: 'Invalid credentials. Try shop@rappi.com / rappi123.' };
      },
      signUp: async (name, email, password) => {
        const e = email.trim().toLowerCase();
        if (!name.trim() || !e || password.length < 4) {
          return { ok: false, message: 'Enter a name, email, and a password (4+ chars).' };
        }
        const sb = getSupabase();
        if (sb) {
          const { error } = await sb.auth.signUp({
            email: e,
            password,
            options: { data: { name: name.trim() } },
          });
          if (error) return { ok: false, message: error.message };
        }
        persist({ email: e, name: name.trim(), guest: false });
        return { ok: true };
      },
      continueAsGuest: () => persist({ email: '', name: 'Guest', guest: true }),
      signOut: async () => {
        const sb = getSupabase();
        if (sb) await sb.auth.signOut().catch(() => {});
        persist(null);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
