import React from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import TeacherDashboard from './TeacherDashboard';

/**
 * TeacherDashboardPage - Wrapper que combina TeacherLayout con TeacherDashboard
 *
 * Este componente envuelve el TeacherDashboard existente con el nuevo TeacherLayout
 * que incluye el sidebar de navegación.
 */
export default function TeacherDashboardPage() {
  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Fallback gamification data in case hook fails or user is not loaded
  const displayGamificationData = gamificationData || {
    userId: user?.id || 'mock-teacher-id',
    level: 1,
    totalXP: 0,
    mlCoins: 0,
    rank: 'Novato',
    achievements: [],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <TeacherLayout
      user={user ?? undefined}
      gamificationData={displayGamificationData}
      organizationName="Escuela Primaria Miguel Hidalgo"
      onLogout={handleLogout}
    >
      <TeacherDashboard />
    </TeacherLayout>
  );
}
