export interface HeritageSite {
  id: string;
  name: string;
  location: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  category: 'UNESCO' | 'Cultural' | 'Natural' | 'Religious';
  establishedYear: string;
  entryFee: string;
  openingHours: string;
  bestTimeToVisit: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  visitCount: number;
}

export type PlaceCategory =
  | 'Food'
  | 'Heritage'
  | 'Crafts'
  | 'Nature'
  | 'Culture'
  | 'Coffee'
  | 'Shopping'
  | 'Hidden Gems';

export interface AuthenticityIndicator {
  label: string;
  value: boolean;
  icon: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  image: string;
  images: string[];
  description: string;
  shortDescription: string;
  history: string;
  localLegends: string;
  etiquette: string;
  bestTimeToVisit: string;
  openingHours: string;
  authenticityScore: number;
  authenticityIndicators: AuthenticityIndicator[];
  estimatedCost: string;
  distance: string;
  isOpen: boolean;
  location: { lat: number; lng: number };
  nearbyPlaces: string[];
  priceLevel: 1 | 2 | 3;
  rating: number;
  visitCount: number;
}

export interface PassportEntry {
  id: string;
  siteId: string;
  siteName: string;
  visitedAt: string;
  note: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  level: number;
  xp: number;
  passport: PassportEntry[];
  joinedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: PlaceCategory;
  completed: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ItineraryItem {
  id: string;
  timeSlot: 'morning' | 'lunch' | 'afternoon' | 'evening' | 'night';
  title: string;
  description: string;
  order: number;
}

export interface MemoryEntry {
  id: string;
  placeId: string;
  placeName: string;
  visitDate: string;
  notes: string;
  photos: string[];
}

export interface Review {
  id: string;
  siteId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'hospital' | 'police' | 'embassy' | 'safety';
  address: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface TravelLevel {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface StoryChapter {
  id: string;
  questId: string;
  questTitle: string;
  questCategory: PlaceCategory;
  order: number;
  narrative: string;
  completedAt: string;
}

export interface UserPreferences {
  language: 'English' | 'Nepali' | 'Hindi';
  notifications: boolean;
  darkMode: boolean;
}
