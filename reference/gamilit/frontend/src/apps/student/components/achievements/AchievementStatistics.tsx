/**
 * AchievementStatistics Component
 * Statistics panel with charts, recent unlocks, and motivational content
 * ~180 lines
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Award,
  Target,
  Sparkles,
  Trophy,
  Flame,
  Star,
} from 'lucide-react';
import type { AchievementStatisticsData as AchievementStats } from './types';
import type { Achievement } from '@/features/gamification/social/types/achievementsTypes';

interface AchievementStatisticsProps {
  statistics: AchievementStats;
}

export const AchievementStatistics: React.FC<AchievementStatisticsProps> = ({
  statistics,
}) => {
  // Category icons
  const categoryIcons = {
    progress: TrendingUp,
    mastery: Award,
    social: Trophy,
    hidden: Star,
  };

  // Category colors
  const categoryColors = {
    progress: 'from-blue-500 to-blue-600',
    mastery: 'from-orange-500 to-orange-600',
    social: 'from-green-500 to-green-600',
    hidden: 'from-purple-500 to-purple-600',
  };

  // Rarity colors
  const rarityColors = {
    common: 'text-gray-600',
    rare: 'text-green-600',
    epic: 'text-purple-600',
    legendary: 'text-yellow-600',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold text-detective-text mb-2 flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-detective-orange" />
            Estadísticas de Logros
          </h2>
          <p className="text-detective-text-secondary">
            Tu progreso en números
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completion Rate Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-detective-orange" />
              Tasa de Completación
            </h3>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-detective-orange mb-2">
                  {statistics.completionRate.toFixed(0)}%
                </div>
                <p className="text-detective-text-secondary">
                  {statistics.unlocked} de {statistics.total} logros
                </p>
                <div className="mt-4 h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${statistics.completionRate}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-detective-orange to-detective-gold"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Unlocks Timeline */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-detective-orange" />
              Recientes Desbloqueados
            </h3>
            {statistics.recentUnlocks.length > 0 ? (
              <div className="space-y-3">
                {statistics.recentUnlocks.slice(0, 3).map((achievement, idx) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-detective-bg rounded-xl hover:bg-detective-bg-secondary transition-colors"
                  >
                    <Trophy className="w-8 h-8 text-detective-gold" />
                    <div className="flex-1">
                      <div className="font-semibold text-detective-text">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-detective-text-secondary">
                        {achievement.unlockedAt &&
                          new Date(achievement.unlockedAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-detective-text-secondary">
                Aún no has desbloqueado ningún logro
              </div>
            )}
          </motion.div>

          {/* Rarity Breakdown */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-detective-orange" />
              Por Rareza
            </h3>
            <div className="space-y-3">
              {Object.entries(statistics.byRarity).map(([rarity, count]) => (
                <div key={rarity}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold capitalize ${rarityColors[rarity as keyof typeof rarityColors]}`}>
                      {rarity === 'common' ? 'Común' :
                       rarity === 'rare' ? 'Rara' :
                       rarity === 'epic' ? 'Épica' : 'Legendaria'}
                    </span>
                    <span className="text-detective-text-secondary">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: statistics.total > 0 ? `${(count / statistics.total) * 100}%` : '0%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${
                        rarity === 'legendary'
                          ? 'bg-gradient-to-r from-yellow-400 to-detective-gold'
                          : rarity === 'epic'
                          ? 'bg-gradient-to-r from-purple-400 to-purple-600'
                          : rarity === 'rare'
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : 'bg-gradient-to-r from-gray-400 to-gray-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-detective-orange" />
              Por Categoría
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(statistics.byCategory).map(([category, count]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const gradient = categoryColors[category as keyof typeof categoryColors];

                return (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${gradient} text-white`}
                  >
                    <Icon className="w-8 h-8 mb-2" />
                    <div className="text-3xl font-bold">{count}</div>
                    <div className="text-sm opacity-90 capitalize">
                      {category === 'progress' ? 'Progreso' :
                       category === 'mastery' ? 'Maestría' :
                       category === 'social' ? 'Social' : 'Ocultos'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Motivational Message */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-detective-orange to-detective-gold rounded-2xl p-8 text-white text-center shadow-2xl"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="inline-block mb-4"
          >
            <Flame className="w-16 h-16" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-2">¡Sigue Así!</h3>
          <p className="text-xl opacity-90 mb-4">
            {statistics.locked > 0
              ? `Tienes ${statistics.locked} logros más esperándote`
              : '¡Has desbloqueado todos los logros disponibles!'}
          </p>
          {statistics.locked > 0 && (
            <p className="text-lg opacity-80">
              Completa más ejercicios y desafíos para desbloquearlos todos 💪
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};
