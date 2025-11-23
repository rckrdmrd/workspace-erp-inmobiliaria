import { IsUUID, IsOptional, IsString, IsIP, IsDateString, MaxLength, IsBoolean, IsIn } from 'class-validator';

/**
 * DTO para crear nueva sesión de usuario
 *
 * @usage
 * - Al hacer login exitoso
 * - Al renovar sesión con refresh token
 *
 * @validation
 * - Validar en service que usuario no exceda 5 sesiones activas
 * - Limpiar sesiones expiradas antes de crear nueva
 * - device_type debe ser: 'desktop', 'mobile', 'tablet', 'unknown'
 */
export class CreateUserSessionDto {
  @IsUUID('4')
  user_id!: string;

  @IsOptional()
  @IsUUID('4')
  tenant_id?: string | null;

  @IsString()
  session_token!: string;

  @IsOptional()
  @IsString()
  refresh_token?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  user_agent?: string | null;

  @IsOptional()
  @IsIP()
  ip_address?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(['desktop', 'mobile', 'tablet', 'unknown'])
  device_type?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  browser?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  os?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;

  @IsDateString()
  expires_at!: string; // ISO 8601 string

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
