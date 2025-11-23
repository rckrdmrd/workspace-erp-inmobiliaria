import { Expose } from 'class-transformer';
import { MediaTypeEnum, ProcessingStatusEnum } from '@shared/constants/enums.constants';

/**
 * MediaResponseDto
 *
 * @description DTO de respuesta con información completa de un recurso multimedia.
 */
export class MediaResponseDto {
  /**
   * Identificador único del recurso
   */
  @Expose()
  id!: string;

  /**
   * ID del tenant
   */
  @Expose()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Título del recurso
   */
  @Expose()
  title!: string;

  /**
   * Descripción del recurso
   */
  @Expose()
  description?: string;

  /**
   * Texto alternativo para accesibilidad
   */
  @Expose()
  alt_text?: string;

  // =====================================================
  // MEDIA TYPE & FORMAT
  // =====================================================

  /**
   * Tipo de contenido multimedia
   * ENUM: image, video, audio, document, interactive, animation
   */
  @Expose()
  media_type!: MediaTypeEnum;

  /**
   * Formato del archivo
   */
  @Expose()
  file_format?: string;

  /**
   * Tamaño del archivo en bytes
   */
  @Expose()
  file_size_bytes?: number;

  // =====================================================
  // STORAGE & DISTRIBUTION
  // =====================================================

  /**
   * URL del archivo
   */
  @Expose()
  url!: string;

  /**
   * URL de la miniatura
   */
  @Expose()
  thumbnail_url?: string;

  /**
   * URL de CDN
   */
  @Expose()
  cdn_url?: string;

  // =====================================================
  // MEDIA PROPERTIES
  // =====================================================

  /**
   * Ancho en píxeles
   */
  @Expose()
  width?: number;

  /**
   * Alto en píxeles
   */
  @Expose()
  height?: number;

  /**
   * Duración en segundos
   */
  @Expose()
  duration_seconds?: number;

  /**
   * Resolución del archivo
   */
  @Expose()
  resolution?: string;

  // =====================================================
  // CATEGORIZATION & TAGGING
  // =====================================================

  /**
   * Categoría del recurso
   */
  @Expose()
  category?: string;

  /**
   * Etiquetas de búsqueda
   */
  @Expose()
  tags?: string[];

  /**
   * Palabras clave
   */
  @Expose()
  keywords?: string[];

  // =====================================================
  // PROCESSING & STATUS
  // =====================================================

  /**
   * Estado de procesamiento
   * ENUM: uploading, processing, ready, error, optimizing
   */
  @Expose()
  processing_status!: ProcessingStatusEnum;

  // =====================================================
  // VISIBILITY & USAGE
  // =====================================================

  /**
   * Si el recurso es público
   */
  @Expose()
  is_public!: boolean;

  /**
   * Si el recurso está activo
   */
  @Expose()
  is_active!: boolean;

  /**
   * Módulos que usan este recurso (referencias débiles)
   */
  @Expose()
  used_in_modules?: string[];

  /**
   * Ejercicios que usan este recurso (referencias débiles)
   */
  @Expose()
  used_in_exercises?: string[];

  // =====================================================
  // LICENSING & ATTRIBUTION
  // =====================================================

  /**
   * Usuario que creó el recurso
   */
  @Expose()
  created_by?: string;

  /**
   * Información de copyright
   */
  @Expose()
  copyright_info?: string;

  /**
   * Licencia del recurso
   */
  @Expose()
  license?: string;

  /**
   * Atribución requerida
   */
  @Expose()
  attribution?: string;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales
   */
  @Expose()
  metadata!: Record<string, any>;

  /**
   * Fecha de creación
   */
  @Expose()
  created_at!: Date;

  /**
   * Fecha de última actualización
   */
  @Expose()
  updated_at!: Date;
}
