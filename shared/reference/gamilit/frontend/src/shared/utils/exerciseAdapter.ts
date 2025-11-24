// ============================================
// EXERCISE DATA ADAPTER
// Converts ExerciseData from ExercisePage to specific mechanic formats
// ============================================

import { BaseExercise, DifficultyLevel, DifficultyLevelEnum, Hint } from '@shared/components/mechanics/mechanicsTypes';

/**
 * Generic ExerciseData type from ExercisePage
 */
export interface ExerciseData {
  id: string;
  module_id: string;
  title: string;
  type: string;
  description: string;
  difficulty: DifficultyLevel; // Uses official CEFR enum
  points: number;
  estimatedTime: number;
  completed: boolean;
  moduleTitle?: string;
  mechanicData?: any;
}

/**
 * Maps difficulty levels - validates against DifficultyLevel enum
 */
const mapDifficulty = (difficulty: any): DifficultyLevel => {
  // Handle legacy string values
  const legacyMap: Record<string, DifficultyLevel> = {
    'facil': DifficultyLevelEnum.BEGINNER,
    'medio': DifficultyLevelEnum.INTERMEDIATE,
    'dificil': DifficultyLevelEnum.ADVANCED,
    'experto': DifficultyLevelEnum.PROFICIENT,
  };

  // If it's a legacy value, map it
  if (typeof difficulty === 'string' && legacyMap[difficulty]) {
    return legacyMap[difficulty];
  }

  // If it's already a valid DifficultyLevel, return it
  const validValues = Object.values(DifficultyLevelEnum);
  if (validValues.includes(difficulty)) {
    return difficulty;
  }

  // Default to INTERMEDIATE (B2)
  return DifficultyLevelEnum.INTERMEDIATE;
};

/**
 * Generates default hints if none are provided
 * Backend expects hints as string[], not objects
 */
const generateDefaultHints = (type: string): Hint[] => {
  return [
    'Lee cuidadosamente las instrucciones',
    'Presta atención a los detalles',
    'Revisa tu respuesta antes de enviar',
  ];
};

/**
 * Converts ExerciseData to BaseExercise format
 * This creates the base structure that all mechanics extend from
 */
export const adaptToBaseExercise = (exercise: ExerciseData): BaseExercise => {
  // Ensure hints is always string[] (Backend format)
  let hints: Hint[] = generateDefaultHints(exercise.type);

  if (exercise.mechanicData?.hints) {
    // If hints come from backend as string[], use them directly
    if (Array.isArray(exercise.mechanicData.hints) && typeof exercise.mechanicData.hints[0] === 'string') {
      hints = exercise.mechanicData.hints;
    }
    // If hints are in old object format, extract text
    else if (Array.isArray(exercise.mechanicData.hints) && typeof exercise.mechanicData.hints[0] === 'object') {
      hints = exercise.mechanicData.hints.map((h: any) => h.text || h);
    }
  }

  return {
    id: exercise.id,
    title: exercise.title,
    difficulty: mapDifficulty(exercise.difficulty),
    estimatedTime: exercise.estimatedTime,
    topic: exercise.moduleTitle || exercise.type,
    // hints are handled separately in mechanic-specific adapters
  };
};

/**
 * Generates crossword grid from clues
 */
