/**
 * ⚠️ FE-059: correctPosition is NEVER sent by backend (sanitized for security)
 */
export interface Fragment {
  id: string;
  label: string; // A, B, C, D
  text: string;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  correctPosition?: never;
}

/**
 * ⚠️ FE-059: correctOrder is NEVER sent by backend (sanitized for security)
 */
export interface PuzzleContextoData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  instructions?: string;
  completeInference: string;
  fragments: Fragment[];
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  correctOrder?: never;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface PuzzleContextoState {
  currentOrder: string[]; // Array of fragment IDs in current order
  isComplete: boolean;
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface PuzzleContextoActions {
  getState: () => PuzzleContextoState;
  reset: () => void;
  validate: () => Promise<void>;
}

// Standardized Exercise Props Interface (Module 2 Pattern)
export interface PuzzleContextoExerciseProps {
  exercise: PuzzleContextoData;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: any) => void;
  initialData?: Partial<PuzzleContextoState>;
  actionsRef?: React.MutableRefObject<PuzzleContextoActions | undefined>;
}
