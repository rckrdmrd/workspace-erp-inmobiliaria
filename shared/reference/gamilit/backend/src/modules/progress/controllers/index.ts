/**
 * Progress Tracking Controllers - Barrel Export
 *
 * @description Exporta todos los controllers del módulo de Progress Tracking
 * @usage import { ModuleProgressController, LearningSessionController } from '@/modules/progress/controllers';
 *
 * Controllers incluidos:
 * - ModuleProgressController: Gestión de progreso por módulo (10 endpoints)
 * - LearningSessionController: Tracking de sesiones de aprendizaje (8 endpoints)
 * - ExerciseAttemptController: Gestión de intentos de ejercicios (9 endpoints)
 * - ExerciseSubmissionController: Envíos finales y calificaciones (11 endpoints)
 * - ScheduledMissionController: Misiones programadas para aulas (9 endpoints)
 *
 * Total: 47 endpoints REST API
 */

export * from './module-progress.controller';
export * from './learning-session.controller';
export * from './exercise-attempt.controller';
export * from './exercise-submission.controller';
export * from './scheduled-mission.controller';
