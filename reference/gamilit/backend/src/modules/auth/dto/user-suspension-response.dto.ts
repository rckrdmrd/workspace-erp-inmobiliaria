import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UserSuspensionResponseDto
 *
 * @description DTO para respuesta de API con información de suspensión de usuario
 * @see Entity: UserSuspension
 * @see DDL: auth_management.user_suspensions
 *
 * @created 2025-11-11 (DB-100 Ciclo B.2)
 * @version 1.0
 */
export class UserSuspensionResponseDto {
  /**
   * ID único de la suspensión
   * @type UUID
   */
  @ApiProperty({
    description: 'ID único de la suspensión',
    type: String,
    format: 'uuid',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  id!: string;

  /**
   * ID del usuario suspendido
   * @type UUID
   */
  @ApiProperty({
    description: 'ID del usuario suspendido',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  /**
   * Razón de la suspensión
   */
  @ApiProperty({
    description: 'Razón detallada de la suspensión',
    type: String,
    example: 'Violación de términos de servicio: spam en foros de discusión',
  })
  reason!: string;

  /**
   * Fecha hasta la cual el usuario está suspendido
   * @nullable null = ban permanente
   */
  @ApiPropertyOptional({
    description: 'Fecha hasta la cual el usuario está suspendido (null = ban permanente)',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2025-12-31T23:59:59.999Z',
  })
  suspension_until!: Date | null;

  /**
   * ID del administrador que aplicó la suspensión
   */
  @ApiProperty({
    description: 'ID del administrador que aplicó la suspensión',
    type: String,
    format: 'uuid',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  suspended_by!: string;

  /**
   * Fecha en que se aplicó la suspensión
   */
  @ApiProperty({
    description: 'Fecha y hora en que se aplicó la suspensión',
    type: String,
    format: 'date-time',
    example: '2025-11-11T10:00:00.000Z',
  })
  suspended_at!: Date;

  /**
   * Fecha de creación del registro
   */
  @ApiProperty({
    description: 'Fecha de creación del registro',
    type: String,
    format: 'date-time',
    example: '2025-11-11T10:00:00.000Z',
  })
  created_at!: Date;

  /**
   * Fecha de última actualización
   */
  @ApiProperty({
    description: 'Fecha de última actualización',
    type: String,
    format: 'date-time',
    example: '2025-11-11T15:30:00.000Z',
  })
  updated_at!: Date;

  /**
   * Indica si es un ban permanente
   */
  @ApiProperty({
    description: 'Indica si es un ban permanente (suspension_until = null)',
    type: Boolean,
    example: false,
  })
  is_permanent!: boolean;

  /**
   * Indica si la suspensión está activa
   */
  @ApiProperty({
    description: 'Indica si la suspensión está activa (permanente o fecha futura)',
    type: Boolean,
    example: true,
  })
  is_active!: boolean;

  /**
   * Días restantes de suspensión
   */
  @ApiPropertyOptional({
    description: 'Días restantes de suspensión (null si es permanente, 0 si expiró)',
    type: Number,
    nullable: true,
    example: 45,
  })
  days_remaining!: number | null;
}
