import {
  IsUUID,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import {
  DifficultyLevelEnum,
  ContentStatusEnum,
} from '@shared/constants/enums.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateMarieCurieContentDto
 *
 * @description DTO para crear nuevo contenido educativo sobre Marie Curie.
 */
export class CreateMarieCurieContentDto {
  /**
   * ID del tenant (opcional)
   */
  @ApiPropertyOptional({ description: 'ID del tenant', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Título del contenido (REQUERIDO)
   */
  @ApiProperty({ description: 'Título del contenido', example: 'Marie Curie: Los primeros años' })
  @IsString()
  title!: string;

  /**
   * Subtítulo del contenido
   */
  @ApiPropertyOptional({ description: 'Subtítulo', example: 'De Polonia a París: Los inicios de una científica revolucionaria' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  /**
   * Descripción breve
   */
  @ApiPropertyOptional({ description: 'Descripción breve', example: 'Conoce los primeros años de Marie Curie y su camino hacia la ciencia' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Categoría: biography, discoveries, historical_context, scientific_method,
   * radioactivity, nobel_prizes, women_in_science, modern_physics, legacy
   */
  @ApiPropertyOptional({ description: 'Categoría del contenido', enum: ['biography', 'discoveries', 'historical_context', 'scientific_method', 'radioactivity', 'nobel_prizes', 'women_in_science', 'modern_physics', 'legacy'] })
  @IsOptional()
  @IsString()
  category?: string;

  // =====================================================
  // CONTENT STRUCTURE
  // =====================================================

  /**
   * Contenido estructurado (REQUERIDO)
   */
  @ApiProperty({ description: 'Contenido estructurado JSON', example: { introduction: 'Texto introductorio...', main_content: 'Contenido principal...', key_points: [], timeline: [], quotes: [] } })
  @IsObject()
  content!: Record<string, any>;

  // =====================================================
  // EDUCATIONAL METADATA
  // =====================================================

  /**
   * Grados escolares objetivo
   */
  @ApiPropertyOptional({ description: 'Grados escolares objetivo', example: ['6', '7', '8'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  target_grade_levels?: string[];

  /**
   * Nivel de dificultad
   */
  @ApiPropertyOptional({ description: 'Nivel de dificultad', enum: DifficultyLevelEnum, default: DifficultyLevelEnum.BEGINNER })
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Nivel de lectura
   */
  @ApiPropertyOptional({ description: 'Nivel de lectura', example: '6th grade' })
  @IsOptional()
  @IsString()
  reading_level?: string;

  /**
   * Objetivos de aprendizaje
   */
  @ApiPropertyOptional({ description: 'Objetivos de aprendizaje', example: ['Comprender el contexto histórico', 'Identificar contribuciones científicas'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learning_objectives?: string[];

  /**
   * Conocimientos previos
   */
  @ApiPropertyOptional({ description: 'Conocimientos previos requeridos', example: ['Conceptos básicos de química', 'Lectura de biografías'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisite_knowledge?: string[];

  /**
   * Vocabulario clave
   */
  @ApiPropertyOptional({ description: 'Vocabulario clave', example: ['radioactividad', 'premio Nobel', 'investigación científica'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  key_vocabulary?: string[];

  // =====================================================
  // MULTIMEDIA REFERENCES
  // =====================================================

  /**
   * IDs de imágenes
   */
  @ApiPropertyOptional({ description: 'IDs de imágenes asociadas', example: [] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  images?: string[];

  /**
   * IDs de videos
   */
  @ApiPropertyOptional({ description: 'IDs de videos asociados', example: [] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  videos?: string[];

  /**
   * IDs de archivos de audio
   */
  @ApiPropertyOptional({ description: 'IDs de archivos de audio', example: [] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  audio_files?: string[];

  /**
   * IDs de documentos
   */
  @ApiPropertyOptional({ description: 'IDs de documentos asociados', example: [] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  documents?: string[];

  // =====================================================
  // HISTORICAL & SCIENTIFIC CONTEXT
  // =====================================================

  /**
   * Período histórico
   */
  @ApiPropertyOptional({ description: 'Período histórico', example: '1867-1934' })
  @IsOptional()
  @IsString()
  historical_period?: string;

  /**
   * Campo científico
   */
  @ApiPropertyOptional({ description: 'Campo científico', example: 'Física y Química' })
  @IsOptional()
  @IsString()
  scientific_field?: string;

  /**
   * Contexto cultural
   */
  @ApiPropertyOptional({ description: 'Contexto cultural JSON', example: {} })
  @IsOptional()
  @IsObject()
  cultural_context?: Record<string, any>;

  // =====================================================
  // PUBLICATION STATUS
  // =====================================================

  /**
   * Estado del contenido
   */
  @ApiPropertyOptional({ description: 'Estado del contenido', enum: ContentStatusEnum, default: ContentStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(ContentStatusEnum)
  status?: ContentStatusEnum;

  /**
   * Si es contenido destacado
   */
  @ApiPropertyOptional({ description: 'Contenido destacado', default: false })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  /**
   * Si es contenido interactivo
   */
  @ApiPropertyOptional({ description: 'Contenido interactivo', default: false })
  @IsOptional()
  @IsBoolean()
  is_interactive?: boolean;

  // =====================================================
  // APPROVAL WORKFLOW
  // =====================================================

  /**
   * ID del creador
   */
  @ApiPropertyOptional({ description: 'ID del usuario creador' })
  @IsOptional()
  @IsUUID()
  created_by?: string;

  /**
   * ID del revisor
   */
  @ApiPropertyOptional({ description: 'ID del usuario revisor' })
  @IsOptional()
  @IsUUID()
  reviewed_by?: string;

  /**
   * ID del aprobador
   */
  @ApiPropertyOptional({ description: 'ID del usuario aprobador' })
  @IsOptional()
  @IsUUID()
  approved_by?: string;

  // =====================================================
  // SEARCH & DISCOVERY
  // =====================================================

  /**
   * Palabras clave
   */
  @ApiPropertyOptional({ description: 'Palabras clave para búsqueda', example: ['Marie Curie', 'radioactividad', 'Nobel'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  /**
   * Etiquetas de búsqueda
   */
  @ApiPropertyOptional({ description: 'Etiquetas de búsqueda', example: ['biografía', 'ciencia', 'historia'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  search_tags?: string[];

  // =====================================================
  // METADATA
  // =====================================================

  /**
   * Metadatos adicionales
   */
  @ApiPropertyOptional({ description: 'Metadatos adicionales', example: {} })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
