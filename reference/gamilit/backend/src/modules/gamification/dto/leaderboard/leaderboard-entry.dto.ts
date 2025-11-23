import { Expose, Type } from 'class-transformer';

/**
 * LeaderboardEntryDto
 *
 * @description DTO para representar una entrada en el leaderboard.
 * No es una entidad persistente, se construye dinámicamente desde queries.
 *
 * @note Este DTO se usa para representar datos agregados de user_stats u otras tablas
 */
export class LeaderboardEntryDto {
  /**
   * Posición en el ranking (1 = primero)
   */
  @Expose()
  rank!: number;

  /**
   * ID del usuario
   */
  @Expose()
  user_id!: string;

  /**
   * Nombre del usuario (opcional, para display)
   */
  @Expose()
  username?: string;

  /**
   * URL del avatar del usuario (opcional)
   */
  @Expose()
  avatar_url?: string | null;

  /**
   * Total de puntos XP del usuario
   */
  @Expose()
  total_xp!: number;

  /**
   * Nivel actual del usuario
   */
  @Expose()
  current_level!: number;

  /**
   * Rango maya del usuario (opcional)
   */
  @Expose()
  maya_rank?: string;

  /**
   * Total de ML Coins del usuario
   */
  @Expose()
  total_ml_coins?: number;

  /**
   * Racha actual de días consecutivos
   */
  @Expose()
  current_streak?: number;

  /**
   * Total de achievements desbloqueados
   */
  @Expose()
  total_achievements?: number;

  /**
   * Metadata adicional (escuela, aula, etc.)
   */
  @Expose()
  metadata?: Record<string, any>;
}
