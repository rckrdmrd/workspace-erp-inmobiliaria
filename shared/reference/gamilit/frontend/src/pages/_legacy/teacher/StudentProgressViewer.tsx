/**
 * StudentProgressViewer Component
 *
 * Displays detailed progress information for a specific student.
 * Teachers can view module completion, exercise history, struggle areas,
 * and compare performance to class averages.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { TeacherLayout } from '@/apps/teacher/layouts/TeacherLayout';

// ===== TYPES =====

interface StudentOverview {
  id: string;
  full_name: string;
  username: string;
  email: string;
  maya_rank: 'ajaw' | 'nacom' | 'ah_kin' | 'halach_uinic' | 'kukul_kan';
  current_level: number;
  total_xp: number;
  total_ml_coins: number;
  avatar_url?: string;
  joined_date: Date;
  last_login: Date;
}

interface StudentStats {
  total_modules: number;
  completed_modules: number;
  total_exercises: number;
  completed_exercises: number;
  average_score: number;
  total_time_spent_minutes: number;
  current_streak_days: number;
  longest_streak_days: number;
  achievements_unlocked: number;
}

interface ModuleProgress {
  module_id: string;
  module_name: string;
  module_order: number;
  total_activities: number;
  completed_activities: number;
  average_score: number;
  time_spent_minutes: number;
  last_activity_date?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface ExerciseAttempt {
  id: string;
  exercise_title: string;
  module_name: string;
  exercise_type: string;
  is_correct: boolean;
  score_percentage: number;
  time_spent_seconds: number;
  hints_used: number;
  submitted_at: Date;
}

interface StruggleArea {
  topic: string;
  module_name: string;
  attempts: number;
  success_rate: number;
  average_score: number;
  last_attempt_date: Date;
}

interface ProgressDataPoint {
  date: Date;
  xp: number;
  exercises_completed: number;
}

interface ClassComparison {
  metric: string;
  student_value: number;
  class_average: number;
  percentile: number;
}

// ===== MAIN COMPONENT =====

export const StudentProgressViewer: React.FC = () => {
  const { user, logout } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  // State
  const [student, setStudent] = useState<StudentOverview | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [exerciseAttempts, setExerciseAttempts] = useState<ExerciseAttempt[]>([]);
  const [struggleAreas, setStruggleAreas] = useState<StruggleArea[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProgressDataPoint[]>([]);
  const [classComparison, setClassComparison] = useState<ClassComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'correct' | 'incorrect'>('all');

  // Load student data
  useEffect(() => {
    const loadStudentData = async () => {
      if (!studentId) {
        navigate('/teacher/dashboard');
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const token = localStorage.getItem('access_token');
        // const response = await fetch(`/api/teacher/students/${studentId}/progress`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();

        // Mock data for development
        const mockStudent: StudentOverview = {
          id: studentId,
          full_name: 'María González López',
          username: 'maria.gonzalez',
          email: 'maria.gonzalez@escuela.edu',
          maya_rank: 'ah_kin',
          current_level: 12,
          total_xp: 3450,
          total_ml_coins: 890,
          joined_date: new Date('2024-09-01'),
          last_login: new Date('2025-11-03'),
        };

        const mockStats: StudentStats = {
          total_modules: 8,
          completed_modules: 5,
          total_exercises: 120,
          completed_exercises: 87,
          average_score: 78,
          total_time_spent_minutes: 1250,
          current_streak_days: 7,
          longest_streak_days: 15,
          achievements_unlocked: 12,
        };

        const mockModuleProgress: ModuleProgress[] = [
          {
            module_id: '1',
            module_name: 'Introducción a las Matemáticas Mayas',
            module_order: 1,
            total_activities: 15,
            completed_activities: 15,
            average_score: 85,
            time_spent_minutes: 180,
            last_activity_date: new Date('2025-10-15'),
            status: 'completed',
          },
          {
            module_id: '2',
            module_name: 'Sistema Numérico Vigesimal',
            module_order: 2,
            total_activities: 20,
            completed_activities: 18,
            average_score: 72,
            time_spent_minutes: 220,
            last_activity_date: new Date('2025-10-28'),
            status: 'in_progress',
          },
          {
            module_id: '3',
            module_name: 'Operaciones Básicas',
            module_order: 3,
            total_activities: 18,
            completed_activities: 12,
            average_score: 68,
            time_spent_minutes: 150,
            last_activity_date: new Date('2025-11-02'),
            status: 'in_progress',
          },
        ];

        const mockExerciseAttempts: ExerciseAttempt[] = [
          {
            id: '1',
            exercise_title: 'Conversión de números mayas',
            module_name: 'Sistema Numérico Vigesimal',
            exercise_type: 'multiple_choice',
            is_correct: true,
            score_percentage: 100,
            time_spent_seconds: 120,
            hints_used: 0,
            submitted_at: new Date('2025-11-03T10:30:00'),
          },
          {
            id: '2',
            exercise_title: 'Suma en sistema vigesimal',
            module_name: 'Operaciones Básicas',
            exercise_type: 'fill_blank',
            is_correct: false,
            score_percentage: 40,
            time_spent_seconds: 180,
            hints_used: 2,
            submitted_at: new Date('2025-11-02T15:20:00'),
          },
          {
            id: '3',
            exercise_title: 'Identificar símbolos mayas',
            module_name: 'Introducción a las Matemáticas Mayas',
            exercise_type: 'matching',
            is_correct: true,
            score_percentage: 90,
            time_spent_seconds: 150,
            hints_used: 1,
            submitted_at: new Date('2025-11-01T09:15:00'),
          },
        ];

        const mockStruggleAreas: StruggleArea[] = [
          {
            topic: 'Operaciones con números negativos',
            module_name: 'Operaciones Básicas',
            attempts: 8,
            success_rate: 37.5,
            average_score: 45,
            last_attempt_date: new Date('2025-11-02'),
          },
          {
            topic: 'Conversión de números grandes',
            module_name: 'Sistema Numérico Vigesimal',
            attempts: 5,
            success_rate: 60,
            average_score: 62,
            last_attempt_date: new Date('2025-10-28'),
          },
        ];

        const mockProgressHistory: ProgressDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
          xp: 2000 + i * 50 + Math.random() * 100,
          exercises_completed: Math.floor(40 + i * 1.5),
        }));

        const mockClassComparison: ClassComparison[] = [
          { metric: 'Puntuación Promedio', student_value: 78, class_average: 75, percentile: 62 },
          { metric: 'Ejercicios Completados', student_value: 87, class_average: 82, percentile: 58 },
          { metric: 'Tiempo de Estudio (min)', student_value: 1250, class_average: 1100, percentile: 68 },
          { metric: 'Racha Actual (días)', student_value: 7, class_average: 5, percentile: 72 },
        ];

        setStudent(mockStudent);
        setStats(mockStats);
        setModuleProgress(mockModuleProgress);
        setExerciseAttempts(mockExerciseAttempts);
        setStruggleAreas(mockStruggleAreas);
        setProgressHistory(mockProgressHistory);
        setClassComparison(mockClassComparison);
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, [studentId, navigate]);

  // Filter exercise attempts
  const filteredAttempts = useMemo(() => {
    let filtered = [...exerciseAttempts];

    // Filter by module
    if (selectedModule !== 'all') {
      filtered = filtered.filter((attempt) => attempt.module_name === selectedModule);
    }

    // Filter by status
    if (selectedStatus === 'correct') {
      filtered = filtered.filter((attempt) => attempt.is_correct);
    } else if (selectedStatus === 'incorrect') {
      filtered = filtered.filter((attempt) => !attempt.is_correct);
    }

    // Filter by time range
    const now = Date.now();
    const ranges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      'all': Infinity,
    };

    const rangeMs = ranges[selectedTimeRange];
    filtered = filtered.filter((attempt) => now - attempt.submitted_at.getTime() <= rangeMs);

    return filtered.sort((a, b) => b.submitted_at.getTime() - a.submitted_at.getTime());
  }, [exerciseAttempts, selectedModule, selectedStatus, selectedTimeRange]);

  // Get unique modules for filter
  const uniqueModules = useMemo(() => {
    const modules = new Set(exerciseAttempts.map((attempt) => attempt.module_name));
    return Array.from(modules);
  }, [exerciseAttempts]);

  // Export to CSV
  const handleExportData = () => {
    if (!student || !stats) return;

    const csvData = [
      ['Reporte de Progreso del Estudiante'],
      [''],
      ['Información del Estudiante'],
      ['Nombre', student.full_name],
      ['Usuario', student.username],
      ['Nivel', student.current_level.toString()],
      ['Rango Maya', student.maya_rank],
      ['XP Total', ((stats as any).total_xp ?? 0).toString()],
      [''],
      ['Estadísticas Generales'],
      ['Módulos Completados', `${stats.completed_modules}/${stats.total_modules}`],
      ['Ejercicios Completados', `${stats.completed_exercises}/${stats.total_exercises}`],
      ['Puntuación Promedio', `${stats.average_score}%`],
      ['Tiempo Total', `${Math.floor(stats.total_time_spent_minutes / 60)}h ${stats.total_time_spent_minutes % 60}m`],
      [''],
      ['Progreso por Módulo'],
      ['Módulo', 'Completado', 'Puntuación', 'Tiempo'],
      ...moduleProgress.map((m) => [
        m.module_name,
        `${m.completed_activities}/${m.total_activities}`,
        `${m.average_score}%`,
        `${m.time_spent_minutes} min`,
      ]),
    ];

    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progreso_${student.username}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get rank display name
  const getRankName = (rank: string): string => {
    const ranks: Record<string, string> = {
      ajaw: 'Ajaw',
      nacom: 'Nacom',
      ah_kin: 'Ah K\'in',
      halach_uinic: 'Halach Uinic',
      kukul_kan: 'K\'uk\'ulkan',
    };
    return ranks[rank] || rank;
  };

  if (isLoading) {
    return (
      <TeacherLayout user={user} onLogout={logout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando progreso del estudiante...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (!student || !stats) {
    return (
      <TeacherLayout user={user} onLogout={logout}>
        <div className="text-center py-12">
          <p className="text-slate-400">No se pudo cargar la información del estudiante.</p>
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Volver al Dashboard
          </button>
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

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold text-white">
              {student.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{student.full_name}</h1>
              <p className="text-slate-400">@{student.username}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                  Nivel {student.current_level}
                </span>
                <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">
                  {getRankName(student.maya_rank)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.completed_modules}/{stats.total_modules}
          </p>
          <p className="text-sm text-slate-400">Módulos Completados</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.average_score}%</p>
          <p className="text-sm text-slate-400">Puntuación Promedio</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatTime(stats.total_time_spent_minutes)}</p>
          <p className="text-sm text-slate-400">Tiempo Total</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.achievements_unlocked}</p>
          <p className="text-sm text-slate-400">Logros Desbloqueados</p>
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Progreso por Módulo
        </h2>
        <div className="space-y-4">
          {moduleProgress.map((module) => (
            <div key={module.module_id} className="border-b border-slate-700 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{module.module_name}</h3>
                  <p className="text-sm text-slate-400">
                    {module.completed_activities}/{module.total_activities} actividades •{' '}
                    {formatTime(module.time_spent_minutes)} •{' '}
                    {module.last_activity_date
                      ? `Última actividad: ${module.last_activity_date.toLocaleDateString()}`
                      : 'Sin actividad'}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-2xl font-bold text-white">{module.average_score}%</p>
                  <p className="text-xs text-slate-400">Puntuación</p>
                </div>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                  style={{ width: `${(module.completed_activities / module.total_activities) * 100}%` }}
                />
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
                    {area.success_rate.toFixed(0)}% éxito
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Intentos</p>
                    <p className="text-white font-medium">{area.attempts}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Puntuación Promedio</p>
                    <p className="text-white font-medium">{area.average_score}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Último Intento</p>
                    <p className="text-white font-medium">{area.last_attempt_date.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Comparison */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Comparación con el Promedio de la Clase
        </h2>
        <div className="space-y-4">
          {classComparison.map((comparison, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{comparison.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">
                    Estudiante: <span className="text-white font-medium">{comparison.student_value}</span>
                  </span>
                  <span className="text-slate-400 text-sm">
                    Clase: <span className="text-white font-medium">{comparison.class_average}</span>
                  </span>
                  {comparison.student_value > comparison.class_average ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${comparison.percentile}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Percentil {comparison.percentile}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise History */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Historial de Ejercicios
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Filtros:</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="all">Todo el tiempo</option>
          </select>

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los módulos</option>
            {uniqueModules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los estados</option>
            <option value="correct">Solo correctos</option>
            <option value="incorrect">Solo incorrectos</option>
          </select>
        </div>

        {/* Attempts List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAttempts.length > 0 ? (
            filteredAttempts.map((attempt) => (
              <div key={attempt.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {attempt.is_correct ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <h3 className="text-white font-medium">{attempt.exercise_title}</h3>
                    </div>
                    <p className="text-sm text-slate-400">{attempt.module_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{attempt.score_percentage}%</p>
                    <p className="text-xs text-slate-400">{attempt.submitted_at.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(attempt.time_spent_seconds / 60)}:{(attempt.time_spent_seconds % 60).toString().padStart(2, '0')}
                  </span>
                  <span>Pistas usadas: {attempt.hints_used}</span>
                  <span className="capitalize">{attempt.exercise_type.replace('_', ' ')}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              No se encontraron intentos con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};
