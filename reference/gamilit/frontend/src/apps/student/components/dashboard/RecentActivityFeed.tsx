import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Trophy,
  Zap,
  BookOpen,
  Star,
  Clock,
} from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';

interface ActivityItem {
  id: string;
  type: 'exercise' | 'achievement' | 'rank' | 'module';
  title: string;
  description: string;
  timestamp: string;
  points?: number;
  icon: React.ElementType;
  color: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'exercise',
    title: 'Ejercicio completado',
    description: 'Crucigrama Científico: Marie Curie',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    points: 50,
    icon: CheckCircle,
    color: 'text-detective-success',
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Logro desbloqueado',
    description: 'Detective Dedicado - Racha de 7 días',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    icon: Trophy,
    color: 'text-detective-gold',
  },
  {
    id: '3',
    type: 'rank',
    title: 'Rango mejorado',
    description: 'Ascendido a Ajaw (Señor)',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    icon: Zap,
    color: 'text-detective-orange',
  },
  {
    id: '4',
    type: 'module',
    title: 'Módulo iniciado',
    description: 'Los Primeros Pasos de Marie Curie',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    icon: BookOpen,
    color: 'text-detective-blue',
  },
];

export function RecentActivityFeed() {
  const getTimeAgo = (timestamp: string): string => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  return (
    <DetectiveCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-detective-text">
          Actividad Reciente
        </h3>
        <Clock className="w-5 h-5 text-detective-text-secondary" />
      </div>

      <div className="space-y-3">
        {mockActivities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-detective-bg rounded-lg hover:bg-detective-bg-secondary transition-colors"
            >
              <div className={`p-2 bg-white rounded-lg ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-detective-text">
                    {activity.title}
                  </p>
                  {activity.points && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-detective-gold/10 rounded flex-shrink-0">
                      <Star className="w-3 h-3 text-detective-gold fill-detective-gold" />
                      <span className="text-xs font-bold text-detective-gold">
                        +{activity.points}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-detective-text-secondary mb-1">
                  {activity.description}
                </p>

                <span className="text-xs text-detective-text-secondary">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-detective-orange hover:text-detective-orange-dark transition-colors">
        Ver todo el historial
      </button>
    </DetectiveCard>
  );
}
