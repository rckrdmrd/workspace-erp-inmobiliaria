import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { calculateScore, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import type {
  LecturaInferencialExerciseProps,
  QuestionAnswer,
} from './lecturaInferencialTypes';

export const LecturaInferencialExercise: React.FC<LecturaInferencialExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [validated, setValidated] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [startTime] = useState(new Date());

  const questions = exercise.content.questions;

  // FE-055 & FE-059: Notify parent of progress updates WITH user answers
  useEffect(() => {
    if (onProgressUpdate) {
      const answeredCount = Object.keys(selectedAnswers).length;
      const score = validated ? calculateCurrentScore() : 0;

      // Prepare user answers in backend DTO format
      const userAnswers: Record<string, string> = {};
      Object.entries(selectedAnswers).forEach(([questionId, optionIndex]) => {
        userAnswers[questionId] = String(optionIndex); // Convert index to string
      });

      onProgressUpdate({
        progress: {
          currentStep: answeredCount,
          totalSteps: questions.length,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed: 0,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { questions: userAnswers }  // FE-066: Wrap in 'questions' key to match DTO
      });

      console.log('📊 [LecturaInferencial] Progress update sent:', {
        answered: answeredCount,
        totalQuestions: questions.length,
        answersFormat: Object.keys(userAnswers).length > 0 ? 'valid' : 'empty'
      });
    }
  }, [selectedAnswers, validated, startTime, onProgressUpdate, questions.length]);

  const calculateCurrentScore = () => {
    if (answers.length === 0) return 0;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    return calculateScore(correctAnswers, questions.length);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (!validated) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex
      }));
    }
  };

  const handleCheck = useCallback(() => {
    if (validated) {
      // Already validated, show results again
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const totalQuestions = questions.length;
      const finalScore = calculateScore(correctAnswers, totalQuestions);
      const percentage = (correctAnswers / totalQuestions) * 100;

      setFeedback({
        type: percentage >= 70 ? 'success' : percentage >= 50 ? 'partial' : 'error',
        title: percentage >= 70 ? '¡Excelente trabajo!' : percentage >= 50 ? 'Buen intento' : 'Necesitas practicar más',
        message: `Respondiste correctamente ${correctAnswers} de ${totalQuestions} preguntas (${Math.round(percentage)}%).`,
        score: finalScore,
        showConfetti: percentage >= 70,
      });
      setShowFeedback(true);
      return;
    }

    // Check if all questions are answered
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      setFeedback({
        type: 'error',
        title: 'Faltan preguntas por responder',
        message: `Has respondido ${answeredCount} de ${questions.length} preguntas. Por favor responde todas las preguntas antes de verificar.`,
      });
      setShowFeedback(true);
      return;
    }

    // Validate all answers
    const validatedAnswers: QuestionAnswer[] = questions.map(q => {
      const selectedOption = selectedAnswers[q.id];
      const isCorrect = selectedOption === q.correctAnswer;
      return {
        questionId: q.id,
        selectedOption,
        isCorrect,
        timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
      };
    });

    setAnswers(validatedAnswers);
    setValidated(true);

    // Show final results
    const correctAnswers = validatedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = questions.length;
    const finalScore = calculateScore(correctAnswers, totalQuestions);
    const percentage = (correctAnswers / totalQuestions) * 100;

    setFeedback({
      type: percentage >= 70 ? 'success' : percentage >= 50 ? 'partial' : 'error',
      title: percentage >= 70 ? '¡Excelente trabajo!' : percentage >= 50 ? 'Buen intento' : 'Necesitas practicar más',
      message: `Respondiste correctamente ${correctAnswers} de ${totalQuestions} preguntas (${Math.round(percentage)}%).`,
      score: finalScore,
      showConfetti: percentage >= 70,
    });
    setShowFeedback(true);
  }, [selectedAnswers, validated, answers, questions, startTime]);

  const handleReset = useCallback(() => {
    setSelectedAnswers({});
    setValidated(false);
    setAnswers([]);
    setShowFeedback(false);
    setFeedback(null);
  }, []);

  // Populate actionsRef for parent component
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck,
      };
    }
  }, [actionsRef, handleReset, handleCheck]);

  const getInferenceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      causa_efecto: 'Causa y Efecto',
      contexto_situacional: 'Contexto Situacional',
      motivacion: 'Motivación',
      prediccion: 'Predicción',
      conclusion: 'Conclusión',
      interpretacion: 'Interpretación',
    };
    return labels[type] || type;
  };

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div
            className="rounded-detective p-6 shadow-detective-lg"
            style={{
              background: 'linear-gradient(to right, #1e3a8a, #f97316)',
              color: 'white'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-white" />
              <h1 className="text-detective-3xl font-bold text-white">{exercise.title}</h1>
            </div>
            <p className="text-detective-base text-white" style={{ opacity: 0.9 }}>
              Lee el pasaje cuidadosamente y responde las preguntas de inferencia
            </p>
          </div>

          {/* Reading Passage */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-detective p-6">
            <h3 className="text-detective-lg font-semibold text-detective-blue mb-4">
              Pasaje de Lectura
            </h3>
            <p className="text-detective-base text-detective-text leading-relaxed whitespace-pre-line">
              {exercise.content.passage}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-detective-sm text-detective-text-secondary">
              Preguntas respondidas: {Object.keys(selectedAnswers).length} de {questions.length}
            </div>
            {validated && (
              <div className="text-detective-sm font-bold text-detective-blue">
                Correctas: {answers.filter(a => a.isCorrect).length} / {questions.length}
              </div>
            )}
          </div>

          {/* All Questions */}
          <div className="space-y-6">
            {questions.map((question, qIdx) => {
              const selectedOption = selectedAnswers[question.id];
              const answer = answers.find(a => a.questionId === question.id);

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIdx * 0.1 }}
                  className="bg-white border-2 border-detective-border-light rounded-detective p-6"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-detective-sm font-bold text-detective-orange">
                          Pregunta {qIdx + 1}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-detective-xs font-bold rounded-lg">
                          {getInferenceTypeLabel(question.inference_type)}
                        </span>
                      </div>
                      <h3 className="text-detective-base font-semibold text-detective-blue">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  {/* Options in 2-column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {question.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === question.correctAnswer;
                      const showCorrectness = validated;

                      let optionClasses = 'p-4 rounded-lg border-2 cursor-pointer transition-all text-left';

                      if (showCorrectness) {
                        if (isCorrect) {
                          optionClasses += ' bg-green-50 border-green-500 text-green-900';
                        } else if (isSelected && !isCorrect) {
                          optionClasses += ' bg-red-50 border-red-500 text-red-900';
                        } else {
                          optionClasses += ' bg-gray-50 border-gray-300 text-gray-600';
                        }
                      } else {
                        if (isSelected) {
                          optionClasses += ' bg-detective-orange border-detective-orange text-white';
                        } else {
                          optionClasses += ' bg-white border-gray-300 text-detective-text hover:border-detective-orange';
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileHover={!validated ? { scale: 1.02 } : {}}
                          whileTap={!validated ? { scale: 0.98 } : {}}
                          onClick={() => handleSelectOption(question.id, idx)}
                          disabled={validated}
                          className={optionClasses}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              showCorrectness && isCorrect
                                ? 'bg-green-500 border-green-500'
                                : showCorrectness && isSelected && !isCorrect
                                ? 'bg-red-500 border-red-500'
                                : isSelected
                                ? 'bg-white border-white'
                                : 'border-current'
                            }`}>
                              {showCorrectness && isCorrect && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                              {showCorrectness && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-white" />
                              )}
                              {!showCorrectness && isSelected && (
                                <div className="w-3 h-3 rounded-full bg-detective-orange" />
                              )}
                            </div>
                            <span className="text-detective-sm">{option}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation (shown after validation) */}
                  {validated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-2 ${
                        answer?.isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-blue-50 border-blue-300'
                      }`}
                    >
                      <p className="text-detective-sm font-medium mb-2">
                        {answer?.isCorrect ? '✓ Explicación:' : '📘 Explicación:'}
                      </p>
                      <p className="text-detective-sm text-detective-text">
                        {question.explanation}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success' && onComplete) {
              const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
              onComplete(feedback.score || 0, timeSpent);
            }
          }}
          onRetry={() => {
            setShowFeedback(false);
            handleReset();
          }}
        />
      )}
    </>
  );
};

export default LecturaInferencialExercise;
