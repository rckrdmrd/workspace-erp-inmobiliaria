/**
 * MissionsPage - Complete Missions Hub for GLIT Platform
 *
 * Full-featured missions page with:
 * - Hero section with stats
 * - Tab navigation (Daily, Weekly, Special)
 * - Mission cards grid with animations
 * - Active mission tracker sidebar
 * - Rewards preview
 * - Real-time updates
 * - Responsive design
 * - Confetti on claim
 *
 * Route: /student/missions
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { MissionStatus, MissionType } from '@/features/gamification/missions/types/missionsTypes';

// Components
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { MissionTabs } from '@/features/gamification/missions/components/MissionTabs';
import { MissionGrid } from '@/features/gamification/missions/components/MissionGrid';
import { ActiveMissionTracker } from '@/features/gamification/missions/components/ActiveMissionTracker';
import { RewardsPreview } from '@/features/gamification/missions/components/RewardsPreview';

// Hooks
import { useMissions } from '@/features/gamification/missions/hooks/useMissions';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUserGamification } from '@shared/hooks/useUserGamification';

// Utils
import { cn } from '@shared/utils/cn';

export default function MissionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Get tab from URL or default to 'daily'
  const tabFromUrl = (searchParams.get('tab') as MissionType) || 'daily';

  // Hook
  const {
    dailyMissions,
    weeklyMissions,
    specialMissions,
    activeMissions,
    currentTab,
    setCurrentTab,
    startMission,
    claimReward,
    trackMission,
    untrackMission,
    isTracked,
    stats,
    rewardsSummary,
    loading,
    error,
    refresh,
  } = useMissions();

  // Status filter
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');

  // Initialize tab from URL
  useEffect(() => {
    if (tabFromUrl !== currentTab) {
      setCurrentTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Update URL when tab changes
  const handleTabChange = (tab: MissionType) => {
    setCurrentTab(tab);
    setSearchParams({ tab });
  };

  // Get current missions based on tab
  const currentMissions = useMemo(() => {
    switch (currentTab) {
      case 'daily':
        return dailyMissions;
      case 'weekly':
        return weeklyMissions;
      case 'special':
        return specialMissions;
      default:
        return dailyMissions;
    }
  }, [currentTab, dailyMissions, weeklyMissions, specialMissions]);

  // Handle mission start
  const handleStartMission = async (missionId: string) => {
    const result = await startMission(missionId);
    if (result.success) {
      // Auto-track on start
      trackMission(missionId);
      // TODO: Show success toast
    } else {
      // TODO: Show error toast
      console.error(result.message);
    }
  };

  // Handle claim reward
  const handleClaimReward = async (missionId: string) => {
    const result = await claimReward(missionId);
    if (result.success) {
      // TODO: Show success toast with rewards
      console.log('Claimed!', result.rewards);
    } else {
      // TODO: Show error toast
      console.error(result.message);
    }
  };

  // Empty message based on tab and filter
  const getEmptyMessage = () => {
    if (statusFilter !== 'all') {
      return `No hay misiones con estado "${statusFilter}"`;
    }

    switch (currentTab) {
      case 'daily':
        return '¡Vuelve mañana para nuevas misiones diarias!';
      case 'weekly':
        return 'Nuevas misiones semanales el próximo lunes';
      case 'special':
        return 'No hay eventos especiales activos actualmente';
      default:
        return 'No hay misiones disponibles';
    }
  };

  // Check if all missions completed
  const allCompleted = currentMissions.every(m => m.status === 'claimed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header siempre visible */}
      <GamifiedHeader
        user={user || undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* Tabs Navigation */}
        <MissionTabs
          currentTab={currentTab}
          onTabChange={handleTabChange}
          dailyMissions={dailyMissions}
          weeklyMissions={weeklyMissions}
          specialMissions={specialMissions}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* All Completed Banner */}
        {allCompleted && currentMissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 mb-6 text-center"
          >
            <h3 className="text-2xl font-bold mb-2">
              ¡Increíble! 🎉
            </h3>
            <p className="text-lg">
              Has completado todas las misiones {currentTab === 'daily' ? 'diarias' : currentTab === 'weekly' ? 'semanales' : 'especiales'}
            </p>
          </motion.div>
        )}

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Missions Grid (Left - 2 cols on desktop) */}
          <div className="lg:col-span-2">
            <MissionGrid
              missions={currentMissions}
              loading={loading}
              statusFilter={statusFilter}
              onStartMission={handleStartMission}
              onClaimReward={handleClaimReward}
              onTrackMission={trackMission}
              isTracked={isTracked}
              emptyMessage={getEmptyMessage()}
            />
          </div>

          {/* Active Mission Tracker (Right - 1 col on desktop) */}
          <div className="lg:col-span-1">
            <ActiveMissionTracker
              trackedMissions={activeMissions}
              onClaim={handleClaimReward}
              onUntrack={untrackMission}
            />
          </div>
        </div>

        {/* Rewards Preview Banner */}
        {currentMissions.length > 0 && (
          <RewardsPreview
            summary={rewardsSummary}
            currentTab={currentTab}
          />
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
}
