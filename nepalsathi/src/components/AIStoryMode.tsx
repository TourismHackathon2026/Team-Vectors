import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { siteStories } from '../data/ai-responses';

interface AIStoryModeProps {
  siteId: string;
  siteName: string;
}

export function AIStoryMode({ siteId, siteName }: AIStoryModeProps) {
  const [expanded, setExpanded] = useState(false);
  const story = siteStories[siteId];

  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card padding="md" className="mt-8 border-primary-200 bg-primary-50/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm" className="gap-1">
                <Sparkles className="w-3 h-3" />
                AI Story Mode
              </Badge>
            </div>
            <h3 className="text-lg font-bold font-serif text-text-primary">
              The Story of {siteName}
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">History</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{story.history}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">Local Legend</h4>
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  &ldquo;{story.legend}&rdquo;
                </p>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-1">Local Tips</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">{story.tips}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="gap-1.5"
              >
                {expanded ? (
                  <>Less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Read more <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
