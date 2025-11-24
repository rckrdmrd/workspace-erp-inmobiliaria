/**
 * AI Service - Mock implementation of AI/ML backend services
 * All functions simulate async API calls with realistic delays
 */

import type {
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIDebateResponse,
  FactCheckResult,
  SourceCredibility,
  HypothesisValidation,
  InferenceSuggestion,
  NarrativeContinuation,
  ArgumentAnalysis,
  PerspectiveGeneration,
} from './aiTypes';

import {
  detectiveInferences,
  hypothesisValidations,
  narrativeContinuations,
  debateResponses,
  factCheckResults,
  sourceCredibilityData,
  argumentAnalyses,
  perspectiveGenerations,
  generateMockAnalysis,
} from './aiMockResponses';

// Simulate network delay
const simulateDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Simulate random network jitter
const getRandomDelay = (min: number = 1000, max: number = 2500): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Simulate occasional errors (5% chance)
const shouldSimulateError = (): boolean => {
  return Math.random() < 0.05;
};

/**
 * Main AI Analysis Service
 * Analyzes text based on context and type
 */
export const analyzeWithAI = async (
  request: AIAnalysisRequest
): Promise<AIAnalysisResponse> => {
  await simulateDelay(getRandomDelay());

  if (shouldSimulateError()) {
    throw new Error('AI service temporarily unavailable. Please try again.');
  }

  return generateMockAnalysis(request.text, request.context);
};

/**
 * Generate AI Debate Response
 * Returns counter-argument and analysis for debate mechanic
 */
export const generateAIDebateResponse = async (
  userArgument: string,
  debateTopic: string = 'scientificRisks'
): Promise<AIDebateResponse> => {
  await simulateDelay(getRandomDelay(1500, 3000));

  if (shouldSimulateError()) {
    throw new Error('Unable to generate debate response. Please retry.');
  }

  const response =
    debateResponses[debateTopic] || debateResponses.scientificRisks;

  // Simulate dynamic scoring based on user argument length and complexity
  const argumentScore = Math.min(
    0.95,
    0.6 + userArgument.split(' ').length * 0.002
  );

  return {
    ...response,
    argumentScore,
  };
};

/**
 * Check Fact Accuracy
 * Verifies claims against historical records
 */
export const checkFactAccuracy = async (
  claim: string
): Promise<FactCheckResult> => {
  await simulateDelay(getRandomDelay(800, 1500));

  if (shouldSimulateError()) {
    throw new Error('Fact-checking service unavailable. Please try again.');
  }

  // Simple keyword matching for demo
  if (claim.toLowerCase().includes('nobel')) {
    return factCheckResults.nobelPrizes;
  }
  if (claim.toLowerCase().includes('brilla') || claim.toLowerCase().includes('glow')) {
    return factCheckResults.radiumGlow;
  }
  if (claim.toLowerCase().includes('primera mujer doctorado')) {
    return factCheckResults.firstFemale;
  }

  // Default response
  return {
    isAccurate: true,
    confidence: 0.72,
    sources: [
      {
        name: 'Historical Archive',
        url: 'https://example.com',
        credibility: 0.8,
      },
    ],
    explanation:
      'Esta afirmación requiere verificación adicional con fuentes primarias.',
    alternativeClaims: [],
  };
};

/**
 * Analyze Source Credibility
 * Evaluates reliability and bias of sources
 */
export const analyzeSourceCredibility = async (
  sourceUrl: string
): Promise<SourceCredibility> => {
  await simulateDelay(getRandomDelay(1000, 2000));

  if (shouldSimulateError()) {
    throw new Error('Source analysis service unavailable.');
  }

  // Match known sources
  if (sourceUrl.includes('nobelprize.org')) {
    return sourceCredibilityData.nobelOrg;
  }
  if (sourceUrl.includes('wikipedia.org')) {
    return sourceCredibilityData.wikipedia;
  }

  // Default for unknown sources
  return {
    sourceUrl,
    sourceName: 'Unknown Source',
    credibilityScore: 0.5,
    biasLevel: 'mixed',
    factualReporting: 'medium',
    warnings: ['Fuente no verificada en nuestra base de datos'],
    strengths: [],
  };
};

/**
 * Validate Scientific Hypothesis
 * Checks hypothesis structure and scientific validity
 */
export const validateHypothesis = async (
  hypothesis: string,
  variables: string[]
): Promise<HypothesisValidation> => {
  await simulateDelay(getRandomDelay(1500, 2500));

  if (shouldSimulateError()) {
    throw new Error('Hypothesis validation service unavailable.');
  }

  // Check if it's a known hypothesis type
  if (hypothesis.toLowerCase().includes('radiactiv')) {
    return hypothesisValidations.radioactivity;
  }

  // Generate dynamic response
  const variableAnalysis = variables.map((v, idx) => ({
    name: v,
    type: (idx === 0 ? 'independent' : idx === 1 ? 'dependent' : 'controlled') as
      | 'independent'
      | 'dependent'
      | 'controlled',
    relevance: 0.7 + Math.random() * 0.25,
  }));

  return {
    isValid: true,
    scientificAccuracy: 0.75 + Math.random() * 0.2,
    variables: variableAnalysis,
    suggestions: [
      'Define claramente las variables controladas',
      'Especifica el método de medición',
      'Considera factores externos que puedan influir',
    ],
    researchQuestions: [
      '¿Cómo medirás los resultados?',
      '¿Qué controles implementarás?',
      '¿Qué rango de valores esperarías?',
    ],
  };
};

/**
 * Generate Inference Suggestions
 * Provides AI-powered inference hints for detective mechanic
 */
