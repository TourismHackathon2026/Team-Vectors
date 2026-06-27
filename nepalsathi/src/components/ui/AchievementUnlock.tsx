import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle } from 'lucide-react';

export function AchievementUnlockAnimation({ title, onComplete }: { title: string; onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-sm mx-4 border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Achievement Unlocked!</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">{title}</p>
          </div>
          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Remaining in 3 seconds...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}