import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para tokens de verificación de email
 *
 * @description Serializa EmailVerificationToken para respuestas API.
 * @security NO expone token hasheado (marcado con @Exclude en entity)
 *
 * @usage
 * - Respuesta al crear token (ej: re-enviar email de verificación)
 * - Listar tokens pendientes en admin panel
 */
export class EmailVerificationTokenResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  // token NO expuesto (tiene @Exclude en entity)

  @Expose()
  email!: string;

  @Expose()
  expires_at!: Date;

  @Expose()
  used_at!: Date | null;

  @Expose()
  created_at!: Date;
}
