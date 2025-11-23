import { Expose } from 'class-transformer';
import {
  MediaTypeEnum,
  ProcessingStatusEnum,
} from '@shared/constants/enums.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * MediaFileResponseDto
 *
 * @description DTO de respuesta con información completa del archivo multimedia.
 */
export class MediaFileResponseDto {
  @ApiProperty({ description: 'ID del archivo' })
  @Expose()
  id!: string;

  @ApiPropertyOptional({ description: 'ID del tenant' })
  @Expose()
  tenant_id?: string;

  // =====================================================
  // FILE IDENTIFICATION
  // =====================================================

  @ApiProperty({ description: 'Nombre del archivo en el sistema' })
  @Expose()
  filename!: string;

  @ApiProperty({ description: 'Nombre original del archivo' })
  @Expose()
  original_filename!: string;

  @ApiPropertyOptional({ description: 'Extensión del archivo' })
  @Expose()
  file_extension?: string;

  @ApiPropertyOptional({ description: 'Tipo MIME' })
  @Expose()
  mime_type?: string;

  @ApiPropertyOptional({ description: 'Tamaño en bytes' })
  @Expose()
  file_size_bytes?: number;

  // =====================================================
  // FILE TYPE & CATEGORIZATION
  // =====================================================

  @ApiProperty({ description: 'Tipo de medio' })
  @Expose()
  media_type!: MediaTypeEnum;

  @ApiPropertyOptional({ description: 'Categoría del archivo' })
  @Expose()
  category?: string;

  @ApiPropertyOptional({ description: 'Subcategoría' })
  @Expose()
  subcategory?: string;

  // =====================================================
  // STORAGE & URLS
  // =====================================================

  @ApiProperty({ description: 'Ruta de almacenamiento' })
  @Expose()
  storage_path!: string;

  @ApiPropertyOptional({ description: 'URL pública' })
  @Expose()
  public_url?: string;

  @ApiPropertyOptional({ description: 'URL del CDN' })
  @Expose()
  cdn_url?: string;

  @ApiPropertyOptional({ description: 'URL de thumbnail' })
  @Expose()
  thumbnail_url?: string;

  // =====================================================
  // MEDIA PROPERTIES
  // =====================================================

  @ApiPropertyOptional({ description: 'Ancho en píxeles' })
  @Expose()
  width?: number;

  @ApiPropertyOptional({ description: 'Alto en píxeles' })
  @Expose()
  height?: number;

  @ApiPropertyOptional({ description: 'Duración en segundos' })
  @Expose()
  duration_seconds?: number;

  @ApiPropertyOptional({ description: 'Bitrate' })
  @Expose()
  bitrate?: number;

  @ApiPropertyOptional({ description: 'Resolución' })
  @Expose()
  resolution?: string;

  @ApiPropertyOptional({ description: 'Perfil de color' })
  @Expose()
  color_profile?: string;

  // =====================================================
  // DESCRIPTIVE METADATA
  // =====================================================

  @ApiPropertyOptional({ description: 'Texto alternativo' })
  @Expose()
  alt_text?: string;

  @ApiPropertyOptional({ description: 'Leyenda' })
  @Expose()
  caption?: string;

  @ApiPropertyOptional({ description: 'Descripción' })
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: 'Copyright' })
  @Expose()
  copyright_info?: string;

  @ApiPropertyOptional({ description: 'Licencia' })
  @Expose()
  license?: string;

  @ApiPropertyOptional({ description: 'Atribución' })
  @Expose()
  attribution?: string;

  // =====================================================
  // PROCESSING STATUS
  // =====================================================

  @ApiProperty({ description: 'Estado de procesamiento' })
  @Expose()
  processing_status!: ProcessingStatusEnum;

  @ApiProperty({ description: 'Información de procesamiento' })
  @Expose()
  processing_info!: Record<string, any>;

  // =====================================================
  // SEARCH & ORGANIZATION
  // =====================================================

  @ApiPropertyOptional({ description: 'Etiquetas' })
  @Expose()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Palabras clave' })
  @Expose()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Ruta de carpeta lógica' })
  @Expose()
  folder_path?: string;

  // =====================================================
  // USAGE STATISTICS
  // =====================================================

  @ApiProperty({ description: 'Contador de usos' })
  @Expose()
  usage_count!: number;

  @ApiProperty({ description: 'Contador de descargas' })
  @Expose()
  download_count!: number;

  @ApiProperty({ description: 'Contador de visualizaciones' })
  @Expose()
  view_count!: number;

  // =====================================================
  // STATUS FLAGS
  // =====================================================

  @ApiProperty({ description: 'Archivo público' })
  @Expose()
  is_public!: boolean;

  @ApiProperty({ description: 'Archivo activo' })
  @Expose()
  is_active!: boolean;

  @ApiProperty({ description: 'Archivo optimizado' })
  @Expose()
  is_optimized!: boolean;

  // =====================================================
  // UPLOAD INFORMATION
  // =====================================================

  @ApiPropertyOptional({ description: 'ID del uploader' })
  @Expose()
  uploaded_by?: string;

  @ApiPropertyOptional({ description: 'ID de sesión de carga' })
  @Expose()
  upload_session_id?: string;

  // =====================================================
  // TECHNICAL METADATA
  // =====================================================

  @ApiProperty({ description: 'Datos EXIF' })
  @Expose()
  exif_data!: Record<string, any>;

  @ApiProperty({ description: 'Metadatos adicionales' })
  @Expose()
  metadata!: Record<string, any>;

  // =====================================================
  // AUDIT TIMESTAMPS
  // =====================================================

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updated_at!: Date;
}
