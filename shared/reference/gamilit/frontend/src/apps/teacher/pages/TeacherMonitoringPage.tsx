import { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { StudentMonitoringPanel } from '../components/monitoring/StudentMonitoringPanel';
import { useClassrooms } from '../hooks/useClassrooms';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Users, BookOpen, RefreshCw, Filter, AlertCircle, Loader2 } from 'lucide-react';

/**
 * TeacherMonitoringPage - Pagina de monitoreo en tiempo real
 *
 * Funcionalidades:
 * - Filtros por clase (classroom)
 * - Estadisticas en tiempo real
 * - Auto-refresh cada 30 segundos (configurado en StudentMonitoringPanel)
 * - Usa TeacherLayout para consistencia visual
 * - Tema Detective consistente
 */
export default function TeacherMonitoringPage() {
  const { user, logout } = useAuth();
  const {
    classrooms,
    selectedClassroom,
    students,
    loading,
    error,
    selectClassroom,
    refresh
  } = useClassrooms();
  const [showFilters, setShowFilters] = useState(false);

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

  // Auto-seleccionar la primera clase cuando carguen los datos
  useEffect(() => {
    if (!selectedClassroom && classrooms.length > 0) {
      selectClassroom(classrooms[0].id);
    }
  }, [classrooms, selectedClassroom, selectClassroom]);

  return (
    <TeacherLayout
      user={user ?? undefined}
      gamificationData={displayGamificationData}
      organizationName="GLIT Platform"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-detective-text">
              Monitoreo en Tiempo Real
            </h1>
            <p className="text-detective-text-secondary mt-1">
              Supervisa la actividad de tus estudiantes en tiempo real
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!loading && !error && (
              <DetectiveButton
                variant="secondary"
                onClick={refresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </DetectiveButton>
            )}
            <DetectiveButton
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </DetectiveButton>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-detective-orange animate-spin mb-4" />
            <p className="text-detective-text-secondary">Cargando clases...</p>
          </div>
        )}

        {/* Error al cargar clases */}
        {error && !loading && (
          <DetectiveCard variant="danger">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-detective-text mb-2">
                  Error al cargar clases
                </h3>
                <p className="text-detective-text-secondary mb-4">
                  No se pudieron cargar las clases. Por favor, intenta nuevamente.
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

        {/* Filtros por Clase */}
        {showFilters && !loading && !error && (
          <DetectiveCard>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-detective-orange" />
                <h3 className="text-lg font-semibold text-detective-text">
                  Seleccionar Clase
                </h3>
              </div>

              {classrooms.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-detective-text-secondary mx-auto mb-3" />
                  <p className="text-detective-text-secondary">
                    No tienes clases creadas todavia
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {classrooms.map((classroom) => (
                    <button
                      key={classroom.id}
                      onClick={() => selectClassroom(classroom.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedClassroom?.id === classroom.id
                          ? 'border-detective-orange bg-detective-orange/10'
                          : 'border-detective-border hover:border-detective-orange/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-detective-text">
                            {classroom.name}
                          </h4>
                          <p className="text-sm text-detective-text-secondary mt-1">
                            {classroom.grade_level} - {classroom.subject}
                          </p>
                        </div>
                        {selectedClassroom?.id === classroom.id && (
                          <div className="w-3 h-3 rounded-full bg-detective-orange" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-detective-text-secondary">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{classroom.student_count} estudiantes</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </DetectiveCard>
        )}

        {/* Informacion de la clase seleccionada */}
        {selectedClassroom && !loading && !error && (
          <DetectiveCard hoverable={false}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-detective-orange/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-detective-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-detective-text">
                    {selectedClassroom.name}
                  </h3>
                  <p className="text-sm text-detective-text-secondary">
                    {selectedClassroom.grade_level} - {selectedClassroom.subject}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-detective-text">
                    {selectedClassroom.student_count}
                  </p>
                  <p className="text-detective-text-secondary">Estudiantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-detective-accent">
                    {students.length}
                  </p>
                  <p className="text-detective-text-secondary">Cargados</p>
                </div>
              </div>
            </div>
          </DetectiveCard>
        )}

        {/* Panel de Monitoreo de Estudiantes */}
        {selectedClassroom && !loading && !error ? (
          <StudentMonitoringPanel classroomId={selectedClassroom.id} />
        ) : !loading && !error ? (
          <DetectiveCard>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-detective-text mb-2">
                Selecciona una clase
              </h3>
              <p className="text-detective-text-secondary mb-6">
                Elige una clase para ver el monitoreo en tiempo real de tus estudiantes
              </p>
              {!showFilters && classrooms.length > 0 && (
                <DetectiveButton
                  variant="primary"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Mostrar Filtros
                </DetectiveButton>
              )}
            </div>
          </DetectiveCard>
        ) : null}
      </div>
    </TeacherLayout>
  );
}