export const generateInferenceSuggestions = async (
  evidenceCollected: string[]
): Promise<InferenceSuggestion[]> => {
  await simulateDelay(getRandomDelay(1200, 2200));

  if (shouldSimulateError()) {
    throw new Error('Inference generation service unavailable.');
  }

  // Return relevant inferences based on evidence
  if (evidenceCollected.length < 3) {
    return detectiveInferences.slice(0, 1);
  } else if (evidenceCollected.length < 5) {
    return detectiveInferences.slice(0, 2);
  }

  return detectiveInferences;
};

/**
 * Continue Narrative Story
 * Generates story continuation for prediction mechanic
 */
export const continueNarrative = async (
  storyBeginning: string,
  userPrediction: string
): Promise<NarrativeContinuation> => {
  await simulateDelay(getRandomDelay(2000, 3500));

  if (shouldSimulateError()) {
    throw new Error('Narrative generation service unavailable.');
  }

  // Calculate prediction accuracy based on keywords
  const predictionWords = userPrediction.toLowerCase().split(' ');
  const keyWords = ['descubrimiento', 'radio', 'investigación', 'laboratorio'];
  const matchCount = keyWords.filter((kw) =>
    predictionWords.some((pw) => pw.includes(kw))
  ).length;
  const accuracy = 0.5 + (matchCount / keyWords.length) * 0.4;

  return {
    ...narrativeContinuations[0],
    predictionAccuracy: accuracy,
  };
};

/**
 * Analyze Argument Structure
 * Evaluates podcast/written arguments for critical thinking
 */
export const analyzeArgument = async (
  argumentText: string
): Promise<ArgumentAnalysis> => {
  await simulateDelay(getRandomDelay(1500, 2500));

  if (shouldSimulateError()) {
    throw new Error('Argument analysis service unavailable.');
  }

  const wordCount = argumentText.split(' ').length;
  const hasIntroduction = wordCount > 20;
  const hasThesis = argumentText.includes('creo') || argumentText.includes('considero');
  const hasSupport = wordCount > 50;
  const hasConclusion = wordCount > 80;

  const structureScore =
    (hasIntroduction ? 0.25 : 0) +
    (hasThesis ? 0.25 : 0) +
    (hasSupport ? 0.25 : 0) +
    (hasConclusion ? 0.25 : 0);

  return {
    ...argumentAnalyses.scientificSacrifice,
    overallScore: 0.6 + structureScore * 0.3,
    structure: {
      hasIntroduction,
      hasThesis,
      hasSupport,
      hasConclusion,
    },
  };
};

/**
 * Generate Multiple Perspectives
 * Creates diverse viewpoints for perspective matrix
 */
export const generatePerspectives = async (
  topic: string,
  count: number = 3
): Promise<PerspectiveGeneration[]> => {
  await simulateDelay(getRandomDelay(2000, 3500));

  if (shouldSimulateError()) {
    throw new Error('Perspective generation service unavailable.');
  }

  const availablePerspectives = Object.values(perspectiveGenerations);
  return availablePerspectives.slice(0, Math.min(count, availablePerspectives.length));
};

/**
 * Validate Context Assembly
 * Checks if context puzzle pieces are correctly assembled
 */
export const validateContextAssembly = async (
  assembledPieces: { id: string; content: string }[]
): Promise<{
  isCorrect: boolean;
  score: number;
  feedback: string;
  corrections: { pieceId: string; suggestion: string }[];
}> => {
  await simulateDelay(getRandomDelay(1000, 1800));

  if (shouldSimulateError()) {
    throw new Error('Context validation service unavailable.');
  }

  const correctOrder = assembledPieces.length >= 4;
  const score = correctOrder ? 90 + Math.floor(Math.random() * 10) : 60;

  return {
    isCorrect: correctOrder,
    score,
    feedback: correctOrder
      ? '¡Excelente! Has ensamblado correctamente el contexto histórico.'
      : 'Buen intento. Revisa el orden cronológico de los eventos.',
    corrections: correctOrder
      ? []
      : [
          {
            pieceId: assembledPieces[0]?.id || 'piece-1',
            suggestion: 'Este evento ocurrió después, no antes',
          },
        ],
  };
};

/**
 * Generate AI Hint
 * Provides contextual hints for struggling students
 */
export const generateHint = async (
  mechanicType: string,
  currentProgress: number
): Promise<string> => {
  await simulateDelay(getRandomDelay(500, 1000));

  const hints: Record<string, string[]> = {
    detective: [
      'Busca conexiones entre las fechas mencionadas en los documentos',
      'Presta atención a las referencias cruzadas en las cartas',
      'Considera el contexto histórico de principios del siglo XX',
    ],
    hypothesis: [
      'Recuerda: una hipótesis debe ser testeable',
      'Define claramente la variable independiente y dependiente',
      'Piensa en qué factores podrías controlar en el experimento',
    ],
    debate: [
      'Apoya tus argumentos con evidencia histórica',
      'Anticipa y responde a posibles contraargumentos',
      'Usa conectores lógicos para estructurar tu argumento',
    ],
  };

  const relevantHints = hints[mechanicType] || hints.detective;
  return relevantHints[Math.floor(Math.random() * relevantHints.length)];
};

/**
 * Export all AI services
 */
export const aiService = {
  analyzeWithAI,
  generateAIDebateResponse,
  checkFactAccuracy,
  analyzeSourceCredibility,
  validateHypothesis,
  generateInferenceSuggestions,
  continueNarrative,
  analyzeArgument,
  generatePerspectives,
  validateContextAssembly,
  generateHint,
};

export default aiService;
