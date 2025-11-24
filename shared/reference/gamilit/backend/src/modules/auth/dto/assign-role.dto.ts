import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { GamilityRoleEnum } from '@/shared/constants/enums.constants';

/**
 * AssignRoleDto (CreateUserRoleDto) - DTO para asignar roles a usuarios
 *
 * @description Valida los datos de entrada al asignar un rol a un usuario.
 * Solo incluye campos que el cliente puede enviar.
 * Los campos assigned_by, assigned_at, created_at, updated_at se establecen automáticamente.
 *
 * @see UserRoleEntity para la estructura completa
 */
export class AssignRoleDto {
  /**
   * ID del usuario (Profile) al que se asignará el rol
   * @required
   * @format UUID v4
   */
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id!: string;

  /**
   * ID del tenant al que pertenece la asignación
   * @required
   * @format UUID v4
   */
  @IsUUID('4', { message: 'tenant_id debe ser un UUID válido' })
  tenant_id!: string;

  /**
   * Rol del sistema Gamilit a asignar
   * @required
   * @see GamilityRoleEnum para valores válidos
   */
  @IsEnum(GamilityRoleEnum, {
    message: `El rol debe ser uno de: ${Object.values(GamilityRoleEnum).join(', ')}`,
  })
  role!: GamilityRoleEnum;

  /**
   * Permisos específicos asociados a este rol (opcional)
   * @optional
   * @default { read: true, write: false, admin: false, analytics: false }
   * @example { read: true, write: true, admin: false, analytics: true }
   */
  @IsObject({ message: 'permissions debe ser un objeto JSON válido' })
  @IsOptional()
  permissions?: Record<string, any>;

  /**
   * Fecha y hora de expiración del rol (opcional)
   * @optional
   * @format ISO 8601
   * @example "2025-12-31T23:59:59Z"
   */
  @IsDateString({}, { message: 'expires_at debe estar en formato ISO 8601' })
  @IsOptional()
  expires_at?: Date;

  /**
   * Estado activo del rol (opcional)
   * @optional
   * @default true
   */
  @IsBoolean({ message: 'is_active debe ser un valor booleano' })
  @IsOptional()
  is_active?: boolean;

  /**
   * Metadata adicional del user_role (opcional)
   * @optional
   * @default {}
   * @example { notes: "Rol temporal para proyecto X", reason: "..." }
   */
  @IsObject({ message: 'metadata debe ser un objeto JSON válido' })
  @IsOptional()
  metadata?: Record<string, any>;
}
