import { IsEnum } from 'class-validator';
import { FriendshipStatusEnum } from '@shared/constants/enums.constants';

/**
 * UpdateFriendshipStatusDto - DTO para actualizar estado de amistad
 *
 * @description DTO usado para aceptar, rechazar o bloquear solicitudes de amistad.
 * Usado para transiciones de estado: pending -> accepted/rejected/blocked
 *
 * @see Friendship entity para la estructura completa
 */
export class UpdateFriendshipStatusDto {
  /**
   * Nuevo estado de la amistad
   * Valores: accepted, rejected, blocked
   */
  @IsEnum(FriendshipStatusEnum)
  status!: string;
}
