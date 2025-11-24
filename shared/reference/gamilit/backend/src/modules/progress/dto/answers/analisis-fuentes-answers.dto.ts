import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

/**
 * AnalisisFuentesAnswersDto
 *
 * @description DTO for validating Análisis de Fuentes (Module 3.2) answers
 * Students rank sources by credibility
 *
 * Expected format:
 * {
 *   "ranking": ["source1", "source3", "source2", "source4"]
 * }
 */
export class AnalisisFuentesAnswersDto {
  /**
   * Array of source IDs ordered by credibility (most credible first)
   */
  @IsArray()
  @ArrayNotEmpty({ message: 'ranking array cannot be empty' })
  @IsString({ each: true, message: 'Each source ID must be a string' })
  ranking!: string[];
}
