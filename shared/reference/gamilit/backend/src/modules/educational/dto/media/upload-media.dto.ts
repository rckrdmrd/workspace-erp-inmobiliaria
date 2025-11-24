import {
  IsUUID,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsObject,
  IsArray,
  Min,
} from 'class-validator';
import { MediaTypeEnum, ProcessingStatusEnum } from '@shared/constants/enums.constants';

/**
 * UploadMediaDto
 *
 * @description DTO para subir un nuevo recurso multimedia (media resource).
 *              Incluye información del archivo, tipo, metadatos y referencias de uso.
 */
export class UploadMediaDto {
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
   * Título del recurso multimedia (REQUERIDO)
   */
  @IsString()
  title!: string;

  /**
   * Descripción del recurso
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Texto alternativo para accesibilidad
   */
  @IsOptional()
  @IsString()
  alt_text?: string;

  // =====================================================
  // MEDIA TYPE & FORMAT
  // =====================================================

  /**
   * Tipo de contenido (REQUERIDO)
   * ENUM: image, video, audio, document, interactive, animation
   */
  @IsEnum(MediaTypeEnum)
  media_type!: MediaTypeEnum;

  /**
   * Formato del archivo (jpg, png, mp4, pdf, etc.)
   */
  @IsOptional()
  @IsString()
  file_format?: string;

  /**
   * Tamaño del archivo en bytes
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  file_size_bytes?: number;

  // =====================================================
  // STORAGE & DISTRIBUTION
  // =====================================================

  /**
   * URL del archivo original (REQUERIDO)
   */
  @IsString()
  url!: string;

  /**
   * URL de la miniatura/preview
   */
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  /**
   * URL de CDN para distribución
   */
  @IsOptional()
  @IsString()
  cdn_url?: string;

  // =====================================================
  // MEDIA PROPERTIES
  // =====================================================

  /**
   * Ancho en píxeles
   */
  @IsOptional()
  @IsNumber()
  width?: number;

  /**
   * Alto en píxeles
   */
  @IsOptional()
  @IsNumber()
  height?: number;

  /**
   * Duración en segundos
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration_seconds?: number;

  /**
   * Resolución (720p, 1080p, 4k, etc.)
   */
  @IsOptional()
  @IsString()
  resolution?: string;

  // =====================================================
  // CATEGORIZATION & TAGGING
  // =====================================================

  /**
   * Categoría del recurso
   */
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * Etiquetas para búsqueda
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /**
   * Palabras clave para SEO
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  // =====================================================
  // PROCESSING & STATUS
  // =====================================================

  /**
   * Estado de procesamiento
   * ENUM: uploading, processing, ready, error, optimizing
   */
  @IsOptional()
  @IsEnum(ProcessingStatusEnum)
  processing_status?: ProcessingStatusEnum;

  // =====================================================
  // VISIBILITY & USAGE
  // =====================================================

  /**
   * Si el recurso es público
   */
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  /**
   * Si el recurso está activo
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Array de UUIDs de módulos que usan este recurso
   */
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  used_in_modules?: string[];

  /**
   * Array de UUIDs de ejercicios que usan este recurso
   */
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  used_in_exercises?: string[];

  // =====================================================
  // LICENSING & ATTRIBUTION
  // =====================================================

  /**
   * ID del usuario que sube el recurso
   */
  @IsOptional()
  @IsUUID()
  created_by?: string;

  /**
   * Información de copyright
   */
  @IsOptional()
  @IsString()
  copyright_info?: string;

  /**
   * Licencia del recurso
   */
  @IsOptional()
  @IsString()
  license?: string;

  /**
   * Atribución requerida
   */
  @IsOptional()
  @IsString()
  attribution?: string;

  // =====================================================
  // METADATA
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
