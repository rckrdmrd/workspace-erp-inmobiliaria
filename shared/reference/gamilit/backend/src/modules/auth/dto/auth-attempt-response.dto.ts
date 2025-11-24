import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para intentos de autenticación
 *
 * @description Serializa AuthAttempt para respuestas API.
 * @security NO expone user_agent completo por privacidad (solo primeros 100 chars)
 */
export class AuthAttemptResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string | null;

  @Expose()
  email!: string;

  @Expose()
  ip_address!: string | null;

  @Expose()
  user_agent!: string | null;

  @Expose()
  success!: boolean;

  @Expose()
  failure_reason!: string | null;

  @Expose()
  attempted_at!: Date;
}
