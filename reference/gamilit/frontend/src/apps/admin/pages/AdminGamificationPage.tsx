import React, { useState } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  Trophy,
  Star,
  Coins,
  Target,
  TrendingUp,
  Settings,
  Award,
  Zap,
} from 'lucide-react';

/**
 * AdminGamificationPage - Configuración de gamificación global
 */
export default function AdminGamificationPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'ranks' | 'achievements' | 'economy' | 'stats'>('ranks');

  const gamificationData = {
    userId: user?.id || 'mock-admin-id',
    level: 20,
    totalXP: 5000,
    mlCoins: 2500,
    rank: 'Super Admin',
    achievements: ['admin_master', 'gamification_wizard'],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Mock data de rangos Maya
  const mayaRanks = [
    { id: 'chuen', name: 'Chuen', minXP: 0, maxXP: 999, color: 'text-gray-400', users: 450 },
    { id: 'oc', name: 'Oc', minXP: 1000, maxXP: 2499, color: 'text-green-400', users: 380 },
    { id: 'manik', name: 'Manik', minXP: 2500, maxXP: 4999, color: 'text-blue-400', users: 250 },
    { id: 'lamat', name: 'Lamat', minXP: 5000, maxXP: 9999, color: 'text-purple-400', users: 120 },
    { id: 'muluc', name: 'Muluc', minXP: 10000, maxXP: 19999, color: 'text-orange-400', users: 35 },
    { id: 'ahau', name: 'Ahau', minXP: 20000, maxXP: 999999, color: 'text-yellow-400', users: 15 },
  ];

  // Mock achievements
  const achievements = [
    { id: 'first_exercise', name: 'Primer Ejercicio', description: 'Completa tu primer ejercicio', users: 1200 },
    { id: 'module_master', name: 'Maestro del Módulo', description: 'Completa un módulo entero', users: 450 },
    { id: 'perfect_score', name: 'Puntuación Perfecta', description: 'Obtén 100% en un ejercicio', users: 380 },
    { id: 'streak_7', name: 'Racha de 7 Días', description: 'Mantén una racha de 7 días', users: 150 },
  ];

  // Economy stats
  const economyStats = {
    totalMLCoins: 125000,
    averagePerUser: 100,
    dailyTransactions: 450,
    shopItems: 25,
    powerUps: 12,
  };

  // Global stats
  const globalStats = {
    totalXPEarned: 2500000,
    totalAchievementsUnlocked: 3200,
    averageRank: 'Manik',
    mostActiveDay: 'Lunes',
  };

  return (
    <AdminLayout
      user={user || undefined}
      gamificationData={gamificationData}
      organizationName="GAMILIT Platform Admin"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-detective-text flex items-center gap-3">
            <Trophy className="w-8 h-8 text-detective-gold" />
            Gamificación
          </h1>
          <p className="text-detective-text-secondary mt-1">
            Configura rangos, logros, economía y visualiza estadísticas
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('ranks')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'ranks'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text-secondary hover:bg-detective-bg-secondary/70'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Rangos Maya
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'achievements'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text-secondary hover:bg-detective-bg-secondary/70'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Logros
          </button>
          <button
            onClick={() => setActiveTab('economy')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'economy'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text-secondary hover:bg-detective-bg-secondary/70'
            }`}
          >
            <Coins className="w-4 h-4 inline mr-2" />
            Economía ML Coins
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'stats'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text-secondary hover:bg-detective-bg-secondary/70'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Estadísticas
          </button>
        </div>

        {/* Ranks Tab */}
        {activeTab === 'ranks' && (
          <div className="space-y-4">
            <DetectiveCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-detective-text">Rangos Maya</h2>
                <DetectiveButton variant="primary" size="sm" onClick={() => alert('Editar rangos')}>
                  <Settings className="w-4 h-4" />
                  Configurar
                </DetectiveButton>
              </div>

              <div className="space-y-3">
                {mayaRanks.map((rank) => (
                  <div
                    key={rank.id}
                    className="flex items-center justify-between p-4 bg-detective-bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Star className={`w-8 h-8 ${rank.color}`} />
                      <div>
                        <h3 className={`text-lg font-bold ${rank.color}`}>{rank.name}</h3>
                        <p className="text-sm text-detective-text-secondary">
                          {rank.minXP} - {rank.maxXP === 999999 ? '∞' : rank.maxXP} XP
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-detective-text">{rank.users}</p>
                      <p className="text-xs text-detective-text-secondary">usuarios</p>
                    </div>
                  </div>
                ))}
              </div>
            </DetectiveCard>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <DetectiveCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-detective-text">Logros</h2>
                <DetectiveButton variant="primary" size="sm" onClick={() => alert('Crear logro')}>
                  <Award className="w-4 h-4" />
                  Nuevo Logro
                </DetectiveButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-detective-gold" />
                        <div>
                          <h3 className="font-bold text-detective-text">{achievement.name}</h3>
                          <p className="text-sm text-detective-text-secondary">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                      <span className="text-sm text-detective-text-secondary">Desbloqueado por:</span>
                      <span className="text-lg font-bold text-blue-400">{achievement.users} usuarios</span>
                    </div>
                  </div>
                ))}
              </div>
            </DetectiveCard>
          </div>
        )}

        {/* Economy Tab */}
        {activeTab === 'economy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <Coins className="w-12 h-12 text-detective-gold mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">ML Coins en Circulación</p>
                  <p className="text-3xl font-bold text-detective-gold">
                    {economyStats.totalMLCoins.toLocaleString()}
                  </p>
                </div>
              </DetectiveCard>
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">Promedio por Usuario</p>
                  <p className="text-3xl font-bold text-blue-400">{economyStats.averagePerUser}</p>
                </div>
              </DetectiveCard>
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">Transacciones Diarias</p>
                  <p className="text-3xl font-bold text-green-400">{economyStats.dailyTransactions}</p>
                </div>
              </DetectiveCard>
            </div>

            <DetectiveCard>
              <h2 className="text-xl font-bold text-detective-text mb-4">Configuración de Economía</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-detective-text mb-2">
                      ML Coins por Ejercicio Completado
                    </label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-detective-text mb-2">
                      ML Coins por Logro Desbloqueado
                    </label>
                    <input
                      type="number"
                      defaultValue={50}
                      className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text"
                    />
                  </div>
                </div>
                <DetectiveButton variant="primary" onClick={() => alert('Guardar configuración')}>
                  Guardar Configuración
                </DetectiveButton>
              </div>
            </DetectiveCard>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <Zap className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">XP Total Ganada</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {globalStats.totalXPEarned.toLocaleString()}
                  </p>
                </div>
              </DetectiveCard>
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <Award className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">Logros Desbloqueados</p>
                  <p className="text-2xl font-bold text-purple-400">{globalStats.totalAchievementsUnlocked}</p>
                </div>
              </DetectiveCard>
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <Star className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">Rango Promedio</p>
                  <p className="text-2xl font-bold text-blue-400">{globalStats.averageRank}</p>
                </div>
              </DetectiveCard>
              <DetectiveCard hoverable={false}>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-detective-text-secondary mb-1">Día Más Activo</p>
                  <p className="text-2xl font-bold text-green-400">{globalStats.mostActiveDay}</p>
                </div>
              </DetectiveCard>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
