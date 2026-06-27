import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Circle, Sparkles, UtensilsCrossed, Landmark, Hand, TreePine, Music, Coffee, ShoppingBag, Compass, Lock, Key, Shield, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { quests as questData } from '../data/quests';
import { cn } from '../utils/helpers';
import { useState, useMemo } from 'react';

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
const secretQuestIds = new Set(['quest-21', 'quest-22', 'quest-23']);

export default function Quests() {
  const { quests, stories, completeQuest, addActivity, unlockAchievement } = useData();
  const { user, updateProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCompleted, setShowCompleted] = useState(false);

  const completedHeritageCount = quests.filter((q) => !secretQuestIds.has(q.id) && q.category === 'Heritage' && q.completed).length;
  const completedHiddenGemsCount = quests.filter((q) => !secretQuestIds.has(q.id) && q.category === 'Hidden Gems' && q.completed).length;
  const totalHeritage = quests.filter((q) => !secretQuestIds.has(q.id) && q.category === 'Heritage').length;
  const totalHiddenGems = quests.filter((q) => !secretQuestIds.has(q.id) && q.category === 'Hidden Gems').length;

  const isSecretUnlocked = useMemo(() => {
    return {
      'quest-21': completedHeritageCount >= totalHeritage,
      'quest-22': completedHeritageCount >= totalHeritage && completedHiddenGemsCount >= totalHiddenGems,
      'quest-23': completedHeritageCount >= totalHeritage && completedHiddenGemsCount >= totalHiddenGems,
    };
  }, [completedHeritageCount, completedHiddenGemsCount, totalHeritage, totalHiddenGems]);

  const tasks = quests.filter((q) => {
    if (secretQuestIds.has(q.id) && !isSecretUnlocked[q.id as keyof typeof isSecretUnlocked]) return false;
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

    if (questId === 'quest-23') {
      unlockAchievement('ach-master');
      addActivity('achievement', 'Unlocked: Nepal Master — completed the secret questline!');
    }
  };

  const secretProgress = completedHeritageCount < totalHeritage || completedHiddenGemsCount < totalHiddenGems;

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

        {stories.length > 0 && (
          <Link to="/story">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/15 hover:bg-accent/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">Your Story</p>
                  <p className="text-xs text-text-secondary truncate">
                    {stories.length} chapter{stories.length !== 1 ? 's' : ''} written &middot; Latest: {stories[stories.length - 1]?.questTitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0" />
              </div>
            </motion.div>
          </Link>
        )}

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

        {secretProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Secret Questline Locked</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Complete all Heritage ({completedHeritageCount}/{totalHeritage}) and Hidden Gems ({completedHiddenGemsCount}/{totalHiddenGems}) quests to unlock.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {!secretProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700"
          >
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Secret Questline Unlocked!</p>
                <p className="text-xs text-green-600 dark:text-green-400">Ancient challenges await the worthy explorer. Complete them all to become a Nepal Master.</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((quest, i) => {
            const IconComponent = categoryIcons[quest.category] || Shield;
            const isCompleted = quest.completed;
            const isSecret = secretQuestIds.has(quest.id);
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
                    isSecret && 'border-amber-300 dark:border-amber-600 bg-gradient-to-br from-amber-50/50 to-transparent',
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isCompleted ? 'bg-green-50 text-green-600' : isSecret ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary',
                    )}>
                      {isSecret ? (
                        <Key className="w-5 h-5" />
                      ) : IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <Badge variant={isCompleted ? 'default' : isSecret ? 'secondary' : 'secondary'} size="sm">
                      +{quest.xpReward} XP
                    </Badge>
                  </div>

                  <h3 className={cn(
                    'text-base font-semibold mb-1',
                    isCompleted ? 'text-text-secondary line-through' : isSecret ? 'text-amber-800 dark:text-amber-300' : 'text-text-primary',
                  )}>
                    {isSecret && '🗝️ '}{quest.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {quest.description}
                  </p>

                  <Button
                    size="sm"
                    variant={isCompleted ? 'ghost' : isSecret ? 'secondary' : 'outline'}
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