import { IsDateString, IsOptional } from 'class-validator';

/**
 * DTO para actualizar sesión existente
 *
 * @usage
 * - Actualizar last_activity_at al recibir request autenticado
 * - Extender expires_at al renovar con refresh token
 */
export class UpdateUserSessionDto {
  @IsOptional()
  @IsDateString()
  last_activity_at?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;
}
