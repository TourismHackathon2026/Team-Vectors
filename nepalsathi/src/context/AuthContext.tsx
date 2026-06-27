import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { storage } from '../services/storage';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const registrationInProgress = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        const local = storage.get<User | null>('nepali-sathi-user', null);
        if (local) setUser(local);
        setLoading(false);
      }
    };
    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && !registrationInProgress.current) {
        await fetchProfile(session.user.id);
      } else if (!session?.user) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      setLoading(false);
      return;
    }

    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        password: '',
        avatar: data.avatar || '',
        level: data.level || 1,
        xp: data.xp || 0,
        passport: [],
        joinedAt: data.created_at,
      });
    }
    setLoading(false);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const localUsers = storage.get<Array<{ email: string; password: string } & User>>('nepali-sathi-users', []);
      const local = localUsers.find((u) => u.email === email && u.password === password);
      if (local) {
        setUser(local);
        return { success: true };
      }
      const msg = typeof (error as any).message === 'string' ? (error as any).message : 'Invalid email or password.';
      return { success: false, error: msg };
    }
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    registrationInProgress.current = true;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      registrationInProgress.current = false;
      const msg = typeof error.message === 'string' ? error.message : 'Registration failed.';
      if (!msg || msg === '{}' || msg.includes('Database error saving new user')) {
        const localId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const localUser: User = {
          id: localId,
          name,
          email,
          password,
          avatar: '',
          level: 1,
          xp: 0,
          passport: [],
          joinedAt: new Date().toISOString(),
        };
        const localUsers = storage.get<Array<{ email: string; password: string } & User>>('nepali-sathi-users', []);
        localUsers.push(localUser);
        storage.set('nepali-sathi-users', localUsers);
        setUser(localUser);
        return { success: true };
      }
      return { success: false, error: msg };
    }

    if (!data.user) {
      registrationInProgress.current = false;
      return { success: false, error: 'Registration failed. Please try again.' };
    }

    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        registrationInProgress.current = false;
        return { success: false, error: 'Account created. Please check your email to verify, then sign in.' };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      name,
      email,
      avatar: '',
      level: 1,
      xp: 0,
      preferences: { language: 'English', notifications: true, darkMode: false },
    });

    if (profileError) {
      registrationInProgress.current = false;
      return { success: false, error: 'Account created but profile setup failed. Please try signing in.' };
    }

    await fetchProfile(data.user.id);
    registrationInProgress.current = false;
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    storage.remove('nepali-sathi-user');
    storage.remove('nepali-sathi-passport');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      if (updates.xp !== undefined) {
        const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 99999];
        let newLevel = 1;
        for (let i = levels.length - 1; i >= 0; i--) {
          if (updates.xp >= levels[i]) { newLevel = i + 1; break; }
        }
        updated.level = newLevel;
      }
      setUser(updated);

      const { error: _e } = await supabase
        .from('profiles')
        .update({
          name: updated.name,
          email: updated.email,
          avatar: updated.avatar,
          level: updated.level,
          xp: updated.xp,
        })
        .eq('id', user.id);

      if (_e) {
        storage.set('nepali-sathi-user', updated);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
