/**
 * ActivityNavigation Component
 *
 * ISSUE: #5.2 (P0) - Activity Navigation
 * FECHA: 2025-11-04
 * SPRINT: Sprint 3
 *
 * Navegación entre ejercicios/actividades de un módulo
 *
 * Features:
 * - Botones Previous / Next
 * - Progress bar del módulo
 * - Preview del siguiente ejercicio
 * - Indicadores de completación
 * - Breadcrumb navigation
 * - Keyboard shortcuts (arrow keys)
 */

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Check, Lock, Play } from 'lucide-react';

interface Activity {
  id: string;
  type: 'lesson' | 'exercise' | 'assessment';
  title: string;
  order: number;
  is_completed: boolean;
  is_locked: boolean;
  xp_reward?: number;
  estimated_minutes?: number;
}

interface ActivityNavigationProps {
  moduleTitle: string;
  activities: Activity[];
  currentActivityId: string;
  onNavigate: (activityId: string) => void;
  onBackToModule: () => void;
  showProgress?: boolean;
  enableKeyboardNav?: boolean;
}

const ACTIVITY_ICONS = {
  lesson: '📚',
  exercise: '📝',
  assessment: '📊',
};

const ACTIVITY_LABELS = {
  lesson: 'Lección',
  exercise: 'Ejercicio',
  assessment: 'Evaluación',
};

export const ActivityNavigation: React.FC<ActivityNavigationProps> = ({
  moduleTitle,
  activities,
  currentActivityId,
  onNavigate,
  onBackToModule,
  showProgress = true,
  enableKeyboardNav = true,
}) => {
  // Find current activity index
  const currentIndex = activities.findIndex((a) => a.id === currentActivityId);
  const currentActivity = activities[currentIndex];
  const previousActivity = currentIndex > 0 ? activities[currentIndex - 1] : null;
  const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1] : null;

  // Calculate progress
  const completedCount = activities.filter((a) => a.is_completed).length;
  const progressPercentage = Math.round((completedCount / activities.length) * 100);

  // Handle keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Left arrow or 'p' for previous
      if ((e.key === 'ArrowLeft' || e.key === 'p') && previousActivity && !previousActivity.is_locked) {
        e.preventDefault();
        onNavigate(previousActivity.id);
      }

      // Right arrow or 'n' for next
      if ((e.key === 'ArrowRight' || e.key === 'n') && nextActivity && !nextActivity.is_locked) {
        e.preventDefault();
        onNavigate(nextActivity.id);
      }

      // 'h' for home/back to module
      if (e.key === 'h' || e.key === 'Escape') {
        e.preventDefault();
        onBackToModule();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentActivityId, activities, previousActivity, nextActivity, onNavigate, onBackToModule, enableKeyboardNav]);

  return (
    <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center text-sm">
          <button
            onClick={onBackToModule}
            className="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            {moduleTitle}
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">
            {ACTIVITY_ICONS[currentActivity?.type || 'exercise']} {currentActivity?.title || 'Actividad'}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="px-6 py-2 bg-purple-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-purple-900">
              Progreso del módulo
            </span>
            <span className="text-xs font-semibold text-purple-900">
              {completedCount}/{activities.length} actividades ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Previous button */}
          <button
            onClick={() => previousActivity && onNavigate(previousActivity.id)}
            disabled={!previousActivity || previousActivity.is_locked}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
              ${
                previousActivity && !previousActivity.is_locked
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Current activity indicator */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">{ACTIVITY_ICONS[currentActivity?.type || 'exercise']}</span>
              <div className="text-left">
                <div className="text-xs text-purple-700 font-medium">
                  {ACTIVITY_LABELS[currentActivity?.type || 'exercise']} {currentIndex + 1}/{activities.length}
                </div>
                <div className="text-sm font-bold text-purple-900 max-w-[200px] md:max-w-none truncate">
                  {currentActivity?.title}
                </div>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={() => nextActivity && onNavigate(nextActivity.id)}
            disabled={!nextActivity || nextActivity.is_locked}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
              ${
                nextActivity && !nextActivity.is_locked
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Activity list (desktop) */}
      <div className="hidden lg:block px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 overflow-x-auto">
          {activities.map((activity, index) => {
            const isCurrent = activity.id === currentActivityId;
            const isAccessible = !activity.is_locked;

            return (
              <button
                key={activity.id}
                onClick={() => isAccessible && onNavigate(activity.id)}
                disabled={!isAccessible}
                className={`
                  relative flex-shrink-0 w-10 h-10 rounded-lg border-2 transition-all
                  flex items-center justify-center text-sm font-bold
                  ${
                    isCurrent
                      ? 'bg-purple-600 border-purple-700 text-white ring-2 ring-purple-300'
                      : activity.is_completed
                      ? 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100'
                      : isAccessible
                      ? 'bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                title={`${activity.title} - ${ACTIVITY_LABELS[activity.type]}`}
              >
                {activity.is_completed ? (
                  <Check className="w-5 h-5" />
                ) : activity.is_locked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  index + 1
                )}

                {/* Current indicator */}
                {isCurrent && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next activity preview */}
      {nextActivity && !nextActivity.is_locked && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs text-blue-700 font-semibold">Siguiente actividad:</div>
                <div className="text-sm font-bold text-blue-900">{nextActivity.title}</div>
              </div>
            </div>
            {nextActivity.estimated_minutes && (
              <div className="text-xs text-blue-700">
                ~{nextActivity.estimated_minutes} min
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {enableKeyboardNav && (
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">←</kbd>
              Anterior
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">→</kbd>
              Siguiente
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">Esc</kbd>
              Volver al módulo
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
