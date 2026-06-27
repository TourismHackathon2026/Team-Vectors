import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ScrollText, Compass, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const categoryColors: Record<string, string> = {
  Heritage: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Crafts: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Nature: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Culture: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Coffee: 'bg-stone-100 text-stone-700 dark:bg-stone-900/40 dark:text-stone-300',
  Shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'Hidden Gems': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export default function Story() {
  const { stories, quests } = useData();
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" size="md" className="mb-3">
            Your Adventure
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Your Nepal Story
          </h1>
          <p className="mt-2 text-text-secondary max-w-lg mx-auto">
            Every quest you complete adds a chapter to your journey. Watch your adventure unfold.
          </p>
        </motion.div>

        {stories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="lg" className="text-center py-16">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-text-primary mb-2">Your story awaits</h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Complete quests to begin writing your Nepal adventure. Each quest completed adds a new chapter.
              </p>
              <Link to="/quests">
                <Button variant="primary" className="gap-2">
                  <Compass className="w-4 h-4" />
                  Start questing
                </Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-8">
              {stories.map((chapter, i) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-accent border-2 border-surface ring-4 ring-bg z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <Card padding="md" className="relative">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs text-text-muted font-mono">Chapter {chapter.order}</span>
                        <h3 className="text-base font-semibold text-text-primary mt-0.5">
                          {chapter.questTitle}
                        </h3>
                      </div>
                      <Badge
                        variant={chapter.questCategory as any}
                        size="sm"
                        className={categoryColors[chapter.questCategory] || ''}
                      >
                        {chapter.questCategory}
                      </Badge>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed italic">
                      "{chapter.narrative}"
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                      <Sparkles className="w-3 h-3" />
                      <span>{new Date(chapter.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <Card padding="md" className="bg-accent/5 border-accent/15">
                <div className="flex items-center justify-center gap-3">
                  <ScrollText className="w-5 h-5 text-accent" />
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">{stories.length}</span> chapter{stories.length !== 1 ? 's' : ''} written ·
                    <span className="font-semibold text-text-primary ml-1">{completedCount}</span> quest{completedCount !== 1 ? 's' : ''} completed
                  </p>
                </div>
                <Link to="/quests" className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-700 mt-2 font-medium">
                  Continue your adventure <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
