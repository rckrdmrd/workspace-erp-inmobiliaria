/**
 * ClassroomAnalytics Component
 *
 * Provides comprehensive analytics and visualizations for classroom performance.
 * Includes charts, statistics, engagement metrics, and struggle area identification.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Award,
  BookOpen,
  AlertTriangle,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { TeacherLayout } from '@/apps/teacher/layouts/TeacherLayout';

// ===== TYPES =====

interface ClassAnalytics {
  total_students: number;
  active_students: number;
  average_score: number;
  average_completion_rate: number;
  total_time_spent_minutes: number;
  exercises_completed: number;
  achievements_unlocked: number;
}

interface ModuleAnalytics {
  module_id: string;
  module_name: string;
  students_enrolled: number;
  average_completion: number;
  average_score: number;
  time_spent_minutes: number;
  exercises_count: number;
}

interface StudentPerformance {
  student_id: string;
  student_name: string;
  modules_completed: number;
  exercises_completed: number;
  average_score: number;
  total_xp: number;
  current_level: number;
  last_activity: Date;
  at_risk: boolean;
}

interface StruggleArea {
  topic: string;
  module_name: string;
  students_struggling: number;
  average_attempts: number;
  success_rate: number;
}

interface EngagementMetric {
  date: Date;
  active_students: number;
  exercises_completed: number;
  avg_session_minutes: number;
}

interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

// ===== MAIN COMPONENT =====

export const ClassroomAnalytics: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [moduleAnalytics, setModuleAnalytics] = useState<ModuleAnalytics[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [struggleAreas, setStruggleAreas] = useState<StruggleArea[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementMetric[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const token = localStorage.getItem('access_token');
        // const response = await fetch(`/api/teacher/analytics?timeRange=${timeRange}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();

        // Mock data for development
        const mockAnalytics: ClassAnalytics = {
          total_students: 45,
          active_students: 38,
          average_score: 78,
          average_completion_rate: 67,
          total_time_spent_minutes: 18500,
          exercises_completed: 1234,
          achievements_unlocked: 456,
        };

        const mockModuleAnalytics: ModuleAnalytics[] = [
          {
            module_id: '1',
            module_name: 'Introducción a las Matemáticas Mayas',
            students_enrolled: 45,
            average_completion: 92,
            average_score: 85,
            time_spent_minutes: 3200,
            exercises_count: 15,
          },
          {
            module_id: '2',
            module_name: 'Sistema Numérico Vigesimal',
            students_enrolled: 42,
            average_completion: 76,
            average_score: 72,
            time_spent_minutes: 4800,
            exercises_count: 20,
          },
          {
            module_id: '3',
            module_name: 'Operaciones Básicas',
            students_enrolled: 38,
            average_completion: 58,
            average_score: 68,
            time_spent_minutes: 3600,
            exercises_count: 18,
          },
          {
            module_id: '4',
            module_name: 'Geometría Maya',
            students_enrolled: 25,
            average_completion: 34,
            average_score: 74,
            time_spent_minutes: 2100,
            exercises_count: 22,
          },
        ];

        const mockStudentPerformance: StudentPerformance[] = [
          {
            student_id: 's1',
            student_name: 'María González',
            modules_completed: 5,
            exercises_completed: 87,
            average_score: 92,
            total_xp: 3450,
            current_level: 12,
            last_activity: new Date('2025-11-03'),
            at_risk: false,
          },
          {
            student_id: 's2',
            student_name: 'Carlos Ramírez',
            modules_completed: 3,
            exercises_completed: 54,
            average_score: 68,
            total_xp: 1890,
            current_level: 8,
            last_activity: new Date('2025-11-02'),
            at_risk: false,
          },
          {
            student_id: 's3',
            student_name: 'Ana Martínez',
            modules_completed: 2,
            exercises_completed: 28,
            average_score: 58,
            total_xp: 980,
            current_level: 5,
            last_activity: new Date('2025-10-28'),
            at_risk: true,
          },
        ];

        const mockStruggleAreas: StruggleArea[] = [
          {
            topic: 'Conversión de números grandes',
            module_name: 'Sistema Numérico Vigesimal',
            students_struggling: 18,
            average_attempts: 4.2,
            success_rate: 45,
          },
          {
            topic: 'Operaciones con números negativos',
            module_name: 'Operaciones Básicas',
            students_struggling: 15,
            average_attempts: 3.8,
            success_rate: 52,
          },
          {
            topic: 'Cálculo de áreas complejas',
            module_name: 'Geometría Maya',
            students_struggling: 12,
            average_attempts: 3.5,
            success_rate: 48,
          },
        ];

        const mockEngagementData: EngagementMetric[] = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
          active_students: Math.floor(25 + Math.random() * 15),
          exercises_completed: Math.floor(30 + Math.random() * 20),
          avg_session_minutes: Math.floor(25 + Math.random() * 20),
        }));

        const mockScoreDistribution: ScoreDistribution[] = [
          { range: '0-20%', count: 2, percentage: 4 },
          { range: '21-40%', count: 3, percentage: 7 },
          { range: '41-60%', count: 8, percentage: 18 },
          { range: '61-80%', count: 18, percentage: 40 },
          { range: '81-100%', count: 14, percentage: 31 },
        ];

        setAnalytics(mockAnalytics);
        setModuleAnalytics(mockModuleAnalytics);
        setStudentPerformance(mockStudentPerformance);
        setStruggleAreas(mockStruggleAreas);
        setEngagementData(mockEngagementData);
        setScoreDistribution(mockScoreDistribution);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  // Filter module analytics
  const filteredModuleAnalytics = useMemo(() => {
    if (selectedModule === 'all') return moduleAnalytics;
    return moduleAnalytics.filter((m) => m.module_id === selectedModule);
  }, [moduleAnalytics, selectedModule]);

  // Export analytics
  const handleExportAnalytics = () => {
    if (!analytics) return;

    const csvData = [
      ['Reporte de Análisis de Clase'],
      ['Generado:', new Date().toLocaleString()],
      [''],
      ['Resumen General'],
      ['Total de Estudiantes', analytics.total_students.toString()],
      ['Estudiantes Activos', analytics.active_students.toString()],
      ['Puntuación Promedio', `${analytics.average_score}%`],
      ['Tasa de Completitud', `${analytics.average_completion_rate}%`],
      ['Ejercicios Completados', analytics.exercises_completed.toString()],
      [''],
      ['Análisis por Módulo'],
      ['Módulo', 'Estudiantes', 'Completitud', 'Puntuación', 'Tiempo (min)'],
      ...moduleAnalytics.map((m) => [
        m.module_name,
        m.students_enrolled.toString(),
        `${m.average_completion}%`,
        `${m.average_score}%`,
        m.time_spent_minutes.toString(),
      ]),
      [''],
      ['Áreas de Oportunidad'],
      ['Tema', 'Módulo', 'Estudiantes Afectados', 'Tasa de Éxito'],
      ...struggleAreas.map((a) => [
        a.topic,
        a.module_name,
        a.students_struggling.toString(),
        `${a.success_rate}%`,
      ]),
    ];

    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_clase_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <TeacherLayout user={user} onLogout={logout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando análisis...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (!analytics) {
    return (
      <TeacherLayout user={user} onLogout={logout}>
        <div className="text-center py-12">
          <p className="text-slate-400">No se pudieron cargar los datos de análisis.</p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout user={user} onLogout={logout}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Análisis de Clase</h1>
            <p className="text-slate-400 mt-1">
              Métricas detalladas y visualizaciones del desempeño de tus estudiantes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="all">Todo el tiempo</option>
            </select>
            <button
              onClick={handleExportAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-green-400">
              {analytics.active_students}/{analytics.total_students} activos
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.total_students}</p>
          <p className="text-sm text-slate-400">Total Estudiantes</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.average_score}%</p>
          <p className="text-sm text-slate-400">Puntuación Promedio</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.average_completion_rate}%</p>
          <p className="text-sm text-slate-400">Tasa de Completitud</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.exercises_completed}</p>
          <p className="text-sm text-slate-400">Ejercicios Completados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Distribution */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Distribución de Puntuaciones
          </h2>
          <div className="space-y-3">
            {scoreDistribution.map((dist, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-sm">{dist.range}</span>
                  <span className="text-white font-medium">
                    {dist.count} estudiantes ({dist.percentage}%)
                  </span>
                </div>
                <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trend (Simple visualization) */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Tendencia de Participación (Últimos 7 días)
          </h2>
          <div className="space-y-2">
            {engagementData.slice(-7).map((metric, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-16">
                  {metric.date.toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 relative h-8 bg-slate-700 rounded overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-600 rounded transition-all duration-300 flex items-center justify-end pr-2"
                      style={{
                        width: `${(metric.active_students / analytics.total_students) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {metric.active_students}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs w-24">
                    {metric.exercises_completed} ejercicios
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Analytics */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Análisis por Módulo
          </h2>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los módulos</option>
            {moduleAnalytics.map((module) => (
              <option key={module.module_id} value={module.module_id}>
                {module.module_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredModuleAnalytics.map((module) => (
            <div key={module.module_id} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{module.module_name}</h3>
                  <p className="text-sm text-slate-400">
                    {module.students_enrolled} estudiantes inscritos • {module.exercises_count} ejercicios
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{module.average_score}%</p>
                  <p className="text-xs text-slate-400">Puntuación promedio</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Completitud</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${module.average_completion}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium">{module.average_completion}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Tiempo Total</p>
                  <p className="text-white font-medium">
                    {Math.floor(module.time_spent_minutes / 60)}h{' '}
                    {module.time_spent_minutes % 60}m
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Promedio por Estudiante</p>
                  <p className="text-white font-medium">
                    {Math.round(module.time_spent_minutes / module.students_enrolled)} min
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 text-sm">
                {module.average_completion >= 80 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Excelente progreso</span>
                  </>
                ) : module.average_completion >= 50 ? (
                  <>
                    <Activity className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">Progreso moderado</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Requiere atención</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Struggle Areas */}
      {struggleAreas.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Áreas de Oportunidad
          </h2>
          <div className="space-y-3">
            {struggleAreas.map((area, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{area.topic}</h3>
                    <p className="text-sm text-slate-400">{area.module_name}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      area.success_rate < 50
                        ? 'bg-red-600/20 text-red-400'
                        : area.success_rate < 70
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-green-600/20 text-green-400'
                    }`}
                  >
                    {area.success_rate}% éxito
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Estudiantes Afectados</p>
                    <p className="text-white font-medium text-lg">{area.students_struggling}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Intentos Promedio</p>
                    <p className="text-white font-medium text-lg">{area.average_attempts.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Recomendación</p>
                    <p className="text-purple-400 font-medium">Revisar material</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Performance Ranking */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Desempeño de Estudiantes
        </h2>
        <div className="space-y-2">
          {studentPerformance.map((student, index) => (
            <div
              key={student.student_id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer hover:bg-slate-700/50 ${
                student.at_risk ? 'border-l-4 border-red-500' : ''
              }`}
              onClick={() => navigate(`/teacher/students/${student.student_id}`)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{student.student_name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>{student.modules_completed} módulos</span>
                  <span>{student.exercises_completed} ejercicios</span>
                  <span>Nivel {student.current_level}</span>
                  <span>Última actividad: {student.last_activity.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{student.average_score}%</p>
                <p className="text-xs text-slate-400">{student.total_xp} XP</p>
              </div>
              {student.at_risk && (
                <div className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-medium">
                  En riesgo
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
};