const generateGridFromClues = (clues: any[], rows: number, cols: number): any[][] => {
  // Initialize empty grid
  const grid: any[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = {
        row: r,
        col: c,
        letter: '',
        isBlack: true,
        userInput: '',
      };
    }
  }

  // Fill grid with letters from clues
  clues.forEach((clue) => {
    const { answer, startRow, startCol, direction, number } = clue;

    for (let i = 0; i < answer.length; i++) {
      let row, col;
      if (direction === 'horizontal') {
        row = startRow;
        col = startCol + i;
      } else {
        row = startRow + i;
        col = startCol;
      }

      if (row < rows && col < cols) {
        const existingCell = grid[row][col];

        // Check if this is the first letter of the word
        if (i === 0) {
          // Cell already has content - merge numbers
          if (!existingCell.isBlack && existingCell.number !== undefined) {
            grid[row][col] = {
              ...existingCell,
              letter: answer[i],
              numbers: existingCell.numbers
                ? [...existingCell.numbers, number].sort((a, b) => a - b)
                : [existingCell.number, number].sort((a, b) => a - b),
              number: undefined, // Clear single number, use array instead
            };
          } else {
            // First word in this cell
            grid[row][col] = {
              row,
              col,
              letter: answer[i],
              isBlack: false,
              number: number,
              userInput: '',
            };
          }
        } else {
          // Not the first letter - only update if cell is black or preserve existing
          if (existingCell.isBlack) {
            grid[row][col] = {
              row,
              col,
              letter: answer[i],
              isBlack: false,
              userInput: '',
            };
          }
          // If cell already has a letter (intersection), keep it as is
        }
      }
    }
  });

  return grid;
};

/**
 * Adapts ExerciseData to CrucigramaData format
 *
 * NEW (SECURE): Backend pre-generates grid without answers
 * FALLBACK: If old format, generate locally (backwards compatibility)
 */
export const adaptToCrucigramaData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get clues and grid from mechanicData.content
  const content = exercise.mechanicData?.content || {};

  // NEW FORMAT: Backend sends pre-built grid (SECURE)
  // Check if backend sent pre-generated grid (Array format)
  if (Array.isArray(content.grid) && content.gridConfig) {
    console.log('[SECURE] Using pre-generated grid from backend');

    return {
      ...base,
      grid: content.grid,              // Pre-built grid WITHOUT answers
      clues: content.clues || [],       // Clues WITHOUT answer field
      rows: content.gridConfig.rows,
      cols: content.gridConfig.cols,
    };
  }

  // FALLBACK: Old format - generate grid locally (BACKWARDS COMPATIBILITY)
  console.warn('[FALLBACK] Generating grid locally - consider updating backend');

  // Use words array for grid generation (new format)
  // or fall back to clues array (old format)
  let wordsForGrid: any[] = [];
  if (content.words && Array.isArray(content.words)) {
    // New format: words array with word, startRow, startCol, direction
    wordsForGrid = content.words.map((w: any) => ({
      answer: w.word,
      startRow: w.startRow,
      startCol: w.startCol,
      direction: w.direction,
      number: w.clueNumber,
    }));
  } else if (Array.isArray(content.clues)) {
    // Old format: direct clues array
    wordsForGrid = content.clues;
  } else if (content.clues && typeof content.clues === 'object') {
    // Alternative old format: { vertical: [], horizontal: [] }
    const vertical = (content.clues.vertical || []).map((c: any) => ({
      answer: c.word || c.answer,
      startRow: c.startRow || 0,
      startCol: c.startCol || 0,
      direction: 'vertical',
      number: c.number,
    }));
    const horizontal = (content.clues.horizontal || []).map((c: any) => ({
      answer: c.word || c.answer,
      startRow: c.startRow || 0,
      startCol: c.startCol || 0,
      direction: 'horizontal',
      number: c.number,
    }));
    wordsForGrid = [...vertical, ...horizontal];
  }

  // Get grid config or use default
  const gridConfig = content.grid || { rows: 15, cols: 15 };
  const rows = gridConfig.rows || 15;
  const cols = gridConfig.cols || 15;

  // Generate grid from words (OLD WAY)
  const grid = generateGridFromClues(wordsForGrid, rows, cols);

  // Convert clues to flat array format expected by CrucigramaExercise component
  let cluesArray: any[] = [];
  if (content.clues && typeof content.clues === 'object' && !Array.isArray(content.clues)) {
    // New format: { vertical: [], horizontal: [] } + words array with positions
    const words = content.words || [];

    const vertical = (content.clues.vertical || []).map((c: any) => {
      const wordData = words.find((w: any) => w.clueNumber === c.number && w.direction === 'vertical');
      return {
        ...c,
        id: `v${c.number}`,
        direction: 'vertical',
        answer: c.word,
        startRow: wordData?.startRow || 0,
        startCol: wordData?.startCol || 0,
      };
    });

    const horizontal = (content.clues.horizontal || []).map((c: any) => {
      const wordData = words.find((w: any) => w.clueNumber === c.number && w.direction === 'horizontal');
      return {
        ...c,
        id: `h${c.number}`,
        direction: 'horizontal',
        answer: c.word,
        startRow: wordData?.startRow || 0,
        startCol: wordData?.startCol || 0,
      };
    });

    cluesArray = [...horizontal, ...vertical];
  } else if (Array.isArray(content.clues)) {
    // Old format: already an array
    cluesArray = content.clues;
  }

  return {
    ...base,
    grid,
    clues: cluesArray, // Flat array for component
    rows,
    cols,
  };
};

