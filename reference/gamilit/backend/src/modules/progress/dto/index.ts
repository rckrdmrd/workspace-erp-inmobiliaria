/**
 * Progress Tracking DTOs - Barrel Export
 *
 * @description Exportación centralizada de todos los DTOs del módulo Progress
 * @module progress/dto
 *
 * DTOs incluidos:
 * - ModuleProgress: Create + Response
 * - LearningSession: Create + Response
 * - ExerciseAttempt: Create + Response
 * - ExerciseSubmission: Create + Response
 * - ScheduledMission: Create + Response
 */

// ModuleProgress DTOs
export { CreateModuleProgressDto } from './create-module-progress.dto';
export { ModuleProgressResponseDto } from './module-progress-response.dto';

// LearningSession DTOs
export { CreateLearningSessionDto } from './create-learning-session.dto';
export { LearningSessionResponseDto } from './learning-session-response.dto';

// ExerciseAttempt DTOs
export { CreateExerciseAttemptDto } from './create-exercise-attempt.dto';
export { ExerciseAttemptResponseDto } from './exercise-attempt-response.dto';

// ExerciseSubmission DTOs
export { CreateExerciseSubmissionDto } from './create-exercise-submission.dto';
export { ExerciseSubmissionResponseDto } from './exercise-submission-response.dto';

// ScheduledMission DTOs
export { CreateScheduledMissionDto } from './create-scheduled-mission.dto';
export { ScheduledMissionResponseDto } from './scheduled-mission-response.dto';
