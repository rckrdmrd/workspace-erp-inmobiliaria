import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { MediaTypeEnum, ProcessingStatusEnum } from '@shared/constants/enums.constants';

/**
 * MediaResource Entity (educational_content.media_resources)
 *
 * @description Recursos multimedia para contenido educativo.
 *              Soporta imágenes, videos, audio, documentos, contenido interactivo y animaciones.
 *              Integración con S3/CDN para almacenamiento y distribución de contenido.
 * @schema educational_content
 * @table media_resources
 *
 * IMPORTANTE:
 * - Tipos soportados: image, video, audio, document, interactive, animation
 * - Estados de procesamiento: uploading, processing, ready, error, optimizing
 * - URLs pueden ser locales o de CDN (cdn_url)
 * - used_in_modules[] y used_in_exercises[] son referencias débiles sin FK
 * - metadata JSONB para información adicional (resolución, codec, etc.)
 *
 * @see DDL: apps/database/ddl/schemas/educational_content/tables/04-media_resources.sql
 */
@Entity({ schema: DB_SCHEMAS.EDUCATIONAL, name: DB_TABLES.EDUCATIONAL.MEDIA_RESOURCES })
@Index('idx_media_type', ['media_type'])
@Index('idx_media_category', ['category'])
@Index('idx_media_tenant_id', ['tenant_id'])
@Index('idx_media_created_by', ['created_by'])
@Index('idx_media_active', ['is_active'], { where: 'is_active = true' })
@Index('idx_media_modules', ['used_in_modules'])
@Index('idx_media_exercises', ['used_in_exercises'])
export class MediaResource {
  /**
   * Identificador único del recurso multimedia (UUID)
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
   * Título o nombre del recurso multimedia
   */
  @Column({ type: 'text' })
  title!: string;

  /**
   * Descripción detallada del recurso
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Texto alternativo para accesibilidad (alt text)
   */
  @Column({ type: 'text', nullable: true })
  alt_text?: string;

  // =====================================================
  // MEDIA TYPE & FORMAT
  // =====================================================

  /**
   * Tipo de contenido multimedia
   * ENUM: image, video, audio, document, interactive, animation
   */
  @Column({ type: 'enum', enum: MediaTypeEnum })
  media_type!: MediaTypeEnum;

  /**
   * Formato del archivo (jpg, png, mp4, pdf, etc.)
   */
  @Column({ type: 'text', nullable: true })
  file_format?: string;

  /**
   * Tamaño del archivo en bytes
   */
  @Column({ type: 'bigint', nullable: true })
  file_size_bytes?: number;

  // =====================================================
  // STORAGE & DISTRIBUTION
  // =====================================================

  /**
   * URL del archivo original o del servidor local
   */
  @Column({ type: 'text' })
  url!: string;

  /**
   * URL de la miniatura/preview
   */
  @Column({ type: 'text', nullable: true })
  thumbnail_url?: string;

  /**
   * URL de CDN para distribución optimizada
   */
  @Column({ type: 'text', nullable: true })
  cdn_url?: string;

  // =====================================================
  // MEDIA PROPERTIES
  // =====================================================

  /**
   * Ancho en píxeles (para imágenes y videos)
   */
  @Column({ type: 'integer', nullable: true })
  width?: number;

  /**
   * Alto en píxeles (para imágenes y videos)
   */
  @Column({ type: 'integer', nullable: true })
  height?: number;

  /**
   * Duración en segundos (para audio y video)
   */
  @Column({ type: 'integer', nullable: true })
  duration_seconds?: number;

  /**
   * Resolución (720p, 1080p, 4k, etc.)
   */
  @Column({ type: 'text', nullable: true })
  resolution?: string;

  // =====================================================
  // CATEGORIZATION & TAGGING
  // =====================================================

  /**
   * Categoría del recurso (ej: "Módulo 1", "Lectura Inicial", etc.)
   */
  @Column({ type: 'text', nullable: true })
  category?: string;

  /**
   * Etiquetas para búsqueda y clasificación
   */
  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  /**
   * Palabras clave para SEO y búsqueda
   */
  @Column({ type: 'text', array: true, nullable: true })
  keywords?: string[];

  // =====================================================
  // PROCESSING & STATUS
  // =====================================================

  /**
   * Estado de procesamiento del archivo
   * ENUM: uploading, processing, ready, error, optimizing
   */
  @Column({ type: 'enum', enum: ProcessingStatusEnum, default: ProcessingStatusEnum.READY })
  processing_status!: ProcessingStatusEnum;

  // =====================================================
  // VISIBILITY & USAGE
  // =====================================================

  /**
   * Si el recurso es público (visible para estudiantes)
   */
  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  /**
   * Si el recurso está activo y disponible
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Array de UUIDs de módulos que usan este recurso (referencia débil, sin FK)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  used_in_modules?: string[];

  /**
   * Array de UUIDs de ejercicios que usan este recurso (referencia débil, sin FK)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  used_in_exercises?: string[];

  // =====================================================
  // LICENSING & ATTRIBUTION
  // =====================================================

  /**
   * ID del usuario que subió el recurso
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * Información de copyright
   */
  @Column({ type: 'text', nullable: true })
  copyright_info?: string;

  /**
   * Licencia del recurso (CC-BY, CC-BY-SA, etc.)
   */
  @Column({ type: 'text', nullable: true })
  license?: string;

  /**
   * Atribución requerida para el recurso
   */
  @Column({ type: 'text', nullable: true })
  attribution?: string;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   * Puede incluir información técnica, codec, bitrate, etc.
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
