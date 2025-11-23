import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { RankBadge } from '@shared/components/base/RankBadge';
import { User, Mail, Calendar, Trophy, Target, Coins } from 'lucide-react';
import { useUserGamification } from '@shared/hooks/useUserGamification';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  const stats = [
    { label: 'ML Coins', value: '350', icon: Coins, color: 'text-detective-gold' },
    { label: 'Logros Desbloqueados', value: '12/50', icon: Trophy, color: 'text-detective-orange' },
    { label: 'Ejercicios Completados', value: '28', icon: Target, color: 'text-detective-blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <GamifiedHeader
        user={user ?? undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      <main className="detective-container py-8">
        <h1 className="text-4xl font-bold text-detective-text mb-8">
          Mi Perfil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Principal */}
          <div className="lg:col-span-1">
            <DetectiveCard hoverable={false}>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-detective-orange to-detective-gold rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-detective-text mb-2">
                  {user?.displayName || user?.email?.split('@')[0] || 'Usuario'}
                </h2>
                <p className="text-detective-text-secondary mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <RankBadge rank="detective_novato" showIcon={true} />
                <p className="text-detective-text-secondary text-sm mt-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Miembro desde: Enero 2025
                </p>
              </div>
            </DetectiveCard>
          </div>

          {/* Estadísticas */}
          <div className="lg:col-span-2">
            <DetectiveCard hoverable={false} className="mb-6">
              <h3 className="text-xl font-bold text-detective-text mb-4">
                Estadísticas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-detective-bg rounded-lg">
                      <div className={`${stat.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-detective-text">
                          {stat.value}
                        </p>
                        <p className="text-sm text-detective-text-secondary">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DetectiveCard>

            <DetectiveCard hoverable={false}>
              <h3 className="text-xl font-bold text-detective-text mb-4">
                Logros Recientes
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Primer Caso Resuelto', date: 'Hace 2 días' },
                  { title: 'Racha de 5 días', date: 'Hace 1 semana' },
                  { title: 'Maestro del Crucigrama', date: 'Hace 2 semanas' },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-detective-bg rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-detective-gold" />
                      <div>
                        <p className="font-semibold text-detective-text">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-detective-text-secondary">
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetectiveCard>
          </div>
        </div>
      </main>
    </div>
  );
}
