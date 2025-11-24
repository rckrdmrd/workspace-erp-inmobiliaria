import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, UserAchievement, UserStats } from '../entities';
import { DB_SCHEMAS } from '@shared/constants';
import { GrantAchievementDto } from '../dto';

/**
 * AchievementsService
 *
 * Gestión completa del sistema de logros (achievements)
 * - CRUD de definiciones de logros
 * - Otorgamiento de logros a usuarios
 * - Seguimiento de progreso
 * - Detección automática de logros ganados
 */
@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement, 'gamification')
    private readonly achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement, 'gamification')
    private readonly userAchievementRepo: Repository<UserAchievement>,
    @InjectRepository(UserStats, 'gamification')
    private readonly userStatsRepo: Repository<UserStats>,
  ) {}

  /**
   * Obtiene todos los achievements activos
   */
  async findAll(includeSecret: boolean = false): Promise<Achievement[]> {
    const query = this.achievementRepo.createQueryBuilder('a').where('a.is_active = true');

    if (!includeSecret) {
      query.andWhere('a.is_secret = false');
    }

    return await query.orderBy('a.order_index', 'ASC').addOrderBy('a.name', 'ASC').getMany();
  }

  /**
   * Busca un achievement por ID
   */
  async findById(achievementId: string): Promise<Achievement> {
    const achievement = await this.achievementRepo.findOne({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException(`Achievement ${achievementId} not found`);
    }

    return achievement;
  }

  /**
   * Busca achievements por categoría
   */
  async findByCategory(category: string): Promise<Achievement[]> {
    return await this.achievementRepo.find({
      where: { category, is_active: true } as any,
      order: { order_index: 'ASC' },
    });
  }

  /**
   * Obtiene logros completados por un usuario
   */
  async getCompletedByUser(userId: string): Promise<UserAchievement[]> {
    return await this.userAchievementRepo.find({
      where: {
        user_id: userId,
        is_completed: true,
      },
    });
  }

  /**
   * Obtiene logros en progreso para un usuario
   */
  async getInProgressByUser(userId: string): Promise<UserAchievement[]> {
    return await this.userAchievementRepo.find({
      where: {
        user_id: userId,
        is_completed: false,
      },
    });
  }

  /**
   * Otorga un achievement a un usuario
   */
  async grantAchievement(
    userId: string,
    grantDto: GrantAchievementDto,
  ): Promise<UserAchievement> {
    // Validar que el achievement existe
    await this.findById(grantDto.achievement_id);

    // Buscar si ya existe el registro
    let userAchievement = await this.userAchievementRepo.findOne({
      where: {
        user_id: userId,
        achievement_id: grantDto.achievement_id,
      },
    });

    if (!userAchievement) {
      // Crear nuevo registro
      userAchievement = this.userAchievementRepo.create({
        user_id: userId,
        achievement_id: grantDto.achievement_id,
        progress: grantDto.progress || 0,
        max_progress: grantDto.max_progress || 100,
        is_completed: grantDto.is_completed || false,
        progress_data: grantDto.progress_data || {},
        metadata: grantDto.metadata || {},
      });
    } else {
      // Actualizar progreso
      if (grantDto.progress !== undefined) {
        userAchievement.progress = grantDto.progress;
      }
      if (grantDto.max_progress !== undefined) {
        userAchievement.max_progress = grantDto.max_progress;
      }
      if (grantDto.is_completed !== undefined) {
        userAchievement.is_completed = grantDto.is_completed;
      }
      if (grantDto.progress_data) {
        userAchievement.progress_data = grantDto.progress_data;
      }
      if (grantDto.metadata) {
        userAchievement.metadata = grantDto.metadata;
      }
    }

    // Actualizar completion_percentage
    userAchievement.completion_percentage = Number(
      ((userAchievement.progress / userAchievement.max_progress) * 100).toFixed(2),
    );

    // Si está completado, establecer fecha
    if (userAchievement.is_completed && !userAchievement.completed_at) {
      userAchievement.completed_at = new Date();
    }

    return await this.userAchievementRepo.save(userAchievement);
  }

  /**
   * Verifica el progreso de un achievement específico
   */
  async checkProgress(userId: string, achievementId: string): Promise<UserAchievement> {
    const userAchievement = await this.userAchievementRepo.findOne({
      where: {
        user_id: userId,
        achievement_id: achievementId,
      },
    });

    if (!userAchievement) {
      throw new NotFoundException(
        `Achievement ${achievementId} not found for user ${userId}`,
      );
    }

    return userAchievement;
  }

  /**
   * Incrementa el progreso de un achievement
   */
  async incrementProgress(
    userId: string,
    achievementId: string,
    amount: number = 1,
  ): Promise<UserAchievement> {
    const userAchievement = await this.checkProgress(userId, achievementId);
    userAchievement.progress += amount;

    // Verificar si se completó
    if (userAchievement.progress >= userAchievement.max_progress && !userAchievement.is_completed) {
      userAchievement.progress = userAchievement.max_progress;
      userAchievement.is_completed = true;
      userAchievement.completed_at = new Date();
    }

    // Actualizar porcentaje
    userAchievement.completion_percentage = Number(
      ((userAchievement.progress / userAchievement.max_progress) * 100).toFixed(2),
    );

    return await this.userAchievementRepo.save(userAchievement);
  }

  /**
   * Detecta y otorga logros automáticamente basado en estadísticas del usuario
   * Lógica de auto-detection según condiciones
   */
  async detectAndGrantEarned(userId: string): Promise<UserAchievement[]> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    const grantedAchievements: UserAchievement[] = [];
    const allAchievements = await this.findAll();

    for (const achievement of allAchievements) {
      // Verificar si el usuario ya tiene este logro completado
      const existing = await this.userAchievementRepo.findOne({
        where: {
          user_id: userId,
          achievement_id: achievement.id,
          is_completed: true,
        },
      });

      if (!achievement.is_repeatable && existing) {
        continue; // Saltar si no es repetible y ya está completado
      }

      // Evaluar condiciones
      if (this.meetsConditions(userStats, achievement.conditions)) {
        const grantDto = new GrantAchievementDto();
        grantDto.user_id = userId;
        grantDto.achievement_id = achievement.id;
        grantDto.progress = achievement.conditions.progress || achievement.conditions.max_progress || 100;
        grantDto.max_progress = achievement.conditions.max_progress || 100;
        grantDto.is_completed = true;
        grantDto.progress_data = { auto_detected: true };

        const granted = await this.grantAchievement(userId, grantDto);
        grantedAchievements.push(granted);
      }
    }

    return grantedAchievements;
  }

  /**
   * Evalúa si las estadísticas del usuario cumplen con las condiciones del logro
   */
  private meetsConditions(userStats: UserStats, conditions: Record<string, any>): boolean {
    const type = conditions.type || 'generic';

    switch (type) {
      case 'progress':
        return (
          userStats.exercises_completed >= (conditions.exercises_completed || 0) &&
          userStats.modules_completed >= (conditions.modules_completed || 0)
        );

      case 'streak':
        return userStats.current_streak >= (conditions.min_streak || 0);

      case 'level':
        return userStats.level >= (conditions.min_level || 0);

      case 'score':
        return (
          (userStats.average_score || 0) >= (conditions.min_average_score || 0) &&
          userStats.perfect_scores >= (conditions.min_perfect_scores || 0)
        );

      case 'rank':
        return this.userReachedRank(userStats.current_rank, conditions.target_rank);

      case 'ml_coins':
        return userStats.ml_coins_earned_total >= (conditions.min_coins_earned || 0);

      default:
        return false;
    }
  }

  /**
   * Helper: verifica si el usuario alcanzó un rango específico
   */
  private userReachedRank(currentRank: string, targetRank: string): boolean {
    const RANKS = ['Ajaw', 'Nacom', "Ah K'in", 'Halach Uinic', "K'uk'ulkan"];
    const currentIndex = RANKS.indexOf(currentRank);
    const targetIndex = RANKS.indexOf(targetRank);

    return currentIndex >= targetIndex;
  }

  /**
   * Reclamar recompensas de un achievement completado
   */
  async claimRewards(userId: string, achievementId: string): Promise<UserAchievement> {
    const userAchievement = await this.checkProgress(userId, achievementId);

    if (!userAchievement.is_completed) {
      throw new BadRequestException(`Achievement ${achievementId} is not completed yet`);
    }

    if (userAchievement.rewards_claimed) {
      throw new BadRequestException(`Rewards already claimed for achievement ${achievementId}`);
    }

    userAchievement.rewards_claimed = true;

    return await this.userAchievementRepo.save(userAchievement);
  }

  /**
   * Obtiene estadísticas de logros para un usuario
   */
  async getUserAchievementStats(userId: string): Promise<{
    total_available: number;
    completed: number;
    completion_percentage: number;
    unclaimed_rewards: number;
  }> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    const allAchievements = await this.findAll();
    const userAchievements = await this.userAchievementRepo.find({
      where: { user_id: userId },
    });

    const completed = userAchievements.filter((ua) => ua.is_completed).length;
    const unclaimedRewards = userAchievements.filter(
      (ua) => ua.is_completed && !ua.rewards_claimed,
    ).length;

    return {
      total_available: allAchievements.length,
      completed,
      completion_percentage: Number(
        ((completed / allAchievements.length) * 100).toFixed(2),
      ),
      unclaimed_rewards: unclaimedRewards,
    };
  }
}
