export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getLevelTitle(level: number): string {
  const titles = [
    'New Explorer',
    'Curious Traveler',
    'Adventurer',
    'Culture Seeker',
    'Trail Blazer',
    'Local Expert',
    'Heritage Guardian',
    'Wanderlust Master',
    'Nepal Connoisseur',
    'Legendary Voyager',
  ];
  return titles[Math.min(level - 1, titles.length - 1)] || 'Legendary Voyager';
}

export function getXpForLevel(level: number): number {
  return level * 150;
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  let level = 1;
  let xpForNext = 150;
  while (xp >= xpForNext && level < 10) {
    xp -= xpForNext;
    level++;
    xpForNext = level * 150;
  }
  return { level, currentXp: xp, nextLevelXp: xpForNext };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
