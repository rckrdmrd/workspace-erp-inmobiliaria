import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * PrediccionNarrativaAnswersDto
 *
 * @description DTO for validating Predicción Narrativa (Module 2.3) answers
 * Students select the most likely prediction for each scenario
 *
 * Expected format:
 * {
 *   "scenario1": "pred_b",
 *   "scenario2": "pred_a",
 *   "scenario3": "pred_c"
 * }
 *
 * Note: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 */
export class PrediccionNarrativaAnswersDto {
  /**
   * Object mapping scenario IDs to selected prediction IDs
   */
  @IsObject({ message: 'scenarios must be an object' })
  @IsNotEmpty({ message: 'scenarios object is required' })
  scenarios!: Record<string, string>;

  constructor() {
    this.scenarios = {};
  }
}
