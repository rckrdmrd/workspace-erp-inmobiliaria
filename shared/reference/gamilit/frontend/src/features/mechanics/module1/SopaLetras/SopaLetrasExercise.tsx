import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { SopaLetrasGrid } from './SopaLetrasGrid';
import { WordList } from './WordList';
import { SopaLetrasData, WordPosition } from './sopaLetrasTypes';
import { calculateScore, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface SopaLetrasExerciseProps {
  exercise: SopaLetrasData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
  }>;
}

export const SopaLetrasExercise: React.FC<SopaLetrasExerciseProps> = ({ exercise, onComplete, onProgressUpdate, actionsRef }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FE-059: Initialize words from words list only (wordsPositions field is sanitized)
  // User will discover positions by selecting cells in the grid
  const initialWords: WordPosition[] = React.useMemo(() => {
    const wordsList = exercise.content.words || [];

    const result = wordsList.map((item: string | any) => {
      // Handle both string[] and object[] formats
      const word = typeof item === 'string' ? item : (item?.word || item);
      const wordStr = String(word).toUpperCase();

      // FE-059: Positions are unknown initially (-1, -1)
      // Will be calculated when user finds the word (lines 127-143)
      return {
        word: wordStr,
        startRow: -1,
        startCol: -1,
        direction: 'horizontal' as const,
        found: false,
      };
    });

    console.log('🎮 [SopaLetras] Palabras inicializadas:', result);
    return result;
  }, [exercise.content.words]);

  const [words, setWords] = useState<WordPosition[]>(initialWords);
  const [selectedCells, setSelectedCells] = useState<{row:number,col:number}[]>([]);
  const [foundCells, setFoundCells] = useState<{row:number,col:number}[]>([]); // Celdas de palabras encontradas
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [startTime] = useState(new Date());
  const [hintsUsed] = useState(0);

  // FE-055: Notify parent of progress updates WITH user answers
  React.useEffect(() => {
    if (onProgressUpdate) {
      const foundWords = words.filter(w => w.found).length;

      // FE-059: Prepare user answers in backend DTO format
      // Backend validator expects: { words: ["MARIE", "CURIE", "NOBEL"] }
      const userAnswers = {
        words: words.filter(w => w.found).map(w => w.word)
      };

      // Send both progress metadata AND user answers
      onProgressUpdate({
        progress: {
          currentStep: foundWords,
          totalSteps: words.length,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: userAnswers
      });

      console.log('📊 [SopaLetras] Progress update sent:', {
        foundWords: userAnswers.words.length,
        totalWords: words.length
      });
    }
  }, [words, hintsUsed, onProgressUpdate, startTime]);

  // Función para validar si las celdas seleccionadas forman una palabra válida
  const validateSelection = React.useCallback((cells: {row:number,col:number}[]) => {
    if (cells.length === 0) return;

    // Extraer la palabra formada por las celdas seleccionadas
    const selectedWord = cells
      .map(cell => exercise.content.grid[cell.row]?.[cell.col])
      .filter(Boolean)
      .join('')
      .toUpperCase();

    if (!selectedWord) return;

    console.log('🔍 [SopaLetras] Validando palabra:', selectedWord);

    // Usar la forma funcional de setState para evitar problemas de closure
    setWords(prevWords => {
      // Buscar si coincide con alguna palabra conocida
      const matchedWordIndex = prevWords.findIndex(w => {
        const wordStr = String(w.word).toUpperCase();
        const isMatch = wordStr === selectedWord || wordStr === selectedWord.split('').reverse().join('');
        if (isMatch) {
          console.log('✅ [SopaLetras] Coincidencia encontrada:', wordStr, 'found:', w.found);
        }
        return isMatch;
      });

      if (matchedWordIndex >= 0 && !prevWords[matchedWordIndex].found) {
        console.log('🎯 [SopaLetras] Marcando palabra como encontrada:', prevWords[matchedWordIndex].word);

        // Marcar la palabra como encontrada y guardar las posiciones de las celdas
        const updatedWords = [...prevWords];
        const wordToUpdate = { ...updatedWords[matchedWordIndex], found: true };

        // Si no tiene posiciones definidas, calcularlas desde las celdas seleccionadas
        if (wordToUpdate.startRow < 0 || wordToUpdate.startCol < 0) {
          wordToUpdate.startRow = cells[0].row;
          wordToUpdate.startCol = cells[0].col;

          // Detectar dirección basándose en las celdas seleccionadas
          if (cells.length > 1) {
            const deltaRow = cells[1].row - cells[0].row;
            const deltaCol = cells[1].col - cells[0].col;

            if (deltaRow === 0 && deltaCol > 0) wordToUpdate.direction = 'horizontal';
            else if (deltaRow === 0 && deltaCol < 0) wordToUpdate.direction = 'horizontal-reverse';
            else if (deltaCol === 0 && deltaRow > 0) wordToUpdate.direction = 'vertical';
            else if (deltaCol === 0 && deltaRow < 0) wordToUpdate.direction = 'vertical-reverse';
            else if (deltaRow > 0 && deltaCol > 0) wordToUpdate.direction = 'diagonal';
            else if (deltaRow > 0 && deltaCol < 0) wordToUpdate.direction = 'diagonal-reverse';
          }
        }

        updatedWords[matchedWordIndex] = wordToUpdate;

        // Agregar las celdas de esta palabra a foundCells para mantenerlas resaltadas
        console.log(`➕ [SopaLetras] Agregando ${cells.length} celdas a foundCells para palabra: ${wordToUpdate.word}`);
        setFoundCells(prev => {
          const newFoundCells = [...prev, ...cells];
          console.log(`📊 [SopaLetras] Total foundCells ahora: ${newFoundCells.length}`);
          return newFoundCells;
        });

        // Limpiar selección después de un breve delay para feedback visual
        setTimeout(() => setSelectedCells([]), 300);

        return updatedWords;
      } else if (matchedWordIndex >= 0) {
        console.log('⚠️ [SopaLetras] Palabra ya encontrada previamente');
        // Limpiar selección si la palabra ya fue encontrada
        setTimeout(() => setSelectedCells([]), 200);
      } else {
        console.log('❌ [SopaLetras] No se encontró coincidencia');
      }

      return prevWords;
    });
  }, [exercise.content.grid]);

  // Limpiar selección con tecla Escape o validar con Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('⌨️ [SopaLetras] ESC presionado - Limpiando selección');
        setSelectedCells([]);
      } else if (e.key === 'Enter' && selectedCells.length > 0) {
        console.log('⌨️ [SopaLetras] ENTER presionado - Validando selección');
        validateSelection(selectedCells);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCells, validateSelection]);

  const handleCellSelect = React.useCallback((row: number, col: number) => {
    console.log(`🖱️ [SopaLetras] Click en celda (${row}, ${col})`);

    // En sopa de letras, las celdas pueden ser reutilizadas cuando las palabras se cruzan
    // Solo verificamos que no esté ya seleccionada en la selección actual
    setSelectedCells(currentSelectedCells => {
      // Verificar si la celda ya está seleccionada en esta selección (evitar duplicados)
      const isAlreadySelected = currentSelectedCells.some(cell => cell.row === row && cell.col === col);

      if (isAlreadySelected) {
        console.log('⚠️ [SopaLetras] Celda ya seleccionada en la selección actual, ignorando');
        return currentSelectedCells;
      }

      const newSelection = [...currentSelectedCells, {row, col}];

      // Verificar si esta celda pertenece a una palabra ya encontrada
      const isInFoundWord = foundCells.some(cell => cell.row === row && cell.col === col);
      if (isInFoundWord) {
        console.log(`💡 [SopaLetras] Celda está en palabra encontrada pero permitimos reutilización para cruces`);
      }

      console.log(`📝 [SopaLetras] Selección actual: ${newSelection.length} celdas`);

      return newSelection;
    });
  }, [foundCells]);

  const handleCheck = React.useCallback(async () => {
    console.log('📋 [SopaLetras] handleCheck iniciado');

    // Validar selección actual antes de verificar
    setSelectedCells(currentCells => {
      if (currentCells.length > 0) {
        console.log('🔄 [SopaLetras] Validando selección pendiente:', currentCells.length, 'celdas');
        validateSelection(currentCells);
      }
      return currentCells;
    });

    // Usar setTimeout para asegurar que el estado se actualice antes de calcular
    setTimeout(async () => {
      const currentWords = words;
      const foundWords = currentWords.filter(w => w.found).length;
      const isComplete = foundWords === currentWords.length;

      console.log('📊 [SopaLetras] Estado final:', {
        foundWords,
        totalWords: currentWords.length,
        isComplete,
        words: currentWords.map(w => ({ word: w.word, found: w.found }))
      });

      if (!isComplete) {
        setFeedback({
          type: 'error',
          title: 'Sopa de Letras Incompleta',
          message: `Has encontrado ${foundWords} de ${currentWords.length} palabras. Encuentra todas antes de verificar.`,
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
        // Prepare answers in backend DTO format: { words: ["MARIE", "CURIE"] }
        const foundWordsList = currentWords.filter(w => w.found).map(w => w.word);

        // Submit to backend API
        const response = await submitExercise(exercise.id, user.id, { words: foundWordsList });

        // Show backend response
        setFeedback({
          type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
          title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
          message: response.feedback?.overall || `Has encontrado ${response.correctAnswersCount} de ${response.totalQuestions} palabras correctamente.`,
          score: response.score,
          showConfetti: response.isPerfect
        });
        setShowFeedback(true);

        console.log('✅ [SopaLetras] Submission successful:', {
          attemptId: response.attemptId,
          score: response.score,
          rewards: response.rewards
        });
      } catch (error) {
        console.error('❌ [SopaLetras] Submission error:', error);
        setFeedback({
          type: 'error',
          title: 'Error al Enviar',
          message: 'Hubo un problema al enviar tu respuesta. Por favor, intenta nuevamente.',
        });
        setShowFeedback(true);
      } finally {
        setIsSubmitting(false);
      }
    }, 100);
  }, [validateSelection, words, user, exercise.id]);

  const handleReset = React.useCallback(() => {
    setWords(initialWords);
    setSelectedCells([]);
    setFoundCells([]); // Limpiar también las celdas encontradas
    setFeedback(null);
    setShowFeedback(false);
  }, [initialWords]);

  // Populate actionsRef for parent component
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck
      };
    }
  }, [actionsRef, handleReset, handleCheck]);

  // Handler para validar la selección actual (botón móvil)
  const handleValidateSelection = React.useCallback(() => {
    if (selectedCells.length > 0) {
      console.log('📱 [SopaLetras] Botón validar presionado - Validando selección');
      validateSelection(selectedCells);
    }
  }, [selectedCells, validateSelection]);

  // Handler para cancelar la selección actual
  const handleCancelSelection = React.useCallback(() => {
    console.log('📱 [SopaLetras] Botón cancelar presionado - Limpiando selección');
    setSelectedCells([]);
  }, []);

  // Obtener la palabra formada por las celdas seleccionadas (para mostrar preview)
  const selectedWord = React.useMemo(() => {
    if (selectedCells.length === 0) return '';
    return selectedCells
      .map(cell => exercise.content.grid[cell.row]?.[cell.col])
      .filter(Boolean)
      .join('')
      .toUpperCase();
  }, [selectedCells, exercise.content.grid]);

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SopaLetrasGrid
              grid={exercise.content.grid}
              selectedCells={selectedCells}
              foundCells={foundCells}
              onCellSelect={handleCellSelect}
            />

            {/* Botones de validar/cancelar para móvil - Aparecen cuando hay selección */}
            {selectedCells.length > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* Preview de la palabra seleccionada */}
                <div className="bg-blue-100 border-2 border-blue-400 rounded-lg px-4 py-2 text-center">
                  <span className="text-sm text-blue-600 font-medium">Palabra seleccionada:</span>
                  <span className="ml-2 text-lg font-bold text-blue-800">{selectedWord}</span>
                  <span className="ml-2 text-sm text-blue-500">({selectedCells.length} letras)</span>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={handleValidateSelection}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all active:scale-95"
                  >
                    <Check className="w-5 h-5" />
                    Validar Palabra
                  </button>
                  <button
                    onClick={handleCancelSelection}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all active:scale-95"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Mensaje de ayuda cuando no hay selección */}
            {selectedCells.length === 0 && (
              <div className="mt-4 text-center text-gray-500 text-sm">
                <p>📱 Toca las letras para formar una palabra, luego presiona <strong>Validar Palabra</strong></p>
                <p className="text-xs mt-1">(En PC también puedes usar Enter para validar o Escape para cancelar)</p>
              </div>
            )}
          </div>
          <div>
            <WordList words={words} />
          </div>
        </div>
      </DetectiveCard>

      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success') onComplete?.();
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

export default SopaLetrasExercise;
