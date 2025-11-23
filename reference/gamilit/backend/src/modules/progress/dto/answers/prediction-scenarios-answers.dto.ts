import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * PredictionScenariosAnswersDto
 *
 * @description DTO for validating Prediction Scenarios (Module 2 - Discrepancy Fix) answers
 * Students select predictions for multiple narrative scenarios
 *
 * Expected format:
 * {
 *   "scenarios": {
 *     "s1": "pred_a",
 *     "s2": "pred_b",
 *     "s3": "pred_c"
 *   }
 * }
 *
 * Note: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 *
 * @see apps/database/ddl/schemas/educational_content/functions/21-validate_prediction_scenarios.sql
 */
export class PredictionScenariosAnswersDto {
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
