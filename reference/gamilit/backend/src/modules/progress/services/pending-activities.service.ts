import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleProgress } from '../entities/module-progress.entity';
import { Module } from '../../educational/entities/module.entity';
import {
  GetPendingActivitiesDto,
  PendingActivityDto,
  ActivityType,
  ActivityPriority,
} from '../dto/pending-activities.dto';

/**
 * PendingActivitiesService
 * Handles logic for generating user's pending activities
 */
@Injectable()
export class PendingActivitiesService {
  constructor(
    @InjectRepository(ModuleProgress, 'progress')
    private readonly moduleProgressRepository: Repository<ModuleProgress>,

    @InjectRepository(Module, 'educational')
    private readonly moduleRepository: Repository<Module>,
  ) {}

  /**
   * Get pending activities for a user
   * @param userId - User ID
   * @param query - Query parameters for filtering
   * @returns List of pending activities
   */
  async getPendingActivities(
    userId: string,
    query: GetPendingActivitiesDto,
  ): Promise<PendingActivityDto[]> {
    const { type, priority, limit = 10 } = query;

    // Get user's module progress for incomplete modules
    const progressQuery = this.moduleProgressRepository
      .createQueryBuilder('progress')
      .where('progress.user_id = :userId', { userId })
      .andWhere('progress.status IN (:...statuses)', {
        statuses: ['not_started', 'in_progress'],
      })
      .orderBy('progress.updated_at', 'DESC')
      .limit(limit * 2); // Get more to filter later

    const progressData = await progressQuery.getMany();

    // Load modules for progress
    const moduleIds = progressData.map((p) => p.module_id);
    if (moduleIds.length === 0) {
      return [];
    }

    const modules = await this.moduleRepository
      .createQueryBuilder('module')
      .where('module.id IN (:...moduleIds)', { moduleIds })
      .getMany();

    const moduleMap = new Map(modules.map((m) => [m.id, m]));

    // Generate pending activities from incomplete modules
    const activities: PendingActivityDto[] = [];

    for (const progress of progressData) {
      const module = moduleMap.get(progress.module_id);
      if (!module) continue;

      // Calculate priority based on progress and deadline
      const activityPriority = this.calculatePriority(progress);

      // Filter by priority if specified
      if (priority && activityPriority !== priority) {
        continue;
      }

      // Calculate estimated time per exercise
      const estimatedMinutesPerExercise = module.estimated_duration_minutes
        ? Math.ceil(module.estimated_duration_minutes / Math.max(module.total_exercises || 1, 1))
        : 15;

      const activity: PendingActivityDto = {
        id: `activity-${module.id}`,
        type: ActivityType.EXERCISE, // Default to exercise
        title: module.title,
        module_name: module.title,
        module_id: module.id,
        difficulty: module.difficulty_level,
        estimated_minutes: estimatedMinutesPerExercise,
        due_date: progress.deadline || undefined,
        priority: activityPriority,
        xp_reward: module.xp_reward || 50,
        ml_coins_reward: module.ml_coins_reward || 10,
        progress_percentage: progress.progress_percentage,
      };

      // Filter by type if specified
      if (!type || activity.type === type) {
        activities.push(activity);
      }

      // Stop when we have enough activities
      if (activities.length >= limit) {
        break;
      }
    }

    return activities;
  }

  /**
   * Calculate priority for an activity
   * @param progress - Module progress
   * @returns Priority level
   */
  private calculatePriority(progress: ModuleProgress): ActivityPriority {
    // High priority: has deadline within 3 days or already in progress with > 25% completion
    if (progress.deadline) {
      const daysUntilDue = this.getDaysUntilDue(progress.deadline);
      if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        return ActivityPriority.HIGH;
      }
      if (daysUntilDue < 0) {
        return ActivityPriority.HIGH; // Overdue
      }
    }

    // High priority: in progress with > 50% completion
    if (
      progress.status === 'in_progress' &&
      progress.progress_percentage > 50
    ) {
      return ActivityPriority.HIGH;
    }

    // Medium priority: in progress or has deadline within 7 days
    if (progress.status === 'in_progress') {
      return ActivityPriority.MEDIUM;
    }

    if (progress.deadline) {
      const daysUntilDue = this.getDaysUntilDue(progress.deadline);
      if (daysUntilDue <= 7 && daysUntilDue > 3) {
        return ActivityPriority.MEDIUM;
      }
    }

    // Low priority: not started or distant deadline
    return ActivityPriority.LOW;
  }

  /**
   * Calculate days until due date
   * @param dueDate - Due date
   * @returns Number of days until due
   */
  private getDaysUntilDue(dueDate: Date): number {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
