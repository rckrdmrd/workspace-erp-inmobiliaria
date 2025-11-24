import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ConnectionDto
 *
 * @description Individual connection between evidence pieces
 */
class ConnectionDto {
  /**
   * Source evidence ID
   */
  @IsString()
  @IsNotEmpty({ message: 'from is required' })
  from!: string;

  /**
   * Target evidence ID
   */
  @IsString()
  @IsNotEmpty({ message: 'to is required' })
  to!: string;

  /**
   * Relationship type (e.g., "causa", "efecto", "contraste")
   */
  @IsString()
  @IsNotEmpty({ message: 'relationship is required' })
  relationship!: string;
}

/**
 * DetectiveConnectionsAnswersDto
 *
 * @description DTO for validating Detective Connections (Module 2 - Discrepancy Fix) answers
 * Students create a graph of evidence connections with relationships
 *
 * Expected format:
 * {
 *   "connections": [
 *     { "from": "ev1", "to": "ev2", "relationship": "causa" },
 *     { "from": "ev2", "to": "ev3", "relationship": "efecto" },
 *     { "from": "ev1", "to": "ev4", "relationship": "contraste" }
 *   ]
 * }
 *
 * @see apps/database/ddl/schemas/educational_content/functions/20-validate_detective_connections.sql
 */
export class DetectiveConnectionsAnswersDto {
  /**
   * Array of connections between evidence pieces
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectionDto)
  @IsNotEmpty({ message: 'connections array is required' })
  connections!: ConnectionDto[];

  constructor() {
    this.connections = [];
  }
}
