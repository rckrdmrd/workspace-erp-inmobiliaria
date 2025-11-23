import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import {
  DifficultyLevelEnum,
  ContentStatusEnum,
  MayaRank,
} from '@shared/constants/enums.constants';

/**
 * Module Entity (educational_content.modules)
 *
 * @description Módulos educativos de Marie Curie - 5 niveles de comprensión lectora.
 *              Contiene contenido estructurado con historias, materiales de lectura,
 *              conceptos científicos y recursos multimedia.
 * @schema educational_content
 * @table modules
 *
 * @see DDL: apps/database/ddl/schemas/educational_content/tables/01-modules.sql
 */
@Entity({ schema: DB_SCHEMAS.EDUCATIONAL, name: DB_TABLES.EDUCATIONAL.MODULES })
@Index('idx_modules_difficulty', ['difficulty_level'])
@Index('idx_modules_order', ['order_index'])
@Index('idx_modules_status', ['status'])
@Index('idx_modules_published', ['is_published'], { where: 'is_published = true' })
@Index('idx_modules_tenant_id', ['tenant_id'])
@Index('idx_modules_rango_required', ['maya_rank_required'])
@Index('idx_modules_prerequisites_gin', ['prerequisites'])
@Index('idx_modules_content_gin', ['content'])
@Index('idx_modules_tags_gin', ['tags'])
@Index('idx_modules_created_by', ['created_by'])
@Index('idx_modules_reviewed_by', ['reviewed_by'])
@Index('idx_modules_approved_by', ['approved_by'])
@Index('idx_modules_active_published', ['order_index'], { where: 'is_published = true AND status = \'published\'' })
@Index('idx_modules_status_published', ['status', 'is_published', 'order_index'])
export class Module {
  /**
   * Identificador único del módulo (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Título del módulo
   */
  @Column({ type: 'text' })
  title!: string;

  /**
   * Subtítulo del módulo
   */
  @Column({ type: 'text', nullable: true })
  subtitle?: string;

  /**
   * Descripción detallada del módulo
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Resumen breve del módulo
   */
  @Column({ type: 'text', nullable: true })
  summary?: string;

  /**
   * Contenido estructurado del módulo (JSONB)
   * Estructura: {marie_curie_story, reading_materials, historical_context, scientific_concepts, multimedia_resources}
   */
  @Column({
    type: 'jsonb',
    default: {
      marie_curie_story: {},
      reading_materials: [],
      historical_context: {},
      scientific_concepts: {},
      multimedia_resources: [],
    },
  })
  content!: Record<string, any>;

  /**
   * Índice de orden para la secuencia de módulos
   */
  @Column({ type: 'integer' })
  order_index!: number;

  /**
   * Código único del módulo (ej. MC-001)
   */
  @Column({ type: 'text', nullable: true })
  module_code?: string;

  // =====================================================
  // DIFFICULTY & CONTENT
  // =====================================================

  /**
   * Nivel de dificultad del módulo
   *
   * @see DDL: educational_content.modules.difficulty_level (educational_content.difficulty_level ENUM)
   * @see Enum: DifficultyLevelEnum
   * @version 1.0 (2025-11-08) - Migrado de public a educational_content schema
   *
   * ESCALA: very_easy → easy → beginner → medium → intermediate → hard → advanced → very_hard
   * ENUM: beginner, intermediate, advanced, very_easy, easy, medium, hard, very_hard
   */
  @Column({
    type: 'enum',
    enum: DifficultyLevelEnum,
    enumName: 'difficulty_level',
    default: DifficultyLevelEnum.BEGINNER,
  })
  difficulty_level!: DifficultyLevelEnum;

  /**
   * Niveles de grado a los que va dirigido
   * Array: ['6', '7', '8', ...]
   */
  @Column({ type: 'text', array: true, default: ['6', '7', '8'] })
  grade_levels!: string[];

  /**
   * Materias relacionadas
   * Array: ['Literatura', 'Ciencias', ...]
   */
  @Column({ type: 'text', array: true, default: ['Literatura', 'Ciencias'] })
  subjects!: string[];

  // =====================================================
  // TIMING & DURATION
  // =====================================================

  /**
   * Duración estimada en minutos
   */
  @Column({ type: 'integer', default: 120 })
  estimated_duration_minutes!: number;

  /**
   * Número estimado de sesiones para completar el módulo
   */
  @Column({ type: 'integer', default: 4 })
  estimated_sessions!: number;

  // =====================================================
  // LEARNING OBJECTIVES & COMPETENCIES
  // =====================================================

