import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entities';
import { DB_SCHEMAS } from '@shared/constants';
import { ExerciseTypeEnum } from '@shared/constants/enums.constants';

/**
 * ExercisesService
 *
 * Servicio para gestionar ejercicios educativos con 27+ tipos diferentes.
 * Incluye validación de JSONB según el tipo de ejercicio y gestión de pistas.
 */
@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise, 'educational')
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  /**
   * Obtener todos los ejercicios
   *
   * FE-059: Sanitiza todas las respuestas
   */
  async findAll(): Promise<Exercise[]> {
    const exercises = await this.exerciseRepo.find({
      order: { module_id: 'ASC', order_index: 'ASC' },
    });

    // FE-059: Sanitize all exercises
    return exercises.map(ex => this.sanitizeExercise(ex));
  }

  /**
   * Obtener un ejercicio por ID
   *
   * FE-059: Sanitiza la respuesta eliminando solution y correctAnswers del content
   */
  async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });

    if (!exercise) {
      return null;
    }

    // FE-059: Sanitize before returning to client
    return this.sanitizeExercise(exercise);
  }

  /**
   * Crear un nuevo ejercicio con validación
   */
  async create(exerciseData: Partial<Exercise>): Promise<Exercise> {
    // Validar que el contenido JSONB sea válido según el tipo de ejercicio
    if (exerciseData.exercise_type && exerciseData.content) {
      this.validateContentByExerciseType(
        exerciseData.exercise_type,
        exerciseData.content,
        exerciseData.config,
      );
    }

    const exercise = this.exerciseRepo.create(exerciseData);
    return await this.exerciseRepo.save(exercise);
  }

  /**
   * Actualizar un ejercicio existente
   */
  async update(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    const exercise = await this.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    // Si se actualiza el tipo o contenido, validar
    if (exerciseData.exercise_type || exerciseData.content) {
      const exerciseType = exerciseData.exercise_type || exercise.exercise_type;
      const content = exerciseData.content || exercise.content;
      const config = exerciseData.config || exercise.config;
      this.validateContentByExerciseType(exerciseType, content, config);
    }

    await this.exerciseRepo.update(id, exerciseData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Exercise with ID ${id} not found after update`);
    }
    return updated;
  }

  /**
   * Eliminar un ejercicio
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.exerciseRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Validar el contenido JSONB según el tipo de ejercicio
   * Asegura que la estructura sea correcta para cada mecánica
   */
  validateContentByExerciseType(
    exerciseType: ExerciseTypeEnum,
    content: Record<string, any>,
    config?: Record<string, any>,
  ): void {
    if (!content) {
      throw new BadRequestException('Content is required');
    }

    switch (exerciseType) {
      case ExerciseTypeEnum.CRUCIGRAMA:
        // Crucigrama requiere grid, across_clues, down_clues
        if (!content.grid || !content.across_clues || !content.down_clues) {
          throw new BadRequestException(
            'Crucigrama must have grid, across_clues, and down_clues',
          );
        }
        break;

      case ExerciseTypeEnum.SOPA_LETRAS:
        // Validar estructura básica
        if (!content?.words || !Array.isArray(content.words)) {
          throw new BadRequestException(
            'Sopa de letras must have words array',
          );
        }

        // Validación condicional según useStaticGrid
        if (config?.useStaticGrid) {
          // Grid estático: debe existir grid completo en content
          if (!content?.grid || !Array.isArray(content.grid)) {
            throw new BadRequestException(
              'Sopa de letras with useStaticGrid must have static grid in content',
            );
          }

          // Validar que grid tenga dimensiones correctas
          const rows = config?.gridSize?.rows || 0;
          const cols = config?.gridSize?.cols || 0;

          if (content.grid.length !== rows) {
            throw new BadRequestException(
              `Grid must have ${rows} rows (found ${content.grid.length})`,
            );
          }

          if (content.grid[0]?.length !== cols) {
            throw new BadRequestException(
              `Grid must have ${cols} columns (found ${content.grid[0]?.length})`,
            );
          }
        } else {
          // Grid generado: debe tener wordsPositions
          if (!content?.wordsPositions || !Array.isArray(content.wordsPositions)) {
            throw new BadRequestException(
              'Sopa de letras without useStaticGrid must have wordsPositions',
            );
          }
        }
        break;

      case ExerciseTypeEnum.MAPA_CONCEPTUAL:
        // Mapa conceptual requiere nodes y connections
        if (!content.nodes || !content.connections) {
          throw new BadRequestException(
            'Mapa conceptual must have nodes and connections',
          );
        }
        break;

      case ExerciseTypeEnum.EMPAREJAMIENTO:
        // Emparejamiento requiere pairs
        if (!content.pairs || !Array.isArray(content.pairs)) {
          throw new BadRequestException(
            'Emparejamiento must have pairs array',
          );
        }
        break;

      case ExerciseTypeEnum.VERDADERO_FALSO:
      case ExerciseTypeEnum.COMPLETAR_ESPACIOS:
      case ExerciseTypeEnum.QUIZ_TIKTOK:
        // Quiz requiere questions y correct_answers
        if (!content.question && !content.questions) {
          throw new BadRequestException(
            'Quiz must have question or questions',
          );
        }
        if (!content.correct_answers) {
          throw new BadRequestException(
            'Quiz must have correct_answers',
          );
        }
        break;

      case ExerciseTypeEnum.DETECTIVE_TEXTUAL:
      case ExerciseTypeEnum.COMPRENSION_AUDITIVA:
        // Detective textual requiere text/audio y clues
        if (!content.text && !content.audio_url) {
          throw new BadRequestException(
            'Detective textual must have text or audio_url',
          );
        }
        break;

      case ExerciseTypeEnum.LINEA_TIEMPO:
        // Línea de tiempo requiere events
        if (!content.events || !Array.isArray(content.events)) {
          throw new BadRequestException(
            'Linea tiempo must have events array',
          );
        }
        break;

      case ExerciseTypeEnum.PODCAST_ARGUMENTATIVO:
      case ExerciseTypeEnum.DEBATE_DIGITAL:
        // Debate requiere topics y arguments
        if (!content.topics || !content.arguments) {
          throw new BadRequestException(
            'Debate must have topics and arguments',
          );
        }
        break;

      // Otros tipos pueden tener estructura flexible
      default:
        // Validación mínima: debe tener al menos un campo
        if (Object.keys(content).length === 0) {
          throw new BadRequestException(
            'Content must have at least one property',
          );
        }
    }
  }

  /**
   * Obtener pistas para un ejercicio
   * Retorna las pistas disponibles del ejercicio
   */
  async getHints(exerciseId: string): Promise<string[]> {
    const exercise = await this.findById(exerciseId);
    if (!exercise) {
      throw new NotFoundException(
        `Exercise with ID ${exerciseId} not found`,
      );
    }

    if (!exercise.enable_hints) {
      throw new BadRequestException('Hints are disabled for this exercise');
    }

    return exercise.hints || [];
  }

  /**
   * Obtener ejercicios por módulo
   *
   * FE-059: Sanitiza todas las respuestas
   */
  async findByModuleId(moduleId: string): Promise<Exercise[]> {
    const exercises = await this.exerciseRepo.find({
      where: { module_id: moduleId },
      order: { order_index: 'ASC' },
    });

    // FE-059: Sanitize all exercises
    return exercises.map(ex => this.sanitizeExercise(ex));
  }

  /**
   * Obtener ejercicios activos
   *
   * FE-059: Sanitiza todas las respuestas
   */
  async findActive(): Promise<Exercise[]> {
    const exercises = await this.exerciseRepo.find({
      where: { is_active: true },
      order: { module_id: 'ASC', order_index: 'ASC' },
    });

    // FE-059: Sanitize all exercises
    return exercises.map(ex => this.sanitizeExercise(ex));
  }

  /**
   * FE-059: Sanitizes exercise data before sending to client
   *
   * @description Removes solution field and sanitizes content to prevent exposing correct answers.
   * Handles all 15 exercise types from Modules 1, 2, and 3.
   *
   * @param exercise - Exercise entity from database
   * @returns Sanitized exercise safe for client consumption
   */
  private sanitizeExercise(exercise: Exercise): Exercise {
    const sanitized = { ...exercise };

    // STEP 1: Always remove solution field (contains all correct answers)
    sanitized.solution = undefined;

    // STEP 2: Sanitize content based on exercise type
    // FE-060: Pass config to sanitizeContent for proper gridSize access
    sanitized.content = this.sanitizeContent(exercise.content, exercise.config, exercise.exercise_type);

    return sanitized;
  }

  /**
   * FE-059: Sanitizes content field by removing correct answers
   * FE-060: Now receives config parameter for proper gridSize access
   *
   * @param content - Original content JSONB
   * @param config - Original config JSONB (needed for gridSize and other settings)
   * @param exerciseType - Type of exercise
   * @returns Sanitized content without correct answers
   */
  private sanitizeContent(
    content: Record<string, any>,
    config: Record<string, any>,
    exerciseType: ExerciseTypeEnum,
  ): Record<string, any> {
    if (!content) {
      return content;
    }

    const sanitized = { ...content };

    switch (exerciseType.toLowerCase()) {
      // ================================================
      // MODULE 1 - LITERAL COMPREHENSION
      // ================================================

      case ExerciseTypeEnum.SOPA_LETRAS:
      case 'word_search':
        // No changes needed - words are visible but positions can be sanitized
        if (sanitized.wordsPositions) {
          sanitized.wordsPositions = undefined;
        }
        break;

      case ExerciseTypeEnum.VERDADERO_FALSO:
      case 'true_false':
        // Remove correctAnswer from each statement
        if (sanitized.statements && Array.isArray(sanitized.statements)) {
          sanitized.statements = sanitized.statements.map((stmt: any) => ({
            ...stmt,
            correctAnswer: undefined,
          }));
        }
        break;

      case ExerciseTypeEnum.CRUCIGRAMA:
      case 'crossword':
        // ✅ FIX BUG-002: Generate empty grid and sanitize clues
        // Remove answer from each clue and add length
        if (sanitized.clues && Array.isArray(sanitized.clues)) {
          sanitized.clues = sanitized.clues.map((clue: any) => ({
            id: clue.id,
            number: clue.number,
            direction: clue.direction,
            clue: clue.clue,
            startRow: clue.startRow,
            startCol: clue.startCol,
            length: clue.answer?.length || clue.word?.length || 0, // Send only length
            // ❌ DO NOT send answer or word fields
          }));
        }

        // ✅ FE-060: Use config.gridSize directly (passed as parameter)
        const gridSize = config?.gridSize || { rows: 15, cols: 15 };
        sanitized.grid = this.generateEmptyGrid(
          gridSize.rows || 15,
          gridSize.cols || 15,
          sanitized.clues || []
        );
        sanitized.gridConfig = gridSize;

        // 🐛 DEBUG: Log grid structure for debugging (FE-060 enhanced)
        console.log('[FE-060 FIX] Crucigrama grid config:', {
          hasConfig: !!config,
          gridSizeFromConfig: config?.gridSize,
          gridSizeUsed: gridSize,
          gridGenerated: `${gridSize.rows}x${gridSize.cols}`,
          hasGrid: !!sanitized.grid,
          gridIsArray: Array.isArray(sanitized.grid),
          gridDimensions: sanitized.grid?.length ? `${sanitized.grid.length}x${sanitized.grid[0]?.length}` : 'N/A',
          cluesCount: sanitized.clues?.length
        });
        break;

      case ExerciseTypeEnum.LINEA_TIEMPO:
      case 'timeline':
        // Events are visible but we can remove explicit ordering hints
        // No sanitization needed - students need to see events to order them
        break;

      case ExerciseTypeEnum.COMPLETAR_ESPACIOS:
      case 'fill_in_blank':
        // Remove correctAnswer and alternatives from each blank
        if (sanitized.blanks && Array.isArray(sanitized.blanks)) {
          sanitized.blanks = sanitized.blanks.map((blank: any) => ({
            ...blank,
            correctAnswer: undefined,
            alternatives: undefined,
          }));
        }
        break;

      // ================================================
      // MODULE 2 - INFERENTIAL COMPREHENSION
      // ================================================

      case ExerciseTypeEnum.DETECTIVE_TEXTUAL:
        // Remove correctAnswer from each question
        if (sanitized.questions && Array.isArray(sanitized.questions)) {
          sanitized.questions = sanitized.questions.map((question: any) => ({
            ...question,
            correctAnswer: undefined,
          }));
        }
        break;

      case 'construccion_hipotesis':
        // Remove correctCauseIds from consequences
        if (sanitized.consequences && Array.isArray(sanitized.consequences)) {
          sanitized.consequences = sanitized.consequences.map((consequence: any) => ({
            ...consequence,
            correctCauseIds: undefined,
          }));
        }
        break;

      case 'prediccion_narrativa':
        // Remove isCorrect from predictions in each scenario
        if (sanitized.scenarios && Array.isArray(sanitized.scenarios)) {
          sanitized.scenarios = sanitized.scenarios.map((scenario: any) => ({
            ...scenario,
            predictions: scenario.predictions?.map((pred: any) => ({
              ...pred,
              isCorrect: undefined,
            })),
          }));
        }
        break;

      case 'puzzle_contexto':
        // correctOrder is in solution, not content - no changes needed
        break;

      case 'rueda_inferencias':
        // correctInferences/incorrectInferences are in solution - no changes needed
        break;

      // ================================================
      // MODULE 3 - CRITICAL THINKING
      // ================================================

      case 'tribunal_opiniones':
        // Remove correctAnswer from questions in each case
        if (sanitized.cases && Array.isArray(sanitized.cases)) {
          sanitized.cases = sanitized.cases.map((caseItem: any) => ({
            ...caseItem,
            questions: caseItem.questions?.map((question: any) => ({
              ...question,
              correctAnswer: undefined,
            })),
          }));
        }
        break;

      case 'analisis_fuentes':
        // Remove credibilityScore from sources
        if (sanitized.sources && Array.isArray(sanitized.sources)) {
          sanitized.sources = sanitized.sources.map((source: any) => ({
            ...source,
            credibilityScore: undefined,
          }));
        }
        break;

      case 'debate_digital':
        // Open-ended - no correct answers to hide
        break;

      case 'podcast_argumentativo':
        // Open-ended - no correct answers to hide
        break;

      case 'matriz_perspectivas':
        // Remove expectedAnswer from questions
        if (sanitized.analysisQuestions && Array.isArray(sanitized.analysisQuestions)) {
          sanitized.analysisQuestions = sanitized.analysisQuestions.map((question: any) => ({
            ...question,
            expectedAnswer: undefined,
          }));
        }
        break;

      default:
        // For any unknown types, remove common fields that might contain answers
        if (sanitized.correctAnswer) {
          sanitized.correctAnswer = undefined;
        }
        if (sanitized.correct_answers) {
          sanitized.correct_answers = undefined;
        }
        if (sanitized.correctAnswers) {
          sanitized.correctAnswers = undefined;
        }
        break;
    }

    return sanitized;
  }

  /**
   * ✅ FIX BUG-002: Generate empty crossword grid structure without answers
   *
   * @description Creates a 2D grid with cells marked as black or white based on clues positions.
   * Does NOT include letter values - only structure.
   *
   * @param rows - Number of rows (default 15)
   * @param cols - Number of columns (default 15)
   * @param clues - Array of clues with startRow, startCol, direction, length
   * @returns 2D array representing grid structure
   */
  private generateEmptyGrid(
    rows: number,
    cols: number,
    clues: Array<{ startRow: number; startCol: number; direction: string; length: number; number?: number }>
  ): any[][] {
    // Initialize all cells as black
    const grid: any[][] = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          row: r,
          col: c,
          letter: '',        // ✅ Empty string - NO ANSWER
          isBlack: true,     // By default, all cells are black
          userInput: '',
        };
      }
    }

    // Mark cells as white (editable) based on clues
    clues.forEach((clue) => {
      const { startRow, startCol, direction, length, number } = clue;

      for (let i = 0; i < length; i++) {
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

          // Mark as white (editable)
          grid[row][col] = {
            row,
            col,
            letter: '',  // ✅ Empty - NO ANSWER
            isBlack: false,
            userInput: '',
          };

          // First letter gets the clue number
          if (i === 0 && number !== undefined) {
            if (existingCell && !existingCell.isBlack && existingCell.number !== undefined) {
              // Cell already has a number - merge into array
              grid[row][col].numbers = existingCell.numbers
                ? [...existingCell.numbers, number].sort((a, b) => a - b)
                : [existingCell.number, number].sort((a, b) => a - b);
              grid[row][col].number = undefined; // Clear single number
            } else {
              grid[row][col].number = number;
            }
          }
        }
      }
    });

    console.log(`[BUG-002 FIX] Generated empty grid: ${rows}x${cols} with ${clues.length} clues`);
    return grid;
  }
}
