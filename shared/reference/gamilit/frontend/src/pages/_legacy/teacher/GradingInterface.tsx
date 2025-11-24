/**
 * GradingInterface Component
 *
 * Allows teachers to review and grade student exercise submissions.
 * Provides detailed view of student answers, time spent, hints used,
 * and allows teachers to provide feedback and adjust scores.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  User,
  BookOpen,
  Filter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Calendar,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { TeacherLayout } from '@/apps/teacher/layouts/TeacherLayout';

// ===== TYPES =====

interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  exercise_id: string;
  exercise_title: string;
  module_name: string;
  exercise_type: string;
  submitted_at: Date;
  time_spent_seconds: number;
  hints_used: number;
  is_correct: boolean;
  score_percentage: number;
  auto_graded: boolean;
  teacher_feedback?: string;
  teacher_adjusted_score?: number;
  status: 'pending' | 'graded' | 'needs_review';
  student_answer: any;
  correct_answer: any;
}

interface FeedbackForm {
  submissionId: string;
  feedback: string;
  adjustedScore?: number;
}

// ===== MAIN COMPONENT =====

export const GradingInterface: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [feedbackForms, setFeedbackForms] = useState<Map<string, FeedbackForm>>(new Map());
  const [savingFeedback, setSavingFeedback] = useState<Set<string>>(new Set());

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'graded' | 'needs_review'>('pending');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'time'>('date');

  // Load submissions
  useEffect(() => {
    const loadSubmissions = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const token = localStorage.getItem('access_token');
        // const response = await fetch('/api/teacher/submissions', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();

        // Mock data for development
        const mockSubmissions: Submission[] = [
          {
            id: '1',
            student_id: 's1',
            student_name: 'María González',
            exercise_id: 'e1',
            exercise_title: 'Conversión de números mayas',
            module_name: 'Sistema Numérico Vigesimal',
            exercise_type: 'multiple_choice',
            submitted_at: new Date('2025-11-03T14:30:00'),
            time_spent_seconds: 180,
            hints_used: 1,
            is_correct: true,
            score_percentage: 100,
            auto_graded: true,
            status: 'graded',
            student_answer: { selected_option: 'opt2' },
            correct_answer: { correct_option: 'opt2' },
          },
          {
            id: '2',
            student_id: 's2',
            student_name: 'Carlos Ramírez',
            exercise_id: 'e2',
            exercise_title: 'Suma en sistema vigesimal',
            module_name: 'Operaciones Básicas',
            exercise_type: 'fill_blank',
            submitted_at: new Date('2025-11-03T10:15:00'),
            time_spent_seconds: 240,
            hints_used: 2,
            is_correct: false,
            score_percentage: 60,
            auto_graded: true,
            status: 'needs_review',
            teacher_feedback: 'Revisa el concepto de carry en base 20',
            student_answer: { blanks: ['15', '20', '400'] },
            correct_answer: { blanks: ['15', '20', '420'] },
          },
          {
            id: '3',
            student_id: 's3',
            student_name: 'Ana Martínez',
            exercise_id: 'e3',
            exercise_title: 'Ordenar proceso de multiplicación',
            module_name: 'Operaciones Básicas',
            exercise_type: 'ordering',
            submitted_at: new Date('2025-11-02T16:45:00'),
            time_spent_seconds: 300,
            hints_used: 0,
            is_correct: false,
            score_percentage: 40,
            auto_graded: true,
            status: 'pending',
            student_answer: { sequence: ['step3', 'step1', 'step2', 'step4'] },
            correct_answer: { sequence: ['step1', 'step2', 'step3', 'step4'] },
          },
          {
            id: '4',
            student_id: 's1',
            student_name: 'María González',
            exercise_id: 'e4',
            exercise_title: 'Identificar símbolos mayas',
            module_name: 'Introducción a las Matemáticas Mayas',
            exercise_type: 'matching',
            submitted_at: new Date('2025-11-01T09:20:00'),
            time_spent_seconds: 150,
            hints_used: 1,
            is_correct: true,
            score_percentage: 90,
            auto_graded: true,
            status: 'graded',
            teacher_feedback: '¡Excelente trabajo! Solo un error menor.',
            teacher_adjusted_score: 95,
            student_answer: { pairs: [['a1', 'b1'], ['a2', 'b3'], ['a3', 'b2']] },
            correct_answer: { pairs: [['a1', 'b1'], ['a2', 'b2'], ['a3', 'b3']] },
          },
        ];

        setSubmissions(mockSubmissions);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  // Get unique modules and students for filters
  const uniqueModules = useMemo(() => {
    const modules = new Set(submissions.map((s) => s.module_name));
    return Array.from(modules);
  }, [submissions]);

  const uniqueStudents = useMemo(() => {
    const students = new Map<string, string>();
    submissions.forEach((s) => students.set(s.student_id, s.student_name));
    return Array.from(students.entries());
  }, [submissions]);

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    let filtered = [...submissions];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === selectedStatus);
    }

    // Filter by module
    if (selectedModule !== 'all') {
      filtered = filtered.filter((s) => s.module_name === selectedModule);
    }

    // Filter by student
    if (selectedStudent !== 'all') {
      filtered = filtered.filter((s) => s.student_id === selectedStudent);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.submitted_at.getTime() - a.submitted_at.getTime();
        case 'score':
          return a.score_percentage - b.score_percentage;
        case 'time':
          return b.time_spent_seconds - a.time_spent_seconds;
        default:
          return 0;
      }
    });

    return filtered;
  }, [submissions, selectedStatus, selectedModule, selectedStudent, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const needsReview = submissions.filter((s) => s.status === 'needs_review').length;
    const avgScore = total > 0
      ? Math.round(submissions.reduce((sum, s) => sum + s.score_percentage, 0) / total)
      : 0;

    return { total, pending, needsReview, avgScore };
  }, [submissions]);

  // Toggle submission expansion
  const toggleExpanded = (submissionId: string) => {
    setExpandedSubmission((prev) => (prev === submissionId ? null : submissionId));
  };

  // Update feedback form
  const updateFeedbackForm = (submissionId: string, field: keyof FeedbackForm, value: any) => {
    setFeedbackForms((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(submissionId) || { submissionId, feedback: '' };
      newMap.set(submissionId, { ...existing, [field]: value });
      return newMap;
    });
  };

  // Save feedback
  const saveFeedback = async (submissionId: string) => {
    const form = feedbackForms.get(submissionId);
    if (!form || !form.feedback.trim()) {
      return;
    }

    setSavingFeedback((prev) => new Set(prev).add(submissionId));

    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('access_token');
      // await fetch(`/api/teacher/submissions/${submissionId}/feedback`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     feedback: form.feedback,
      //     adjusted_score: form.adjustedScore,
      //   }),
      // });

      console.log('Saving feedback:', { submissionId, ...form });

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                teacher_feedback: form.feedback,
                teacher_adjusted_score: form.adjustedScore,
                status: 'graded',
              }
            : s
        )
      );

      // Clear form
      setFeedbackForms((prev) => {
        const newMap = new Map(prev);
        newMap.delete(submissionId);
        return newMap;
      });

      alert('Retroalimentación guardada exitosamente');
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Error al guardar la retroalimentación');
    } finally {
      setSavingFeedback((prev) => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render student answer based on exercise type
  const renderStudentAnswer = (submission: Submission) => {
    switch (submission.exercise_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Respuesta seleccionada:</p>
            <p className="text-white">{submission.student_answer.selected_option}</p>
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Respuesta:</p>
            <p className="text-white">{submission.student_answer.answer ? 'Verdadero' : 'Falso'}</p>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Respuestas en espacios en blanco:</p>
            <div className="grid grid-cols-2 gap-2">
              {submission.student_answer.blanks?.map((blank: string, idx: number) => {
                const isCorrect = blank === submission.correct_answer.blanks?.[idx];
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg ${
                      isCorrect ? 'bg-green-600/20 border border-green-600/50' : 'bg-red-600/20 border border-red-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">Espacio #{idx + 1}</p>
                        <p className="text-white">{blank}</p>
                        {!isCorrect && (
                          <p className="text-xs text-green-400 mt-1">
                            Correcto: {submission.correct_answer.blanks?.[idx]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'ordering':
        return (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Secuencia ordenada por el estudiante:</p>
            <ol className="list-decimal list-inside space-y-1">
              {submission.student_answer.sequence?.map((item: string, idx: number) => {
                const isCorrect = item === submission.correct_answer.sequence?.[idx];
                return (
                  <li
                    key={idx}
                    className={`p-2 rounded ${isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'}`}
                  >
                    <span className="text-white">{item}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Pares creados por el estudiante:</p>
            <div className="space-y-2">
              {submission.student_answer.pairs?.map((pair: [string, string], idx: number) => {
                const correctPair = submission.correct_answer.pairs?.find(
                  (cp: [string, string]) => cp[0] === pair[0]
                );
                const isCorrect = correctPair && correctPair[1] === pair[1];
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg flex items-center justify-between ${
                      isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'
                    }`}
                  >
                    <span className="text-white">
                      {pair[0]} ↔ {pair[1]}
                    </span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return <p className="text-slate-400 text-sm">Tipo de ejercicio no reconocido</p>;
    }
  };

  if (isLoading) {
    return (
      <TeacherLayout user={user} onLogout={logout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando entregas...</p>
          </div>
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
        <h1 className="text-3xl font-bold text-white">Revisar Entregas</h1>
        <p className="text-slate-400 mt-1">
          Califica y proporciona retroalimentación a tus estudiantes
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-slate-400">Total de Entregas</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
          <p className="text-sm text-slate-400">Pendientes de Revisar</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.needsReview}</p>
          <p className="text-sm text-slate-400">Requieren Atención</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgScore}%</p>
          <p className="text-sm text-slate-400">Puntuación Promedio</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="needs_review">Requieren atención</option>
            <option value="graded">Calificados</option>
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
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los estudiantes</option>
            {uniqueStudents.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="score">Ordenar por puntuación</option>
            <option value="time">Ordenar por tiempo</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => {
            const isExpanded = expandedSubmission === submission.id;
            const feedbackForm = feedbackForms.get(submission.id);
            const isSaving = savingFeedback.has(submission.id);

            return (
              <div key={submission.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                {/* Submission Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-750 transition-colors"
                  onClick={() => toggleExpanded(submission.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            submission.is_correct
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-red-600/20 text-red-400'
                          }`}
                        >
                          {submission.score_percentage}%
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold">{submission.exercise_title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {submission.student_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {submission.module_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {submission.submitted_at.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(submission.time_spent_seconds)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            {submission.hints_used} pistas
                          </span>
                        </div>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'graded'
                              ? 'bg-green-600/20 text-green-400'
                              : submission.status === 'needs_review'
                              ? 'bg-yellow-600/20 text-yellow-400'
                              : 'bg-blue-600/20 text-blue-400'
                          }`}
                        >
                          {submission.status === 'graded'
                            ? 'Calificado'
                            : submission.status === 'needs_review'
                            ? 'Requiere atención'
                            : 'Pendiente'}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submission Details (Expanded) */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-4 bg-slate-750">
                    {/* Student Answer */}
                    <div className="mb-4">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Respuesta del Estudiante
                      </h4>
                      {renderStudentAnswer(submission)}
                    </div>

                    {/* Existing Feedback */}
                    {submission.teacher_feedback && (
                      <div className="mb-4 bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Retroalimentación Previa
                        </h4>
                        <p className="text-white">{submission.teacher_feedback}</p>
                        {submission.teacher_adjusted_score !== undefined && (
                          <p className="text-sm text-slate-400 mt-2">
                            Puntuación ajustada: {submission.teacher_adjusted_score}%
                          </p>
                        )}
                      </div>
                    )}

                    {/* Feedback Form */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        Proporcionar Retroalimentación
                      </h4>

                      <div className="space-y-3">
                        <textarea
                          value={feedbackForm?.feedback || ''}
                          onChange={(e) => updateFeedbackForm(submission.id, 'feedback', e.target.value)}
                          placeholder="Escribe tu retroalimentación aquí..."
                          className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={3}
                        />

                        <div className="flex items-center gap-4">
                          <label className="text-sm text-slate-300">
                            Ajustar puntuación (opcional):
                          </label>
                          <input
                            type="number"
                            value={feedbackForm?.adjustedScore || ''}
                            onChange={(e) =>
                              updateFeedbackForm(
                                submission.id,
                                'adjustedScore',
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                            min="0"
                            max="100"
                            placeholder={submission.score_percentage.toString()}
                            className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-24"
                          />
                          <span className="text-slate-400 text-sm">%</span>
                        </div>

                        <button
                          onClick={() => saveFeedback(submission.id)}
                          disabled={isSaving || !feedbackForm?.feedback.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Enviar Retroalimentación
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No hay entregas que coincidan con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};
