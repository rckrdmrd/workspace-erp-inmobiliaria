import { Expose } from 'class-transformer';
import {
  MembershipRoleEnum,
  MembershipStatusEnum,
} from '@/shared/constants/enums.constants';

/**
 * MembershipResponseDto - DTO para respuestas de membresía
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad (incluyendo id, created_at, updated_at).
 * No incluye campos sensibles (ninguno identificado en esta entidad).
 *
 * @see MembershipEntity para la estructura de base de datos
 */
export class MembershipResponseDto {
  /**
   * ID único de la membresía (UUID)
   */
  @Expose()
  id!: string;

  /**
   * ID del usuario (UUID)
   */
  @Expose()
  user_id!: string;

  /**
   * ID del tenant (UUID)
   */
  @Expose()
  tenant_id!: string;

  /**
   * Rol del usuario en el tenant
   */
  @Expose()
  role!: MembershipRoleEnum;

  /**
   * Estado de la membresía
   */
  @Expose()
  status!: MembershipStatusEnum;

  /**
   * ID del usuario que invitó (nullable)
   */
  @Expose()
  invited_by!: string | null;

  /**
   * Fecha y hora en que el usuario se unió al tenant
   */
  @Expose()
  joined_at!: Date;

  /**
   * Fecha de creación de la membresía
   */
  @Expose()
  created_at!: Date;

  /**
   * Fecha de última actualización de la membresía
   */
  @Expose()
  updated_at!: Date;
}
