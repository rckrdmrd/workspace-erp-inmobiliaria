import { IsString } from 'class-validator';

/**
 * DTO para verificar email con token
 *
 * @usage
 * - Usuario hace clic en enlace de verificación
 * - Se recibe token plaintext desde URL
 * - Service hashea token y busca en DB
 */
export class VerifyEmailDto {
  @IsString()
  token!: string; // Token plaintext desde URL/email
}