  /**
   * Objetivos de aprendizaje del módulo
   * Array de textos describiendo lo que el estudiante aprenderá
   */
  @Column({ type: 'text', array: true, nullable: true })
  learning_objectives?: string[];

  /**
   * Competencias a desarrollar
   */
  @Column({ type: 'text', array: true, nullable: true })
  competencies?: string[];

  /**
   * Habilidades desarrolladas en el módulo
   */
  @Column({ type: 'text', array: true, nullable: true })
  skills_developed?: string[];

  // =====================================================
  // PREREQUISITES
  // =====================================================

  /**
   * Array de UUIDs de módulos prerequisitos (auto-referencia débil sin FK)
   * Módulos que deben completarse antes de este
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  prerequisites?: string[];

  /**
   * Habilidades prerequisitas (texto)
   */
  @Column({ type: 'text', array: true, nullable: true })
  prerequisite_skills?: string[];

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  /**
   * Rango maya requerido para desbloquear el módulo
   * ENUM: Ajaw, Nacom, Ah K'in, Halach Uinic, K'uk'ulkan
   * @version 1.1 (2025-11-08) - Cambiado a type-safe ENUM
   */
  @Column({ type: 'enum', enum: MayaRank, nullable: true })
  maya_rank_required?: MayaRank;

  /**
   * Rango maya otorgado al completar el módulo
   * ENUM: Ajaw, Nacom, Ah K'in, Halach Uinic, K'uk'ulkan
   * @version 1.1 (2025-11-08) - Cambiado a type-safe ENUM
   */
  @Column({ type: 'enum', enum: MayaRank, nullable: true })
  maya_rank_granted?: MayaRank;

  /**
   * Puntos de experiencia (XP) otorgados al completar
   */
  @Column({ type: 'integer', default: 100 })
  xp_reward!: number;

  /**
   * Monedas ML otorgadas al completar
   */
  @Column({ type: 'integer', default: 50 })
  ml_coins_reward!: number;

  // =====================================================
  // STATUS & PUBLICATION
  // =====================================================

  /**
   * Estado del módulo
   * ENUM: draft, published, archived, under_review
   */
  @Column({
    type: 'enum',
    enum: ContentStatusEnum,
    enumName: 'educational_content.module_status',
    default: ContentStatusEnum.DRAFT,
  })
  status!: ContentStatusEnum;

  /**
   * Si el módulo está publicado y visible para estudiantes
   */
  @Column({ type: 'boolean', default: false })
  is_published!: boolean;

  /**
   * Si el módulo está destacado en la página principal
   */
  @Column({ type: 'boolean', default: false })
  is_featured!: boolean;

  /**
   * Si el módulo es gratuito (sin restricción de suscripción)
   */
  @Column({ type: 'boolean', default: true })
  is_free!: boolean;

  /**
   * Si es un módulo de demostración
   */
  @Column({ type: 'boolean', default: false })
  is_demo_module!: boolean;

  /**
   * Fecha de publicación
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  published_at?: Date;

  /**
   * Fecha de archivado
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  archived_at?: Date;

  // =====================================================
  // VERSIONING & REVISION
  // =====================================================

  /**
   * Número de versión del módulo
   */
  @Column({ type: 'integer', default: 1 })
  version!: number;

  /**
   * Notas sobre cambios en la versión
   */
  @Column({ type: 'text', nullable: true })
  version_notes?: string;

  /**
   * ID del usuario que creó el módulo
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * ID del usuario que revisó el módulo
   */
  @Column({ type: 'uuid', nullable: true })
  reviewed_by?: string;

  /**
   * ID del usuario que aprobó el módulo
   */
  @Column({ type: 'uuid', nullable: true })
  approved_by?: string;

  // =====================================================
  // METADATA & INDEXING
  // =====================================================

  /**
   * Palabras clave para búsqueda
   */
  @Column({ type: 'text', array: true, nullable: true })
  keywords?: string[];

  /**
   * Etiquetas para categorización
   */
  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  /**
   * URL de la imagen en miniatura
   */
  @Column({ type: 'text', nullable: true })
  thumbnail_url?: string;

  /**
   * URL de la imagen de portada
   */
  @Column({ type: 'text', nullable: true })
  cover_image_url?: string;

  /**
   * Configuraciones del módulo (JSONB)
   */
  @Column({ type: 'jsonb', default: {} })
  settings!: Record<string, any>;

  /**
   * Metadatos adicionales (JSONB)
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  /**
   * Total de ejercicios en el módulo (campo desnormalizado para queries rápidas)
   */
  @Column({ type: 'integer', default: 0 })
  total_exercises!: number;
}
