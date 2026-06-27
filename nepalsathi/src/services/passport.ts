import { storage } from './storage';
import { generateId } from '../utils/helpers';
import type { PassportEntry } from '../types';

const PASSPORT_KEY = 'nepali-sathi-passport';

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
