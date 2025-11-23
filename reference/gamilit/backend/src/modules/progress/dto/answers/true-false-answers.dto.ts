import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * TrueFalseAnswersDto
 *
 * @description DTO for validating Verdadero/Falso (True/False) answers
 *
 * Expected format:
 * {
 *   "statements": {
 *     "s1": true,
 *     "s2": false,
 *     "s3": true
 *   }
 * }
 *
 * @note FE-061: Removed @ValidateNested() and TrueFalseStatementsDto
 * because class-validator doesn't work well with index signatures.
 * Simple @IsObject() validation is sufficient for Record<string, boolean>
 */
export class TrueFalseAnswersDto {
  /**
   * Object mapping statement IDs to boolean answers
   * Example: { "s1": true, "s2": false, "s3": true }
   */
  @IsObject({ message: 'statements must be an object' })
  @IsNotEmpty({ message: 'statements object is required' })
  statements!: Record<string, boolean>;
}
