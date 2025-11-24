/**
 * AchievementsPage - Complete Achievements Page for GLIT Platform
 *
 * Features:
 * - Trophy Room hero section
 * - Filters and search
 * - Achievements grid with animations
 * - Progress tree visualizer
 * - WebSocket integration for real-time updates
 * - Achievement unlock modal
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Search,
  Filter,
  Target,
  TrendingUp,
  Award,
  Users,
  EyeOff,
  ArrowUp,
  Sparkles,
  Coins,
  Zap,
} from 'lucide-react';

// Achievements Components
import { AchievementCard } from '@/features/gamification/social/components/Achievements/AchievementCard';
import { AchievementUnlockModal } from '@/features/gamification/social/components/Achievements/AchievementUnlockModal';
import { ProgressTreeVisualizer } from '@/features/gamification/social/components/Achievements/ProgressTreeVisualizer';

// Hooks & Store
import { useAchievements } from '@/features/gamification/social/hooks/useAchievements';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { Achievement, AchievementCategory } from '@/features/gamification/social/types/achievementsTypes';

// Utils
import { cn } from '@shared/utils/cn';

type FilterOption = 'all' | 'locked' | 'unlocked';
type SortOption = 'date' | 'rarity' | 'category' | 'name';

const categories: { value: AchievementCategory | 'all'; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'all', label: 'Todos', icon: Trophy, color: 'from-purple-500 to-pink-500' },
  { value: 'progress', label: 'Progreso', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { value: 'mastery', label: 'Maestria', icon: Award, color: 'from-orange-500 to-red-500' },
  { value: 'social', label: 'Social', icon: Users, color: 'from-green-500 to-emerald-500' },
  { value: 'hidden', label: 'Ocultos', icon: EyeOff, color: 'from-gray-500 to-slate-500' },
];

export default function AchievementsPage() {
  // Auth State
  const { user } = useAuthStore();

  // Store & Hooks
  const {
    achievements,
    unlockedAchievements,
    recentUnlocks,
    stats,
    isLoading,
    error,
    dismissNotification,
    fetchAchievements,
  } = useAchievements({ userId: user?.id, autoFetch: true });

  // Local State
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [lockedFilter, setLockedFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // WebSocket Integration for real-time updates is handled globally via App.tsx
  // The useAchievements hook will automatically update when new achievements are unlocked

  // Auto-show unlock modal for recent unlocks
  useEffect(() => {
    if (recentUnlocks.length > 0) {
      const latestUnlock = recentUnlocks[0];
      setSelectedAchievement(latestUnlock.achievement);
      setShowUnlockModal(true);
    }
  }, [recentUnlocks]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search logic handled in filtered achievements
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievements;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Locked/Unlocked filter
    if (lockedFilter === 'locked') {
      filtered = filtered.filter(a => !a.isUnlocked);
    } else if (lockedFilter === 'unlocked') {
      filtered = filtered.filter(a => a.isUnlocked);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => {
          if (!a.unlockedAt) return 1;
          if (!b.unlockedAt) return -1;
          return b.unlockedAt.getTime() - a.unlockedAt.getTime();
        });
        break;
      case 'rarity':
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
        sorted.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return sorted;
  }, [achievements, selectedCategory, lockedFilter, searchQuery, sortBy]);

  // Featured achievement (most recent legendary/epic unlock)
  const featuredAchievement = useMemo(() => {
    return unlockedAchievements
      .filter(a => a.rarity === 'legendary' || a.rarity === 'epic')
      .sort((a, b) => {
        if (!a.unlockedAt || !b.unlockedAt) return 0;
        return b.unlockedAt.getTime() - a.unlockedAt.getTime();
      })[0];
  }, [unlockedAchievements]);

  const completionPercentage = stats.totalAchievements > 0
    ? Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)
    : 0;

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowUnlockModal(true);
  };

  const handleCloseModal = () => {
    setShowUnlockModal(false);
    if (recentUnlocks.length > 0) {
      dismissNotification(recentUnlocks[0].achievement.id);
    }
  };

  // Save filter preferences to localStorage
  useEffect(() => {
    localStorage.setItem('achievements_filters', JSON.stringify({
      category: selectedCategory,
      lockedFilter,
      sortBy,
    }));
  }, [selectedCategory, lockedFilter, sortBy]);

  // Load filter preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('achievements_filters');
    if (saved) {
      try {
        const { category, lockedFilter: lf, sortBy: sb } = JSON.parse(saved);
        if (category) setSelectedCategory(category);
        if (lf) setLockedFilter(lf);
        if (sb) setSortBy(sb);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Hero Section - Trophy Room */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-12 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Stats */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
                  <Trophy className="w-12 h-12" />
                  Sala de Trofeos
                </h1>
                <p className="text-xl opacity-90 mb-6">
                  Tu coleccion de logros y conquistas
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{stats.unlockedAchievements}</div>
                  <div className="text-sm opacity-80">Desbloqueados</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{completionPercentage}%</div>
                  <div className="text-sm opacity-80">Completado</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold flex items-center gap-1">
                    {stats.totalMlCoinsEarned}
                    <Coins className="w-5 h-5" />
                  </div>
                  <div className="text-sm opacity-80">ML Ganados</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold flex items-center gap-1">
                    {stats.totalXpEarned}
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="text-sm opacity-80">XP Ganado</div>
                </div>
              </motion.div>
            </div>

            {/* Featured Achievement */}
            {featuredAchievement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/20 backdrop-blur-md rounded-xl p-6 max-w-xs"
              >
                <div className="text-sm opacity-90 mb-2">Logro Destacado</div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{featuredAchievement.title}</h3>
                    <p className="text-sm opacity-80">{featuredAchievement.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Filters & Search */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-detective-bg rounded-lg"
            >
              <span className="flex items-center gap-2 font-semibold text-detective-text">
                <Filter className="w-5 h-5" />
                Filtros
              </span>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.div>
            </button>
          </div>

          {/* Filters */}
          <div className={cn(
            "space-y-4",
            !showFilters && "hidden md:block"
          )}>
            {/* Category Filters */}
            <div>
              <label className="text-sm font-semibold text-detective-text-secondary mb-2 block">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.value;

                  return (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all",
                        isActive
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : 'bg-detective-bg text-detective-text hover:bg-detective-bg-secondary'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Search and Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-detective-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar logros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-detective-orange focus:outline-none"
                />
              </div>

              {/* Locked/Unlocked Filter */}
              <select
                value={lockedFilter}
                onChange={(e) => setLockedFilter(e.target.value as FilterOption)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-detective-orange focus:outline-none"
              >
                <option value="all">Todos los logros</option>
                <option value="unlocked">Solo desbloqueados</option>
                <option value="locked">Solo bloqueados</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-detective-orange focus:outline-none"
              >
                <option value="date">Ordenar por fecha</option>
                <option value="rarity">Ordenar por rareza</option>
                <option value="category">Ordenar por categoria</option>
                <option value="name">Ordenar por nombre</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-detective-text">
            Logros ({filteredAchievements.length})
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Trophy className="w-16 h-16 text-detective-orange" />
            </motion.div>
            <p className="text-detective-text-secondary mt-4">Cargando logros...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16 bg-red-50 rounded-lg">
            <div className="text-red-500 mb-4">
              <Award className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">Error al cargar logros</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => user?.id && fetchAchievements(user.id)}
              className="px-6 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Achievements Grid */}
        {!isLoading && !error && filteredAchievements.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AchievementCard
                  achievement={achievement}
                  onClick={() => handleAchievementClick(achievement)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : !isLoading && !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-detective-text mb-2">
              No se encontraron logros
            </h3>
            <p className="text-detective-text-secondary">
              Intenta ajustar tus filtros de busqueda
            </p>
          </motion.div>
        ) : null}
      </section>

      {/* Progress Tree */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-detective-text mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-detective-orange" />
          Arbol de Progreso
        </h2>
        <ProgressTreeVisualizer />
      </section>

      {/* Achievement Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && selectedAchievement && (
          <AchievementUnlockModal
            achievement={selectedAchievement}
            onClose={handleCloseModal}
            showConfetti={selectedAchievement.rarity === 'legendary' || selectedAchievement.rarity === 'epic'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
