import { Expose, Type } from 'class-transformer';

/**
 * TeamResponseDto - DTO para respuestas de equipos
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see Team entity para la estructura de base de datos
 */
export class TeamResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del aula
   */
  @Expose()
  classroom_id!: string | null;

  /**
   * ID del tenant propietario
   */
  @Expose()
  tenant_id!: string;

  /**
   * Nombre del equipo
   */
  @Expose()
  name!: string;

  /**
   * Descripción del equipo
   */
  @Expose()
  description!: string | null;

  /**
   * Lema o motto del equipo
   */
  @Expose()
  motto!: string | null;

  /**
   * Color primario del equipo
   */
  @Expose()
  color_primary!: string;

  /**
   * Color secundario del equipo
   */
  @Expose()
  color_secondary!: string;

  /**
   * URL del avatar del equipo
   */
  @Expose()
  avatar_url!: string | null;

  /**
   * URL del banner del equipo
   */
  @Expose()
  banner_url!: string | null;

  /**
   * Badges o insignias ganadas
   */
  @Expose()
  badges!: any[];

  /**
   * ID del creador del equipo
   */
  @Expose()
  creator_id!: string;

  /**
   * ID del líder actual del equipo
   */
  @Expose()
  leader_id!: string | null;

  /**
   * Código único de invitación
   */
  @Expose()
  team_code!: string | null;

  /**
   * Capacidad máxima de miembros
   */
  @Expose()
  max_members!: number;

  /**
   * Contador actual de miembros
   */
  @Expose()
  current_members_count!: number;

  /**
   * Equipo público
   */
  @Expose()
  is_public!: boolean;

  /**
   * Permitir solicitudes de ingreso
   */
  @Expose()
  allow_join_requests!: boolean;

  /**
   * Requiere aprobación para unirse
   */
  @Expose()
  require_approval!: boolean;

  /**
   * XP total acumulada
   */
  @Expose()
  total_xp!: number;

  /**
   * ML Coins totales acumuladas
   */
  @Expose()
  total_ml_coins!: number;

  /**
   * Módulos completados
   */
  @Expose()
  modules_completed!: number;

  /**
   * Achievements ganados
   */
  @Expose()
  achievements_earned!: number;

  /**
   * Equipo activo
   */
  @Expose()
  is_active!: boolean;

  /**
   * Equipo verificado
   */
  @Expose()
  is_verified!: boolean;

  /**
   * Fecha de fundación
   */
  @Expose()
  @Type(() => Date)
  founded_at!: Date;

  /**
   * Fecha de última actividad
   */
  @Expose()
  @Type(() => Date)
  last_activity_at!: Date | null;

  /**
   * Metadatos adicionales
   */
  @Expose()
  metadata!: Record<string, any>;

  /**
   * Fecha de creación
   */
  @Expose()
  @Type(() => Date)
  created_at!: Date;

  /**
   * Fecha de actualización
   */
  @Expose()
  @Type(() => Date)
  updated_at!: Date;
}
