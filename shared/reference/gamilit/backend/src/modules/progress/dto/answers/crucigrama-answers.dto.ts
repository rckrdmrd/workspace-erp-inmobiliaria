import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * CrucigramaAnswersDto
 *
 * @description DTO for validating Crucigrama (Crossword) answers
 *
 * Expected format:
 * {
 *   "clues": {
 *     "h1": "SORBONA",
 *     "h2": "NOBEL",
 *     "v1": "MARIE"
 *   }
 * }
 *
 * @note FE-061: Removed @ValidateNested() and CrucigramaCluesDto
 * because class-validator doesn't work well with index signatures.
 * Simple @IsObject() validation is sufficient for Record<string, string>
 */
export class CrucigramaAnswersDto {
  /**
   * Object mapping clue IDs to answers
   * Example: { "h1": "SORBONA", "v1": "NOBEL", "h2": "RADIOACTIVIDAD" }
   */
  @IsObject({ message: 'clues must be an object' })
  @IsNotEmpty({ message: 'clues object is required' })
  clues!: Record<string, string>;
}
