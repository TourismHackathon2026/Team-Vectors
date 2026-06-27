import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { passportService } from '../services/passport';
import { formatDate } from '../utils/helpers';
import type { PassportEntry } from '../types';

export default function Passport() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<PassportEntry[]>([]);

  useEffect(() => {
    setEntries(passportService.getEntries());
  }, []);

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="primary" size="md" className="mb-3">
            Your Journey
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            My Passport
          </h1>
          <p className="mt-2 text-text-secondary">
            Every heritage site you visit adds a stamp to your digital passport.
            {entries.length > 0 && (
              <span className="font-medium text-primary"> {entries.length} site{entries.length !== 1 ? 's' : ''} collected.</span>
            )}
          </p>
        </motion.div>

        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="mt-8">
              <EmptyState
                icon={<MapPin className="w-8 h-8" />}
                title="No stamps yet"
                description="Visit a heritage site and collect your first digital stamp to start building your passport."
                action={{
                  label: 'Explore Heritage Sites',
                  onClick: () => navigate('/explore'),
                }}
              />
            </Card>
          </motion.div>
        ) : (
          <div className="mt-8 space-y-3">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link to={`/heritage/${entry.siteId}`}>
                  <Card hover padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {entry.siteName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="text-xs text-text-secondary">
                          {formatDate(entry.visitedAt)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm" className="shrink-0">
                      Stamp Collected
                    </Badge>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}