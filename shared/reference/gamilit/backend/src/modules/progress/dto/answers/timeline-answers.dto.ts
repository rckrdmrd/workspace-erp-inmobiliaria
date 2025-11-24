import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

/**
 * TimelineAnswersDto
 *
 * @description DTO for validating Línea de Tiempo (Timeline) answers
 *
 * Expected format:
 * {
 *   "events": ["evt1", "evt3", "evt2", "evt4"]
 * }
 *
 * @note BE-FE-062: Changed field name from 'eventOrder' to 'events' to match
 * SQL validator (validate_timeline) expectations at line 32.
 */
export class TimelineAnswersDto {
  /**
   * Array of event IDs in the order provided by the student
   */
  @IsArray()
  @ArrayNotEmpty({ message: 'events array cannot be empty' })
  @IsString({ each: true, message: 'Each event ID must be a string' })
  events!: string[];
}
