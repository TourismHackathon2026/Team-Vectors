import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Stamp, Route, TrendingUp, Compass, Bot, BookOpen, Phone, Trophy, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getLevelTitle, calculateLevel, getTimeAgo } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const { recentActivity, passportStamps, itinerary, achievements } = useData();

  const levelInfo = user ? calculateLevel(user.xp) : { level: 1, currentXp: 0, nextLevelXp: 101 };

  const daysActive = user
    ? Math.max(1, Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const stats = [
    { label: 'Sites Visited', value: String(passportStamps.length), icon: MapPin },
    { label: 'Stamps Collected', value: String(passportStamps.length), icon: Stamp },
    { label: 'Routes Planned', value: String(itinerary.length), icon: Route },
    { label: 'Days Active', value: String(daysActive), icon: TrendingUp },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  const openAIChat = () => {
    window.dispatchEvent(new CustomEvent('opencode-ai-chat'));
  };

  const quickActions = [
    { label: 'Explore Map', path: '/explore-map', icon: Compass, color: 'text-primary bg-primary-50', onClick: undefined },
    { label: 'AI Assistant', path: null, icon: Bot, color: 'text-secondary bg-secondary-50', onClick: openAIChat },
    { label: 'Passport', path: '/passport', icon: Stamp, color: 'text-primary bg-primary-50', onClick: undefined },
    { label: 'Memory Book', path: '/memory-book', icon: BookOpen, color: 'text-accent bg-accent-50', onClick: undefined },
    { label: 'Emergency', path: '/emergency', icon: Phone, color: 'text-red-500 bg-red-50', onClick: undefined },
    { label: 'Quests', path: '/quests', icon: Trophy, color: 'text-secondary bg-secondary-50', onClick: undefined },
  ];

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="primary" size="md" className="mb-3">
            Overview
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            {user ? `Welcome, ${user.name}` : 'Dashboard'}
          </h1>
          <p className="mt-2 text-text-secondary">
            Track your heritage journey across Nepal.
          </p>
        </motion.div>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-6 p-5 rounded-xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Level {levelInfo.level} — {getLevelTitle(levelInfo.level)}
                </p>
                <p className="text-xs text-text-secondary">
                  {user.xp} / {levelInfo.nextLevelXp} XP to next level
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary flex items-center justify-center font-bold">
                {levelInfo.level}
              </div>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((user.xp / levelInfo.nextLevelXp) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-secondary"
              />
            </div>
          </motion.div>
        )}

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-secondary">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                action.onClick ? (
                  <button key={action.label} onClick={action.onClick} className="w-full text-left">
                    <Card hover padding="sm" className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{action.label}</span>
                    </Card>
                  </button>
                ) : (
                  <Link key={action.label} to={action.path!}>
                    <Card hover padding="sm" className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{action.label}</span>
                    </Card>
                  </Link>
                )
              ))}
            </div>
          </motion.div>

          {unlockedAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                Achievements ({unlockedAchievements.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {unlockedAchievements.map((a) => (
                  <Badge key={a.id} variant="primary" size="md" className="gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {a.title}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
            <Card padding="sm">
              {recentActivity.length === 0 ? (
                <div className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">No activity yet. Start exploring!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.slice(0, 6).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-xs text-text-secondary shrink-0 mt-0.5">
                        {getTimeAgo(activity.timestamp)}
                      </div>
                      <p className="text-sm text-text-primary">{activity.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}