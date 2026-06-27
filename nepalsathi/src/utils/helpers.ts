export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 99999];
  let level = 1;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) { level = i + 1; break; }
  }
  const nextLevelXp = levels[Math.min(level, levels.length - 1)];
  return { level, currentXp: xp, nextLevelXp };
}

export function getLevelTitle(level: number): string {
  const titles = [
    '', 'New Explorer', 'Curious Traveler', 'Sightseer', 'Pathfinder',
    'Culture Seeker', 'Trailblazer', 'Heritage Hunter', 'Wanderer', 'Voyager', 'Legendary Voyager',
  ];
  return titles[Math.min(level, titles.length - 1)];
}