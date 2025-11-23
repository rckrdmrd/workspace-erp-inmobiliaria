import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * DetectiveTextualAnswersDto
 *
 * @description DTO for validating Detective Textual (Module 2.1) answers
 * Multiple choice questions requiring textual inference
 *
 * Expected format:
 * {
 *   "q1": "option_b",
 *   "q2": "option_a",
 *   "q3": "option_c"
 * }
 *
 * Note: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 */
export class DetectiveTextualAnswersDto {
  /**
   * Object mapping question IDs to selected option IDs
   */
  @IsObject({ message: 'questions must be an object' })
  @IsNotEmpty({ message: 'questions object is required' })
  questions!: Record<string, string>;

  constructor() {
    this.questions = {};
  }
}
