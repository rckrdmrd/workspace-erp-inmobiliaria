import {
  IsOptional,
  IsArray,
  IsUUID,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para actualizar permisos granulares de un estudiante
 *
 * @description Permite configurar permisos específicos del estudiante en el aula
 *
 * Todos los campos son opcionales - se hace merge con permisos existentes
 *
 * Ejemplo de uso:
 * - Permitir solo ciertos módulos: { allowed_modules: ['uuid1', 'uuid2'] }
 * - Deshabilitar envío de tareas: { can_submit_assignments: false }
 * - Restringir funcionalidades sociales: { can_use_forum: false, can_view_leaderboard: false }
 */
export class UpdatePermissionsDto {
  @ApiPropertyOptional({
    description:
      'Lista de módulos permitidos (whitelist). Si se especifica, el estudiante solo puede acceder a estos módulos.',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
  })
  @IsOptional()
  @IsArray({ message: 'allowed_modules debe ser un array' })
  @IsUUID('4', {
    each: true,
    message: 'Todos los IDs de módulos deben ser UUIDs válidos',
  })
  allowed_modules?: string[];

  @ApiPropertyOptional({
    description:
      'Lista de features permitidas (whitelist). Features disponibles: forum, leaderboard, achievements, social, assignments.',
    type: [String],
    example: ['assignments', 'achievements'],
  })
  @IsOptional()
  @IsArray({ message: 'allowed_features debe ser un array' })
  @IsString({
    each: true,
    message: 'Todos los features deben ser strings',
  })
  allowed_features?: string[];

  @ApiPropertyOptional({
    description: 'Permitir al estudiante enviar tareas',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'can_submit_assignments debe ser un boolean' })
  can_submit_assignments?: boolean;

  @ApiPropertyOptional({
    description: 'Permitir al estudiante ver el leaderboard',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'can_view_leaderboard debe ser un boolean' })
  can_view_leaderboard?: boolean;

  @ApiPropertyOptional({
    description: 'Permitir al estudiante usar el foro',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'can_use_forum debe ser un boolean' })
  can_use_forum?: boolean;
}
