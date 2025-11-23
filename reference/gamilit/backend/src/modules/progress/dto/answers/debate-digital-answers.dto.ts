import { IsString, IsNotEmpty, IsArray, IsOptional, MinLength } from 'class-validator';

/**
 * DebateDigitalAnswersDto
 *
 * @description DTO for validating Debate Digital (Module 3.3) answers
 * Open-ended argumentative exercise requiring position and arguments
 *
 * Expected format:
 * {
 *   "position": "a_favor",
 *   "response": "Lengthy argumentative text...",
 *   "arguments": ["arg1", "arg2", "arg3"]
 * }
 */
export class DebateDigitalAnswersDto {
  /**
   * Selected position (e.g., "a_favor", "en_contra", "neutral")
   */
  @IsString()
  @IsNotEmpty({ message: 'position is required' })
  position!: string;

  /**
   * Student's argumentative response (minimum 100 characters)
   */
  @IsString()
  @IsNotEmpty({ message: 'response is required' })
  @MinLength(100, { message: 'response must be at least 100 characters' })
  response!: string;

  /**
   * Optional array of argument points
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  arguments?: string[];
}
