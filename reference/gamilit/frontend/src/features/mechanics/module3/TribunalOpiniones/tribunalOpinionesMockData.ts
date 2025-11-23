import type { TribunalOpinionesData, Statement } from './tribunalOpinionesTypes';

/**
 * Mock data for Tribunal de Opiniones Exercise
 * Aligned with DocumentoDeDiseño_Mecanicas_GAMILIT_v6.3
 *
 * Exercise: Classify statements as HECHO/OPINIÓN/INTERPRETACIÓN
 */

const mockStatements: Statement[] = [
  {
    id: 'stmt-1',
    text: 'Marie Curie murió el 4 de julio de 1934.',
    correctClassification: 'hecho',
    correctVerdict: 'bien_fundamentada',
    explanation: 'Dato histórico verificable en registros oficiales y múltiples fuentes documentadas.'
  },
  {
    id: 'stmt-2',
    text: 'Fue la científica más brillante del siglo XX.',
    correctClassification: 'opinion',
    correctVerdict: 'sin_fundamento',
    explanation: 'Juicio de valor subjetivo. "Más brillante" no tiene criterios objetivos de medición.'
  },
  {
    id: 'stmt-3',
    text: 'Su exposición prolongada al radio contribuyó a su enfermedad y muerte.',
    correctClassification: 'interpretacion',
    correctVerdict: 'bien_fundamentada',
    explanation: 'Deducción razonable basada en evidencia médica y científica, aunque no 100% demostrable.'
  },
  {
    id: 'stmt-4',
    text: 'Marie Curie ganó dos Premios Nobel en diferentes disciplinas.',
    correctClassification: 'hecho',
    correctVerdict: 'bien_fundamentada',
    explanation: 'Hecho verificable: Nobel de Física (1903) y Nobel de Química (1911).'
  },
  {
    id: 'stmt-5',
    text: 'Pierre Curie era más inteligente que Marie.',
    correctClassification: 'opinion',
    correctVerdict: 'sin_fundamento',
    explanation: 'Opinión subjetiva sin evidencia. La "inteligencia" no se puede comparar objetivamente.'
  },
  {
    id: 'stmt-6',
    text: 'El rechazo de Marie a patentar el proceso del radio permitió el avance más rápido de la medicina.',
    correctClassification: 'interpretacion',
    correctVerdict: 'parcialmente_fundamentada',
    explanation: 'Interpretación con base histórica pero difícil de verificar el contrafactual (qué hubiera pasado con patente).'
  }
];

export const mockTribunalData: TribunalOpinionesData = {
  id: 'tribunal-marie-curie-01',
  title: 'Tribunal de Opiniones: Afirmaciones sobre Marie Curie',
  description: 'Evalúa diferentes afirmaciones sobre Marie Curie clasificándolas correctamente.',
  instructions: 'Lee cada afirmación, clasifícala como HECHO, OPINIÓN o INTERPRETACIÓN, y evalúa si está bien fundamentada.',
  content: {
    statements: mockStatements,
    evaluationCriteria: {
      evidencia: '¿Hay datos verificables que respalden la afirmación?',
      logica: '¿El razonamiento es válido y coherente?',
      falacias: '¿Evita errores lógicos comunes?'
    },
    classificationHelp: {
      hecho: 'Dato verificable objetivamente con fuentes documentadas',
      opinion: 'Juicio de valor subjetivo sin criterios objetivos de verificación',
      interpretacion: 'Deducción razonable basada en evidencia pero no 100% demostrable'
    }
  },
  config: {
    dragAndDrop: false,
    requireJustification: false,
    showHints: true
  }
};

// Legacy export for backward compatibility
export const mockTribunal = mockTribunalData;
