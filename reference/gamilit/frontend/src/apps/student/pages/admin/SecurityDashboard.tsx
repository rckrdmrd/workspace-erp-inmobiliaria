import React from 'react';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { SecurityEventsList } from '@features/auth/components/SecurityEventsList';
import { SessionsList } from '@features/auth/components/SessionsList';
import { ErrorTrackingPanel } from '../../../admin/components/monitoring/ErrorTrackingPanel';
import { Shield, AlertTriangle, Users, Activity } from 'lucide-react';

export default function SecurityDashboard() {
  // Mock stats
  const stats = [
    { label: 'Sesiones Activas', value: 42, icon: Users, color: 'text-blue-600' },
    { label: 'Eventos de Seguridad', value: 3, icon: AlertTriangle, color: 'text-orange-600' },
    { label: 'Logins Exitosos (hoy)', value: 128, icon: Shield, color: 'text-green-600' },
    { label: 'Logins Fallidos (hoy)', value: 7, icon: Activity, color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <GamifiedHeader user={{
        id: 'mock-security-dashboard-id',
        email: 'admin@glit.com',
        role: 'super_admin',
        displayName: 'Admin Security'
      }} />

      <main className="detective-container py-8">
        <h1 className="text-detective-title mb-6">Dashboard de Seguridad</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <DetectiveCard key={stat.label}>
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-detective-small">{stat.label}</p>
                  <p className="text-2xl font-bold text-detective-text">{stat.value}</p>
                </div>
              </div>
            </DetectiveCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DetectiveCard>
            <h2 className="text-detective-subtitle mb-4">Eventos de Seguridad Recientes</h2>
            <SecurityEventsList />
          </DetectiveCard>

          <DetectiveCard>
            <h2 className="text-detective-subtitle mb-4">Sesiones Activas</h2>
            <SessionsList />
          </DetectiveCard>
        </div>

        {/* Integrated Error Tracking */}
        <div className="mb-6">
          <h2 className="text-detective-subtitle mb-4">Error Tracking & System Issues</h2>
        </div>
        <ErrorTrackingPanel />
      </main>
    </div>
  );
}
