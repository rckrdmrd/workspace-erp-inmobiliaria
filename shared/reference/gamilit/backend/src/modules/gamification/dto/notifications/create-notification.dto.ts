import { IsUUID, IsString, IsIn, IsOptional, IsObject, MinLength } from 'class-validator';

/**
 * CreateNotificationDto
 *
 * @description DTO para crear una nueva notificación para un usuario.
 *
 * @see Notification entity
 */
export class CreateNotificationDto {
  /**
   * ID del usuario (Profile) que recibirá la notificación
   * @required
   * @format UUID v4
   */
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id!: string;

  /**
   * Tipo de notificación
   * @required
   * @enum achievement | mission | reward | system | social | educational
   */
  @IsString({ message: 'type debe ser una cadena de texto' })
  @IsIn(['achievement', 'mission', 'reward', 'system', 'social', 'educational'], {
    message: 'type debe ser uno de: achievement, mission, reward, system, social, educational',
  })
  type!: string;

  /**
   * Título de la notificación
   * @required
   * @minLength 1
   */
  @IsString({ message: 'title debe ser una cadena de texto' })
  @MinLength(1, { message: 'title no puede estar vacío' })
  title!: string;

  /**
   * Mensaje de la notificación
   * @required
   * @minLength 1
   */
  @IsString({ message: 'message debe ser una cadena de texto' })
  @MinLength(1, { message: 'message no puede estar vacío' })
  message!: string;

  /**
   * Datos adicionales en formato JSONB
   * @optional
   * @example { "achievement_id": "uuid-...", "reward": { "ml_coins": 50 } }
   */
  @IsObject({ message: 'data debe ser un objeto JSON válido' })
  @IsOptional()
  data?: Record<string, any>;
}
