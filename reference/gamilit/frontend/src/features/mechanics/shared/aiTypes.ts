/**
 * AI Service Types - Common interfaces for AI/ML interactions
 * All AI calls are MOCKS for frontend development
 */

export type AIAnalysisType =
  | 'inference'
  | 'debate'
  | 'fact-check'
  | 'hypothesis'
  | 'narrative'
  | 'argument'
  | 'perspective'
  | 'context';

export interface AIAnalysisRequest {
  text: string;
  context: string;
  analysisType: AIAnalysisType;
  options?: {
    difficulty?: 'facil' | 'medio' | 'dificil' | 'experto';
    language?: string;
    maxSuggestions?: number;
  };
}

export interface AIAnalysisResponse {
  confidence: number;
  suggestions: string[];
  feedback: string;
  score: number;
  detailedAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
}

export interface AIDebateMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  argumentStrength?: number;
  rhetoricalDevices?: string[];
}

export interface AIDebateResponse {
  message: string;
  counterArguments: string[];
  suggestedResponses: string[];
  argumentScore: number;
  rhetoricalAnalysis: {
    device: string;
    explanation: string;
  }[];
}

export interface FactCheckResult {
  isAccurate: boolean;
  confidence: number;
  sources: {
    name: string;
    url: string;
    credibility: number;
  }[];
  explanation: string;
  alternativeClaims?: string[];
}

export interface SourceCredibility {
  sourceUrl: string;
  sourceName: string;
  credibilityScore: number;
  biasLevel: 'left' | 'center' | 'right' | 'mixed';
  factualReporting: 'high' | 'medium' | 'low';
  warnings: string[];
  strengths: string[];
}

export interface HypothesisValidation {
  isValid: boolean;
  scientificAccuracy: number;
  variables: {
    name: string;
    type: 'independent' | 'dependent' | 'controlled';
    relevance: number;
  }[];
  suggestions: string[];
  researchQuestions: string[];
}

export interface InferenceSuggestion {
  inference: string;
  confidence: number;
  evidenceLinks: string[];
  reasoning: string;
}

export interface NarrativeContinuation {
  continuation: string;
  predictionAccuracy: number;
  explanation: string;
  alternativeEndings: string[];
}

export interface ArgumentAnalysis {
  overallScore: number;
  clarity: number;
  logic: number;
  evidence: number;
  persuasion: number;
  structure: {
    hasIntroduction: boolean;
    hasThesis: boolean;
    hasSupport: boolean;
    hasConclusion: boolean;
  };
  feedback: string[];
  improvements: string[];
}

export interface PerspectiveGeneration {
  perspective: string;
  viewpoint: string;
  arguments: string[];
  counterarguments: string[];
  biases: string[];
  contextualFactors: string[];
}

export interface AILoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export interface AIErrorState {
  hasError: boolean;
  message?: string;
  retryable: boolean;
}
