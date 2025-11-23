import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Award, Crown, Star, Sparkles } from 'lucide-react';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';
import { getColorSchemeByName } from '@shared/utils/colorPalette';
import { cn } from '@shared/utils/cn';
import type { RankData } from '../../hooks/useDashboardData';

interface RankProgressWidgetProps {
  data: RankData | null;
  loading?: boolean;
}

const MAYA_RANKS = {
  Ajaw: { name: 'Ajaw - Señor', icon: '🏹', color: 'from-green-500 to-emerald-500', border: 'border-green-400', shadow: 'shadow-green-200' },
  Nacom: { name: 'Nacom - Capitán', icon: '🔍', color: 'from-blue-500 to-cyan-500', border: 'border-blue-400', shadow: 'shadow-blue-200' },
  'Ah K\'in': { name: 'Ah K\'in - Sacerdote', icon: '🗡️', color: 'from-purple-500 to-pink-500', border: 'border-purple-400', shadow: 'shadow-purple-200' },
  'Halach Uinic': { name: 'Halach Uinic - Hombre Verdadero', icon: '⚔️', color: 'from-orange-500 to-amber-500', border: 'border-orange-400', shadow: 'shadow-orange-200' },
  'K\'uk\'ulkan': { name: 'K\'uk\'ulkan - Serpiente Emplumada', icon: '👑', color: 'from-yellow-400 to-amber-400', border: 'border-yellow-400', shadow: 'shadow-yellow-200' },
};

export function RankProgressWidget({ data, loading }: RankProgressWidgetProps) {
  console.log('🎨 [RankProgressWidget] Props received:', { data, loading });

  const rankInfo = data ? MAYA_RANKS[data.currentRank as keyof typeof MAYA_RANKS] || MAYA_RANKS.Nacom : MAYA_RANKS.Nacom;

  console.log('🎨 [RankProgressWidget] Rank info:', { rankInfo, currentRank: data?.currentRank });

  if (loading || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative bg-white rounded-xl shadow-md overflow-hidden',
          'border-2 h-full p-6',
          rankInfo.border,
          rankInfo.shadow
        )}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-20 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </motion.div>
    );
  }

  // Safe calculations with fallbacks
  const currentXP = data.currentXP ?? 0;
  const nextRankXP = data.nextRankXP ?? currentXP + 1000;
  const progressPercent = nextRankXP > 0 ? (currentXP / nextRankXP) * 100 : 100;
  const xpRemaining = Math.max(0, nextRankXP - currentXP);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative bg-white rounded-xl shadow-lg overflow-hidden',
        'border-2 h-full max-h-[600px]',
        rankInfo.border,
        rankInfo.shadow
      )}
    >
      {/* Gradient background overlay */}
      <div
        className={cn(
          'absolute inset-0 opacity-10',
          'bg-gradient-to-br',
          rankInfo.color
        )}
      />

      {/* Content */}
      <div className="relative z-10 p-6 overflow-y-auto h-full">
        {/* Header with colorful icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br shadow-md',
                rankInfo.color
              )}
            >
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tu Rango</h3>
              <p className="text-xs text-gray-600">Nivel detectivesco</p>
            </div>
          </div>
          <motion.div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm',
              'bg-gradient-to-r',
              rankInfo.color
            )}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-black text-white">
              {data.multiplier}x
            </span>
          </motion.div>
        </div>

      {/* Rank badge */}
      <div className="relative mb-6">
        <motion.div
          className={`relative p-6 rounded-xl bg-gradient-to-br ${rankInfo.color} overflow-hidden`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            }}
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)',
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="text-5xl"
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
              >
                {rankInfo.icon}
              </motion.div>
              <div>
                <p className="text-sm text-white/80 font-medium">Rango Actual</p>
                <h4 className="text-2xl font-bold text-white">{rankInfo.name}</h4>
                <p className="text-xs text-white/70 mt-1">
                  Código Maya: {data.currentRank}
                </p>
              </div>
            </div>

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <Award className="w-8 h-8 text-white/80" />
            </motion.div>
          </div>
        </motion.div>
      </div>

        {/* Progress section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Progreso al siguiente rango
            </span>
            <span className={cn('text-lg font-black bg-gradient-to-r bg-clip-text text-transparent', rankInfo.color)}>
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", rankInfo.color)}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'linear',
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* XP stats with colorful cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn('p-4 bg-gradient-to-br rounded-xl border-2', rankInfo.border, 'from-white to-gray-50')}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('p-1.5 rounded-lg bg-gradient-to-br', rankInfo.color)}>
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-700">XP Actual</span>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {currentXP.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn('p-4 bg-gradient-to-br rounded-xl border-2', rankInfo.border, 'from-white to-gray-50')}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('p-1.5 rounded-lg bg-gradient-to-br', rankInfo.color)}>
                <Star className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-700">Falta</span>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {xpRemaining.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Multiplier info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'p-4 rounded-xl border-2 bg-gradient-to-br from-amber-50 to-orange-50',
            'border-amber-200'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                Multiplicador {data.multiplier}x activo
              </p>
              <p className="text-xs text-gray-600">
                Ganas {data.multiplier}x ML Coins por ejercicio
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
