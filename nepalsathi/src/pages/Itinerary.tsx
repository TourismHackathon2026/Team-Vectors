import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunrise, Sunset, Moon, Plus, X, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';
import { generateId, cn } from '../utils/helpers';
import type { ItineraryItem } from '../types';

const timeSlots = [
  { key: 'morning', label: 'Morning', icon: Sunrise, color: 'text-amber-600 bg-amber-50', time: '6 AM – 11 AM' },
  { key: 'lunch', label: 'Lunch', icon: Sun, color: 'text-orange-600 bg-orange-50', time: '11 AM – 2 PM' },
  { key: 'afternoon', label: 'Afternoon', icon: Sunset, color: 'text-primary bg-primary-50', time: '2 PM – 5 PM' },
  { key: 'evening', label: 'Evening', icon: Moon, color: 'text-indigo-600 bg-indigo-50', time: '5 PM – 8 PM' },
  { key: 'night', label: 'Night', icon: Moon, color: 'text-blue-600 bg-blue-50', time: '8 PM onwards' },
] as const;

export default function Itinerary() {
  const { itinerary, updateItinerary } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ timeSlot: 'morning' as ItineraryItem['timeSlot'], title: '', description: '' });

  const openNew = (slot?: ItineraryItem['timeSlot']) => {
    setEditingId(null);
    setForm({ timeSlot: slot || 'morning', title: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (item: ItineraryItem) => {
    setEditingId(item.id);
    setForm({ timeSlot: item.timeSlot, title: item.title, description: item.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateItinerary(itinerary.map((item) =>
        item.id === editingId ? { ...item, ...form, title: form.title.trim(), description: form.description.trim() } : item,
      ));
    } else {
      const maxOrder = itinerary.filter((i) => i.timeSlot === form.timeSlot).length;
      updateItinerary([...itinerary, { id: generateId(), ...form, title: form.title.trim(), description: form.description.trim(), order: maxOrder + 1 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    updateItinerary(itinerary.filter((i) => i.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = itinerary.findIndex((i) => i.id === id);
    if (index === -1) return;
    const newList = [...itinerary];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newList.length) return;
    [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
    updateItinerary(newList);
  };

  const grouped = timeSlots.map((slot) => ({
    ...slot,
    items: itinerary.filter((i) => i.timeSlot === slot.key).sort((a, b) => a.order - b.order),
  }));

  const hasItems = itinerary.length > 0;

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
              Planning
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
              Itinerary Planner
            </h1>
            <p className="mt-2 text-text-secondary">
              Plan your day with a timeline itinerary.
            </p>
          </div>
          <Button onClick={() => openNew()} size="sm" className="gap-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            Add Activity
          </Button>
        </motion.div>

        {!hasItems && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="mt-4 p-12 text-center">
              <Clock className="w-10 h-10 text-text-secondary mx-auto mb-3" />
              <p className="text-sm font-medium text-text-primary mb-1">No activities planned</p>
              <p className="text-xs text-text-secondary mb-4">Start building your day itinerary.</p>
              <Button size="sm" onClick={() => openNew()} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Add First Activity
              </Button>
            </Card>
          </motion.div>
        )}

        <div className="space-y-6">
          {grouped.map((slot) => {
            if (slot.items.length === 0 && !hasItems) return null;
            const SlotIcon = slot.icon;
            return (
              <motion.div
                key={slot.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', slot.color)}>
                    <SlotIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">{slot.label}</h2>
                    <p className="text-xs text-text-secondary">{slot.time}</p>
                  </div>
                  <button
                    onClick={() => openNew(slot.key)}
                    className="ml-auto p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {slot.items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card hover padding="sm" className="mb-2 group">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => moveItem(item.id, 'up')}
                              className="p-0.5 rounded text-text-secondary hover:text-primary transition-colors"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <span className="text-[10px] text-text-secondary font-mono">{idx + 1}</span>
                            <button
                              onClick={() => moveItem(item.id, 'down')}
                              className="p-0.5 rounded text-text-secondary hover:text-primary transition-colors"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEdit(item)}>
                            <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
                            {item.description && (
                              <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Activity' : 'Add Activity'}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">Time Slot</label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => {
                const SlotIcon = slot.icon;
                return (
                  <button
                    key={slot.key}
                    onClick={() => setForm({ ...form, timeSlot: slot.key as ItineraryItem['timeSlot'] })}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all',
                      form.timeSlot === slot.key
                        ? `${slot.color} ${slot.color.replace('text-', 'border-').replace('bg-', '')}`
                        : 'bg-card border-border text-text-secondary hover:text-text-primary',
                    )}
                  >
                    <SlotIcon className="w-3.5 h-3.5" />
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Input
            id="title"
            label="Activity"
            placeholder="e.g. Visit Swayambhunath"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label htmlFor="desc" className="block text-sm font-medium text-text-primary">Description (optional)</label>
            <textarea
              id="desc"
              rows={2}
              placeholder="Any notes or details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={!form.title.trim()}>
              {editingId ? 'Save Changes' : 'Add to Itinerary'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
