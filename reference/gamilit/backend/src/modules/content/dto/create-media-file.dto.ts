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
} from 'class-validator';
import {
  MediaTypeEnum,
  ProcessingStatusEnum,
} from '@shared/constants/enums.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateMediaFileDto
 *
 * @description DTO para registrar un nuevo archivo multimedia en el sistema.
 */
export class CreateMediaFileDto {
  /**
   * ID del tenant (opcional)
   */
  @ApiPropertyOptional({ description: 'ID del tenant', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  // =====================================================
  // FILE IDENTIFICATION
  // =====================================================

  /**
   * Nombre del archivo en el sistema (REQUERIDO)
   */
  @ApiProperty({ description: 'Nombre del archivo en el sistema', example: 'file_1234567890.jpg' })
  @IsString()
  filename!: string;

  /**
   * Nombre original del archivo (REQUERIDO)
   */
  @ApiProperty({ description: 'Nombre original del archivo', example: 'marie_curie_portrait.jpg' })
  @IsString()
  original_filename!: string;

  /**
   * Extensión del archivo
   */
  @ApiPropertyOptional({ description: 'Extensión del archivo', example: 'jpg' })
  @IsOptional()
  @IsString()
  file_extension?: string;

  /**
   * Tipo MIME
   */
  @ApiPropertyOptional({ description: 'Tipo MIME', example: 'image/jpeg' })
  @IsOptional()
  @IsString()
  mime_type?: string;

  /**
   * Tamaño en bytes
   */
  @ApiPropertyOptional({ description: 'Tamaño del archivo en bytes', example: 2048000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  file_size_bytes?: number;

  // =====================================================
  // FILE TYPE & CATEGORIZATION
  // =====================================================

  /**
   * Tipo de medio (REQUERIDO)
   */
  @ApiProperty({ description: 'Tipo de medio', enum: MediaTypeEnum, example: MediaTypeEnum.IMAGE })
  @IsEnum(MediaTypeEnum)
  media_type!: MediaTypeEnum;

  /**
   * Categoría del archivo
   */
  @ApiPropertyOptional({ description: 'Categoría del archivo', example: 'biography' })
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * Subcategoría
   */
  @ApiPropertyOptional({ description: 'Subcategoría', example: 'portraits' })
  @IsOptional()
  @IsString()
  subcategory?: string;

  // =====================================================
  // STORAGE & URLS
  // =====================================================

  /**
   * Ruta de almacenamiento (REQUERIDO)
   */
  @ApiProperty({ description: 'Ruta de almacenamiento', example: '/uploads/images/2025/01/file_1234567890.jpg' })
  @IsString()
  storage_path!: string;

  /**
   * URL pública
   */
  @ApiPropertyOptional({ description: 'URL pública del archivo', example: 'https://storage.gamilit.com/uploads/images/2025/01/file_1234567890.jpg' })
  @IsOptional()
  @IsString()
  public_url?: string;

  /**
   * URL del CDN
   */
  @ApiPropertyOptional({ description: 'URL del CDN', example: 'https://cdn.gamilit.com/images/file_1234567890.jpg' })
  @IsOptional()
  @IsString()
  cdn_url?: string;

  /**
   * URL de thumbnail
   */
  @ApiPropertyOptional({ description: 'URL de thumbnail', example: 'https://cdn.gamilit.com/thumbnails/file_1234567890_thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  // =====================================================
  // MEDIA PROPERTIES
  // =====================================================

  /**
   * Ancho en píxeles
   */
  @ApiPropertyOptional({ description: 'Ancho en píxeles', example: 1920 })
  @IsOptional()
  @IsInt()
  @Min(0)
  width?: number;

  /**
   * Alto en píxeles
   */
  @ApiPropertyOptional({ description: 'Alto en píxeles', example: 1080 })
  @IsOptional()
  @IsInt()
  @Min(0)
  height?: number;

  /**
   * Duración en segundos
   */
  @ApiPropertyOptional({ description: 'Duración en segundos (videos/audio)', example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration_seconds?: number;

  /**
   * Bitrate
   */
  @ApiPropertyOptional({ description: 'Bitrate del archivo', example: 128000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bitrate?: number;

  /**
   * Resolución
   */
  @ApiPropertyOptional({ description: 'Resolución del video', example: '1920x1080' })
  @IsOptional()
  @IsString()
  resolution?: string;

  /**
   * Perfil de color
   */
  @ApiPropertyOptional({ description: 'Perfil de color', example: 'sRGB' })
  @IsOptional()
  @IsString()
  color_profile?: string;

  // =====================================================
  // DESCRIPTIVE METADATA
  // =====================================================

  /**
   * Texto alternativo
   */
  @ApiPropertyOptional({ description: 'Texto alternativo (alt text)', example: 'Retrato de Marie Curie en su laboratorio' })
  @IsOptional()
  @IsString()
  alt_text?: string;

  /**
   * Leyenda/caption
   */
  @ApiPropertyOptional({ description: 'Leyenda del archivo', example: 'Marie Curie trabajando en su laboratorio, 1920' })
  @IsOptional()
  @IsString()
  caption?: string;

  /**
   * Descripción
   */
  @ApiPropertyOptional({ description: 'Descripción detallada', example: 'Fotografía histórica de Marie Curie...' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Información de copyright
   */
  @ApiPropertyOptional({ description: 'Información de copyright', example: '© 1920 Institut Curie' })
  @IsOptional()
  @IsString()
  copyright_info?: string;

  /**
   * Licencia
   */
  @ApiPropertyOptional({ description: 'Licencia del archivo', example: 'CC BY-SA 4.0' })
  @IsOptional()
  @IsString()
  license?: string;

  /**
   * Atribución
   */
  @ApiPropertyOptional({ description: 'Atribución (créditos)', example: 'Institut Curie Archives' })
  @IsOptional()
  @IsString()
  attribution?: string;

  // =====================================================
  // PROCESSING STATUS
  // =====================================================

  /**
   * Estado de procesamiento
   */
  @ApiPropertyOptional({ description: 'Estado de procesamiento', enum: ProcessingStatusEnum, default: ProcessingStatusEnum.READY })
  @IsOptional()
  @IsEnum(ProcessingStatusEnum)
  processing_status?: ProcessingStatusEnum;

  /**
   * Información de procesamiento
   */
  @ApiPropertyOptional({ description: 'Información de procesamiento JSON', example: {} })
  @IsOptional()
  @IsObject()
  processing_info?: Record<string, any>;

  // =====================================================
  // SEARCH & ORGANIZATION
  // =====================================================

  /**
   * Etiquetas/tags
   */
  @ApiPropertyOptional({ description: 'Etiquetas del archivo', example: ['marie-curie', 'scientist', 'laboratory'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /**
   * Palabras clave
   */
  @ApiPropertyOptional({ description: 'Palabras clave', example: ['Marie Curie', 'radioactivity', 'physics'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  /**
   * Ruta de carpeta lógica
   */
  @ApiPropertyOptional({ description: 'Ruta de carpeta lógica', example: '/content/marie-curie/biography' })
  @IsOptional()
  @IsString()
  folder_path?: string;

  // =====================================================
  // USAGE STATISTICS
  // =====================================================

  /**
   * Contador de usos
   */
  @ApiPropertyOptional({ description: 'Contador de usos', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  usage_count?: number;

  /**
   * Contador de descargas
   */
  @ApiPropertyOptional({ description: 'Contador de descargas', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  download_count?: number;

  /**
   * Contador de visualizaciones
   */
  @ApiPropertyOptional({ description: 'Contador de visualizaciones', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  view_count?: number;

  // =====================================================
  // STATUS FLAGS
  // =====================================================

  /**
   * Si es público
   */
  @ApiPropertyOptional({ description: 'Archivo público', default: false })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  /**
   * Si está activo
   */
  @ApiPropertyOptional({ description: 'Archivo activo', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Si está optimizado
   */
  @ApiPropertyOptional({ description: 'Archivo optimizado', default: false })
  @IsOptional()
  @IsBoolean()
  is_optimized?: boolean;

  // =====================================================
  // UPLOAD INFORMATION
  // =====================================================

  /**
   * ID del uploader
   */
  @ApiPropertyOptional({ description: 'ID del usuario que subió el archivo' })
  @IsOptional()
  @IsUUID()
  uploaded_by?: string;

  /**
   * ID de sesión de carga
   */
  @ApiPropertyOptional({ description: 'ID de sesión de carga (multipart)', example: 'upload_session_abc123' })
  @IsOptional()
  @IsString()
  upload_session_id?: string;

  // =====================================================
  // TECHNICAL METADATA
  // =====================================================

  /**
   * Datos EXIF
   */
  @ApiPropertyOptional({ description: 'Datos EXIF JSON', example: {} })
  @IsOptional()
  @IsObject()
  exif_data?: Record<string, any>;

  /**
   * Metadatos adicionales
   */
  @ApiPropertyOptional({ description: 'Metadatos adicionales', example: {} })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
