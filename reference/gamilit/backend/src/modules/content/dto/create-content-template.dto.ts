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
import { DifficultyLevelEnum } from '@shared/constants/enums.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateContentTemplateDto
 *
 * @description DTO para crear una nueva plantilla de contenido reutilizable.
 */
export class CreateContentTemplateDto {
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
   * Nombre de la plantilla (REQUERIDO)
   */
  @ApiProperty({ description: 'Nombre de la plantilla', example: 'Plantilla de Ejercicio de Comprensión Lectora' })
  @IsString()
  name!: string;

  /**
   * Descripción de la plantilla
   */
  @ApiPropertyOptional({ description: 'Descripción de la plantilla', example: 'Plantilla para crear ejercicios de comprensión lectora con preguntas múltiples' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Tipo de plantilla: exercise, module, assessment, announcement, feedback
   */
  @ApiPropertyOptional({ description: 'Tipo de plantilla', enum: ['exercise', 'module', 'assessment', 'announcement', 'feedback'] })
  @IsOptional()
  @IsString()
  template_type?: string;

  // =====================================================
  // TEMPLATE STRUCTURE
  // =====================================================

  /**
   * Estructura JSON de la plantilla (REQUERIDO)
   */
  @ApiProperty({ description: 'Estructura JSON de la plantilla', example: { sections: [], fields: [] } })
  @IsObject()
  template_structure!: Record<string, any>;

  /**
   * Valores predeterminados JSON
   */
  @ApiPropertyOptional({ description: 'Valores predeterminados', example: { difficulty: 'medium', duration: 30 } })
  @IsOptional()
  @IsObject()
  default_values?: Record<string, any>;

  /**
   * Campos requeridos
   */
  @ApiPropertyOptional({ description: 'Campos requeridos', example: ['title', 'content', 'questions'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required_fields?: string[];

  /**
   * Campos opcionales
   */
  @ApiPropertyOptional({ description: 'Campos opcionales', example: ['images', 'videos', 'hints'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optional_fields?: string[];

  // =====================================================
  // VISIBILITY & ACCESS
  // =====================================================

  /**
   * Si la plantilla es pública
   */
  @ApiPropertyOptional({ description: 'Plantilla pública', default: false })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  /**
   * Si es plantilla del sistema
   */
  @ApiPropertyOptional({ description: 'Plantilla del sistema', default: false })
  @IsOptional()
  @IsBoolean()
  is_system_template?: boolean;

  // =====================================================
  // DIFFICULTY & USAGE
  // =====================================================

  /**
   * Nivel de dificultad
   */
  @ApiPropertyOptional({ description: 'Nivel de dificultad', enum: DifficultyLevelEnum })
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Contador de usos (opcional, normalmente se incrementa automáticamente)
   */
  @ApiPropertyOptional({ description: 'Contador de usos', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  usage_count?: number;

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

  /**
   * ID del creador
   */
  @ApiPropertyOptional({ description: 'ID del usuario creador' })
  @IsOptional()
  @IsUUID()
  created_by?: string;
}
