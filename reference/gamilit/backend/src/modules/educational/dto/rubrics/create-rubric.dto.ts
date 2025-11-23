import {
  IsUUID,
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsObject,
  Min,
  Max,
} from 'class-validator';

/**
 * CreateRubricDto
 *
 * @description DTO para crear una nueva rúbrica de evaluación (assessment rubric).
 *              Relación polimórfica: debe especificar exercise_id O module_id, nunca ambos.
 */
export class CreateRubricDto {
  /**
   * ID del ejercicio (FK → educational_content.exercises)
   * NOTA: Si se proporciona exercise_id, module_id debe ser null
   */
  @IsOptional()
  @IsUUID()
  exercise_id?: string;

  /**
   * ID del módulo (FK → educational_content.modules)
   * NOTA: Si se proporciona module_id, exercise_id debe ser null
   */
  @IsOptional()
  @IsUUID()
  module_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre de la rúbrica (REQUERIDO)
   */
  @IsString()
  name!: string;

  /**
   * Descripción de la rúbrica
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Tipo de evaluación (REQUERIDO)
   * Valores válidos: automatic, manual, hybrid, peer_review
   */
  @IsString()
  assessment_type!: string;

  // =====================================================
  // CRITERIA & SCORING
  // =====================================================

  /**
   * Criterios de evaluación en formato JSONB (REQUERIDO)
   * Estructura: {"criteria_1": {"name": string, "levels": {}, "weight": number}}
   */
  @IsObject()
  criteria!: Record<string, any>;

  /**
   * Escala de puntuación en formato JSONB
   * Estructura: {"min": number, "max": number, "passing": number}
   */
  @IsOptional()
  @IsObject()
  scoring_scale?: Record<string, any>;

  /**
   * Peso porcentual de esta rúbrica (1-100%)
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  weight_percentage?: number;

  // =====================================================
  // VISIBILITY & OPTIONS
  // =====================================================

  /**
   * Si la rúbrica está activa y disponible
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Si se permite reenvío de ejercicios evaluados por esta rúbrica
   */
  @IsOptional()
  @IsBoolean()
  allow_resubmission?: boolean;

  /**
   * Plantilla de retroalimentación para estudiantes
   */
  @IsOptional()
  @IsString()
  feedback_template?: string;

  /**
   * Si la retroalimentación automática está habilitada
   */
  @IsOptional()
  @IsBoolean()
  auto_feedback_enabled?: boolean;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  /**
   * ID del usuario que crea la rúbrica
   */
  @IsOptional()
  @IsUUID()
  created_by?: string;
}
