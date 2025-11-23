import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, CheckSquare } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { ExerciseProps, ResenaCriticaState, CriteriaState } from './resenaCriticaTypes';
import { FeedbackData, normalizeProgressUpdate } from '@shared/components/mechanics/mechanicsTypes';
import { saveProgress as saveProgressUtil } from '@/shared/utils/storage';

export const ResenaCriticaExercise: React.FC<ExerciseProps> = ({
  exerciseId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  exercise,
}) => {
  // State management
  const [title, setTitle] = useState(initialData?.title || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [analysis, setAnalysis] = useState(initialData?.analysis || '');
  const [recommendation, setRecommendation] = useState(initialData?.recommendation || '');
  const [criteria, setCriteria] = useState<CriteriaState>(
    initialData?.criteria || {
      accuracy: false,
      clarity: false,
      depth: false,
      relevance: false,
      sources: false,
    }
  );

  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const works = exercise?.works || [
    'Marie Curie: A Life - Susan Quinn',
    'Radioactive: Marie & Pierre Curie - Lauren Redniss',
    'Madame Curie: A Biography - Ève Curie',
    'Marie Curie and Her Daughters - Shelley Emling',
  ];

  const minSummaryLength = exercise?.minSummaryLength || 100;
  const minAnalysisLength = exercise?.minAnalysisLength || 150;
  const minRecommendationLength = exercise?.minRecommendationLength || 50;

  // Calculate score
  const calculateScore = () => {
    const criteriaCount = Object.values(criteria).filter(Boolean).length;
    const contentScore =
      (summary.length >= minSummaryLength ? 20 : 0) +
      (analysis.length >= minAnalysisLength ? 30 : 0) +
      (recommendation.length >= minRecommendationLength ? 20 : 0);
    const ratingScore = rating * 6;
    return Math.min(criteriaCount * 6 + contentScore + ratingScore, 100);
  };

  // Calculate progress
  const calculateProgress = () => {
    let progress = 0;
    if (title) progress += 10;
    if (rating > 0) progress += 10;
    if (summary.length >= minSummaryLength) progress += 20;
    if (analysis.length >= minAnalysisLength) progress += 30;
    if (recommendation.length >= minRecommendationLength) progress += 20;
    progress += Object.values(criteria).filter(Boolean).length * 2; // 5 criteria * 2 = 10%
    return Math.min(progress, 100);
  };

  // Progress tracking
  useEffect(() => {
    const progress = calculateProgress();
    onProgressUpdate?.(
      normalizeProgressUpdate(progress, 0, 1, 0, 0)
    );
  }, [title, rating, summary, analysis, recommendation, criteria]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Auto-save logic here
      const currentState: ResenaCriticaState = {
        title,
        rating,
        summary,
        analysis,
        recommendation,
        criteria,
      };
      // Save using shared utility
      saveProgressUtil(exerciseId, currentState);
    }, 30000); // Every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [title, rating, summary, analysis, recommendation, criteria, exerciseId]);

  // Reset handler
  const handleReset = () => {
    setTitle('');
    setRating(0);
    setSummary('');
    setAnalysis('');
    setRecommendation('');
    setCriteria({
      accuracy: false,
      clarity: false,
      depth: false,
      relevance: false,
      sources: false,
    });
    setFeedback(null);
    setShowFeedback(false);
  };

  // Check/Verify handler
  const handleCheck = () => {
    const score = calculateScore();
    const timeSpent = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );

    const isComplete =
      title &&
      rating > 0 &&
      summary.length >= minSummaryLength &&
      analysis.length >= minAnalysisLength &&
      recommendation.length >= minRecommendationLength;

    if (!isComplete) {
      setFeedback({
        type: 'error',
        title: 'Reseña Incompleta',
        message: 'Por favor completa todos los campos con los requisitos mínimos.',
      });
      setShowFeedback(true);
      return;
    }

    const criteriaCount = Object.values(criteria).filter(Boolean).length;
    const feedbackType: 'success' | 'partial' = criteriaCount >= 4 ? 'success' : 'partial';

    setFeedback({
      type: feedbackType,
      title: feedbackType === 'success' ? '¡Excelente Reseña!' : 'Reseña Completa',
      message:
        feedbackType === 'success'
          ? '¡Has creado una reseña crítica detallada y bien fundamentada!'
          : 'Tu reseña está completa. Considera agregar más criterios para mejorar tu puntuación.',
      score: score,
      showConfetti: feedbackType === 'success',
    });
    setShowFeedback(true);
  };

  return (
    <>
      <DetectiveCard variant="default" padding="lg" className="mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-detective-orange/10 to-detective-blue/10 p-6 rounded-detective mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-detective-orange" />
            <h1 className="text-detective-3xl font-bold text-detective-text">
              Reseña Crítica
            </h1>
          </div>
          <p className="text-detective-text-secondary">
            Escribe una reseña crítica sobre una obra relacionada con Marie Curie.
          </p>
        </div>

        {/* Work Selection & Rating */}
        <div className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-detective-text font-medium mb-2">
                Obra a reseñar:
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border-2 border-detective-border-medium rounded-detective focus:border-detective-orange focus:outline-none transition-colors"
              >
                <option value="">Selecciona una obra...</option>
                {works.map((work: string, idx: number) => (
                  <option key={idx} value={work}>
                    {work}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-detective-text font-medium mb-2">
                Calificación:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-10 h-10 transition-all ${
                        star <= rating
                          ? 'fill-detective-gold text-detective-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
                <span className="ml-3 text-2xl font-bold text-detective-text">
                  {rating}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-detective-text font-medium mb-2">
                Resumen ({summary.length} caracteres, mín. {minSummaryLength})
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                placeholder="Resume brevemente la obra..."
                className="w-full px-4 py-2 border-2 border-detective-border-medium rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
              />
              {summary.length > 0 && summary.length < minSummaryLength && (
                <p className="text-detective-text-secondary text-sm mt-1">
                  Faltan {minSummaryLength - summary.length} caracteres
                </p>
              )}
            </div>

            <div>
              <label className="block text-detective-text font-medium mb-2">
                Análisis Crítico ({analysis.length} caracteres, mín.{' '}
                {minAnalysisLength})
              </label>
              <textarea
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
                rows={8}
                placeholder="Analiza aspectos positivos y negativos, estilo, precisión histórica..."
                className="w-full px-4 py-2 border-2 border-detective-border-medium rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
              />
              {analysis.length > 0 && analysis.length < minAnalysisLength && (
                <p className="text-detective-text-secondary text-sm mt-1">
                  Faltan {minAnalysisLength - analysis.length} caracteres
                </p>
              )}
            </div>

            <div>
              <label className="block text-detective-text font-medium mb-2">
                Recomendación ({recommendation.length} caracteres, mín.{' '}
                {minRecommendationLength})
              </label>
              <textarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                rows={3}
                placeholder="¿A quién recomendarías esta obra y por qué?"
                className="w-full px-4 py-2 border-2 border-detective-border-medium rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
              />
              {recommendation.length > 0 &&
                recommendation.length < minRecommendationLength && (
                  <p className="text-detective-text-secondary text-sm mt-1">
                    Faltan {minRecommendationLength - recommendation.length}{' '}
                    caracteres
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Criteria Checklist */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-detective-orange" />
            <h3 className="font-bold text-detective-text">Criterios de Evaluación</h3>
          </div>
          <div className="space-y-3">
            {Object.entries({
              accuracy: 'Precisión histórica',
              clarity: 'Claridad de escritura',
              depth: 'Profundidad del análisis',
              relevance: 'Relevancia del tema',
              sources: 'Uso de fuentes',
            }).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer hover:bg-detective-bg-secondary/50 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={criteria[key as keyof typeof criteria]}
                  onChange={(e) =>
                    setCriteria({ ...criteria, [key]: e.target.checked })
                  }
                  className="w-5 h-5 text-detective-orange focus:ring-detective-orange border-gray-300 rounded"
                />
                <span className="text-detective-text text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <DetectiveButton
            variant="primary"

            onClick={handleCheck}
          >
            Verificar Reseña
          </DetectiveButton>
          <DetectiveButton
            variant="secondary"

            onClick={handleReset}
          >
            Reiniciar
          </DetectiveButton>
          {onExit && (
            <DetectiveButton
              variant="secondary"

              onClick={onExit}
            >
              Salir
            </DetectiveButton>
          )}
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success' && onComplete) {
              const timeSpent = Math.floor(
                (new Date().getTime() - startTime.getTime()) / 1000
              );
              onComplete(calculateScore(), timeSpent);
            }
          }}
          onRetry={() => {
            setShowFeedback(false);
          }}
        />
      )}
    </>
  );
};
