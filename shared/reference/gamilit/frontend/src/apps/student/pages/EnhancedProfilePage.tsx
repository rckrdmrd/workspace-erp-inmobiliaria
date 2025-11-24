/**
 * Enhanced Profile Page with Rank History and Stats Charts
 *
 * Features:
 * - Real data integration from stores
 * - Animated rank badge
 * - Rank history timeline
 * - Stats chart with Recharts
 * - Activity heatmap
 * - Achievements showcase
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  Coins,
  TrendingUp,
  Flame,
  Zap,
  Star,
  ChevronRight,
  Activity,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Components
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { RankBadge } from '@shared/components/base/RankBadge';
import { StreakIndicator } from '@/features/gamification/components/StreakIndicator';

// Hooks & Store
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRanksStore } from '@/features/gamification/ranks/store/ranksStore';
import { useEconomyStore } from '@/features/gamification/economy/store/economyStore';
import { useAchievementsStore } from '@/features/gamification/social/store/achievementsStore';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { cn } from '@shared/utils/cn';

interface RankHistoryEntry {
  rank: string;
  achievedAt: Date;
  xpRequired: number;
}

export default function EnhancedProfilePage() {
  const navigate = useNavigate();

  // Global state
  const { user, logout } = useAuthStore();
  const { userProgress, fetchUserProgress } = useRanksStore();
  const { balance, fetchBalance } = useEconomyStore();
  const { achievements, stats: achievementStats, fetchAchievements } = useAchievementsStore();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Local state
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stats' | 'history' | 'achievements'>('overview');

  // Load data
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress();
      fetchBalance();
      fetchAchievements(user.id);
    }
  }, [user?.id, fetchUserProgress, fetchBalance, fetchAchievements]);

  // Mock rank history (in real app, this would come from API)
  const rankHistory: RankHistoryEntry[] = [
    { rank: 'nacom', achievedAt: new Date('2025-01-15'), xpRequired: 0 },
    { rank: 'batab', achievedAt: new Date('2025-01-22'), xpRequired: 500 },
    { rank: 'chilam', achievedAt: new Date('2025-02-05'), xpRequired: 1000 },
  ];

  // Mock activity data for chart (in real app, this would come from API)
  const activityData = [
    { date: '2025-01-15', xp: 50, coins: 25, exercises: 2 },
    { date: '2025-01-16', xp: 75, coins: 40, exercises: 3 },
    { date: '2025-01-17', xp: 100, coins: 50, exercises: 4 },
    { date: '2025-01-18', xp: 60, coins: 30, exercises: 2 },
    { date: '2025-01-19', xp: 120, coins: 60, exercises: 5 },
    { date: '2025-01-20', xp: 90, coins: 45, exercises: 3 },
    { date: '2025-01-21', xp: 150, coins: 75, exercises: 6 },
  ];

  const stats = [
    {
      label: 'ML Coins',
      value: balance.toString(),
      icon: Coins,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'XP Total',
      value: userProgress?.currentXP.toString() || '0',
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Logros',
      value: `${achievementStats.unlockedAchievements}/${achievementStats.totalAchievements}`,
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Racha',
      value: '7 días',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentAchievements = achievements
    .filter(a => a.isUnlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return b.unlockedAt.getTime() - a.unlockedAt.getTime();
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      <GamifiedHeader
        user={user || undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30"
              >
                <User className="w-16 h-16" />
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{user?.fullName || 'Detective'}</h1>
                <p className="text-white/80 mb-4 flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
                  <RankBadge rank={(userProgress?.currentRank as any) || 'nacom'} showIcon={true} />
                  <StreakIndicator variant="compact" />
                </div>
                <p className="text-white/70 text-sm mt-4 flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="w-4 h-4" />
                  Miembro desde: {new Date(user?.createdAt || Date.now()).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 2).map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm opacity-80">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Vista General', icon: Activity },
            { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
            { id: 'history', label: 'Historial de Rangos', icon: TrendingUp },
            { id: 'achievements', label: 'Logros', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap",
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DetectiveCard hoverable className="h-full">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                          <Icon className={cn("w-8 h-8", stat.color)} />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-detective-text">
                            {stat.value}
                          </p>
                          <p className="text-sm text-detective-text-secondary">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </DetectiveCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {selectedTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Activity Chart */}
              <DetectiveCard>
                <h3 className="text-xl font-bold text-detective-text mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-detective-orange" />
                  Actividad de los últimos 7 días
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="xp"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorXp)"
                      name="XP Ganado"
                    />
                    <Area
                      type="monotone"
                      dataKey="coins"
                      stroke="#EAB308"
                      fillOpacity={1}
                      fill="url(#colorCoins)"
                      name="ML Coins"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </DetectiveCard>

              {/* Exercises Chart */}
              <DetectiveCard>
                <h3 className="text-xl font-bold text-detective-text mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-detective-orange" />
                  Ejercicios Completados
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="exercises" fill="#A855F7" name="Ejercicios" />
                  </BarChart>
                </ResponsiveContainer>
              </DetectiveCard>
            </motion.div>
          )}

          {selectedTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DetectiveCard>
                <h3 className="text-xl font-bold text-detective-text mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-detective-orange" />
                  Historial de Ascensos de Rango
                </h3>

                {/* Rank History Timeline */}
                <div className="space-y-6">
                  {rankHistory.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 relative"
                    >
                      {/* Timeline Line */}
                      {index < rankHistory.length - 1 && (
                        <div className="absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                      )}

                      {/* Rank Badge */}
                      <div className="relative z-10">
                        <RankBadge rank={entry.rank as any} showIcon />
                      </div>

                      {/* Details */}
                      <div className="flex-1 bg-detective-bg p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-detective-text capitalize">{entry.rank}</h4>
                            <p className="text-sm text-detective-text-secondary">
                              Alcanzado el {entry.achievedAt.toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-detective-orange">{entry.xpRequired} XP</p>
                            <p className="text-sm text-detective-text-secondary">Requerido</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Next Rank Progress */}
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <h4 className="font-bold text-detective-text mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-detective-orange" />
                    Próximo Rango
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Progreso hacia {(userProgress?.nextRank as any) || 'Batab'}</span>
                    <span className="text-sm font-semibold">{userProgress?.currentXP || 0} / {(userProgress?.nextRank as any)?.xpRequired || 500} XP</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((userProgress?.currentXP || 0) / ((userProgress?.nextRank as any)?.xpRequired || 500)) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              </DetectiveCard>
            </motion.div>
          )}

          {selectedTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DetectiveCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-detective-text flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-detective-orange" />
                    Logros Recientes
                  </h3>
                  <button
                    onClick={() => navigate('/achievements')}
                    className="flex items-center gap-2 text-detective-orange hover:text-detective-orange-dark font-semibold"
                  >
                    Ver todos
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-detective-bg rounded-lg hover:bg-detective-bg-secondary transition-colors cursor-pointer"
                        onClick={() => navigate('/achievements')}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-detective-text">{achievement.title}</h4>
                          <p className="text-sm text-detective-text-secondary">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-detective-orange flex items-center gap-1">
                            +{achievement.mlCoinsReward} <Coins className="w-4 h-4" />
                          </p>
                          <p className="text-xs text-detective-text-secondary">
                            {achievement.unlockedAt?.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-detective-text-secondary">
                      <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>No has desbloqueado logros aún</p>
                      <p className="text-sm">¡Completa ejercicios para empezar!</p>
                    </div>
                  )}
                </div>
              </DetectiveCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
