/**
 * MissionCard Component
 *
 * Individual mission card with:
 * - Category icon
 * - Title and description
 * - Progress bar with animation
 * - Countdown timer
 * - Reward badges (XP + ML Coins)
 * - Status badge
 * - Action button
 * - Status-based styling
 * - Confetti on claim
 *
 * ~320 lines
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import {
  BookOpen,
  Zap,
  Clock,
  Users,
  Trophy,
  Flame,
  Target,
  Coins,
  Check,
  Play,
  Eye,
  Gift,
  Star,
} from 'lucide-react';
import type { Mission, MissionCategory } from '../types/missionsTypes';
import { cn } from '@shared/utils/cn';
import { getColorSchemeById } from '@shared/utils/colorPalette';

interface MissionCardProps {
  mission: Mission;
  onStart?: (missionId: string) => void;
  onClaim?: (missionId: string) => void;
  onTrack?: (missionId: string) => void;
  isTracked?: boolean;
}

export function MissionCard({
  mission,
  onStart,
  onClaim,
  onTrack,
  isTracked = false,
}: MissionCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Get unique color scheme based on mission ID (consistent across renders)
  const colorScheme = useMemo(() => {
    if (!mission.id) {
      return {
        iconGradient: 'from-blue-500 to-cyan-500',
        progressGradient: 'from-blue-500 to-cyan-500',
        border: 'border-blue-400',
        shadow: 'shadow-blue-200',
        background: 'bg-blue-50',
        badge: 'bg-blue-500 text-white',
      };
    }
    return getColorSchemeById(mission.id);
  }, [mission.id]);

  // Countdown timer
  useEffect(() => {
    if (!mission.expiresAt) {
      setTimeRemaining('Sin límite');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(mission.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeRemaining('Expirado');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeRemaining(`${days}d ${hours % 24}h`);
      } else {
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [mission.expiresAt]);

  // Handle claim with confetti
  const handleClaim = () => {
    setShowConfetti(true);
    onClaim?.(mission.id);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  // Get category icon
  const CategoryIcon = getCategoryIcon(mission.category);

  // Status-based styling with random colors
  const statusStyles = useMemo(() => {
    const styles = getStatusStyles(mission.status, colorScheme);
    // Ensure we always have valid styles as a fallback
    if (!styles) {
      return {
        border: 'border-gray-300',
        shadow: '',
        background: 'bg-white',
        badge: 'bg-gray-200 text-gray-700',
      };
    }
    return styles;
  }, [mission.status, colorScheme]);

  // Difficulty badge color
  const difficultyColor = getDifficultyColor(mission.difficulty);

  // Timer color (red if < 1 hour)
  const isUrgent = mission.expiresAt ? new Date(mission.expiresAt).getTime() - new Date().getTime() < 3600000 : false;

  return (
    <>
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={300}
              recycle={false}
              colors={['#F59E0B', '#FB923C', '#FBBF24', '#FCD34D']}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -5 }}
        className={cn(
          'relative bg-white rounded-xl shadow-md overflow-hidden',
          'border-2 transition-all duration-300',
          statusStyles.border,
          statusStyles.shadow,
          mission.status === 'claimed' && 'opacity-70'
        )}
      >
        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold',
              statusStyles.badge
            )}
          >
            {getStatusLabel(mission.status)}
          </motion.div>
        </div>

        {/* Difficulty Badge (Top Left) */}
        {mission.difficulty && (
          <div className="absolute top-3 left-3 z-10">
            <div className={cn('px-2 py-1 rounded-md text-xs font-semibold', difficultyColor)}>
              {mission.difficulty.toUpperCase()}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className={cn('p-6', statusStyles.background)}>
          {/* Icon */}
          <div className="flex items-start gap-4 mb-4 mt-6">
            <div
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl',
                'flex items-center justify-center',
                'bg-gradient-to-br',
                colorScheme?.iconGradient || 'from-blue-500 to-cyan-500',
                'shadow-md'
              )}
            >
              <CategoryIcon className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                {mission.title || 'Sin título'}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {mission.description || 'Sin descripción'}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-gray-700">Progreso</span>
              <span className="font-bold text-gray-800">
                {mission.currentValue ?? 0} / {mission.targetValue ?? 0}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mission.progress ?? 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn(
                  'h-full bg-gradient-to-r',
                  colorScheme?.progressGradient || 'from-blue-500 to-cyan-500',
                  'rounded-full'
                )}
              />
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {mission.progress ?? 0}% completado
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">
                {mission.mlCoinsReward ?? 0}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">
                {mission.xpReward ?? 0} XP
              </span>
            </div>

            {mission.bonusMultiplier && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                <Star className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-bold text-purple-700">
                  {mission.bonusMultiplier}x
                </span>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className={cn('w-4 h-4', isUrgent ? 'text-red-500' : 'text-gray-500')} />
              <span className={cn('font-semibold', isUrgent ? 'text-red-600' : 'text-gray-600')}>
                Renueva en: {timeRemaining}
              </span>
            </div>

            {/* Track Button */}
            {mission.status === 'in_progress' && onTrack && (
              <button
                onClick={() => onTrack(mission.id)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isTracked
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                )}
                title={isTracked ? 'Rastreando' : 'Rastrear misión'}
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Button */}
          <div>
            {mission.status === 'not_started' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStart?.(mission.id)}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold',
                  'bg-gray-600 hover:bg-gray-700 text-white',
                  'flex items-center justify-center gap-2',
                  'transition-colors shadow-md'
                )}
              >
                <Play className="w-5 h-5" />
                Iniciar Misión
              </motion.button>
            )}

            {mission.status === 'in_progress' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold',
                  'bg-blue-600 text-white',
                  'flex items-center justify-center gap-2',
                  'shadow-md cursor-default'
                )}
              >
                <Target className="w-5 h-5" />
                En Progreso
              </motion.button>
            )}

            {mission.status === 'completed' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold',
                  'bg-gradient-to-r from-green-500 to-emerald-500',
                  'hover:from-green-600 hover:to-emerald-600',
                  'text-white',
                  'flex items-center justify-center gap-2',
                  'shadow-lg'
                )}
              >
                <Gift className="w-5 h-5" />
                Reclamar Recompensa
              </motion.button>
            )}

            {mission.status === 'claimed' && (
              <div
                className={cn(
                  'w-full py-3 rounded-lg font-semibold',
                  'bg-gradient-to-r from-yellow-400 to-amber-400',
                  'text-white',
                  'flex items-center justify-center gap-2',
                  'shadow-md'
                )}
              >
                <Check className="w-5 h-5" />
                Completado
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

/**
 * Helpers
 */

function getCategoryIcon(category: MissionCategory) {
  const icons: Record<string, React.ElementType> = {
    exercises: BookOpen,
    xp: Zap,
    time: Clock,
    social: Users,
    achievement: Trophy,
    streak: Flame,
  };
  return icons[category] || BookOpen;
}

function getCategoryGradient(category: MissionCategory): string {
  const gradients: Record<MissionCategory, string> = {
    exercises: 'from-blue-500 to-cyan-500',
    xp: 'from-yellow-500 to-orange-500',
    time: 'from-purple-500 to-pink-500',
    social: 'from-green-500 to-emerald-500',
    achievement: 'from-amber-500 to-orange-500',
    streak: 'from-red-500 to-orange-500',
  };
  return gradients[category];
}

function getStatusStyles(status: Mission['status'], colorScheme: any) {
  // Provide default values if colorScheme is undefined or missing properties
  const defaultScheme = {
    border: 'border-blue-400',
    shadow: 'shadow-blue-200',
    background: 'bg-blue-50',
    badge: 'bg-blue-500 text-white',
  };

  const scheme = colorScheme || defaultScheme;

  const styles: Record<string, any> = {
    not_started: {
      border: 'border-gray-300',
      shadow: '',
      background: 'bg-white',
      badge: 'bg-gray-200 text-gray-700',
    },
    in_progress: {
      border: scheme.border || defaultScheme.border,
      shadow: scheme.shadow || defaultScheme.shadow,
      background: scheme.background || defaultScheme.background,
      badge: scheme.badge || defaultScheme.badge,
    },
    completed: {
      border: scheme.border || defaultScheme.border,
      shadow: scheme.shadow || defaultScheme.shadow,
      background: scheme.background || defaultScheme.background,
      badge: scheme.badge || defaultScheme.badge,
    },
    claimed: {
      border: 'border-yellow-400',
      shadow: '',
      background: 'bg-yellow-50',
      badge: 'bg-yellow-400 text-white',
    },
  };

  // Return the style for the given status, or default to 'not_started' style if status not found
  return styles[status] || styles.not_started;
}

function getStatusLabel(status: Mission['status']): string {
  const labels: Record<string, string> = {
    not_started: 'Nueva',
    in_progress: 'En Progreso',
    completed: 'Completada',
    claimed: 'Reclamada ✓',
  };
  return labels[status] || 'Nueva';
}

function getDifficultyColor(difficulty: Mission['difficulty']): string {
  const colors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 border border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    hard: 'bg-red-100 text-red-700 border border-red-300',
  };
  return colors[difficulty] || colors.medium;
}
