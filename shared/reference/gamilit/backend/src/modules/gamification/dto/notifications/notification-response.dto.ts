import { Expose, Type } from 'class-transformer';

/**
 * NotificationResponseDto
 *
 * @description DTO de respuesta para notificaciones.
 * Define qué campos se exponen al cliente.
 *
 * @see Notification entity
 */
export class NotificationResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  @Expose()
  type!: string;

  @Expose()
  title!: string;

  @Expose()
  message!: string;

  @Expose()
  data!: Record<string, any> | null;

  @Expose()
  read!: boolean;

  @Expose()
  @Type(() => Date)
  created_at!: Date;

  @Expose()
  @Type(() => Date)
  updated_at!: Date | null;
}
