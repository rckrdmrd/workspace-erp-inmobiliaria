import { Expose } from 'class-transformer';
import {
  DifficultyLevelEnum,
  ExerciseTypeEnum,
  ComodinTypeEnum,
} from '@shared/constants/enums.constants';

/**
 * ExerciseResponseDto
 *
 * @description DTO de respuesta con información completa del ejercicio.
 *              Utilizado para retornar datos del ejercicio al cliente.
 */
export class ExerciseResponseDto {
  @Expose()
  id!: string;

  @Expose()
  module_id!: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  @Expose()
  title!: string;

  @Expose()
  subtitle?: string;

  @Expose()
  description?: string;

  @Expose()
  instructions?: string;

  // =====================================================
  // PEDAGOGICAL CONTENT (DB-125: 2025-11-19)
  // =====================================================

  @Expose()
  objective?: string;

  @Expose()
  how_to_solve?: string;

  @Expose()
  recommended_strategy?: string;

  @Expose()
  pedagogical_notes?: string;

  @Expose()
  order_index!: number;

  // =====================================================
  // EXERCISE TYPE & MECHANICS
  // =====================================================

  @Expose()
  exercise_type!: ExerciseTypeEnum;

  @Expose()
  config!: Record<string, any>;

  @Expose()
  content!: Record<string, any>;

  @Expose()
  solution?: Record<string, any>;

  @Expose()
  rubric?: Record<string, any>;

  // =====================================================
  // GRADING & SCORING
  // =====================================================

  @Expose()
  auto_gradable!: boolean;

  @Expose()
  difficulty_level!: DifficultyLevelEnum;

  @Expose()
  max_points!: number;

  @Expose()
  passing_score!: number;

  // =====================================================
  // TIMING
  // =====================================================

  @Expose()
  estimated_time_minutes!: number;

  @Expose()
  time_limit_minutes?: number;

  // =====================================================
  // ATTEMPTS & RETRY LOGIC
  // =====================================================

  @Expose()
  max_attempts!: number;

  @Expose()
  allow_retry!: boolean;

  @Expose()
  retry_delay_minutes!: number;

  // =====================================================
  // HINTS & SUPPORT
  // =====================================================

  @Expose()
  hints?: string[];

  @Expose()
  enable_hints!: boolean;

  @Expose()
  hint_cost_ml_coins!: number;

  // =====================================================
  // COMODINES (POWER-UPS)
  // =====================================================

  @Expose()
  comodines_allowed!: ComodinTypeEnum[];

  @Expose()
  comodines_config!: Record<string, any>;

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  @Expose()
  xp_reward!: number;

  @Expose()
  ml_coins_reward!: number;

  @Expose()
  bonus_multiplier!: number;

  // =====================================================
  // STATUS & VISIBILITY
  // =====================================================

  @Expose()
  is_active!: boolean;

  @Expose()
  is_optional!: boolean;

  @Expose()
  is_bonus!: boolean;

  // =====================================================
  // VERSIONING & REVIEW
  // =====================================================

  @Expose()
  version!: number;

  @Expose()
  version_notes?: string;

  @Expose()
  created_by?: string;

  @Expose()
  reviewed_by?: string;

  // =====================================================
  // ADAPTIVE LEARNING
  // =====================================================

  @Expose()
  adaptive_difficulty!: boolean;

  @Expose()
  prerequisites?: string[];

  @Expose()
  metadata!: Record<string, any>;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;
}
