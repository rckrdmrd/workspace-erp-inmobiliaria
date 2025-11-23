import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DiscussionThreadResponseDto
 *
 * @description DTO para respuesta de API con información de hilo de discusión
 * @see Entity: DiscussionThread
 * @see DDL: social_features.discussion_threads
 *
 * @created 2025-11-11 (DB-100 Ciclo B.3)
 * @version 1.0
 */
export class DiscussionThreadResponseDto {
  /**
   * ID único del thread
   * @type UUID
   */
  @ApiProperty({
    description: 'ID único del hilo de discusión',
    type: String,
    format: 'uuid',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  id!: string;

  /**
   * ID del classroom (si aplica)
   * @nullable
   */
  @ApiPropertyOptional({
    description: 'ID del classroom al que pertenece (null si es de team)',
    type: String,
    format: 'uuid',
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  classroom_id!: string | null;

  /**
   * ID del team (si aplica)
   * @nullable
   */
  @ApiPropertyOptional({
    description: 'ID del team al que pertenece (null si es de classroom)',
    type: String,
    format: 'uuid',
    nullable: true,
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  team_id!: string | null;

  /**
   * ID del autor del thread
   */
  @ApiProperty({
    description: 'ID del usuario que creó el thread',
    type: String,
    format: 'uuid',
    example: '880e8400-e29b-41d4-a716-446655440003',
  })
  created_by!: string;

  /**
   * Título del thread
   */
  @ApiProperty({
    description: 'Título del hilo de discusión',
    type: String,
    example: '¿Cómo resolver el ejercicio de Fracciones?',
  })
  title!: string;

  /**
   * Contenido principal
   */
  @ApiProperty({
    description: 'Contenido principal del thread',
    type: String,
    example: 'Tengo dudas sobre el paso 3 del ejercicio...',
  })
  content!: string;

  /**
   * Thread fijado
   */
  @ApiProperty({
    description: 'Indica si el thread está fijado al topo',
    type: Boolean,
    example: false,
  })
  is_pinned!: boolean;

  /**
   * Thread bloqueado
   */
  @ApiProperty({
    description: 'Indica si el thread está bloqueado (no permite respuestas)',
    type: Boolean,
    example: false,
  })
  is_locked!: boolean;

  /**
   * Número de respuestas
   */
  @ApiProperty({
    description: 'Número de respuestas en este thread',
    type: Number,
    example: 5,
  })
  replies_count!: number;

  /**
   * Última respuesta
   */
  @ApiPropertyOptional({
    description: 'Fecha y hora de la última respuesta (null si no hay respuestas)',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2025-11-11T15:30:00.000Z',
  })
  last_reply_at!: Date | null;

  /**
   * Fecha de creación
   */
  @ApiProperty({
    description: 'Fecha de creación del thread',
    type: String,
    format: 'date-time',
    example: '2025-11-11T10:00:00.000Z',
  })
  created_at!: Date;

  /**
   * Fecha de actualización
   */
  @ApiProperty({
    description: 'Fecha de última actualización',
    type: String,
    format: 'date-time',
    example: '2025-11-11T16:00:00.000Z',
  })
  updated_at!: Date;

  /**
   * Indica si es thread de classroom
   */
  @ApiProperty({
    description: 'Indica si el thread pertenece a un classroom',
    type: Boolean,
    example: true,
  })
  is_classroom_thread!: boolean;

  /**
   * Indica si es thread de team
   */
  @ApiProperty({
    description: 'Indica si el thread pertenece a un team',
    type: Boolean,
    example: false,
  })
  is_team_thread!: boolean;

  /**
   * Indica si puede recibir respuestas
   */
  @ApiProperty({
    description: 'Indica si el thread puede recibir respuestas (no está bloqueado)',
    type: Boolean,
    example: true,
  })
  can_receive_replies!: boolean;
}
