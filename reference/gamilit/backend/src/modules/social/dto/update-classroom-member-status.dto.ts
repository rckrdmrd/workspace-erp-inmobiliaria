import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ClassroomMemberStatusEnum } from '@shared/constants/enums.constants';

/**
 * UpdateClassroomMemberStatusDto - DTO para actualizar estado de membresía
 *
 * @description DTO usado para cambiar el estado de un estudiante en el aula.
 * Permite transiciones como active -> inactive/withdrawn/completed
 *
 * @see ClassroomMember entity para la estructura completa
 */
export class UpdateClassroomMemberStatusDto {
  /**
   * Nuevo estado de la membresía
   * Valores: active, inactive, withdrawn, completed
   */
  @IsEnum(ClassroomMemberStatusEnum)
  status!: string;

  /**
   * Fecha de retiro (si aplica)
   */
  @IsOptional()
  @IsDateString()
  withdrawal_date?: string;

  /**
   * Razón del retiro (si aplica)
   */
  @IsOptional()
  @IsString()
  withdrawal_reason?: string;
}
