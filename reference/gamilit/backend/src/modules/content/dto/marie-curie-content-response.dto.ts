import { Expose } from 'class-transformer';
import {
  DifficultyLevelEnum,
  ContentStatusEnum,
} from '@shared/constants/enums.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * MarieCurieContentResponseDto
 *
 * @description DTO de respuesta con información completa del contenido sobre Marie Curie.
 */
export class MarieCurieContentResponseDto {
  @ApiProperty({ description: 'ID del contenido' })
  @Expose()
  id!: string;

  @ApiPropertyOptional({ description: 'ID del tenant' })
  @Expose()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  @ApiProperty({ description: 'Título del contenido' })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ description: 'Subtítulo' })
  @Expose()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Descripción breve' })
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: 'Categoría del contenido' })
  @Expose()
  category?: string;

  // =====================================================
  // CONTENT STRUCTURE
  // =====================================================

  @ApiProperty({ description: 'Contenido estructurado JSON' })
  @Expose()
  content!: Record<string, any>;

  // =====================================================
  // EDUCATIONAL METADATA
  // =====================================================

  @ApiProperty({ description: 'Grados escolares objetivo' })
  @Expose()
  target_grade_levels!: string[];

  @ApiProperty({ description: 'Nivel de dificultad' })
  @Expose()
  difficulty_level!: DifficultyLevelEnum;

  @ApiPropertyOptional({ description: 'Nivel de lectura' })
  @Expose()
  reading_level?: string;

  @ApiPropertyOptional({ description: 'Objetivos de aprendizaje' })
  @Expose()
  learning_objectives?: string[];

  @ApiPropertyOptional({ description: 'Conocimientos previos requeridos' })
  @Expose()
  prerequisite_knowledge?: string[];

  @ApiPropertyOptional({ description: 'Vocabulario clave' })
  @Expose()
  key_vocabulary?: string[];

  // =====================================================
  // MULTIMEDIA REFERENCES
  // =====================================================

  @ApiPropertyOptional({ description: 'IDs de imágenes asociadas' })
  @Expose()
  images?: string[];

  @ApiPropertyOptional({ description: 'IDs de videos asociados' })
  @Expose()
  videos?: string[];

  @ApiPropertyOptional({ description: 'IDs de archivos de audio' })
  @Expose()
  audio_files?: string[];

  @ApiPropertyOptional({ description: 'IDs de documentos asociados' })
  @Expose()
  documents?: string[];

  // =====================================================
  // HISTORICAL & SCIENTIFIC CONTEXT
  // =====================================================

  @ApiPropertyOptional({ description: 'Período histórico' })
  @Expose()
  historical_period?: string;

  @ApiPropertyOptional({ description: 'Campo científico' })
  @Expose()
  scientific_field?: string;

  @ApiProperty({ description: 'Contexto cultural JSON' })
  @Expose()
  cultural_context!: Record<string, any>;

  // =====================================================
  // PUBLICATION STATUS
  // =====================================================

  @ApiProperty({ description: 'Estado del contenido' })
  @Expose()
  status!: ContentStatusEnum;

  @ApiProperty({ description: 'Contenido destacado' })
  @Expose()
  is_featured!: boolean;

  @ApiProperty({ description: 'Contenido interactivo' })
  @Expose()
  is_interactive!: boolean;

  // =====================================================
  // APPROVAL WORKFLOW
  // =====================================================

  @ApiPropertyOptional({ description: 'ID del usuario creador' })
  @Expose()
  created_by?: string;

  @ApiPropertyOptional({ description: 'ID del usuario revisor' })
  @Expose()
  reviewed_by?: string;

  @ApiPropertyOptional({ description: 'ID del usuario aprobador' })
  @Expose()
  approved_by?: string;

  // =====================================================
  // SEARCH & DISCOVERY
  // =====================================================

  @ApiPropertyOptional({ description: 'Palabras clave' })
  @Expose()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Etiquetas de búsqueda' })
  @Expose()
  search_tags?: string[];

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  @ApiProperty({ description: 'Metadatos adicionales' })
  @Expose()
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updated_at!: Date;
}
