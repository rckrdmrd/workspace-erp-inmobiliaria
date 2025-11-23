import { Expose, Type } from 'class-transformer';
import { GamilityRoleEnum, UserStatusEnum } from '@/shared/constants/enums.constants';
import { UserPreferencesSchema } from './user-preferences.schema';

/**
 * ProfileResponseDto
 *
 * @description DTO para respuestas de perfil de usuario
 *
 * Expone TODOS los campos del perfil (25 campos):
 * - Información básica (nombres, email, teléfono, etc.)
 * - Información educativa (grade_level, student_id, school_id)
 * - Rol y estado
 * - Verificaciones (email_verified, phone_verified)
 * - Preferencias (JSONB)
 * - Metadata (JSONB)
 * - Timestamps (created_at, updated_at, last_sign_in_at, last_activity_at)
 *
 * NO expone:
 * - Campos sensibles (ninguno en este caso, todos son seguros)
 *
 * @see ProfileEntity
 * @see CreateProfileDto
 */
export class ProfileResponseDto {
  @Expose()
  id!: string;

  @Expose()
  tenant_id!: string;

  @Expose()
  display_name!: string | null;

  @Expose()
  full_name!: string | null;

  @Expose()
  first_name!: string | null;

  @Expose()
  last_name!: string | null;

  @Expose()
  email!: string;

  @Expose()
  avatar_url!: string | null;

  @Expose()
  bio!: string | null;

  @Expose()
  phone!: string | null;

  @Expose()
  date_of_birth!: Date | null;

  @Expose()
  grade_level!: string | null;

  @Expose()
  student_id!: string | null;

  @Expose()
  school_id!: string | null;

  @Expose()
  role!: GamilityRoleEnum;

  @Expose()
  status!: UserStatusEnum;

  @Expose()
  email_verified!: boolean;

  @Expose()
  phone_verified!: boolean;

  @Expose()
  preferences!: UserPreferencesSchema;

  @Expose()
  last_sign_in_at!: Date | null;

  @Expose()
  last_activity_at!: Date | null;

  @Expose()
  metadata!: Record<string, any>;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;

  @Expose()
  user_id!: string | null;

  // Relación opcional a User (si se incluye en la query)
  // @Expose()
  // @Type(() => UserResponseDto)
  // user?: UserResponseDto;

  // Relación opcional a Tenant (si se incluye en la query)
  // @Expose()
  // @Type(() => TenantResponseDto)
  // tenant?: TenantResponseDto;
}
