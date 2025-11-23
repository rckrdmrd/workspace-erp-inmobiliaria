import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, Filter, RefreshCw, Bell } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { AlertCard } from './AlertCard';
import type { InterventionAlert, AlertPriority, AlertType } from '../../types';

interface InterventionAlertsPanelProps {
  classroomId: string;
  filterPriority?: AlertPriority | 'all';
  filterType?: AlertType | 'all';
}

export function InterventionAlertsPanel({
  classroomId,
  filterPriority: externalPriorityFilter,
  filterType: externalTypeFilter,
}: InterventionAlertsPanelProps) {
  const [alerts, setAlerts] = useState<InterventionAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<InterventionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');

  useEffect(() => {
    fetchAlerts();
  }, [classroomId]);

  useEffect(() => {
    if (externalPriorityFilter) {
      setPriorityFilter(externalPriorityFilter);
    }
    if (externalTypeFilter) {
      setTypeFilter(externalTypeFilter);
    }
  }, [externalPriorityFilter, externalTypeFilter]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, showResolved, priorityFilter, typeFilter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/classroom/alerts/${classroomId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching alerts:', err);

      // Mock data para desarrollo
      setAlerts([
        {
          id: 'alert1',
          student_id: 's1',
          student_name: 'Ana García',
          type: 'no_activity',
          priority: 'critical',
          message: 'Sin actividad por más de 7 días',
          details: {
            days_inactive: 10,
          },
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          resolved: false,
        },
        {
          id: 'alert2',
          student_id: 's2',
          student_name: 'Carlos Ruiz',
          type: 'low_score',
          priority: 'high',
          message: 'Promedio por debajo del 60% en módulo',
          details: {
            average_score: 45,
            module_name: 'Descubrimientos Científicos',
          },
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          resolved: false,
        },
        {
          id: 'alert3',
          student_id: 's3',
          student_name: 'María López',
          type: 'declining_trend',
          priority: 'medium',
          message: 'Tendencia decreciente en rendimiento',
          details: {
            average_score: 65,
            module_name: 'Los Primeros Pasos de Marie Curie',
          },
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          resolved: false,
        },
        {
          id: 'alert4',
          student_id: 's4',
          student_name: 'Juan Martínez',
          type: 'repeated_failures',
          priority: 'high',
          message: 'Múltiples intentos fallidos en ejercicio específico',
          details: {
            failure_count: 5,
            exercise_name: 'Crucigrama: Elementos químicos',
            module_name: 'Descubrimientos Científicos',
          },
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          resolved: false,
        },
        {
          id: 'alert5',
          student_id: 's5',
          student_name: 'Laura Sánchez',
          type: 'no_activity',
          priority: 'high',
          message: 'Sin actividad por más de 7 días',
          details: {
            days_inactive: 8,
          },
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          resolved: true,
          actions_taken: ['Mensaje enviado', 'Reunión programada', 'Material adicional asignado'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (!showResolved) {
      filtered = filtered.filter((alert) => !alert.resolved);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.type === typeFilter);
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setFilteredAlerts(filtered);
  };

  const handleSendMessage = async (alertId: string) => {
    console.log('Send message for alert:', alertId);
    toast('Funcionalidad de envío de mensaje pendiente de integración', {
      duration: 3000,
      icon: '✉️',
    });
  };

  const handleAssignHelp = async (alertId: string) => {
    console.log('Assign help for alert:', alertId);
    toast('Funcionalidad de asignación de ayuda pendiente de integración', {
      duration: 3000,
      icon: '🤝',
    });
  };

  const handleMarkForFollowUp = async (alertId: string) => {
    console.log('Mark for follow-up:', alertId);
    toast('Funcionalidad de seguimiento pendiente de integración', {
      duration: 3000,
      icon: '📋',
    });
  };

  const handleResolve = async (alertId: string) => {
    try {
      // Actualizar en backend
      await fetch(`/api/classroom/alerts/${alertId}/resolve`, {
        method: 'POST',
      });

      // Actualizar estado local
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert))
      );
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter((a) => !a.resolved && a.priority === 'critical').length;
  const highCount = alerts.filter((a) => !a.resolved && a.priority === 'high').length;

  if (loading) {
    return (
      <DetectiveCard>
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-detective-orange animate-spin mx-auto mb-4" />
          <p className="text-detective-text-secondary">Cargando alertas...</p>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-2xl font-bold text-detective-text">Alertas de Intervención</h2>
            <p className="text-detective-text-secondary">
              Monitoreo automático de estudiantes que requieren atención
            </p>
          </div>
        </div>
        <DetectiveButton onClick={fetchAlerts} variant="secondary">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </DetectiveButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-detective-text">{unresolvedCount}</p>
              <p className="text-sm text-detective-text-secondary">Alertas Pendientes</p>
            </div>
            <Bell className="w-8 h-8 text-detective-orange" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
              <p className="text-sm text-detective-text-secondary">Críticas</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-500">{highCount}</p>
              <p className="text-sm text-detective-text-secondary">Alta Prioridad</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-500">
                {alerts.filter((a) => a.resolved).length}
              </p>
              <p className="text-sm text-detective-text-secondary">Resueltas</p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Filters */}
      <DetectiveCard>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <DetectiveButton
              variant={priorityFilter === 'all' ? 'primary' : 'secondary'}

              onClick={() => setPriorityFilter('all')}
            >
              Todas
            </DetectiveButton>
            <DetectiveButton
              variant={priorityFilter === 'critical' ? 'primary' : 'secondary'}

              onClick={() => setPriorityFilter('critical')}
            >
              Críticas
            </DetectiveButton>
            <DetectiveButton
              variant={priorityFilter === 'high' ? 'primary' : 'secondary'}

              onClick={() => setPriorityFilter('high')}
            >
              Altas
            </DetectiveButton>
            <DetectiveButton
              variant={priorityFilter === 'medium' ? 'primary' : 'secondary'}

              onClick={() => setPriorityFilter('medium')}
            >
              Medias
            </DetectiveButton>
          </div>
          <label className="flex items-center gap-2 text-sm text-detective-text">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
            />
            Mostrar resueltas
          </label>
        </div>
      </DetectiveCard>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <DetectiveCard>
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
            <p className="text-detective-text-secondary">
              {showResolved
                ? 'No hay alertas con los filtros seleccionados'
                : 'No hay alertas pendientes. ¡Excelente trabajo!'}
            </p>
          </div>
        </DetectiveCard>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSendMessage={handleSendMessage}
              onAssignHelp={handleAssignHelp}
              onMarkForFollowUp={handleMarkForFollowUp}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
}
