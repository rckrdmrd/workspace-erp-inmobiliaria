import { useEffect } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  Building2,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

/**
 * AdminDashboardPage - Dashboard principal para administradores
 * Updated: 2025-11-19 - Integrated with useAdminDashboard hook (FE-059)
 */
export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use useAdminDashboard hook for real data
  const {
    systemHealth,
    metrics,
    alerts,
    loading,
    error,
    lastUpdated,
    refreshAll,
    dismissAlert,
  } = useAdminDashboard();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Fallback gamification data in case hook fails or user is not loaded
  const displayGamificationData = gamificationData || {
    userId: user?.id || 'mock-admin-id',
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

  // Fetch dashboard data on mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <AdminLayout
      user={user || undefined}
      gamificationData={displayGamificationData}
      organizationName="GAMILIT Platform Admin"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-detective-text">Panel de Administración</h1>
            <p className="text-detective-text-secondary mt-1">
              Gestiona la plataforma GAMILIT de forma centralizada
            </p>
            {lastUpdated && (
              <p className="text-xs text-detective-text-secondary mt-1">
                Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
              </p>
            )}
          </div>
          <DetectiveButton
            variant="secondary"
            onClick={refreshAll}
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </DetectiveButton>
        </div>

        {/* Error Message */}
        {error && (
          <DetectiveCard>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-500">
              <p className="font-semibold">Error al cargar dashboard:</p>
              <p>{error}</p>
            </div>
          </DetectiveCard>
        )}

        {/* Loading State */}
        {loading && !metrics ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
            <p className="mt-4 text-detective-text-secondary">Cargando datos del dashboard...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Usuarios Totales</p>
                    <p className="text-2xl font-bold text-detective-text">
                      {metrics?.totalUsers || 0}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      {metrics?.activeSessions || 0} activos
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
              </DetectiveCard>

              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Instituciones</p>
                    <p className="text-2xl font-bold text-detective-text">
                      {metrics?.totalOrganizations || 0}
                    </p>
                    <p className="text-xs text-detective-text-secondary mt-1">Registradas</p>
                  </div>
                  <Building2 className="w-10 h-10 text-purple-500" />
                </div>
              </DetectiveCard>

              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Almacenamiento</p>
                    <p className="text-2xl font-bold text-detective-text">
                      {metrics?.storageUsed ? metrics.storageUsed.toFixed(1) : '0'} GB
                    </p>
                    <p className="text-xs text-detective-text-secondary mt-1">
                      de {metrics?.storageTotal || 0} GB
                    </p>
                  </div>
                  <BookOpen className="w-10 h-10 text-green-500" />
                </div>
              </DetectiveCard>

              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Contenido Flagged</p>
                    <p className="text-2xl font-bold text-detective-gold">
                      {metrics?.flaggedContentCount || 0}
                    </p>
                    <p className="text-xs text-detective-text-secondary mt-1">Requiere revisión</p>
                  </div>
                  <Trophy className="w-10 h-10 text-detective-gold" />
                </div>
              </DetectiveCard>
            </div>
          </>
        )}

        {/* System Health */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DetectiveCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-detective-text flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-500" />
                  Estado del Sistema
                </h2>
                {systemHealth && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    systemHealth.status === 'healthy' ? 'bg-green-100 text-green-700' :
                    systemHealth.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {systemHealth.status === 'healthy' ? '✓ Operativo' :
                     systemHealth.status === 'degraded' ? '⚠ Degradado' :
                     '✕ Crítico'}
                  </span>
                )}
              </div>

              {systemHealth ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-sm text-detective-text">API Backend</span>
                    <span className="text-sm text-green-500 font-medium">
                      ✓ {systemHealth.apiUptime}% uptime
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-sm text-detective-text">Base de Datos</span>
                    <span className={`text-sm font-medium ${
                      systemHealth.database === 'healthy' ? 'text-green-500' :
                      systemHealth.database === 'degraded' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {systemHealth.database === 'healthy' ? '✓ Operativo' :
                       systemHealth.database === 'degraded' ? '⚠ Degradado' :
                       '✕ Fuera de servicio'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-sm text-detective-text">CPU</span>
                    <span className="text-sm text-detective-text-secondary">
                      {systemHealth.cpu.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-sm text-detective-text">Memoria</span>
                    <span className="text-sm text-detective-text-secondary">
                      {systemHealth.memory.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-sm text-detective-text">Usuarios Activos</span>
                    <span className="text-sm text-blue-500 font-medium">
                      {systemHealth.activeUsers}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-detective-text-secondary">
                  No se pudo cargar información del sistema
                </p>
              )}
            </DetectiveCard>

            <DetectiveCard>
              <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                Alertas y Notificaciones
              </h2>

              {alerts && alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        alert.severity === 'high'
                          ? 'bg-red-900/20 border-red-500/30'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-900/20 border-yellow-500/30'
                          : 'bg-blue-900/20 border-blue-500/30'
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 mt-0.5 ${
                          alert.severity === 'high'
                            ? 'text-red-500'
                            : alert.severity === 'medium'
                            ? 'text-yellow-500'
                            : 'text-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            alert.severity === 'high'
                              ? 'text-red-400'
                              : alert.severity === 'medium'
                              ? 'text-yellow-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {alert.title}
                        </p>
                        <p className="text-xs text-detective-text-secondary mt-1">{alert.message}</p>
                      </div>
                      {!alert.dismissed && (
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="text-xs text-detective-text-secondary hover:text-detective-text"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <ShieldCheck className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-400">
                        {metrics?.flaggedContentCount || 0} Contenido Flagged
                      </p>
                      <p className="text-xs text-detective-text-secondary mt-1">
                        Requiere revisión
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-4 text-detective-text-secondary text-sm">
                    <p>No hay alertas activas en este momento</p>
                    <p className="text-xs mt-1">
                      ⓘ Sistema de alertas en tiempo real próximamente
                    </p>
                  </div>
                </div>
              )}
            </DetectiveCard>
          </div>
        )}

        {/* Quick Actions */}
        {!loading && (
          <DetectiveCard>
            <h2 className="text-xl font-bold text-detective-text mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 hover:scale-105 transition-all text-center"
              >
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-detective-text">Gestionar Usuarios</p>
                <p className="text-xs text-detective-text-secondary mt-1">
                  {metrics?.totalUsers || 0} usuarios
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/institutions')}
                className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 hover:scale-105 transition-all text-center"
              >
                <Building2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-detective-text">Instituciones</p>
                <p className="text-xs text-detective-text-secondary mt-1">
                  {metrics?.totalOrganizations || 0} instituciones
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/content')}
                className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 hover:scale-105 transition-all text-center"
              >
                <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-detective-text">Contenido</p>
                <p className="text-xs text-detective-text-secondary mt-1">
                  {metrics?.flaggedContentCount || 0} flagged
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/gamification')}
                className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 hover:scale-105 transition-all text-center"
              >
                <Trophy className="w-8 h-8 text-detective-gold mx-auto mb-2" />
                <p className="text-sm font-medium text-detective-text">Gamificación</p>
                <p className="text-xs text-detective-text-secondary mt-1">Configurar</p>
              </button>
            </div>
          </DetectiveCard>
        )}
      </div>
    </AdminLayout>
  );
}
