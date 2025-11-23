/**
 * TribunalOpiniones Types - Module 3.1
 * Aligned with DocumentoDeDiseño_Mecanicas_GAMILIT_v6.3
 *
 * Exercise: Classify statements as HECHO/OPINIÓN/INTERPRETACIÓN
 * and evaluate if they are well-founded
 */

// Classification types for statements
export type StatementClassification = 'hecho' | 'opinion' | 'interpretacion';

// Verdict for statement evaluation
export type StatementVerdict = 'bien_fundamentada' | 'parcialmente_fundamentada' | 'sin_fundamento';

// A statement to be evaluated by the student
export interface Statement {
  id: string;
  text: string;                          // The statement text
  topic?: string;                        // Optional topic/category
  source?: string;                       // Source of the statement (if known)
  correctClassification: StatementClassification;  // Expected classification
  correctVerdict: StatementVerdict;      // Expected verdict
  explanation: string;                   // Explanation of why this is the correct answer
}

// User's evaluation of a single statement
export interface StatementEvaluation {
  statementId: string;
  classification: StatementClassification;
  verdict: StatementVerdict;
  justification?: string;                // 2-3 line justification (optional)
}

// Exercise data from backend
export interface TribunalOpinionesData {
  id: string;
  title: string;
  description: string;
  instructions: string;
  content: {
    statements: Statement[];
    evaluationCriteria: {
      evidencia: string;      // "¿Hay datos verificables?"
      logica: string;         // "¿El razonamiento es válido?"
      falacias: string;       // "¿Evita errores lógicos?"
    };
    classificationHelp: {
      hecho: string;          // "Dato verificable objetivamente"
      opinion: string;        // "Juicio de valor subjetivo"
      interpretacion: string; // "Deducción razonable basada en evidencia"
    };
  };
  config: {
    dragAndDrop?: boolean;
    requireJustification?: boolean;
    showHints?: boolean;
  };
}

// Progress tracking
export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise state for auto-save
export interface TribunalOpinionesState {
  evaluations: StatementEvaluation[];
  currentStatementIndex: number;
  score: number;
  timeSpent: number;
  hintsUsed: number;
  isComplete: boolean;
}

// Answers format for backend submission
export interface TribunalOpinionesAnswers {
  evaluations: StatementEvaluation[];
}

// Exercise actions interface for parent control
export interface TribunalOpinionesActions {
  getState: () => TribunalOpinionesState;
  reset: () => void;
  validate: () => Promise<void>;
}

// Standardized exercise props interface
export interface TribunalOpinionesExerciseProps {
  exercise: TribunalOpinionesData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: { progress: ExerciseProgressUpdate; answers: TribunalOpinionesAnswers }) => void;
  actionsRef?: React.MutableRefObject<TribunalOpinionesActions | undefined>;
}

// UI helper types
export interface ClassificationOption {
  value: StatementClassification;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface VerdictOption {
  value: StatementVerdict;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Constants for UI
export const CLASSIFICATION_OPTIONS: ClassificationOption[] = [
  {
    value: 'hecho',
    label: 'HECHO',
    icon: '📋',
    description: 'Dato verificable objetivamente',
    color: 'bg-blue-100 border-blue-400 text-blue-800'
  },
  {
    value: 'opinion',
    label: 'OPINIÓN',
    icon: '💭',
    description: 'Juicio de valor subjetivo',
    color: 'bg-purple-100 border-purple-400 text-purple-800'
  },
  {
    value: 'interpretacion',
    label: 'INTERPRETACIÓN',
    icon: '🔍',
    description: 'Deducción basada en evidencia',
    color: 'bg-amber-100 border-amber-400 text-amber-800'
  }
];

export const VERDICT_OPTIONS: VerdictOption[] = [
  {
    value: 'bien_fundamentada',
    label: 'Bien Fundamentada',
    icon: '✅',
    description: 'Evidencia sólida + lógica válida',
    color: 'bg-green-100 border-green-400 text-green-800'
  },
  {
    value: 'parcialmente_fundamentada',
    label: 'Parcialmente Fundamentada',
    icon: '⚠️',
    description: 'Tiene evidencia pero con limitaciones',
    color: 'bg-yellow-100 border-yellow-400 text-yellow-800'
  },
  {
    value: 'sin_fundamento',
    label: 'Sin Fundamento',
    icon: '❌',
    description: 'Sin evidencia o lógica inválida',
    color: 'bg-red-100 border-red-400 text-red-800'
  }
];
