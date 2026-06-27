import { storage } from './storage';
import { generateId } from '../utils/helpers';
import type { PassportEntry, User } from '../types';

const PASSPORT_KEY = 'nepali-sathi-passport';
const USER_KEY = 'nepali-sathi-user';

export const passportService = {
  getEntries(): PassportEntry[] {
    return storage.get<PassportEntry[]>(PASSPORT_KEY, []);
  },

  addEntry(siteId: string, siteName: string, note = ''): PassportEntry {
    const entries = this.getEntries();
    const existing = entries.find((e) => e.siteId === siteId);
    if (existing) return existing;

    const entry: PassportEntry = {
      id: generateId(),
      siteId,
      siteName,
      visitedAt: new Date().toISOString(),
      note,
      image: '',
    };

    entries.push(entry);
    storage.set(PASSPORT_KEY, entries);
    return entry;
  },

  hasEntry(siteId: string): boolean {
    return this.getEntries().some((e) => e.siteId === siteId);
  },

  getEntryCount(): number {
    return this.getEntries().length;
  },

  clear(): void {
    storage.remove(PASSPORT_KEY);
  },
};

export const authService = {
  getUser(): User | null {
    return storage.get<User | null>(USER_KEY, null);
  },

  login(email: string, _password: string): User | null {
    const users = storage.get<User[]>('nepali-sathi-users', []);
    const user = users.find((u) => u.email === email);
    if (!user) return null;
    storage.set(USER_KEY, user);
    return user;
  },

  register(name: string, email: string): User {
    const users = storage.get<User[]>('nepali-sathi-users', []);
    const existing = users.find((u) => u.email === email);
    if (existing) {
      storage.set(USER_KEY, existing);
      return existing;
    }

    const user: User = {
      id: generateId(),
      name,
      email,
      avatar: '',
      passport: [],
      joinedAt: new Date().toISOString(),
    };

    users.push(user);
    storage.set('nepali-sathi-users', users);
    storage.set(USER_KEY, user);
    return user;
  },

  logout(): void {
    storage.remove(USER_KEY);
  },

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  },
};
