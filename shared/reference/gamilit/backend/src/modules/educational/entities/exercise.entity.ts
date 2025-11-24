import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import {
  DifficultyLevelEnum,
  ExerciseTypeEnum,
  ComodinTypeEnum,
} from '@shared/constants/enums.constants';

/**
 * Exercise Entity (educational_content.exercises)
 *
 * @description Ejercicios con 27+ mecánicas diferentes (crucigramas, mapas conceptuales,
 *              detective textual, debates digitales, etc.).
 *              Relacionado a través de module_id (FK CRÍTICA, NOT NULL, CASCADE).
 * @schema educational_content
 * @table exercises
 *
 * IMPORTANTE:
 * - module_id es FK CRÍTICA: NOT NULL con ON DELETE CASCADE
 * - prerequisites[] es referencia débil auto-referencial sin FK constraint
 * - config, content, solution son JSONB para flexibilidad en mecánicas
 *
 * @see DDL: apps/database/ddl/schemas/educational_content/tables/02-exercises.sql
 */
@Entity({ schema: DB_SCHEMAS.EDUCATIONAL, name: DB_TABLES.EDUCATIONAL.EXERCISES })
@Index('idx_exercises_module_id', ['module_id'])
@Index('idx_exercises_difficulty', ['difficulty_level'])
@Index('idx_exercises_type', ['exercise_type'])
@Index('idx_exercises_active', ['is_active'], { where: 'is_active = true' })
@Index('idx_exercises_order', ['module_id', 'order_index'])
@Index('idx_exercises_module_type_active', ['module_id', 'exercise_type', 'is_active'])
@Index('idx_exercises_active_gradable', ['module_id', 'order_index'], { where: 'is_active = true AND auto_gradable = true' })
@Index('idx_exercises_config_gin', ['config'])
@Index('idx_exercises_content_gin', ['content'])
@Index('idx_exercises_prerequisites', ['prerequisites'])
@Index('idx_exercises_search', ['title', 'description'])
export class Exercise {
  /**
   * Identificador único del ejercicio (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del módulo al que pertenece este ejercicio (FK CRÍTICA)
   * IMPORTANTE: NOT NULL, ON DELETE CASCADE
   */
  @Column({ type: 'uuid' })
  module_id!: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Título del ejercicio
   */
  @Column({ type: 'text' })
  title!: string;

  /**
   * Subtítulo del ejercicio
   */
  @Column({ type: 'text', nullable: true })
  subtitle?: string;

  /**
   * Descripción del ejercicio
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Instrucciones detalladas para el estudiante
   */
  @Column({ type: 'text', nullable: true })
  instructions?: string;

  // =====================================================
  // PEDAGOGICAL CONTENT (DB-125: 2025-11-19)
  // =====================================================

  /**
   * Objetivo pedagógico expandido del ejercicio (200-500 palabras)
   * Describe qué aprenderá el estudiante y por qué es importante según
   * el modelo de comprensión lectora de Daniel Cassany.
   */
  @Column({ type: 'text', nullable: true })
  objective?: string;

  /**
   * Guía detallada de cómo resolver el ejercicio (300-800 palabras)
   * Pasos pedagógicos, estrategias de pensamiento, y consejos para
   * completar exitosamente el ejercicio.
   */
  @Column({ type: 'text', nullable: true })
  how_to_solve?: string;

  /**
   * Estrategias recomendadas para resolver eficientemente (100-300 palabras)
   * Tips, trucos, y mejores prácticas para estudiantes.
   */
  @Column({ type: 'text', nullable: true })
  recommended_strategy?: string;

  /**
   * Notas metodológicas para educadores (100-400 palabras)
   * Contexto pedagógico, relación con competencias, y alineación con modelo Cassany.
   */
  @Column({ type: 'text', nullable: true })
  pedagogical_notes?: string;

  /**
   * Índice de orden dentro del módulo
   */
  @Column({ type: 'integer' })
  order_index!: number;

