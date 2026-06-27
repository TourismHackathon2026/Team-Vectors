import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';

export default function MemoryBook() {
  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="secondary" size="md" className="mb-3">
            Journal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Memory Book
          </h1>
          <p className="mt-2 text-text-secondary">
            Your personal travel journal.
          </p>
        </motion.div>
      </div>
    </div>
  );
}