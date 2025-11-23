import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
  MaxLength,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Tipos de bloqueo disponibles
 */
export enum BlockType {
  FULL = 'full',     // Bloqueo completo - sin acceso al aula
  PARTIAL = 'partial', // Bloqueo parcial - restricción de módulos/ejercicios
}

/**
 * DTO para bloquear un estudiante en un aula
 *
 * @description Permite bloquear estudiantes de forma completa o parcial
 *
 * Tipos de bloqueo:
 * - FULL: Marca al estudiante como 'inactive', sin acceso al aula
 * - PARTIAL: Mantiene status 'active' pero restringe módulos/ejercicios específicos
 */
export class BlockStudentDto {
  @ApiProperty({
    description: 'Razón del bloqueo',
    example: 'Comportamiento inapropiado en foro',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'La razón del bloqueo es requerida' })
  @IsString()
  @MaxLength(500, { message: 'La razón no puede exceder 500 caracteres' })
  reason!: string;

  @ApiProperty({
    description: 'Tipo de bloqueo',
    enum: BlockType,
    example: BlockType.FULL,
  })
  @IsNotEmpty({ message: 'El tipo de bloqueo es requerido' })
  @IsEnum(BlockType, {
    message: 'El tipo de bloqueo debe ser "full" o "partial"',
  })
  block_type!: BlockType;

  @ApiPropertyOptional({
    description:
      'IDs de módulos bloqueados (requerido si block_type es "partial")',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440010',
      '550e8400-e29b-41d4-a716-446655440011',
    ],
  })
  @ValidateIf((o) => o.block_type === BlockType.PARTIAL)
  @IsNotEmpty({
    message: 'blocked_modules es requerido cuando block_type es "partial"',
  })
  @IsArray({ message: 'blocked_modules debe ser un array' })
  @ArrayMinSize(1, {
    message: 'Debe especificar al menos un módulo para bloquear',
  })
  @IsUUID('4', {
    each: true,
    message: 'Todos los IDs de módulos deben ser UUIDs válidos',
  })
  @IsOptional()
  blocked_modules?: string[];

  @ApiPropertyOptional({
    description: 'IDs de ejercicios bloqueados (opcional)',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440020'],
  })
  @IsOptional()
  @IsArray({ message: 'blocked_exercises debe ser un array' })
  @IsUUID('4', {
    each: true,
    message: 'Todos los IDs de ejercicios deben ser UUIDs válidos',
  })
  blocked_exercises?: string[];
}
