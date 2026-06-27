import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { storage } from '../services/storage';
import { generateId } from '../utils/helpers';
import { quests as initialQuests } from '../data/quests';
import type {
  Quest, Achievement, ChatMessage, ItineraryItem,
  MemoryEntry, Activity, UserPreferences, PassportEntry,
} from '../types';

interface DataContextType {
  savedPlaces: string[];
  quests: Quest[];
  passportStamps: PassportEntry[];
  achievements: Achievement[];
  chatHistory: ChatMessage[];
  itinerary: ItineraryItem[];
  memoryBook: MemoryEntry[];
  recentActivity: Activity[];
  darkMode: boolean;
  preferences: UserPreferences;
  toggleSavePlace: (placeId: string) => void;
  isSaved: (placeId: string) => boolean;
  completeQuest: (questId: string) => void;
  addStamp: (placeId: string, placeName: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  updateItinerary: (items: ItineraryItem[]) => void;
  addMemoryEntry: (entry: Omit<MemoryEntry, 'id'>) => void;
  addActivity: (type: string, message: string) => void;
  toggleDarkMode: () => void;
  addXp: (amount: number) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  language: 'English',
  notifications: true,
  darkMode: false,
};

const defaultAchievements: Achievement[] = [
  { id: 'ach-heritage', title: 'Heritage Hunter', description: 'Visit 5 heritage sites', icon: 'Landmark', unlocked: false },
  { id: 'ach-food', title: 'Food Explorer', description: 'Try 3 local eateries', icon: 'UtensilsCrossed', unlocked: false },
  { id: 'ach-crafts', title: 'Craft Apprentice', description: 'Visit 2 craft workshops', icon: 'Hand', unlocked: false },
  { id: 'ach-nature', title: 'Nature Lover', description: 'Visit 2 nature spots', icon: 'TreePine', unlocked: false },
  { id: 'ach-culture', title: 'Culture Seeker', description: 'Experience 3 cultural sites', icon: 'Music', unlocked: false },
  { id: 'ach-hidden', title: 'Off the Beaten Path', description: 'Find 2 hidden gems', icon: 'Compass', unlocked: false },
  { id: 'ach-stamps', title: 'Stamp Collector', description: 'Collect 10 stamps', icon: 'Stamp', unlocked: false },
  { id: 'ach-master', title: 'Nepal Master', description: 'Visit 20 places', icon: 'Trophy', unlocked: false },
];

const defaultItinerary: ItineraryItem[] = [
  { id: 'itin-1', timeSlot: 'morning', title: 'Swayambhunath Sunrise', description: 'Start early with the monkey temple', order: 1 },
  { id: 'itin-2', timeSlot: 'lunch', title: 'Local Newari Breakfast', description: 'Try traditional Newari cuisine', order: 2 },
  { id: 'itin-3', timeSlot: 'afternoon', title: 'Patan Durbar Square', description: 'Explore the ancient royal square', order: 3 },
  { id: 'itin-4', timeSlot: 'evening', title: 'Boudha Aarti', description: 'Watch the evening ceremony at Boudhanath', order: 4 },
  { id: 'itin-5', timeSlot: 'night', title: 'Thamel Dinner', description: 'Dinner and evening walk in Thamel', order: 5 },
];

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [savedPlaces, setSavedPlaces] = useState<string[]>(() => storage.get('saved-places', []));
  const [quests, setQuests] = useState<Quest[]>(() => storage.get('quests', initialQuests));
  const [passportStamps, setPassportStamps] = useState<PassportEntry[]>(() => storage.get('nepali-sathi-passport', []));
  const [achievements] = useState<Achievement[]>(() => storage.get('achievements', defaultAchievements));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => storage.get('chat-history', []));
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => storage.get('itinerary', defaultItinerary));
  const [memoryBook, setMemoryBook] = useState<MemoryEntry[]>(() => storage.get('memory-book', []));
  const [recentActivity, setRecentActivity] = useState<Activity[]>(() => storage.get('recent-activity', []));
  const [darkMode, setDarkMode] = useState(() => storage.get('dark-mode', false));
  const [preferences, setPreferences] = useState<UserPreferences>(() => storage.get('preferences', defaultPreferences));

  useEffect(() => { storage.set('saved-places', savedPlaces); }, [savedPlaces]);
  useEffect(() => { storage.set('quests', quests); }, [quests]);
  useEffect(() => { storage.set('chat-history', chatHistory); }, [chatHistory]);
  useEffect(() => { storage.set('itinerary', itinerary); }, [itinerary]);
  useEffect(() => { storage.set('memory-book', memoryBook); }, [memoryBook]);
  useEffect(() => { storage.set('recent-activity', recentActivity); }, [recentActivity]);
  useEffect(() => { storage.set('preferences', preferences); }, [preferences]);

  useEffect(() => {
    storage.set('dark-mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSavePlace = useCallback((placeId: string) => {
    setSavedPlaces((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId],
    );
  }, []);

  const isSaved = useCallback((placeId: string) => savedPlaces.includes(placeId), [savedPlaces]);

  const completeQuest = useCallback((questId: string) => {
    setQuests((prev) => prev.map((q) => q.id === questId ? { ...q, completed: true } : q));
  }, []);

  const addStamp = useCallback((placeId: string, placeName: string) => {
    setPassportStamps((prev) => {
      if (prev.some((s) => s.siteId === placeId)) return prev;
      return [...prev, { id: generateId(), siteId: placeId, siteName: placeName, visitedAt: new Date().toISOString(), note: '', image: '' }];
    });
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  const updateItinerary = useCallback((items: ItineraryItem[]) => {
    setItinerary(items);
  }, []);

  const addMemoryEntry = useCallback((entry: Omit<MemoryEntry, 'id'>) => {
    setMemoryBook((prev) => [{ id: generateId(), ...entry }, ...prev]);
  }, []);

  const addActivity = useCallback((type: string, message: string) => {
    setRecentActivity((prev) => {
      const activity: Activity = { id: generateId(), type, message, timestamp: new Date().toISOString() };
      return [activity, ...prev].slice(0, 20);
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const addXp = useCallback((_amount: number) => {
    // XP is stored on the user object in auth service
  }, []);

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  }, []);

  return (
    <DataContext.Provider
      value={{
        savedPlaces, quests, passportStamps, achievements, chatHistory,
        itinerary, memoryBook, recentActivity, darkMode, preferences,
        toggleSavePlace, isSaved, completeQuest, addStamp, addChatMessage,
        clearChat, updateItinerary, addMemoryEntry, addActivity,
        toggleDarkMode, addXp, updatePreferences,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
