import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * DTO para resetear contraseña con token
 *
 * @usage
 * - Usuario hace clic en enlace de reset desde email
 * - Ingresa nueva contraseña
 * - Service valida token y actualiza password
 */
export class ResetPasswordDto {
  @IsString()
  token!: string; // Token plaintext desde URL/email

  @IsString()
  @MinLength(8, { message: 'Password debe tener al menos 8 caracteres' })
  @MaxLength(128)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password debe contener mayúsculas, minúsculas y números/símbolos',
  })
  new_password!: string;
}
