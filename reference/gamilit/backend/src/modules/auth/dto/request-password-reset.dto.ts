import { IsEmail } from 'class-validator';

/**
 * DTO para solicitar reset de contraseña
 *
 * @usage
 * - Usuario hace clic en "Olvidé mi contraseña"
 * - Ingresa su email
 * - Service genera token y envía email
 */
export class RequestPasswordResetDto {
  @IsEmail()
  email!: string;
}
