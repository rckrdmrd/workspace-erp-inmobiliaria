/**
 * AchievementGrid Component
 * Responsive grid layout with animations and empty states
 * ~200 lines
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Lock, Trophy } from 'lucide-react';
import { AchievementCard } from '@/features/gamification/social/components/Achievements/AchievementCard';
import type { Achievement } from '@/features/gamification/social/types/achievementsTypes';

interface AchievementGridProps {
  achievements: Achievement[];
  loading?: boolean;
  onAchievementClick: (achievement: Achievement) => void;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  loading = false,
  onAchievementClick,
}) => {
  // Stagger animation for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  } as const;

  // Skeleton loading state
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-2xl h-64 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Empty state - No achievements at all
  if (achievements.length === 0 && !loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-6">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="inline-block"
            >
              <Trophy className="w-32 h-32 text-gray-300 mx-auto" />
            </motion.div>
          </div>
          <h3 className="text-3xl font-bold text-detective-text mb-3">
            ¡Comienza tu viaje!
          </h3>
          <p className="text-xl text-detective-text-secondary mb-6 max-w-md mx-auto">
            Completa ejercicios y desafíos para desbloquear increíbles logros
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-detective-orange to-detective-gold text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              Explorar Módulos
            </button>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  // Empty state - No search results
  if (achievements.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Search className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-detective-text mb-3">
            No se encontraron logros
          </h3>
          <p className="text-xl text-detective-text-secondary mb-6">
            Intenta con diferentes palabras clave o ajusta tus filtros
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="px-6 py-3 bg-detective-orange text-white font-semibold rounded-xl hover:bg-detective-orange-dark transition-colors">
                Limpiar filtros
              </button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="px-6 py-3 bg-white text-detective-text font-semibold rounded-xl border-2 border-gray-200 hover:border-detective-orange transition-colors">
                Explorar categorías
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Main grid with achievements
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Results header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-detective-text flex items-center gap-2">
          <Trophy className="w-6 h-6 text-detective-orange" />
          Logros ({achievements.length})
        </h2>

        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-4 text-sm text-detective-text-secondary">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-detective-gold" />
            <span>
              {achievements.filter(a => a.isUnlocked).length} desbloqueados
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4 text-gray-400" />
            <span>
              {achievements.filter(a => !a.isUnlocked).length} bloqueados
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.2 },
              }}
            >
              <AchievementCard
                achievement={achievement}
                onClick={() => onAchievementClick(achievement)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Motivational footer */}
      {achievements.some(a => !a.isUnlocked) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-detective-orange/10 to-detective-gold/10 rounded-2xl px-8 py-4 border-2 border-detective-orange/20">
            <p className="text-lg font-semibold text-detective-text">
              ¡Sigue adelante! 💪
            </p>
            <p className="text-sm text-detective-text-secondary">
              Tienes {achievements.filter(a => !a.isUnlocked).length} logros por desbloquear
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
};
