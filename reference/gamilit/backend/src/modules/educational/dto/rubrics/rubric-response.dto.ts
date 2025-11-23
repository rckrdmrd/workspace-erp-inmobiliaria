import { Expose } from 'class-transformer';

/**
 * RubricResponseDto
 *
 * @description DTO de respuesta con información completa de una rúbrica de evaluación.
 */
export class RubricResponseDto {
  /**
   * Identificador único de la rúbrica
   */
  @Expose()
  id!: string;

  /**
   * ID del ejercicio asociado (si es relación a ejercicio)
   */
  @Expose()
  exercise_id?: string;

  /**
   * ID del módulo asociado (si es relación a módulo)
   */
  @Expose()
  module_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre de la rúbrica
   */
  @Expose()
  name!: string;

  /**
   * Descripción de la rúbrica
   */
  @Expose()
  description?: string;

  /**
   * Tipo de evaluación
   * Valores: automatic, manual, hybrid, peer_review
   */
  @Expose()
  assessment_type!: string;

  // =====================================================
  // CRITERIA & SCORING
  // =====================================================

  /**
   * Criterios de evaluación en formato JSONB
   */
  @Expose()
  criteria!: Record<string, any>;

  /**
   * Escala de puntuación
   */
  @Expose()
  scoring_scale!: Record<string, any>;

  /**
   * Peso porcentual de la rúbrica
   */
  @Expose()
  weight_percentage!: number;

  // =====================================================
  // VISIBILITY & OPTIONS
  // =====================================================

  /**
   * Si la rúbrica está activa
   */
  @Expose()
  is_active!: boolean;

  /**
   * Si se permite reenvío
   */
  @Expose()
  allow_resubmission!: boolean;

  /**
   * Plantilla de retroalimentación
   */
  @Expose()
  feedback_template?: string;

  /**
   * Si la retroalimentación automática está habilitada
   */
  @Expose()
  auto_feedback_enabled!: boolean;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales
   */
  @Expose()
  metadata!: Record<string, any>;

  /**
   * ID del usuario que creó la rúbrica
   */
  @Expose()
  created_by?: string;

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
