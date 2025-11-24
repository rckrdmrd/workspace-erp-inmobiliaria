import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * FillInBlankAnswersDto
 *
 * @description DTO for validating Completar Espacios (Fill in the Blank) answers
 *
 * Expected format:
 * {
 *   "blanks": {
 *     "b1": "radioactividad",
 *     "b2": "Sorbona",
 *     "b3": "Polonio"
 *   }
 * }
 *
 * @note FE-061: Removed @ValidateNested() and FillInBlankBlanksDto
 * because class-validator doesn't work well with index signatures.
 * Simple @IsObject() validation is sufficient for Record<string, string>
 */
export class FillInBlankAnswersDto {
  /**
   * Object mapping blank IDs to student answers
   * Example: { "b1": "radioactividad", "b2": "Sorbona", "b3": "Polonio" }
   */
  @IsObject({ message: 'blanks must be an object' })
  @IsNotEmpty({ message: 'blanks object is required' })
  blanks!: Record<string, string>;
}
