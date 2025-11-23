import React from 'react';
import { Calendar, Users, Target, Clock, MoreVertical } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { Assignment } from '../../types';

interface AssignmentListProps {
  assignments: Assignment[];
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignmentId: string) => void;
}

export function AssignmentList({ assignments, onEdit, onDelete }: AssignmentListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'expired':
        return 'bg-red-500';
      case 'draft':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Completada';
      case 'expired':
        return 'Expirada';
      case 'draft':
        return 'Borrador';
      default:
        return status;
    }
  };

  if (assignments.length === 0) {
    return (
      <DetectiveCard>
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
          <p className="text-detective-text-secondary">No hay asignaciones creadas</p>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <DetectiveCard key={assignment.id} hoverable={false}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-detective-text mb-1">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-detective-text-secondary">
                    {assignment.module_name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {getStatusText(assignment.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-detective-orange" />
                  <div>
                    <p className="text-xs text-detective-text-secondary">Fecha límite</p>
                    <p className="text-sm font-semibold text-detective-text">
                      {new Date(assignment.end_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-detective-gold" />
                  <div>
                    <p className="text-xs text-detective-text-secondary">Estudiantes</p>
                    <p className="text-sm font-semibold text-detective-text">
                      {assignment.assigned_to.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-detective-accent" />
                  <div>
                    <p className="text-xs text-detective-text-secondary">Ejercicios</p>
                    <p className="text-sm font-semibold text-detective-text">
                      {assignment.exercise_ids.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-detective-orange" />
                  <div>
                    <p className="text-xs text-detective-text-secondary">Intentos</p>
                    <p className="text-sm font-semibold text-detective-text">
                      {assignment.max_attempts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-detective-text-secondary">
                <span>
                  Creada: {new Date(assignment.created_at).toLocaleDateString('es-ES')}
                </span>
                {assignment.allow_powerups && (
                  <span className="px-2 py-1 bg-detective-bg-secondary rounded">
                    Power-ups permitidos
                  </span>
                )}
                {assignment.custom_points && (
                  <span className="px-2 py-1 bg-detective-bg-secondary rounded">
                    {assignment.custom_points} puntos
                  </span>
                )}
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="ml-4">
                <button className="p-2 hover:bg-detective-bg-secondary rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-detective-text-secondary" />
                </button>
              </div>
            )}
          </div>
        </DetectiveCard>
      ))}
    </div>
  );
}
