import { IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';
import {
  MembershipRoleEnum,
  MembershipStatusEnum,
} from '@/shared/constants/enums.constants';

/**
 * CreateMembershipDto - DTO para creación de membresías
 *
 * @description Valida los datos de entrada al crear una nueva membresía.
 * Solo incluye campos que el cliente puede enviar (excluye id, created_at, updated_at).
 *
 * @see MembershipEntity para la estructura completa
 */
export class CreateMembershipDto {
  /**
   * ID del usuario (UUID)
   * @required
   */
  @IsUUID('4', { message: 'El user_id debe ser un UUID válido' })
  user_id!: string;

  /**
   * ID del tenant (UUID)
   * @required
   */
  @IsUUID('4', { message: 'El tenant_id debe ser un UUID válido' })
  tenant_id!: string;

  /**
   * Rol del usuario en el tenant
   * @optional
   * @default MembershipRoleEnum.MEMBER
   */
  @IsEnum(MembershipRoleEnum, {
    message: `El rol debe ser uno de: ${Object.values(MembershipRoleEnum).join(', ')}`,
  })
  @IsOptional()
  role?: MembershipRoleEnum = MembershipRoleEnum.MEMBER;

  /**
   * Estado de la membresía
   * @optional
   * @default MembershipStatusEnum.ACTIVE
   */
  @IsEnum(MembershipStatusEnum, {
    message: `El estado debe ser uno de: ${Object.values(MembershipStatusEnum).join(', ')}`,
  })
  @IsOptional()
  status?: MembershipStatusEnum = MembershipStatusEnum.ACTIVE;

  /**
   * ID del usuario que invitó (UUID, opcional)
   * @optional
   */
  @IsUUID('4', { message: 'El invited_by debe ser un UUID válido' })
  @IsOptional()
  invited_by?: string;

  /**
   * Fecha y hora en que el usuario se unió al tenant
   * @optional
   * @default Date.now()
   * @format ISO 8601
   */
  @IsDateString({}, { message: 'La fecha joined_at debe estar en formato ISO 8601' })
  @IsOptional()
  joined_at?: Date;
}