  // =====================================================
  // EXERCISE TYPE & MECHANICS
  // =====================================================

  /**
   * Tipo de ejercicio (27+ mecánicas diferentes)
   * ENUM: crucigrama, linea_tiempo, sopa_letras, mapa_conceptual, emparejamiento,
   *       detective_textual, construccion_hipotesis, prediccion_narrativa,
   *       puzzle_contexto, rueda_inferencias, tribunal_opiniones, debate_digital,
   *       analisis_fuentes, podcast_argumentativo, matriz_perspectivas,
   *       verificador_fake_news, infografia_interactiva, quiz_tiktok,
   *       navegacion_hipertextual, analisis_memes, diario_multimedia,
   *       comic_digital, video_carta, comprension_auditiva, collage_prensa,
   *       texto_movimiento, call_to_action, verdadero_falso, completar_espacios,
   *       diario_interactivo, resumen_visual
   */
  @Column({ type: 'enum', enum: ExerciseTypeEnum, enumName: 'educational_content.exercise_type' })
  exercise_type!: ExerciseTypeEnum;

  /**
   * Configuración específica del ejercicio (JSONB)
   * Estructura variable según exercise_type:
   * - Crucigrama: {grid, across_clues, down_clues}
   * - Quiz: {questions, options, correct_answers}
   * - etc.
   */
  @Column({ type: 'jsonb', default: {} })
  config!: Record<string, any>;

  /**
   * Contenido del ejercicio (JSONB)
   * Por defecto: {options: [], question: "", explanations: {}, correct_answers: []}
   */
  @Column({
    type: 'jsonb',
    default: {
      options: [],
      question: '',
      explanations: {},
      correct_answers: [],
    },
  })
  content!: Record<string, any>;

  /**
   * Solución del ejercicio (JSONB)
   * Información privada no visible para estudiantes durante la resolución
   */
  @Column({ type: 'jsonb', nullable: true })
  solution?: Record<string, any>;

  /**
   * Rúbrica de evaluación (JSONB)
   */
  @Column({ type: 'jsonb', nullable: true })
  rubric?: Record<string, any>;

  // =====================================================
  // GRADING & SCORING
  // =====================================================

  /**
   * Si el ejercicio puede calificarse automáticamente
   */
  @Column({ type: 'boolean', default: true })
  auto_gradable!: boolean;

  /**
   * Nivel de dificultad del ejercicio
   *
   * @see DDL: educational_content.exercises.difficulty_level (educational_content.difficulty_level ENUM)
   * @see Enum: DifficultyLevelEnum
   * @version 1.0 (2025-11-08) - Migrado de public a educational_content schema
   *
   * ESCALA: very_easy → easy → beginner → medium → intermediate → hard → advanced → very_hard
   */
  @Column({
    type: 'enum',
    enum: DifficultyLevelEnum,
    enumName: 'difficulty_level',
    default: DifficultyLevelEnum.BEGINNER,
  })
  difficulty_level!: DifficultyLevelEnum;

  /**
   * Puntuación máxima posible
   */
  @Column({ type: 'integer', default: 100 })
  max_points!: number;

  /**
   * Puntuación mínima para aprobar
   */
  @Column({ type: 'integer', default: 70 })
  passing_score!: number;

  // =====================================================
  // TIMING
  // =====================================================

  /**
   * Tiempo estimado en minutos para completar
   */
  @Column({ type: 'integer', default: 10 })
  estimated_time_minutes!: number;

  /**
   * Límite de tiempo en minutos (NULL = sin límite)
   */
  @Column({ type: 'integer', nullable: true })
  time_limit_minutes?: number;

  // =====================================================
  // ATTEMPTS & RETRY LOGIC
  // =====================================================

  /**
   * Número máximo de intentos permitidos
   */
  @Column({ type: 'integer', default: 3 })
  max_attempts!: number;

  /**
   * Si se permite reintentar el ejercicio
   */
  @Column({ type: 'boolean', default: true })
  allow_retry!: boolean;

