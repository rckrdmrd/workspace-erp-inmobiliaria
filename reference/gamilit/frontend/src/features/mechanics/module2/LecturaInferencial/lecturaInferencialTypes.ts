/**
 * Types for Lectura Inferencial (Inferential Reading) Exercise
 * Module 2 - Reading comprehension with multiple choice inference questions
 */

import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

/**
 * Types of inferences students can make
 */
export type InferenceType =
  | 'causa_efecto'           // Cause and effect
  | 'contexto_situacional'   // Situational context
  | 'motivacion'             // Character motivation
  | 'prediccion'             // Prediction
  | 'conclusion'             // Drawing conclusions
  | 'interpretacion';        // Interpretation

/**
 * Individual multiple choice question
 */
export interface InferenceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;      // Index of correct option (0-based)
  explanation: string;
  inference_type: InferenceType;
}

/**
 * Student's answer to a question
 */
export interface QuestionAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;          // Time spent on this question in seconds
}

/**
 * Configuration for the exercise
 */
export interface LecturaInferencialConfig {
  timePerQuestion?: number;   // Time limit per question in seconds
  allowReview?: boolean;      // Allow reviewing answers before submit
  showExplanations?: boolean; // Show explanations after answering
  shuffleQuestions?: boolean; // Randomize question order
  shuffleOptions?: boolean;   // Randomize option order
}

/**
 * Content structure for the exercise
 */
export interface LecturaInferencialContent {
  passage: string;            // The reading passage
  questions: InferenceQuestion[];
}

/**
 * Complete exercise data structure
 */
export interface LecturaInferencialData extends BaseExercise {
  config: LecturaInferencialConfig;
  content: LecturaInferencialContent;
}

/**
 * Exercise progress/state
 */
export interface LecturaInferencialProgress {
  answers: QuestionAnswer[];
  currentQuestionIndex: number;
  timeSpent: number;
  score: number;
  hintsUsed: number;
  completed: boolean;
}

/**
 * Props for the main exercise component
 */
export interface LecturaInferencialExerciseProps {
  exercise: LecturaInferencialData;
  onComplete?: (score: number, timeSpent: number) => void;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
  }>;
}
