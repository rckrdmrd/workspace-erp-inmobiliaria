/**
 * AI Mock Responses - Realistic Marie Curie themed responses
 * These simulate backend AI/ML services for frontend development
 */

import type {
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

// Detective Textual Mock Responses
export const detectiveInferences: InferenceSuggestion[] = [
  {
    inference: 'Marie Curie trabajó con materiales radiactivos sin protección adecuada',
    confidence: 0.95,
    evidenceLinks: ['notebook-entry-1898', 'letter-pierre-1902'],
    reasoning:
      'Sus notas de laboratorio mencionan la manipulación directa de muestras de radio y polonio',
  },
  {
    inference: 'La exposición a la radiación contribuyó a su enfermedad',
    confidence: 0.88,
    evidenceLinks: ['medical-records', 'historical-analysis'],
    reasoning:
      'Los registros médicos históricos muestran síntomas consistentes con exposición prolongada a radiación',
  },
  {
    inference: 'Curie priorizó el descubrimiento científico sobre su seguridad personal',
    confidence: 0.92,
    evidenceLinks: ['personal-letters', 'biography-excerpts'],
    reasoning:
      'Sus cartas personales revelan su dedicación inquebrantable a la investigación a pesar de los riesgos conocidos',
  },
];

// Hypothesis Validation Mock Responses
export const hypothesisValidations: Record<string, HypothesisValidation> = {
  radioactivity: {
    isValid: true,
    scientificAccuracy: 0.93,
    variables: [
      {
        name: 'Material radiactivo',
        type: 'independent',
        relevance: 0.98,
      },
      {
        name: 'Intensidad de radiación emitida',
        type: 'dependent',
        relevance: 0.95,
      },
      {
        name: 'Temperatura del ambiente',
        type: 'controlled',
        relevance: 0.75,
      },
    ],
    suggestions: [
      'Considera añadir un control sobre la masa del material',
      'Define con precisión cómo medirás la radiación',
      'Especifica el rango de temperaturas a controlar',
    ],
    researchQuestions: [
      '¿Cómo varía la radiación con diferentes masas del material?',
      '¿Existe una relación lineal entre masa y radiación emitida?',
      '¿Qué factores externos pueden afectar las mediciones?',
    ],
  },
};

// Narrative Prediction Mock Responses
export const narrativeContinuations: NarrativeContinuation[] = [
  {
    continuation:
      'Marie Curie observó con asombro cómo el material brillaba en la oscuridad. Este fenómeno extraordinario la llevó a profundizar su investigación sobre las propiedades de los elementos radiactivos. Con determinación, decidió aislar el elemento responsable de esta luminiscencia, un proceso que tomaría años de trabajo meticuloso.',
    predictionAccuracy: 0.87,
    explanation:
      'Tu predicción captura bien el espíritu científico de Curie. El tono de asombro y determinación refleja su personalidad histórica.',
    alternativeEndings: [
      'Sin embargo, las dificultades técnicas amenazaban con detener su investigación...',
      'Pierre, su esposo, se unió al proyecto, combinando sus conocimientos en física...',
      'Los colegas escépticos dudaban de sus hallazgos, pero ella perseveró...',
    ],
  },
];

// Debate AI Opponent Responses
export const debateResponses: Record<string, AIDebateResponse> = {
  scientificRisks: {
    message:
      'Si bien reconozco el valor del sacrificio científico, debemos considerar que la seguridad del investigador es fundamental para la continuidad del conocimiento. Marie Curie podría haber hecho contribuciones aún mayores si hubiera vivido más tiempo. ¿No crees que proteger a los científicos es proteger el futuro de la ciencia?',
    counterArguments: [
      'La longevidad de los investigadores permite más descubrimientos',
      'Los protocolos de seguridad no frenan el progreso científico',
      'El conocimiento actual sobre radiación se debió a tragedias evitables',
    ],
    suggestedResponses: [
      'Sin embargo, los descubrimientos de Curie fueron posibles precisamente por su dedicación total...',
      'En su época, no existía conciencia sobre los peligros de la radiación...',
      'El legado de Curie inspiró medidas de seguridad para futuras generaciones...',
    ],
    argumentScore: 0.82,
    rhetoricalAnalysis: [
      {
        device: 'Pregunta retórica',
        explanation:
          'Usa una pregunta para involucrar al oponente y dirigir el pensamiento',
      },
      {
        device: 'Apelación a consecuencias',
        explanation: 'Destaca los resultados positivos de su postura',
      },
    ],
  },
  scientificSharing: {
    message:
      'Es admirable tu postura sobre el libre acceso al conocimiento. Sin embargo, ¿cómo garantizamos que descubrimientos peligrosos, como los relacionados con elementos radiactivos, no caigan en manos que puedan usarlos con fines destructivos? Marie Curie enfrentó este dilema cuando su investigación tuvo aplicaciones militares.',
    counterArguments: [
      'El conocimiento sin control puede ser peligroso',
      'Las patentes permiten financiar más investigación',
      'La propiedad intelectual protege las inversiones en ciencia',
    ],
    suggestedResponses: [
      'La educación y la ética científica son mejores controles que las restricciones...',
      'Curie rechazó patentar el proceso de aislamiento del radio deliberadamente...',
      'El conocimiento compartido acelera los avances científicos globales...',
    ],
    argumentScore: 0.85,
    rhetoricalAnalysis: [
      {
        device: 'Reconocimiento y refutación',
        explanation: 'Valida el punto contrario antes de refutarlo',
      },
      {
        device: 'Ejemplo histórico',
        explanation: 'Usa el caso de Curie para dar contexto real',
      },
    ],
  },
};

// Fact Checking Mock Responses
export const factCheckResults: Record<string, FactCheckResult> = {
  nobelPrizes: {
    isAccurate: true,
    confidence: 0.99,
    sources: [
      {
        name: 'Nobel Prize Official Database',
        url: 'https://www.nobelprize.org',
        credibility: 0.99,
      },
      {
        name: 'Biografía Oficial Marie Curie',
        url: 'https://www.mariecurie.org.uk',
        credibility: 0.95,
      },
    ],
    explanation:
      'Marie Curie recibió el Premio Nobel de Física en 1903 (compartido con Pierre Curie y Henri Becquerel) y el Premio Nobel de Química en 1911 por el descubrimiento del radio y polonio. Es la única persona en ganar Premios Nobel en dos ciencias diferentes.',
    alternativeClaims: [],
  },
  radiumGlow: {
    isAccurate: true,
    confidence: 0.92,
    sources: [
      {
        name: 'American Chemical Society',
        url: 'https://www.acs.org',
        credibility: 0.96,
      },
      {
        name: 'Scientific American Archives',
        url: 'https://www.scientificamerican.com',
        credibility: 0.93,
      },
    ],
    explanation:
      'El radio efectivamente emite un brillo visible en la oscuridad debido a la radioluminiscencia. Las muestras de radio de Curie brillaban con una luz azul-verde, fenómeno que ella describió en sus notas de laboratorio.',
    alternativeClaims: [],
  },
  firstFemale: {
    isAccurate: false,
    confidence: 0.87,
    sources: [
      {
        name: 'Universidad de París - Archivos Históricos',
        url: 'https://www.sorbonne-universite.fr',
        credibility: 0.94,
      },
    ],
    explanation:
      'Marie Curie NO fue la primera mujer en obtener un doctorado en Europa, pero SÍ fue la primera mujer profesora en la Universidad de París. Hubo mujeres que obtuvieron doctorados antes que ella en diferentes universidades europeas.',
    alternativeClaims: [
      'Primera mujer profesora en la Universidad de París',
      'Primera mujer en ganar un Premio Nobel',
      'Primera persona en ganar dos Premios Nobel',
    ],
  },
};

// Source Credibility Analysis
export const sourceCredibilityData: Record<string, SourceCredibility> = {
  nobelOrg: {
    sourceUrl: 'https://www.nobelprize.org',
    sourceName: 'Nobel Prize Official Website',
    credibilityScore: 0.99,
    biasLevel: 'center',
    factualReporting: 'high',
    warnings: [],
    strengths: [
      'Fuente primaria oficial',
      'Información verificada y archivada',
      'Sin afiliaciones políticas',
    ],
  },
  wikipedia: {
    sourceUrl: 'https://es.wikipedia.org',
    sourceName: 'Wikipedia',
    credibilityScore: 0.78,
    biasLevel: 'center',
    factualReporting: 'medium',
    warnings: [
      'Contenido editable por usuarios',
      'Requiere verificación con fuentes primarias',
    ],
    strengths: [
      'Referencias citadas disponibles',
      'Proceso de revisión comunitaria',
      'Información generalmente confiable para temas históricos',
    ],
  },
  tabloidScience: {
    sourceUrl: 'https://example-tabloid.com',
    sourceName: 'Science Sensations Magazine',
    credibilityScore: 0.42,
    biasLevel: 'mixed',
    factualReporting: 'low',
    warnings: [
      'Tendencia al sensacionalismo',
      'Citas científicas descontextualizadas',
      'Falta de revisión por pares',
    ],
    strengths: ['Contenido entretenido', 'Temas de actualidad'],
  },
};

// Argument Analysis Mock Response
export const argumentAnalyses: Record<string, ArgumentAnalysis> = {
  scientificSacrifice: {
    overallScore: 0.82,
    clarity: 0.85,
    logic: 0.88,
    evidence: 0.75,
    persuasion: 0.8,
    structure: {
      hasIntroduction: true,
      hasThesis: true,
      hasSupport: true,
      hasConclusion: true,
    },
    feedback: [
      'Tu argumento presenta una estructura clara y lógica',
      'El uso de ejemplos históricos fortalece tu posición',
      'La transición entre ideas es fluida',
    ],
    improvements: [
      'Incluye más evidencia específica de las notas de Curie',
      'Considera anticipar contraargumentos sobre seguridad científica',
      'Refuerza la conclusión con una llamada a la acción',
    ],
  },
};

// Perspective Generation Mock Responses
export const perspectiveGenerations: Record<string, PerspectiveGeneration> = {
  historicalContext: {
    perspective: 'Contexto Histórico de Principios del Siglo XX',
    viewpoint:
      'En 1900, la sociedad tenía expectativas muy limitadas para las mujeres en ciencia',
    arguments: [
      'Las universidades raramente admitían mujeres en programas científicos',
      'Los laboratorios no estaban equipados para investigadoras femeninas',
      'El reconocimiento científico sistemáticamente favorecía a hombres',
    ],
    counterarguments: [
      'Algunas mujeres lograron destacar a pesar de las barreras',
      'El mérito científico eventualmente superó los prejuicios',
      'Las contribuciones de Curie forzaron cambios institucionales',
    ],
    biases: [
      'Prejuicios de género arraigados en la época',
      'Concepciones sobre "trabajo apropiado" para mujeres',
    ],
    contextualFactors: [
      'Movimientos sufragistas emergentes',
      'Revolución industrial y científica',
      'Nacionalismo francés vs polaco',
    ],
  },
  scientificEthics: {
    perspective: 'Ética Científica Moderna',
    viewpoint:
      'La seguridad del investigador debe ser una prioridad ética fundamental',
    arguments: [
      'Los descubrimientos no justifican el sacrificio de vidas humanas',
      'Protocolos de seguridad modernos permiten investigación segura',
      'La longevidad de investigadores beneficia la ciencia a largo plazo',
    ],
    counterarguments: [
      'En 1900 no se conocían los riesgos de la radiación',
      'Los descubrimientos de Curie salvaron millones de vidas posteriormente',
      'El contexto histórico debe considerarse al evaluar decisiones pasadas',
    ],
    biases: ['Presentismo al juzgar decisiones históricas'],
    contextualFactors: [
      'Desarrollo de comités de ética desde 1950',
      'Tragedias históricas que informaron regulaciones',
      'Avances en equipamiento de protección',
    ],
  },
  genderEquality: {
    perspective: 'Igualdad de Género en Ciencia',
    viewpoint:
      'Marie Curie es un símbolo de la lucha por la igualdad en STEM',
    arguments: [
      'Demostró que las capacidades científicas no dependen del género',
      'Abrió camino para futuras generaciones de científicas',
      'Desafió exitosamente las normas sociales restrictivas',
    ],
    counterarguments: [
      'El progreso hacia la igualdad ha sido lento incluso después de Curie',
      'Las barreras sistémicas persisten en campos STEM',
      'La excepcionalidad de Curie no cambió estructuras institucionales',
    ],
    biases: ['Romanticización de figuras históricas individuales'],
    contextualFactors: [
      'Movimientos feministas del siglo XX',
      'Legislación sobre igualdad de oportunidades',
      'Brecha de género persistente en ciencias',
    ],
  },
};

// General AI Analysis Mock Response
export function generateMockAnalysis(
  text: string,
  context: string
): AIAnalysisResponse {
  const wordCount = text.split(' ').length;
  const complexity = wordCount > 100 ? 'high' : wordCount > 50 ? 'medium' : 'low';

  return {
    confidence: 0.75 + Math.random() * 0.2,
    suggestions: [
      'Considera profundizar en las motivaciones de Marie Curie',
      'Añade referencias específicas a sus descubrimientos',
      'Conecta los eventos históricos con el contexto de la época',
    ],
    feedback: `Tu análisis muestra comprensión del tema. Con ${wordCount} palabras, tu respuesta tiene una complejidad ${complexity}. Continúa desarrollando tus ideas con evidencia específica.`,
    score: 70 + Math.floor(Math.random() * 25),
    detailedAnalysis: {
      strengths: [
        'Buena estructura de respuesta',
        'Vocabulario apropiado',
        'Conexiones lógicas entre ideas',
      ],
      weaknesses: [
        'Podrías incluir más detalles específicos',
        'Algunas afirmaciones necesitan respaldo',
      ],
      improvements: [
        'Lee más sobre el contexto histórico de la época',
        'Cita fuentes primarias cuando sea posible',
        'Desarrolla contraargumentos para fortalecer tu posición',
      ],
    },
  };
}
