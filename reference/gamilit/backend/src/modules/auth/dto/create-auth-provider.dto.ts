import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { AuthProviderEnum } from '@shared/constants/enums.constants';

/**
 * CreateAuthProviderDto
 *
 * @description DTO para crear una vinculación de usuario con proveedor OAuth
 * @fields 7 campos (user_id, provider, provider_user_id, access_token, refresh_token, token_expires_at)
 *
 * Validaciones aplicadas:
 * - user_id: UUID requerido (FK a auth.users)
 * - provider: ENUM AuthProviderEnum requerido
 * - provider_user_id: STRING requerido (ID del usuario en el proveedor externo)
 * - access_token: STRING opcional (token OAuth sensible)
 * - refresh_token: STRING opcional (refresh token OAuth sensible)
 * - token_expires_at: ISO Date opcional (expiración del access_token)
 *
 * IMPORTANTE - SEGURIDAD:
 * - Los tokens (access_token, refresh_token) son sensibles
 * - NUNCA exponerlos en logs o respuestas públicas
 * - Solo usar internamente en lógica de autenticación OAuth
 *
 * @see AuthProviderEntity
 * @see AuthProviderResponseDto
 * @see DDL: auth_management.auth_providers
 */
export class CreateAuthProviderDto {
  /**
   * ID del usuario vinculado
   * @required
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID('4', { message: 'El user_id debe ser un UUID válido' })
  user_id!: string;

  /**
   * Proveedor de autenticación OAuth
   * @required
   * @enum AuthProviderEnum
   * @example "google"
   */
  @IsEnum(AuthProviderEnum, {
    message:
      'El proveedor debe ser: local, google, facebook, apple, microsoft o github',
  })
  provider!: AuthProviderEnum;

  /**
   * ID del usuario en el proveedor OAuth externo
   * @required
   * @example "1234567890" (Google), "fb_user_123" (Facebook)
   */
  @IsString({ message: 'El provider_user_id debe ser un texto' })
  @MaxLength(255, {
    message: 'El provider_user_id no puede exceder 255 caracteres',
  })
  provider_user_id!: string;

  /**
   * Access Token OAuth (SENSIBLE)
   * @optional
   * @security NUNCA exponer en logs o respuestas públicas
   */
  @IsString({ message: 'El access_token debe ser un texto' })
  @IsOptional()
  access_token?: string;

  /**
   * Refresh Token OAuth (SENSIBLE)
   * @optional
   * @security NUNCA exponer en logs o respuestas públicas
   */
  @IsString({ message: 'El refresh_token debe ser un texto' })
  @IsOptional()
  refresh_token?: string;

  /**
   * Fecha y hora de expiración del access_token
   * @optional
   * @format ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
   * @example "2024-12-31T23:59:59Z"
   */
  @IsDateString(
    {},
    {
      message:
        'El token_expires_at debe ser una fecha válida en formato ISO 8601',
    },
  )
  @IsOptional()
  token_expires_at?: string;
}
