import { IsUUID, IsString, IsEmail, IsDateString } from 'class-validator';

/**
 * DTO para crear token de verificación de email
 *
 * @usage
 * - Al registrar usuario nuevo
 * - Al cambiar email en perfil
 *
 * @security
 * - Token DEBE hashearse (SHA256) antes de pasar a este DTO
 * - Nunca almacenar token en plaintext
 */
export class CreateEmailVerificationTokenDto {
  @IsUUID('4')
  user_id!: string;

  @IsString()
  token!: string; // Token YA hasheado (SHA256)

  @IsEmail()
  email!: string; // Email a verificar

  @IsDateString()
  expires_at!: string; // ISO 8601 string (típicamente +24h)
}
