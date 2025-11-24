import { Expose, Type } from 'class-transformer';

/**
 * FriendshipResponseDto - DTO para respuestas de amistad
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see Friendship entity para la estructura de base de datos
 */
export class FriendshipResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del usuario que solicita/tiene la amistad
   */
  @Expose()
  user_id!: string;

  /**
   * ID del amigo
   */
  @Expose()
  friend_id!: string;

  /**
   * Estado de la amistad
   */
  @Expose()
  status!: string;

  /**
   * Fecha de creación de la solicitud
   */
  @Expose()
  @Type(() => Date)
  created_at!: Date;

  /**
   * Fecha de última actualización
   */
  @Expose()
  @Type(() => Date)
  updated_at!: Date;
}
