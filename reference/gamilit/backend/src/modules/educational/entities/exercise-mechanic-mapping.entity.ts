import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { DifficultyLevelEnum, ExerciseTypeEnum } from '@shared/constants/enums.constants';

/**
 * Exercise Mechanic Mapping Entity (educational_content.exercise_mechanic_mapping)
 *
 * @description Mapeo N:M entre categorías pedagógicas universales (31 subcategorías)
 *              e implementaciones específicas GAMILIT (35 exercise_types).
 *              Sistema Dual que permite clasificación pedagógica sin romper implementación existente.
 *
 * @schema educational_content
 * @table exercise_mechanic_mapping
 *
 * @see ADR-008: Sistema Dual exercise_type + Categorías Pedagógicas
 * @see DDL: apps/database/ddl/schemas/educational_content/tables/21-exercise_mechanic_mapping.sql
 * @see RF-EDU-001: Mecánicas de Ejercicios (v2.0)
 * @see ET-EDU-001: Implementación de Mecánicas (v2.0)
 *
 * CASOS DE USO:
 * - Profesores: Buscar ejercicios por competencia pedagógica (vocabulario, lectura, etc.)
 * - Analytics: Reportes por área pedagógica y tipo específico
 * - Sistema Adaptativo: Recomendar ejercicios según competencias a desarrollar
 * - Curricular: Mapear ejercicios a estándares educativos (Bloom, CEFR)
 */
@Entity({ schema: DB_SCHEMAS.EDUCATIONAL, name: DB_TABLES.EDUCATIONAL.EXERCISE_MECHANIC_MAPPING })
@Index('idx_mechanic_mapping_category', ['mechanic_category'], { where: 'is_active = true' })
@Index('idx_mechanic_mapping_subcategory', ['mechanic_subcategory'], { where: 'is_active = true' })
@Index('idx_mechanic_mapping_exercise_type', ['exercise_type'], { where: 'is_active = true' })
@Index('idx_mechanic_mapping_bloom', ['bloom_level'], { where: 'is_active = true' })
@Index('idx_mechanic_mapping_tags_gin', ['tags'])
export class ExerciseMechanicMapping {
  // =====================================================
  // PRIMARY KEY
  // =====================================================

  /**
   * Identificador único del mapeo (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // CLASIFICACIÓN PEDAGÓGICA UNIVERSAL
  // =====================================================

  /**
   * Categoría pedagógica principal (7 categorías universales)
   *
   * VALORES:
   * - vocabulario: Reconocimiento y memorización de términos
   * - gramatica: Comprensión y aplicación de reglas lingüísticas
   * - lectura: Comprensión de textos en diferentes niveles
   * - escritura: Producción de textos diversos
   * - audio: Comprensión y producción oral/auditiva
   * - pronunciacion: Articulación y fonética
   * - cultura: Comprensión de contextos culturales e históricos
   *
   * @see ET-EDU-001 v2.0: Tabla de Categorías Pedagógicas
   * @see RF-EDU-001 v2.0: Contexto Pedagógico
   */
  @Column({ type: 'varchar', length: 50 })
  mechanic_category!: string;

  /**
   * Subcategoría pedagógica específica (31 subcategorías genéricas)
   *
   * EJEMPLOS por categoría:
   * - vocabulario: multiple_choice, word_search, matching, flashcards, fill_in_blank, contextual_clues
   * - gramatica: verb_conjugation, sentence_builder, error_detection, etc.
   * - lectura: reading_comprehension, inference, prediction, critical_analysis, etc.
   * - escritura: free_writing, essay_writing, creative_writing, etc.
   * - audio: listening_comprehension, audio_matching, dictation
   * - pronunciacion: speech_recording, pronunciation_comparison
   * - cultura: cultural_context, cultural_perspectives, traditional_practice, pop_culture
   *
   * @see ET-EDU-001 v2.0: Tabla completa de 31 subcategorías
   * @see ADR-008: Ejemplos de mapeos
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  mechanic_subcategory?: string;

  // =====================================================
  // IMPLEMENTACIÓN GAMILIT
  // =====================================================

  /**
   * Tipo de ejercicio específico GAMILIT (35 implementaciones)
   *
   * MÓDULOS:
   * - Módulo 1 (5): crucigrama, linea_tiempo, sopa_letras, mapa_conceptual, emparejamiento
   * - Módulo 2 (4): detective_textual, construccion_hipotesis, prediccion_narrativa, puzzle_contexto
   * - Módulo 3 (5): analisis_fuentes, debate_digital, matriz_perspectivas, podcast_argumentativo, tribunal_opiniones
   * - Módulo 4 (9): analisis_memes, chat_literario, email_formal, ensayo_argumentativo, infografia_interactiva,
   *                  navegacion_hipertextual, quiz_tiktok, resena_critica, verificador_fake_news
   * - Módulo 5 (2): proyecto_colaborativo, presentacion_oral
   * - Auxiliares (10): flashcard, completar_espacios, verdadero_falso, organizador_grafico, multiple_choice,
   *                     collage_prensa, drag_drop, texto_interactivo, audio_transcripcion, video_analisis
   *
   * @see ENUM: educational_content.exercise_type
   * @see Enum: ExerciseTypeEnum
   */
  @Column({ type: 'enum', enum: ExerciseTypeEnum, enumName: 'educational_content.exercise_type' })
  exercise_type!: ExerciseTypeEnum;

