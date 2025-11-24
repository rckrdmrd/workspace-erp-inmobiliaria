import { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  Users,
  TrendingUp,
  Calendar,
  AlertTriangle,
  BarChart3,
  FileText,
  MessageSquare,
  Share2,
  Target,
  Award,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// Import components
import { StudentMonitoringPanel } from '../components/monitoring/StudentMonitoringPanel';
import { AssignmentCreator } from '../components/assignments/AssignmentCreator';
import { ClassProgressDashboard } from '../components/progress/ClassProgressDashboard';
import { InterventionAlertsPanel } from '../components/alerts/InterventionAlertsPanel';
import { LearningAnalyticsDashboard } from '../components/analytics/LearningAnalyticsDashboard';
import { PerformanceInsightsPanel } from '../components/analytics/PerformanceInsightsPanel';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { ParentCommunicationHub } from '../components/collaboration/ParentCommunicationHub';
import { ResourceSharingPanel } from '../components/collaboration/ResourceSharingPanel';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';

type TabType =
  | 'overview'
  | 'monitoring'
  | 'assignments'
  | 'progress'
  | 'alerts'
  | 'analytics'
  | 'insights'
  | 'reports'
  | 'communication'
  | 'resources';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Use real data from backend via useTeacherDashboard hook
  const {
    stats,
    activities,
    alerts,
    loading,
    error,
    refresh,
  } = useTeacherDashboard();

  const classroomId = 'classroom-1'; // Mock ID - TODO: get from selected classroom

  // Mock students data - TODO: replace with real data from useClassrooms hook
  const mockStudents = [
    { id: 's1', full_name: 'Ana García' },
    { id: 's2', full_name: 'Carlos Ruiz' },
    { id: 's3', full_name: 'María López' },
    { id: 's4', full_name: 'Juan Martínez' },
    { id: 's5', full_name: 'Laura Sánchez' },
  ];

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: Target },
    { id: 'monitoring', label: 'Monitoreo', icon: Users },
    { id: 'assignments', label: 'Asignaciones', icon: Calendar },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Award },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'communication', label: 'Comunicación', icon: MessageSquare },
    { id: 'resources', label: 'Recursos', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <main className="detective-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-detective-text mb-2">
                Dashboard del Profesor
              </h1>
              <p className="text-detective-text-secondary">
                Gestiona tu aula, monitorea estudiantes y genera analíticas avanzadas
              </p>
            </div>
            {!loading && !error && (
              <DetectiveButton
                onClick={refresh}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </DetectiveButton>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-detective-orange animate-spin mb-4" />
            <p className="text-detective-text-secondary">Cargando datos del dashboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <DetectiveCard variant="danger">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-detective-text mb-2">
                  Error al cargar datos
                </h3>
                <p className="text-detective-text-secondary mb-4">
                  No se pudieron cargar los datos del dashboard. Por favor, intenta nuevamente.
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

        {/* Main Content - only show when data is loaded */}
        {!loading && !error && (
          <>
            {/* Navigation Tabs */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-detective-orange text-white shadow-lg'
                          : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Estudiantes</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {stats?.active_students ?? 0}/{stats?.total_students ?? 0}
                    </p>
                    <p className="text-xs text-detective-text-secondary mt-1">Activos hoy</p>
                  </div>
                  <Users className="w-10 h-10 text-detective-orange" />
                </div>
              </DetectiveCard>

              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Score Promedio</p>
                    <p className="text-3xl font-bold text-detective-gold">
                      {stats?.average_class_score?.toFixed(1) ?? '0.0'}%
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      {stats?.engagement_rate ? `${stats.engagement_rate.toFixed(1)}% engagement` : 'N/A'}
                    </p>
                  </div>
                  <Award className="w-10 h-10 text-detective-gold" />
                </div>
              </DetectiveCard>

              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Tasa de Completitud</p>
                    <p className="text-3xl font-bold text-detective-text">
                      {stats?.completion_rate?.toFixed(0) ?? '0'}%
                    </p>
                    <p className="text-xs text-detective-text-secondary mt-1">De ejercicios</p>
                  </div>
                  <Target className="w-10 h-10 text-detective-accent" />
                </div>
              </DetectiveCard>

              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-detective-text-secondary mb-1">Alertas Pendientes</p>
                    <p className="text-3xl font-bold text-red-500">
                      {alerts?.length ?? stats?.pending_alerts ?? 0}
                    </p>
                    <p className="text-xs text-detective-text-secondary mt-1">Requieren atención</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </DetectiveCard>
            </div>

            {/* Quick Actions */}
            <DetectiveCard>
              <h3 className="text-xl font-bold text-detective-text mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetectiveButton onClick={() => setActiveTab('monitoring')} variant="secondary">
                  <Users className="w-5 h-5" />
                  Ver Estudiantes
                </DetectiveButton>
                <DetectiveButton onClick={() => setActiveTab('assignments')} variant="secondary">
                  <Calendar className="w-5 h-5" />
                  Nueva Asignación
                </DetectiveButton>
                <DetectiveButton onClick={() => setActiveTab('alerts')} variant="secondary">
                  <AlertTriangle className="w-5 h-5" />
                  Ver Alertas
                </DetectiveButton>
                <DetectiveButton onClick={() => setActiveTab('reports')} variant="secondary">
                  <FileText className="w-5 h-5" />
                  Generar Reporte
                </DetectiveButton>
              </div>
            </DetectiveCard>

            {/* Recent Activity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetectiveCard>
                <h3 className="text-lg font-bold text-detective-text mb-4">
                  Actividad Reciente
                </h3>
                {activities && activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => {
                      // Determine icon based on activity type
                      // Activity types: 'submission' | 'assignment_created' | 'student_joined' | 'achievement_unlocked'
                      const getIcon = () => {
                        if (activity.type === 'submission') return <FileText className="w-5 h-5 text-green-500 mt-1" />;
                        if (activity.type === 'achievement_unlocked') return <Award className="w-5 h-5 text-detective-gold mt-1" />;
                        if (activity.type === 'assignment_created') return <Calendar className="w-5 h-5 text-blue-500 mt-1" />;
                        if (activity.type === 'student_joined') return <Users className="w-5 h-5 text-detective-accent mt-1" />;
                        return <Calendar className="w-5 h-5 text-detective-accent mt-1" />;
                      };

                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-detective-bg-secondary rounded-lg">
                          {getIcon()}
                          <div className="flex-1">
                            <p className="text-sm text-detective-text">{activity.description}</p>
                            <p className="text-xs text-detective-text-secondary">{activity.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-detective-text-secondary mx-auto mb-2 opacity-50" />
                    <p className="text-detective-text-secondary">No hay actividad reciente</p>
                  </div>
                )}
              </DetectiveCard>

              <DetectiveCard>
                <h3 className="text-lg font-bold text-detective-text mb-4">
                  Próximas Fechas Límite
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-detective-bg-secondary rounded-lg">
                    <Calendar className="w-5 h-5 text-detective-orange mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-detective-text font-semibold">
                        Práctica Semanal: Marie Curie
                      </p>
                      <p className="text-xs text-detective-text-secondary">Vence en 2 días</p>
                      <p className="text-xs text-detective-text-secondary">15/25 estudiantes completaron</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-detective-bg-secondary rounded-lg">
                    <Calendar className="w-5 h-5 text-detective-orange mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-detective-text font-semibold">
                        Evaluación: Descubrimientos
                      </p>
                      <p className="text-xs text-detective-text-secondary">Vence en 5 días</p>
                      <p className="text-xs text-detective-text-secondary">8/25 estudiantes completaron</p>
                    </div>
                  </div>
                </div>
              </DetectiveCard>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <StudentMonitoringPanel classroomId={classroomId} />
        )}

        {activeTab === 'assignments' && (
          <AssignmentCreator classroomId={classroomId} />
        )}

        {activeTab === 'progress' && (
          <ClassProgressDashboard classroomId={classroomId} />
        )}

        {activeTab === 'alerts' && (
          <InterventionAlertsPanel classroomId={classroomId} />
        )}

        {activeTab === 'analytics' && (
          <LearningAnalyticsDashboard classroomId={classroomId} />
        )}

        {activeTab === 'insights' && (
          <PerformanceInsightsPanel classroomId={classroomId} students={mockStudents} />
        )}

        {activeTab === 'reports' && (
          <ReportGenerator classroomId={classroomId} students={mockStudents} />
        )}

        {activeTab === 'communication' && (
          <ParentCommunicationHub classroomId={classroomId} students={mockStudents} />
        )}

        {activeTab === 'resources' && <ResourceSharingPanel />}
          </>
        )}
      </main>
    </div>
  );
}
