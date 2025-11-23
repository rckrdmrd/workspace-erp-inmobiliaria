/**
 * AI Service API Integration
 *
 * API client for AI-powered features including text analysis,
 * reading assistance, fact checking, and hypothesis validation.
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Text analysis request
 */
export interface TextAnalysisRequest {
  text: string;
  analysisTypes?: ('sentiment' | 'keywords' | 'summary' | 'difficulty' | 'readability')[];
  language?: string;
}

/**
 * Text analysis response
 */
export interface TextAnalysisResponse {
  sentiment?: {
    score: number; // -1 to 1
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  keywords?: Array<{
    word: string;
    relevance: number;
    category?: string;
  }>;
  summary?: {
    text: string;
    sentences: string[];
    compressionRatio: number;
  };
  difficulty?: {
    level: 'easy' | 'medium' | 'hard' | 'expert';
    score: number; // 0-100
    factors: {
      vocabularyComplexity: number;
      sentenceLength: number;
      conceptDensity: number;
    };
  };
  readability?: {
    fleschScore: number;
    gradeLevel: number;
    readingTime: number; // in minutes
  };
}

/**
 * AI-generated response request
 */
export interface GenerateResponseRequest {
  prompt: string;
  context?: string;
  maxLength?: number;
  temperature?: number; // 0-1
  responseType?: 'explanation' | 'hint' | 'feedback' | 'question';
}

/**
 * AI-generated response
 */
export interface GenerateResponseResponse {
  text: string;
  confidence: number;
  alternatives?: string[];
  metadata?: {
    tokensUsed: number;
    processingTime: number;
  };
}

/**
 * Fact checking request
 */
export interface FactCheckRequest {
  statement: string;
  context?: string;
  sources?: string[];
}

/**
 * Fact checking response
 */
export interface FactCheckResponse {
  isFactual: boolean;
  confidence: number; // 0-1
  rating: 'true' | 'mostly-true' | 'partly-true' | 'false' | 'unverifiable';
  explanation: string;
  sources?: Array<{
    title: string;
    url: string;
    relevance: number;
  }>;
  suggestedCorrection?: string;
}

/**
 * Hypothesis validation request
 */
export interface ValidateHypothesisRequest {
  hypothesis: string;
  evidence: string[];
  context?: string;
}

/**
 * Hypothesis validation response
 */
export interface ValidateHypothesisResponse {
  isValid: boolean;
  strength: 'strong' | 'moderate' | 'weak';
  confidence: number;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  suggestions: string[];
  reasoning: string;
}

/**
 * Reading assistance request
 */
export interface ReadingAssistanceRequest {
  text: string;
  assistanceType: 'simplify' | 'explain' | 'translate' | 'define' | 'summarize';
  targetLevel?: 'beginner' | 'intermediate' | 'advanced';
  word?: string; // For 'define' type
}

/**
 * Reading assistance response
 */
export interface ReadingAssistanceResponse {
  result: string;
  originalText?: string;
  confidence: number;
  metadata?: {
    changes?: number;
    readabilityImprovement?: number;
  };
}

/**
 * Suggestion request
 */
export interface SuggestionsRequest {
  text: string;
  suggestionType: 'grammar' | 'style' | 'comprehension' | 'vocabulary';
  context?: string;
}

/**
 * Suggestion response
 */
export interface SuggestionsResponse {
  suggestions: Array<{
    type: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    position?: { start: number; end: number };
    replacement?: string;
  }>;
  score: number; // Overall quality score 0-100
}

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

/**
 * Mock text analysis
 */
const mockAnalyzeText = async (request: TextAnalysisRequest): Promise<TextAnalysisResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    sentiment: {
      score: 0.7,
      label: 'positive',
      confidence: 0.85,
    },
    keywords: [
      { word: 'científico', relevance: 0.9, category: 'occupation' },
      { word: 'experimento', relevance: 0.8, category: 'activity' },
      { word: 'descubrimiento', relevance: 0.75, category: 'event' },
    ],
    summary: {
      text: 'Un científico realiza un experimento revolucionario.',
      sentences: ['Un científico realiza un experimento.', 'El resultado es revolucionario.'],
      compressionRatio: 0.3,
    },
    difficulty: {
      level: 'medium',
      score: 65,
      factors: {
        vocabularyComplexity: 0.6,
        sentenceLength: 0.7,
        conceptDensity: 0.65,
      },
    },
    readability: {
      fleschScore: 65,
      gradeLevel: 8,
      readingTime: 2,
    },
  };
};

/**
 * Mock generate response
 */
const mockGenerateResponse = async (
  request: GenerateResponseRequest
): Promise<GenerateResponseResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    text: 'Esta es una respuesta generada por IA basada en el contexto proporcionado.',
    confidence: 0.82,
    alternatives: [
      'Alternativa 1: Enfoque diferente al problema.',
      'Alternativa 2: Otra perspectiva del tema.',
    ],
    metadata: {
      tokensUsed: 150,
      processingTime: 850,
    },
  };
};

