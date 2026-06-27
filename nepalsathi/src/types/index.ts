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
  avatar: string;
  passport: PassportEntry[];
  joinedAt: string;
}
