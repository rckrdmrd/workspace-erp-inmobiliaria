import {
  IsUUID,
  IsInt,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
  Max,
} from 'class-validator';

/**
 * GrantAchievementDto
 *
 * @description DTO para otorgar o actualizar el progreso de un achievement a un usuario.
 * Se usa tanto para crear como para actualizar progreso.
 *
 * @see UserAchievement entity
 */
export class GrantAchievementDto {
  /**
   * ID del usuario (Profile) que recibirá el achievement
   * @required
   * @format UUID v4
   */
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id!: string;

  /**
   * ID del achievement a otorgar
   * @required
   * @format UUID v4
   */
  @IsUUID('4', { message: 'achievement_id debe ser un UUID válido' })
  achievement_id!: string;

  /**
   * Progreso actual hacia el achievement (numérico)
   * @optional
   * @default 0
   * @min 0
   */
  @IsInt({ message: 'progress debe ser un número entero' })
  @Min(0, { message: 'progress debe ser mayor o igual a 0' })
  @IsOptional()
  progress?: number;

  /**
   * Progreso máximo requerido para completar el achievement
   * @optional
   * @default 100
   * @min 1
   */
  @IsInt({ message: 'max_progress debe ser un número entero' })
  @Min(1, { message: 'max_progress debe ser al menos 1' })
  @IsOptional()
  max_progress?: number;

  /**
   * Indica si el achievement está completado
   * @optional
   * @default false
   */
  @IsBoolean({ message: 'is_completed debe ser un valor booleano' })
  @IsOptional()
  is_completed?: boolean;

  /**
   * Datos de progreso específicos (JSONB)
   * @optional
   * @example { "levels_completed": [1, 2, 5], "current_streak": 3 }
   */
  @IsObject({ message: 'progress_data debe ser un objeto JSON válido' })
  @IsOptional()
  progress_data?: Record<string, any>;

  /**
   * Metadata adicional
   * @optional
   * @example { "source": "exercise_completion", "exercise_id": "uuid-..." }
   */
  @IsObject({ message: 'metadata debe ser un objeto JSON válido' })
  @IsOptional()
  metadata?: Record<string, any>;
}
