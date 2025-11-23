/**
 * Rueda de Inferencias Types
 *
 * @description Types for the Inference Wheel exercise (Module 2.5)
 * Mechanic: Spin wheel → select category → write free-text inference (30 seconds)
 * @task FE-071
 */

/**
 * Categoría de inferencia para la ruleta
 */
export interface InferenceCategory {
  id: string;
  name: string;
  description: string;
  color: string;        // Color hex para la ruleta
  icon: string;         // Emoji o icon name
}

/**
 * Fragmento de texto para analizar
 */
export interface InferenceFragment {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints?: string[];
}

/**
 * Settings del ejercicio
 */
export interface ExerciseSettings {
  timeLimit: number;         // Segundos por fragmento (default: 30)
  minTextLength: number;      // Caracteres mínimos (default: 20)
  maxTextLength: number;      // Caracteres máximos (default: 200)
  wheelAnimation: boolean;    // Mostrar animación de ruleta
  showTimer: boolean;         // Mostrar countdown timer
  allowSkip: boolean;         // Permitir saltar fragmentos
}

/**
 * Content completo del ejercicio
 */
export interface RuedaInferenciasContent {
  categories: InferenceCategory[];
  fragments: InferenceFragment[];
  settings: ExerciseSettings;
  instructions: string;
}

/**
 * Exercise completo (viene del backend)
 */
export interface RuedaInferenciasExercise {
  id: string;
  title: string;
  description: string;
  content: RuedaInferenciasContent;
  difficulty_level: string;
  max_score: number;
  passing_score: number;
}

/**
 * Estado de un fragmento individual
 */
export interface FragmentState {
  fragmentId: string;
  categoryId: string | null;
  userText: string;
  timeSpent: number;
  isComplete: boolean;
  startedAt: Date | null;
}

/**
 * Estado del ejercicio para auto-save
 */
export interface RuedaInferenciasState {
  currentFragmentIndex: number;
  fragments: FragmentState[];
  totalTimeSpent: number;
  score: number;
  hintsUsed: number;
  isWheelSpinning: boolean;
  selectedCategoryId: string | null;
}

/**
 * Respuesta del usuario (formato para enviar al backend)
 */
export interface RuedaInferenciasAnswers {
  fragments: Record<string, string>;  // { "frag-1": "texto...", "frag-2": "texto..." }
  categoryId?: string;                // Última categoría seleccionada (opcional)
  timeSpent?: number;                 // Tiempo total en segundos (opcional)
}

/**
 * Progress update para callbacks
 */
export interface ExerciseProgressUpdate {
  currentFragment: number;
  totalFragments: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

/**
 * Actions interface para control externo
 */
export interface RuedaInferenciasActions {
  getState: () => RuedaInferenciasState;
  reset: () => void;
  submit: () => Promise<void>;
  skipFragment?: () => void;
  spinWheel?: () => void;
}

/**
 * Props del componente principal
 */
export interface RuedaInferenciasExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<RuedaInferenciasState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<RuedaInferenciasActions | undefined>;
}

/**
 * Props del componente WheelSpinner
 */
export interface WheelSpinnerProps {
  categories: InferenceCategory[];
  isSpinning: boolean;
  onSpinComplete: (selectedCategory: InferenceCategory) => void;
  disabled?: boolean;
}

/**
 * Props del componente CountdownTimer
 */
export interface CountdownTimerProps {
  duration: number;           // Duración total en segundos
  isRunning: boolean;
  onComplete: () => void;
  onTick?: (remaining: number) => void;
  variant?: 'default' | 'warning' | 'danger';
}
