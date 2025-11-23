/**
 * Educational Types
 * Type definitions for Educational Module API responses
 */

/**
 * Difficulty Level Enum
 * Matches database enum: educational_content.difficulty_level
 * @see Backend: DifficultyLevelEnum
 * @version 2.0 (2025-11-11) - Migrado a est\u00e1ndar CEFR (8 niveles: A1-C2+)
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',               // A1
  ELEMENTARY = 'elementary',           // A2
  PRE_INTERMEDIATE = 'pre_intermediate', // B1
  INTERMEDIATE = 'intermediate',       // B2
  UPPER_INTERMEDIATE = 'upper_intermediate', // C1
  ADVANCED = 'advanced',               // C2
  PROFICIENT = 'proficient',           // C2+
  NATIVE = 'native'                    // Nativo
}

/**
 * Exercise Type Enum
 * Matches database enum: educational_content.exercise_type
 * @see Backend: ExerciseTypeEnum
 */
export enum ExerciseType {
  // =====================================================
  // MODULE 1: Comprensión Literal
  // =====================================================
  CRUCIGRAMA = 'crucigrama',
  LINEA_TIEMPO = 'linea_tiempo',
  SOPA_LETRAS = 'sopa_letras',
  MAPA_CONCEPTUAL = 'mapa_conceptual',
  EMPAREJAMIENTO = 'emparejamiento',

  // =====================================================
  // MODULE 2: Comprensión Inferencial
  // =====================================================
  DETECTIVE_TEXTUAL = 'detective_textual',
  CONSTRUCCION_HIPOTESIS = 'construccion_hipotesis',
  PREDICCION_NARRATIVA = 'prediccion_narrativa',
  PUZZLE_CONTEXTO = 'puzzle_contexto',
  RUEDA_INFERENCIAS = 'rueda_inferencias',

  // =====================================================
  // MODULE 3: Comprensión Crítica
  // =====================================================
  TRIBUNAL_OPINIONES = 'tribunal_opiniones',
  DEBATE_DIGITAL = 'debate_digital',
  ANALISIS_FUENTES = 'analisis_fuentes',
  PODCAST_ARGUMENTATIVO = 'podcast_argumentativo',
  MATRIZ_PERSPECTIVAS = 'matriz_perspectivas',

  // =====================================================
  // MODULE 4: Lectura Digital
  // =====================================================
  VERIFICADOR_FAKE_NEWS = 'verificador_fake_news',
  INFOGRAFIA_INTERACTIVA = 'infografia_interactiva',
  QUIZ_TIKTOK = 'quiz_tiktok',
  NAVEGACION_HIPERTEXTUAL = 'navegacion_hipertextual',
  ANALISIS_MEMES = 'analisis_memes',

  // =====================================================
  // MODULE 5: Producción Lectora
  // =====================================================
  DIARIO_MULTIMEDIA = 'diario_multimedia',
  COMIC_DIGITAL = 'comic_digital',
  VIDEO_CARTA = 'video_carta',

  // =====================================================
  // AUXILIAR EXERCISES
  // =====================================================
  COMPRENSION_AUDITIVA = 'comprension_auditiva',
  COLLAGE_PRENSA = 'collage_prensa',
  TEXTO_MOVIMIENTO = 'texto_movimiento',
  CALL_TO_ACTION = 'call_to_action',
  VERDADERO_FALSO = 'verdadero_falso',
  COMPLETAR_ESPACIOS = 'completar_espacios',
  DIARIO_INTERACTIVO = 'diario_interactivo',
  RESUMEN_VISUAL = 'resumen_visual',
}

/**
 * Content Status Enum
 * Matches database enum: educational_content.content_status
 */
export enum ContentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * Module
 * Represents an educational module/course
 * @see Database: educational_content.modules
 * @see Backend: ModuleResponseDto
 */
export interface Module {
  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  id: string;
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  title: string;
  subtitle?: string;
  description?: string;
  summary?: string;

  /**
   * Module content (JSONB)
   */
  content?: Record<string, any>;

  order_index: number;
  module_code?: string;

  // =====================================================
  // DIFFICULTY & CONTENT
  // =====================================================

  /**
   * Difficulty level
   * @deprecated Use difficulty_level instead
   */
  difficulty?: DifficultyLevel;

  difficulty_level?: DifficultyLevel;
  grade_levels?: string[];
  subjects?: string[];

  // =====================================================
  // TIMING & DURATION
  // =====================================================

  /**
   * @deprecated Use estimated_duration_minutes instead
   */
  estimated_time_minutes?: number;

  estimated_duration_minutes?: number;
  estimated_sessions?: number;

  // =====================================================
  // LEARNING OBJECTIVES & COMPETENCIES
  // =====================================================

  learning_objectives?: string[];
  competencies?: string[];
  skills_developed?: string[];

  // =====================================================
  // PREREQUISITES
  // =====================================================

  prerequisites?: string[]; // Array of module IDs
  prerequisite_skills?: string[];

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  maya_rank_required?: string;
  maya_rank_granted?: string;
  xp_reward?: number;
  ml_coins_reward?: number;

