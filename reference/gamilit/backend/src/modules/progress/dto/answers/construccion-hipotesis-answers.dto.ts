import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * ConstruccionHipotesisAnswersDto
 *
 * @description DTO for validating Construcción de Hipótesis (Module 2.2) answers
 * Cause-effect matching exercise
 *
 * Expected format:
 * {
 *   "cause1": ["consequence1", "consequence3"],
 *   "cause2": ["consequence2"],
 *   "cause3": ["consequence4", "consequence5"]
 * }
 *
 * Note: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 */
export class ConstruccionHipotesisAnswersDto {
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
