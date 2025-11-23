export interface Source {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  type: 'academic' | 'news' | 'blog' | 'social';
}

/**
 * ⚠️ FE-059: credibilityScore is NEVER sent by backend (sanitized for security)
 */
export interface SourceAnalysis {
  sourceId: string;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  credibilityScore?: never;
  biasLevel: string;
  factualReporting: string;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface AnalisisFuentesState {
  analyzedSources: SourceAnalysis[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface AnalisisFuentesActions {
  getState: () => AnalisisFuentesState;
  reset: () => void;
  validate: () => Promise<void>;
  analyzeSource?: (sourceId: string) => Promise<void>;
}

// Standardized Exercise Props Interface (Module 1 Pattern)
export interface AnalisisFuentesExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<AnalisisFuentesState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<AnalisisFuentesActions | undefined>;
}
