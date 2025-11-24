import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, List, Lightbulb, Save } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { calculateScore, saveProgress, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';

interface EssaySection {
  title: string;
  content: string;
  wordCount: number;
}

interface ExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: number) => void;
  initialData?: ExerciseState;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ExerciseState {
  topic: string;
  thesis: string;
  introduction: string;
  argument1: string;
  argument2: string;
  argument3: string;
  conclusion: string;
}

export const EnsayoArgumentativoExercise: React.FC<ExerciseProps> = ({
  exerciseId,
  userId,
  onComplete,
  onProgressUpdate,
  initialData,
  difficulty = 'medium'
}) => {
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [thesis, setThesis] = useState(initialData?.thesis || '');
  const [introduction, setIntroduction] = useState(initialData?.introduction || '');
  const [argument1, setArgument1] = useState(initialData?.argument1 || '');
  const [argument2, setArgument2] = useState(initialData?.argument2 || '');
  const [argument3, setArgument3] = useState(initialData?.argument3 || '');
  const [conclusion, setConclusion] = useState(initialData?.conclusion || '');

  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const actionsRef = useRef<{
    handleReset?: () => void;
    handleCheck?: () => void;
    specificActions?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'blue' | 'gold';
    }>;
  }>({});

  const topics = [
    'El legado de Marie Curie en la ciencia moderna',
    'Las mujeres en la ciencia: barreras y logros',
    'La importancia de la investigación científica básica',
    'Ética en la experimentación científica',
  ];

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const totalWords = countWords(introduction) + countWords(argument1) +
                     countWords(argument2) + countWords(argument3) + countWords(conclusion);

  const calculateProgress = () => {
    const sections = [introduction, argument1, argument2, argument3, conclusion];
    const completed = sections.filter(s => countWords(s) >= 80).length;
    return (completed / sections.length) * 100;
  };

  const getSuggestions = () => {
    const suggestions: string[] = [];
    if (!thesis) suggestions.push('Define una tesis clara antes de comenzar');
    if (countWords(introduction) < 100) suggestions.push('Desarrolla más la introducción (mínimo 100 palabras)');
    if (countWords(argument1) < 80) suggestions.push('Fortalece el primer argumento');
    if (countWords(argument2) < 80) suggestions.push('Desarrolla el segundo argumento');
    if (countWords(argument3) < 80) suggestions.push('Expande el tercer argumento');
    if (countWords(conclusion) < 100) suggestions.push('Amplía la conclusión');
    return suggestions;
  };

  // Calculate score based on completion
  const calculateCurrentScore = () => {
    const progress = calculateProgress();
    const hasThesis = thesis.trim().length > 0;
    const thesisBonus = hasThesis ? 10 : 0;
    return Math.min(100, Math.floor(progress + thesisBonus));
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState: ExerciseState = {
        topic, thesis, introduction, argument1, argument2, argument3, conclusion
      };
      saveProgress(exerciseId, currentState);
    }, 30000);

    return () => clearInterval(interval);
  }, [topic, thesis, introduction, argument1, argument2, argument3, conclusion, exerciseId]);

  // Update progress
  useEffect(() => {
    const progress = calculateProgress();
    const score = calculateCurrentScore();
    setCurrentScore(score);

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);

    onProgressUpdate?.(progress);
  }, [topic, thesis, introduction, argument1, argument2, argument3, conclusion, onProgressUpdate, startTime]);

  // Handle check/verification
  const handleCheck = async () => {
    const progress = calculateProgress();

    if (progress < 100) {
      setFeedback({
        type: 'error',
        title: 'Ensayo Incompleto',
        message: `Has completado ${Math.round(progress)}% del ensayo. Completa todas las secciones para finalizar.`,
        showConfetti: false
      });
      setShowFeedback(true);
      return;
    }

    const endTime = new Date();
    const score = calculateScore(5, 5);

    setFeedback({
      type: 'success',
      title: '¡Ensayo Completado!',
      message: `Excelente trabajo. Has completado todas las secciones del ensayo con un total de ${totalWords} palabras.`,
      score,
      showConfetti: true
    });
    setShowFeedback(true);
  };

  // Handle reset
  const handleReset = () => {
    setTopic('');
    setThesis('');
    setIntroduction('');
    setArgument1('');
    setArgument2('');
    setArgument3('');
    setConclusion('');
    setFeedback(null);
    setShowFeedback(false);
  };

  // Handle save
  const handleSave = () => {
    const currentState: ExerciseState = {
      topic, thesis, introduction, argument1, argument2, argument3, conclusion
    };
    saveProgress(exerciseId, currentState);

    setFeedback({
      type: 'info',
      title: 'Progreso Guardado',
      message: 'Tu trabajo ha sido guardado correctamente.',
      showConfetti: false
    });
    setShowFeedback(true);
  };

  // Attach actions to ref
  useEffect(() => {
    actionsRef.current = {
      handleReset,
      handleCheck,
      specificActions: [
        {
          label: 'Guardar',
          icon: <Save className="w-4 h-4" />,
          onClick: handleSave,
          variant: 'blue'
        }
      ]
    };
  }, [topic, thesis, introduction, argument1, argument2, argument3, conclusion]);

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Exercise Description */}
          <div className="bg-gradient-to-r from-detective-blue to-detective-orange rounded-detective p-6 text-white shadow-detective-lg">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8" />
              <h2 className="text-detective-2xl font-bold">Ensayo Argumentativo</h2>
            </div>
            <p className="text-detective-base opacity-90">
              Desarrolla un ensayo argumentativo sobre Marie Curie y temas científicos relacionados.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <DetectiveCard variant="default" padding="lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-detective-text font-medium mb-2">Tema del ensayo:</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none transition-colors"
                  >
                    <option value="">Selecciona un tema...</option>
                    {topics.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-detective-text font-medium mb-2">Tesis (Idea principal):</label>
                  <input
                    type="text"
                    value={thesis}
                    onChange={(e) => setThesis(e.target.value)}
                    placeholder="Ejemplo: Marie Curie revolucionó la ciencia moderna..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </DetectiveCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <DetectiveCard variant="default" padding="lg">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-detective-text font-medium mb-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full" />
                    Introducción ({countWords(introduction)} palabras, mín. 100)
                  </label>
                  <textarea
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    rows={6}
                    placeholder="Presenta el tema, contexto histórico y tu tesis..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-detective-text font-medium mb-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full" />
                    Argumento 1 ({countWords(argument1)} palabras, mín. 80)
                  </label>
                  <textarea
                    value={argument1}
                    onChange={(e) => setArgument1(e.target.value)}
                    rows={5}
                    placeholder="Desarrolla tu primer argumento con evidencia..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-detective-text font-medium mb-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                    Argumento 2 ({countWords(argument2)} palabras, mín. 80)
                  </label>
                  <textarea
                    value={argument2}
                    onChange={(e) => setArgument2(e.target.value)}
                    rows={5}
                    placeholder="Presenta tu segundo argumento..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-detective-text font-medium mb-2">
                    <span className="w-3 h-3 bg-purple-400 rounded-full" />
                    Argumento 3 ({countWords(argument3)} palabras, mín. 80)
                  </label>
                  <textarea
                    value={argument3}
                    onChange={(e) => setArgument3(e.target.value)}
                    rows={5}
                    placeholder="Desarrolla tu tercer argumento..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-detective-text font-medium mb-2">
                    <span className="w-3 h-3 bg-orange-400 rounded-full" />
                    Conclusión ({countWords(conclusion)} palabras, mín. 100)
                  </label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={6}
                    placeholder="Resume tus argumentos y refuerza tu tesis..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:outline-none resize-none transition-colors"
                  />
                </div>
              </div>
            </DetectiveCard>
          </motion.div>

          {/* Statistics Summary */}
          <DetectiveCard variant="default" padding="md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <List className="w-6 h-6 text-detective-orange mx-auto mb-2" />
                <p className="text-3xl font-bold text-detective-orange">{totalWords}</p>
                <p className="text-detective-text-secondary text-sm">Palabras totales</p>
              </div>
              <div className="text-center">
                <Lightbulb className="w-6 h-6 text-detective-gold mx-auto mb-2" />
                <p className="text-3xl font-bold text-detective-text">{calculateProgress()}%</p>
                <p className="text-detective-text-secondary text-sm">Progreso</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-detective-blue mx-auto mb-2" />
                <p className="text-3xl font-bold text-detective-text">{currentScore}</p>
                <p className="text-detective-text-secondary text-sm">Puntuación</p>
              </div>
              <div className="text-center">
                <FileText className="w-6 h-6 text-detective-text mx-auto mb-2" />
                <p className="text-3xl font-bold text-detective-text">
                  {[introduction, argument1, argument2, argument3, conclusion].filter(s => countWords(s) >= 80).length}/5
                </p>
                <p className="text-detective-text-secondary text-sm">Secciones completas</p>
              </div>
            </div>
          </DetectiveCard>

          {/* Suggestions or Completion Status */}
          {getSuggestions().length > 0 ? (
            <DetectiveCard variant="default" padding="md" className="bg-yellow-50 border-2 border-yellow-200">
              <p className="font-medium text-detective-text mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Sugerencias:
              </p>
              <ul className="space-y-1">
                {getSuggestions().map((suggestion, idx) => (
                  <li key={idx} className="text-detective-text-secondary text-sm flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </DetectiveCard>
          ) : totalWords > 0 ? (
            <DetectiveCard variant="default" padding="md" className="bg-green-50 border-2 border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-800">¡Ensayo completo!</p>
              </div>
            </DetectiveCard>
          ) : null}
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success' && feedback.score) {
              onComplete?.(feedback.score, timeSpent);
            }
          }}
          onRetry={handleReset}
        />
      )}
    </>
  );
};
