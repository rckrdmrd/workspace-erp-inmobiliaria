import React from 'react';
import { X, TrendingUp, Clock, Target, Award, Calendar } from 'lucide-react';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import type { StudentMonitoring } from '../../types';

interface StudentDetailModalProps {
  student: StudentMonitoring;
  onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-detective-bg border-2 border-detective-orange rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-detective-bg border-b border-detective-orange p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-detective-text">{student.full_name}</h2>
            <p className="text-detective-text-secondary">{student.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-detective-bg-secondary rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-detective-text" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-detective-orange" />
                <span className="text-sm text-detective-text-secondary">Progreso</span>
              </div>
              <p className="text-2xl font-bold text-detective-text">
                {student.progress_percentage.toFixed(0)}%
              </p>
            </div>

            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-detective-gold" />
                <span className="text-sm text-detective-text-secondary">Score Promedio</span>
              </div>
              <p className="text-2xl font-bold text-detective-text">
                {student.score_average.toFixed(0)}%
              </p>
            </div>

            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-detective-accent" />
                <span className="text-sm text-detective-text-secondary">Ejercicios</span>
              </div>
              <p className="text-2xl font-bold text-detective-text">
                {student.exercises_completed}/{student.exercises_total}
              </p>
            </div>

            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-detective-orange" />
                <span className="text-sm text-detective-text-secondary">Tiempo Total</span>
              </div>
              <p className="text-2xl font-bold text-detective-text">
                {Math.floor(student.time_spent_minutes / 60)}h {student.time_spent_minutes % 60}m
              </p>
            </div>
          </div>

          {/* Current Activity */}
          <div className="bg-detective-bg-secondary p-6 rounded-lg">
            <h3 className="text-lg font-bold text-detective-text mb-4">Actividad Actual</h3>
            {student.current_module ? (
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-detective-text-secondary">Módulo:</span>
                  <p className="text-detective-text font-semibold">{student.current_module}</p>
                </div>
                {student.current_exercise && (
                  <div>
                    <span className="text-sm text-detective-text-secondary">Ejercicio:</span>
                    <p className="text-detective-text font-semibold">{student.current_exercise}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <Calendar className="w-4 h-4 text-detective-text-secondary" />
                  <span className="text-sm text-detective-text-secondary">
                    Última actividad: {new Date(student.last_activity).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-detective-text-secondary">No hay actividad reciente</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <DetectiveButton variant="secondary">
              Enviar Mensaje
            </DetectiveButton>
            <DetectiveButton variant="secondary">
              Asignar Ejercicio
            </DetectiveButton>
            <DetectiveButton variant="secondary">
              Ver Historial Completo
            </DetectiveButton>
            <DetectiveButton variant="secondary">
              Marcar para Seguimiento
            </DetectiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
