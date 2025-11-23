import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * CauseEffectMatchingAnswersDto
 *
 * @description DTO for validating Cause-Effect Matching (Module 2 - Discrepancy Fix) answers
 * Students drag and drop consequences to match with causes
 *
 * Expected format:
 * {
 *   "causes": {
 *     "c1": ["cons1", "cons2"],
 *     "c2": ["cons3"],
 *     "c3": ["cons4", "cons5"]
 *   }
 * }
 *
 * Note: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 *
 * @see apps/database/ddl/schemas/educational_content/functions/22-validate_cause_effect_matching.sql
 */
export class CauseEffectMatchingAnswersDto {
  /**
   * Object mapping cause IDs to arrays of consequence IDs
   */
  @IsObject({ message: 'causes must be an object' })
  @IsNotEmpty({ message: 'causes object is required' })
  causes!: Record<string, string[]>;

  constructor() {
    this.causes = {};
  }
}
