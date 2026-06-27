import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export default function Passport() {
  const hasPassport = false;

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
          </p>
        </motion.div>

        {hasPassport ? (
          <div className="mt-8 space-y-4">{/* Passport entries will go here */}</div>
        ) : (
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
                  onClick: () => {},
                }}
              />
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}