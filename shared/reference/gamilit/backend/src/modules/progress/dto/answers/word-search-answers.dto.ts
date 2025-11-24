import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

/**
 * WordSearchAnswersDto
 *
 * @description DTO for validating Sopa de Letras (Word Search) answers
 *
 * Expected format:
 * {
 *   "words": ["SORBONA", "NOBEL", "MARIE"]
 * }
 *
 * @note BE-FE-062: Changed field name from 'foundWords' to 'words' to match
 * SQL validator (validate_word_search) expectations at line 35.
 */
export class WordSearchAnswersDto {
  /**
   * Array of words found by the student
   */
  @IsArray()
  @ArrayNotEmpty({ message: 'words array cannot be empty' })
  @IsString({ each: true, message: 'Each found word must be a string' })
  words!: string[];
}
