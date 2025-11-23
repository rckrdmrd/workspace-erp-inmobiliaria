import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

// Import all 15 DTOs
import { WordSearchAnswersDto } from './word-search-answers.dto';
import { TrueFalseAnswersDto } from './true-false-answers.dto';
import { CrucigramaAnswersDto } from './crucigrama-answers.dto';
import { TimelineAnswersDto } from './timeline-answers.dto';
import { FillInBlankAnswersDto } from './fill-in-blank-answers.dto';
import { DetectiveTextualAnswersDto } from './detective-textual-answers.dto';
import { ConstruccionHipotesisAnswersDto } from './construccion-hipotesis-answers.dto';
import { PrediccionNarrativaAnswersDto } from './prediccion-narrativa-answers.dto';
import { PuzzleContextoAnswersDto } from './puzzle-contexto-answers.dto';
import { RuedaInferenciasAnswersDto } from './rueda-inferencias-answers.dto';
import { TribunalOpinionesAnswersDto } from './tribunal-opiniones-answers.dto';
import { AnalisisFuentesAnswersDto } from './analisis-fuentes-answers.dto';
import { DebateDigitalAnswersDto } from './debate-digital-answers.dto';
import { PodcastArgumentativoAnswersDto } from './podcast-argumentativo-answers.dto';
import { MatrizPerspectivasAnswersDto } from './matriz-perspectivas-answers.dto';
import { DetectiveConnectionsAnswersDto } from './detective-connections-answers.dto';
import { PredictionScenariosAnswersDto } from './prediction-scenarios-answers.dto';
import { CauseEffectMatchingAnswersDto } from './cause-effect-matching-answers.dto';

/**
 * ExerciseAnswerValidator
 *
 * @description Utility class for validating exercise answers based on exercise type.
 * Maps each of the 18 exercise types to its corresponding DTO and validates the structure.
 * (15 original + 3 additional for discrepancy fixes)
 *
 * Usage:
 * ```typescript
 * await ExerciseAnswerValidator.validate('crucigrama', answerData);
 * ```
 */
export class ExerciseAnswerValidator {
  /**
   * Maps exercise type to its corresponding DTO class
   *
   * @param exerciseType - Type of exercise (e.g., 'crucigrama', 'sopa_letras')
   * @returns DTO class for validation
   * @throws BadRequestException if exercise type is unknown
   */
  static getDtoForType(exerciseType: string): any {
    const normalizedType = exerciseType.toLowerCase().trim();

    switch (normalizedType) {
      // Module 1 - Literal Comprehension
      case 'sopa_letras':
      case 'word_search':
        return WordSearchAnswersDto;

      case 'verdadero_falso':
      case 'true_false':
        return TrueFalseAnswersDto;

      case 'crucigrama':
      case 'crossword':
        return CrucigramaAnswersDto;

      case 'linea_tiempo':
      case 'timeline':
        return TimelineAnswersDto;

      case 'completar_espacios':
      case 'fill_in_blank':
        return FillInBlankAnswersDto;

      // Module 2 - Inferential Comprehension
      case 'detective_textual':
        return DetectiveTextualAnswersDto;

      case 'construccion_hipotesis':
        return ConstruccionHipotesisAnswersDto;

      case 'prediccion_narrativa':
        return PrediccionNarrativaAnswersDto;

      case 'puzzle_contexto':
        return PuzzleContextoAnswersDto;

      case 'rueda_inferencias':
        return RuedaInferenciasAnswersDto;

      // Module 3 - Critical Thinking
      case 'tribunal_opiniones':
        return TribunalOpinionesAnswersDto;

      case 'analisis_fuentes':
        return AnalisisFuentesAnswersDto;

      case 'debate_digital':
        return DebateDigitalAnswersDto;

      case 'podcast_argumentativo':
        return PodcastArgumentativoAnswersDto;

      case 'matriz_perspectivas':
        return MatrizPerspectivasAnswersDto;

      // Discrepancy Fixes (DB-117)
      case 'detective_connections':
        return DetectiveConnectionsAnswersDto;

      case 'prediction_scenarios':
        return PredictionScenariosAnswersDto;

      case 'cause_effect_matching':
        return CauseEffectMatchingAnswersDto;

      default:
        throw new BadRequestException(
          `Unknown exercise type: ${exerciseType}. ` +
          `Valid types: sopa_letras, verdadero_falso, crucigrama, linea_tiempo, completar_espacios, ` +
          `detective_textual, construccion_hipotesis, prediccion_narrativa, puzzle_contexto, rueda_inferencias, ` +
          `tribunal_opiniones, analisis_fuentes, debate_digital, podcast_argumentativo, matriz_perspectivas, ` +
          `detective_connections, prediction_scenarios, cause_effect_matching`
        );
    }
  }

  /**
   * Validates answer structure against the DTO for the given exercise type
   *
   * @param exerciseType - Type of exercise
   * @param answers - Student answers to validate
   * @throws BadRequestException if validation fails
   */
  static async validate(exerciseType: string, answers: any): Promise<void> {
    // FE-061: Debug log para ver qué se está validando
    console.log('[FE-061 DEBUG] Validating answers:', {
      exerciseType,
      answersKeys: Object.keys(answers || {}),
      answersStructure: JSON.stringify(answers, null, 2).substring(0, 500)
    });

    // Get the appropriate DTO class
    const DtoClass = this.getDtoForType(exerciseType);

    // Transform plain object to DTO instance
    const dto = plainToInstance(DtoClass, answers);

    // Validate
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      // Format error messages
      const messages = errors.map(error => {
        const constraints = error.constraints || {};
        return Object.values(constraints).join(', ');
      });

      // FE-061: Log detailed error information
      console.error('[FE-061 DEBUG] Validation errors:', {
        exerciseType,
        errorCount: errors.length,
        errorDetails: errors.map(e => ({
          property: e.property,
          value: e.value,
          constraints: e.constraints
        }))
      });

      throw new BadRequestException(
        `Validation failed for exercise type '${exerciseType}': ${messages.join('; ')}`
      );
    }
  }

  /**
   * Validates and returns the transformed DTO instance
   *
   * @param exerciseType - Type of exercise
   * @param answers - Student answers to validate
   * @returns Validated DTO instance
   * @throws BadRequestException if validation fails
   */
  static async validateAndTransform(exerciseType: string, answers: any): Promise<any> {
    await this.validate(exerciseType, answers);
    const DtoClass = this.getDtoForType(exerciseType);
    return plainToInstance(DtoClass, answers);
  }
}
