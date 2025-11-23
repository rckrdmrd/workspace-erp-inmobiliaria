import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface TikTokQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  backgroundVideo?: string;
  backgroundColor?: string;
}

export interface QuizTikTokData extends BaseExercise {
  questions: TikTokQuestion[];
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface QuizTikTokState {
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface QuizTikTokActions {
  getState: () => QuizTikTokState;
  reset: () => void;
  validate: () => Promise<void>;
  nextQuestion?: () => void;
  previousQuestion?: () => void;
}

// Standardized Exercise Props Interface
export interface QuizTikTokExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<QuizTikTokState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<QuizTikTokActions | undefined>;
}
