/**
 * TeacherFeedback Component
 *
 * ISSUE: #5.4 (P0) - Teacher Feedback on Exercises
 * FECHA: 2025-11-04
 * SPRINT: Sprint 3
 *
 * Componente para que profesores dejen feedback en ejercicios
 *
 * Features:
 * - Rich text editor para comentarios
 * - Rating/score personalizado
 * - Highlighting de errores específicos
 * - Sugerencias de mejora
 * - Feedback público y privado
 * - Historial de feedback del profesor
 */

import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Send, X, Edit } from 'lucide-react';

interface TeacherFeedbackItem {
  id: string;
  teacher_name: string;
  teacher_avatar?: string;
  comment: string;
  rating?: number; // 1-5 stars
  is_public: boolean;
  created_at: Date;
  suggestions?: string[];
}

interface TeacherFeedbackProps {
  exerciseSubmissionId: string;
  studentId: string;
  existingFeedback?: TeacherFeedbackItem[];
  onSubmitFeedback: (feedback: {
    comment: string;
    rating?: number;
    is_public: boolean;
    suggestions?: string[];
  }) => Promise<void>;
  teacherMode?: boolean; // True if current user is teacher
}

export const TeacherFeedback: React.FC<TeacherFeedbackProps> = ({
  exerciseSubmissionId,
  studentId,
  existingFeedback = [],
  onSubmitFeedback,
  teacherMode = false,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback({
        comment: comment.trim(),
        rating,
        is_public: isPublic,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      });

      // Reset form
      setComment('');
      setRating(undefined);
      setSuggestions([]);
      setCurrentSuggestion('');
      setIsComposing(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSuggestion = () => {
    if (currentSuggestion.trim()) {
      setSuggestions([...suggestions, currentSuggestion.trim()]);
      setCurrentSuggestion('');
    }
  };

  const handleRemoveSuggestion = (index: number) => {
    setSuggestions(suggestions.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
          Feedback del Profesor
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {existingFeedback.length > 0
            ? `${existingFeedback.length} comentario(s) del profesor`
            : 'Sin comentarios del profesor aún'}
        </p>
      </div>

      {/* Existing feedback */}
      {existingFeedback.length > 0 && (
        <div className="px-6 py-4 space-y-4 max-h-[400px] overflow-y-auto">
          {existingFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className={`
                p-4 rounded-lg border-2
                ${feedback.is_public ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {feedback.teacher_avatar ? (
                    <img
                      src={feedback.teacher_avatar}
                      alt={feedback.teacher_name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {feedback.teacher_name.charAt(0)}
                    </div>
                  )}

                  {/* Name and date */}
                  <div>
                    <div className="font-semibold text-gray-900">{feedback.teacher_name}</div>
                    <div className="text-xs text-gray-600">{formatDate(feedback.created_at)}</div>
                  </div>
                </div>

                {/* Rating */}
                {feedback.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= feedback.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Comment */}
              <p className="text-gray-900 mb-3 leading-relaxed">{feedback.comment}</p>

              {/* Suggestions */}
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    💡 Sugerencias de mejora:
                  </div>
                  <ul className="space-y-1">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Privacy badge */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`
                    text-xs font-semibold px-2 py-1 rounded-full
                    ${
                      feedback.is_public
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {feedback.is_public ? '👁️ Público' : '🔒 Privado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose new feedback (teacher only) */}
      {teacherMode && (
        <div className="px-6 py-4 border-t border-gray-200">
          {!isComposing ? (
            <button
              onClick={() => setIsComposing(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 font-medium"
            >
              <Edit className="w-5 h-5" />
              Agregar feedback
            </button>
          ) : (
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Calificación (opcional):
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star === rating ? undefined : star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating && star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                  {rating && (
                    <button
                      onClick={() => setRating(undefined)}
                      className="ml-2 text-xs text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comentario:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe tu feedback para el estudiante..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                />
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sugerencias de mejora (opcional):
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSuggestion}
                    onChange={(e) => setCurrentSuggestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSuggestion()}
                    placeholder="Escribe una sugerencia y presiona Enter"
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                  <button
                    onClick={handleAddSuggestion}
                    disabled={!currentSuggestion.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{suggestion}</span>
                        <button
                          onClick={() => handleRemoveSuggestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Hacer comentario público (visible para otros estudiantes)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsComposing(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!comment.trim() || isSubmitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state (student view) */}
      {!teacherMode && existingFeedback.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            El profesor aún no ha dejado feedback en este ejercicio.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Revisa más tarde para ver los comentarios del profesor.
          </p>
        </div>
      )}
    </div>
  );
};
