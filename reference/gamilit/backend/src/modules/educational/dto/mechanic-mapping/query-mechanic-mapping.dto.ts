import { IsEnum, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ExerciseTypeEnum, DifficultyLevelEnum } from '@shared/constants/enums.constants';

/**
 * Query DTO for filtering Exercise Mechanic Mappings
 *
 * @description Permite filtrar mappings por categoría pedagógica, tipo de ejercicio,
 *              nivel de Bloom, CEFR, tags, etc.
 *
 * CASOS DE USO:
 * - Profesores: Buscar ejercicios por competencia (ej: "vocabulario")
 * - Sistema: Filtrar por Bloom level para recomendaciones
 * - Analytics: Agrupar por categoría pedagógica
 *
 * @see ADR-008: Sistema Dual
 */
export class QueryMechanicMappingDto {
  /**
   * Filtrar por categoría pedagógica principal
   * Valores: vocabulario, gramatica, lectura, escritura, audio, pronunciacion, cultura
   */
  @ApiProperty({
    description: 'Categoría pedagógica principal',
    example: 'lectura',
    required: false,
    enum: ['vocabulario', 'gramatica', 'lectura', 'escritura', 'audio', 'pronunciacion', 'cultura'],
  })
  @IsOptional()
  @IsString()
  mechanic_category?: string;

  /**
   * Filtrar por subcategoría pedagógica específica
   * Ejemplos: multiple_choice, inference, essay_writing
   */
  @ApiProperty({
    description: 'Subcategoría pedagógica específica',
    example: 'inference',
    required: false,
  })
  @IsOptional()
  @IsString()
  mechanic_subcategory?: string;

  /**
   * Filtrar por tipo de ejercicio GAMILIT
   */
  @ApiProperty({
    description: 'Tipo de ejercicio GAMILIT',
    example: 'detective_textual',
    required: false,
    enum: ExerciseTypeEnum,
  })
  @IsOptional()
  @IsEnum(ExerciseTypeEnum)
  exercise_type?: ExerciseTypeEnum;

  /**
   * Filtrar por nivel de Bloom
   * Valores: recordar, comprender, aplicar, analizar, evaluar, crear
   */
  @ApiProperty({
    description: 'Nivel de Taxonomía de Bloom',
    example: 'analizar',
    required: false,
    enum: ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'],
  })
  @IsOptional()
  @IsString()
  bloom_level?: string;

  /**
   * Filtrar por nivel CEFR
   */
  @ApiProperty({
    description: 'Nivel CEFR',
    example: 'intermedio',
    required: false,
    enum: DifficultyLevelEnum,
  })
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  cefr_level?: DifficultyLevelEnum;

  /**
   * Filtrar por tipo de interacción
   * Ejemplos: drag_drop, text_input, selection
   */
  @ApiProperty({
    description: 'Tipo de interacción del usuario',
    example: 'drag_drop',
    required: false,
  })
  @IsOptional()
  @IsString()
  interaction_type?: string;

  /**
   * Filtrar por carga cognitiva
   * Valores: bajo, medio, alto
   */
  @ApiProperty({
    description: 'Carga cognitiva',
    example: 'alto',
    required: false,
    enum: ['bajo', 'medio', 'alto'],
  })
  @IsOptional()
  @IsString()
  cognitive_load?: string;

  /**
   * Filtrar por tags (búsqueda flexible)
   * Puede buscar por uno o más tags
   */
  @ApiProperty({
    description: 'Tags para filtrar (búsqueda flexible)',
    example: ['colaborativo', 'visual'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /**
   * Solo mappings activos
   */
  @ApiProperty({
    description: 'Solo mappings activos',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean = true;
}
