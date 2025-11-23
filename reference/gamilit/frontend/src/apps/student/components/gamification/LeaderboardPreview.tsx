/**
 * LeaderboardPreview Component
 *
 * Preview of user's leaderboard position with top 3 and quick filters
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ArrowRight,
  Users,
  Globe,
  School,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LeaderboardPosition } from '../../hooks/useGamificationData';

interface LeaderboardPreviewProps {
  position: LeaderboardPosition | null;
}

type LeaderboardFilter = 'global' | 'school' | 'grade' | 'friends';

// Mock top 3 data
const mockTop3 = [
  {
    rank: 1,
    username: 'Albert Einstein',
    avatar: 'https://ui-avatars.com/api/?name=Albert+Einstein&background=fbbf24&color=fff',
    score: 5420,
    rankBadge: "K'uk'ulkan",
  },
  {
    rank: 2,
    username: 'Isaac Newton',
    avatar: 'https://ui-avatars.com/api/?name=Isaac+Newton&background=c0c0c0&color=000',
    score: 5180,
    rankBadge: 'Halach Uinic',
  },
  {
    rank: 3,
    username: 'Nikola Tesla',
    avatar: 'https://ui-avatars.com/api/?name=Nikola+Tesla&background=cd7f32&color=fff',
    score: 4950,
    rankBadge: 'Halach Uinic',
  },
];

export function LeaderboardPreview({ position }: LeaderboardPreviewProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<LeaderboardFilter>('global');

  const filters: { id: LeaderboardFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'global', label: 'Global', icon: <Globe className="w-4 h-4" /> },
    { id: 'school', label: 'Escuela', icon: <School className="w-4 h-4" /> },
    { id: 'grade', label: 'Grado', icon: <Users className="w-4 h-4" /> },
    { id: 'friends', label: 'Amigos', icon: <UserPlus className="w-4 h-4" /> },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-500 to-cyan-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return Trophy;
    if (rank === 2) return Medal;
    if (rank === 3) return Award;
    return Users;
  };

  if (!position) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-detective-text-secondary mx-auto mb-4" />
        <p className="text-detective-text-secondary">No hay datos de clasificación disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-detective-text flex items-center gap-2">
          <Trophy className="w-7 h-7 text-blue-600" />
          Dónde Te Encuentras
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-detective-text-secondary border border-gray-200 hover:border-blue-600'
              }`}
            >
              {f.icon}
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* User Position Highlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-xl p-6 shadow-lg border-2 border-blue-200"
      >
        <div className="flex items-center gap-6">
          {/* Position Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl border-4 border-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">#{position.position}</div>
                <div className="text-xs text-white/80">Posición</div>
              </div>
            </div>

            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-500 opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
          </motion.div>

          {/* Stats */}
          <div className="flex-1">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-detective-text mb-2"
            >
              {position.entry.username}
            </motion.h3>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-detective-text-secondary mb-1">Puntos</div>
                <div className="text-xl font-bold text-detective-text">
                  {position.entry.score.toLocaleString()}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-detective-text-secondary mb-1">Top</div>
                <div className="text-xl font-bold text-blue-600">
                  {position.percentile.toFixed(1)}%
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-xs text-detective-text-secondary mb-1">Cambio</div>
                <div className="flex items-center gap-1">
                  {position.entry.changeType === 'up' && (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  )}
                  {position.entry.changeType === 'down' && (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  {position.entry.changeType === 'same' && (
                    <Minus className="w-5 h-5 text-gray-400" />
                  )}
                  <span
                    className={`text-xl font-bold ${
                      position.entry.changeType === 'up'
                        ? 'text-green-600'
                        : position.entry.changeType === 'down'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {Math.abs(position.entry.change) > 0 ? Math.abs(position.entry.change) : '-'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h3 className="font-semibold text-detective-text mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-detective-gold" />
          Top 3 Líderes
        </h3>

        {/* Podium Display */}
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center"
          >
            <img
              src={mockTop3[1].avatar}
              alt={mockTop3[1].username}
              className="w-16 h-16 rounded-full border-4 border-gray-300 mb-2"
            />
            <div className="w-20 h-24 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex flex-col items-center justify-center text-white shadow-lg">
              <Medal className="w-8 h-8 mb-1" />
              <span className="text-2xl font-bold">2</span>
            </div>
            <p className="text-xs font-semibold text-detective-text mt-2 text-center">
              {mockTop3[1].username.split(' ')[0]}
            </p>
            <p className="text-xs text-detective-text-secondary">
              {mockTop3[1].score.toLocaleString()}
            </p>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            >
              <img
                src={mockTop3[0].avatar}
                alt={mockTop3[0].username}
                className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-2"
              />
            </motion.div>
            <div className="w-24 h-32 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex flex-col items-center justify-center text-white shadow-xl">
              <Trophy className="w-10 h-10 mb-1" />
              <span className="text-3xl font-bold">1</span>
            </div>
            <p className="text-sm font-bold text-detective-text mt-2 text-center">
              {mockTop3[0].username.split(' ')[0]}
            </p>
            <p className="text-xs text-detective-text-secondary">
              {mockTop3[0].score.toLocaleString()}
            </p>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col items-center"
          >
            <img
              src={mockTop3[2].avatar}
              alt={mockTop3[2].username}
              className="w-16 h-16 rounded-full border-4 border-orange-400 mb-2"
            />
            <div className="w-20 h-20 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex flex-col items-center justify-center text-white shadow-lg">
              <Award className="w-8 h-8 mb-1" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs font-semibold text-detective-text mt-2 text-center">
              {mockTop3[2].username.split(' ')[0]}
            </p>
            <p className="text-xs text-detective-text-secondary">
              {mockTop3[2].score.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* View Full Leaderboard Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/leaderboard')}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Trophy className="w-5 h-5" />
          Ver Clasificación Completa
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
