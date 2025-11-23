import { IsObject, IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

/**
 * RuedaInferenciasAnswersDto
 *
 * @description DTO for validating Rueda de Inferencias (Module 2.5) answers
 * Students write free-form text inferences for each fragment
 *
 * Expected format:
 * {
 *   "fragments": {
 *     "frag-1": "Marie Curie fue pionera en el estudio de la radiactividad...",
 *     "frag-2": "Su determinación la llevó a superar muchas barreras..."
 *   },
 *   "categoryId": "inferencial",
 *   "timeSpent": 45
 * }
 *
 * @note BE-FE-071: Changed from multiple choice (array of IDs) to free text
 * (object mapping fragmentId → user written inference). Validation is done
 * server-side via keyword matching (minimum 2 keywords per fragment).
 *
 * Backend calls validate_rueda_inferencias_text() for each fragment individually.
 */
export class RuedaInferenciasAnswersDto {
  /**
   * Object mapping fragment IDs to user-written inferences
   * Each inference should be 20-200 characters with at least 2 keywords
   * Example: { "frag-1": "Marie sintió determinación...", "frag-2": "..." }
   */
  @IsObject({ message: 'fragments must be an object' })
  @IsNotEmpty({ message: 'fragments object is required' })
  fragments!: Record<string, string>;

  /**
   * ID of the category selected (optional, for analytics)
   * Example: "literal", "inferencial", "critico", "creativo"
   */
  @IsString({ message: 'categoryId must be a string' })
  @IsOptional()
  categoryId?: string;

  /**
   * Total time spent on all fragments in seconds (optional)
   * Used for time-based metrics and analytics
   */
  @IsNumber({}, { message: 'timeSpent must be a number' })
  @IsOptional()
  timeSpent?: number;

  constructor() {
    this.fragments = {};
  }
}
