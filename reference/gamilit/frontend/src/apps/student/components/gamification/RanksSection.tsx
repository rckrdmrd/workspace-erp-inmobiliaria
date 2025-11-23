/**
 * RanksSection Component
 *
 * Displays current rank showcase, rank progression ladder with all 5 ranks,
 * requirements for next rank, and rank history
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Zap,
  Check,
  Lock,
  TrendingUp,
  Star,
  Target,
  Clock,
  Trophy,
} from 'lucide-react';
import type { RankData } from '../../hooks/useDashboardData';

interface RanksSectionProps {
  data: RankData;
}

interface RankInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  level: number;
  xpRequired: number;
  multiplier: number;
  description: string;
}

const ALL_RANKS: RankInfo[] = [
  {
    id: 'Nacom',
    name: 'Detective Novato',
    icon: '🔍',
    color: 'from-gray-600 to-gray-800',
    level: 1,
    xpRequired: 0,
    multiplier: 1.0,
    description: 'Inicio de tu viaje como detective científico',
  },
  {
    id: 'Ajaw',
    name: 'Sargento',
    icon: '🏹',
    color: 'from-blue-600 to-blue-800',
    level: 2,
    xpRequired: 500,
    multiplier: 1.5,
    description: 'Ya dominas los conceptos básicos de investigación',
  },
  {
    id: "Ah K'in",
    name: 'Teniente',
    icon: '🗡️',
    color: 'from-purple-600 to-purple-800',
    level: 3,
    xpRequired: 1500,
    multiplier: 2.0,
    description: 'Tu habilidad analítica es notable',
  },
  {
    id: 'Halach Uinic',
    name: 'Capitán',
    icon: '⚔️',
    color: 'from-orange-600 to-red-700',
    level: 4,
    xpRequired: 3500,
    multiplier: 2.5,
    description: 'Eres un investigador experimentado y respetado',
  },
  {
    id: "K'uk'ulkan",
    name: 'Comisario',
    icon: '👑',
    color: 'from-yellow-500 to-orange-600',
    level: 5,
    xpRequired: 7500,
    multiplier: 3.0,
    description: 'El más alto honor: maestro de la investigación',
  },
];

export function RanksSection({ data }: RanksSectionProps) {
  const currentRankIndex = ALL_RANKS.findIndex(r => r.id === data.currentRank);
  const currentRankInfo = ALL_RANKS[currentRankIndex];
  const nextRankInfo = ALL_RANKS[currentRankIndex + 1];

  // Requirements for next rank (mock data - would come from API)
  const requirements = [
    { id: 1, label: 'Alcanzar 1000 XP', progress: data.currentXP, required: data.nextRankXP, completed: false },
    { id: 2, label: 'Completar 5 módulos', progress: 3, required: 5, completed: false },
    { id: 3, label: 'Obtener 10 logros', progress: 8, required: 10, completed: false },
    { id: 4, label: 'Mantener racha de 7 días', progress: 7, required: 7, completed: true },
  ];

  // Mock rank history
  const rankHistory = [
    { rank: 'Nacom', date: '2024-09-15', xp: 0 },
    { rank: 'Ajaw', date: '2024-10-01', xp: 500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-detective-text flex items-center gap-2">
          <Trophy className="w-7 h-7 text-detective-orange" />
          Rangos y Progresión
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Rank Showcase */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <h3 className="font-semibold text-detective-text mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-detective-orange" />
            Tu Rango Actual
          </h3>

          <div className="flex flex-col items-center text-center">
            {/* Rank Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                delay: 0.3,
              }}
              className="relative mb-4"
            >
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentRankInfo.color} flex items-center justify-center text-5xl shadow-xl border-4 border-white`}
              >
                {currentRankInfo.icon}
              </div>

              {/* Floating glow */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentRankInfo.color} opacity-30 blur-xl`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              />
            </motion.div>

            {/* Rank Info */}
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-detective-text mb-2"
            >
              {currentRankInfo.name}
            </motion.h4>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-detective-text-secondary mb-4"
            >
              {currentRankInfo.description}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full grid grid-cols-3 gap-3"
            >
              <div className="bg-detective-bg rounded-lg p-3">
                <div className="text-xs text-detective-text-secondary mb-1">Nivel</div>
                <div className="text-xl font-bold text-detective-text">
                  {currentRankInfo.level}
                </div>
              </div>

              <div className="bg-detective-bg rounded-lg p-3">
                <div className="text-xs text-detective-text-secondary mb-1">XP</div>
                <div className="text-xl font-bold text-detective-text">
                  {data.currentXP}
                </div>
              </div>

              <div className="bg-detective-bg rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 text-xs text-detective-text-secondary mb-1">
                  <Zap className="w-3 h-3" />
                  <span>Multi.</span>
                </div>
                <div className="text-xl font-bold text-detective-orange">
                  {data.multiplier}x
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Requirements for Next Rank */}
        {nextRankInfo && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
          >
            <h3 className="font-semibold text-detective-text mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-detective-orange" />
              Requisitos para {nextRankInfo.name}
            </h3>

            {/* Next Rank Preview */}
            <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${nextRankInfo.color} flex items-center justify-center text-2xl shadow-md`}
                >
                  {nextRankInfo.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-detective-text">
                    {nextRankInfo.name}
                  </div>
                  <div className="text-xs text-detective-text-secondary">
                    Nivel {nextRankInfo.level} • Multiplicador {nextRankInfo.multiplier}x
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-3">
              {requirements.map((req, index) => {
                const progress = Math.min((req.progress / req.required) * 100, 100);
                const isCompleted = req.completed || req.progress >= req.required;

                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isCompleted
                              ? 'text-green-700'
                              : 'text-detective-text'
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-detective-text-secondary">
                        {req.progress}/{req.required}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {!isCompleted && (
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-detective-orange to-detective-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Completa todos los requisitos para ascender
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Tu multiplicador aumentará a {nextRankInfo.multiplier}x
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rank Progression Ladder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h3 className="font-semibold text-detective-text mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-detective-orange" />
          Escalera de Rangos
        </h3>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 via-detective-orange to-detective-gold" />

          <div className="space-y-4">
            {ALL_RANKS.map((rank, index) => {
              const isCurrentRank = rank.id === data.currentRank;
              const isPastRank = index < currentRankIndex;
              const isFutureRank = index > currentRankIndex;

              return (
                <motion.div
                  key={rank.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    isCurrentRank
                      ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-detective-orange shadow-lg'
                      : isPastRank
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  {/* Rank Icon */}
                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${rank.color} flex items-center justify-center text-3xl shadow-lg border-4 ${
                        isCurrentRank
                          ? 'border-white scale-110'
                          : 'border-white/50'
                      }`}
                      animate={
                        isCurrentRank
                          ? {
                              scale: [1.1, 1.15, 1.1],
                            }
                          : {}
                      }
                      transition={
                        isCurrentRank
                          ? {
                              repeat: Infinity,
                              duration: 2,
                            }
                          : {}
                      }
                    >
                      {rank.icon}
                    </motion.div>

                    {/* Status Badge */}
                    {isPastRank && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {isFutureRank && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {isCurrentRank && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-detective-orange rounded-full flex items-center justify-center border-2 border-white"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                        }}
                      >
                        <Star className="w-4 h-4 text-white" fill="white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Rank Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-detective-text">
                        {rank.name}
                      </h4>
                      {isCurrentRank && (
                        <span className="px-2 py-0.5 bg-detective-orange text-white text-xs font-semibold rounded-full">
                          ACTUAL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-detective-text-secondary mb-2">
                      {rank.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-detective-text-secondary">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>Nivel {rank.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>{rank.xpRequired} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{rank.multiplier}x</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Rank History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h3 className="font-semibold text-detective-text mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-detective-orange" />
          Historial de Rangos
        </h3>

        <div className="space-y-3">
          {rankHistory.map((entry, index) => {
            const rankInfo = ALL_RANKS.find(r => r.id === entry.rank);
            if (!rankInfo) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-detective-bg rounded-lg"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${rankInfo.color} flex items-center justify-center text-2xl shadow-md`}
                >
                  {rankInfo.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-detective-text">
                    {rankInfo.name}
                  </div>
                  <div className="text-xs text-detective-text-secondary">
                    {entry.xp} XP alcanzados
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-detective-text-secondary">
                    {new Date(entry.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
