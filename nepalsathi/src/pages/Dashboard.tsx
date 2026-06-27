import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Stamp, Route, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { passportService } from '../services/passport';
import { authService } from '../services/passport';

export default function Dashboard() {
  const [entryCount, setEntryCount] = useState(0);
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    setEntryCount(passportService.getEntryCount());
    const interval = setInterval(() => {
      setEntryCount(passportService.getEntryCount());
      setUser(authService.getUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Sites Visited', value: String(entryCount), icon: MapPin },
    { label: 'Stamps Collected', value: String(entryCount), icon: Stamp },
    { label: 'Routes Planned', value: '3', icon: Route },
    { label: 'Days Active', value: user ? '1' : '0', icon: TrendingUp },
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
            Dashboard
          </h1>
          <p className="mt-2 text-text-secondary">
            {user ? `Welcome back, ${user.name}. ` : ''}
            Track your heritage journey across Nepal.
          </p>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {entryCount === 0 ? (
          <Card className="mt-8">
            <EmptyState
              icon={<TrendingUp className="w-8 h-8" />}
              title="Start your journey"
              description="Visit heritage sites and collect stamps to see your activity here."
            />
          </Card>
        ) : (
          <Card className="mt-8 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Recent Activity</h2>
            <p className="text-sm text-text-secondary">
              You have collected {entryCount} stamp{entryCount !== 1 ? 's' : ''} so far. Keep exploring!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}