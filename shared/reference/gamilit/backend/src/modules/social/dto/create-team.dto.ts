import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsObject,
  Min,
  IsDateString,
} from 'class-validator';

/**
 * CreateTeamDto - DTO para crear equipo colaborativo
 *
 * @description DTO usado para crear un nuevo equipo.
 * Incluye campos requeridos y opcionales para configurar el equipo.
 *
 * @see Team entity para la estructura completa
 */
export class CreateTeamDto {
  /**
   * ID del aula (opcional)
   */
  @IsOptional()
  @IsUUID('4')
  classroom_id?: string;

  /**
   * ID del tenant propietario
   */
  @IsUUID('4')
  tenant_id!: string;

  /**
   * Nombre del equipo
   */
  @IsString()
  name!: string;

  /**
   * Descripción del equipo
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Lema o motto del equipo
   */
  @IsOptional()
  @IsString()
  motto?: string;

  /**
   * Color primario del equipo
   */
  @IsOptional()
  @IsString()
  color_primary?: string;

  /**
   * Color secundario del equipo
   */
  @IsOptional()
  @IsString()
  color_secondary?: string;

  /**
   * URL del avatar del equipo
   */
  @IsOptional()
  @IsString()
  avatar_url?: string;

  /**
   * URL del banner del equipo
   */
  @IsOptional()
  @IsString()
  banner_url?: string;

  /**
   * Badges o insignias ganadas
   */
  @IsOptional()
  @IsArray()
  badges?: any[];

  /**
   * ID del creador del equipo
   */
  @IsUUID('4')
  creator_id!: string;

  /**
   * ID del líder actual del equipo
   */
  @IsOptional()
  @IsUUID('4')
  leader_id?: string;

  /**
   * Código único de invitación
   */
  @IsOptional()
  @IsString()
  team_code?: string;

  /**
   * Capacidad máxima de miembros
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  max_members?: number;

  /**
   * Equipo público
   */
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  /**
   * Permitir solicitudes de ingreso
   */
  @IsOptional()
  @IsBoolean()
  allow_join_requests?: boolean;

  /**
   * Requiere aprobación para unirse
   */
  @IsOptional()
  @IsBoolean()
  require_approval?: boolean;

  /**
   * Equipo activo
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Equipo verificado
   */
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  /**
   * Fecha de fundación del equipo
   */
  @IsOptional()
  @IsDateString()
  founded_at?: string;

  /**
   * Metadatos adicionales
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
