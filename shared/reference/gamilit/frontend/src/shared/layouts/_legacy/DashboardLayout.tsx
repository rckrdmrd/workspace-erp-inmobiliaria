import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthContext';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { GamifiedHeader } from '@/shared/components/layout/GamifiedHeader';
import { GamilitSidebar } from '@/shared/components/layout/GamilitSidebar';
import { gamificationApi } from '@/lib/api/gamification.api';
import type { UserGamificationData } from '@/shared/components/layout/GamifiedHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout Component - Detective Theme
 * Main layout wrapper for dashboard pages with gamification features
 *
 * Features:
 * - GamifiedHeader with XP, ML Coins, badges, notifications (Detective orange theme)
 * - GamilitSidebar with role-based navigation and module progress
 * - Responsive: Sidebar collapses to mobile menu on small screens
 * - Fetches and displays gamification data automatically
 * - Mobile-friendly with overlay sidebar
 * - Integrates with AuthContext for user data
 *
 * Layout Structure:
 * ```
 * ┌─────────────────────────────────────┐
 * │      GamifiedHeader (Orange)        │
 * ├──────────┬──────────────────────────┤
 * │          │                          │
 * │ Gamilit  │   Main Content          │
 * │ Sidebar  │   (flex-1)              │
 * │          │                          │
 * └──────────┴──────────────────────────┘
 * ```
 *
 * @param children - Page content to render
 *
 * @example
 * ```tsx
 * <DashboardLayout>
 *   <h1>Dashboard Page Content</h1>
 *   <StatsGrid />
 * </DashboardLayout>
 * ```
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { logout: zustandLogout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [gamificationData, setGamificationData] = useState<UserGamificationData | null>(null);

  // Handle logout with navigation - SYNCS BOTH auth systems
  const handleLogout = () => {
    console.log('🚪 [handleLogout] Starting IMMEDIATE logout...');

    // STEP 1: Clear ALL localStorage IMMEDIATELY (nuclear option)
    console.log('🚪 [handleLogout] Clearing ALL localStorage...');
    const keysToRemove = [
      'auth-token',
      'refresh-token',
      'auth-storage',
      'is_logging_out'
    ];

    // Clear specific keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🚪 [handleLogout] Removed: ${key}`);
    });

    // STEP 2: Set logout flag AFTER clearing (so it's the only thing left)
    localStorage.setItem('is_logging_out', 'true');
    console.log('🚪 [handleLogout] Set is_logging_out flag');

    // STEP 3: Clear auth state in memory IMMEDIATELY (synchronous)
    console.log('🚪 [handleLogout] Clearing in-memory state...');

    // Clear authStore using direct setState
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      sessionExpiresAt: null,
      error: null,
      isLoading: false
    });

    // STEP 4: Force immediate redirect (no async, no waiting)
    console.log('🚪 [handleLogout] FORCING redirect to /login NOW...');

    // Use setTimeout with 0ms to ensure localStorage operations complete
    setTimeout(() => {
      console.log('🚪 [handleLogout] Executing redirect...');
      window.location.replace('/login');
    }, 0);
  };

  // Fetch gamification data
  useEffect(() => {
    const loadGamificationData = async () => {
      if (!user?.id) return;

      try {
        const [stats, coins] = await Promise.all([
          gamificationApi.getUserStats(user.id),
          gamificationApi.getMLCoinsBalance(user.id),
        ]);

        setGamificationData({
          experience: stats.totalPoints || 0,
          experienceProgress: stats.experienceProgress || 0,
          level: stats.level || 1,
          rank: 'Detective Novato', // TODO: Calculate from level
          mlCoins: coins.balance || 0,
          currentStreak: stats.current_streak || 0,
          badges: [], // TODO: Fetch badges
        });
      } catch (err) {
        console.error('Failed to load gamification data:', err);
        // Use default values on error
        setGamificationData({
          experience: 0,
          experienceProgress: 0,
          level: 1,
          rank: 'Detective Novato',
          mlCoins: 0,
          currentStreak: 0,
          badges: [],
        });
      }
    };

    loadGamificationData();
  }, [user?.id]);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* GamilitSidebar - Detective Theme */}
      <GamilitSidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        currentPath={location.pathname}
        onNavigate={handleNavigate}
        userRole={user?.role as 'student' | 'teacher' | 'admin' || 'student'}
        moduleProgress={[]} // TODO: Fetch module progress
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* GamifiedHeader - Detective Theme */}
        <GamifiedHeader
          user={user || undefined}
          onLogout={handleLogout}
          gamificationData={gamificationData}
          organizationName="GAMILIT"
          notifications={[]} // TODO: Fetch notifications
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
