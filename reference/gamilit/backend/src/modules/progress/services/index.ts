/**
 * Progress Tracking Services - Barrel Export
 *
 * @description Exporta todos los servicios CORE del módulo de Progress Tracking
 * @usage import { ModuleProgressService, LearningSessionService, ExerciseAttemptService } from '@/modules/progress/services';
 *
 * Services incluidos:
 * - ModuleProgressService: Gestión de progreso por módulo
 * - LearningSessionService: Tracking de sesiones de aprendizaje
 * - ExerciseAttemptService: Gestión de intentos de ejercicios
 * - ExerciseSubmissionService: Envíos finales y calificaciones
 * - ScheduledMissionService: Misiones programadas para aulas
 */

export * from './module-progress.service';
export * from './learning-session.service';
export * from './exercise-attempt.service';
export * from './exercise-submission.service';
export * from './scheduled-mission.service';