/**
 * Adapts ExerciseData to TimelineData format
 */
export const adaptToTimelineData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get data from mechanicData.content
  const content = exercise.mechanicData?.content || {};
  const solution = exercise.mechanicData?.solution || {};

  return {
    ...base,
    events: content.events || [],
    correctOrder: solution.correctOrder || [],
    categories: content.categories || [],
  };
};

/**
 * Adapts ExerciseData to VerdaderoFalsoData format
 */
export const adaptToVerdaderoFalsoData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get data from mechanicData.content
  const content = exercise.mechanicData?.content || {};

  return {
    ...base,
    contextText: content.contextText || '',
    statements: content.statements || [],
  };
};

/**
 * Adapts ExerciseData to EmparejamientoData format
 */
export const adaptToEmparejamientoData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get data from mechanicData.content
  const content = exercise.mechanicData?.content || {};

  // Convert pairs to cards format
  const pairs = content.pairs || [];
  const cards = [];

  pairs.forEach((pair: any) => {
    cards.push({
      id: pair.left.id,
      content: pair.left.content,
      matchId: pair.id,
      type: 'question',
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: pair.right.id,
      content: pair.right.content,
      matchId: pair.id,
      type: 'answer',
      isFlipped: false,
      isMatched: false,
    });
  });

  return {
    ...base,
    scenarioText: content.scenarioText || '',
    cards,
  };
};

/**
 * Adapts ExerciseData to CompletarEspaciosData format
 */
export const adaptToCompletarEspaciosData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get data from mechanicData.content
  const content = exercise.mechanicData?.content || {};

  return {
    ...base,
    scenarioText: content.scenarioText || '',
    text: content.text || '',
    blanks: content.blanks || [],
    wordBank: content.wordBank || [],
  };
};

/**
 * Adapts ExerciseData to SopaLetrasData format
 */
export const adaptToSopaLetrasData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get config and content from mechanicData
  const config = exercise.mechanicData?.config || {};
  const content = exercise.mechanicData?.content || {};

  // Mock data for sopa de letras - fallback if no data from backend
  const mockGrid = [
    ['M', 'A', 'R', 'I', 'E'],
    ['C', 'U', 'R', 'I', 'E'],
  ];

  const mockWords = ['MARIE', 'CURIE'];
  const mockWordsPositions = [
    { word: 'MARIE', found: false, startRow: 0, startCol: 0, direction: 'horizontal' as const },
    { word: 'CURIE', found: false, startRow: 1, startCol: 0, direction: 'horizontal' as const },
  ];

  // Build config object
  const gridSize = config.gridSize || { rows: mockGrid.length, cols: mockGrid[0]?.length || 5 };

  const sopaConfig = {
    gridSize,
    useStaticGrid: config.useStaticGrid || false,
    directions: config.directions || ['horizontal', 'vertical', 'diagonal'],
    selectionMode: config.selectionMode || 'click-drag',
    highlightFound: config.highlightFound !== undefined ? config.highlightFound : true,
  };

  // Build content object
  const sopaContent = {
    grid: content.grid || mockGrid,
    words: content.words || mockWords,
    wordsPositions: content.wordsPositions || mockWordsPositions,
  };

  return {
    ...base,
    config: sopaConfig,
    content: sopaContent,
    // Keep convenience properties for backward compatibility
    rows: gridSize.rows,
    cols: gridSize.cols,
  };
};

