import type { TravelLevel } from '../types';

export const levels: TravelLevel[] = [
  { level: 1, title: 'New Explorer', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Curious Traveler', minXp: 101, maxXp: 300 },
  { level: 3, title: 'Sightseer', minXp: 301, maxXp: 600 },
  { level: 4, title: 'Pathfinder', minXp: 601, maxXp: 1000 },
  { level: 5, title: 'Culture Seeker', minXp: 1001, maxXp: 1500 },
  { level: 6, title: 'Trailblazer', minXp: 1501, maxXp: 2100 },
  { level: 7, title: 'Heritage Hunter', minXp: 2101, maxXp: 2800 },
  { level: 8, title: 'Wanderer', minXp: 2801, maxXp: 3600 },
  { level: 9, title: 'Voyager', minXp: 3601, maxXp: 4500 },
  { level: 10, title: 'Legendary Voyager', minXp: 4501, maxXp: 99999 },
];

export function getLevelTitle(level: number): string {
  return levels.find((l) => l.level === level)?.title ?? 'New Explorer';
}

export function getXpForLevel(level: number): number {
  return level * 150;
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) {
      const next = levels[i + 1];
      return {
        level: levels[i].level,
        currentXp: xp,
        nextLevelXp: next ? next.minXp : levels[i].maxXp,
      };
    }
  }
  return { level: 1, currentXp: xp, nextLevelXp: 101 };
}
