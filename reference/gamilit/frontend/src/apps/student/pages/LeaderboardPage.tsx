/**
 * LeaderboardPage - Complete Leaderboard Page for GLIT Platform
 *
 * Features:
 * - Multiple leaderboard types (Global, School, Grade, Friends)
 * - Time period selection (Daily, Weekly, Monthly, All-Time)
 * - Top 3 podium display
 * - Current user position highlight
 * - Real-time updates via WebSocket
 * - Responsive design with side panels
 * - Smooth animations
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  Target,
  Users,
  Award,
  Zap,
  RefreshCw,
  ArrowUp,
  Sparkles,
  BarChart3,
} from 'lucide-react';

// Leaderboard Components
import { LeaderboardTabs } from '@/features/gamification/social/components/Leaderboards/LeaderboardTabs';
import { SeasonSelector } from '@/features/gamification/social/components/Leaderboards/SeasonSelector';
import { LeaderboardLayout } from '@/features/gamification/social/components/Leaderboards/LeaderboardLayout';

// Hooks & Types
import { useLeaderboards } from '@/features/gamification/social/hooks/useLeaderboards';
import type { LeaderboardType, TimePeriod } from '@/features/gamification/social/types/leaderboardsTypes';

// Utils
import { cn } from '@shared/utils/cn';

export default function LeaderboardPage() {
  // Store & Hooks
  const {
    currentLeaderboard,
    selectedType,
    selectedPeriod,
    setLeaderboardType,
    setTimePeriod,
    refreshLeaderboard,
    getUserEntry,
    getUserPosition,
  } = useLeaderboards();

  // Local State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const userEntryRef = useRef<HTMLDivElement>(null);

  // WebSocket Integration for real-time updates
  useEffect(() => {
    // TODO: Implement WebSocket connection
    // const socket = io('http://localhost:3006', {
    //   auth: { token: getToken() }
    // });

    // socket.on('leaderboard:update', (data) => {
    //   leaderboardsStore.updatePosition(data);
    // });

    // return () => socket.disconnect();
  }, []);

  // Auto-scroll to current user on load
  useEffect(() => {
    if (autoScrollEnabled && userEntryRef.current) {
      setTimeout(() => {
        userEntryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [currentLeaderboard, autoScrollEnabled]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshLeaderboard();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const userEntry = getUserEntry();
  const userPosition = getUserPosition();

  // Calculate points to next position
  const pointsToNext = userEntry && userEntry.rank > 1
    ? currentLeaderboard.entries[userEntry.rank - 2]?.score - userEntry.score
    : 0;

  // Category breakdown stats (mock data - replace with real API)
  const categoryStats = [
    { category: 'Ejercicios', value: 45, color: 'bg-blue-500' },
    { category: 'Logros', value: 30, color: 'bg-purple-500' },
    { category: 'Bonos', value: 15, color: 'bg-green-500' },
    { category: 'Social', value: 10, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con Filtros - Sticky */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20"
      >
        <div className="container mx-auto px-4 py-4">
          {/* Title and Refresh */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-detective-text">
                  Tabla de Clasificacion
                </h1>
                <p className="text-sm text-detective-text-secondary">
                  Ultima actualizacion: {new Date(currentLeaderboard.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
              <span className="hidden md:inline">Actualizar</span>
            </motion.button>
          </div>

          {/* Leaderboard Type Tabs */}
          <div className="mb-4">
            <LeaderboardTabs
              selectedType={selectedType}
              onTypeChange={setLeaderboardType}
            />
          </div>

          {/* Time Period Selector */}
          <SeasonSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setTimePeriod}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Leaderboard - 3 columns on desktop */}
          <main className="lg:col-span-3 space-y-6">
            {/* Current User Position Card */}
            {userEntry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={userEntry.avatar}
                        alt={userEntry.username}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userEntry.username)}&background=8b5cf6&color=fff`;
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">#{userEntry.rank}</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold mb-1">Tu Posicion</h2>
                      <p className="text-lg opacity-90">{userEntry.username}</p>
                      <p className="text-sm opacity-80">{userEntry.rankBadge}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-4xl font-bold mb-1">{userEntry.score.toLocaleString()}</div>
                    <div className="text-sm opacity-90">puntos totales</div>
                    {pointsToNext > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm"
                      >
                        <div className="flex items-center gap-1">
                          <ArrowUp className="w-4 h-4" />
                          <span>{pointsToNext} pts al siguiente</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Progress bar to next position */}
                {pointsToNext > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((userEntry.score / (userEntry.score + pointsToNext)) * 100), 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-white h-3 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Leaderboard Stats */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-detective-text-secondary">Participantes</span>
                </div>
                <div className="text-2xl font-bold text-detective-text">
                  {currentLeaderboard.totalParticipants.toLocaleString()}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-detective-text-secondary">Tu Percentil</span>
                </div>
                <div className="text-2xl font-bold text-detective-text">
                  {userPosition ? Math.round((1 - (userPosition / currentLeaderboard.totalParticipants)) * 100) : 0}%
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-detective-text-secondary">Cambio</span>
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  userEntry?.changeType === 'up' ? 'text-green-500' :
                  userEntry?.changeType === 'down' ? 'text-red-500' :
                  'text-gray-500'
                )}>
                  {userEntry?.changeType === 'up' && '+'}
                  {userEntry?.changeType === 'down' && '-'}
                  {userEntry?.change || 0}
                </div>
              </motion.div>
            </div>

            {/* Leaderboard Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-detective-text flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-detective-gold" />
                  Clasificacion {selectedType === 'global' ? 'Global' : selectedType === 'school' ? 'Escuela' : selectedType === 'grade' ? 'Grado' : 'Amigos'}
                </h2>
                <button
                  onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm font-semibold transition-colors",
                    autoScrollEnabled
                      ? "bg-detective-orange text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  Auto-scroll
                </button>
              </div>

              <LeaderboardLayout
                entries={currentLeaderboard.entries}
                showTopThree={true}
                highlightUser={true}
              />

              {/* User entry ref for scrolling */}
              {userEntry && (
                <div ref={userEntryRef} className="absolute -top-20" />
              )}
            </motion.div>
          </main>

          {/* Side Panel - Desktop only */}
          <aside className="hidden lg:block space-y-6">
            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-detective-text mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-detective-orange" />
                Desglose de Puntos
              </h3>
              <div className="space-y-4">
                {categoryStats.map((stat, index) => (
                  <motion.div
                    key={stat.category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-detective-text font-semibold">{stat.category}</span>
                      <span className="text-detective-text-secondary">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                        className={cn(stat.color, "h-2 rounded-full")}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Friends Mini Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-detective-text mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-detective-orange" />
                Amigos Cercanos
              </h3>
              <div className="space-y-3">
                {currentLeaderboard.entries.slice(0, 5).map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-detective-bg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-detective-orange text-white flex items-center justify-center font-bold text-sm">
                      {entry.rank}
                    </div>
                    <img
                      src={entry.avatar}
                      alt={entry.username}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=f97316&color=fff`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-detective-text text-sm truncate">{entry.username}</p>
                      <p className="text-xs text-detective-text-secondary">{entry.score.toLocaleString()} pts</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-detective-text">
                  Tips para Subir
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-detective-text-secondary">
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Completa ejercicios diariamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Desbloquea logros para bonus</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Mantén rachas activas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Participa en desafios sociales</span>
                </li>
              </ul>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
