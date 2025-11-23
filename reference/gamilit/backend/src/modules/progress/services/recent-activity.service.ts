import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleProgress } from '../entities/module-progress.entity';
import { LearningSession } from '../entities/learning-session.entity';
import { ExerciseSubmission } from '../entities/exercise-submission.entity';
import { Module as EducationalModule } from '../../educational/entities/module.entity';
import { Exercise } from '../../educational/entities/exercise.entity';
import {
  GetRecentActivitiesDto,
  RecentActivityDto,
  ActivityAction,
} from '../dto/recent-activity.dto';

/**
 * RecentActivityService
 * Generates a feed of user's recent learning activities
 */
@Injectable()
export class RecentActivityService {
  constructor(
    @InjectRepository(ModuleProgress, 'progress')
    private readonly moduleProgressRepository: Repository<ModuleProgress>,

    @InjectRepository(LearningSession, 'progress')
    private readonly learningSessionRepository: Repository<LearningSession>,

    @InjectRepository(ExerciseSubmission, 'progress')
    private readonly exerciseSubmissionRepository: Repository<ExerciseSubmission>,

    @InjectRepository(EducationalModule, 'educational')
    private readonly moduleRepository: Repository<EducationalModule>,

    @InjectRepository(Exercise, 'educational')
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  /**
   * Get recent activities for a user
   * @param userId - User ID
   * @param query - Query parameters for pagination
   * @returns List of recent activities
   */
  async getRecentActivities(
    userId: string,
    query: GetRecentActivitiesDto,
  ): Promise<RecentActivityDto[]> {
    const { limit = 20, offset = 0 } = query;
    const activities: RecentActivityDto[] = [];

    // Get recent module completions
    const completedModules = await this.moduleProgressRepository
      .createQueryBuilder('progress')
      .where('progress.user_id = :userId', { userId })
      .andWhere('progress.status = :status', { status: 'completed' })
      .andWhere('progress.completed_at IS NOT NULL')
      .orderBy('progress.completed_at', 'DESC')
      .limit(10)
      .getMany();

    // Load modules for completed progress
    if (completedModules.length > 0) {
      const moduleIds = completedModules.map((p) => p.module_id);
      const modules = await this.moduleRepository
        .createQueryBuilder('module')
        .where('module.id IN (:...moduleIds)', { moduleIds })
        .getMany();

      const moduleMap = new Map(modules.map((m) => [m.id, m]));

      for (const progress of completedModules) {
        const module = moduleMap.get(progress.module_id);
        if (progress.completed_at && module) {
          activities.push({
            id: `module-completed-${progress.id}`,
            user_id: userId,
            action: ActivityAction.COMPLETED_MODULE,
            description: `Completó el módulo "${module.title}"`,
            entity_type: 'module',
            entity_id: module.id,
            entity_name: module.title,
            metadata: {
              xp_earned: progress.total_xp_earned,
              ml_coins_earned: progress.total_ml_coins_earned,
              progress_percentage: progress.progress_percentage,
            },
            created_at: progress.completed_at,
          });
        }
      }
    }

    // Get recent module starts
    const startedModules = await this.moduleProgressRepository
      .createQueryBuilder('progress')
      .where('progress.user_id = :userId', { userId })
      .andWhere('progress.status IN (:...statuses)', {
        statuses: ['in_progress', 'not_started'],
      })
      .andWhere('progress.started_at IS NOT NULL')
      .orderBy('progress.started_at', 'DESC')
      .limit(10)
      .getMany();

    // Load modules for started progress
    if (startedModules.length > 0) {
      const moduleIds = startedModules.map((p) => p.module_id);
      const modules = await this.moduleRepository
        .createQueryBuilder('module')
        .where('module.id IN (:...moduleIds)', { moduleIds })
        .getMany();

      const moduleMap = new Map(modules.map((m) => [m.id, m]));

      for (const progress of startedModules) {
        const module = moduleMap.get(progress.module_id);
        if (progress.started_at && module) {
          activities.push({
            id: `module-started-${progress.id}`,
            user_id: userId,
            action: ActivityAction.STARTED_MODULE,
            description: `Comenzó el módulo "${module.title}"`,
            entity_type: 'module',
            entity_id: module.id,
            entity_name: module.title,
            metadata: {
              difficulty: module.difficulty_level,
            },
            created_at: progress.started_at,
          });
        }
      }
    }

    // Get recent exercise completions
    const recentSubmissions = await this.exerciseSubmissionRepository
      .createQueryBuilder('submission')
      .where('submission.user_id = :userId', { userId })
      .andWhere('submission.is_correct = :isCorrect', { isCorrect: true })
      .orderBy('submission.submitted_at', 'DESC')
      .limit(15)
      .getMany();

    // Load exercises for submissions
    if (recentSubmissions.length > 0) {
      const exerciseIds = recentSubmissions.map((s) => s.exercise_id);
      const exercises = await this.exerciseRepository
        .createQueryBuilder('exercise')
        .where('exercise.id IN (:...exerciseIds)', { exerciseIds })
        .getMany();

      const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

      for (const submission of recentSubmissions) {
        const exercise = exerciseMap.get(submission.exercise_id);
        if (exercise) {
          activities.push({
            id: `exercise-completed-${submission.id}`,
            user_id: userId,
            action: ActivityAction.COMPLETED_EXERCISE,
            description: `Completó el ejercicio "${exercise.title}"`,
            entity_type: 'exercise',
            entity_id: exercise.id,
            entity_name: exercise.title,
            metadata: {
              score: submission.score,
              max_score: submission.max_score,
            },
            created_at: submission.submitted_at,
          });
        }
      }
    }

    // Get recent learning sessions
    const recentSessions = await this.learningSessionRepository
      .createQueryBuilder('session')
      .where('session.user_id = :userId', { userId })
      .orderBy('session.started_at', 'DESC')
      .limit(10)
      .getMany();

    // Load modules for sessions
    if (recentSessions.length > 0) {
      const moduleIds = recentSessions
        .map((s) => s.module_id)
        .filter((id): id is string => id !== undefined);

      if (moduleIds.length > 0) {
        const modules = await this.moduleRepository
          .createQueryBuilder('module')
          .where('module.id IN (:...moduleIds)', { moduleIds })
          .getMany();

        const moduleMap = new Map(modules.map((m) => [m.id, m]));

        for (const session of recentSessions) {
          if (!session.module_id) continue;

          const module = moduleMap.get(session.module_id);
          if (module) {
            activities.push({
              id: `session-started-${session.id}`,
              user_id: userId,
              action: ActivityAction.STARTED_SESSION,
              description: `Inició una sesión de estudio en "${module.title}"`,
              entity_type: 'session',
              entity_id: session.id,
              entity_name: module.title,
              metadata: {
                duration: session.duration || null,
              },
              created_at: session.started_at,
            });
          }
        }
      }
    }

    // Sort all activities by date (newest first)
    activities.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );

    // Apply pagination
    return activities.slice(offset, offset + limit);
  }

  /**
   * Get activity count for a user
   * @param userId - User ID
   * @returns Total activity count
   */
  async getActivityCount(userId: string): Promise<number> {
    const [
      completedCount,
      startedCount,
      submissionsCount,
      sessionsCount,
    ] = await Promise.all([
      this.moduleProgressRepository.count({
        where: { user_id: userId, status: 'completed' as any },
      }),
      this.moduleProgressRepository.count({
        where: { user_id: userId, status: 'in_progress' as any },
      }),
      this.exerciseSubmissionRepository.count({
        where: { user_id: userId },
      }),
      this.learningSessionRepository.count({
        where: { user_id: userId },
      }),
    ]);

    return (
      completedCount + startedCount + submissionsCount + sessionsCount
    );
  }
}
