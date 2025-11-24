import { Expose } from 'class-transformer';
import { GamilityRoleEnum } from '@/shared/constants/enums.constants';

/**
 * UserRoleResponseDto - DTO para respuestas de user_role
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad (incluyendo id, created_at, updated_at).
 *
 * @see UserRoleEntity para la estructura de base de datos
 */
export class UserRoleResponseDto {
  /**
   * ID único del user_role (UUID)
   */
  @Expose()
  id!: string;

  /**
   * ID del usuario (Profile) asignado
   */
  @Expose()
  user_id!: string;

  /**
   * ID del tenant al que pertenece la asignación
   */
  @Expose()
  tenant_id!: string;

  /**
   * Rol del sistema Gamilit asignado
   */
  @Expose()
  role!: GamilityRoleEnum;

  /**
   * Permisos específicos asociados a este rol
   */
  @Expose()
  permissions!: Record<string, any>;

  /**
   * ID del usuario (Profile) que asignó este rol (nullable)
   */
  @Expose()
  assigned_by!: string | null;

  /**
   * Fecha y hora de asignación del rol
   */
  @Expose()
  assigned_at!: Date;

  /**
   * Fecha y hora de expiración del rol (nullable)
   */
  @Expose()
  expires_at!: Date | null;

  /**
   * ID del usuario (Profile) que revocó este rol (nullable)
   */
  @Expose()
  revoked_by!: string | null;

  /**
   * Fecha y hora de revocación del rol (nullable)
   */
  @Expose()
  revoked_at!: Date | null;

  /**
   * Estado activo del rol
   */
  @Expose()
  is_active!: boolean;

  /**
   * Metadata adicional del user_role
   */
  @Expose()
  metadata!: Record<string, any>;

  /**
   * Fecha de creación del registro
   */
  @Expose()
  created_at!: Date;

  /**
   * Fecha de última actualización del registro
   */
  @Expose()
  updated_at!: Date;
}
