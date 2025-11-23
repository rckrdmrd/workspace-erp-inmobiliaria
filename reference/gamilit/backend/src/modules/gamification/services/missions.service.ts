import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Mission, MissionTypeEnum, MissionStatusEnum, MissionObjective, MissionRewards } from '../entities/mission.entity';
import { MissionStatsDto } from '../dto/missions/mission-stats.dto';
import { MLCoinsService } from './ml-coins.service';
import { UserStatsService } from './user-stats.service';
import { TransactionTypeEnum } from '@shared/constants/enums.constants';
import { Profile } from '@/modules/auth/entities/profile.entity';

/**
 * MissionsService
 *
 * @description Gestión completa del sistema de misiones gamificadas
 *
 * Características principales:
 * - Generación automática de misiones diarias (3 misiones)
 * - Generación automática de misiones semanales (2 misiones)
 * - Sistema de progreso multi-objetivo
 * - Sistema de reclamación de recompensas con ML Coins y XP
 * - Estadísticas detalladas de misiones
 * - Expiración automática de misiones vencidas
 *
 * Tipos de misiones:
 * - Daily: 3 misiones renovadas cada día (ejercicios, rachas, tiempo de estudio)
 * - Weekly: 2 misiones renovadas cada semana (maratón, racha semanal)
 * - Special: Misiones creadas manualmente para eventos especiales
 *
 * @see Entity: Mission (@/modules/gamification/entities/mission.entity)
 * @see DDL: /apps/database/ddl/schemas/gamification_system/tables/06-missions.sql
 */
