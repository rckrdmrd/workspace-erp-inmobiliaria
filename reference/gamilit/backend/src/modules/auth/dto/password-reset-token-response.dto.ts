import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para tokens de reset de contraseña
 *
 * @description Serializa PasswordResetToken para respuestas API.
 * @security NO expone token hasheado (marcado con @Exclude en entity)
 *
 * @usage
 * - Respuesta al solicitar reset (no expone token por seguridad)
 * - Listar tokens pendientes en admin panel
 */
export class PasswordResetTokenResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  // token NO expuesto (tiene @Exclude en entity)

  @Expose()
  expires_at!: Date;

  @Expose()
  used_at!: Date | null;

  @Expose()
  created_at!: Date;
}
