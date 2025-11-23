import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateDiscussionThreadDto
 *
 * @description DTO para crear un hilo de discusión
 * @see Entity: DiscussionThread
 * @see DDL: social_features.discussion_threads
 *
 * @note Al menos classroom_id O team_id debe estar presente
 * @note CHECK constraint: classroom_id IS NOT NULL OR team_id IS NOT NULL
 *
 * @created 2025-11-11 (DB-100 Ciclo B.3)
 * @version 1.0
 */
export class CreateDiscussionThreadDto {
  /**
   * ID del classroom al que pertenece el thread
   * @optional (pero al menos classroom_id O team_id requerido)
   * @type UUID
   */
  @ApiPropertyOptional({
    description: 'ID del classroom al que pertenece el thread (al menos classroom_id O team_id requerido)',
    type: String,
    format: 'uuid',
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  @ValidateIf((o) => !o.team_id, {
    message: 'Al menos classroom_id o team_id debe estar presente',
  })
  classroom_id?: string | null;

  /**
   * ID del team al que pertenece el thread
   * @optional (pero al menos classroom_id O team_id requerido)
   * @type UUID
   */
  @ApiPropertyOptional({
    description: 'ID del team al que pertenece el thread (al menos classroom_id O team_id requerido)',
    type: String,
    format: 'uuid',
    nullable: true,
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4')
  @ValidateIf((o) => !o.classroom_id, {
    message: 'Al menos classroom_id o team_id debe estar presente',
  })
  team_id?: string | null;

  /**
   * ID del usuario que crea el thread
   * @required
   * @type UUID
   */
  @ApiProperty({
    description: 'ID del usuario que crea el thread (autor)',
    type: String,
    format: 'uuid',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID('4')
  @IsNotEmpty()
  created_by!: string;

  /**
   * Título del hilo de discusión
   * @required
   * @minLength 5
   * @maxLength 255
   */
  @ApiProperty({
    description: 'Título del hilo de discusión',
    type: String,
    minLength: 5,
    maxLength: 255,
    example: '¿Cómo resolver el ejercicio de Fracciones?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'El título debe tener al menos 5 caracteres',
  })
  @MaxLength(255, {
    message: 'El título no puede exceder 255 caracteres',
  })
  title!: string;

  /**
   * Contenido principal del thread
   * @required
   * @minLength 10
   */
  @ApiProperty({
    description: 'Contenido principal del thread (mensaje inicial)',
    type: String,
    minLength: 10,
    example: 'Tengo dudas sobre el paso 3 del ejercicio de fracciones. ¿Alguien me puede ayudar a entender cómo simplificar 12/18?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'El contenido debe tener al menos 10 caracteres',
  })
  content!: string;

  /**
   * Indica si el thread debe estar fijado
   * @optional
   * @default false
   */
  @ApiPropertyOptional({
    description: 'Indica si el thread debe estar fijado al topo de la lista',
    type: Boolean,
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_pinned?: boolean;

  /**
   * Indica si el thread debe estar bloqueado
   * @optional
   * @default false
   */
  @ApiPropertyOptional({
    description: 'Indica si el thread debe estar bloqueado (no permite respuestas)',
    type: Boolean,
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_locked?: boolean;
}
