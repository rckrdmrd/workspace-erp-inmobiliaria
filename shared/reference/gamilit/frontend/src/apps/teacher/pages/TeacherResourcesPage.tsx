import React from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { useUserGamification } from '@shared/hooks/useUserGamification';

/**
 * TeacherResourcesPage - Página de recursos educativos
 *
 * Placeholder para la funcionalidad de gestión de recursos educativos,
 * materiales didácticos y biblioteca de contenidos.
 */
export default function TeacherResourcesPage() {
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
      organizationName="GLIT Platform"
      onLogout={handleLogout}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Recursos Educativos</h1>
        <p className="text-gray-600">Esta pantalla está en desarrollo.</p>
      </div>
    </TeacherLayout>
  );
}
