import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRank } from '../entities';
import { UserStatsService } from './user-stats.service';
import { MLCoinsService } from './ml-coins.service';
import { CreateUserRankDto, UpdateUserRankDto } from '../dto/user-ranks';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { MayaRank, TransactionTypeEnum } from '@shared/constants/enums.constants';

/**
 * RankConfig Interface
 * Configuración de cada rango maya
 */
interface RankConfig {
  xp_min: number;
  xp_max: number;
  ml_coins_bonus: number;
  next_rank: MayaRank | null;
  name: string;
  description: string;
  order: number;
}

/**
 * RankProgressDto Interface
 * Información de progreso hacia el siguiente rango
 */
export interface RankProgressDto {
  current_rank: MayaRank;
  next_rank: MayaRank | null;
  progress_percentage: number;
  xp_current: number;
  xp_required: number;
  xp_remaining: number;
  ml_coins_bonus_on_promotion: number;
  is_max_rank: boolean;
}

/**
 * RanksService
 *
 * Servicio para gestión del sistema de rangos maya
 * - Progresión de rangos basada en XP
 * - Promoción automática entre rangos
 * - Historial de rangos del usuario
 * - Cálculo de progreso y bonos
 */
@Injectable()
export class RanksService {
  private readonly logger = new Logger(RanksService.name);

  /**
   * Configuración de rangos maya v2.0
   * Define XP requerida, bonos y progresión
   * VERSIÓN: 2.0 (2025-11-16)
   * SINCRONIZADO CON: apps/database/seeds/prod/gamification_system/03-maya_ranks.sql
   */
  private readonly RANK_CONFIG: Record<MayaRank, RankConfig> = {
    [MayaRank.AJAW]: {
      xp_min: 0,
      xp_max: 499,
      ml_coins_bonus: 0,
      next_rank: MayaRank.NACOM,
      name: 'Ajaw',
      description: 'Señor - Inicio del camino del conocimiento',
      order: 1,
    },
    [MayaRank.NACOM]: {
      xp_min: 500,
      xp_max: 999,
      ml_coins_bonus: 100,
      next_rank: MayaRank.AH_KIN,
      name: 'Nacom',
      description: 'Capitán de Guerra - Guerrero en entrenamiento',
      order: 2,
    },
    [MayaRank.AH_KIN]: {
      xp_min: 1000,
      xp_max: 1499,
      ml_coins_bonus: 250,
      next_rank: MayaRank.HALACH_UINIC,
      name: "Ah K'in",
      description: 'Sacerdote del Sol - Guía del conocimiento',
      order: 3,
    },
    [MayaRank.HALACH_UINIC]: {
      xp_min: 1500,
      xp_max: 2249,
      ml_coins_bonus: 500,
      next_rank: MayaRank.KUKUKULKAN,
      name: 'Halach Uinic',
      description: 'Hombre Verdadero - Líder de la comunidad',
      order: 4,
    },
    [MayaRank.KUKUKULKAN]: {
      xp_min: 2250,
      xp_max: Infinity,
      ml_coins_bonus: 1000,
      next_rank: null,
      name: "K'uk'ulkan",
      description: 'Serpiente Emplumada - Maestro legendario',
      order: 5,
    },
  };

  constructor(
    @InjectRepository(UserRank, 'gamification')
    private readonly userRankRepo: Repository<UserRank>,
    private readonly userStatsService: UserStatsService,
    private readonly mlCoinsService: MLCoinsService,
  ) {}

  /**
   * Obtiene el rango actual del usuario
   * @param userId - ID del usuario
   * @returns Rango actual (is_current = true)
   */
  async getCurrentRank(userId: string): Promise<UserRank> {
    const currentRank = await this.userRankRepo.findOne({
      where: {
        user_id: userId,
        is_current: true,
      },
    });

    if (!currentRank) {
      throw new NotFoundException(
        `No current rank found for user ${userId}. User may need to be initialized.`,
      );
    }

    return currentRank;
  }

  /**
   * Obtiene el historial completo de rangos del usuario
   * @param userId - ID del usuario
   * @returns Array de rangos ordenados por fecha
   */
  async getUserRankHistory(userId: string): Promise<UserRank[]> {
    return await this.userRankRepo.find({
      where: { user_id: userId },
      order: { achieved_at: 'DESC' },
    });
  }

