import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { FriendshipStatusEnum } from '@shared/constants/enums.constants';

/**
 * CreateFriendshipDto - DTO para crear solicitud de amistad
 *
 * @description DTO usado para crear una nueva solicitud de amistad.
 * Por defecto, el estado será 'pending' hasta que el usuario receptor acepte.
 *
 * @see Friendship entity para la estructura completa
 */
export class CreateFriendshipDto {
  /**
   * ID del usuario que solicita la amistad
   */
  @IsUUID('4')
  user_id!: string;

  /**
   * ID del usuario receptor (amigo)
   */
  @IsUUID('4')
  friend_id!: string;

  /**
   * Estado inicial (opcional, por defecto 'pending')
   */
  @IsOptional()
  @IsEnum(FriendshipStatusEnum)
  status?: string;
}
