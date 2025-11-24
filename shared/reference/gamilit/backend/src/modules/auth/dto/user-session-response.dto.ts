import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para sesiones de usuario
 *
 * @description Serializa UserSession para respuestas API.
 * @security NO expone refresh_token (marcado con @Exclude en entity)
 */
export class UserSessionResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  @Expose()
  tenant_id!: string | null;

  @Expose()
  session_token!: string;

  @Expose()
  user_agent!: string | null;

  @Expose()
  ip_address!: string | null;

  @Expose()
  device_type!: string | null;

  @Expose()
  browser!: string | null;

  @Expose()
  os!: string | null;

  @Expose()
  country!: string | null;

  @Expose()
  city!: string | null;

  @Expose()
  created_at!: Date;

  @Expose()
  last_activity_at!: Date;

  @Expose()
  expires_at!: Date;

  @Expose()
  is_active!: boolean;

  // refresh_token NO expuesto (tiene @Exclude en entity)
  // metadata NO expuesto (interno)
}