  /**
   * Calcula el progreso del usuario hacia el siguiente rango
   * @param userId - ID del usuario
   * @returns Información de progreso detallada
   */
  async calculateRankProgress(userId: string): Promise<RankProgressDto> {
    const currentRank = await this.getCurrentRank(userId);
    const userStats = await this.userStatsService.findByUserId(userId);

    const currentXP = userStats.total_xp;
    const rankConfig = this.getRankConfig(currentRank.current_rank);
    const nextRank = rankConfig.next_rank;

    // Si ya está en el rango máximo
    if (!nextRank) {
      return {
        current_rank: currentRank.current_rank,
        next_rank: null,
        progress_percentage: 100,
        xp_current: currentXP,
        xp_required: rankConfig.xp_max,
        xp_remaining: 0,
        ml_coins_bonus_on_promotion: 0,
        is_max_rank: true,
      };
    }

    const nextRankConfig = this.getRankConfig(nextRank);
    const xpRequired = nextRankConfig.xp_min;
    const xpRemaining = Math.max(0, xpRequired - currentXP);

    // Calcular porcentaje de progreso
    const xpRangeStart = rankConfig.xp_min;
    const xpRangeEnd = nextRankConfig.xp_min;
    const xpInRange = currentXP - xpRangeStart;
    const xpRangeTotal = xpRangeEnd - xpRangeStart;
    const progressPercentage = Math.min(
      100,
      Math.max(0, Math.floor((xpInRange / xpRangeTotal) * 100)),
    );

    return {
      current_rank: currentRank.current_rank,
      next_rank: nextRank,
      progress_percentage: progressPercentage,
      xp_current: currentXP,
      xp_required: xpRequired,
      xp_remaining: xpRemaining,
      ml_coins_bonus_on_promotion: nextRankConfig.ml_coins_bonus,
      is_max_rank: false,
    };
  }

  /**
   * Verifica si el usuario cumple los requisitos para promoción
   * @param userId - ID del usuario
   * @returns true si cumple requisitos, false en caso contrario
   */
  async checkPromotionEligibility(userId: string): Promise<boolean> {
    try {
      const progress = await this.calculateRankProgress(userId);

      // No puede promocionar si ya está en rango máximo
      if (progress.is_max_rank) {
        return false;
      }

      // Puede promocionar si tiene 0 XP restante
      return progress.xp_remaining === 0;
    } catch (error: any) {
      this.logger.error(
        `Error checking promotion eligibility for user ${userId}: ${error?.message || error}`,
      );
      return false;
    }
  }

  /**
   * Promueve al usuario al siguiente rango
   * @param userId - ID del usuario
   * @returns Nuevo registro de rango
   * @throws BadRequestException si no cumple requisitos
   */
  async promoteToNextRank(userId: string): Promise<UserRank> {
    const currentRank = await this.getCurrentRank(userId);
    const isEligible = await this.checkPromotionEligibility(userId);

    if (!isEligible) {
      throw new BadRequestException(
        `User ${userId} is not eligible for promotion. Check XP requirements.`,
      );
    }

    const currentRankConfig = this.getRankConfig(currentRank.current_rank);
    const nextRank = currentRankConfig.next_rank;

    if (!nextRank) {
      throw new BadRequestException(
        `User ${userId} is already at maximum rank.`,
      );
    }

    const userStats = await this.userStatsService.findByUserId(userId);
    const nextRankConfig = this.getRankConfig(nextRank);

    // Iniciar transacción: marcar rango anterior como no actual
    currentRank.is_current = false;
    await this.userRankRepo.save(currentRank);

    // Crear nuevo registro de rango
    const newRank = this.userRankRepo.create({
      user_id: userId,
      tenant_id: currentRank.tenant_id,
      current_rank: nextRank,
      previous_rank: currentRank.current_rank,
      rank_progress_percentage: 0,
      xp_earned_for_rank: userStats.total_xp,
      ml_coins_bonus: nextRankConfig.ml_coins_bonus,
      achieved_at: new Date(),
      previous_rank_achieved_at: currentRank.achieved_at,
      is_current: true,
      rank_metadata: {
        promoted_at: new Date().toISOString(),
        previous_rank: currentRank.current_rank,
        xp_at_promotion: userStats.total_xp,
      },
    });

    const savedRank = await this.userRankRepo.save(newRank);

    // Otorgar bono de ML Coins por promoción
    if (nextRankConfig.ml_coins_bonus > 0) {
      await this.mlCoinsService.addCoins(
        userId,
        nextRankConfig.ml_coins_bonus,
        TransactionTypeEnum.EARNED_RANK,
        `Rank promotion to ${nextRank}`,
        savedRank.id,
        'user_rank',
      );

      this.logger.log(
        `User ${userId} promoted to ${nextRank}. Awarded ${nextRankConfig.ml_coins_bonus} ML Coins.`,
      );
    }

    // Actualizar current_rank en UserStats
    await this.userStatsService.updateStats(userId, {
      current_rank: nextRank,
    });

    return savedRank;
  }

