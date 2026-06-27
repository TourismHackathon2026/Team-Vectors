import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { storage } from '../services/storage';
import { generateId } from '../utils/helpers';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.get<User | null>('nepali-sathi-user', null));

  useEffect(() => {
    if (user) {
      storage.set('nepali-sathi-user', user);
    } else {
      storage.remove('nepali-sathi-user');
    }
  }, [user]);

  const login = useCallback((email: string, _password: string): boolean => {
    const users = storage.get<User[]>('nepali-sathi-users', []);
    const found = users.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, _password: string): boolean => {
    const users = storage.get<User[]>('nepali-sathi-users', []);
    if (users.some((u) => u.email === email)) return false;

    const newUser: User = {
      id: generateId(),
      name,
      email,
      password: _password,
      avatar: '',
      level: 1,
      xp: 0,
      passport: [],
      joinedAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set('nepali-sathi-users', users);
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}
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