@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);

  constructor(
    @InjectRepository(Mission, 'gamification')
    private readonly missionsRepo: Repository<Mission>,
    @InjectRepository(Profile, 'auth')
    private readonly profileRepo: Repository<Profile>,
    private readonly mlCoinsService: MLCoinsService,
    private readonly userStatsService: UserStatsService,
  ) {}

  /**
   * Helper method to get profile.id from auth.users.id
   *
   * @description Missions table FK references profiles.id, but JWT contains auth.users.id.
   * This method converts auth.users.id → profiles.id
   *
   * @param userId - auth.users.id (from JWT token)
   * @returns profiles.id
   * @throws NotFoundException if profile doesn't exist
   */
  private async getProfileId(userId: string): Promise<string> {
    const profile = await this.profileRepo.findOne({
      where: { user_id: userId },
      select: ['id'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    return profile.id;
  }

  /**
   * Obtiene misiones por tipo y usuario
   *
   * @description Busca misiones activas o en progreso para un usuario específico.
   * Si no existen misiones del tipo solicitado, las genera automáticamente.
   *
   * @param userId - ID del usuario (UUID)
   * @param type - Tipo de misión: 'daily', 'weekly', 'special'
   * @returns Array de misiones del tipo solicitado
   *
   * @example
   * const dailyMissions = await service.findByTypeAndUser(userId, 'daily');
   * // Retorna 3 misiones diarias (auto-generadas si no existen)
   */
  async findByTypeAndUser(
    userId: string,
    type: MissionTypeEnum,
  ): Promise<Mission[]> {
    // CRITICAL FIX: Convert auth.users.id → profiles.id
    // missions.user_id FK references profiles.id (NOT auth.users.id)
    const profileId = await this.getProfileId(userId);

    // Buscar misiones activas/in_progress del tipo solicitado
    const missions = await this.missionsRepo.find({
      where: {
        user_id: profileId,  // FIXED: usar profileId en lugar de userId
        mission_type: type,
        status: Between(MissionStatusEnum.ACTIVE, MissionStatusEnum.IN_PROGRESS),
      },
      order: {
        created_at: 'ASC',
      },
    });

    // Si no existen misiones, generar automáticamente
    if (missions.length === 0 && type !== MissionTypeEnum.SPECIAL) {
      if (type === MissionTypeEnum.DAILY) {
        return await this.generateDailyMissions(profileId);  // FIXED: pasar profileId
      } else if (type === MissionTypeEnum.WEEKLY) {
        return await this.generateWeeklyMissions(profileId);  // FIXED: pasar profileId
      }
    }

    return missions;
  }

  /**
   * Genera 3 misiones diarias automáticamente
   *
   * @description Crea 3 misiones diarias estándar con objetivos y recompensas predefinidos.
   * Las misiones expiran al final del día (23:59:59).
   *
   * Misiones generadas:
   * 1. Completar 3 ejercicios → 50 XP + 25 ML Coins
   * 2. Racha de 2 aciertos → 30 XP + 15 ML Coins
   * 3. Estudiar 15 minutos → 40 XP + 20 ML Coins
   *
   * @param userId - profiles.id (UUID) - NOT auth.users.id!
   * @returns Array de 3 misiones diarias creadas
   *
   * @example
   * const profileId = await this.getProfileId(authUserId);
   * const missions = await service.generateDailyMissions(profileId);
   * // Retorna: [Mission, Mission, Mission]
   */
  async generateDailyMissions(userId: string): Promise<Mission[]> {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Misión 1: Completar ejercicios
    const mission1 = this.missionsRepo.create({
      user_id: userId,
      template_id: 'daily_complete_exercises',
      title: 'Completar ejercicios',
      description: 'Completa 3 ejercicios hoy',
      mission_type: MissionTypeEnum.DAILY,
      objectives: [
        {
          type: 'complete_exercises',
          target: 3,
          current: 0,
          description: 'Completa 3 ejercicios',
        },
      ],
      rewards: {
        ml_coins: 25,
        xp: 50,
      },
      status: MissionStatusEnum.ACTIVE,
      progress: 0,
      start_date: now,
      end_date: endOfDay,
    });

    // Misión 2: Racha de aciertos
    const mission2 = this.missionsRepo.create({
      user_id: userId,
      template_id: 'daily_correct_streak',
      title: 'Racha de aciertos',
      description: 'Obtén una racha de 2 ejercicios correctos seguidos',
      mission_type: MissionTypeEnum.DAILY,
      objectives: [
        {
          type: 'correct_streak',
          target: 2,
          current: 0,
          description: '2 ejercicios correctos seguidos',
        },
      ],
      rewards: {
        ml_coins: 15,
        xp: 30,
      },
      status: MissionStatusEnum.ACTIVE,
      progress: 0,
      start_date: now,
      end_date: endOfDay,
    });

    // Misión 3: Tiempo de estudio
    const mission3 = this.missionsRepo.create({
      user_id: userId,
      template_id: 'daily_study_time',
      title: 'Tiempo de estudio',
      description: 'Estudia durante 15 minutos hoy',
      mission_type: MissionTypeEnum.DAILY,
      objectives: [
        {
          type: 'study_time',
          target: 15,
          current: 0,
          description: 'Estudia 15 minutos',
        },
      ],
      rewards: {
        ml_coins: 20,
        xp: 40,
      },
      status: MissionStatusEnum.ACTIVE,
      progress: 0,
      start_date: now,
      end_date: endOfDay,
    });

    // Guardar todas las misiones
    const missions = await this.missionsRepo.save([mission1, mission2, mission3]);

    return missions;
  }

  /**
   * Genera 2 misiones semanales automáticamente
   *
   * @description Crea 2 misiones semanales estándar con objetivos y recompensas predefinidos.
   * Las misiones expiran al final de la semana (domingo 23:59:59).
   *
   * Misiones generadas:
   * 1. Completar 15 ejercicios → 200 XP + 100 ML Coins
   * 2. Racha de 5 días consecutivos → 300 XP + 150 ML Coins
   *
   * @param userId - profiles.id (UUID) - NOT auth.users.id!
   * @returns Array de 2 misiones semanales creadas
   *
   * @example
   * const profileId = await this.getProfileId(authUserId);
   * const missions = await service.generateWeeklyMissions(profileId);
   * // Retorna: [Mission, Mission]
   */
  async generateWeeklyMissions(userId: string): Promise<Mission[]> {
    const now = new Date();

    // Calcular fin de semana (domingo)
    const endOfWeek = new Date(now);
    const dayOfWeek = endOfWeek.getDay(); // 0 = domingo, 6 = sábado
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    // Misión 1: Maratón de ejercicios
    const mission1 = this.missionsRepo.create({
      user_id: userId,
      template_id: 'weekly_exercise_marathon',
      title: 'Maratón de ejercicios',
      description: 'Completa 15 ejercicios esta semana',
      mission_type: MissionTypeEnum.WEEKLY,
      objectives: [
        {
          type: 'complete_exercises',
          target: 15,
          current: 0,
          description: 'Completa 15 ejercicios',
        },
      ],
      rewards: {
        ml_coins: 100,
        xp: 200,
      },
      status: MissionStatusEnum.ACTIVE,
      progress: 0,
      start_date: now,
      end_date: endOfWeek,
    });

    // Misión 2: Racha semanal
    const mission2 = this.missionsRepo.create({
      user_id: userId,
      template_id: 'weekly_consecutive_days',
      title: 'Racha semanal',
      description: 'Estudia 5 días consecutivos esta semana',
      mission_type: MissionTypeEnum.WEEKLY,
      objectives: [
        {
          type: 'consecutive_days',
          target: 5,
          current: 0,
          description: '5 días consecutivos de estudio',
        },
      ],
      rewards: {
        ml_coins: 150,
        xp: 300,
      },
      status: MissionStatusEnum.ACTIVE,
      progress: 0,
      start_date: now,
      end_date: endOfWeek,
    });

    // Guardar misiones
    const missions = await this.missionsRepo.save([mission1, mission2]);

    return missions;
  }

  /**
   * Inicia una misión (cambia status a in_progress)
   *
   * @description Marca una misión como iniciada por el usuario.
   * Solo se pueden iniciar misiones con status 'active'.
   *
   * @param missionId - ID de la misión (UUID)
   * @param userId - ID del usuario (UUID)
   * @returns Misión actualizada
   *
   * @throws {NotFoundException} Si la misión no existe
   * @throws {BadRequestException} Si la misión no pertenece al usuario o no está activa
   *
   * @example
   * const mission = await service.startMission(missionId, userId);
   * // mission.status === 'in_progress'
   */
  async startMission(missionId: string, userId: string): Promise<Mission> {
    // CRITICAL FIX: Convert auth.users.id → profiles.id
    const profileId = await this.getProfileId(userId);

    const mission = await this.missionsRepo.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    // Validar que la misión pertenece al usuario
    if (mission.user_id !== profileId) {  // FIXED: comparar con profileId
      throw new BadRequestException('Mission does not belong to this user');
    }

    // Validar que la misión está activa
    if (mission.status !== MissionStatusEnum.ACTIVE) {
      throw new BadRequestException(
        `Mission cannot be started. Current status: ${mission.status}`,
      );
    }

    // Cambiar status a in_progress
    mission.status = MissionStatusEnum.IN_PROGRESS;

    return await this.missionsRepo.save(mission);
  }

  /**
   * Actualiza el progreso de un objetivo de misión
   *
   * @description Incrementa el progreso de un objetivo específico dentro de una misión.
   * Recalcula el progreso general de la misión (0-100%).
   * Si todos los objetivos se completan, marca la misión como 'completed'.
   *
   * @param missionId - ID de la misión (UUID)
   * @param userId - ID del usuario (UUID)
   * @param objectiveType - Tipo de objetivo a actualizar
   * @param increment - Cantidad a incrementar en el objetivo
   * @returns Misión actualizada con nuevo progreso
   *
   * @throws {NotFoundException} Si la misión no existe
   * @throws {BadRequestException} Si la misión no pertenece al usuario, está expirada, o el objetivo no existe
   *
   * @example
   * // Incrementar ejercicios completados
   * const mission = await service.updateProgress(
   *   missionId,
   *   userId,
   *   'complete_exercises',
   *   1
   * );
   * // mission.objectives[0].current === 1
   * // mission.progress === 33.33
   */
  async updateProgress(
    missionId: string,
    userId: string,
    objectiveType: string,
    increment: number,
  ): Promise<Mission> {
    // CRITICAL FIX: Convert auth.users.id → profiles.id
    const profileId = await this.getProfileId(userId);

    const mission = await this.missionsRepo.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    // Validar que la misión pertenece al usuario
    if (mission.user_id !== profileId) {  // FIXED: comparar con profileId
      throw new BadRequestException('Mission does not belong to this user');
    }

    // Validar que la misión no está expirada
    if (mission.status === MissionStatusEnum.EXPIRED) {
      throw new BadRequestException('Cannot update progress: mission has expired');
    }

    // Validar que la misión no está reclamada
    if (mission.status === MissionStatusEnum.CLAIMED) {
      throw new BadRequestException('Cannot update progress: mission has been claimed');
    }

    // Buscar el objetivo a actualizar
    const objectiveIndex = mission.objectives.findIndex(
      (obj) => obj.type === objectiveType,
    );

    if (objectiveIndex === -1) {
      throw new BadRequestException(
        `Objective type '${objectiveType}' not found in mission`,
      );
    }

    // Actualizar progreso del objetivo
    const objective = mission.objectives[objectiveIndex];
    objective.current = Math.min(objective.current + increment, objective.target);

    // Actualizar objectives en la entidad
    mission.objectives[objectiveIndex] = objective;

    // Calcular progreso general de la misión (porcentaje)
    const totalProgress = mission.objectives.reduce((sum, obj) => {
      return sum + (obj.current / obj.target) * 100;
    }, 0);

    mission.progress = Math.min(totalProgress / mission.objectives.length, 100);

    // Si el progreso es 100%, marcar como completada
    if (mission.progress === 100) {
      mission.status = MissionStatusEnum.COMPLETED;
      mission.completed_at = new Date();
    } else if (mission.status === MissionStatusEnum.ACTIVE) {
      // Si la misión estaba activa, cambiar a in_progress
      mission.status = MissionStatusEnum.IN_PROGRESS;
    }

    return await this.missionsRepo.save(mission);
  }

  /**
   * Reclama las recompensas de una misión completada
   *
   * @description Marca una misión como 'claimed' y registra la fecha de reclamación.
   * TODO: Integrar con MLCoinsService y UserStatsService para otorgar recompensas reales.
   *
   * @param missionId - ID de la misión (UUID)
   * @param userId - ID del usuario (UUID)
   * @returns Objeto con misión actualizada y recompensas otorgadas
   *
   * @throws {NotFoundException} Si la misión no existe
   * @throws {BadRequestException} Si la misión no pertenece al usuario, no está completada, o ya fue reclamada
   *
   * @example
   * const result = await service.claimRewards(missionId, userId);
   * // result.mission.status === 'claimed'
   * // result.rewards === { ml_coins: 50, xp: 100 }
   */
  async claimRewards(
    missionId: string,
    userId: string,
  ): Promise<{
    mission: Mission;
    rewards: MissionRewards;
  }> {
    // CRITICAL FIX: Convert auth.users.id → profiles.id
    const profileId = await this.getProfileId(userId);

    const mission = await this.missionsRepo.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    // Validar que la misión pertenece al usuario
    if (mission.user_id !== profileId) {  // FIXED: comparar con profileId
      throw new BadRequestException('Mission does not belong to this user');
    }

    // Validar que la misión está completada
    if (mission.status !== MissionStatusEnum.COMPLETED) {
      throw new BadRequestException(
        `Mission must be completed before claiming rewards. Current status: ${mission.status}`,
      );
    }

    // Validar que no ha sido reclamada previamente
    if (mission.claimed_at !== null) {
      throw new BadRequestException('Rewards have already been claimed for this mission');
    }

    // Marcar como reclamada
    mission.status = MissionStatusEnum.CLAIMED;
    mission.claimed_at = new Date();

    await this.missionsRepo.save(mission);

    // Otorgar recompensas - ML Coins
    if (mission.rewards?.ml_coins && mission.rewards.ml_coins > 0) {
      try {
        await this.mlCoinsService.addCoins(
          userId,
          mission.rewards.ml_coins,
          TransactionTypeEnum.EARNED_BONUS,
          `Mission reward: ${mission.title}`,
          missionId,
          'mission',
        );
        this.logger.log(
          `Awarded ${mission.rewards.ml_coins} ML Coins to user ${userId} for mission ${missionId}`,
        );
      } catch (error: unknown) {
        this.logger.error(
          `Failed to award ML Coins for mission ${missionId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        // Continue execution - don't fail the entire operation
      }
    }

    // Otorgar recompensas - XP
    if (mission.rewards?.xp && mission.rewards.xp > 0) {
      try {
        await this.userStatsService.addXp(
          userId,
          mission.rewards.xp,
        );
        this.logger.log(
          `Awarded ${mission.rewards.xp} XP to user ${userId} for mission ${missionId}`,
        );
      } catch (error: unknown) {
        this.logger.error(
          `Failed to award XP for mission ${missionId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        // Continue execution - don't fail the entire operation
      }
    }

    return {
      mission,
      rewards: mission.rewards,
    };
  }

  /**
   * Obtiene estadísticas completas de misiones del usuario
   *
   * @description Calcula estadísticas detalladas sobre las misiones del usuario:
   * - Misiones del día (completadas / totales)
   * - Misiones de la semana (completadas / totales)
   * - Totales históricos (completadas, XP ganado, ML Coins ganados)
   * - Rachas actuales y récords
   *
   * @param userId - ID del usuario (UUID)
   * @returns Objeto con estadísticas detalladas
   *
   * @example
   * const stats = await service.getStats(userId);
   * // {
   * //   todayCompleted: 2,
   * //   todayTotal: 3,
   * //   weekCompleted: 8,
   * //   weekTotal: 10,
   * //   totalCompleted: 45,
   * //   totalXPEarned: 2250,
   * //   totalMLCoinsEarned: 1125,
   * //   currentStreak: 5,
   * //   longestStreak: 12
   * // }
   */
  async getStats(userId: string): Promise<MissionStatsDto> {
    // CRITICAL FIX: Convert auth.users.id → profiles.id
    const profileId = await this.getProfileId(userId);

    const now = new Date();

    // Calcular inicio del día
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Calcular inicio de la semana (lunes)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay(); // 0 = domingo, 1 = lunes
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calcular días desde lunes
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Misiones de hoy
    const todayMissions = await this.missionsRepo.find({
      where: {
        user_id: profileId,  // FIXED: usar profileId
        mission_type: MissionTypeEnum.DAILY,
        start_date: Between(startOfDay, new Date()),
      },
    });

    const todayCompleted = todayMissions.filter(
      (m) => m.status === MissionStatusEnum.COMPLETED || m.status === MissionStatusEnum.CLAIMED,
    ).length;

    // Misiones de la semana
    const weekMissions = await this.missionsRepo.find({
      where: {
        user_id: profileId,  // FIXED: usar profileId
        start_date: Between(startOfWeek, new Date()),
      },
    });

    const weekCompleted = weekMissions.filter(
      (m) => m.status === MissionStatusEnum.COMPLETED || m.status === MissionStatusEnum.CLAIMED,
    ).length;

    // Totales históricos
    const allCompletedMissions = await this.missionsRepo.find({
      where: {
        user_id: profileId,  // FIXED: usar profileId
        status: Between(MissionStatusEnum.COMPLETED, MissionStatusEnum.CLAIMED),
      },
    });

    const totalCompleted = allCompletedMissions.length;

    // Calcular XP y ML Coins ganados
    const totalXPEarned = allCompletedMissions.reduce((sum, mission) => {
      return sum + (mission.rewards.xp || 0);
    }, 0);

    const totalMLCoinsEarned = allCompletedMissions.reduce((sum, mission) => {
      return sum + (mission.rewards.ml_coins || 0);
    }, 0);

    // TODO: Implementar cálculo de rachas
    // Requiere lógica adicional basada en fechas de completado
    const currentStreak = 0;
    const longestStreak = 0;

    return {
      todayCompleted,
      todayTotal: todayMissions.length,
      weekCompleted,
      weekTotal: weekMissions.length,
      totalCompleted,
      totalXPEarned,
      totalMLCoinsEarned,
      currentStreak,
      longestStreak,
    };
  }

  /**
   * Expira misiones antiguas (cron job)
   *
   * @description Busca y marca como 'expired' todas las misiones cuya fecha de expiración
   * haya pasado y aún estén en status 'active' o 'in_progress'.
   *
   * Este método debe ejecutarse diariamente mediante un cron job.
   *
   * @returns Número de misiones expiradas
   *
   * @example
   * const expiredCount = await service.expireOldMissions();
   * // expiredCount === 15 (15 misiones fueron expiradas)
   */
  async expireOldMissions(): Promise<number> {
    const now = new Date();

    // Buscar misiones expiradas
    const expiredMissions = await this.missionsRepo.find({
      where: {
        end_date: LessThan(now),
        status: Between(MissionStatusEnum.ACTIVE, MissionStatusEnum.IN_PROGRESS),
      },
    });

    if (expiredMissions.length === 0) {
      return 0;
    }

    // Marcar como expiradas
    for (const mission of expiredMissions) {
      mission.status = MissionStatusEnum.EXPIRED;
    }

    await this.missionsRepo.save(expiredMissions);

    return expiredMissions.length;
  }
}
