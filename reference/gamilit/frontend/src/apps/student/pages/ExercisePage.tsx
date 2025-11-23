import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { ScoreDisplay } from '@shared/components/mechanics/ScoreDisplay';
import { TimerWidget } from '@shared/components/mechanics/TimerWidget';
import { ProgressTracker } from '@shared/components/mechanics/ProgressTracker';
import { HintSystem } from '@shared/components/mechanics/HintSystem';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import {
  ArrowLeft,
  Save,
  Send,
  SkipForward,
  Clock,
  Star,
  Trophy,
  ChevronRight,
  Loader2,
  RotateCcw,
  Check
} from 'lucide-react';
import type { FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { DifficultyLevel } from '@shared/types/educational.types';
import { getExercise, saveExerciseProgress, submitExercise, getExerciseHints } from '@/services/api/educationalAPI';
import { adaptExerciseData } from '@shared/utils/exerciseAdapter';
import { ExerciseGuide } from '@/features/exercises/components/ExerciseGuide';
import { UnderConstructionExercise } from '@/features/exercises/components/UnderConstructionExercise';

// ============================================================================
// TYPES
// ============================================================================

interface ExerciseData {
  id: string;
  module_id: string;
  title: string;
  type: string;
  description: string;
  difficulty: DifficultyLevel;
  points: number;
  estimatedTime: number;
  completed: boolean;
  moduleTitle?: string;
  mechanicData?: any;
}

interface ExerciseProgress {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
  powerupsUsed?: string[];
}

// FE-055: Interface for progress updates from mechanics
interface ProgressUpdate {
  progress: Partial<ExerciseProgress>;
  answers: any; // User's actual answers (format varies by exercise type)
}

// ============================================================================
// DYNAMIC IMPORTS MAPPING
// ============================================================================

const loadMechanic = (mechanicType: string) => {
  // Validate mechanicType
  if (!mechanicType || typeof mechanicType !== 'string') {
    console.error('Invalid mechanic type:', mechanicType);
    return null;
  }

  const mechanicMap: Record<string, () => Promise<any>> = {
    // Module 1 - Comprensión Literal
    'crucigrama_cientifico': () => import('@/features/mechanics/module1/Crucigrama/CrucigramaExercise'),
    'crucigrama': () => import('@/features/mechanics/module1/Crucigrama/CrucigramaExercise'),
    'linea_tiempo': () => import('@/features/mechanics/module1/Timeline/TimelineExercise'),
    'timeline': () => import('@/features/mechanics/module1/Timeline/TimelineExercise'),
    'sopa_letras': () => import('@/features/mechanics/module1/SopaLetras/SopaLetrasExercise'),
    'mapa_conceptual': () => import('@/features/mechanics/module1/MapaConceptual/MapaConceptualExercise'),
    'emparejamiento': () => import('@/features/mechanics/module1/Emparejamiento/EmparejamientoExercise'),
    'verdadero_falso': () => import('@/features/mechanics/module1/VerdaderoFalso/VerdaderoFalsoExercise'),
    'completar_espacios': () => import('@/features/mechanics/module1/CompletarEspacios/CompletarEspaciosExercise'),

    // Module 2 - Comprensión Inferencial
    'detective_textual': () => import('@/features/mechanics/module2/LecturaInferencial/LecturaInferencialExercise'),
    'lectura_inferencial': () => import('@/features/mechanics/module2/LecturaInferencial/LecturaInferencialExercise'),
    'construccion_hipotesis': () => import('@/features/mechanics/module2/ConstruccionHipotesis/CausaEfectoExercise'),
    'prediccion_narrativa': () => import('@/features/mechanics/module2/PrediccionNarrativa/PrediccionNarrativaExercise'),
    'puzzle_contexto': () => import('@/features/mechanics/module2/PuzzleContexto/PuzzleContextoExercise'),
    'rueda_inferencias': () => import('@/features/mechanics/module2/RuedaInferencias/RuedaInferenciasExercise'),

    // Module 3 - Comprensión Crítica
    'analisis_fuentes': () => import('@/features/mechanics/module3/AnalisisFuentes/AnalisisFuentesExercise'),
    'debate_digital': () => import('@/features/mechanics/module3/DebateDigital/DebateDigitalExercise'),
    'matriz_perspectivas': () => import('@/features/mechanics/module3/MatrizPerspectivas/MatrizPerspectivasExercise'),
    'podcast_argumentativo': () => import('@/features/mechanics/module3/PodcastArgumentativo/PodcastArgumentativoExercise'),
    'tribunal_opiniones': () => import('@/features/mechanics/module3/TribunalOpiniones/TribunalOpinionesExercise'),

    // Module 4 - Textos Digitales y Multimediales
    'verificador_fakenews': () => import('@/features/mechanics/module4/VerificadorFakeNews/VerificadorFakeNewsExercise'),
    'fake_news': () => import('@/features/mechanics/module4/VerificadorFakeNews/VerificadorFakeNewsExercise'),
    'quiz_tiktok': () => import('@/features/mechanics/module4/QuizTikTok/QuizTikTokExercise'),
    'navegacion_hipertextual': () => import('@/features/mechanics/module4/NavegacionHipertextual/NavegacionHipertextualExercise'),
    'analisis_memes': () => import('@/features/mechanics/module4/AnalisisMemes/AnalisisMemesExercise'),
    'infografia_interactiva': () => import('@/features/mechanics/module4/InfografiaInteractiva/InfografiaInteractivaExercise'),
    'email_formal': () => import('@/features/mechanics/module4/EmailFormal/EmailFormalExercise'),
    'chat_literario': () => import('@/features/mechanics/module4/ChatLiterario/ChatLiterarioExercise'),
    'ensayo_argumentativo': () => import('@/features/mechanics/module4/EnsayoArgumentativo/EnsayoArgumentativoExercise'),
    'resena_critica': () => import('@/features/mechanics/module4/ResenaCritica/ResenaCriticaExercise'),

    // Module 5 - Producción Creativa
    'diario_multimedia': () => import('@/features/mechanics/module5/DiarioMultimedia/DiarioMultimediaExercise'),
    'comic_digital': () => import('@/features/mechanics/module5/ComicDigital/ComicDigitalExercise'),
    'video_carta': () => import('@/features/mechanics/module5/VideoCarta/VideoCartaExercise'),

    // Auxiliar Mechanics
    'call_to_action': () => import('@/features/mechanics/auxiliar/CallToAction/CallToActionExercise'),
    'collage_prensa': () => import('@/features/mechanics/auxiliar/CollagePrensa/CollagePrensaExercise'),
    'comprension_auditiva': () => import('@/features/mechanics/auxiliar/ComprensiónAuditiva/ComprensiónAuditivaExercise'),
    'texto_movimiento': () => import('@/features/mechanics/auxiliar/TextoEnMovimiento/TextoEnMovimientoExercise'),
  };

  return mechanicMap[mechanicType.toLowerCase()] || null;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExercisePage() {
  const { moduleId, exerciseId } = useParams();
  const navigate = useNavigate();

  // State
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [MechanicComponent, setMechanicComponent] = useState<React.ComponentType<any> | null>(null);
  const [progress, setProgress] = useState<ExerciseProgress>({
    currentStep: 0,
    totalSteps: 1,
    score: 0,
    hintsUsed: 0,
    timeSpent: 0,
  });
  const [availableCoins, setAvailableCoins] = useState(350);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [startTime] = useState(new Date());
  // Backend returns hints as string[], not objects
  const [hints, setHints] = useState<string[]>([]);
  // FE-055: Store user's actual answers (not just progress metadata)
  const [userAnswers, setUserAnswers] = useState<any>(null);

  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);

        // Fetch exercise from API
        const exerciseData = await getExercise(exerciseId!);

        // Map API response to ExerciseData format
        // Handle both 'type' and 'exercise_type' fields from backend
        const exerciseType = exerciseData.type || exerciseData.exercise_type || (exerciseData as any).exerciseType || 'crucigrama_cientifico';

        const mappedExercise: ExerciseData = {
          id: exerciseData.id,
          module_id: exerciseData.module_id,
          title: exerciseData.title,
          type: exerciseType,
          description: exerciseData.description || '',
          difficulty: exerciseData.difficulty, // Uses DifficultyLevel enum (CEFR levels)
          points: exerciseData.points || exerciseData.max_points || 0,
          estimatedTime: exerciseData.estimatedTime || (exerciseData.estimated_time_minutes ? exerciseData.estimated_time_minutes * 60 : 900), // Backend returns seconds, fallback to 15 minutes
          completed: exerciseData.completed || false,
          moduleTitle: undefined,
          mechanicData: exerciseData,
        };

        console.log('Mapped exercise:', mappedExercise);

        setExercise(mappedExercise);

        // Fetch hints for this exercise
        try {
          const exerciseHints = await getExerciseHints(exerciseId!);
          // Backend returns string[], but API might return objects - handle both
          if (Array.isArray(exerciseHints)) {
            setHints(exerciseHints.map(h => typeof h === 'string' ? h : (h as any).text || String(h)));
          }
        } catch (hintError) {
          // Continue without hints - not critical (silent fail for optional feature)
        }

        // GAP-005 Resolution: Check if exercise belongs to backlog modules (4-5)
        // Backlog exercise types from modules 4-5
        const backlogExerciseTypes = [
          // Module 4
          'verificador_fakenews', 'fake_news', 'quiz_tiktok', 'navegacion_hipertextual',
          'analisis_memes', 'infografia_interactiva', 'email_formal', 'chat_literario',
          'ensayo_argumentativo', 'resena_critica',
          // Module 5
          'diario_multimedia', 'comic_digital', 'video_carta'
        ];

        const isBacklogExercise = backlogExerciseTypes.includes(mappedExercise.type.toLowerCase());

        if (isBacklogExercise) {
          // Set UnderConstructionExercise component for backlog exercises
          console.log('Exercise in backlog - showing Under Construction component');
          setMechanicComponent(() => UnderConstructionExercise);
        } else {
          // Load dynamic component for active exercises
          const loader = loadMechanic(mappedExercise.type);
          if (loader) {
            const module = await loader();
            setMechanicComponent(() => module.default || module.CrucigramaExercise || module);
          }
        }
      } catch (error) {
        console.error('Error loading exercise:', error);

        // Fallback to mock data if API fails
        console.warn('API failed, using mock data as fallback');
        const mockExercise: ExerciseData = {
          id: exerciseId!,
          module_id: moduleId!,
          title: 'Crucigrama: Primeros Años de Marie Curie',
          type: 'crucigrama_cientifico',
          description: 'Completa el crucigrama sobre los primeros años de la científica Marie Curie',
          difficulty: DifficultyLevel.INTERMEDIATE,
          points: 150,
          estimatedTime: 900, // 15 minutes
          completed: false,
          moduleTitle: 'Los Primeros Pasos de Marie Curie',
          mechanicData: {}
        };

        setExercise(mockExercise);

        // Load component with mock data
        const loader = loadMechanic(mockExercise.type);
        if (loader) {
          const module = await loader();
          setMechanicComponent(() => module.default || module.CrucigramaExercise || module);
        }

        // Show info but don't block the UI
        setFeedback({
          type: 'info',
          title: 'Modo sin conexión',
          message: 'No se pudo conectar con el servidor. Estás viendo datos de ejemplo.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId, moduleId]);

  // ============================================================================
  // AUTO-SAVE
  // ============================================================================

  useEffect(() => {
    if (!exercise || !hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(() => {
      handleSaveProgress();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [exercise, hasUnsavedChanges, progress]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSaveProgress = async () => {
    if (!exerciseId) return;

    try {
      // Save progress via API
      await saveExerciseProgress(exerciseId, {
        currentStep: progress.currentStep,
        totalSteps: progress.totalSteps,
        score: progress.score,
        hintsUsed: progress.hintsUsed,
        timeSpent: progress.timeSpent,
      });

      setHasUnsavedChanges(false);

      // Show brief success notification
      console.log('Progress saved successfully');
    } catch (error) {
      console.error('Error saving progress:', error);

      // Fallback to localStorage if API fails
      try {
        localStorage.setItem(
          `exercise_${exerciseId}_progress`,
          JSON.stringify({
            progress,
            timestamp: new Date().toISOString(),
          })
        );
        setHasUnsavedChanges(false);
        console.log('Progress saved locally');
      } catch (localError) {
        console.error('Failed to save progress locally:', localError);
      }
    }
  };

  const handleSubmit = async () => {
    if (!exerciseId) return;

    // FE-055: Validate that we have user answers before submitting
    if (!userAnswers) {
      console.error('❌ [ExercisePage] Cannot submit: No user answers available');
      setFeedback({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron obtener tus respuestas. Por favor, intenta nuevamente.',
      });
      setShowFeedback(true);
      return;
    }

    try {
      console.log('📤 [ExercisePage] Submitting exercise:', {
        exerciseId,
        payload: {
          answers: userAnswers,  // ✅ FE-055: Send REAL user answers
          startedAt: startTime.getTime(),
          hintsUsed: progress.hintsUsed || 0,
          powerupsUsed: progress.powerupsUsed || [],
        }
      });

      // FE-055: Submit exercise with REAL user answers (not progress metadata)
      const result = await submitExercise(exerciseId, {
        answers: userAnswers,  // ✅ FIXED: Send actual user answers
        startedAt: startTime.getTime(),
        hintsUsed: progress.hintsUsed || 0,
        powerupsUsed: progress.powerupsUsed || [],
      });

      console.log('✅ [ExercisePage] Submission result:', result);

      // Build feedback message
      let feedbackMessage = `Has obtenido ${result.score} puntos. Ganaste ${result.rewards.xp} XP y ${result.rewards.mlCoins} ML Coins.`;

      // Add bonus information if present
      if (result.rewards.bonuses && result.rewards.bonuses.length > 0) {
        const bonusDetails = result.rewards.bonuses.map(b => `+${b.amount} ${b.type}`).join(', ');
        feedbackMessage += ` Bonos: ${bonusDetails}`;
      }

      // Add rank up celebration if present
      if (result.rankUp) {
        feedbackMessage += `\n\n¡Felicidades! Has subido de rango: ${result.rankUp.oldRank} → ${result.rankUp.newRank}`;
        if (result.rankUp.unlockedFeatures.length > 0) {
          feedbackMessage += `\nNuevas funciones desbloqueadas: ${result.rankUp.unlockedFeatures.join(', ')}`;
        }
      }

      // Display submission results
      setFeedback({
        type: 'success',
        title: result.isPerfect ? '¡Perfecto!' : 'Ejercicio Completado',
        message: feedbackMessage,
        score: result.score,
        xpEarned: result.rewards.xp,
        mlCoinsEarned: result.rewards.mlCoins,
        showConfetti: result.isPerfect || result.score >= 80 || !!result.rankUp,
      });
      setShowFeedback(true);

      // Update coins if earned
      if (result.rewards.mlCoins) {
        setAvailableCoins((prev) => prev + result.rewards.mlCoins);
      }

      // Mark exercise as completed locally
      if (exercise) {
        setExercise({ ...exercise, completed: true });
      }
    } catch (error) {
      console.error('Error submitting exercise:', error);
      setFeedback({
        type: 'error',
        title: 'Error al enviar',
        message: 'Hubo un problema al enviar tu respuesta. Por favor, intenta nuevamente.',
      });
      setShowFeedback(true);
    }
  };

  const handleSkip = () => {
    if (window.confirm('¿Estás seguro de que deseas omitir este ejercicio?')) {
      navigate(`/modules/${exercise?.module_id || moduleId}`);
    }
  };

  const handleComplete = () => {
    setFeedback({
      type: 'success',
      title: '¡Ejercicio Completado!',
      message: `¡Excelente trabajo! Has ganado ${exercise?.points} puntos.`,
      showConfetti: true,
    });
    setShowFeedback(true);
  };

  const handleUseHint = (hint: { id: string; text: string; cost: number }) => {
    if (availableCoins >= hint.cost) {
      setAvailableCoins((prev) => prev - hint.cost);
      setProgress((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
      setHasUnsavedChanges(true);
    }
  };

  // FE-055: Updated to handle both progress metadata AND user answers
  const handleProgressUpdate = React.useCallback((update: Partial<ExerciseProgress> | ProgressUpdate) => {
    // Check if this is the new format (object with progress + answers)
    if (update && typeof update === 'object' && 'progress' in update && 'answers' in update) {
      const progressUpdate = update as ProgressUpdate;
      setProgress((prev) => ({ ...prev, ...progressUpdate.progress }));
      setUserAnswers(progressUpdate.answers);
      console.log('📤 [ExercisePage] Progress update received:', {
        progress: progressUpdate.progress,
        answersReceived: !!progressUpdate.answers
      });
    } else {
      // Old format (just progress) - maintain backward compatibility
      setProgress((prev) => ({ ...prev, ...(update as Partial<ExerciseProgress>) }));
      console.log('⚠️ [ExercisePage] Old format progress update (no answers):', update);
    }
    setHasUnsavedChanges(true);
  }, []);

  // Refs for mechanic callbacks
  const mechanicActionsRef = React.useRef<{
    handleReset?: () => void;
    handleCheck?: () => void;
    specificActions?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'blue' | 'gold';
    }>;
  }>({});

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'text-green-600 bg-green-100';
      case 'medio':
        return 'text-yellow-600 bg-yellow-100';
      case 'dificil':
        return 'text-red-600 bg-red-100';
      case 'experto':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'Fácil';
      case 'medio':
        return 'Medio';
      case 'dificil':
        return 'Difícil';
      case 'experto':
        return 'Experto';
      default:
        return difficulty;
    }
  };

  // ============================================================================
  // ADAPT EXERCISE DATA (MUST BE BEFORE EARLY RETURNS)
  // ============================================================================

  // Adapt exercise data to mechanic-specific format
  // IMPORTANT: This must be called unconditionally (before any returns) to follow Rules of Hooks
  const adaptedExercise = React.useMemo(() => {
    if (!exercise) return null;
    return adaptExerciseData(exercise);
  }, [exercise]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <GamifiedHeader
          user={user ?? undefined}
          gamificationData={gamificationData}
          onLogout={async () => {
            await logout();
            // No need to navigate - performLogout() handles redirect
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DetectiveCard hoverable={false}>
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-detective-orange" />
              </motion.div>
            </div>
            <p className="text-center text-detective-text font-semibold mt-4">Cargando ejercicio...</p>
          </DetectiveCard>
        </div>
      </div>
    );
  }

  if (!exercise || !MechanicComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <GamifiedHeader
          user={user ?? undefined}
          gamificationData={gamificationData}
          onLogout={async () => {
            await logout();
            // No need to navigate - performLogout() handles redirect
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-300 text-red-800 rounded-lg p-4 mb-6"
          >
            <p className="font-semibold">No se pudo cargar el ejercicio</p>
            <DetectiveButton
              variant="blue"
              onClick={() => navigate(`/modules/${moduleId || 'dashboard'}`)}
              className="mt-4"
            >
              Volver al módulo
            </DetectiveButton>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <GamifiedHeader
        user={user ?? undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Unified Exercise Header */}
        <DetectiveCard hoverable={false} className="mb-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-detective-text-secondary mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-detective-orange transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate(`/modules/${exercise.module_id}`)}
              className="hover:text-detective-orange transition-colors"
            >
              {exercise.moduleTitle || 'Módulo'}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-detective-text font-semibold">{exercise.title}</span>
          </nav>

          {/* Exercise Info */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-detective-text">
              {exercise.title}
            </h1>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold ${getDifficultyColor(
                exercise.difficulty
              )}`}
            >
              {getDifficultyLabel(exercise.difficulty)}
            </span>
          </div>
          <p className="text-detective-text-secondary mb-4">{exercise.description}</p>

          {/* Exercise Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-detective-orange" />
              <div>
                <p className="text-xs text-detective-text-secondary">Tiempo estimado</p>
                <p className="text-sm font-bold text-detective-text">{Math.floor(exercise.estimatedTime / 60)} minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-detective-gold" />
              <div>
                <p className="text-xs text-detective-text-secondary">Puntos</p>
                <p className="text-sm font-bold text-detective-text">{exercise.points} pts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-detective-orange" />
              <div>
                <p className="text-xs text-detective-text-secondary">Tipo</p>
                <p className="text-sm font-bold text-detective-text capitalize">{exercise.type.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>

          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <p className="text-xs text-orange-600 italic mt-3">
              ⚠️ Tienes cambios sin guardar
            </p>
          )}
        </DetectiveCard>

        {/* Pedagogical Guide (FE-060: 2025-11-19) */}
        {exercise.mechanicData && (
          <ExerciseGuide
            objective={(exercise.mechanicData as any).objective}
            how_to_solve={(exercise.mechanicData as any).how_to_solve}
            recommended_strategy={(exercise.mechanicData as any).recommended_strategy}
            pedagogical_notes={(exercise.mechanicData as any).pedagogical_notes}
            defaultExpanded={false}
            className="mb-6"
          />
        )}

        {/* Main Grid Layout - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Main Exercise Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense
                  fallback={
                    <DetectiveCard hoverable={false}>
                      <div className="flex items-center justify-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-6 h-6 text-detective-orange" />
                        </motion.div>
                      </div>
                      <p className="text-center text-sm text-detective-text-secondary mt-2">Cargando mecánica...</p>
                    </DetectiveCard>
                  }
                >
                  <MechanicComponent
                    exercise={adaptedExercise || exercise}
                    onComplete={handleComplete}
                    onProgressUpdate={handleProgressUpdate}
                    actionsRef={mechanicActionsRef}
                  />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar - Compact */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Actions Card */}
              <DetectiveCard hoverable={false}>
                <h3 className="text-sm font-bold text-detective-text mb-3">Acciones</h3>
                <div className="space-y-2">
                  {/* Navigation Actions */}
                  <DetectiveButton
                    variant="blue"
                    icon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate(`/modules/${exercise.module_id}`)}
                    className="w-full"
                  >
                    Volver
                  </DetectiveButton>

                  <DetectiveButton
                    variant="secondary"

                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSaveProgress}
                    disabled={!hasUnsavedChanges}
                    className="w-full"
                  >
                    Guardar
                  </DetectiveButton>

                  <DetectiveButton
                    variant="secondary"

                    icon={<SkipForward className="w-4 h-4" />}
                    onClick={handleSkip}
                    className="w-full"
                  >
                    Omitir
                  </DetectiveButton>

                  <div className="border-t border-detective-border my-2"></div>

                  {/* Mechanic Actions */}
                  <DetectiveButton
                    variant="blue"

                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => mechanicActionsRef.current.handleReset?.()}
                    className="w-full"
                  >
                    Reiniciar
                  </DetectiveButton>

                  <DetectiveButton
                    variant="gold"

                    icon={<Check className="w-4 h-4" />}
                    onClick={() => mechanicActionsRef.current.handleCheck?.()}
                    className="w-full"
                  >
                    Verificar
                  </DetectiveButton>

                  {/* Specific Mechanic Actions */}
                  {mechanicActionsRef.current.specificActions && mechanicActionsRef.current.specificActions.length > 0 && (
                    <>
                      {mechanicActionsRef.current.specificActions.map((action, index) => (
                        <DetectiveButton
                          key={index}
                          variant={action.variant || 'secondary'}

                          icon={action.icon}
                          onClick={action.onClick}
                          className="w-full"
                        >
                          {action.label}
                        </DetectiveButton>
                      ))}
                    </>
                  )}

                  {/* Hints Button */}
                  {hints.length > 0 && (
                    <HintSystem
                      hints={hints}
                      onHintUsed={(hintIndex) => {
                        if (hints[hintIndex]) {
                          handleUseHint({ id: `hint-${hintIndex}`, text: hints[hintIndex], cost: 15 });
                        }
                      }}
                    />
                  )}

                  <div className="border-t border-detective-border my-2"></div>

                  {/* Submit Button */}
                  <DetectiveButton
                    variant="primary"

                    icon={<Send className="w-4 h-4" />}
                    onClick={() => handleSubmit()}
                    className="w-full"
                  >
                    Enviar Respuestas
                  </DetectiveButton>
                </div>
              </DetectiveCard>

              {/* Score Display */}
              <DetectiveCard hoverable={false}>
                <h3 className="text-sm font-bold text-detective-text mb-3">
                  Puntuación
                </h3>
                <ScoreDisplay score={progress.score} maxScore={exercise.points} />
              </DetectiveCard>

              {/* Timer */}
              <DetectiveCard hoverable={false}>
                <h3 className="text-sm font-bold text-detective-text mb-3">Tiempo</h3>
                <TimerWidget
                  startTime={Date.now()}
                  isPaused={false}
                  showSeconds={true}
                />
              </DetectiveCard>

              {/* Progress Tracker */}
              <DetectiveCard hoverable={false}>
                <h3 className="text-sm font-bold text-detective-text mb-3">Progreso</h3>
                <ProgressTracker
                  currentStep={progress.currentStep}
                  totalSteps={progress.totalSteps}
                />
                <p className="text-center text-sm text-detective-text-secondary mt-2">
                  {progress.currentStep} de {progress.totalSteps}
                </p>
              </DetectiveCard>

              {/* ML Coins Display */}
              <DetectiveCard hoverable={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-detective-gold" />
                    <span className="text-sm font-bold text-detective-text">ML Coins</span>
                  </div>
                  <span className="text-xl font-bold text-detective-gold">{availableCoins}</span>
                </div>
              </DetectiveCard>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedback && showFeedback && (
          <FeedbackModal
            isOpen={showFeedback}
            feedback={feedback}
            onClose={() => {
              setShowFeedback(false);
              if (feedback.type === 'success') {
                navigate(`/modules/${exercise?.module_id || moduleId}`);
              }
            }}
            onRetry={() => {
              setShowFeedback(false);
              // Reset logic if needed
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