  /**
   * Obtiene la configuración de un rango específico
   * @param rank - Rango maya
   * @returns Configuración del rango
   */
  getRankConfig(rank: MayaRank): RankConfig {
    const config = this.RANK_CONFIG[rank];
    if (!config) {
      throw new BadRequestException(`Invalid rank: ${rank}`);
    }
    return config;
  }

  /**
   * Obtiene la configuración de todos los rangos
   * @returns Array con metadata de todos los rangos
   */
  getAllRanksConfig(): RankConfig[] {
    return Object.values(this.RANK_CONFIG).sort((a, b) => a.order - b.order);
  }

  // =========================================================================
  // MÉTODOS ADMIN
  // =========================================================================

  /**
   * Crea un nuevo registro de rango manualmente (admin)
   * @param createDto - DTO con datos del rango
   * @returns Registro de rango creado
   */
  async createRank(createDto: CreateUserRankDto): Promise<UserRank> {
    // Si is_current=true, marcar otros rangos del usuario como no actuales
    if (createDto.is_current) {
      await this.userRankRepo
        .createQueryBuilder()
        .update(UserRank)
        .set({ is_current: false })
        .where('user_id = :userId AND is_current = :isCurrent', {
          userId: createDto.user_id,
          isCurrent: true,
        })
        .execute();
    }

    const newRank = this.userRankRepo.create(createDto as any);
    const saved = await this.userRankRepo.save(newRank);
    return saved as unknown as UserRank;
  }

  /**
   * Actualiza un registro de rango manualmente (admin)
   * @param rankId - ID del registro de rango
   * @param updateDto - DTO con datos a actualizar
   * @returns Registro de rango actualizado
   */
  async updateRank(
    rankId: string,
    updateDto: UpdateUserRankDto,
  ): Promise<UserRank> {
    const rank = await this.userRankRepo.findOne({
      where: { id: rankId },
    });

    if (!rank) {
      throw new NotFoundException(`Rank record ${rankId} not found`);
    }

    // Si se está marcando como actual, desmarcar otros del mismo usuario
    if (updateDto.is_current === true) {
      await this.userRankRepo
        .createQueryBuilder()
        .update(UserRank)
        .set({ is_current: false })
        .where('user_id = :userId AND is_current = :isCurrent', {
          userId: rank.user_id,
          isCurrent: true,
        })
        .execute();
    }

    Object.assign(rank, updateDto);
    return await this.userRankRepo.save(rank);
  }

  /**
   * Elimina un registro de rango (admin)
   * @param rankId - ID del registro de rango
   * @throws BadRequestException si intenta eliminar el rango actual
   */
  async deleteRank(rankId: string): Promise<void> {
    const rank = await this.userRankRepo.findOne({
      where: { id: rankId },
    });

    if (!rank) {
      throw new NotFoundException(`Rank record ${rankId} not found`);
    }

    if (rank.is_current) {
      throw new BadRequestException(
        'Cannot delete current rank. Set another rank as current first.',
      );
    }

    await this.userRankRepo.delete({ id: rankId });
    this.logger.log(`Rank record ${rankId} deleted`);
  }

  /**
   * Obtiene un registro de rango por ID
   * @param rankId - ID del registro de rango
   * @returns Registro de rango
   */
  async findById(rankId: string): Promise<UserRank> {
    const rank = await this.userRankRepo.findOne({
      where: { id: rankId },
    });

    if (!rank) {
      throw new NotFoundException(`Rank record ${rankId} not found`);
    }

    return rank;
  }
}
