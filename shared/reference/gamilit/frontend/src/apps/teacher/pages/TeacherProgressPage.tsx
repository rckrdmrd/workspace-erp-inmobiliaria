import { useState, useMemo } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { ClassProgressDashboard } from '../components/progress/ClassProgressDashboard';
import { useClassrooms } from '../hooks/useClassrooms';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { BarChart3, RefreshCw, Filter, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

/**
 * TeacherProgressPage - Página de seguimiento de progreso académico
 *
 * Proporciona una vista integral del progreso de los estudiantes con:
 * - Selector de clase para filtrar datos
 * - Dashboard de progreso con gráficos y métricas
 * - Identificación de estudiantes rezagados
 * - Análisis por módulo
 */
export default function TeacherProgressPage() {
  const { user, logout } = useAuth();
  const { classrooms, loading, error, refresh } = useClassrooms();
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('all');
  const [showClassroomDropdown, setShowClassroomDropdown] = useState(false);

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Fallback gamification data in case hook fails or user is not loaded
  const displayGamificationData = gamificationData || {
    userId: user?.id || 'mock-teacher-id',
    level: 1,
    totalXP: 0,
    mlCoins: 0,
    rank: 'Novato',
    achievements: [],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Obtener el nombre de la clase seleccionada
  const selectedClassroomName = useMemo(() => {
    if (selectedClassroomId === 'all') return 'Todas las clases';
    const classroom = classrooms.find((c) => c.id === selectedClassroomId);
    return classroom?.name || 'Clase no encontrada';
  }, [selectedClassroomId, classrooms]);

  // Estadísticas generales de todas las clases
  const overallStats = useMemo(() => {
    if (classrooms.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        activeClasses: 0,
      };
    }

    return {
      totalStudents: classrooms.reduce((sum, c) => sum + (c.student_count || 0), 0),
      averageScore: 0, // TODO: calculate from classroom stats when available
      activeClasses: classrooms.length, // All loaded classrooms are considered active
    };
  }, [classrooms]);

  return (
    <TeacherLayout
      user={user ?? undefined}
      gamificationData={displayGamificationData}
      organizationName="GLIT Platform"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-detective-orange bg-opacity-10 rounded-lg">
              <BarChart3 className="w-8 h-8 text-detective-orange" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-detective-text">
                Progreso Académico
              </h1>
              <p className="text-detective-text-secondary">
                Monitorea el rendimiento y avance de tus estudiantes
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          {!loading && !error && (
            <DetectiveButton
              variant="secondary"
              onClick={refresh}
              className="self-start md:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </DetectiveButton>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-detective-orange animate-spin mb-4" />
            <p className="text-detective-text-secondary">Cargando datos de progreso...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <DetectiveCard variant="danger">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-detective-text mb-2">
                  Error al cargar progreso
                </h3>
                <p className="text-detective-text-secondary mb-4">
                  No se pudieron cargar los datos de progreso. Por favor, intenta nuevamente.
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

        {/* Overall Stats Cards - Solo cuando se ve "Todas las clases" */}
        {selectedClassroomId === 'all' && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetectiveCard hoverable={false}>
              <div className="text-center">
                <p className="text-detective-text-secondary text-sm mb-2">
                  Total de Estudiantes
                </p>
                <p className="text-4xl font-bold text-detective-text">
                  {overallStats.totalStudents}
                </p>
              </div>
            </DetectiveCard>

            <DetectiveCard hoverable={false}>
              <div className="text-center">
                <p className="text-detective-text-secondary text-sm mb-2">
                  Promedio General
                </p>
                <p className="text-4xl font-bold text-detective-gold">
                  {overallStats.averageScore.toFixed(0)}%
                </p>
              </div>
            </DetectiveCard>

            <DetectiveCard hoverable={false}>
              <div className="text-center">
                <p className="text-detective-text-secondary text-sm mb-2">
                  Clases Activas
                </p>
                <p className="text-4xl font-bold text-detective-accent">
                  {overallStats.activeClasses}
                </p>
              </div>
            </DetectiveCard>
          </div>
        )}

        {/* Classroom Selector */}
        {!loading && !error && (
          <DetectiveCard hoverable={false}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-detective-orange" />
                <div>
                  <label className="text-sm font-medium text-detective-text-secondary block mb-1">
                    Filtrar por Clase
                  </label>
                  <p className="text-xs text-detective-text-secondary">
                    Selecciona una clase específica o visualiza todas
                  </p>
                </div>
              </div>

              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowClassroomDropdown(!showClassroomDropdown)}
                  className="w-full md:w-80 px-4 py-3 bg-detective-bg-secondary border-2 border-detective-border rounded-lg text-left flex items-center justify-between hover:border-detective-orange transition-colors"
                >
                  <span className="text-detective-text font-medium truncate">
                    {selectedClassroomName}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-detective-text-secondary transition-transform ${
                      showClassroomDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showClassroomDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-detective-card border-2 border-detective-border rounded-lg shadow-detective-lg z-50 max-h-80 overflow-y-auto">
                  {/* All Classes Option */}
                  <button
                    onClick={() => {
                      setSelectedClassroomId('all');
                      setShowClassroomDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-detective-bg-secondary transition-colors ${
                      selectedClassroomId === 'all'
                        ? 'bg-detective-orange bg-opacity-10 text-detective-orange font-semibold'
                        : 'text-detective-text'
                    }`}
                  >
                    <div>
                      <p className="font-medium">Todas las clases</p>
                      <p className="text-xs text-detective-text-secondary mt-0.5">
                        Vista general de {classrooms.length} clase(s)
                      </p>
                    </div>
                  </button>

                  {/* Divider */}
                  {classrooms.length > 0 && (
                    <div className="border-t border-detective-border my-1"></div>
                  )}

                  {/* Individual Classrooms */}
                  {classrooms.map((classroom) => (
                    <button
                      key={classroom.id}
                      onClick={() => {
                        setSelectedClassroomId(classroom.id);
                        setShowClassroomDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-detective-bg-secondary transition-colors ${
                        selectedClassroomId === classroom.id
                          ? 'bg-detective-orange bg-opacity-10 text-detective-orange font-semibold'
                          : 'text-detective-text'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{classroom.name}</p>
                        <p className="text-xs text-detective-text-secondary mt-0.5">
                          {classroom.student_count} estudiante(s) • {classroom.grade_level} • {classroom.subject}
                        </p>
                      </div>
                    </button>
                  ))}

                  {/* Empty State */}
                  {classrooms.length === 0 && (
                    <div className="px-4 py-6 text-center text-detective-text-secondary">
                      <p className="text-sm">No hay clases disponibles</p>
                      <p className="text-xs mt-1">Crea una clase para comenzar</p>
                    </div>
                  )}
                </div>
                )}
              </div>
            </div>
          </DetectiveCard>
        )}

        {/* Progress Dashboard */}
        {!loading && !error && selectedClassroomId !== 'all' ? (
          <ClassProgressDashboard classroomId={selectedClassroomId} />
        ) : !loading && !error ? (
          <DetectiveCard hoverable={false}>
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-detective-orange bg-opacity-10 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-detective-orange" />
              </div>
              <h3 className="text-xl font-bold text-detective-text mb-2">
                Selecciona una clase
              </h3>
              <p className="text-detective-text-secondary max-w-md mx-auto">
                Para ver el progreso detallado, análisis por módulos y estudiantes rezagados,
                selecciona una clase específica del menú desplegable superior.
              </p>
              {classrooms.length === 0 && (
                <DetectiveButton
                  variant="primary"
                  className="mt-6"
                  onClick={() => window.location.href = '/teacher/classrooms'}
                >
                  Crear Primera Clase
                </DetectiveButton>
              )}
            </div>
          </DetectiveCard>
        ) : null}

        {/* Info Card - Tips para el Teacher */}
        {!loading && !error && (
          <DetectiveCard hoverable={false}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-detective-accent bg-opacity-10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-detective-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-detective-text mb-2">
                Consejos para el Seguimiento de Progreso
              </h3>
              <ul className="space-y-2 text-sm text-detective-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange font-bold mt-0.5">•</span>
                  <span>
                    Revisa las alertas de estudiantes rezagados semanalmente para intervenir a tiempo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange font-bold mt-0.5">•</span>
                  <span>
                    Los gráficos de progreso por módulo te ayudan a identificar temas que necesitan refuerzo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange font-bold mt-0.5">•</span>
                  <span>
                    Exporta reportes en PDF o Excel para compartir con directivos o padres de familia
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange font-bold mt-0.5">•</span>
                  <span>
                    Compara el rendimiento entre clases para adaptar tus estrategias de enseñanza
                  </span>
                </li>
              </ul>
            </div>
          </div>
          </DetectiveCard>
        )}
      </div>

      {/* Click Outside Handler for Dropdown */}
      {showClassroomDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowClassroomDropdown(false)}
        />
      )}
    </TeacherLayout>
  );
}
