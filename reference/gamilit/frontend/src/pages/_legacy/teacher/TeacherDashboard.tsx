/**
 * TeacherDashboard Component
 *
 * ISSUE: #6.1 (P0) - Teacher Dashboard
 * FECHA: 2025-11-04
 * SPRINT: Sprint 4
 *
 * Dashboard principal para profesores
 *
 * Features:
 * - Overview de estudiantes activos
 * - Estadísticas de clase (promedio, completación)
 * - Actividades recientes de estudiantes
 * - Alertas de estudiantes con problemas
 * - Quick actions (crear ejercicio, revisar submissions)
 * - Gráficas de progreso
 * - Lista de clases/grupos
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  PlusCircle,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { TeacherLayout } from '@/apps/teacher/layouts/TeacherLayout';

interface ClassroomStats {
  total_students: number;
  active_students: number;
  average_score: number;
  average_completion: number;
  total_submissions_pending: number;
  students_at_risk: number;
}

interface RecentActivity {
  id: string;
  student_name: string;
  activity_type: 'submission' | 'achievement' | 'question';
  title: string;
  timestamp: Date;
  status?: 'pending' | 'graded' | 'needs_attention';
}

interface StudentAlert {
  id: string;
  student_name: string;
  alert_type: 'low_score' | 'inactive' | 'struggling' | 'streak_broken';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<ClassroomStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<StudentAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Mock data - TODO: Replace with real API calls
        setStats({
          total_students: 45,
          active_students: 38,
          average_score: 82,
          average_completion: 67,
          total_submissions_pending: 12,
          students_at_risk: 5,
        });

        setRecentActivities([
          {
            id: '1',
            student_name: 'María García',
            activity_type: 'submission',
            title: 'Ejercicio: Introducción a ML',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: 'pending',
          },
          {
            id: '2',
            student_name: 'Juan Pérez',
            activity_type: 'achievement',
            title: 'Logro desbloqueado: Perfeccionista',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
          },
          {
            id: '3',
            student_name: 'Ana López',
            activity_type: 'submission',
            title: 'Ejercicio: Redes Neuronales',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            status: 'pending',
          },
        ]);

        setAlerts([
          {
            id: '1',
            student_name: 'Carlos Ruiz',
            alert_type: 'inactive',
            message: 'No ha iniciado sesión en 7 días',
            severity: 'high',
          },
          {
            id: '2',
            student_name: 'Laura Martínez',
            alert_type: 'low_score',
            message: 'Promedio por debajo del 60% (3 ejercicios)',
            severity: 'medium',
          },
          {
            id: '3',
            student_name: 'Pedro Sánchez',
            alert_type: 'struggling',
            message: 'Múltiples intentos en el mismo ejercicio',
            severity: 'medium',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (date: Date): string => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'question':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <TeacherLayout user={user} onLogout={logout}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Cargando dashboard...</span>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout user={user} onLogout={logout}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard del Profesor
        </h1>
        <p className="text-gray-600">
          Bienvenido, Profesor. Aquí está el resumen de tu clase.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold">
          <PlusCircle className="w-5 h-5" />
          Crear Ejercicio
        </button>
        <button className="p-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 font-semibold">
          <FileText className="w-5 h-5" />
          Revisar Entregas
        </button>
        <button className="p-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 font-semibold">
          <Users className="w-5 h-5" />
          Ver Estudiantes
        </button>
        <button className="p-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 font-semibold">
          <BarChart3 className="w-5 h-5" />
          Analytics
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-600">
              {stats?.active_students}/{stats?.total_students} activos
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.total_students}
          </div>
          <div className="text-sm text-gray-600">Total Estudiantes</div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-semibold">+5% vs mes anterior</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.average_score}%
          </div>
          <div className="text-sm text-gray-600">Promedio de Clase</div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.average_completion}%
          </div>
          <div className="text-sm text-gray-600">Tasa de Completación</div>
        </div>

        {/* Pending Submissions */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            {stats && stats.total_submissions_pending > 0 && (
              <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                ¡Acción requerida!
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.total_submissions_pending}
          </div>
          <div className="text-sm text-gray-600">Entregas Pendientes</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl border-2 border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{activity.student_name}</div>
                    <div className="text-sm text-gray-700">{activity.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                  {activity.status === 'pending' && (
                    <span className="flex-shrink-0 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                      Revisar
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Ver todas las actividades →
            </button>
          </div>
        </div>

        {/* Student Alerts */}
        <div className="bg-white rounded-xl border-2 border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Alertas</h3>
            {stats && stats.students_at_risk > 0 && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                {stats.students_at_risk}
              </span>
            )}
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${getAlertColor(alert.severity)}`}
                >
                  <div className="font-semibold mb-1">{alert.student_name}</div>
                  <div className="text-sm mb-2">{alert.message}</div>
                  <button className="text-xs font-semibold hover:underline">
                    Ver detalles →
                  </button>
                </div>
              ))}
            </div>

            {alerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No hay alertas en este momento</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Mejores Estudiantes
          </h3>
          <div className="space-y-3">
            {[
              { name: 'María García', score: 98, exercises: 45 },
              { name: 'Juan Pérez', score: 95, exercises: 42 },
              { name: 'Ana López', score: 92, exercises: 40 },
            ].map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-600">
                      {student.exercises} ejercicios completados
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">{student.score}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Progress */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
            Progreso por Módulo
          </h3>
          <div className="space-y-4">
            {[
              { module: 'Introducción a ML', completion: 85, students: 38 },
              { module: 'Redes Neuronales', completion: 62, students: 35 },
              { module: 'Deep Learning', completion: 45, students: 28 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{item.module}</span>
                  <span className="text-sm text-gray-600">
                    {item.students} estudiantes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {item.completion}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};
