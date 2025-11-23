import {
  IsUUID,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  IsObject,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import {
  DifficultyLevelEnum,
  ContentStatusEnum,
  MayaRank,
} from '@shared/constants/enums.constants';

/**
 * CreateModuleDto
 *
 * @description DTO para crear un nuevo módulo educativo.
 *              Módulos educativos de Marie Curie con 5 niveles de comprensión lectora.
 */
export class CreateModuleDto {
  /**
   * ID del tenant (opcional)
   */
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Título del módulo (REQUERIDO)
   */
  @IsString()
  title!: string;

  /**
   * Subtítulo del módulo
   */
  @IsOptional()
  @IsString()
  subtitle?: string;

  /**
   * Descripción detallada del módulo
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Resumen breve del módulo
   */
  @IsOptional()
  @IsString()
  summary?: string;

  /**
   * Contenido estructurado del módulo (JSONB)
   * Estructura: {marie_curie_story, reading_materials, historical_context, scientific_concepts, multimedia_resources}
   */
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  /**
   * Índice de orden para la secuencia de módulos (REQUERIDO)
   */
  @IsInt()
  @Min(0)
  order_index!: number;

  /**
   * Código único del módulo (ej. MC-001)
   */
  @IsOptional()
  @IsString()
  module_code?: string;

  // =====================================================
  // DIFFICULTY & CONTENT
  // =====================================================

  /**
   * Nivel de dificultad del módulo
   */
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Niveles de grado a los que va dirigido
   * Array: ['6', '7', '8', ...]
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grade_levels?: string[];

  /**
   * Materias relacionadas
   * Array: ['Literatura', 'Ciencias', ...]
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  // =====================================================
  // TIMING & DURATION
  // =====================================================

  /**
   * Duración estimada en minutos
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  estimated_duration_minutes?: number;

  /**
   * Número estimado de sesiones para completar el módulo
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  estimated_sessions?: number;

  // =====================================================
  // LEARNING OBJECTIVES & COMPETENCIES
  // =====================================================

  /**
   * Objetivos de aprendizaje del módulo
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learning_objectives?: string[];

  /**
   * Competencias a desarrollar
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competencies?: string[];

  /**
   * Habilidades desarrolladas en el módulo
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills_developed?: string[];

  // =====================================================
  // PREREQUISITES
  // =====================================================

  /**
   * Array de UUIDs de módulos prerequisitos
   */
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  prerequisites?: string[];

  /**
   * Habilidades prerequisitas (texto)
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisite_skills?: string[];

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  /**
   * Rango maya requerido para desbloquear el módulo
   * @version 1.1 (2025-11-08) - Cambiado a type-safe ENUM
   */
  @IsOptional()
  @IsEnum(MayaRank)
  maya_rank_required?: MayaRank;

  /**
   * Rango maya otorgado al completar el módulo
   * @version 1.1 (2025-11-08) - Cambiado a type-safe ENUM
   */
  @IsOptional()
  @IsEnum(MayaRank)
  maya_rank_granted?: MayaRank;

  /**
   * Puntos de experiencia (XP) otorgados al completar
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  xp_reward?: number;

  /**
   * Monedas ML otorgadas al completar
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_reward?: number;

  // =====================================================
  // STATUS & PUBLICATION
  // =====================================================

  /**
   * Estado del módulo
   */
  @IsOptional()
  @IsEnum(ContentStatusEnum)
  status?: ContentStatusEnum;

  /**
   * Si el módulo está publicado y visible para estudiantes
   */
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  /**
   * Si el módulo está destacado en la página principal
   */
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  /**
   * Si el módulo es gratuito
   */
  @IsOptional()
  @IsBoolean()
  is_free?: boolean;

  /**
   * Si es un módulo de demostración
   */
  @IsOptional()
  @IsBoolean()
  is_demo_module?: boolean;

  /**
   * Fecha de publicación
   */
  @IsOptional()
  is_published_date?: Date;

  /**
   * Fecha de archivado
   */
  @IsOptional()
  archived_at?: Date;

  // =====================================================
  // VERSIONING & REVISION
  // =====================================================

  /**
   * Número de versión del módulo
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  /**
   * Notas sobre cambios en la versión
   */
  @IsOptional()
  @IsString()
  version_notes?: string;

  /**
   * ID del usuario que creó el módulo
   */
  @IsOptional()
  @IsUUID()
  created_by?: string;

  /**
   * ID del usuario que revisó el módulo
   */
  @IsOptional()
  @IsUUID()
  reviewed_by?: string;

  /**
   * ID del usuario que aprobó el módulo
   */
  @IsOptional()
  @IsUUID()
  approved_by?: string;

  // =====================================================
  // METADATA & INDEXING
  // =====================================================

  /**
   * Palabras clave para búsqueda
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  /**
   * Etiquetas para categorización
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /**
   * URL de la imagen en miniatura
   */
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  /**
   * URL de la imagen de portada
   */
  @IsOptional()
  @IsString()
  cover_image_url?: string;

  /**
   * Configuraciones del módulo (JSONB)
   */
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  /**
   * Metadatos adicionales (JSONB)
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  /**
   * Total de ejercicios en el módulo
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  total_exercises?: number;
}
