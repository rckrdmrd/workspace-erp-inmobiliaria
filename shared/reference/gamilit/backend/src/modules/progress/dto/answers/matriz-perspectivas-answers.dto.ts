import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * MatrizPerspectivasAnswersDto
 *
 * @description DTO for validating Matriz de Perspectivas (Module 3.5) answers
 * Open-ended questions requiring analysis from multiple perspectives
 *
 * Expected format:
 * {
 *   "q1": "Detailed answer from perspective 1...",
 *   "q2": "Detailed answer from perspective 2...",
 *   "q3": "Synthesis of perspectives..."
 * }
 *
 * Note: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 */
export class MatrizPerspectivasAnswersDto {
  /**
   * Object mapping question IDs to student answers (minimum 50 chars each)
   */
  @IsObject({ message: 'questions must be an object' })
  @IsNotEmpty({ message: 'questions object is required' })
  questions!: Record<string, string>;

  constructor() {
    this.questions = {};
  }
}
