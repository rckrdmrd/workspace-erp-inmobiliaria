import { useState, useEffect } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { FormField } from '@shared/components/common/FormField';
import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useClassrooms } from '../hooks/useClassrooms';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TeacherAnalytics() {
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'engagement'>('overview');
  const [dateRange, setDateRange] = useState({ start: '2025-10-01', end: '2025-10-16' });

  // Use custom hooks
  const { classrooms, loading: classroomsLoading } = useClassrooms();
  const {
    analytics,
    engagement,
    loading: analyticsLoading,
    error: analyticsError,
    generateReport,
    refresh,
  } = useAnalytics(
    selectedClassroomId
      ? {
          classroom_id: selectedClassroomId,
          start_date: dateRange.start,
          end_date: dateRange.end,
        }
      : undefined,
    selectedClassroomId
      ? {
          classroom_id: selectedClassroomId,
          start_date: dateRange.start,
          end_date: dateRange.end,
          period: 'daily',
        }
      : undefined
  );

  // Auto-select first classroom when loaded
  useEffect(() => {
    if (!selectedClassroomId && classrooms.length > 0) {
      setSelectedClassroomId(classrooms[0].id);
    }
  }, [classrooms, selectedClassroomId]);

  // Combined loading and error states
  const loading = classroomsLoading || analyticsLoading;
  const error = analyticsError;

  const moduleScoresChart = {
    labels: analytics?.module_stats.map((m) => m.module_name) || [],
    datasets: [
      {
        label: 'Promedio de Puntuación',
        data: analytics?.module_stats.map((m) => m.average_score) || [],
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      },
    ],
  };

  const completionRateChart = {
    labels: analytics?.module_stats.map((m) => m.module_name) || [],
    datasets: [
      {
        label: 'Tasa de Completitud (%)',
        data: analytics?.module_stats.map((m) => m.completion_rate) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  const exportToCSV = async () => {
    if (!selectedClassroomId) {
      alert('Por favor selecciona una clase primero');
      return;
    }

    try {
      const report = await generateReport({
        type: 'custom',
        title: `Analytics Report - ${selectedClassroomId}`,
        classroom_id: selectedClassroomId,
        start_date: dateRange.start,
        end_date: dateRange.end,
        format: 'csv',
        include_charts: true,
        include_recommendations: true,
      });

      if (report.status === 'completed' && report.file_url) {
        // Open download link in new tab
        window.open(report.file_url, '_blank');
      } else {
        alert('El reporte está siendo generado. Por favor intenta nuevamente en unos momentos.');
      }
    } catch (err: any) {
      console.error('[TeacherAnalytics] Error exporting CSV:', err);
      alert('Error al generar el reporte. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <main className="detective-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-detective-text mb-2">Analíticas</h1>
          <p className="text-detective-text-secondary">
            Visualiza el rendimiento y engagement de tus estudiantes
          </p>
        </div>

        {/* Filters */}
        <DetectiveCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Clase"
              name="classroom"
              type="select"
              value={selectedClassroomId}
              onChange={(e) => setSelectedClassroomId(e.target.value)}
              options={classrooms.map((c) => ({ value: c.id, label: c.name }))}
            />
            <FormField
              label="Fecha Inicio"
              name="startDate"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <FormField
              label="Fecha Fin"
              name="endDate"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <DetectiveButton variant="primary" onClick={exportToCSV} disabled={!selectedClassroomId}>
              <Download className="w-4 h-4" />
              Exportar a CSV
            </DetectiveButton>
            {!loading && selectedClassroomId && (
              <DetectiveButton variant="secondary" onClick={refresh}>
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </DetectiveButton>
            )}
          </div>
        </DetectiveCard>

        {/* Error Message */}
        {error && (
          <DetectiveCard variant="danger" className="mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-detective-text mb-2">
                  Error al cargar analíticas
                </h3>
                <p className="text-detective-text-secondary mb-4">
                  No se pudieron cargar los datos de analíticas. Por favor, intenta nuevamente.
                </p>
                <p className="text-sm text-red-400 mb-4 font-mono bg-red-950 p-2 rounded">
                  {error.message}
                </p>
                <DetectiveButton onClick={refresh} variant="primary">
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </DetectiveButton>
              </div>
            </div>
          </DetectiveCard>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-detective-orange animate-spin mb-4" />
            <p className="text-detective-text-secondary">Cargando analíticas...</p>
          </div>
        )}

        {/* Tab Switcher */}
        {!loading && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-detective-orange text-white'
                  : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Vista General
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'performance'
                  ? 'bg-detective-orange text-white'
                  : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Rendimiento
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'engagement'
                  ? 'bg-detective-orange text-white'
                  : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Engagement
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Puntuación Promedio</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {analytics.average_score.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </DetectiveCard>
              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tasa de Completitud</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {analytics.completion_rate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </DetectiveCard>
              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tasa de Engagement</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {analytics.engagement_rate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </DetectiveCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetectiveCard>
                <h3 className="text-lg font-bold text-detective-text mb-4">
                  Puntuación Promedio por Módulo
                </h3>
                <div className="h-80">
                  <Bar data={moduleScoresChart} options={chartOptions} />
                </div>
              </DetectiveCard>
              <DetectiveCard>
                <h3 className="text-lg font-bold text-detective-text mb-4">
                  Tasa de Completitud por Módulo
                </h3>
                <div className="h-80">
                  <Bar data={completionRateChart} options={chartOptions} />
                </div>
              </DetectiveCard>
            </div>
          </div>
        )}

        {!loading && activeTab === 'performance' && analytics && (
          <div className="space-y-6">
            <DetectiveCard>
              <h3 className="text-lg font-bold text-detective-text mb-4">
                Rendimiento por Estudiante
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Estudiante
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Puntuación Promedio
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Completitud
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Última Actividad
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.student_performance.map((student) => (
                      <tr
                        key={student.student_id}
                        className="border-b border-gray-800 hover:bg-detective-bg-secondary transition-colors"
                      >
                        <td className="px-4 py-3 text-detective-text font-medium">
                          {student.student_name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-bold ${
                              student.average_score >= 80
                                ? 'text-green-500'
                                : student.average_score >= 60
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                          >
                            {student.average_score}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-detective-text">
                          {student.completion_rate}%
                        </td>
                        <td className="px-4 py-3 text-detective-text">
                          {new Date(student.last_active).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              student.average_score >= 80
                                ? 'bg-green-500/20 text-green-500'
                                : student.average_score >= 60
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {student.average_score >= 80 ? 'Excelente' : student.average_score >= 60 ? 'Regular' : 'Bajo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DetectiveCard>
          </div>
        )}

        {!loading && activeTab === 'engagement' && engagement && (
          <div className="space-y-6">
            {/* Main Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Usuarios Activos Diarios</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {engagement.dau}
                    </p>
                  </div>
                </div>
              </DetectiveCard>

              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Usuarios Activos Semanales</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {engagement.wau}
                    </p>
                  </div>
                </div>
              </DetectiveCard>

              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Duración Promedio (min)</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {engagement.session_duration_avg.toFixed(0)}
                    </p>
                  </div>
                </div>
              </DetectiveCard>

              <DetectiveCard>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Sesiones por Usuario</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {engagement.sessions_per_user.toFixed(1)}
                    </p>
                  </div>
                </div>
              </DetectiveCard>
            </div>

            {/* Comparison with Previous Period */}
            <DetectiveCard>
              <h3 className="text-lg font-bold text-detective-text mb-4">
                Comparación con Período Anterior
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  {engagement.comparison_previous_period.dau_change >= 0 ? (
                    <ArrowUp className="w-6 h-6 text-green-500" />
                  ) : (
                    <ArrowDown className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Cambio en DAU</p>
                    <p className={`text-2xl font-bold ${
                      engagement.comparison_previous_period.dau_change >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {engagement.comparison_previous_period.dau_change >= 0 ? '+' : ''}
                      {engagement.comparison_previous_period.dau_change.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {engagement.comparison_previous_period.wau_change >= 0 ? (
                    <ArrowUp className="w-6 h-6 text-green-500" />
                  ) : (
                    <ArrowDown className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Cambio en WAU</p>
                    <p className={`text-2xl font-bold ${
                      engagement.comparison_previous_period.wau_change >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {engagement.comparison_previous_period.wau_change >= 0 ? '+' : ''}
                      {engagement.comparison_previous_period.wau_change.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {engagement.comparison_previous_period.engagement_change >= 0 ? (
                    <ArrowUp className="w-6 h-6 text-green-500" />
                  ) : (
                    <ArrowDown className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Cambio en Engagement</p>
                    <p className={`text-2xl font-bold ${
                      engagement.comparison_previous_period.engagement_change >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {engagement.comparison_previous_period.engagement_change >= 0 ? '+' : ''}
                      {engagement.comparison_previous_period.engagement_change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </DetectiveCard>

            {/* Feature Usage */}
            {engagement.feature_usage && engagement.feature_usage.length > 0 && (
              <DetectiveCard>
                <h3 className="text-lg font-bold text-detective-text mb-4">
                  Uso de Funcionalidades
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Funcionalidad
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Usos Totales
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Usuarios Únicos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {engagement.feature_usage.map((feature, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-800 hover:bg-detective-bg-secondary transition-colors"
                        >
                          <td className="px-4 py-3 text-detective-text font-medium">
                            {feature.feature_name}
                          </td>
                          <td className="px-4 py-3 text-detective-text">
                            {feature.usage_count}
                          </td>
                          <td className="px-4 py-3 text-detective-text">
                            {feature.unique_users}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DetectiveCard>
            )}
          </div>
        )}

        {/* Empty State for Engagement Tab */}
        {!loading && activeTab === 'engagement' && !engagement && (
          <DetectiveCard>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-detective-text mb-2">
                No hay datos de engagement disponibles
              </h3>
              <p className="text-detective-text-secondary">
                Selecciona una clase y un rango de fechas para ver las métricas de engagement
              </p>
            </div>
          </DetectiveCard>
        )}
      </main>
    </div>
  );
}
