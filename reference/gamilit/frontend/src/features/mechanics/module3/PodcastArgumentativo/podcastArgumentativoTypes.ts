export interface Recording {
  id: string;
  audioBlob: Blob | null;
  transcription: string;
  analysis: any | null;
  duration: number;
}

export interface PodcastExercise {
  id: string;
  topic: string;
  prompt: string;
  timeLimit: number;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface PodcastArgumentativoState {
  recording: Recording | null;
  isRecording: boolean;
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface PodcastArgumentativoActions {
  getState: () => PodcastArgumentativoState;
  reset: () => void;
  validate: () => Promise<void>;
  startRecording?: () => void;
  stopRecording?: () => void;
}

// Standardized Exercise Props Interface (Module 1 Pattern)
export interface PodcastArgumentativoExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<PodcastArgumentativoState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<PodcastArgumentativoActions | undefined>;
}
