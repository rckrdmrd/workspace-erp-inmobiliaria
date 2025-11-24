/**
 * ML Predictor Interface
 *
 * Contrato para futuros modelos de Machine Learning
 *
 * IMPORTANTE: Este archivo define SOLO las interfaces.
 * NO incluye implementación de modelos ML reales.
 * Los servicios actuales usan heurísticas como placeholder.
 */

/**
 * ML Predictor Interface
 *
 * Define el contrato para servicios de predicción ML
 */
export interface IMLPredictor {
  /**
   * Predecir probabilidad de completitud del curso
   *
   * @param studentData - Datos del estudiante para predicción
   * @returns Probabilidad entre 0 y 1 (0% a 100%)
   *
   * @example
   * const completionProb = await predictor.predictCompletion(studentData);
   * // 0.85 = 85% probabilidad de completar el curso
   */
  predictCompletion(studentData: StudentMLInput): Promise<number>;

  /**
   * Predecir riesgo de abandono
   *
   * @param studentData - Datos del estudiante para predicción
   * @returns Riesgo entre 0 y 1 (0% a 100%)
   *
   * @example
   * const dropoutRisk = await predictor.predictDropoutRisk(studentData);
   * // 0.35 = 35% riesgo de abandono
   */
  predictDropoutRisk(studentData: StudentMLInput): Promise<number>;

  /**
   * Predecir nivel de riesgo categórico
   *
   * @param studentData - Datos del estudiante para predicción
   * @returns Nivel de riesgo: 'low', 'medium', o 'high'
   */
  predictRiskLevel(studentData: StudentMLInput): Promise<'low' | 'medium' | 'high'>;

  /**
   * Obtener características (features) importantes del modelo
   *
   * Útil para explicabilidad del modelo (explainable AI)
   *
   * @param studentData - Datos del estudiante
   * @returns Array de features con sus pesos de importancia
   */
  getFeatureImportance(studentData: StudentMLInput): Promise<FeatureImportance[]>;

  /**
   * Obtener versión del modelo ML
   *
   * @returns String con versión (ej: "1.2.3" o "heuristic-0.1")
   */
  getModelVersion(): string;
}

/**
 * Datos de entrada para el modelo ML
 *
 * Estructura estandarizada de features para predicciones
 */
export interface StudentMLInput {
  // ===== Métricas de Rendimiento =====
  /**
   * Puntuación promedio del estudiante (0-100)
   */
  average_score: number;

  /**
   * Número de ejercicios completados
   */
  completed_exercises: number;

  /**
   * Total de ejercicios disponibles/asignados
   */
  total_exercises: number;

  /**
   * Número de módulos completados
   */
  completed_modules: number;

  /**
   * Total de módulos disponibles/asignados
   */
  total_modules: number;

  // ===== Métricas de Engagement =====
  /**
   * Racha actual de días consecutivos con actividad
   */
  current_streak_days: number;

  /**
   * Racha más larga registrada (histórico)
   */
  longest_streak_days: number;

  /**
   * Tiempo total invertido en la plataforma (minutos)
   */
  total_time_spent_minutes: number;

  /**
   * Tiempo promedio por ejercicio (minutos)
   */
  avg_time_per_exercise: number;

  // ===== Indicadores de Dificultad =====
  /**
   * Número de áreas donde el estudiante tiene dificultades
   */
  struggle_areas_count: number;

  /**
   * Tasa de éxito promedio en áreas de dificultad (0-1)
   */
  avg_struggle_success_rate: number;

  // ===== Comparación con Clase =====
  /**
   * Percentil del estudiante en puntuación (0-100)
   * Ej: 75 = mejor que el 75% de la clase
   */
  score_percentile: number;

  /**
   * Percentil del estudiante en ejercicios completados (0-100)
   */
  exercises_percentile: number;

  // ===== Métricas Temporales =====
  /**
   * Días desde la última actividad
   * Valor alto indica inactividad
   */
  days_since_last_activity: number;

  /**
   * Edad de la cuenta en días
   */
  account_age_days: number;

  // ===== Datos Históricos (Opcionales) =====
  /**
   * Tendencia de puntuaciones (últimos N ejercicios)
   * Útil para análisis de series temporales
   */
  score_trend?: number[];

  /**
   * Tendencia de actividad (actividad por semana)
   * Útil para detectar patrones de engagement
   */
  activity_trend?: number[];
}

/**
 * Importancia de características (Feature Importance)
 *
 * Representa qué tan importante es cada característica en las predicciones
 * del modelo. Útil para explicabilidad (Explainable AI).
 */
export interface FeatureImportance {
  /**
   * Nombre de la característica (debe coincidir con StudentMLInput)
   */
  feature_name: string;

  /**
   * Peso de importancia (0 a 1)
   * Valores más altos = mayor importancia en predicciones
   */
  importance: number;

  /**
   * Descripción legible de la característica
   */
  description: string;
}

/**
 * Configuración de modelo ML
 *
 * Parámetros de configuración para modelos ML externos
 */
export interface MLModelConfig {
  /**
   * URL del servicio ML (si es externo)
   */
  serviceUrl?: string;

  /**
   * API key para autenticación
   */
  apiKey?: string;

  /**
   * Timeout para peticiones (ms)
   */
  timeout?: number;

  /**
   * Versión del modelo a usar
   */
  modelVersion?: string;

  /**
   * Ambiente del modelo (dev, staging, prod)
   */
  environment?: 'development' | 'staging' | 'production';
}

/**
 * Respuesta de predicción ML
 *
 * Formato estandarizado de respuestas de modelos ML
 */
export interface MLPredictionResponse {
  /**
   * Predicción principal
   */
  prediction: number;

  /**
   * Nivel de confianza (0-1)
   */
  confidence: number;

  /**
   * Versión del modelo usado
   */
  model_version: string;

  /**
   * Características importantes para esta predicción
   */
  feature_importance?: FeatureImportance[];

  /**
   * Metadata adicional
   */
  metadata?: Record<string, any>;
}
