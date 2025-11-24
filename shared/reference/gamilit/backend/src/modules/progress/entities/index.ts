/**
 * Progress Tracking Entities - Barrel Export
 *
 * @description Exportación centralizada de todas las entidades del módulo Progress
 * @module progress/entities
 *
 * Entidades incluidas:
 * - ModuleProgress: Progreso de estudiantes por módulo
 * - LearningSession: Sesiones de aprendizaje con tracking
 * - ExerciseAttempt: Intentos individuales de ejercicios
 * - ExerciseSubmission: Envíos finales de ejercicios
 * - ScheduledMission: Misiones programadas para aulas
 * - TeacherNote: Notas de profesores sobre estudiantes
 * - EngagementMetrics: Métricas diarias de engagement
 * - MasteryTracking: Seguimiento de dominio de temas
 */

export { ModuleProgress } from './module-progress.entity';
export { LearningSession } from './learning-session.entity';
export { ExerciseAttempt } from './exercise-attempt.entity';
export { ExerciseSubmission } from './exercise-submission.entity';
export { ScheduledMission } from './scheduled-mission.entity';
export { TeacherNote } from './teacher-note.entity'; // ✨ NUEVO - P0 (Notas del profesor)
export { EngagementMetrics } from './engagement-metrics.entity'; // ✨ NUEVO - P2 (Analytics)
export { MasteryTracking } from './mastery-tracking.entity'; // ✨ NUEVO - P2 (Adaptive Learning)
export { LearningPath } from './learning-path.entity'; // ✨ NUEVO - P2 (Rutas de aprendizaje)
export { UserLearningPath } from './user-learning-path.entity'; // ✨ NUEVO - P2 (Usuarios en rutas)
export { ProgressSnapshot } from './progress-snapshot.entity'; // ✨ NUEVO - P2 (Snapshots históricos)
export { SkillAssessment } from './skill-assessment.entity'; // ✨ NUEVO - P2 (Evaluaciones de habilidades)
