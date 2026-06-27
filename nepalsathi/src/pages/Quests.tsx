import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Circle, Sparkles, UtensilsCrossed, Landmark, Hand, TreePine, Music, Coffee, ShoppingBag, Compass } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { quests as questData } from '../data/quests';
import { cn } from '../utils/helpers';
import { useState } from 'react';

const categoryIcons: Record<string, React.ElementType> = {
  Food: UtensilsCrossed,
  Heritage: Landmark,
  Crafts: Hand,
  Nature: TreePine,
  Culture: Music,
  Coffee: Coffee,
  Shopping: ShoppingBag,
  'Hidden Gems': Compass,
};

const categories = ['All', ...new Set(questData.map((q) => q.category))];

export default function Quests() {
  const { quests, completeQuest, addActivity } = useData();
  const { user, updateProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCompleted, setShowCompleted] = useState(false);

  const tasks = quests.filter((q) => {
    const matchesCat = activeCategory === 'All' || q.category === activeCategory;
    const matchesStatus = showCompleted ? true : !q.completed;
    return matchesCat && matchesStatus;
  });

  const completedCount = quests.filter((q) => q.completed).length;

  const handleComplete = (questId: string, xp: number, title: string) => {
    if (quests.find((q) => q.id === questId)?.completed) return;
    completeQuest(questId);
    if (user) {
      updateProfile({ xp: (user.xp || 0) + xp });
    }
    addActivity('quest', `Completed quest: ${title}`);
  };

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <Badge variant="secondary" size="md" className="mb-3">
              Challenges
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
              Quests
            </h1>
            <p className="mt-2 text-text-secondary">
              Complete challenges to earn XP and level up.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <Trophy className="w-4 h-4 text-secondary" />
            <span>{completedCount} / {questData.length} completed</span>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-text-secondary hover:text-text-primary',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ml-auto',
              showCompleted
                ? 'bg-primary text-white border-primary'
                : 'bg-card border-border text-text-secondary hover:text-text-primary',
            )}
          >
            {showCompleted ? 'All' : 'Active'}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((quest, i) => {
            const IconComponent = categoryIcons[quest.category];
            const isCompleted = quest.completed;
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Card
                  hover
                  padding="md"
                  className={cn(
                    'h-full transition-all',
                    isCompleted && 'opacity-60',
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isCompleted ? 'bg-green-50 text-green-600' : 'bg-primary-50 text-primary',
                    )}>
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <Badge variant={isCompleted ? 'default' : 'secondary'} size="sm">
                      +{quest.xpReward} XP
                    </Badge>
                  </div>

                  <h3 className={cn(
                    'text-base font-semibold mb-1',
                    isCompleted ? 'text-text-secondary line-through' : 'text-text-primary',
                  )}>
                    {quest.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {quest.description}
                  </p>

                  <Button
                    size="sm"
                    variant={isCompleted ? 'ghost' : 'outline'}
                    onClick={() => handleComplete(quest.id, quest.xpReward, quest.title)}
                    disabled={isCompleted}
                    className="gap-1.5 w-full"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="mt-16 text-center">
            <Trophy className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No quests match your filters.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => { setActiveCategory('All'); setShowCompleted(false); }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
