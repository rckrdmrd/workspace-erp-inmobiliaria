/**
 * AchievementsList Component
 * Grid display of all achievements with filtering
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Coins,
  EyeOff,
  Grid,
  Search,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import { AchievementCard } from './AchievementCard';
import type { AchievementCategory } from '../../types/achievementsTypes';

const categories: { value: AchievementCategory | 'all'; label: string; IconComponent: LucideIcon }[] = [
  { value: 'all', label: 'Todos', IconComponent: Grid },
  { value: 'progress', label: 'Progreso', IconComponent: TrendingUp },
  { value: 'mastery', label: 'Maestría', IconComponent: Award },
  { value: 'social', label: 'Social', IconComponent: Users },
  { value: 'hidden', label: 'Ocultos', IconComponent: EyeOff },
];

export const AchievementsList: React.FC = () => {
  const { getFilteredAchievements, filterByCategory, selectedCategory, stats } = useAchievements();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    filterByCategory(category === 'all' ? null : category);
  };

  const achievements = getFilteredAchievements();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-detective shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-detective-gold" />
            <span className="text-detective-sm text-detective-text-secondary">Total</span>
          </div>
          <p className="text-detective-2xl font-bold text-detective-text">
            {stats.unlockedAchievements}/{stats.totalAchievements}
          </p>
        </div>

        <div className="bg-white p-4 rounded-detective shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-detective-gold" />
            <span className="text-detective-sm text-detective-text-secondary">ML Ganados</span>
          </div>
          <p className="text-detective-2xl font-bold text-detective-text">
            {stats.totalMlCoinsEarned}
          </p>
        </div>

        <div className="bg-white p-4 rounded-detective shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-detective-orange" />
            <span className="text-detective-sm text-detective-text-secondary">XP Ganado</span>
          </div>
          <p className="text-detective-2xl font-bold text-detective-text">
            {stats.totalXpEarned}
          </p>
        </div>

        <div className="bg-white p-4 rounded-detective shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-detective-orange" />
            <span className="text-detective-sm text-detective-text-secondary">Completado</span>
          </div>
          <p className="text-detective-2xl font-bold text-detective-text">
            {Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const { IconComponent } = category;
          const isActive = activeFilter === category.value;

          return (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange(category.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-detective font-semibold transition-all ${
                isActive
                  ? 'bg-detective-orange text-white shadow-orange'
                  : 'bg-white text-detective-text hover:bg-detective-bg shadow-card'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AchievementCard achievement={achievement} />
          </motion.div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-detective-lg text-detective-text-secondary">
            No se encontraron logros en esta categoría
          </p>
        </div>
      )}
    </div>
  );
};
