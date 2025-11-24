import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_SCHEMAS } from '@/shared/constants';
import * as entities from './entities';
import * as services from './services';
import * as controllers from './controllers';
import { PendingActivitiesService } from './services/pending-activities.service';
import { RecentActivityService } from './services/recent-activity.service';
import { Module as EducationalModule } from '../educational/entities/module.entity';
import { Exercise } from '../educational/entities/exercise.entity';
import { Profile } from '../auth/entities/profile.entity';
import { GamificationModule } from '../gamification/gamification.module';

/**
 * ProgressModule
 *
 * @description Módulo de Progress Tracking para gestión de progreso de estudiantes.
 *
 * Responsabilidades:
 * - Tracking de progreso por módulo educativo
 * - Gestión de sesiones de aprendizaje
 * - Registro de intentos y envíos de ejercicios
 * - Misiones programadas para aulas (classroom-based)
 * - Analytics y estadísticas de aprendizaje
 * - Notas de profesores sobre estudiantes
 *
 * Entidades (8):
 * - ModuleProgress: Progreso de estudiantes por módulo
 * - LearningSession: Sesiones de aprendizaje con tracking de tiempo
 * - ExerciseAttempt: Intentos individuales de ejercicios
 * - ExerciseSubmission: Envíos finales y calificaciones
 * - ScheduledMission: Misiones programadas con deadlines
 * - TeacherNote: Notas de profesores sobre estudiantes
 * - EngagementMetrics: Métricas diarias de engagement
 * - MasteryTracking: Seguimiento de dominio de temas
 *
 * Services (5):
 * - ModuleProgressService: 11 métodos CRUD + analytics
 * - LearningSessionService: 8 métodos de tracking de sesiones
 * - ExerciseAttemptService: 12 métodos de intentos y scoring
 * - ExerciseSubmissionService: 13 métodos de submissions y grading
 * - ScheduledMissionService: 13 métodos de misiones colectivas
 *
 * Controllers (5):
 * - ModuleProgressController: 10 endpoints REST
 * - LearningSessionController: 8 endpoints REST
 * - ExerciseAttemptController: 9 endpoints REST
 * - ExerciseSubmissionController: 11 endpoints REST
 * - ScheduledMissionController: 9 endpoints REST
 *
 * Total: 47 endpoints REST API
 *
 * @see /docs/02-especificaciones-tecnicas/apis/progress-api/README.md
 */
@NestModule({
  imports: [
    // Connection 'progress' handles schema 'progress_tracking'
    TypeOrmModule.forFeature(
      [
        entities.ModuleProgress,
        entities.LearningSession,
        entities.ExerciseAttempt,
        entities.ExerciseSubmission,
        entities.ScheduledMission,
        entities.TeacherNote, // ✨ NUEVO - P0 (Notas del profesor)
        entities.EngagementMetrics, // ✨ NUEVO - P2 (Analytics)
        entities.MasteryTracking, // ✨ NUEVO - P2 (Adaptive Learning)
        entities.LearningPath, // ✨ NUEVO - P2 (Rutas de aprendizaje)
        entities.UserLearningPath, // ✨ NUEVO - P2 (Usuarios en rutas)
        entities.ProgressSnapshot, // ✨ NUEVO - P2 (Snapshots históricos)
        entities.SkillAssessment, // ✨ NUEVO - P2 (Evaluaciones de habilidades)
      ],
      'progress',
    ),
    // Import Module and Exercise entities from educational schema
    TypeOrmModule.forFeature([EducationalModule, Exercise], 'educational'),
    // Import Profile entity from auth schema (for ExerciseSubmissionService)
    TypeOrmModule.forFeature([Profile], 'auth'),
    // Import GamificationModule for MLCoinsService and UserStatsService
    GamificationModule,
  ],
  providers: [
    services.ModuleProgressService,
    services.LearningSessionService,
    services.ExerciseAttemptService,
    services.ExerciseSubmissionService,
    services.ScheduledMissionService,
    PendingActivitiesService,
    RecentActivityService,
  ],
  controllers: [
    controllers.ModuleProgressController,
    controllers.LearningSessionController,
    controllers.ExerciseAttemptController,
    controllers.ExerciseSubmissionController,
    controllers.ScheduledMissionController,
  ],
  exports: [
    services.ModuleProgressService,
    services.LearningSessionService,
    services.ExerciseAttemptService,
    services.ExerciseSubmissionService,
    services.ScheduledMissionService,
  ],
})
export class ProgressModule {}
