import React, { useState } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { SystemPerformanceDashboard } from '../components/monitoring/SystemPerformanceDashboard';
import { UserActivityMonitor } from '../components/monitoring/UserActivityMonitor';
import { ErrorTrackingPanel } from '../components/monitoring/ErrorTrackingPanel';
import { SystemHealthIndicators } from '../components/monitoring/SystemHealthIndicators';

/**
 * AdminMonitoringPage - Monitoreo del sistema en tiempo real
 * Updated: 2025-11-19 - Migrated to use AdminLayout with sidebar
 */
const AdminMonitoringPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'performance' | 'activity' | 'errors' | 'health'>('performance');

  const tabs = [
    { id: 'performance' as const, label: 'Performance Dashboard', component: SystemPerformanceDashboard },
    { id: 'activity' as const, label: 'User Activity', component: UserActivityMonitor },
    { id: 'errors' as const, label: 'Error Tracking', component: ErrorTrackingPanel },
    { id: 'health' as const, label: 'System Health', component: SystemHealthIndicators },
  ];

  // TODO: Replace with useUserGamification hook when backend endpoint is ready
  const gamificationData = {
    userId: user?.id || 'mock-admin-id',
    level: 20,
    totalXP: 5000,
    mlCoins: 2500,
    rank: 'Super Admin',
    achievements: ['admin_master', 'system_monitor'],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || SystemPerformanceDashboard;

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
          <h1 className="text-3xl font-bold text-detective-text">Monitoreo del Sistema</h1>
          <p className="text-detective-text-secondary mt-1">
            Monitorea el rendimiento, actividad y salud del sistema en tiempo real
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-detective-orange text-white'
                  : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <ActiveComponent />
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoringPage;
