import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stamp, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/helpers';

export default function Stamps() {
  const { passportStamps } = useData();

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="secondary" size="md" className="mb-3">
            Collection
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            My Stamps
          </h1>
          <p className="mt-2 text-text-secondary">
            Every heritage site you visit rewards you with a unique stamp.
            {passportStamps.length > 0 && (
              <span className="font-medium text-secondary"> {passportStamps.length} stamp{passportStamps.length !== 1 ? 's' : ''} collected.</span>
            )}
          </p>
        </motion.div>

        {passportStamps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="mt-8">
              <EmptyState
                icon={<Stamp className="w-8 h-8" />}
                title="No stamps collected"
                description="Start exploring heritage sites to collect unique stamps for your collection."
              />
            </Card>
          </motion.div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {passportStamps.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link to={`/heritage/${entry.siteId}`}>
                  <Card hover padding="lg" className="text-center h-full">
                    <div className="w-16 h-16 rounded-2xl bg-secondary-50 text-secondary flex items-center justify-center mx-auto mb-4">
                      <Stamp className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">
                      {entry.siteName}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
                      <Calendar className="w-3 h-3" />
                      {formatDate(entry.visitedAt)}
                    </div>
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
