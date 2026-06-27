import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';

export default function Itinerary() {
  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="primary" size="md" className="mb-3">
            Planning
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Itinerary Planner
          </h1>
          <p className="mt-2 text-text-secondary">
            Plan your day with a timeline itinerary.
          </p>
        </motion.div>
      </div>
    </div>
  );
}