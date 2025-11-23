/**
 * AchievementsPreview Component
 *
 * Preview of recent achievements with filtering and link to full page
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Coins,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AchievementData } from '../../hooks/useDashboardData';

interface AchievementsPreviewProps {
  achievements: AchievementData[];
}

type FilterType = 'all' | 'recent' | 'rare' | 'legendary';

const rarityColors = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    badge: 'bg-gray-400',
    text: 'text-gray-700',
    glow: 'shadow-sm',
  },
  rare: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    badge: 'bg-blue-500',
    text: 'text-blue-700',
    glow: 'shadow-md shadow-blue-200',
  },
  epic: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    badge: 'bg-orange-500',
    text: 'text-orange-700',
    glow: 'shadow-lg shadow-orange-200',
  },
  legendary: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    badge: 'bg-detective-gold',
    text: 'text-yellow-800',
    glow: 'shadow-xl shadow-yellow-300',
  },
};

export function AchievementsPreview({ achievements }: AchievementsPreviewProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'recent') return achievement.unlocked && achievement.unlockedAt;
    if (filter === 'rare') return achievement.rarity === 'rare';
    if (filter === 'legendary') return achievement.rarity === 'legendary';
    return true;
  }).slice(0, 6);

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: <Trophy className="w-4 h-4" /> },
    { id: 'recent', label: 'Recientes', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'rare', label: 'Raros', icon: <Award className="w-4 h-4" /> },
    { id: 'legendary', label: 'Legendarios', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-detective-text flex items-center gap-2">
          <Trophy className="w-7 h-7 text-detective-gold" />
          Logros Recientes
        </h2>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f.id
                  ? 'bg-detective-orange text-white shadow-md'
                  : 'bg-white text-detective-text-secondary border border-gray-200 hover:border-detective-orange'
              }`}
            >
              {f.icon}
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const isLocked = !achievement.unlocked;
          const rarity = rarityColors[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                rarity.bg
              } ${rarity.border} ${rarity.glow} ${
                isLocked ? 'opacity-60 grayscale' : ''
              }`}
            >
              {/* Rarity Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`${rarity.badge} text-white text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide shadow-sm`}
                >
                  {achievement.rarity}
                </span>
              </div>

              {/* Unlocked Check */}
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 + index * 0.1 }}
                  className="absolute top-3 left-3 z-10"
                >
                  <CheckCircle className="w-6 h-6 text-green-500" fill="white" />
                </motion.div>
              )}

              {/* Achievement Icon */}
              <div className="flex justify-center mb-3 mt-2">
                <div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md ${
                    isLocked
                      ? 'bg-gray-300'
                      : 'bg-gradient-to-br from-detective-orange to-detective-orange-dark'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-8 h-8 text-gray-500" />
                  ) : (
                    <span>{achievement.icon}</span>
                  )}

                  {/* Shimmer effect for unlocked */}
                  {achievement.unlocked && achievement.rarity === 'legendary' && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        background: [
                          'radial-gradient(circle at 0% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                          'radial-gradient(circle at 100% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                          'radial-gradient(circle at 0% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-center font-bold mb-2 ${rarity.text} text-base`}>
                {achievement.name}
              </h3>

              {/* Description */}
              <p className="text-center text-detective-text-secondary text-sm mb-3 min-h-[40px]">
                {achievement.description}
              </p>

              {/* Progress Bar (for locked achievements) */}
              {!achievement.unlocked && achievement.progress !== undefined && achievement.required !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-detective-text-secondary mb-1">
                    <span>Progreso</span>
                    <span className="font-semibold">
                      {achievement.progress}/{achievement.required}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-detective-orange to-detective-gold"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(achievement.progress / achievement.required) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                </div>
              )}

              {/* Unlock Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-center text-xs text-detective-text-secondary mb-3">
                  Desbloqueado:{' '}
                  {new Date(achievement.unlockedAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              )}

              {/* Rewards (if available - mock data) */}
              <div className="flex justify-around items-center pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-detective-gold" />
                  <span className="text-sm font-semibold text-detective-text">
                    +50 ML
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-detective-orange" />
                  <span className="text-sm font-semibold text-detective-text">
                    +100 XP
                  </span>
                </div>
              </div>

              {/* Locked overlay effect */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Lock className="w-12 h-12 text-gray-400 opacity-20" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/achievements')}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-detective-orange to-detective-gold text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Trophy className="w-5 h-5" />
          Ver Todos los Logros
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