  // =====================================================
  // STATUS & PUBLICATION
  // =====================================================

  status?: ContentStatus | string;
  is_published?: boolean;
  is_featured?: boolean;
  is_free?: boolean;
  is_demo_module?: boolean;
  published_at?: string;
  archived_at?: string;

  // =====================================================
  // VERSIONING & REVISION
  // =====================================================

  version?: number;
  version_notes?: string;
  created_by?: string;
  reviewed_by?: string;
  approved_by?: string;

  // =====================================================
  // METADATA & INDEXING
  // =====================================================

  keywords?: string[];
  tags?: string[];
  thumbnail_url?: string;

  /**
   * @deprecated Use thumbnail_url instead
   */
  icon?: string;

  cover_image_url?: string;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;

  // =====================================================
  // COMPUTED FIELDS
  // =====================================================

  /**
   * Total number of exercises in the module
   */
  total_exercises?: number;

  // =====================================================
  // PROGRESS & STATUS (Optional fields populated by API with user context)
  // =====================================================

  /**
   * User's progress percentage (0-100)
   * Only present when fetching with user context
   */
  progress?: number;

  /**
   * Whether the module is locked for the user
   * Based on prerequisites, rank requirements, etc.
   */
  is_locked?: boolean;

  /**
   * Number of completed exercises by user
   * Only present when fetching with user context
   */
  completed_exercises?: number;

  /**
   * Number of completed exercises (alias for completed_exercises)
   * For backward compatibility
   */
  completedExercises?: number;

  /**
   * Total number of exercises (alias for total_exercises)
   * For backward compatibility
   */
  exercises_count?: number;

  /**
   * Total number of exercises (alias for total_exercises)
   * For backward compatibility with camelCase
   */
  totalExercises?: number;

  /**
   * Estimated time in minutes (alias for estimated_duration_minutes)
   * For backward compatibility
   */
  estimatedTime?: number;

  /**
   * Progress percentage (alias for progress)
   * For backward compatibility
   */
  progressPercentage?: number;

  /**
   * Color theme for module display
   * Optional UI customization
   */
  color?: string;

  /**
   * Rango Maya required (alias for maya_rank_required)
   * For backward compatibility
   */
  rangoMayaRequired?: string;

  /**
   * Rango Maya granted (alias for maya_rank_granted)
   * For backward compatibility
   */
  rangoMayaGranted?: string;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  created_at?: string;
  updated_at?: string;
}

/**
 * Exercise
 * Represents an exercise within a module with complete configuration
 *
 * @see Database: educational_content.exercises
 * @see Backend: modules/educational/entities/exercise.entity.ts
 *
 * UPDATED: Added 20+ fields from Backend/Database for full feature parity
 * - Grading & scoring configuration
 * - Timing & retry logic
 * - Power-ups (comodines) configuration
 * - Gamification rewards
 * - Adaptive learning settings
 * - Audit & versioning
 */
export interface Exercise {
  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  id: string;
  module_id: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  title: string;

  /**
   * Subtitle for additional context
   */
  subtitle?: string;

  description?: string;

  /**
   * Detailed instructions for the student
   */
  instructions?: string;

  // =====================================================
  // PEDAGOGICAL CONTENT (DB-125: 2025-11-19)
  // =====================================================

  /**
   * Objetivo pedagógico expandido del ejercicio (200-500 palabras)
   * Describe qué aprenderá el estudiante y por qué es importante según
   * el modelo de comprensión lectora de Daniel Cassany.
   */
  objective?: string;

  /**
   * Guía detallada de cómo resolver el ejercicio (300-800 palabras)
   * Pasos pedagógicos, estrategias de pensamiento, y consejos para
   * completar exitosamente el ejercicio.
   */
  how_to_solve?: string;

  /**
   * Estrategias recomendadas para resolver eficientemente (100-300 palabras)
   * Tips, trucos, y mejores prácticas para estudiantes.
   */
  recommended_strategy?: string;

  /**
   * Notas metodológicas para educadores (100-400 palabras)
   * Contexto pedagógico, relación con competencias, y alineación con modelo Cassany.
   */
  pedagogical_notes?: string;

  order_index: number;

  // =====================================================
  // EXERCISE TYPE & MECHANICS
  // =====================================================

  /**
   * Exercise type (using ExerciseTypeEnum from shared constants)
   */
  type: ExerciseType;

  /**
   * Exercise-specific configuration (JSONB)
   * Structure varies by exercise type
   */
  config?: Record<string, any>;

  /**
   * Exercise content (JSONB)
   */
  content: ExerciseContent;

  /**
   * Solution data (JSONB)
   * ⚠️ FE-059: This field is NEVER sent by backend (sanitized for security)
   * Private information not visible to students during resolution
   * @deprecated Backend sanitizes this field - always undefined
   */
  solution?: never;

  /**
   * Evaluation rubric (JSONB)
   */
  rubric?: Record<string, any>;

