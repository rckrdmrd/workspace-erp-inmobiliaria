import { IsUUID, IsString, IsNotEmpty, IsOptional, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateUserSuspensionDto
 *
 * @description DTO para crear una suspensión de usuario
 * @see Entity: UserSuspension
 * @see DDL: auth_management.user_suspensions
 *
 * @note suspension_until NULL = ban permanente
 * @note suspension_until con fecha = suspensión temporal
 *
 * @created 2025-11-11 (DB-100 Ciclo B.2)
 * @version 1.0
 */
export class CreateUserSuspensionDto {
  /**
   * ID del usuario a suspender
   * @required
   * @type UUID
   */
  @ApiProperty({
    description: 'ID del usuario a suspender (FK a auth.users)',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  user_id!: string;

  /**
   * Razón de la suspensión
   * @required
   * @type text
   * @minLength 10
   */
  @ApiProperty({
    description: 'Razón detallada de la suspensión',
    type: String,
    minLength: 10,
    example: 'Violación de términos de servicio: spam en foros de discusión',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'La razón de suspensión debe tener al menos 10 caracteres',
  })
  reason!: string;

  /**
   * Fecha hasta la cual el usuario está suspendido
   * @optional
   * @type ISO 8601 date string
   * @nullable
   *
   * @note null o undefined = ban permanente
   * @note fecha futura = suspensión temporal hasta esa fecha
   */
  @ApiPropertyOptional({
    description:
      'Fecha hasta la cual el usuario está suspendido (null = ban permanente, fecha = suspensión temporal)',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString({}, {
    message: 'suspension_until debe ser una fecha válida en formato ISO 8601',
  })
  suspension_until?: string | null;

  /**
   * ID del administrador que aplica la suspensión
   * @required
   * @type UUID
   */
  @ApiProperty({
    description: 'ID del administrador que aplica la suspensión (FK a auth.users)',
    type: String,
    format: 'uuid',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID('4')
  @IsNotEmpty()
  suspended_by!: string;
}