  /**
   * Minutos de espera entre reintentos
   */
  @Column({ type: 'integer', default: 0 })
  retry_delay_minutes!: number;

  // =====================================================
  // HINTS & SUPPORT
  // =====================================================

  /**
   * Pistas disponibles para el ejercicio
   */
  @Column({ type: 'text', array: true, nullable: true })
  hints?: string[];

  /**
   * Si se habilitan las pistas
   */
  @Column({ type: 'boolean', default: true })
  enable_hints!: boolean;

  /**
   * Costo en ML Coins por usar una pista
   */
  @Column({ type: 'integer', default: 5 })
  hint_cost_ml_coins!: number;

  // =====================================================
  // COMODINES (POWER-UPS)
  // =====================================================

  /**
   * Tipos de comodines (power-ups) permitidos en este ejercicio
   *
   * @see DDL: educational_content.exercises.comodines_allowed (gamification_system.comodin_type[] ARRAY)
   * @see Enum: ComodinTypeEnum
   * @version 1.0 (2025-11-08) - Migrado de public a gamification_system schema
   *
   * VALORES:
   * - pistas: Pistas Contextuales (15 ML Coins)
   * - vision_lectora: Visión Lectora (25 ML Coins)
   * - segunda_oportunidad: Segunda Oportunidad (40 ML Coins)
   */
  @Column({
    type: 'enum',
    enum: ComodinTypeEnum,
    enumName: 'comodin_type',
    array: true,
    default: ['pistas', 'vision_lectora', 'segunda_oportunidad'],
  })
  comodines_allowed!: ComodinTypeEnum[];

  /**
   * Configuración de comodines (JSONB)
   * Estructura: {pistas: {cost: 15, enabled: true}, vision_lectora: {...}, ...}
   */
  @Column({
    type: 'jsonb',
    default: {
      pistas: { cost: 15, enabled: true },
      vision_lectora: { cost: 25, enabled: true },
      segunda_oportunidad: { cost: 40, enabled: true },
    },
  })
  comodines_config!: Record<string, any>;

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  /**
   * Puntos de experiencia (XP) otorgados al completar correctamente
   */
  @Column({ type: 'integer', default: 20 })
  xp_reward!: number;

  /**
   * Monedas ML otorgadas al completar correctamente
   */
  @Column({ type: 'integer', default: 5 })
  ml_coins_reward!: number;

  /**
   * Multiplicador de bonificación para recompensas
   * Ejemplo: 1.5 = 50% más recompensas
   */
  @Column({ type: 'numeric', precision: 3, scale: 2, default: 1.0 })
  bonus_multiplier!: number;

  // =====================================================
  // STATUS & VISIBILITY
  // =====================================================

  /**
   * Si el ejercicio está activo y disponible
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Si el ejercicio es opcional (no afecta progreso)
   */
  @Column({ type: 'boolean', default: false })
  is_optional!: boolean;

  /**
   * Si el ejercicio otorga bonificación extra
   */
  @Column({ type: 'boolean', default: false })
  is_bonus!: boolean;

  // =====================================================
  // VERSIONING & REVIEW
  // =====================================================

  /**
   * Número de versión del ejercicio
   */
  @Column({ type: 'integer', default: 1 })
  version!: number;

  /**
   * Notas sobre cambios en la versión
   */
  @Column({ type: 'text', nullable: true })
  version_notes?: string;

  /**
   * ID del usuario que creó el ejercicio
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * ID del usuario que revisó el ejercicio
   */
  @Column({ type: 'uuid', nullable: true })
  reviewed_by?: string;

  // =====================================================
  // ADAPTIVE LEARNING
  // =====================================================

  /**
   * Si el ejercicio adapta su dificultad según desempeño
   */
  @Column({ type: 'boolean', default: false })
  adaptive_difficulty!: boolean;

  /**
   * Array de UUIDs de ejercicios prerequisitos (auto-referencia débil sin FK)
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  prerequisites?: string[];

  /**
   * Metadatos adicionales (JSONB)
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
