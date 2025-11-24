/**
 * Exercise Types
 *
 * ISSUE: #4 (P0) - Exercise Interfaces
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 *
 * Type definitions for exercise components and interactions
 */

/**
 * Exercise difficulty levels (CEFR standard)
 * @see DifficultyLevelEnum
 * @version 2.0 (2025-11-11) - Migrado a CEFR (A1-C2+)
 */
export type ExerciseDifficulty =
  | 'beginner'            // A1
  | 'elementary'          // A2
  | 'pre_intermediate'    // B1
  | 'intermediate'        // B2
  | 'upper_intermediate'  // C1
  | 'advanced'            // C2
  | 'proficient'          // C2+
  | 'native';             // Nativo

/**
 * Exercise types/mechanics
 */
export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'drag_drop'
  | 'ordering'
  | 'matching';

/**
 * Exercise submission status
 */
export type SubmissionStatus = 'pending' | 'correct' | 'incorrect' | 'partial';

/**
 * Base exercise interface
 */
export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  description?: string;
  instructions: string;
  difficulty: ExerciseDifficulty;
  xp_reward: number;
  ml_coins_reward: number;
  time_limit_seconds?: number;
  max_attempts?: number;
  hints: ExerciseHint[];
  content: ExerciseContent;
}

/**
 * Exercise hint with cost
 */
export interface ExerciseHint {
  id: string;
  text: string;
  ml_coins_cost: number;
  order: number;
}

/**
 * Exercise content (varies by type)
 * ⚠️ FE-059: correct_answer is NEVER sent by backend (sanitized for security)
 */
export interface ExerciseContent {
  question: string;
  options?: MultipleChoiceOption[]; // For multiple_choice
  /**
   * @deprecated Backend sanitizes this field - never present
   */
  correct_answer?: never;
  explanation?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio';
}

/**
 * Multiple choice option
 * ⚠️ FE-059: is_correct is NEVER sent by backend (sanitized for security)
 */
export interface MultipleChoiceOption {
  id: string;
  label: string; // A, B, C, D
  text: string;
  /**
   * @deprecated Backend sanitizes this field - never present
   */
  is_correct?: never;
}

/**
 * Exercise submission request
 */
export interface ExerciseSubmission {
  exercise_id: string;
  user_id: string;
  answer: string | string[];
  time_spent_seconds: number;
  hints_used: string[];
  attempt_number: number;
}

/**
 * Exercise submission response
 */
export interface ExerciseSubmissionResult {
  id: string;
  exercise_id: string;
  user_id: string;
  status: SubmissionStatus;
  is_correct: boolean;
  score_percentage: number;
  xp_earned: number;
  ml_coins_earned: number;
  ml_coins_spent: number;
  feedback: string;
  correct_answer?: string | string[];
  explanation?: string;
  attempt_number: number;
  time_spent_seconds: number;
  submitted_at: Date;
}

/**
 * Exercise attempt history
 * Synchronized with backend ExerciseAttempt entity
 *
 * Backend source: /src/modules/progress/entities/exercise-attempt.entity.ts
 * Database table: progress_tracking.exercise_attempts
 */
export interface ExerciseAttempt {
  /** Attempt ID (UUID) */
  id: string;

  /** User ID who made the attempt (FK → auth_management.profiles) */
  user_id: string;

  /** Exercise ID attempted (FK → educational_content.exercises) */
  exercise_id: string;

  /** Attempt number (1, 2, 3, ...) */
  attempt_number: number;

  /**
   * Submitted answers by question ID (JSONB structure)
   * Example: { "q1": "answer1", "q2": ["option1", "option2"] }
   * This is the primary field for storing answers
   */
  submitted_answers: Record<string, any>;

  /**
   * Simple answer field (legacy/backward compatibility)
   * @deprecated Use submitted_answers instead for structured data
   */
  answer?: string | string[];

  /** Whether the attempt was correct (nullable until graded) */
  is_correct?: boolean;

  /** Score obtained (0-100, nullable until graded) */
  score?: number;

  /** Time spent on attempt in seconds (nullable) */
  time_spent_seconds?: number;

  /** Number of hints used during attempt */
  hints_used: number;

  /**
   * Comodines (power-ups) used in this attempt
   * Example: ["pistas", "vision_lectora", "segunda_oportunidad"]
   */
  comodines_used: string[];

  /** XP earned in this attempt */
  xp_earned: number;

  /** ML Coins earned in this attempt */
  ml_coins_earned: number;

  /** When the attempt was submitted (ISO timestamp) */
  submitted_at: Date;

  /**
   * Additional metadata (browser, device_type, response_pattern, etc.)
   * Example: { browser: "Chrome", device_type: "mobile", response_pattern: [...] }
   */
  metadata: Record<string, any>;
}

/**
 * Exercise timer state
 */
export interface ExerciseTimer {
  startTime: number;
  elapsedSeconds: number;
  isRunning: boolean;
  timeLimit?: number;
}

/**
 * Exercise interaction state
 */
export interface ExerciseState {
  currentAnswer: string | string[] | null;
  selectedOptions: string[];
  hintsUsed: string[];
  attemptNumber: number;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  result: ExerciseSubmissionResult | null;
  timer: ExerciseTimer;
  mlCoinsSpent: number;
}

/**
 * Exercise component props
 */
export interface ExerciseComponentProps {
  exercise: Exercise;
  userId: string;
  onComplete: (result: ExerciseSubmissionResult) => void;
  onCancel?: () => void;
  showTimer?: boolean;
  allowHints?: boolean;
}

/**
 * Exercise feedback type
 */
export interface ExerciseFeedback {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  xpEarned?: number;
  mlCoinsEarned?: number;
  showConfetti?: boolean;
}
