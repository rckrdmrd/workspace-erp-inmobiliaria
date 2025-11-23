import React from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { User, Clock, Target, TrendingUp } from 'lucide-react';
import type { StudentMonitoring } from '../../types';

interface StudentStatusCardProps {
  student: StudentMonitoring;
  onClick?: () => void;
}

export function StudentStatusCard({ student, onClick }: StudentStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'offline':
        return 'Offline';
      default:
        return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'inactive':
        return '🟡';
      case 'offline':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getTimeSinceLastActivity = (lastActivity: string) => {
    const now = new Date();
    const last = new Date(lastActivity);
    const diffMs = now.getTime() - last.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `Hace ${diffMins} min`;
    } else if (diffMins < 1440) {
      return `Hace ${Math.floor(diffMins / 60)} hrs`;
    } else {
      return `Hace ${Math.floor(diffMins / 1440)} días`;
    }
  };

  return (
    <DetectiveCard onClick={onClick} className="cursor-pointer hover:border-detective-orange">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-detective-bg-secondary rounded-full">
              <User className="w-5 h-5 text-detective-orange" />
            </div>
            <div>
              <h3 className="font-bold text-detective-text">{student.full_name}</h3>
              <p className="text-xs text-detective-text-secondary">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStatusIcon(student.status)}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(student.status)}`}>
              {getStatusText(student.status)}
            </span>
          </div>
        </div>

        {/* Current Activity */}
        {student.current_module && (
          <div className="bg-detective-bg-secondary p-3 rounded-lg">
            <p className="text-xs text-detective-text-secondary mb-1">Trabajando en:</p>
            <p className="text-sm font-semibold text-detective-text">
              {student.current_module}
            </p>
            {student.current_exercise && (
              <p className="text-xs text-detective-text-secondary mt-1">
                Ejercicio: {student.current_exercise}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-detective-orange" />
            </div>
            <p className="text-lg font-bold text-detective-text">
              {student.exercises_completed}/{student.exercises_total}
            </p>
            <p className="text-xs text-detective-text-secondary">Ejercicios</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-detective-gold" />
            </div>
            <p className="text-lg font-bold text-detective-text">
              {student.score_average.toFixed(0)}%
            </p>
            <p className="text-xs text-detective-text-secondary">Score Prom.</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-detective-accent" />
            </div>
            <p className="text-lg font-bold text-detective-text">
              {Math.floor(student.time_spent_minutes / 60)}h
            </p>
            <p className="text-xs text-detective-text-secondary">Tiempo</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-detective-text-secondary">Progreso General</span>
            <span className="text-xs font-semibold text-detective-text">
              {student.progress_percentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-detective-bg-secondary rounded-full h-2">
            <div
              className="bg-gradient-to-r from-detective-orange to-detective-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${student.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between pt-2 border-t border-detective-bg-secondary">
          <span className="text-xs text-detective-text-secondary">Última actividad:</span>
          <span className="text-xs font-semibold text-detective-text">
            {getTimeSinceLastActivity(student.last_activity)}
          </span>
        </div>
      </div>
    </DetectiveCard>
  );
}
