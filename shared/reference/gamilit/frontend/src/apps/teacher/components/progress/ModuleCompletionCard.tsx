import React from 'react';
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { ModuleProgress } from '../../types';

interface ModuleCompletionCardProps {
  module: ModuleProgress;
  onClick?: () => void;
}

export function ModuleCompletionCard({ module, onClick }: ModuleCompletionCardProps) {
  const completionPercentage = module.completion_percentage;
  const scoreColor =
    module.average_score >= 80
      ? 'text-green-500'
      : module.average_score >= 60
      ? 'text-yellow-500'
      : 'text-red-500';

  return (
    <DetectiveCard onClick={onClick} className="cursor-pointer hover:border-detective-orange">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-detective-bg-secondary rounded-lg">
            <BookOpen className="w-6 h-6 text-detective-orange" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-detective-text mb-1">{module.module_name}</h3>
            <p className="text-xs text-detective-text-secondary">ID: {module.module_id}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-detective-text-secondary">Completitud</span>
            <span className="text-sm font-bold text-detective-text">
              {completionPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-detective-bg-secondary rounded-full h-2">
            <div
              className="bg-gradient-to-r from-detective-orange to-detective-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-detective-bg-secondary p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-detective-gold" />
              <span className="text-xs text-detective-text-secondary">Score Promedio</span>
            </div>
            <p className={`text-xl font-bold ${scoreColor}`}>
              {module.average_score.toFixed(0)}%
            </p>
          </div>

          <div className="bg-detective-bg-secondary p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-detective-accent" />
              <span className="text-xs text-detective-text-secondary">Estudiantes</span>
            </div>
            <p className="text-xl font-bold text-detective-text">
              {module.students_completed}/{module.students_total}
            </p>
          </div>
        </div>

        {/* Time Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-detective-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-detective-text-secondary" />
            <span className="text-xs text-detective-text-secondary">Tiempo promedio</span>
          </div>
          <span className="text-sm font-semibold text-detective-text">
            {Math.floor(module.average_time_minutes / 60)}h {module.average_time_minutes % 60}m
          </span>
        </div>

        {/* Completion Badge */}
        {completionPercentage === 100 && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-2 text-center">
            <span className="text-sm font-semibold text-green-500">Módulo Completado</span>
          </div>
        )}
      </div>
    </DetectiveCard>
  );
}
