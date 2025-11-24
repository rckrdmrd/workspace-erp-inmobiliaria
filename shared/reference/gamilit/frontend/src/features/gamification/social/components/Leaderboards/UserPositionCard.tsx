/**
 * UserPositionCard Component
 *
 * Highlighted card showing user's current position in the leaderboard
 * Features:
 * - Gradient background based on rank
 * - User statistics
 * - Motivational messages
 * - XP to next rank
 * - Share rank button
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Share2,
  ArrowUp,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import type { LeaderboardEntry } from '../../types/leaderboardsTypes';
import { cn } from '@shared/utils/cn';

interface UserPositionCardProps {
  userEntry: LeaderboardEntry;
  pointsToNext: number;
  percentile: number;
  onShare?: () => void;
  className?: string;
}

const getMotivationalMessage = (rank: number, percentile: number): string => {
  if (rank === 1) return '¡Eres el líder! ¡Mantén el ritmo!';
  if (rank <= 3) return '¡En el podio! ¡Sigue así!';
  if (rank <= 10) return '¡En el Top 10! ¡Casi en el podio!';
  if (percentile >= 90) return '¡En el Top 10%! ¡Excelente trabajo!';
  if (percentile >= 75) return '¡En el Top 25%! ¡Sigue escalando!';
  if (percentile >= 50) return '¡Por encima del promedio! ¡Vamos!';
  return '¡Sigue subiendo! ¡Tú puedes!';
};

const getGradientByRank = (rank: number): string => {
  if (rank === 1) return 'from-yellow-400 via-yellow-500 to-orange-500';
  if (rank === 2) return 'from-gray-300 via-gray-400 to-gray-500';
  if (rank === 3) return 'from-orange-300 via-orange-400 to-orange-600';
  if (rank <= 10) return 'from-purple-500 via-pink-500 to-indigo-500';
  if (rank <= 50) return 'from-blue-500 via-cyan-500 to-teal-500';
  return 'from-detective-blue via-detective-orange to-pink-500';
};

const getIconByRank = (rank: number) => {
  if (rank === 1) return Trophy;
  if (rank <= 3) return Award;
  if (rank <= 10) return Sparkles;
  return Target;
};

export const UserPositionCard: React.FC<UserPositionCardProps> = ({
  userEntry,
  pointsToNext,
  percentile,
  onShare,
  className
}) => {
  const motivationalMessage = getMotivationalMessage(userEntry.rank, percentile);
  const gradient = getGradientByRank(userEntry.rank);
  const Icon = getIconByRank(userEntry.rank);
  const progressPercentage = pointsToNext > 0
    ? Math.min(((userEntry.score / (userEntry.score + pointsToNext)) * 100), 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-xl shadow-2xl',
        className
      )}
    >
      {/* Gradient Background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-r',
        gradient
      )} />

      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Content */}
      <div className="relative p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="p-3 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <Icon className="w-8 h-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Tu Posición</h2>
              <p className="text-sm opacity-90">{motivationalMessage}</p>
            </div>
          </div>

          {/* Share Button */}
          {onShare && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Compartir</span>
            </motion.button>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.img
                src={userEntry.avatar}
                alt={userEntry.username}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userEntry.username)}&background=8b5cf6&color=fff`;
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />

              {/* Rank Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <span className={cn(
                  'font-bold text-lg',
                  userEntry.rank <= 3 ? 'text-yellow-500' : 'text-purple-600'
                )}>
                  #{userEntry.rank}
                </span>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-1">{userEntry.username}</h3>
              <p className="text-sm opacity-90">{userEntry.rankBadge}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-75">Top {(100 - percentile).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-right">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
              className="text-5xl font-bold mb-1"
            >
              {userEntry.score.toLocaleString()}
            </motion.div>
            <div className="text-sm opacity-90 mb-2">puntos totales</div>

            {/* Rank Change */}
            {userEntry.change !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  'flex items-center justify-end gap-1 text-sm font-semibold px-3 py-1 rounded-full',
                  userEntry.changeType === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
                )}
              >
                {userEntry.changeType === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {userEntry.changeType === 'up' ? '+' : '-'}{Math.abs(userEntry.change)}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold mb-1">{userEntry.xp.toLocaleString()}</div>
            <div className="text-xs opacity-75">XP Total</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold mb-1">{userEntry.mlCoins.toLocaleString()}</div>
            <div className="text-xs opacity-75">ML Coins</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold mb-1">{percentile.toFixed(0)}%</div>
            <div className="text-xs opacity-75">Percentil</div>
          </motion.div>
        </div>

        {/* Progress to Next Position */}
        {pointsToNext > 0 && userEntry.rank > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                <span>Próxima posición</span>
              </div>
              <span className="font-bold">{pointsToNext.toLocaleString()} XP</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
                className="bg-white h-3 rounded-full relative overflow-hidden"
              >
                {/* Animated Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-100, 300] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
              </motion.div>
            </div>

            <div className="text-xs opacity-75 mt-1 text-right">
              {progressPercentage.toFixed(1)}% completado
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 pt-4 border-t border-white/20"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            <span>¡Sigue escalando en la clasificación!</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      {userEntry.rank <= 3 && (
        <>
          <motion.div
            className="absolute top-4 right-4 text-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Trophy className="w-24 h-24" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
