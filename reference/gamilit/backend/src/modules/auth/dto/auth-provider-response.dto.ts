import { Expose } from 'class-transformer';
import { AuthProviderEnum } from '@shared/constants/enums.constants';

/**
 * AuthProviderResponseDto
 *
 * @description DTO para respuestas de vinculación de usuario con proveedor OAuth
 *
 * Expone campos seguros (7 campos):
 * - id (UUID)
 * - user_id (UUID)
 * - provider (ENUM)
 * - provider_user_id (TEXT)
 * - token_expires_at (TIMESTAMP, nullable)
 * - created_at (TIMESTAMP)
 * - updated_at (TIMESTAMP)
 *
 * IMPORTANTE - SEGURIDAD:
 * NO expone campos sensibles:
 * - access_token (NUNCA exponer)
 * - refresh_token (NUNCA exponer)
 *
 * Estos tokens OAuth son sensibles y solo deben usarse internamente
 * en la lógica de autenticación del backend.
 *
 * @see AuthProviderEntity
 * @see CreateAuthProviderDto
 */
export class AuthProviderResponseDto {
  /**
   * Identificador único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del usuario vinculado
   */
  @Expose()
  user_id!: string;

  /**
   * Proveedor de autenticación OAuth
   * Valores: local, google, facebook, apple, microsoft, github
   */
  @Expose()
  provider!: AuthProviderEnum;

  /**
   * ID del usuario en el proveedor OAuth externo
   */
  @Expose()
  provider_user_id!: string;

  /**
   * Fecha y hora de expiración del access_token
   * @note NO exponemos el token, solo su fecha de expiración
   */
  @Expose()
  token_expires_at!: Date | null;

  /**
   * Fecha y hora de creación del registro
   */
  @Expose()
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   */
  @Expose()
  updated_at!: Date;

  // =====================================================
  // Campos NO expuestos (sensibles):
  // =====================================================
  // - access_token: Token OAuth (SENSIBLE, @Exclude en Entity)
  // - refresh_token: Refresh token OAuth (SENSIBLE, @Exclude en Entity)
  //
  // Estos campos están marcados con @Exclude() en AuthProviderEntity
  // y NO deben incluirse en ningún DTO de respuesta pública.
  // =====================================================

  // Relación opcional a User (si se incluye en la query)
  // @Expose()
  // @Type(() => UserResponseDto)
  // user?: UserResponseDto;
}
