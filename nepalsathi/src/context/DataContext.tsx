import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { storage } from '../services/storage';
import { generateId } from '../utils/helpers';
import { quests as initialQuests } from '../data/quests';
import { getStoryTemplate } from '../data/story-templates';
import { aiService } from '../services/aiService';
import type {
  Quest, Achievement, ChatMessage, ItineraryItem,
  MemoryEntry, Activity, UserPreferences, PassportEntry, StoryChapter,
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
  stories: StoryChapter[];
  darkMode: boolean;
  preferences: UserPreferences;
  toggleSavePlace: (placeId: string) => void;
  isSaved: (placeId: string) => boolean;
  completeQuest: (questId: string) => void;
  generateStoryChapter: (questId: string, questTitle: string, questCategory: string) => void;
  addStamp: (placeId: string, placeName: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  updateItinerary: (items: ItineraryItem[]) => void;
  addMemoryEntry: (entry: Omit<MemoryEntry, 'id'>) => void;
  addActivity: (type: string, message: string) => void;
  toggleDarkMode: () => void;
  addXp: (amount: number) => void;
  unlockAchievement: (id: string) => void;
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
  const [userId, setUserId] = useState<string | null>(null);

  // Local fallback states
  const [savedPlaces, setSavedPlaces] = useState<string[]>(() => storage.get('saved-places', []));
  const [quests, setQuests] = useState<Quest[]>(() => storage.get('quests', initialQuests));
  const [passportStamps, setPassportStamps] = useState<PassportEntry[]>(() => storage.get('nepali-sathi-passport', []));
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.get('achievements', defaultAchievements));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => storage.get('chat-history', []));
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => storage.get('itinerary', defaultItinerary));
  const [memoryBook, setMemoryBook] = useState<MemoryEntry[]>(() => storage.get('memory-book', []));
  const [recentActivity, setRecentActivity] = useState<Activity[]>(() => storage.get('recent-activity', []));
  const [stories, setStories] = useState<StoryChapter[]>(() => storage.get('nepali-sathi-stories', []));
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => storage.get('dark-mode', false));
  const [preferences, setPreferences] = useState<UserPreferences>(() => storage.get('preferences', defaultPreferences));

  const questsRef = useRef(quests);
  questsRef.current = quests;

  // Watch for auth state
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        await Promise.all([
          loadFavorites(uid),
          loadPassportStamps(uid),
          loadItinerary(uid),
          loadMemoryBook(uid),
          loadRecentActivity(uid),
          loadPreferences(uid),
          loadOrCreateConversation(uid),
          loadAchievements(uid),
        ]);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        loadFavorites(uid);
        loadPassportStamps(uid);
        loadItinerary(uid);
        loadMemoryBook(uid);
        loadRecentActivity(uid);
        loadPreferences(uid);
        loadOrCreateConversation(uid);
        loadAchievements(uid);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFavorites = async (uid: string) => {
    const { data } = await supabase.from('favorites').select('site_id').eq('user_id', uid);
    if (data) setSavedPlaces(data.map((f) => f.site_id));
  };

  const loadPassportStamps = async (uid: string) => {
    const { data } = await supabase
      .from('passport_stamps')
      .select('*')
      .eq('user_id', uid)
      .order('visited_at', { ascending: false });
    if (data) {
      setPassportStamps(data.map((s: any) => ({
        id: s.id,
        siteId: s.site_id,
        siteName: s.site_name,
        visitedAt: s.visited_at,
        note: s.note || '',
        image: s.image || '',
      })));
    }
  };

  const loadItinerary = async (uid: string) => {
    const { data } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('user_id', uid)
      .order('item_order', { ascending: true });
    if (data) {
      setItinerary(data.map((i: any) => ({
        id: i.id,
        timeSlot: i.time_slot,
        title: i.title,
        description: i.description || '',
        order: i.item_order || 0,
      })));
    }
  };

  const loadMemoryBook = async (uid: string) => {
    const { data } = await supabase
      .from('memory_entries')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (data) {
      setMemoryBook(data.map((m: any) => ({
        id: m.id,
        placeId: m.place_id || m.place_name.toLowerCase().replace(/\s+/g, '-'),
        placeName: m.place_name,
        visitDate: m.visit_date,
        notes: m.notes || '',
        photos: m.photos || [],
      })));
    }
  };

  const loadRecentActivity = async (uid: string) => {
    const { data } = await supabase
      .from('recent_activities')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) {
      setRecentActivity(data.map((a: any) => ({
        id: a.id,
        type: a.type,
        message: a.message,
        timestamp: a.created_at,
      })));
    }
  };

  const loadPreferences = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('preferences').eq('id', uid).single();
    if (data?.preferences) {
      const prefs = data.preferences as UserPreferences;
      setPreferences(prefs);
      if (prefs.darkMode !== undefined) setDarkMode(prefs.darkMode);
    }
  };

  const loadOrCreateConversation = async (uid: string) => {
    const { data: existing } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('user_id', uid)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let convId: string | null = null;

    if (existing) {
      convId = existing.id;
      const { data: messages } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });
      if (messages) {
        setChatHistory(messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.created_at,
        })));
      }
    } else {
      const { data: newConv } = await supabase
        .from('ai_conversations')
        .insert({ user_id: uid, title: 'Travel Chat' })
        .select('id')
        .single();
      if (newConv) convId = newConv.id;
    }

    setConversationId(convId);
  };

  const loadAchievements = async (uid: string) => {
    const { data } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', uid);

    if (data) {
      const unlockedMap = new Map(data.map((a: any) => [a.achievement_id, a.unlocked_at]));
      setAchievements(
        defaultAchievements.map((a) =>
          unlockedMap.has(a.id)
            ? { ...a, unlocked: true, unlockedAt: unlockedMap.get(a.id) }
            : a
        )
      );
    }
  };

  // Persist local state
  useEffect(() => { storage.set('saved-places', savedPlaces); }, [savedPlaces]);
  useEffect(() => { storage.set('quests', quests); }, [quests]);
  useEffect(() => { storage.set('nepali-sathi-stories', stories); }, [stories]);
  useEffect(() => { storage.set('nepali-sathi-passport', passportStamps); }, [passportStamps]);
  useEffect(() => { storage.set('achievements', achievements); }, [achievements]);
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

  const toggleSavePlace = useCallback(async (placeId: string) => {
    setSavedPlaces((prev) => {
      const exists = prev.includes(placeId);
      if (exists) {
        if (userId) supabase.from('favorites').delete().eq('user_id', userId).eq('site_id', placeId);
        return prev.filter((id) => id !== placeId);
      }
      if (userId) supabase.from('favorites').insert({ user_id: userId, site_id: placeId });
      return [...prev, placeId];
    });
  }, [userId]);

  const isSaved = useCallback((placeId: string) => savedPlaces.includes(placeId), [savedPlaces]);

  const generateStoryChapter = useCallback(async (questId: string, questTitle: string, questCategory: string) => {
    const alreadyExists = stories.some((s) => s.questId === questId);
    if (alreadyExists) return;

    const template = getStoryTemplate(questId, questCategory);
    const aiNarrative = await aiService.generateQuestNarrative(questTitle, template, questCategory);
    const narrative = aiNarrative || template;

    const newChapter: StoryChapter = {
      id: generateId(),
      questId,
      questTitle,
      questCategory: questCategory as any,
      order: stories.length + 1,
      narrative,
      completedAt: new Date().toISOString(),
    };
    setStories((prev) => [...prev, newChapter]);
  }, [stories]);

  const completeQuest = useCallback(async (questId: string) => {
    const quest = questsRef.current.find((q) => q.id === questId);
    setQuests((prev) => prev.map((q) => q.id === questId ? { ...q, completed: true } : q));
    if (userId) {
      await supabase.from('completed_quests').upsert(
        { user_id: userId, quest_id: questId },
        { onConflict: 'user_id, quest_id' },
      );
    }
    if (quest && !quest.completed) {
      generateStoryChapter(questId, quest.title, quest.category);
    }
  }, [userId, generateStoryChapter]);

  const addStamp = useCallback(async (placeId: string, placeName: string) => {
    const newStamp: PassportEntry = {
      id: generateId(),
      siteId: placeId,
      siteName: placeName,
      visitedAt: new Date().toISOString(),
      note: '',
      image: '',
    };
    setPassportStamps((prev) => {
      if (prev.some((s) => s.siteId === placeId)) return prev;
      if (userId) {
        supabase.from('passport_stamps').insert({
          user_id: userId,
          site_id: placeId,
          site_name: placeName,
        });
      }
      return [...prev, newStamp];
    });
  }, [userId]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
    if (userId && conversationId) {
      supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: msg.role,
        content: msg.content,
      });
    }
  }, [userId, conversationId]);

  const clearChat = useCallback(() => {
    setChatHistory([]);
    if (userId && conversationId) {
      supabase.from('ai_messages').delete().eq('conversation_id', conversationId);
      supabase.from('ai_conversations').delete().eq('id', conversationId);
      setConversationId(null);
    }
  }, [userId, conversationId]);

  const updateItinerary = useCallback(async (items: ItineraryItem[]) => {
    setItinerary(items);
    if (userId) {
      await supabase.from('itinerary_items').delete().eq('user_id', userId);
      if (items.length > 0) {
        await supabase.from('itinerary_items').insert(
          items.map((item, idx) => ({
            user_id: userId,
            time_slot: item.timeSlot,
            title: item.title,
            description: item.description,
            item_order: idx,
          }))
        );
      }
    }
  }, [userId]);

  const addMemoryEntry = useCallback(async (entry: Omit<MemoryEntry, 'id'>) => {
    const newEntry: MemoryEntry = { id: generateId(), ...entry };
    setMemoryBook((prev) => [newEntry, ...prev]);
    if (userId) {
      await supabase.from('memory_entries').insert({
        user_id: userId,
        place_name: entry.placeName,
        place_id: entry.placeId,
        visit_date: entry.visitDate.split('T')[0],
        notes: entry.notes,
        photos: entry.photos,
      });
    }
  }, [userId]);

  const addActivity = useCallback(async (type: string, message: string) => {
    const activity: Activity = {
      id: generateId(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    setRecentActivity((prev) => [activity, ...prev].slice(0, 20));
    if (userId) {
      await supabase.from('recent_activities').insert({
        user_id: userId,
        type,
        message,
      });
    }
  }, [userId]);

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...prefs };
      if (userId) {
        supabase.from('profiles').update({ preferences: next }).eq('id', userId);
      }
      return next;
    });
  }, [userId]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    updatePreferences({ darkMode: !darkMode });
  }, [darkMode, updatePreferences]);

  const addXp = useCallback((_amount: number) => {
    // XP is updated via AuthContext.updateProfile now
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => prev.map((a) =>
      a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a,
    ));
    if (userId) {
      supabase.from('user_achievements').upsert(
        { user_id: userId, achievement_id: id },
        { onConflict: 'user_id, achievement_id' },
      );
    }
  }, [userId]);

  return (
    <DataContext.Provider
      value={{
        savedPlaces, quests, passportStamps, achievements, chatHistory,
        itinerary, memoryBook, recentActivity, stories, darkMode, preferences,
        toggleSavePlace, isSaved, completeQuest, generateStoryChapter, addStamp, addChatMessage,
        clearChat, updateItinerary, addMemoryEntry, addActivity,
        toggleDarkMode, addXp, unlockAchievement, updatePreferences,
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
