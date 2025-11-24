import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { TrendingUp, Download, Users, Target, Clock, Award } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { ProgressChart } from './ProgressChart';
import { ModuleCompletionCard } from './ModuleCompletionCard';
import { useClassroomData } from '../../hooks/useClassroomData';

interface ClassProgressDashboardProps {
  classroomId: string;
}

export function ClassProgressDashboard({ classroomId }: ClassProgressDashboardProps) {
  const { data, moduleProgress, loading, error, refresh } = useClassroomData(classroomId);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'progress',
          classroom_id: classroomId,
          format,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress-report-${classroomId}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        a.click();
        toast.success(`Reporte exportado como ${format.toUpperCase()}`, {
          duration: 3000,
          icon: '📊',
        });
      } else {
        toast.error('Error al exportar el reporte. Por favor, intenta de nuevo.', {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar el reporte. Verifica tu conexión.', {
        duration: 4000,
      });
    }
  };

  // Identificar estudiantes rezagados (menos del 50% de progreso)
  const laggingStudentsCount = data ? Math.floor(data.student_count * 0.2) : 0;

  if (loading) {
    return (
      <DetectiveCard>
        <div className="text-center py-12">
          <p className="text-detective-text-secondary">Cargando datos de progreso...</p>
        </div>
      </DetectiveCard>
    );
  }

  if (error || !data) {
    return (
      <DetectiveCard>
        <div className="text-center py-8">
          <p className="text-red-500">Error al cargar datos: {error}</p>
          <DetectiveButton onClick={refresh} variant="secondary" className="mt-4">
            Reintentar
          </DetectiveButton>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-2xl font-bold text-detective-text">Progreso de Clase</h2>
            <p className="text-detective-text-secondary">
              Vista general del rendimiento del aula
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <DetectiveButton
            variant="secondary"

            onClick={() => handleExport('pdf')}
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </DetectiveButton>
          <DetectiveButton
            variant="secondary"

            onClick={() => handleExport('excel')}
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </DetectiveButton>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Completitud General</p>
              <p className="text-3xl font-bold text-detective-text">
                {data.average_completion.toFixed(0)}%
              </p>
            </div>
            <Target className="w-10 h-10 text-detective-orange" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Score Promedio</p>
              <p className="text-3xl font-bold text-detective-gold">
                {data.average_score.toFixed(0)}%
              </p>
            </div>
            <Award className="w-10 h-10 text-detective-gold" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Estudiantes Activos</p>
              <p className="text-3xl font-bold text-detective-text">
                {data.active_students}/{data.student_count}
              </p>
            </div>
            <Users className="w-10 h-10 text-detective-accent" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Ejercicios Completados</p>
              <p className="text-3xl font-bold text-detective-text">
                {data.completed_exercises}/{data.total_exercises}
              </p>
            </div>
            <Clock className="w-10 h-10 text-detective-orange" />
          </div>
        </DetectiveCard>
      </div>

      {/* Alerts for Lagging Students */}
      {laggingStudentsCount > 0 && (
        <DetectiveCard hoverable={false}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500 bg-opacity-10 rounded-lg">
              <Users className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-detective-text mb-1">
                Estudiantes Rezagados
              </h3>
              <p className="text-detective-text-secondary">
                Se identificaron aproximadamente {laggingStudentsCount} estudiante(s) con progreso
                menor al 50%. Considera intervenir para apoyarlos.
              </p>
            </div>
          </div>
        </DetectiveCard>
      )}

      {/* Module Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart
          title="Completitud por Módulo"
          data={moduleProgress.map((m) => ({
            label: m.module_name.substring(0, 20) + '...',
            value: m.completion_percentage,
          }))}
          type="bar"
        />

        <ProgressChart
          title="Score Promedio por Módulo"
          data={moduleProgress.map((m) => ({
            label: m.module_name.substring(0, 20) + '...',
            value: m.average_score,
            color: m.average_score >= 80 ? 'bg-green-500' : m.average_score >= 60 ? 'bg-yellow-500' : 'bg-red-500',
          }))}
          type="bar"
        />
      </div>

      {/* Time Chart */}
      <ProgressChart
        title="Tiempo Promedio por Módulo (minutos)"
        data={moduleProgress.map((m) => ({
          label: m.module_name.substring(0, 15) + '...',
          value: m.average_time_minutes,
        }))}
        type="line"
      />

      {/* Module Cards Grid */}
      <div>
        <h3 className="text-xl font-bold text-detective-text mb-4">Detalle por Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleProgress.map((module) => (
            <ModuleCompletionCard key={module.module_id} module={module} />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <DetectiveCard hoverable={false}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-detective-text">Resumen de Rendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <p className="text-sm text-detective-text-secondary mb-2">
                Tasa de Finalización
              </p>
              <p className="text-2xl font-bold text-detective-text">
                {((data.completed_exercises / data.total_exercises) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <p className="text-sm text-detective-text-secondary mb-2">
                Engagement Rate
              </p>
              <p className="text-2xl font-bold text-detective-text">
                {((data.active_students / data.student_count) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-detective-bg-secondary p-4 rounded-lg">
              <p className="text-sm text-detective-text-secondary mb-2">
                Módulos Promedio Completados
              </p>
              <p className="text-2xl font-bold text-detective-text">
                {(
                  moduleProgress.reduce((sum, m) => sum + (m.completion_percentage === 100 ? 1 : 0), 0) /
                  data.student_count
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </DetectiveCard>
    </div>
  );
}
