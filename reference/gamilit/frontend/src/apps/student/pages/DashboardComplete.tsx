import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { EnhancedStatsGrid } from '../components/dashboard/EnhancedStatsGrid';
import { MissionsPanel } from '../components/dashboard/MissionsPanel';
import { ModulesSection } from '../components/dashboard/ModulesSection';
import { RecentActivityPanel } from '../components/dashboard/RecentActivityPanel';
import { RankProgressWidget } from '../components/dashboard/RankProgressWidget';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import { useMissions } from '@/features/gamification/missions/hooks/useMissions';
import { useUserModules } from '../hooks/useUserModules';
import { useRecentActivities } from '../hooks/useRecentActivities';
import { useUserGamification } from '@shared/hooks/useUserGamification';

export default function DashboardComplete() {
  console.log('🚀 [DashboardComplete] Component rendering...');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log('👤 [DashboardComplete] User from useAuth:', {
    isAuthenticated: !!user,
    userId: user?.id,
    userEmail: user?.email,
  });

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Real data from backend
  const {
    rank,
    achievements,
    progress,
    recentAchievements,
    loading,
    error,
    isRefreshing,
    refresh
  } = useDashboardData();

  // Missions data from backend
  const {
    allMissions,
    activeMissions,
    loading: missionsLoading,
    error: missionsError,
  } = useMissions();

  // Modules data from backend
  const {
    modules: userModules,
    loading: modulesLoading,
    error: modulesError,
  } = useUserModules();

  // Activities data from backend
  const {
    activities: userActivities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useRecentActivities(5); // Get 5 most recent activities

  // Transform data for components
  const statsData = progress ? {
    casesResolved: progress.completedExercises,
    currentStreak: progress.currentStreak,
    totalTime: Math.floor(progress.totalTimeSpent / 60), // Convert seconds to minutes
    totalXP: rank?.currentXP || 0,
    rankPosition: rank?.progress || 0,
  } : null;

  const rankData = rank ? {
    currentRank: rank.currentRank,
    currentXP: rank.currentXP,
    nextRankXP: rank.nextRankXP,
    multiplier: rank.multiplier,
    rankIcon: rank.rankIcon,
    progress: rank.progress,
    nextRank: 'Next Rank', // TODO: Get from backend
    xpCurrent: rank.currentXP,
    xpRequired: rank.nextRankXP,
  } : null;

  console.log('📊 [DashboardComplete] Rank data prepared for widget:', {
    originalRank: rank,
    rankData,
    loading,
  });

  // Missions data from missions API - transform to match MissionsPanel interface
  const transformedMissions = (activeMissions.length > 0 ? activeMissions : allMissions.slice(0, 3)).map(mission => ({
    ...mission,
    currentProgress: mission.currentValue,
    targetProgress: mission.targetValue,
    isCompleted: mission.status === 'completed' || mission.status === 'claimed',
    isExpired: mission.expiresAt ? new Date(mission.expiresAt) < new Date() : false,
    priority: mission.difficulty === 'easy' ? 'low' as const :
              mission.difficulty === 'medium' ? 'medium' as const :
              'high' as const,
    timeLimit: mission.expiresAt,
    mlReward: mission.mlCoinsReward
  }));
  const missionsData = transformedMissions;

  // Modules data from modules API - transform to match ModulesSection interface
  const modulesData = (userModules || []).map(module => ({
    ...module,
    difficulty: module.difficulty === 'easy' ? 'facil' as const :
                module.difficulty === 'medium' ? 'medio' as const :
                module.difficulty === 'hard' ? 'dificil' as const : 'medio' as const,
    status: module.status === 'in_progress' ? 'in_progress' as const :
            module.status === 'available' ? 'available' as const :
            module.status === 'locked' ? 'locked' as const : 'available' as const
  }));

  // Activities data from activities API
  const activitiesData = userActivities || [];

  const handleLogout = async () => {
    await logout();
    // No need to navigate - performLogout() handles redirect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <GamifiedHeader
        user={user || undefined}
        gamificationData={gamificationData}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, Detective! 🕵️
          </h1>
          <p className="text-gray-600">
            Explora la plataforma educativa de investigación y desarrolla tus habilidades detectivescas.
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-300 text-red-800 rounded-lg p-4 mb-6"
          >
            <p className="font-semibold">{error}</p>
            <button
              onClick={refresh}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Reintentar
            </button>
          </motion.div>
        )}

        {/* Dashboard Grid Layout - 12 columnas */}
        <div className="space-y-6">
          {/* Primera Fila: Rango (4 col) + Módulos (8 col con 4 módulos de 2 col c/u) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rank Progress Widget - 4 columnas */}
            <div className="lg:col-span-4">
              <RankProgressWidget data={rankData} loading={loading} />
            </div>

            {/* Modules Section - 8 columnas (cada módulo ocupa 2 col = 4 módulos) */}
            <div className="lg:col-span-8">
              <ModulesSection
                modules={modulesData}
                loading={modulesLoading}
                error={modulesError}
                onModuleClick={(id) => navigate(`/modules/${id}`)}
              />
            </div>
          </div>

          {/* Segunda Fila: Estadísticas + Misiones (4 col) + Actividad (restante) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Detective Stats - lado izquierdo */}
            <div className="lg:col-span-4">
              <EnhancedStatsGrid
                stats={statsData || { casesResolved: 0, currentStreak: 0, totalTime: 0, totalXP: 0, rankPosition: 0 }}
                loading={loading}
                error={error ? new Error(error) : null}
                compact={false}
              />
            </div>

            {/* Active Missions Panel - 4 columnas */}
            <div className="lg:col-span-4">
              <MissionsPanel
                missions={missionsData}
                loading={missionsLoading}
                error={missionsError ? new Error(missionsError) : null}
                onMissionClick={() => navigate(`/missions`)}
              />
            </div>

            {/* Recent Activity - restante (4 columnas) */}
            <div className="lg:col-span-4">
              <RecentActivityPanel
                activities={activitiesData}
                loading={activitiesLoading}
                error={activitiesError}
                maxItems={5}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
}
