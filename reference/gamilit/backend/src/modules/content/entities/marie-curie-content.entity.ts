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
} from '@shared/constants/enums.constants';

/**
 * MarieCurieContent Entity (content_management.marie_curie_content)
 *
 * @description Contenido curado sobre Marie Curie - biografía, descubrimientos, legado.
 *              Contenido educativo especializado sobre la vida y obra de Marie Curie,
 *              organizado por categorías y niveles de lectura.
 * @schema content_management
 * @table marie_curie_content
 *
 * IMPORTANTE:
 * - Contenido curado específico sobre Marie Curie
 * - Incluye multimedia (imágenes, videos, audio, documentos)
 * - Workflow de publicación: draft → published
 * - Full-text search en español habilitado
 *
 * @see DDL: apps/database/ddl/schemas/content_management/tables/02-marie_curie_content.sql
 */
@Entity({ schema: DB_SCHEMAS.CONTENT, name: DB_TABLES.CONTENT.MARIE_CURIE_CONTENT })
@Index('idx_marie_content_tenant', ['tenant_id'])
@Index('idx_marie_content_category', ['category'])
@Index('idx_marie_content_status', ['status'])
@Index('idx_marie_content_featured', ['is_featured'], { where: 'is_featured = true' })
@Index('idx_marie_content_tags', ['search_tags'])
export class MarieCurieContent {
  /**
   * Identificador único del contenido (UUID)
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
   * Título del contenido
   */
  @Column({ type: 'text' })
  title!: string;

  /**
   * Subtítulo del contenido
   */
  @Column({ type: 'text', nullable: true })
  subtitle?: string;

  /**
   * Descripción breve del contenido
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Categoría del contenido
   * CHECK: biography, discoveries, historical_context, scientific_method,
   *        radioactivity, nobel_prizes, women_in_science, modern_physics, legacy
   */
  @Column({ type: 'text', nullable: true })
  category?: string;

  // =====================================================
  // CONTENT STRUCTURE
  // =====================================================

  /**
   * Contenido estructurado en formato JSON
   * Incluye: introduction, main_content, key_points, timeline, quotes
   */
  @Column({
    type: 'jsonb',
    default: {
      quotes: [],
      timeline: [],
      key_points: [],
      introduction: '',
      main_content: '',
    },
  })
  content!: Record<string, any>;

  // =====================================================
  // EDUCATIONAL METADATA
  // =====================================================

  /**
   * Grados escolares objetivo (ej: ['6', '7', '8'])
   */
  @Column({ type: 'text', array: true, default: ['6', '7', '8'] })
  target_grade_levels!: string[];

  /**
   * Nivel de dificultad
   */
  @Column({
    type: 'enum',
    enum: DifficultyLevelEnum,
    default: DifficultyLevelEnum.BEGINNER,
  })
  difficulty_level!: DifficultyLevelEnum;

  /**
   * Nivel de lectura (ej: '6th grade', 'intermediate')
   */
  @Column({ type: 'text', nullable: true })
  reading_level?: string;

  /**
   * Objetivos de aprendizaje
   */
  @Column({ type: 'text', array: true, nullable: true })
  learning_objectives?: string[];

  /**
   * Conocimientos previos requeridos
   */
  @Column({ type: 'text', array: true, nullable: true })
  prerequisite_knowledge?: string[];

  /**
   * Vocabulario clave del contenido
   */
  @Column({ type: 'text', array: true, nullable: true })
  key_vocabulary?: string[];

  // =====================================================
  // MULTIMEDIA REFERENCES
  // =====================================================

  /**
   * IDs de imágenes asociadas (FK → media_files)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  images?: string[];

  /**
   * IDs de videos asociados (FK → media_files)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  videos?: string[];

  /**
   * IDs de archivos de audio asociados (FK → media_files)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  audio_files?: string[];

  /**
   * IDs de documentos asociados (FK → media_files)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  documents?: string[];

  // =====================================================
  // HISTORICAL & SCIENTIFIC CONTEXT
  // =====================================================

  /**
   * Período histórico del contenido
   */
  @Column({ type: 'text', nullable: true })
  historical_period?: string;

  /**
   * Campo científico relacionado
   */
  @Column({ type: 'text', nullable: true })
  scientific_field?: string;

  /**
   * Contexto cultural en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  cultural_context!: Record<string, any>;

  // =====================================================
  // PUBLICATION STATUS
  // =====================================================

  /**
   * Estado del contenido
   * ENUM: draft, published, archived, reviewing
   */
  @Column({
    type: 'enum',
    enum: ContentStatusEnum,
    default: ContentStatusEnum.DRAFT,
  })
  status!: ContentStatusEnum;

  /**
   * Si el contenido es destacado
   */
  @Column({ type: 'boolean', default: false })
  is_featured!: boolean;

  /**
   * Si el contenido es interactivo
   */
  @Column({ type: 'boolean', default: false })
  is_interactive!: boolean;

  // =====================================================
  // APPROVAL WORKFLOW
  // =====================================================

  /**
   * ID del usuario que creó el contenido (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * ID del usuario que revisó el contenido (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  reviewed_by?: string;

  /**
   * ID del usuario que aprobó el contenido (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  approved_by?: string;

  // =====================================================
  // SEARCH & DISCOVERY
  // =====================================================

  /**
   * Palabras clave para búsqueda
   */
  @Column({ type: 'text', array: true, nullable: true })
  keywords?: string[];

  /**
   * Etiquetas de búsqueda
   */
  @Column({ type: 'text', array: true, nullable: true })
  search_tags?: string[];

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

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
}
