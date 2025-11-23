import { IsUUID, IsString, IsDateString } from 'class-validator';

/**
 * DTO para crear token de reset de contraseña
 *
 * @usage
 * - Al solicitar "Olvidé mi contraseña"
 *
 * @security
 * - Token DEBE hashearse (SHA256) antes de pasar a este DTO
 * - Nunca almacenar token en plaintext
 * - Expiración corta (típicamente 1h)
 */
export class CreatePasswordResetTokenDto {
  @IsUUID('4')
  user_id!: string;

  @IsString()
  token!: string; // Token YA hasheado (SHA256)

  @IsDateString()
  expires_at!: string; // ISO 8601 string (típicamente +1h)
}
