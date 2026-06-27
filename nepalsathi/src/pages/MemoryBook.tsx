import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, MapPin, Calendar, Image } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../context/DataContext';
import { formatDate, cn } from '../utils/helpers';

export default function MemoryBook() {
  const { memoryBook, addMemoryEntry } = useData();
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ placeName: '', notes: '', visitDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = () => {
    if (!form.placeName.trim()) return;
    addMemoryEntry({
      placeId: form.placeName.toLowerCase().replace(/\s+/g, '-'),
      placeName: form.placeName.trim(),
      visitDate: new Date(form.visitDate).toISOString(),
      notes: form.notes.trim(),
      photos: [],
    });
    setForm({ placeName: '', notes: '', visitDate: new Date().toISOString().split('T')[0] });
    setShowModal(false);
  };

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <Badge variant="secondary" size="md" className="mb-3">
              Journal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
              Memory Book
            </h1>
            <p className="mt-2 text-text-secondary">
              Your personal travel journal.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} size="sm" className="gap-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </motion.div>

        {memoryBook.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="mt-4">
              <EmptyState
                icon={<BookOpen className="w-8 h-8" />}
                title="No memories yet"
                description="Start documenting your heritage journey by adding entries to your memory book."
                action={{
                  label: 'Write First Entry',
                  onClick: () => setShowModal(true),
                }}
              />
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {memoryBook.map((entry, i) => {
              const isExpanded = expandedId === entry.id;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card hover padding="md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">{entry.placeName}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                              <span className="text-xs text-text-secondary">{formatDate(entry.visitDate)}</span>
                            </div>
                          </div>
                        </div>

                        {entry.notes && (
                          <div className="mt-3">
                            <p className={cn(
                              'text-sm text-text-secondary leading-relaxed',
                              !isExpanded && 'line-clamp-3',
                            )}>
                              {entry.notes}
                            </p>
                            {entry.notes.length > 150 && (
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                className="text-xs text-primary hover:text-primary-700 mt-1 transition-colors"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        )}

                        {entry.photos.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {entry.photos.map((_photo, j) => (
                              <div key={j} className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Image className="w-5 h-5 text-text-secondary" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Memory Entry">
        <div className="space-y-4">
          <Input
            id="place"
            label="Place Name"
            placeholder="e.g. Swayambhunath Stupa"
            value={form.placeName}
            onChange={(e) => setForm({ ...form, placeName: e.target.value })}
            required
          />
          <Input
            id="visit-date"
            label="Visit Date"
            type="date"
            value={form.visitDate}
            onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label htmlFor="notes" className="block text-sm font-medium text-text-primary">Notes</label>
            <textarea
              id="notes"
              rows={4}
              placeholder="What did you see, feel, or learn?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!form.placeName.trim()}>
              Save Memory
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
