import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, IsIP, MaxLength } from 'class-validator';

/**
 * DTO para crear registro de intento de autenticación
 *
 * @usage
 * - Registrar intentos de login (exitosos o fallidos)
 * - Capturar datos de seguridad (IP, user agent)
 * - Aplicar rate limiting basado en email/IP
 */
export class CreateAuthAttemptDto {
  @IsOptional()
  @IsUUID('4')
  user_id?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsIP()
  ip_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  user_agent?: string;

  @IsBoolean()
  success!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  failure_reason?: string;
}
