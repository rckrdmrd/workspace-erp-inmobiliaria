import {
  IsUUID,
  IsString,
  IsOptional,
  MaxLength,
  IsUrl,
  IsDateString,
  IsObject,
  IsEmail,
  IsEnum,
  IsBoolean,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { GamilityRoleEnum, UserStatusEnum } from '@/shared/constants/enums.constants';
import { UserPreferencesSchema } from './user-preferences.schema';

/**
 * CreateProfileDto
 *
 * @description DTO para crear un perfil de usuario
 * @fields 25 campos editables (sin id, created_at, updated_at)
 *
 * Validaciones aplicadas:
 * - tenant_id: UUID requerido (FK)
 * - email: Email válido, requerido
 * - first_name, last_name: MaxLength 100
 * - bio: MaxLength 500 (según CHECK constraint DDL)
 * - phone: Formato válido
 * - avatar_url: URL válida
 * - date_of_birth: Formato fecha ISO
 * - role: ENUM GamilityRoleEnum
 * - status: ENUM UserStatusEnum
 * - preferences: Objeto JSONB
 *
 * @see ProfileEntity
 * @see DDL: auth_management.profiles
 */
export class CreateProfileDto {
  /**
   * ID del tenant (requerido para multi-tenancy)
   * @required
   */
  @IsUUID()
  tenant_id!: string;

  /**
   * Nombre para mostrar
   * @optional
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  display_name?: string;

  /**
   * Nombre completo
   * @optional
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  full_name?: string;

  /**
   * Primer nombre
   * @optional
   */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  first_name?: string;

  /**
   * Apellido(s)
   * @optional
   */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  last_name?: string;

  /**
   * Email del usuario
   * @required
   * @unique
   */
  @IsEmail()
  email!: string;

  /**
   * URL del avatar
   * @optional
   */
  @IsUrl()
  @IsOptional()
  avatar_url?: string;

  /**
   * Biografía o descripción del usuario
   * @optional
   * @maxLength 500 (según CHECK constraint DDL)
   */
  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'La biografía no puede exceder 500 caracteres',
  })
  bio?: string;

  /**
   * Teléfono
   * @optional
   * @format E.164 internacional
   */
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'El teléfono debe ser un número válido en formato internacional',
  })
  phone?: string;

  /**
   * Fecha de nacimiento
   * @optional
   * @format ISO 8601 (YYYY-MM-DD)
   */
  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  /**
   * Grado escolar del estudiante
   * @optional
   * @example "6", "7", "8"
   */
  @IsString()
  @IsOptional()
  @MaxLength(10)
  grade_level?: string;

  /**
   * ID de estudiante (matrícula)
   * @optional
   */
  @IsString()
  @IsOptional()
  @MaxLength(50)
  student_id?: string;

  /**
   * ID de la escuela del estudiante
   * @optional
   * @note FK a schools (pendiente de implementar)
   */
  @IsUUID()
  @IsOptional()
  school_id?: string;

  /**
   * Rol del usuario en el sistema
   * @default STUDENT
   * @enum GamilityRoleEnum
   */
  @IsEnum(GamilityRoleEnum)
  @IsOptional()
  role?: GamilityRoleEnum;

  /**
   * Estado de la cuenta
   * @default ACTIVE
   * @enum UserStatusEnum
   */
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;

  /**
   * Email verificado
   * @default false
   */
  @IsBoolean()
  @IsOptional()
  email_verified?: boolean;

  /**
   * Teléfono verificado
   * @default false
   */
  @IsBoolean()
  @IsOptional()
  phone_verified?: boolean;

  /**
   * Preferencias del usuario (JSONB)
   * @optional
   * @type UserPreferencesSchema
   */
  @IsObject()
  @IsOptional()
  preferences?: UserPreferencesSchema;

  /**
   * Metadata adicional (JSONB)
   * @optional
   */
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  /**
   * ID del usuario en auth.users
   * @optional
   * @note FK a auth.users (schema diferente)
   */
  @IsUUID()
  @IsOptional()
  user_id?: string;
}
