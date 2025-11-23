import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * PuzzleContextoAnswersDto
 *
 * @description DTO for validating Puzzle Contexto (Module 2.4) answers
 * Students select correct answers to context-based multiple choice questions
 *
 * Expected format:
 * {
 *   "questions": {
 *     "q1": "option_a",
 *     "q2": "option_b",
 *     "q3": "option_c"
 *   }
 * }
 *
 * @note FE-061: Removed @ValidateNested() and nested class with index signature.
 * class-validator doesn't handle index signatures well, causing validation to always fail.
 * Using @IsObject() and @IsNotEmpty() provides sufficient validation.
 *
 * @note BE-FE-062: Changed field name from 'fragments' to 'questions' to match
 * SQL validator (validate_puzzle_contexto) expectations at line 33.
 */
export class PuzzleContextoAnswersDto {
  /**
   * Object mapping question IDs to selected answer option IDs
   * Example: { "q1": "option_a", "q2": "option_b" }
   */
  @IsObject({ message: 'questions must be an object' })
  @IsNotEmpty({ message: 'questions object is required' })
  questions!: Record<string, string>;
}
