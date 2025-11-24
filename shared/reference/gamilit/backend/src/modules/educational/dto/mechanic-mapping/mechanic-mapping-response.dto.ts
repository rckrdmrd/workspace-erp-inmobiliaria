import { ApiProperty } from '@nestjs/swagger';
import { ExerciseTypeEnum, DifficultyLevelEnum } from '@shared/constants/enums.constants';

/**
 * Response DTO for Exercise Mechanic Mapping
 *
 * @description Representa un mapeo entre categoría pedagógica e implementación GAMILIT.
 *              Incluye toda la información necesaria para filtrado y análisis.
 *
 * @see ADR-008: Sistema Dual exercise_type + Categorías Pedagógicas
 */
export class MechanicMappingResponseDto {
  @ApiProperty({
    description: 'ID único del mapeo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  // ======================================
  // CLASIFICACIÓN PEDAGÓGICA
  // ======================================

  @ApiProperty({
    description: 'Categoría pedagógica principal',
    example: 'lectura',
    enum: ['vocabulario', 'gramatica', 'lectura', 'escritura', 'audio', 'pronunciacion', 'cultura'],
  })
  mechanic_category!: string;

  @ApiProperty({
    description: 'Subcategoría pedagógica específica',
    example: 'inference',
    required: false,
  })
  mechanic_subcategory?: string;

  // ======================================
  // IMPLEMENTACIÓN GAMILIT
  // ======================================

  @ApiProperty({
    description: 'Tipo de ejercicio GAMILIT',
    example: 'detective_textual',
    enum: ExerciseTypeEnum,
  })
  exercise_type!: ExerciseTypeEnum;

  // ======================================
  // CONTEXTO EDUCATIVO
  // ======================================

  @ApiProperty({
    description: 'Nivel en Taxonomía de Bloom',
    example: 'analizar',
    required: false,
    enum: ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'],
  })
  bloom_level?: string;

  @ApiProperty({
    description: 'Niveles CEFR aplicables',
    example: ['intermedio', 'avanzado'],
    required: false,
    enum: DifficultyLevelEnum,
    isArray: true,
  })
  cefr_level?: DifficultyLevelEnum[];

  @ApiProperty({
    description: 'Propósito pedagógico del mapeo',
    example: 'Desarrollar comprensión inferencial mediante análisis de pistas textuales',
    required: false,
  })
  pedagogical_purpose?: string;

  @ApiProperty({
    description: 'Objetivos de aprendizaje específicos',
    example: ['Inferir información implícita', 'Analizar evidencias textuales', 'Deducir conclusiones'],
    required: false,
    type: [String],
  })
  learning_objectives?: string[];

  // ======================================
  // CARACTERÍSTICAS
  // ======================================

  @ApiProperty({
    description: 'Tipo de interacción del usuario',
    example: 'selection',
    required: false,
  })
  interaction_type?: string;

  @ApiProperty({
    description: 'Carga cognitiva aproximada',
    example: 'alto',
    required: false,
    enum: ['bajo', 'medio', 'alto'],
  })
  cognitive_load?: string;

  @ApiProperty({
    description: 'Tags adicionales para búsqueda',
    example: ['inferencia', 'deduccion', 'analisis', 'investigacion'],
    required: false,
    type: [String],
  })
  tags?: string[];

  @ApiProperty({
    description: 'Estado de activación del mapeo',
    example: true,
  })
  is_active!: boolean;

  // ======================================
  // AUDIT
  // ======================================

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-11T12:00:00Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-11-11T12:00:00Z',
  })
  updated_at!: Date;
}

/**
 * Grouped Mechanic Mapping Response
 *
 * @description Agrupa mappings por categoría pedagógica para vistas organizadas.
 *              Útil para dashboard de profesores y filtros jerárquicos.
 */
export class GroupedMechanicMappingDto {
  @ApiProperty({
    description: 'Categoría pedagógica',
    example: 'lectura',
  })
  category!: string;

  @ApiProperty({
    description: 'Número de mappings en esta categoría',
    example: 15,
  })
  count!: number;

  @ApiProperty({
    description: 'Mappings en esta categoría',
    type: [MechanicMappingResponseDto],
  })
  mappings!: MechanicMappingResponseDto[];
}

/**
 * Exercise with Mechanics Response
 *
 * @description Combina información de ejercicio con sus categorías pedagógicas.
 *              Útil para mostrar contexto pedagógico en listados de ejercicios.
 *
 * @see Vista DDL: educational_content.exercises_with_mechanics
 */
export class ExerciseWithMechanicsDto {
  // Campos de Exercise
  @ApiProperty({ description: 'ID del ejercicio' })
  id!: string;

  @ApiProperty({ description: 'Título del ejercicio' })
  title!: string;

  @ApiProperty({ description: 'Tipo de ejercicio', enum: ExerciseTypeEnum })
  exercise_type!: ExerciseTypeEnum;

  @ApiProperty({ description: 'Nivel de dificultad', enum: DifficultyLevelEnum })
  difficulty_level!: DifficultyLevelEnum;

  // Campos de Mechanic Mapping
  @ApiProperty({ description: 'Categoría pedagógica', required: false })
  mechanic_category?: string;

  @ApiProperty({ description: 'Subcategoría pedagógica', required: false })
  mechanic_subcategory?: string;

  @ApiProperty({ description: 'Nivel de Bloom', required: false })
  bloom_level?: string;

  @ApiProperty({ description: 'Propósito pedagógico', required: false })
  pedagogical_purpose?: string;

  @ApiProperty({ description: 'Carga cognitiva', required: false })
  cognitive_load?: string;

  @ApiProperty({ description: 'Tags del mapping', type: [String], required: false })
  mechanic_tags?: string[];
}
