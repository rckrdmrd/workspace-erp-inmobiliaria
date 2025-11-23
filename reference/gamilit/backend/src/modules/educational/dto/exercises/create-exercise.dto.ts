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
  IsNumber,
} from 'class-validator';
import {
  DifficultyLevelEnum,
  ExerciseTypeEnum,
  ComodinTypeEnum,
} from '@shared/constants/enums.constants';

/**
 * CreateExerciseDto
 *
 * @description DTO para crear un nuevo ejercicio educativo.
 *              Ejercicios con 33 mecánicas diferentes (updated 2025-11-11).
 */
export class CreateExerciseDto {
  /**
   * ID del módulo al que pertenece (REQUERIDO)
   * FK CRÍTICA: NOT NULL, ON DELETE CASCADE
   */
  @IsUUID()
  module_id!: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Título del ejercicio (REQUERIDO)
   */
  @IsString()
  title!: string;

  /**
   * Subtítulo del ejercicio
   */
  @IsOptional()
  @IsString()
  subtitle?: string;

  /**
   * Descripción del ejercicio
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Instrucciones detalladas para el estudiante
   */
  @IsOptional()
  @IsString()
  instructions?: string;

  /**
   * Índice de orden dentro del módulo (REQUERIDO)
   */
  @IsInt()
  @Min(0)
  order_index!: number;

  // =====================================================
  // EXERCISE TYPE & MECHANICS
  // =====================================================

  /**
   * Tipo de ejercicio (27+ mecánicas diferentes) (REQUERIDO)
   */
  @IsEnum(ExerciseTypeEnum)
  exercise_type!: ExerciseTypeEnum;

  /**
   * Configuración específica del ejercicio (JSONB)
   * Estructura variable según exercise_type
   */
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  /**
   * Contenido del ejercicio (JSONB) (REQUERIDO)
   * Por defecto: {options: [], question: "", explanations: {}, correct_answers: []}
   */
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  /**
   * Solución del ejercicio (JSONB)
   */
  @IsOptional()
  @IsObject()
  solution?: Record<string, any>;

  /**
   * Rúbrica de evaluación (JSONB)
   */
  @IsOptional()
  @IsObject()
  rubric?: Record<string, any>;

  // =====================================================
  // GRADING & SCORING
  // =====================================================

  /**
   * Si el ejercicio puede calificarse automáticamente
   */
  @IsOptional()
  @IsBoolean()
  auto_gradable?: boolean;

  /**
   * Nivel de dificultad
   */
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Puntuación máxima posible
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  max_points?: number;

  /**
   * Puntuación mínima para aprobar
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  passing_score?: number;

  // =====================================================
  // TIMING
  // =====================================================

  /**
   * Tiempo estimado en minutos para completar
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  estimated_time_minutes?: number;

  /**
   * Límite de tiempo en minutos (NULL = sin límite)
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  time_limit_minutes?: number;

  // =====================================================
  // ATTEMPTS & RETRY LOGIC
  // =====================================================

  /**
   * Número máximo de intentos permitidos
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  max_attempts?: number;

  /**
   * Si se permite reintentar el ejercicio
   */
  @IsOptional()
  @IsBoolean()
  allow_retry?: boolean;

  /**
   * Minutos de espera entre reintentos
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  retry_delay_minutes?: number;

  // =====================================================
  // HINTS & SUPPORT
  // =====================================================

  /**
   * Pistas disponibles para el ejercicio
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hints?: string[];

  /**
   * Si se habilitan las pistas
   */
  @IsOptional()
  @IsBoolean()
  enable_hints?: boolean;

  /**
   * Costo en ML Coins por usar una pista
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  hint_cost_ml_coins?: number;

  // =====================================================
  // COMODINES (POWER-UPS)
  // =====================================================

  /**
   * Tipos de comodines permitidos en este ejercicio
   */
  @IsOptional()
  @IsArray()
  @IsEnum(ComodinTypeEnum, { each: true })
  comodines_allowed?: ComodinTypeEnum[];

  /**
   * Configuración de comodines (JSONB)
   */
  @IsOptional()
  @IsObject()
  comodines_config?: Record<string, any>;

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  /**
   * Puntos de experiencia (XP) otorgados
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  xp_reward?: number;

  /**
   * Monedas ML otorgadas
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_reward?: number;

  /**
   * Multiplicador de bonificación para recompensas
   */
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  bonus_multiplier?: number;

  // =====================================================
  // STATUS & VISIBILITY
  // =====================================================

  /**
   * Si el ejercicio está activo y disponible
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Si el ejercicio es opcional
   */
  @IsOptional()
  @IsBoolean()
  is_optional?: boolean;

  /**
   * Si el ejercicio otorga bonificación extra
   */
  @IsOptional()
  @IsBoolean()
  is_bonus?: boolean;

  // =====================================================
  // VERSIONING & REVIEW
  // =====================================================

  /**
   * Número de versión del ejercicio
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  /**
   * Notas sobre cambios en la versión
   */
  @IsOptional()
  @IsString()
  version_notes?: string;

  /**
   * ID del usuario que creó el ejercicio
   */
  @IsOptional()
  @IsUUID()
  created_by?: string;

  /**
   * ID del usuario que revisó el ejercicio
   */
  @IsOptional()
  @IsUUID()
  reviewed_by?: string;

  // =====================================================
  // ADAPTIVE LEARNING
  // =====================================================

  /**
   * Si el ejercicio adapta su dificultad
   */
  @IsOptional()
  @IsBoolean()
  adaptive_difficulty?: boolean;

  /**
   * Array de UUIDs de ejercicios prerequisitos
   */
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  prerequisites?: string[];

  /**
   * Metadatos adicionales (JSONB)
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
