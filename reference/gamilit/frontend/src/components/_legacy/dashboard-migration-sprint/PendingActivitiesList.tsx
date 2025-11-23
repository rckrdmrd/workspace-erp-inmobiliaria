/**
 * PendingActivitiesList Component
 *
 * ISSUE: #2.2 (P0) - Dashboard Pending Activities
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 + Sprint 1 - Opción B
 *
 * Lista de actividades pendientes del estudiante
 */

import { useState, useEffect } from 'react';
import { Clock, Target, TrendingUp, AlertCircle } from 'lucide-react';

export interface PendingActivity {
  id: string;
  type: 'exercise' | 'lesson' | 'assessment' | 'assignment';
  title: string;
  module_name: string;
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
  estimated_minutes: number;
  due_date?: Date;
  priority: 'low' | 'medium' | 'high';
  xp_reward: number;
  ml_coins_reward: number;
}

interface PendingActivitiesListProps {
  activities: PendingActivity[];
  onActivityClick: (activityId: string) => void;
  maxItems?: number;
}

const ACTIVITY_ICONS = {
  exercise: '📝',
  lesson: '📚',
  assessment: '📊',
  assignment: '✍️'
};

const ACTIVITY_LABELS = {
  exercise: 'Ejercicio',
  lesson: 'Lección',
  assessment: 'Evaluación',
  assignment: 'Tarea'
};

const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const PRIORITY_LABELS = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
};

/**
 * Lista de actividades pendientes con priorización
 */
export const PendingActivitiesList = ({
  activities,
  onActivityClick,
  maxItems = 5
}: PendingActivitiesListProps) => {
  const [sortedActivities, setSortedActivities] = useState<PendingActivity[]>([]);

  useEffect(() => {
    // Ordenar por prioridad y fecha de vencimiento
    const sorted = [...activities].sort((a, b) => {
      // Primero por prioridad
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Luego por fecha de vencimiento
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;

      return 0;
    });

    setSortedActivities(sorted.slice(0, maxItems));
  }, [activities, maxItems]);

  const getDaysUntilDue = (dueDate: Date): number => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ¡Todo al día! 🎉
        </h3>
        <p className="text-gray-600">
          No tienes actividades pendientes en este momento.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          ¡Excelente trabajo manteniendo tu progreso al día!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-orange-500" />
          Actividades Pendientes
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {activities.length} actividad{activities.length !== 1 ? 'es' : ''} por completar
        </p>
      </div>

      {/* Lista de actividades */}
      <div className="divide-y divide-gray-200">
        {sortedActivities.map((activity) => {
          const daysUntilDue = activity.due_date ? getDaysUntilDue(activity.due_date) : null;
          const isUrgent = daysUntilDue !== null && daysUntilDue <= 2;

          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick(activity.id)}
              className={`
                p-4 hover:bg-gray-50 cursor-pointer transition-colors
                ${isUrgent ? 'bg-red-50' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                  {ACTIVITY_ICONS[activity.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.module_name} • {ACTIVITY_LABELS[activity.type]}
                      </p>
                    </div>

                    {/* Priority badge */}
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0
                      ${PRIORITY_COLORS[activity.priority]}
                    `}>
                      {PRIORITY_LABELS[activity.priority]}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity.estimated_minutes} min
                    </span>

                    {activity.due_date && (
                      <span className={`flex items-center ${isUrgent ? 'text-red-600 font-semibold' : ''}`}>
                        {isUrgent && '🔥 '}
                        {daysUntilDue !== null && (
                          daysUntilDue === 0 ? '¡Vence hoy!' :
                          daysUntilDue === 1 ? 'Vence mañana' :
                          daysUntilDue < 0 ? `Venció hace ${Math.abs(daysUntilDue)} día(s)` :
                          `Vence en ${daysUntilDue} día(s)`
                        )}
                      </span>
                    )}
                  </div>

                  {/* Recompensas */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-purple-600 font-semibold">
                      +{activity.xp_reward} XP
                    </span>
                    <span className="text-xs text-yellow-600 font-semibold">
                      +{activity.ml_coins_reward} ML Coins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {activities.length > maxItems && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
            Ver todas las actividades ({activities.length})
          </button>
        </div>
      )}
    </div>
  );
};