  // =====================================================
  // CONTEXTO EDUCATIVO
  // =====================================================

  /**
   * Nivel en Taxonomía de Bloom (6 niveles cognitivos)
   *
   * VALORES (orden jerárquico):
   * 1. recordar: Recuperar información de memoria
   * 2. comprender: Explicar ideas o conceptos
   * 3. aplicar: Usar información en situaciones nuevas
   * 4. analizar: Descomponer información en partes
   * 5. evaluar: Hacer juicios basados en criterios
   * 6. crear: Producir trabajo nuevo u original
   *
   * @see https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/
   * @see ET-EDU-001 v2.0: Sección Bloom Taxonomy
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  bloom_level?: string;

  /**
   * Niveles CEFR aplicables (Common European Framework of Reference)
   *
   * VALORES (array para soportar múltiples niveles):
   * - basico: A1-A2 (Usuario básico)
   * - intermedio: B1-B2 (Usuario independiente)
   * - avanzado: C1 (Usuario competente)
   * - experto: C2 (Maestría)
   *
   * Un exercise_type puede aplicar a múltiples niveles CEFR.
   * Ejemplo: 'crucigrama' puede ser basico o intermedio según configuración.
   *
   * @see ENUM: educational_content.difficulty_level
   * @see Enum: DifficultyLevelEnum
   */
  @Column({
    type: 'enum',
    enum: DifficultyLevelEnum,
    enumName: 'difficulty_level',
    array: true,
    nullable: true,
  })
  cefr_level?: DifficultyLevelEnum[];

  /**
   * Propósito pedagógico del mapeo
   *
   * Describe POR QUÉ este exercise_type es apropiado para esta categoría pedagógica.
   * Enfoca en el valor educativo y la relación entre implementación y objetivo pedagógico.
   *
   * EJEMPLOS:
   * - "Reforzar vocabulario mediante juego de palabras cruzadas con definiciones"
   * - "Desarrollar comprensión inferencial mediante análisis de pistas textuales"
   * - "Evaluar veracidad de información digital mediante fact-checking"
   */
  @Column({ type: 'text', nullable: true })
  pedagogical_purpose?: string;

  /**
   * Objetivos de aprendizaje específicos que cumple este mapeo
   *
   * Array de objetivos medibles y específicos asociados a este mapeo.
   * Útil para alinear con currículos, estándares educativos y reportes.
   *
   * EJEMPLOS:
   * - ["Identificar palabras clave", "Asociar términos con definiciones"]
   * - ["Inferir información implícita", "Analizar evidencias textuales", "Deducir conclusiones"]
   * - ["Verificar información", "Identificar fake news", "Pensamiento crítico digital"]
   */
  @Column({ type: 'text', array: true, nullable: true })
  learning_objectives?: string[];

  // =====================================================
  // CARACTERÍSTICAS DE INTERACCIÓN
  // =====================================================

  /**
   * Tipo de interacción del usuario con el ejercicio
   *
   * VALORES COMUNES:
   * - drag_drop: Arrastrar y soltar elementos
   * - text_input: Entrada de texto libre
   * - selection: Selección de opciones (click, tap)
   * - audio_recording: Grabación de audio
   * - drawing: Dibujo o anotación visual
   * - video_interaction: Interacción con video
   * - multimodal: Combinación de varios tipos
   *
   * Ayuda a filtrar ejercicios según modalidad de interacción deseada.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  interaction_type?: string;

  /**
   * Carga cognitiva aproximada del ejercicio
   *
   * VALORES:
   * - bajo: Ejercicios simples, respuesta rápida, memoria
   * - medio: Ejercicios de comprensión, aplicación
   * - alto: Ejercicios de análisis, evaluación, creación
   *
   * Ayuda a equilibrar asignaciones y evitar sobrecarga cognitiva.
   *
   * @see Teoría de Carga Cognitiva (Sweller, 1988)
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  cognitive_load?: string;

  // =====================================================
  // METADATOS Y BÚSQUEDA
  // =====================================================

  /**
   * Tags adicionales para búsqueda flexible
   *
   * EJEMPLOS:
   * - Contexto: ['colaborativo', 'individual', 'sincrono', 'asincrono']
   * - Modalidad: ['visual', 'auditivo', 'kinestesico', 'multimodal']
   * - Formato: ['juego', 'quiz', 'proyecto', 'debate']
   * - Características: ['rapido', 'gamificado', 'creativo', 'academico']
   *
   * Índice GIN permite búsquedas eficientes por tags.
   */
  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  /**
   * Control de activación del mapeo
   *
   * Permite deshabilitar mappings obsoletos sin eliminar histórico.
   * Útil para:
   * - Deprecar mapeos incorrectos
   * - Experimentar con nuevos mapeos
   * - Mantener auditoría de cambios
   *
   * @default true
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  /**
   * Fecha y hora de creación del mapeo
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del mapeo
   *
   * Trigger automático: trg_exercise_mechanic_mapping_updated_at
   * Función: gamilit.update_updated_at_column()
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
