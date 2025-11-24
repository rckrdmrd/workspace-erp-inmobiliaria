import React, { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Filter,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import type { ReportType, ReportFormat } from '../types';

interface RecentReport {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  generatedAt: string;
  studentCount: number;
  period: string;
  size: string;
}

interface ReportStats {
  totalReportsGenerated: number;
  lastGeneratedDate: string;
  mostUsedFormat: ReportFormat;
  averageStudentsPerReport: number;
}

/**
 * TeacherReportsPage - Página de reportes y estadísticas
 *
 * Permite generar reportes personalizados con diferentes plantillas,
 * configurar rangos de fechas, seleccionar estudiantes y exportar
 * en múltiples formatos (PDF, Excel, CSV).
 */
export default function TeacherReportsPage() {
  const { user, logout } = useAuth();
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [classrooms, setClassrooms] = useState<Array<{ id: string; name: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: string; full_name: string }>>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<ReportType | 'all'>('all');
  const [loading, setLoading] = useState(true);

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

  // Cargar aulas y datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar estudiantes cuando se selecciona un aula
  useEffect(() => {
    if (selectedClassroom) {
      loadStudents(selectedClassroom);
    }
  }, [selectedClassroom]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Cargar aulas
      const classroomsResponse = await fetch('/api/teacher/classrooms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (classroomsResponse.ok) {
        const classroomsData = await classroomsResponse.json();
        setClassrooms(classroomsData);
        if (classroomsData.length > 0) {
          setSelectedClassroom(classroomsData[0].id);
        }
      }

      // Cargar reportes recientes
      await loadRecentReports();

      // Cargar estadísticas
      await loadReportStats();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classroomId: string) => {
    try {
      const response = await fetch(`/api/teacher/classrooms/${classroomId}/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      // Fallback con datos mock
      setStudents([
        { id: '1', full_name: 'Ana García Pérez' },
        { id: '2', full_name: 'Carlos Rodríguez López' },
        { id: '3', full_name: 'María Fernández Sánchez' },
        { id: '4', full_name: 'Juan Martínez González' },
        { id: '5', full_name: 'Laura Torres Ruiz' },
      ]);
    }
  };

  const loadRecentReports = async () => {
    try {
      const response = await fetch('/api/reports/recent', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentReports(data);
      }
    } catch (error) {
      console.error('Error loading recent reports:', error);
      // Fallback con datos mock
      setRecentReports([
        {
          id: '1',
          name: 'Reporte de Progreso Mensual - Octubre 2024',
          type: 'progress',
          format: 'pdf',
          generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          studentCount: 25,
          period: '01 Oct - 31 Oct 2024',
          size: '2.4 MB',
        },
        {
          id: '2',
          name: 'Evaluación Final - Grupo A',
          type: 'evaluation',
          format: 'excel',
          generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          studentCount: 30,
          period: '01 Sep - 30 Sep 2024',
          size: '1.8 MB',
        },
        {
          id: '3',
          name: 'Reporte de Intervención - Estudiantes en Riesgo',
          type: 'intervention',
          format: 'pdf',
          generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          studentCount: 8,
          period: '15 Oct - 22 Oct 2024',
          size: '890 KB',
        },
      ]);
    }
  };

  const loadReportStats = async () => {
    try {
      const response = await fetch('/api/reports/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReportStats(data);
      }
    } catch (error) {
      console.error('Error loading report stats:', error);
      // Fallback con datos mock
      setReportStats({
        totalReportsGenerated: 47,
        lastGeneratedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        mostUsedFormat: 'pdf',
        averageStudentsPerReport: 22,
      });
    }
  };

  const handleReportGenerated = async (report: any) => {
    console.log('Reporte generado:', report);
    // Recargar la lista de reportes recientes
    await loadRecentReports();
    await loadReportStats();
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const report = recentReports.find((r) => r.id === reportId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report?.name || 'report'}.${report?.format || 'pdf'}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte. Por favor, intenta nuevamente.');
    }
  };

  const getReportTypeLabel = (type: ReportType): string => {
    const labels: Record<ReportType, string> = {
      progress: 'Progreso',
      evaluation: 'Evaluación',
      intervention: 'Intervención',
      custom: 'Personalizado',
    };
    return labels[type];
  };

  const getReportTypeColor = (type: ReportType): string => {
    const colors: Record<ReportType, string> = {
      progress: 'bg-detective-orange text-white',
      evaluation: 'bg-detective-gold text-detective-text',
      intervention: 'bg-red-500 text-white',
      custom: 'bg-detective-accent text-white',
    };
    return colors[type];
  };

  const getFormatIcon = (format: ReportFormat): string => {
    const icons: Record<ReportFormat, string> = {
      pdf: 'PDF',
      excel: 'XLSX',
      csv: 'CSV',
    };
    return icons[format];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const filteredReports = recentReports.filter(
    (report) => filterType === 'all' || report.type === filterType
  );

  if (loading) {
    return (
      <TeacherLayout
        user={user ?? undefined}
        gamificationData={displayGamificationData}
        organizationName="GLIT Platform"
        onLogout={handleLogout}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-detective-orange animate-spin mx-auto mb-4" />
            <p className="text-detective-text-secondary">Cargando datos...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      user={user ?? undefined}
      gamificationData={displayGamificationData}
      organizationName="GLIT Platform"
      onLogout={handleLogout}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-detective-text mb-2">
              Reportes y Estadísticas
            </h1>
            <p className="text-detective-text-secondary">
              Genera reportes personalizados y analiza el desempeño de tus estudiantes
            </p>
          </div>
          <DetectiveButton
            variant="secondary"

            onClick={() => {
              loadRecentReports();
              loadReportStats();
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </DetectiveButton>
        </div>

        {/* Stats Cards */}
        {reportStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DetectiveCard>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-detective-orange bg-opacity-10 rounded-lg">
                  <FileText className="w-6 h-6 text-detective-orange" />
                </div>
                <div>
                  <p className="text-sm text-detective-text-secondary">Total Generados</p>
                  <p className="text-2xl font-bold text-detective-text">
                    {reportStats.totalReportsGenerated}
                  </p>
                </div>
              </div>
            </DetectiveCard>

            <DetectiveCard>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-detective-text-secondary">Último Reporte</p>
                  <p className="text-lg font-bold text-detective-text">
                    {formatDate(reportStats.lastGeneratedDate)}
                  </p>
                </div>
              </div>
            </DetectiveCard>

            <DetectiveCard>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-detective-accent bg-opacity-10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-detective-accent" />
                </div>
                <div>
                  <p className="text-sm text-detective-text-secondary">Formato Preferido</p>
                  <p className="text-lg font-bold text-detective-text uppercase">
                    {reportStats.mostUsedFormat}
                  </p>
                </div>
              </div>
            </DetectiveCard>

            <DetectiveCard>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-detective-gold bg-opacity-10 rounded-lg">
                  <Users className="w-6 h-6 text-detective-gold" />
                </div>
                <div>
                  <p className="text-sm text-detective-text-secondary">Promedio Estudiantes</p>
                  <p className="text-2xl font-bold text-detective-text">
                    {reportStats.averageStudentsPerReport}
                  </p>
                </div>
              </div>
            </DetectiveCard>
          </div>
        )}

        {/* Classroom Selector */}
        <DetectiveCard>
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-detective-orange" />
            <div className="flex-1">
              <label className="block text-sm font-semibold text-detective-text mb-2">
                Selecciona un Aula
              </label>
              <select
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="w-full px-4 py-2 bg-detective-bg-secondary text-detective-text border border-detective-orange rounded-lg focus:outline-none focus:ring-2 focus:ring-detective-orange"
              >
                {classrooms.length === 0 ? (
                  <option value="">No hay aulas disponibles</option>
                ) : (
                  classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </DetectiveCard>

        {/* Report Generator */}
        {selectedClassroom && students.length > 0 && (
          <ReportGenerator
            classroomId={selectedClassroom}
            students={students}
          />
        )}

        {/* Recent Reports Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-detective-orange" />
              <h2 className="text-2xl font-bold text-detective-text">Reportes Recientes</h2>
            </div>
            <DetectiveButton
              variant="secondary"

              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtrar
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </DetectiveButton>
          </div>

          {/* Filters */}
          {showFilters && (
            <DetectiveCard>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterType === 'all'
                      ? 'bg-detective-orange text-white'
                      : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
                  }`}
                >
                  Todos
                </button>
                {(['progress', 'evaluation', 'intervention', 'custom'] as ReportType[]).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        filterType === type
                          ? 'bg-detective-orange text-white'
                          : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
                      }`}
                    >
                      {getReportTypeLabel(type)}
                    </button>
                  )
                )}
              </div>
            </DetectiveCard>
          )}

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <DetectiveCard>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-detective-text-secondary mx-auto mb-4 opacity-50" />
                <p className="text-detective-text-secondary text-lg">
                  {filterType === 'all'
                    ? 'No hay reportes generados aún'
                    : `No hay reportes de tipo "${getReportTypeLabel(filterType as ReportType)}"`}
                </p>
                <p className="text-detective-text-secondary text-sm mt-2">
                  Genera tu primer reporte usando el formulario anterior
                </p>
              </div>
            </DetectiveCard>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => (
                <DetectiveCard key={report.id} className="hover:border-detective-orange transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-detective-bg-secondary rounded-lg">
                        <FileText className="w-6 h-6 text-detective-orange" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-detective-text">{report.name}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded ${getReportTypeColor(
                              report.type
                            )}`}
                          >
                            {getReportTypeLabel(report.type)}
                          </span>
                          <span className="px-2 py-1 text-xs font-bold rounded bg-detective-bg-secondary text-detective-text">
                            {getFormatIcon(report.format)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-detective-text-secondary">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {report.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {report.studentCount} estudiantes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(report.generatedAt)}
                          </span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <DetectiveButton
                      variant="primary"

                      onClick={() => downloadReport(report.id)}
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </DetectiveButton>
                  </div>
                </DetectiveCard>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <DetectiveCard className="bg-detective-orange bg-opacity-5 border-detective-orange">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-detective-orange text-white rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-detective-text mb-2">Tipos de Reportes Disponibles</h3>
              <ul className="space-y-2 text-sm text-detective-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange mt-1">•</span>
                  <div>
                    <strong className="text-detective-text">Reporte de Progreso:</strong> Análisis
                    completo del progreso de estudiantes, incluyendo completitud por módulo, scores
                    promedio y tendencias.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange mt-1">•</span>
                  <div>
                    <strong className="text-detective-text">Reporte de Evaluación:</strong>{' '}
                    Evaluación integral del rendimiento con scores finales, logros alcanzados y
                    recomendaciones.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange mt-1">•</span>
                  <div>
                    <strong className="text-detective-text">Reporte de Intervención:</strong>{' '}
                    Identifica estudiantes que requieren atención especial, con alertas y acciones de
                    seguimiento.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-detective-orange mt-1">•</span>
                  <div>
                    <strong className="text-detective-text">Reporte Personalizado:</strong> Crea
                    reportes con métricas específicas según tus necesidades.
                  </div>
                </li>
              </ul>
              <p className="text-sm text-detective-text-secondary mt-4">
                <strong className="text-detective-text">Formatos de exportación:</strong> PDF (lectura
                y presentación), Excel (análisis y manipulación de datos), CSV (integración con otras
                herramientas).
              </p>
            </div>
          </div>
        </DetectiveCard>
      </div>
    </TeacherLayout>
  );
}
