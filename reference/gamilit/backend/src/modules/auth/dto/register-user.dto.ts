import { IsEmail, IsString, MinLength, IsOptional, IsObject } from 'class-validator';

/**
 * RegisterUserDto
 *
 * @description DTO para registro público de usuarios (self-service).
 * @usage Endpoint público de registro (/api/auth/register).
 *
 * DIFERENCIAS con CreateUserDto:
 * - NO incluye 'role' (se asigna automáticamente STUDENT)
 * - Simplificado para flujo de registro público
 * - Puede extenderse con campos adicionales (nombre, apellido, etc.)
 *
 * @see CreateUserDto (uso administrativo)
 * @see UserEntity (auth.users)
 */
export class RegisterUserDto {
  /**
   * Correo electrónico único del usuario
   * @example "nuevo.estudiante@gamilit.com"
   */
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;

  /**
   * Contraseña del usuario (será hasheada)
   * Mínimo 8 caracteres
   * Recomendado: Al menos una mayúscula, una minúscula, un número y un carácter especial
   * @example "Password123!"
   */
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  /**
   * Metadatos adicionales del usuario (JSON)
   * Opcional: Información adicional capturada durante registro
   * @example { "source": "landing_page", "utm_campaign": "promo2024" }
   */
  @IsObject({ message: 'Los metadatos deben ser un objeto JSON' })
  @IsOptional()
  raw_user_meta_data?: Record<string, any>;

  // Campos opcionales adicionales para registro:
  // Nota: Estos campos se podrían mapear al Profile (auth_management.profiles)

  /**
   * Nombre del usuario (opcional)
   * @example "Juan"
   */
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsOptional()
  first_name?: string;

  /**
   * Apellido del usuario (opcional)
   * @example "Pérez"
   */
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsOptional()
  last_name?: string;
}