  // =====================================================
  // GRADING & SCORING
  // =====================================================

  /**
   * Whether the exercise can be auto-graded
   */
  auto_gradable: boolean;

  difficulty: DifficultyLevel;

  /**
   * Maximum points possible (Backend field)
   */
  max_points: number;

  /**
   * @deprecated Use max_points instead (Alias for backward compatibility)
   */
  max_score?: number;

  /**
   * Minimum score to pass
   */
  passing_score: number;

  // =====================================================
  // TIMING
  // =====================================================

  /**
   * Estimated time in minutes to complete
   */
  estimated_time_minutes: number;

  /**
   * Time limit in minutes (null = no limit)
   */
  time_limit_minutes?: number;

  // =====================================================
  // ATTEMPTS & RETRY LOGIC
  // =====================================================

  /**
   * Maximum number of attempts allowed
   */
  max_attempts: number;

  /**
   * Whether retrying is allowed
   */
  allow_retry: boolean;

  /**
   * Minutes to wait between retries
   */
  retry_delay_minutes: number;

  // =====================================================
  // HINTS & SUPPORT
  // =====================================================

  hints?: string[];

  /**
   * Whether hints are enabled
   */
  enable_hints: boolean;

  /**
   * Cost in ML Coins to use a hint
   */
  hint_cost_ml_coins: number;

  // =====================================================
  // POWER-UPS (COMODINES)
  // =====================================================

  /**
   * Types of power-ups allowed in this exercise
   * Values: pistas, vision_lectora, segunda_oportunidad
   */
  comodines_allowed: string[];

  /**
   * Power-ups configuration (JSONB)
   * Structure: {pistas: {cost: 15, enabled: true}, ...}
   */
  comodines_config: Record<string, any>;

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  /**
   * XP awarded for correct completion
   */
  xp_reward: number;

  /**
   * ML Coins awarded for correct completion
   */
  ml_coins_reward: number;

  /**
   * Bonus multiplier for rewards (e.g., 1.5 = 50% more)
   */
  bonus_multiplier: number;

  // =====================================================
  // STATUS & VISIBILITY
  // =====================================================

  /**
   * Whether the exercise is active and available
   */
  is_active: boolean;

  /**
   * Deprecated: Use is_active instead
   * @deprecated
   */
  is_published?: boolean;

  /**
   * Whether the exercise is optional (doesn't affect progress)
   */
  is_optional: boolean;

  /**
   * Whether the exercise grants bonus rewards
   */
  is_bonus: boolean;

  // =====================================================
  // VERSIONING & REVIEW
  // =====================================================

  /**
   * Version number of the exercise
   */
  version: number;

  /**
   * Notes about version changes
   */
  version_notes?: string;

  /**
   * User ID who created the exercise
   */
  created_by?: string;

  /**
   * User ID who reviewed the exercise
   */
  reviewed_by?: string;

  // =====================================================
  // ADAPTIVE LEARNING
  // =====================================================

  /**
   * Whether the exercise adapts difficulty based on performance
   */
  adaptive_difficulty: boolean;

  /**
   * Array of prerequisite exercise IDs
   */
  prerequisites?: string[];

  /**
   * Additional metadata (JSONB)
   */
  metadata: Record<string, any>;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  created_at: string;
  updated_at: string;

  /**
   * Deprecated: Use solution instead
   * @deprecated
   */
  solution_explanation?: string;

  // =====================================================
  // PROGRESS & STATUS (Optional fields populated by API with user context)
  // =====================================================

  /**
   * Alias for type (for backward compatibility)
   */
  exercise_type?: ExerciseType;

  /**
   * Alias for max_points (for backward compatibility)
   */
  points?: number;

  /**
   * Alias for estimated_time_minutes (for backward compatibility)
   */
  estimatedTime?: number;

  /**
   * Whether user has completed this exercise
   * Only present when fetching with user context
   */
  completed?: boolean;

  /**
   * User's best score on this exercise
   * Only present when fetching with user context
   */
  score?: number;
}

/**
 * Exercise Content
 * Content varies by exercise type
 * ⚠️ FE-059: correct_answer is NEVER sent by backend (sanitized for security)
 */
export interface ExerciseContent {
  question?: string;
  options?: string[];
  /**
   * @deprecated Backend sanitizes this field - never present
   */
  correct_answer?: never;
  code_template?: string;
  test_cases?: TestCase[];
  [key: string]: any;
}

/**
 * Test Case
 * For coding exercises
 */
export interface TestCase {
  input: any;
  expected_output: any;
  is_hidden: boolean;
  description?: string;
}

/**
 * Exercise Config
 * Generic configuration object for exercise-specific settings
 */
export type ExerciseConfig = Record<string, any>;

/**
 * Module with Progress
 * Module data combined with user progress
 */
export interface ModuleWithProgress extends Module {
  progress?: {
    status: string;
    progress_percentage: number;
    exercises_completed: number;
    exercises_total: number;
    time_spent_seconds: number;
    last_accessed_at: string;
  };
}
