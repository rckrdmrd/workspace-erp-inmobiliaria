import { IsUUID, IsArray, ArrayMinSize } from 'class-validator';

/**
 * MarkReadDto
 *
 * @description DTO para marcar notificaciones como leídas.
 * Permite marcar múltiples notificaciones a la vez.
 *
 * @see Notification entity
 */
export class MarkReadDto {
  /**
   * IDs de las notificaciones a marcar como leídas
   * @required
   * @minItems 1
   * @format UUID v4[]
   */
  @IsArray({ message: 'notification_ids debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un notification_id' })
  @IsUUID('4', { each: true, message: 'Todos los notification_ids deben ser UUIDs válidos' })
  notification_ids!: string[];
}
