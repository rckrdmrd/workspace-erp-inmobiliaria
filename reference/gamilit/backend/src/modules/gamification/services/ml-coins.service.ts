import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStats, MLCoinsTransaction } from '../entities';
import { DB_SCHEMAS } from '@shared/constants';
import { TransactionTypeEnum } from '@shared/constants/enums.constants';
import { CreateTransactionDto } from '../dto';

/**
 * MLCoinsService
 *
 * Gestión del sistema económico virtual (ML Coins)
 * - Balance tracking
 * - Transacciones (earnings y gastos)
 * - Validación y auditoría
 * - Historial de movimientos
 */
@Injectable()
export class MLCoinsService {
  constructor(
    @InjectRepository(UserStats, 'gamification')
    private readonly userStatsRepo: Repository<UserStats>,
    @InjectRepository(MLCoinsTransaction, 'gamification')
    private readonly transactionRepo: Repository<MLCoinsTransaction>,
  ) {}

  /**
   * Obtiene el balance actual de ML Coins del usuario
   */
  async getBalance(userId: string): Promise<number> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    return userStats.ml_coins;
  }

  /**
   * Obtiene estadísticas completas de ML Coins
   */
  async getCoinsStats(userId: string): Promise<{
    current_balance: number;
    total_earned: number;
    total_spent: number;
    earned_today: number;
  }> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    return {
      current_balance: userStats.ml_coins,
      total_earned: userStats.ml_coins_earned_total,
      total_spent: userStats.ml_coins_spent_total,
      earned_today: userStats.ml_coins_earned_today,
    };
  }

  /**
   * Añade ML Coins al balance del usuario
   * Crea transacción de registro
   */
  async addCoins(
    userId: string,
    amount: number,
    transactionType: TransactionTypeEnum,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    multiplier?: number,
  ): Promise<{ balance: number; transaction: MLCoinsTransaction }> {
    // Validaciones
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    // Aplicar multiplicador
    const finalAmount = multiplier ? Math.floor(amount * multiplier) : amount;

    // Actualizar balance
    const balanceBefore = userStats.ml_coins;
    const balanceAfter = balanceBefore + finalAmount;

    userStats.ml_coins = balanceAfter;
    userStats.ml_coins_earned_total += finalAmount;

    // Actualizar earned today (con validación de reset diario)
    await this.resetDailyCoinsIfNeeded(userStats);
    userStats.ml_coins_earned_today += finalAmount;

    await this.userStatsRepo.save(userStats);

    // Crear registro de transacción
    const transaction = await this.createTransaction({
      user_id: userId,
      amount: finalAmount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      transaction_type: transactionType,
      description,
      reference_id: referenceId,
      reference_type: referenceType as any,
      multiplier: multiplier || 1.0,
      metadata: {},
    });

    return { balance: balanceAfter, transaction };
  }

  /**
   * Gasta ML Coins del balance del usuario
   * Incluye validación de saldo suficiente
   */
  async spendCoins(
    userId: string,
    amount: number,
    transactionType: TransactionTypeEnum,
    description?: string,
    referenceId?: string,
    referenceType?: string,
  ): Promise<{ balance: number; transaction: MLCoinsTransaction }> {
    // Validaciones
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    // Validar saldo suficiente
    if (userStats.ml_coins < amount) {
      throw new BadRequestException(
        `Insufficient balance. Required: ${amount}, Available: ${userStats.ml_coins}`,
      );
    }

    // Actualizar balance
    const balanceBefore = userStats.ml_coins;
    const balanceAfter = balanceBefore - amount;

    userStats.ml_coins = balanceAfter;
    userStats.ml_coins_spent_total += amount;

    await this.userStatsRepo.save(userStats);

    // Crear registro de transacción (con monto negativo)
    const transaction = await this.createTransaction({
      user_id: userId,
      amount: -amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      transaction_type: transactionType,
      description,
      reference_id: referenceId,
      reference_type: referenceType as any,
      metadata: {},
    });

    return { balance: balanceAfter, transaction };
  }

  /**
   * Obtiene el historial de transacciones de un usuario
   */
  async getTransactions(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<MLCoinsTransaction[]> {
    return await this.transactionRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Obtiene transacciones filtradas por tipo
   */
  async getTransactionsByType(
    userId: string,
    transactionType: TransactionTypeEnum,
    limit: number = 50,
  ): Promise<MLCoinsTransaction[]> {
    return await this.transactionRepo.find({
      where: {
        user_id: userId,
        transaction_type: transactionType,
      },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Obtiene transacciones dentro de un rango de fechas
   */
  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MLCoinsTransaction[]> {
    return await this.transactionRepo
      .createQueryBuilder('t')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.created_at >= :startDate', { startDate })
      .andWhere('t.created_at <= :endDate', { endDate })
      .orderBy('t.created_at', 'DESC')
      .getMany();
  }

  /**
   * Obtiene el total de coins ganadas en un período específico
   */
  async getTotalEarningsInPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END)', 'total_earned')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.created_at >= :startDate', { startDate })
      .andWhere('t.created_at <= :endDate', { endDate })
      .getRawOne();

    return result?.total_earned ? parseInt(result.total_earned, 10) : 0;
  }

  /**
   * Obtiene el total de coins gastadas en un período específico
   */
  async getTotalSpendingInPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END)', 'total_spent')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.created_at >= :startDate', { startDate })
      .andWhere('t.created_at <= :endDate', { endDate })
      .getRawOne();

    return result?.total_spent ? parseInt(result.total_spent, 10) : 0;
  }

  /**
   * Obtiene transacciones referenciadas a una entidad específica
   */
  async getTransactionsByReference(
    userId: string,
    referenceId: string,
    referenceType: string,
  ): Promise<MLCoinsTransaction[]> {
    return await this.transactionRepo.find({
      where: {
        user_id: userId,
        reference_id: referenceId,
        reference_type: referenceType as any,
      },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Auditoría: verifica inconsistencias en el balance
   */
  async auditBalance(userId: string): Promise<{
    calculated_balance: number;
    actual_balance: number;
    difference: number;
    is_valid: boolean;
  }> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new NotFoundException(`User stats not found for ${userId}`);
    }

    // Calcular balance sumando todas las transacciones
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'total_amount')
      .where('t.user_id = :userId', { userId })
      .getRawOne();

    const calculatedBalance = (result?.total_amount ? parseInt(result.total_amount, 10) : 0) + 100; // +100 es el saldo inicial

    const difference = userStats.ml_coins - calculatedBalance;
    const isValid = difference === 0;

    return {
      calculated_balance: calculatedBalance,
      actual_balance: userStats.ml_coins,
      difference,
      is_valid: isValid,
    };
  }

  /**
   * Reset de coins ganadas hoy (se ejecuta automáticamente si ha pasado 24h)
   */
  private async resetDailyCoinsIfNeeded(userStats: UserStats): Promise<void> {
    const now = new Date();
    const lastReset = userStats.last_ml_coins_reset;

    if (!lastReset) {
      userStats.ml_coins_earned_today = 0;
      userStats.last_ml_coins_reset = now;
      return;
    }

    // Verificar si ha pasado más de 24 horas
    const hoursDiff = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      userStats.ml_coins_earned_today = 0;
      userStats.last_ml_coins_reset = now;
    }
  }

  /**
   * Crea un registro de transacción en la BD
   */
  private async createTransaction(
    transactionDto: CreateTransactionDto,
  ): Promise<MLCoinsTransaction> {
    const transaction = this.transactionRepo.create({
      user_id: transactionDto.user_id,
      amount: transactionDto.amount,
      balance_before: transactionDto.balance_before,
      balance_after: transactionDto.balance_after,
      transaction_type: transactionDto.transaction_type,
      description: transactionDto.description,
      reason: transactionDto.reason,
      reference_id: transactionDto.reference_id,
      reference_type: transactionDto.reference_type,
      multiplier: transactionDto.multiplier || 1.0,
      bonus_applied: transactionDto.bonus_applied || false,
      metadata: transactionDto.metadata || {},
    });

    return await this.transactionRepo.save(transaction);
  }

  /**
   * Obtiene ranking global por ML Coins totales
   */
  async getTopEarners(limit: number = 50): Promise<UserStats[]> {
    return await this.userStatsRepo.find({
      order: { ml_coins_earned_total: 'DESC' },
      take: limit,
    });
  }

  /**
   * Obtiene resumen diario de transacciones
   */
  async getDailySummary(userId: string, date: Date): Promise<{
    date: string;
    total_earned: number;
    total_spent: number;
    net_change: number;
    transaction_count: number;
  }> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('COUNT(*)', 'transaction_count')
      .addSelect('SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END)', 'total_earned')
      .addSelect('SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END)', 'total_spent')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.created_at >= :startDate', { startDate })
      .andWhere('t.created_at <= :endDate', { endDate })
      .getRawOne();

    const totalEarned = result?.total_earned ? parseInt(result.total_earned, 10) : 0;
    const totalSpent = result?.total_spent ? parseInt(result.total_spent, 10) : 0;

    return {
      date: date.toISOString().split('T')[0],
      total_earned: totalEarned,
      total_spent: totalSpent,
      net_change: totalEarned - totalSpent,
      transaction_count: parseInt(result?.transaction_count || '0', 10),
    };
  }
}
