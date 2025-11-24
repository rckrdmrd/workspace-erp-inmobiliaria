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
  MediaTypeEnum,
  ProcessingStatusEnum,
} from '@shared/constants/enums.constants';

/**
 * MediaFile Entity (content_management.media_files)
 *
 * @description Archivos multimedia - imágenes, videos, audio, documentos.
 *              Sistema completo de gestión de assets multimedia con soporte para
 *              procesamiento, optimización, CDN, metadata EXIF y estadísticas de uso.
 * @schema content_management
 * @table media_files
 *
 * IMPORTANTE:
 * - Gestión centralizada de todos los archivos multimedia
 * - Workflow de procesamiento: uploading → processing → ready/error
 * - Soporte para CDN y URLs públicas
 * - Tracking de uso, descargas y visualizaciones
 * - Metadata EXIF para imágenes y videos
 *
 * @see DDL: apps/database/ddl/schemas/content_management/tables/03-media_files.sql
 */
@Entity({ schema: DB_SCHEMAS.CONTENT, name: DB_TABLES.CONTENT.MEDIA_FILES })
@Index('idx_media_files_tenant', ['tenant_id'])
@Index('idx_media_files_type', ['media_type'])
@Index('idx_media_files_category', ['category'])
@Index('idx_media_files_uploaded_by', ['uploaded_by'])
@Index('idx_media_files_active', ['is_active'], { where: 'is_active = true' })
@Index('idx_media_files_tags', ['tags'])
export class MediaFile {
  /**
   * Identificador único del archivo (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  // =====================================================
  // FILE IDENTIFICATION
  // =====================================================

  /**
   * Nombre del archivo en el sistema (único)
   */
  @Column({ type: 'text' })
  filename!: string;

  /**
   * Nombre original del archivo subido
   */
  @Column({ type: 'text' })
  original_filename!: string;

  /**
   * Extensión del archivo (ej: 'jpg', 'mp4', 'pdf')
   */
  @Column({ type: 'text', nullable: true })
  file_extension?: string;

  /**
   * Tipo MIME del archivo (ej: 'image/jpeg', 'video/mp4')
   */
  @Column({ type: 'text', nullable: true })
  mime_type?: string;

  /**
   * Tamaño del archivo en bytes
   */
  @Column({ type: 'bigint', nullable: true })
  file_size_bytes?: number;

  // =====================================================
  // FILE TYPE & CATEGORIZATION
  // =====================================================

  /**
   * Tipo de medio
   * ENUM: image, video, audio, document, interactive, animation
   */
  @Column({ type: 'enum', enum: MediaTypeEnum })
  media_type!: MediaTypeEnum;

  /**
   * Categoría del archivo (ej: 'exercise', 'profile', 'achievement')
   */
  @Column({ type: 'text', nullable: true })
  category?: string;

  /**
   * Subcategoría del archivo
   */
  @Column({ type: 'text', nullable: true })
  subcategory?: string;

  // =====================================================
  // STORAGE & URLS
  // =====================================================

  /**
   * Ruta de almacenamiento del archivo
   */
  @Column({ type: 'text' })
  storage_path!: string;

  /**
   * URL pública del archivo
   */
  @Column({ type: 'text', nullable: true })
  public_url?: string;

  /**
   * URL del archivo en CDN
   */
  @Column({ type: 'text', nullable: true })
  cdn_url?: string;

  /**
   * URL de la miniatura/thumbnail
   */
  @Column({ type: 'text', nullable: true })
  thumbnail_url?: string;

  // =====================================================
  // MEDIA PROPERTIES (Images/Videos)
  // =====================================================

  /**
   * Ancho en píxeles (imágenes/videos)
   */
  @Column({ type: 'integer', nullable: true })
  width?: number;

  /**
   * Alto en píxeles (imágenes/videos)
   */
  @Column({ type: 'integer', nullable: true })
  height?: number;

  /**
   * Duración en segundos (videos/audio)
   */
  @Column({ type: 'integer', nullable: true })
  duration_seconds?: number;

  /**
   * Bitrate del archivo (videos/audio)
   */
  @Column({ type: 'integer', nullable: true })
  bitrate?: number;

  /**
   * Resolución del video (ej: '1920x1080', '4K')
   */
  @Column({ type: 'text', nullable: true })
  resolution?: string;

  /**
   * Perfil de color (imágenes)
   */
  @Column({ type: 'text', nullable: true })
  color_profile?: string;

  // =====================================================
  // DESCRIPTIVE METADATA
  // =====================================================

  /**
   * Texto alternativo para accesibilidad (alt text)
   */
  @Column({ type: 'text', nullable: true })
  alt_text?: string;

  /**
   * Leyenda/caption del archivo
   */
  @Column({ type: 'text', nullable: true })
  caption?: string;

  /**
   * Descripción detallada del archivo
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Información de copyright
   */
  @Column({ type: 'text', nullable: true })
  copyright_info?: string;

  /**
   * Licencia del archivo
   */
  @Column({ type: 'text', nullable: true })
  license?: string;

  /**
   * Atribución (créditos)
   */
  @Column({ type: 'text', nullable: true })
  attribution?: string;

  // =====================================================
  // PROCESSING STATUS
  // =====================================================

  /**
   * Estado de procesamiento
   * ENUM: uploading, processing, ready, error, optimizing
   */
  @Column({
    type: 'enum',
    enum: ProcessingStatusEnum,
    default: ProcessingStatusEnum.READY,
  })
  processing_status!: ProcessingStatusEnum;

  /**
   * Información de procesamiento en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  processing_info!: Record<string, any>;

  // =====================================================
  // SEARCH & ORGANIZATION
  // =====================================================

  /**
   * Etiquetas/tags del archivo
   */
  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  /**
   * Palabras clave para búsqueda
   */
  @Column({ type: 'text', array: true, nullable: true })
  keywords?: string[];

  /**
   * Ruta de carpeta lógica (organización)
   */
  @Column({ type: 'text', nullable: true })
  folder_path?: string;

  // =====================================================
  // USAGE STATISTICS
  // =====================================================

  /**
   * Contador de veces que se ha usado el archivo
   */
  @Column({ type: 'integer', default: 0 })
  usage_count!: number;

  /**
   * Contador de descargas
   */
  @Column({ type: 'integer', default: 0 })
  download_count!: number;

  /**
   * Contador de visualizaciones
   */
  @Column({ type: 'integer', default: 0 })
  view_count!: number;

  // =====================================================
  // STATUS FLAGS
  // =====================================================

  /**
   * Si el archivo es público (acceso sin autenticación)
   */
  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  /**
   * Si el archivo está activo
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Si el archivo ha sido optimizado
   */
  @Column({ type: 'boolean', default: false })
  is_optimized!: boolean;

  // =====================================================
  // UPLOAD INFORMATION
  // =====================================================

  /**
   * ID del usuario que subió el archivo (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  uploaded_by?: string;

  /**
   * ID de sesión de carga (para uploads multipart)
   */
  @Column({ type: 'text', nullable: true })
  upload_session_id?: string;

  // =====================================================
  // TECHNICAL METADATA
  // =====================================================

  /**
   * Datos EXIF del archivo (imágenes)
   */
  @Column({ type: 'jsonb', default: {} })
  exif_data!: Record<string, any>;

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // =====================================================
  // AUDIT TIMESTAMPS
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
}
