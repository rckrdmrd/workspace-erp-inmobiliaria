/**
 * Prediction option (multiple choice)
 * ⚠️ FE-059: isCorrect is NEVER sent by backend (sanitized for security)
 */
export interface PredictionOption {
  id: string;
  text: string;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  isCorrect?: never;
  explanation: string;
}

// Scenario with context and multiple prediction options
export interface Scenario {
  id: string;
  context: string;
  beginning: string;
  question: string;
  predictions: PredictionOption[];
  contextualHint?: string;
}

// Exercise data structure
export interface PrediccionNarrativaData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  instructions?: string;
  scenarios: Scenario[];
}

// User answer for a scenario
export interface ScenarioAnswer {
  scenarioId: string;
  selectedPredictionId: string | null;
  isCorrect: boolean | null;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface PrediccionNarrativaState {
  answers: ScenarioAnswer[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
  showResults: boolean;
}

// Exercise Actions Interface for Parent Control
export interface PrediccionNarrativaActions {
  getState: () => PrediccionNarrativaState;
  reset: () => void;
  validate: () => Promise<void>;
}

// Standardized Exercise Props Interface (Module 1 Pattern)
export interface PrediccionNarrativaExerciseProps {
  exercise: PrediccionNarrativaData;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: any) => void;
  initialData?: Partial<PrediccionNarrativaState>;
  actionsRef?: React.MutableRefObject<PrediccionNarrativaActions | undefined>;
}
