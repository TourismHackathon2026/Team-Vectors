import { motion } from 'framer-motion';
import { Stamp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export default function Stamps() {
  const stamps: { id: string; name: string; date: string }[] = [];

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
          </p>
        </motion.div>

        {stamps.length === 0 ? (
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
            {stamps.map((stamp) => (
              <Card key={stamp.id}>
                <p>{stamp.name}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}