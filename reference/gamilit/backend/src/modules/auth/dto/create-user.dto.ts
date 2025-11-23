import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { GamilityRoleEnum } from '@shared/constants';

/**
 * CreateUserDto
 *
 * @description DTO para creación de usuarios (uso administrativo).
 * @usage Endpoints de gestión de usuarios por administradores.
 *
 * IMPORTANTE:
 * - El campo 'password' será hasheado en el Service (NO se guarda plano)
 * - role es opcional y por defecto es STUDENT
 * - email_confirmed_at se establece automáticamente según lógica de negocio
 *
 * @see UserEntity (auth.users)
 */
export class CreateUserDto {
  /**
   * Correo electrónico único del usuario
   * @example "estudiante@gamilit.com"
   */
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;

  /**
   * Contraseña del usuario (será hasheada)
   * Mínimo 8 caracteres
   * @example "Password123!"
   */
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  /**
   * Rol del usuario en el sistema
   * Valores: student, admin_teacher, super_admin
   * @default GamilityRoleEnum.STUDENT
   */
  @IsEnum(GamilityRoleEnum, {
    message: 'El rol debe ser: student, admin_teacher o super_admin',
  })
  @IsOptional()
  role?: GamilityRoleEnum = GamilityRoleEnum.STUDENT;

  /**
   * Metadatos adicionales del usuario (JSON)
   * @example { "preferences": { "theme": "dark" }, "onboarding_completed": false }
   */
  @IsObject({ message: 'Los metadatos deben ser un objeto JSON' })
  @IsOptional()
  raw_user_meta_data?: Record<string, any>;
}
