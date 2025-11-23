export interface FormalEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  greeting: string;
  closing: string;
  signature: string;
}

export interface ToneAnalysis {
  formality: number; // 0-100
  clarity: number;
  professionalism: number;
  suggestions: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  purpose: string;
  greeting: string;
  template: Partial<FormalEmail>;
}

export interface EmailFormalState {
  to: string;
  subject: string;
  body: string;
  analysis: ToneAnalysis | null;
}

export interface EmailFormalData {
  id: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  estimatedTime: number;
  topic: string;
  templates: EmailTemplate[];
  // Backend returns hints as string[]
  hints?: string[];
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise Actions Interface for Parent Control
export interface EmailFormalActions {
  getState: () => EmailFormalState & { score: number; timeSpent: number; hintsUsed: number };
  reset: () => void;
  validate: () => Promise<void>;
  analyzeEmail?: () => Promise<void>;
}

export interface EmailFormalExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: EmailFormalState;
  difficulty?: 'easy' | 'medium' | 'hard';
  exercise?: EmailFormalData;
  actionsRef?: React.MutableRefObject<EmailFormalActions | undefined>;
}

// Alias for generic import
export type ExerciseProps = EmailFormalExerciseProps;