/**
 * Adapts ExerciseData to MapaConceptualData format
 */
export const adaptToMapaConceptualData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Mock data for mapa conceptual - In production, this would come from mechanicData
  const mockNodes = [
    { id: '1', label: 'Marie Curie', x: 300, y: 100, type: 'central' as const },
    { id: '2', label: 'Polonia', x: 100, y: 200, type: 'secondary' as const },
    { id: '3', label: 'París', x: 500, y: 200, type: 'secondary' as const },
  ];

  const mockConnections = ['1-2', '1-3'];

  return {
    ...base,
    nodes: exercise.mechanicData?.nodes || mockNodes,
    correctConnections: exercise.mechanicData?.correctConnections || mockConnections,
  };
};

/**
 * Adapts ExerciseData to LecturaInferencialData format
 * Module 2 - Reading comprehension with multiple choice inference questions
 */
export const adaptToLecturaInferencialData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get config and content from mechanicData
  const config = exercise.mechanicData?.config || {};
  const content = exercise.mechanicData?.content || {};

  // Build config object with defaults
  const lecturaConfig = {
    timePerQuestion: config.timePerQuestion || 90,
    allowReview: config.allowReview !== undefined ? config.allowReview : true,
    showExplanations: config.showExplanations !== undefined ? config.showExplanations : true,
    shuffleQuestions: config.shuffleQuestions || false,
    shuffleOptions: config.shuffleOptions || false,
  };

  // Build content object
  const lecturaContent = {
    passage: content.passage || '',
    questions: content.questions || [],
  };

  return {
    ...base,
    config: lecturaConfig,
    content: lecturaContent,
  };
};

/**
 * Adapts ExerciseData to CausaEfectoData format
 * Module 2 - Cause-Effect relationships with drag & drop
 */
export const adaptToCausaEfectoData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get config and content from mechanicData
  const config = exercise.mechanicData?.config || {};
  const content = exercise.mechanicData?.content || {};

  // Build config object with defaults
  const causaEfectoConfig = {
    allowMultiple: config.allowMultiple !== undefined ? config.allowMultiple : true,
    showFeedback: config.showFeedback !== undefined ? config.showFeedback : true,
    dragAndDrop: config.dragAndDrop !== undefined ? config.dragAndDrop : true,
  };

  // Build content object
  const causaEfectoContent = {
    causes: content.causes || [],
    consequences: content.consequences || [],
  };

  return {
    ...base,
    config: causaEfectoConfig,
    content: causaEfectoContent,
  };
};

/**
 * Adapts ExerciseData to PrediccionNarrativaData format
 * Module 2 - Narrative prediction with multiple choice scenarios
 */
export const adaptToPrediccionNarrativaData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get content from mechanicData
  const content = exercise.mechanicData?.content || {};

  return {
    ...base,
    subtitle: exercise.mechanicData?.subtitle || '',
    description: exercise.description || '',
    instructions: exercise.mechanicData?.instructions || '',
    scenarios: content.scenarios || [],
  };
};

/**
 * Adapts ExerciseData to PuzzleContextoData format
 * Module 2 - Ordering fragments to create a coherent inference
 */
export const adaptToPuzzleContextoData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get content and solution from mechanicData
  const content = exercise.mechanicData?.content || {};
  const solution = exercise.mechanicData?.solution || {};

  return {
    ...base,
    subtitle: exercise.mechanicData?.subtitle || '',
    description: exercise.description || '',
    instructions: exercise.mechanicData?.instructions || '',
    completeInference: content.completeInference || '',
    fragments: content.fragments || [],
    correctOrder: solution.correctOrder || [],
  };
};

