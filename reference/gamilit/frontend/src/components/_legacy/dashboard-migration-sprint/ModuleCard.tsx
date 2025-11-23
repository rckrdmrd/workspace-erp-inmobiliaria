/**
 * ModuleCard Component
 *
 * Tarjeta individual de módulo educativo con progreso
 */

import { Lock, CheckCircle, PlayCircle, Clock } from 'lucide-react';
import type { Module } from '@/shared/types/educational.types';
import type { ModuleProgress } from '@/shared/types/progress.types';

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;
  onClick: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  very_easy: 'bg-green-100 text-green-800',
  easy: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-orange-100 text-orange-800',
  very_hard: 'bg-red-100 text-red-800'
};

const DIFFICULTY_LABELS: Record<string, string> = {
  very_easy: 'Muy Fácil',
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
  very_hard: 'Muy Difícil'
};

export const ModuleCard = ({ module, progress, onClick }: ModuleCardProps) => {
  // Calculate if module is locked based on progress status
  const isLocked = progress?.status === 'locked' || progress?.status === 'not_started';
  const isCompleted = progress?.status === 'completed' || progress?.status === 'mastered';
  const isInProgress = progress?.status === 'in_progress';
  const progressPercentage = progress?.progress_percentage || 0;

  const handleClick = () => {
    if (!isLocked) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative bg-white rounded-xl border-2 transition-all duration-300
        ${isLocked
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-gray-200 hover:border-purple-400 hover:shadow-lg cursor-pointer'
        }
        ${isCompleted ? 'border-green-400' : ''}
        ${isInProgress ? 'border-purple-400' : ''}
      `}
    >
      {/* Icon y Badge de dificultad */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center text-2xl
            ${module.color || 'bg-purple-100'}
          `}>
            {module.icon || '📚'}
          </div>

          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${module.difficulty ? DIFFICULTY_COLORS[module.difficulty] ?? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'}
          `}>
            {module.difficulty ? DIFFICULTY_LABELS[module.difficulty] ?? module.difficulty : 'N/A'}
          </span>
        </div>

        {/* Título y descripción */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {module.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {module.description}
        </p>

        {/* Estadísticas */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {Math.ceil((module.estimated_duration_minutes || module.estimated_time_minutes) / 60)}h
          </span>
          <span>{module.total_exercises} ejercicios</span>
        </div>

        {/* Barra de progreso */}
        {progress && !isLocked && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progreso</span>
              <span className="font-semibold text-purple-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-green-500' : 'bg-purple-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Recompensas ganadas */}
        {progress && (progress.total_xp_earned > 0 || progress.total_ml_coins_earned > 0) && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            {progress.total_xp_earned > 0 && (
              <span className="text-purple-600 font-semibold">
                +{progress.total_xp_earned} XP
              </span>
            )}
            {progress.total_ml_coins_earned > 0 && (
              <span className="text-yellow-600 font-semibold">
                +{progress.total_ml_coins_earned} ML Coins
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer con estado */}
      <div className={`
        px-6 py-3 border-t flex items-center justify-between
        ${isLocked ? 'bg-gray-50' : isCompleted ? 'bg-green-50' : isInProgress ? 'bg-purple-50' : 'bg-gray-50'}
      `}>
        {isLocked && (
          <div className="flex items-center text-gray-500 text-sm">
            <Lock className="w-4 h-4 mr-2" />
            Bloqueado
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center text-green-600 text-sm font-semibold">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completado
          </div>
        )}
        {isInProgress && !isCompleted && (
          <div className="flex items-center text-purple-600 text-sm font-semibold">
            <PlayCircle className="w-4 h-4 mr-2" />
            Continuar
          </div>
        )}
        {!isLocked && !isCompleted && !isInProgress && (
          <div className="flex items-center text-gray-600 text-sm font-semibold">
            <PlayCircle className="w-4 h-4 mr-2" />
            Comenzar
          </div>
        )}

        {progress && (
          <span className="text-xs text-gray-500">
            {progress.completed_exercises}/{module.total_exercises} ejercicios
          </span>
        )}
      </div>

      {/* Indicator de prerequisitos */}
      {isLocked && module.prerequisites && module.prerequisites.length > 0 && (
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
            Requiere completar módulo anterior
          </div>
        </div>
      )}
    </div>
  );
};