// ============================================================================
// AI SERVICE API FUNCTIONS
// ============================================================================

/**
 * Analyze text with AI
 *
 * @param request - Text analysis request
 * @returns Analysis results
 */
export const analyzeText = async (request: TextAnalysisRequest): Promise<TextAnalysisResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA || !FEATURE_FLAGS.ENABLE_AI) {
      return await mockAnalyzeText(request);
    }

    const { data } = await apiClient.post<ApiResponse<TextAnalysisResponse>>(
      API_ENDPOINTS.ai.analyzeText,
      request
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Generate AI response
 *
 * @param request - Generation request
 * @returns Generated response
 */
export const generateResponse = async (
  request: GenerateResponseRequest
): Promise<GenerateResponseResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA || !FEATURE_FLAGS.ENABLE_AI) {
      return await mockGenerateResponse(request);
    }

    const { data } = await apiClient.post<ApiResponse<GenerateResponseResponse>>(
      API_ENDPOINTS.ai.generateResponse,
      request
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Check fact with AI
 *
 * @param request - Fact check request
 * @returns Fact check result
 */
export const checkFact = async (request: FactCheckRequest): Promise<FactCheckResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA || !FEATURE_FLAGS.ENABLE_AI) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        isFactual: true,
        confidence: 0.88,
        rating: 'mostly-true',
        explanation:
          'La afirmación es mayormente verdadera según las fuentes disponibles.',
        sources: [
          {
            title: 'Fuente Académica 1',
            url: 'https://example.com/source1',
            relevance: 0.9,
          },
        ],
      };
    }

    const { data } = await apiClient.post<ApiResponse<FactCheckResponse>>(
      API_ENDPOINTS.ai.checkFact,
      request
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Validate hypothesis with AI
 *
 * @param request - Hypothesis validation request
 * @returns Validation result
 */
export const validateHypothesis = async (
  request: ValidateHypothesisRequest
): Promise<ValidateHypothesisResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA || !FEATURE_FLAGS.ENABLE_AI) {
      await new Promise((resolve) => setTimeout(resolve, 1300));
      return {
        isValid: true,
        strength: 'moderate',
        confidence: 0.75,
        supportingEvidence: request.evidence.slice(0, 2),
        contradictingEvidence: [],
        suggestions: [
          'Considera agregar más evidencia experimental',
          'Revisa las fuentes alternativas',
        ],
        reasoning:
          'La hipótesis tiene fundamentos sólidos pero requiere más evidencia.',
      };
    }

    const { data } = await apiClient.post<ApiResponse<ValidateHypothesisResponse>>(
      API_ENDPOINTS.ai.validateHypothesis,
      request
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get reading assistance from AI
 *
 * @param request - Reading assistance request
 * @returns Assistance result
 */
export const getReadingAssistance = async (
  request: ReadingAssistanceRequest
): Promise<ReadingAssistanceResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA || !FEATURE_FLAGS.ENABLE_AI) {
      await new Promise((resolve) => setTimeout(resolve, 900));

      let result = '';
      switch (request.assistanceType) {
        case 'simplify':
          result = 'Texto simplificado: ' + request.text.substring(0, 100) + '...';
          break;
        case 'explain':
          result = 'Explicación: Este texto trata sobre...';
          break;
        case 'summarize':
          result = 'Resumen: ' + request.text.substring(0, 50) + '...';
          break;
        case 'define':
          result = `Definición de "${request.word}": término relacionado con...`;
          break;
        case 'translate':
          result = 'Traducción: ' + request.text;
          break;
      }

      return {
        result,
        originalText: request.text,
        confidence: 0.85,
        metadata: {
          changes: 5,
          readabilityImprovement: 15,
        },
      };
    }

    const { data } = await apiClient.post<ApiResponse<ReadingAssistanceResponse>>(
      API_ENDPOINTS.ai.improveReading,
      request
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get AI suggestions for text improvement
 *
 * @param request - Suggestions request
 * @returns Suggestions
 */
export const getSuggestions = async (
  request: SuggestionsRequest
): Promise<SuggestionsResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA || !FEATURE_FLAGS.ENABLE_AI) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return {
        suggestions: [
          {
            type: 'grammar',
            message: 'Considera usar un verbo más preciso',
            severity: 'info',
            position: { start: 10, end: 20 },
            replacement: 'ejemplo',
          },
        ],
        score: 85,
      };
    }

    const { data } = await apiClient.post<ApiResponse<SuggestionsResponse>>(
      API_ENDPOINTS.ai.getSuggestions,
      request
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  analyzeText,
  generateResponse,
  checkFact,
  validateHypothesis,
  getReadingAssistance,
  getSuggestions,
};
