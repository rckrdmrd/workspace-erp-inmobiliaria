import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { CrucigramaGrid } from './CrucigramaGrid';
import { CrucigramaClue } from './CrucigramaClue';
import { CrucigramaData, CrucigramaCell } from './crucigramaTypes';
import { calculateScore, saveProgress } from '@shared/components/mechanics/mechanicsTypes';
import { FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface CrucigramaExerciseProps {
  exercise: CrucigramaData;
  onComplete?: () => void;
  onSubmit?: (answers: any) => Promise<void>;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
  }>;
}

export const CrucigramaExercise: React.FC<CrucigramaExerciseProps> = ({
  exercise,
  onComplete,
  onSubmit,
  onProgressUpdate,
  actionsRef
}) => {
  const { user } = useAuth();
  const [grid, setGrid] = useState<CrucigramaCell[][]>(
    exercise.grid.map((row) =>
      row.map((cell) => ({ ...cell, userInput: cell.userInput || '' }))
    )
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [completedClues, setCompletedClues] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [availableCoins, setAvailableCoins] = useState(100);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FE-059: Calculate clue length from grid instead of using answer field
  const getClueLength = (clue: typeof exercise.clues[0]): number => {
    let length = 0;
    if (clue.direction === 'horizontal') {
      for (let i = 0; i < grid[0].length; i++) {
        const cell = grid[clue.startRow]?.[clue.startCol + i];
        if (!cell || cell.isBlack) break;
        length++;
      }
    } else {
      for (let i = 0; i < grid.length; i++) {
        const cell = grid[clue.startRow + i]?.[clue.startCol];
        if (!cell || cell.isBlack) break;
        length++;
      }
    }
    return length;
  };

  // FE-059: Check if clue has user input (NOT if it's correct)
  const hasClueInput = (clueId: string): boolean => {
    const clue = exercise.clues.find((c) => c.id === clueId);
    if (!clue) return false;

    const length = getClueLength(clue);
    let userAnswer = '';

    if (clue.direction === 'horizontal') {
      for (let i = 0; i < length; i++) {
        const cell = grid[clue.startRow][clue.startCol + i];
        userAnswer += cell.userInput || '';
      }
    } else {
      for (let i = 0; i < length; i++) {
        const cell = grid[clue.startRow + i][clue.startCol];
        userAnswer += cell.userInput || '';
      }
    }

    return userAnswer.trim().length === length;
  };

  // FE-055: Update completed clues and notify with answers
  useEffect(() => {
    // FE-059: Track clues with user input (not correctness)
    const newCompleted = new Set<string>();
    exercise.clues.forEach((clue) => {
      if (hasClueInput(clue.id)) {
        newCompleted.add(clue.id);
      }
    });
    setCompletedClues(newCompleted);

    // Auto-save progress
    saveProgress(exercise.id, { grid, completedClues: Array.from(newCompleted) });

    // FE-055: Notify parent component with progress AND user answers
    if (onProgressUpdate) {
      // Prepare user answers: clue-id: user's answer
      const userAnswers: Record<string, string> = {};
      exercise.clues.forEach((clue) => {
        const length = getClueLength(clue);
        let answer = '';

        if (clue.direction === 'horizontal') {
          for (let i = 0; i < length; i++) {
            const cell = grid[clue.startRow]?.[clue.startCol + i];
            answer += cell?.userInput || '';
          }
        } else {
          for (let i = 0; i < length; i++) {
            const cell = grid[clue.startRow + i]?.[clue.startCol];
            answer += cell?.userInput || '';
          }
        }
        if (answer) {
          userAnswers[clue.id] = answer;
        }
      });

      onProgressUpdate({
        progress: {
          currentStep: newCompleted.size,
          totalSteps: exercise.clues.length,
          score: Math.floor((newCompleted.size / exercise.clues.length) * 100),
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { clues: userAnswers }
      });

      console.log('📊 [Crucigrama] Progress update sent:', {
        completedClues: newCompleted.size,
        totalClues: exercise.clues.length
      });
    }
  }, [grid, hintsUsed, exercise.clues, exercise.id, onProgressUpdate, startTime]);

  const handleCellInput = (row: number, col: number, value: string) => {
    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    newGrid[row][col].userInput = value.toUpperCase();
    setGrid(newGrid);
  };

  const handleUseHint = (hint: { id: string; text: string; cost: number }) => {
    setHintsUsed((prev) => {
      const newHintsUsed = prev + 1;
      // Notify parent of hints used change
      if (onProgressUpdate) {
        onProgressUpdate({
          currentStep: completedClues.size,
          totalSteps: exercise.clues.length,
          score: Math.floor((completedClues.size / exercise.clues.length) * 100),
          hintsUsed: newHintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        });
      }
      return newHintsUsed;
    });
    setAvailableCoins((prev) => prev - hint.cost);
    alert(`Pista: ${hint.text}`);
  };

  const handleCheck = async () => {
    const isComplete = completedClues.size === exercise.clues.length;

    if (!isComplete) {
      setFeedback({
        type: 'error',
        title: 'Crucigrama Incompleto',
        message: `Has completado ${completedClues.size} de ${exercise.clues.length} palabras. ¡Sigue intentando!`,
      });
      setShowFeedback(true);
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      setFeedback({
        type: 'error',
        title: 'Error de Autenticación',
        message: 'Debes estar autenticado para enviar el ejercicio.',
      });
      setShowFeedback(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare answers in backend DTO format: { clues: { c1: "WORD1", c2: "WORD2" } }
      const answersObj: Record<string, string> = {};
      exercise.clues.forEach((clue) => {
        const length = getClueLength(clue);
        let answer = '';

        if (clue.direction === 'horizontal') {
          for (let i = 0; i < length; i++) {
            const cell = grid[clue.startRow]?.[clue.startCol + i];
            answer += cell?.userInput || '';
          }
        } else {
          for (let i = 0; i < length; i++) {
            const cell = grid[clue.startRow + i]?.[clue.startCol];
            answer += cell?.userInput || '';
          }
        }

        if (answer) {
          answersObj[clue.id] = answer;
        }
      });

      // Submit to backend API
      const response = await submitExercise(exercise.id, user.id, { clues: answersObj });

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has obtenido ${response.correctAnswersCount} de ${response.totalQuestions} respuestas correctas.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [Crucigrama] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [Crucigrama] Submission error:', error);
      setFeedback({
        type: 'error',
        title: 'Error al Enviar',
        message: 'Hubo un problema al enviar tu respuesta. Por favor, intenta nuevamente.',
      });
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGrid(
      exercise.grid.map((row) =>
        row.map((cell) => ({ ...cell, userInput: '' }))
      )
    );
    setCompletedClues(new Set());
    setSelectedCell(null);
  };

  // Populate actionsRef for parent component
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck
      };
    }
  }, [actionsRef, handleReset, handleCheck]);

  return (
    <>
      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Grid */}
        <div className="lg:col-span-2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CrucigramaGrid
              grid={grid}
              selectedCell={selectedCell}
              onCellClick={(row, col) => setSelectedCell({ row, col })}
              onCellInput={handleCellInput}
            />
          </motion.div>
        </div>

        {/* Clues - Unified Display */}
        <div>
          <CrucigramaClue
            clues={exercise.clues}
            completedClues={completedClues}
            direction="all"
          />
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success') {
              onComplete?.();
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

export default CrucigramaExercise;
