import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Stamp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { storage } from '../services/storage';
import { cn } from '../utils/helpers';

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  stamps: number;
  avatar: string;
}

const medalColors = ['text-amber-500', 'text-gray-400', 'text-amber-700'];

export default function Leaderboard() {
  const { user } = useAuth();
  const { passportStamps } = useData();
  const [sortBy, setSortBy] = useState<'xp' | 'stamps'>('xp');
  const [showAll, setShowAll] = useState(false);

  const entries = useMemo((): LeaderboardUser[] => {
    const localUsers = storage.get<Array<{ email: string; password: string } & { id: string; name: string; xp: number; level: number; avatar: string }>>('nepali-sathi-users', []);
    const users: LeaderboardUser[] = localUsers.map((u) => ({
      id: u.id,
      name: u.name,
      xp: u.xp || 0,
      level: u.level || 1,
      stamps: 0,
      avatar: u.avatar || '',
    }));

    if (user && !users.some((u) => u.id === user.id)) {
      users.push({
        id: user.id,
        name: user.name,
        xp: user.xp || 0,
        level: user.level || 1,
        stamps: passportStamps.length,
        avatar: user.avatar || '',
      });
    }

    if (sortBy === 'xp') {
      users.sort((a, b) => b.xp - a.xp);
    } else {
      users.sort((a, b) => b.stamps - a.stamps);
    }

    return users.map((u) => ({ ...u, stamps: u.id === user?.id ? passportStamps.length : u.stamps }));
  }, [user, passportStamps, sortBy]);

  const displayed = showAll ? entries : entries.slice(0, 10);

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <Badge variant="primary" size="md" className="mb-3">
              Rankings
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
              Leaderboard
            </h1>
            <p className="mt-2 text-text-secondary">
              Top explorers ranked by XP and stamps.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('xp')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                sortBy === 'xp' ? 'bg-primary text-white' : 'bg-card border border-border text-text-secondary hover:text-text-primary',
              )}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              XP
            </button>
            <button
              onClick={() => setSortBy('stamps')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                sortBy === 'stamps' ? 'bg-primary text-white' : 'bg-card border border-border text-text-secondary hover:text-text-primary',
              )}
            >
              <Stamp className="w-4 h-4 inline mr-1" />
              Stamps
            </button>
          </div>
        </motion.div>

        <div className="space-y-2">
          {displayed.map((entry, i) => {
            const isMe = entry.id === user?.id;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Card hover padding="sm" className={isMe ? 'ring-2 ring-primary/30' : ''}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center shrink-0">
                      {i < 3 ? (
                        <Medal className={cn('w-6 h-6 mx-auto', medalColors[i])} />
                      ) : (
                        <span className="text-sm font-mono text-text-secondary">{i + 1}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        entry.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {entry.name}
                        {isMe && <span className="ml-1.5 text-xs text-primary font-normal">(You)</span>}
                      </p>
                      <p className="text-xs text-text-secondary">Level {entry.level}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-text-primary">{entry.xp.toLocaleString()} XP</p>
                      <p className="text-xs text-text-secondary">{entry.stamps} stamps</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {entries.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-700 transition-colors"
            >
              {showAll ? <>Show Less <ChevronUp className="w-4 h-4" /></> : <>Show All ({entries.length}) <ChevronDown className="w-4 h-4" /></>}
            </button>
          </div>
        )}

        {entries.length === 0 && (
          <Card className="p-12 text-center">
            <Trophy className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary mb-1">No explorers yet</p>
            <p className="text-xs text-text-secondary">Be the first to explore Nepal and earn XP!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
