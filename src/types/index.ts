export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  level: number;
  xp: number;
  joinedAt: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  image: string;
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
  images: string[];
  nearbyPlaces: string[];
  priceLevel: 1 | 2 | 3;
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

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: string;
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

export interface PassportStamp {
  placeId: string;
  placeName: string;
  visitedAt: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ItineraryItem {
  id: string;
  timeSlot: 'Morning' | 'Lunch' | 'Afternoon' | 'Evening' | 'Night';
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

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  type: 'hospital' | 'police' | 'embassy' | 'safety';
  address: string;
}

export type TravelLevel = {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
};
