import React from 'react';
import { AlertTriangle, AlertCircle, Info, XCircle, MessageSquare, BookOpen, CheckCircle } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import type { InterventionAlert } from '../../types';

interface AlertCardProps {
  alert: InterventionAlert;
  onSendMessage?: (alertId: string) => void;
  onAssignHelp?: (alertId: string) => void;
  onMarkForFollowUp?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
}

export function AlertCard({
  alert,
  onSendMessage,
  onAssignHelp,
  onMarkForFollowUp,
  onResolve,
}: AlertCardProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500 bg-opacity-10',
          borderColor: 'border-red-500',
          badge: 'bg-red-500',
          text: 'CRÍTICO',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500 bg-opacity-10',
          borderColor: 'border-orange-500',
          badge: 'bg-orange-500',
          text: 'ALTO',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500 bg-opacity-10',
          borderColor: 'border-yellow-500',
          badge: 'bg-yellow-500',
          text: 'MEDIO',
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500 bg-opacity-10',
          borderColor: 'border-blue-500',
          badge: 'bg-blue-500',
          text: 'BAJO',
        };
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'no_activity':
        return '🚨';
      case 'low_score':
        return '⚠️';
      case 'declining_trend':
        return '📉';
      case 'repeated_failures':
        return '🎯';
      default:
        return '⚠️';
    }
  };

  const config = getPriorityConfig(alert.priority);
  const Icon = config.icon;

  const getTimeSince = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
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
    <DetectiveCard hoverable={false} className={`border-l-4 ${config.borderColor}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getAlertIcon(alert.type)}</span>
                <h3 className="font-bold text-detective-text">{alert.student_name}</h3>
              </div>
              <p className="text-sm text-detective-text">{alert.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${config.badge}`}>
              {config.text}
            </span>
            {alert.resolved && (
              <span className="px-2 py-1 rounded text-xs font-bold text-white bg-green-500">
                RESUELTO
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className={`p-3 rounded-lg ${config.bgColor}`}>
          <div className="space-y-2 text-sm text-detective-text">
            {alert.details.days_inactive !== undefined && (
              <p>
                <strong>Días sin actividad:</strong> {alert.details.days_inactive}
              </p>
            )}
            {alert.details.average_score !== undefined && (
              <p>
                <strong>Promedio actual:</strong> {alert.details.average_score.toFixed(0)}%
              </p>
            )}
            {alert.details.module_name && (
              <p>
                <strong>Módulo:</strong> {alert.details.module_name}
              </p>
            )}
            {alert.details.exercise_name && (
              <p>
                <strong>Ejercicio:</strong> {alert.details.exercise_name}
              </p>
            )}
            {alert.details.failure_count !== undefined && (
              <p>
                <strong>Intentos fallidos:</strong> {alert.details.failure_count}
              </p>
            )}
          </div>
        </div>

        {/* Actions Taken */}
        {alert.actions_taken && alert.actions_taken.length > 0 && (
          <div className="bg-detective-bg-secondary p-3 rounded-lg">
            <p className="text-xs text-detective-text-secondary mb-2">Acciones tomadas:</p>
            <ul className="space-y-1">
              {alert.actions_taken.map((action, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-detective-text">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        {!alert.resolved && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-detective-border">
            <DetectiveButton
              variant="secondary"

              onClick={() => onSendMessage?.(alert.id)}
            >
              <MessageSquare className="w-4 h-4" />
              Enviar Mensaje
            </DetectiveButton>
            <DetectiveButton
              variant="secondary"

              onClick={() => onAssignHelp?.(alert.id)}
            >
              <BookOpen className="w-4 h-4" />
              Asignar Ayuda
            </DetectiveButton>
            <DetectiveButton
              variant="secondary"

              onClick={() => onMarkForFollowUp?.(alert.id)}
            >
              Marcar Seguimiento
            </DetectiveButton>
            <DetectiveButton
              variant="primary"

              onClick={() => onResolve?.(alert.id)}
            >
              <CheckCircle className="w-4 h-4" />
              Resolver
            </DetectiveButton>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-detective-text-secondary">
          <span>{getTimeSince(alert.created_at)}</span>
          <span>ID: {alert.id.substring(0, 8)}</span>
        </div>
      </div>
    </DetectiveCard>
  );
}
