import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Save, Download } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { InteractiveCard } from './InteractiveCard';
import { DataVisualization } from './DataVisualization';
import { InfografiaInteractivaData, InfoCard } from './infografiaInteractivaTypes';
import { calculateScore, saveProgress, FeedbackData, DifficultyLevel } from '@shared/components/mechanics/mechanicsTypes';

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
  exercise?: InfografiaInteractivaData;
}

interface ExerciseState {
  cards: InfoCard[];
}

const getDefaultExercise = (exerciseId: string, difficulty: string): InfografiaInteractivaData => ({
  id: exerciseId,
  title: 'Infografía Interactiva',
  description: 'Explora la infografía interactiva revelando cada elemento',
  difficulty: difficulty as any,
  estimatedTime: 420,
  topic: 'Textos digitales interactivos',
  hints: [],
  cards: [
      {
        id: 'card-1',
        title: 'Descubrimientos de Marie Curie',
        content: 'Descubrió el polonio y el radio, revolucionando la física y la química.',
        position: { x: 20, y: 30 },
        icon: 'atom',
        revealed: false
      },
      {
        id: 'card-2',
        title: 'Premios Nobel',
        content: 'Primera persona en ganar dos Premios Nobel en diferentes disciplinas científicas.',
        position: { x: 50, y: 30 },
        icon: 'award',
        revealed: false
      },
      {
        id: 'card-3',
        title: 'Legado Científico',
        content: 'Sus investigaciones sentaron las bases de la radiología y la oncología moderna.',
        position: { x: 80, y: 30 },
        icon: 'microscope',
        revealed: false
      },
      {
        id: 'card-4',
        title: 'Pionera en Ciencia',
        content: 'Superó barreras de género para convertirse en una de las científicas más influyentes.',
        position: { x: 35, y: 70 },
        icon: 'star',
        revealed: false
      },
      {
        id: 'card-5',
        title: 'Impacto Mundial',
        content: 'Su trabajo ha salvado millones de vidas a través de aplicaciones médicas.',
        position: { x: 65, y: 70 },
        icon: 'heart',
        revealed: false
      }
  ],
  backgroundImage: undefined
});

export const InfografiaInteractivaExercise: React.FC<ExerciseProps> = ({
  moduleId,
  lessonId,
  exerciseId,
  userId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  difficulty = 'medium',
  exercise
}) => {
  const defaultExercise = getDefaultExercise(exerciseId, difficulty);
  const currentExercise = exercise || defaultExercise;
  const [cards, setCards] = useState<InfoCard[]>(initialData?.cards || currentExercise.cards);
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

  // Calculate progress
  const calculateProgress = () => {
    const revealedCount = cards.filter(c => c.revealed).length;
    return (revealedCount / cards.length) * 100;
  };

  // Calculate score
  const calculateCurrentScore = () => {
    const progress = calculateProgress();
    return Math.floor(progress);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState: ExerciseState = { cards };
      saveProgress(exerciseId, currentState);
    }, 30000);

    return () => clearInterval(interval);
  }, [cards, exerciseId]);

  // Update progress
  useEffect(() => {
    const progress = calculateProgress();
    const score = calculateCurrentScore();
    setCurrentScore(score);

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);

    onProgressUpdate?.(progress);

    // Auto-complete when all cards are revealed
    const allRevealed = cards.every(c => c.revealed);
    if (allRevealed && !showFeedback) {
      setTimeout(() => handleCheck(), 1000);
    }
  }, [cards, onProgressUpdate, startTime]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, revealed: !c.revealed } : c))
    );
  };

  // Handle reveal all
  const handleRevealAll = () => {
    setCards(prev => prev.map(c => ({ ...c, revealed: true })));
  };

  // Handle check/verification
  const handleCheck = async () => {
    const revealedCount = cards.filter(c => c.revealed).length;

    if (revealedCount < cards.length) {
      setFeedback({
        type: 'error',
        title: 'Exploración Incompleta',
        message: `Has explorado ${revealedCount} de ${cards.length} elementos. Explora todos para completar.`,
        showConfetti: false
      });
      setShowFeedback(true);
      return;
    }

    const endTime = new Date();
    const timeSpentSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const score = calculateScore(cards.length, cards.length);

    setFeedback({
      type: 'success',
      title: '¡Infografía Completada!',
      message: `Has explorado todos los ${cards.length} elementos de la infografía. ¡Excelente trabajo!`,
      score,
      showConfetti: true
    });
    setShowFeedback(true);
  };

  // Handle reset
  const handleReset = () => {
    setCards(currentExercise.cards);
    setFeedback(null);
    setShowFeedback(false);
  };

  // Handle save
  const handleSave = () => {
    const currentState: ExerciseState = { cards };
    saveProgress(exerciseId, currentState);

    setFeedback({
      type: 'info',
      title: 'Progreso Guardado',
      message: 'Tu exploración ha sido guardada correctamente.',
      showConfetti: false
    });
    setShowFeedback(true);
  };

  // Handle export
  const handleExport = () => {
    const exportData = {
      title: currentExercise.title,
      cards: cards.map(c => ({
        title: c.title,
        content: c.content,
        revealed: c.revealed
      })),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infografia-${exerciseId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback({
      type: 'info',
      title: 'Exportación Exitosa',
      message: 'La infografía se ha exportado correctamente.',
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
        },
        {
          label: 'Exportar',
          icon: <Download className="w-4 h-4" />,
          onClick: handleExport,
          variant: 'gold'
        }
      ]
    };
  }, [cards]);

  return (
    <>
      <DetectiveCard variant="default" padding="lg" className="mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-detective-orange/10 to-detective-blue/10 p-6 rounded-detective mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-detective-orange" />
            <h1 className="text-detective-3xl font-bold text-detective-text">{currentExercise.title}</h1>
          </div>
          <p className="text-detective-text-secondary mb-4">
            {currentExercise.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <DetectiveButton variant="gold" icon={<Eye />} onClick={handleRevealAll}>
              Revelar Todos
            </DetectiveButton>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="mb-6">
          <DataVisualization cards={cards} onCardClick={handleCardClick} />
        </div>

        {/* Interactive Cards Grid */}
        <div className="mb-6">
          <h2 className="text-detective-lg font-bold text-detective-text mb-4">
            Elementos de la Infografía
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <InteractiveCard card={card} onClick={() => handleCardClick(card.id)} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <DetectiveButton variant="secondary" onClick={onExit}>
            Salir
          </DetectiveButton>
          <DetectiveButton variant="blue" icon={<Save />} onClick={handleSave}>
            Guardar Progreso
          </DetectiveButton>
          <DetectiveButton variant="gold" icon={<Download />} onClick={handleExport}>
            Exportar
          </DetectiveButton>
          <DetectiveButton variant="primary" onClick={handleCheck}>
            Verificar Exploración
          </DetectiveButton>
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