/**
 * Adapts ExerciseData to TribunalOpinionesData format
 * Module 3 - Classify statements as HECHO/OPINIÓN/INTERPRETACIÓN
 *
 * Expected database format (v6.3):
 * content: {
 *   statements: [
 *     { id: "stmt-1", text: "...", correctClassification: "hecho", correctVerdict: "bien_fundamentada", explanation: "..." }
 *   ]
 * }
 */
export const adaptToTribunalOpinionesData = (exercise: ExerciseData): any => {
  const base = adaptToBaseExercise(exercise);

  // Get config and content from mechanicData
  const config = exercise.mechanicData?.config || {};
  const content = exercise.mechanicData?.content || {};

  // Build config object with defaults
  const tribunalConfig = {
    dragAndDrop: config.dragAndDrop !== undefined ? config.dragAndDrop : false,
    requireJustification: config.requireJustification !== undefined ? config.requireJustification : false,
    showHints: config.showHints !== undefined ? config.showHints : true,
  };

  // Get statements from database content (v6.3 format)
  const statements = content.statements || [];

  if (statements.length === 0) {
    console.warn('[TribunalOpiniones] No statements found in exercise content');
  }

  // Build content object with statements
  const tribunalContent = {
    statements,
    evaluationCriteria: content.evaluationCriteria || {
      evidencia: '¿Hay datos verificables que respalden la afirmación?',
      logica: '¿El razonamiento es válido y coherente?',
      falacias: '¿Evita errores lógicos comunes?'
    },
    classificationHelp: content.classificationHelp || {
      hecho: 'Dato verificable objetivamente con fuentes documentadas',
      opinion: 'Juicio de valor subjetivo sin criterios objetivos de verificación',
      interpretacion: 'Deducción razonable basada en evidencia pero no 100% demostrable'
    }
  };

  return {
    ...base,
    description: exercise.description || '',
    instructions: exercise.mechanicData?.instructions || 'Clasifica cada afirmación y evalúa si está bien fundamentada.',
    config: tribunalConfig,
    content: tribunalContent,
  };
};

/**
 * Generic adapter that routes to the correct specific adapter based on exercise type
 */
export const adaptExerciseData = (exercise: ExerciseData): any => {
  // Validate exercise and type
  if (!exercise) {
    console.error('adaptExerciseData: exercise is null or undefined');
    return null;
  }

  if (!exercise.type || typeof exercise.type !== 'string') {
    console.error('adaptExerciseData: exercise.type is invalid:', exercise.type);
    // Return base exercise with default values
    return adaptToBaseExercise(exercise);
  }

  const type = exercise.type.toLowerCase();

  if (type.includes('crucigrama')) {
    return adaptToCrucigramaData(exercise);
  } else if (type.includes('timeline') || type.includes('linea_tiempo')) {
    return adaptToTimelineData(exercise);
  } else if (type.includes('verdadero_falso') || type.includes('true_false')) {
    return adaptToVerdaderoFalsoData(exercise);
  } else if (type.includes('emparejamiento') || type.includes('matching')) {
    return adaptToEmparejamientoData(exercise);
  } else if (type.includes('completar_espacios') || type.includes('fill_in_blank')) {
    return adaptToCompletarEspaciosData(exercise);
  } else if (type.includes('sopa_letras')) {
    return adaptToSopaLetrasData(exercise);
  } else if (type.includes('mapa_conceptual') || type.includes('mapa conceptual')) {
    return adaptToMapaConceptualData(exercise);
  } else if (type.includes('lectura_inferencial') || type.includes('detective_textual')) {
    return adaptToLecturaInferencialData(exercise);
  } else if (type.includes('construccion_hipotesis')) {
    return adaptToCausaEfectoData(exercise);
  } else if (type.includes('prediccion_narrativa')) {
    return adaptToPrediccionNarrativaData(exercise);
  } else if (type.includes('puzzle_contexto')) {
    return adaptToPuzzleContextoData(exercise);
  } else if (type.includes('tribunal_opiniones')) {
    return adaptToTribunalOpinionesData(exercise);
  }

  // Default: return base exercise data
  return adaptToBaseExercise(exercise);
};
