/**
 * Types for Completar Espacios (Fill in the Blanks) Exercise
 * Module 1 - Exercise 4
 * ⚠️ FE-059: correctAnswer and alternatives are NEVER sent by backend (sanitized for security)
 */

export interface BlankSpace {
  id: string;
  position: number;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  correctAnswer?: never;
  userAnswer?: string;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  alternatives?: never;
}

export interface CompletarEspaciosData {
  id: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  estimatedTime: number;
  topic: string;
  hints: Array<{
    id: string;
    text: string;
    cost: number;
  }>;
  text: string; // Text with placeholders like "Marie nació en ___"
  blanks: BlankSpace[];
  wordBank: string[]; // Available words to fill blanks
  scenarioText?: string;
}

export interface CompletarEspaciosExerciseProps {
  exercise: CompletarEspaciosData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
}
