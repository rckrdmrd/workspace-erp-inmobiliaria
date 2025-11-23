import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComodinesInventory } from '../entities/comodines-inventory.entity';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { MLCoinsService } from './ml-coins.service';
import { ComodinTypeEnum, TransactionTypeEnum } from '@shared/constants/enums.constants';

/**
 * ComodinesService
 *
 * @description Servicio para gestión de comodines (power-ups) del usuario.
 *
 * Modelo de datos:
 * - ComodinesInventory: Wide table con una fila por usuario
 * - Columnas por tipo: pistas_*, vision_lectora_*, segunda_oportunidad_*
 * - InventoryTransaction: Registro de auditoría genérico con metadata JSONB
 *
 * Tipos de comodines (3):
 * - PISTAS (15 ML Coins): Revela pistas contextuales
 * - VISION_LECTORA (25 ML Coins): Resalta palabras clave
 * - SEGUNDA_OPORTUNIDAD (40 ML Coins): Permite reintentar ejercicio
 *
 * Funcionalidades:
 * - Compra de comodines con ML Coins
 * - Uso de comodines en ejercicios
 * - Tracking de inventario por tipo
 * - Historial de transacciones
 * - Estadísticas de uso
 *
 * @see Entity: ComodinesInventory
 * @see Entity: InventoryTransaction
 * @see DDL: gamification_system.comodines_inventory
 */
@Injectable()
export class ComodinesService {
  private readonly logger = new Logger(ComodinesService.name);

  constructor(
    @InjectRepository(ComodinesInventory, 'gamification')
    private readonly inventoryRepo: Repository<ComodinesInventory>,
    @InjectRepository(InventoryTransaction, 'gamification')
    private readonly transactionRepo: Repository<InventoryTransaction>,
    private readonly mlCoinsService: MLCoinsService,
  ) {}

  /**
   * Obtiene el inventario de comodines del usuario
   *
   * @description Retorna el registro completo del inventario.
   * Si no existe, crea uno nuevo con valores por defecto.
   *
   * @param userId - ID del usuario (UUID)
   * @returns Inventario completo del usuario
   *
   * @example
   * const inventory = await service.getInventory(userId);
   * console.log(inventory.pistas_available); // 5
   */
  async getInventory(userId: string): Promise<ComodinesInventory> {
    let inventory = await this.inventoryRepo.findOne({
      where: { user_id: userId },
    });

    if (!inventory) {
      // Crear inventario inicial si no existe
      inventory = this.inventoryRepo.create({
        user_id: userId,
        metadata: {
          created_reason: 'auto_created',
          created_at: new Date().toISOString(),
        },
      });
      inventory = await this.inventoryRepo.save(inventory);
      this.logger.log(`Created new inventory for user ${userId}`);
    }

    return inventory;
  }

  /**
   * Obtiene la cantidad disponible de un tipo específico de comodín
   *
   * @param userId - ID del usuario (UUID)
   * @param comodinType - Tipo de comodín
   * @returns Cantidad disponible
   *
   * @example
   * const qty = await service.getQuantity(userId, ComodinTypeEnum.PISTAS);
   * console.log(qty); // 5
   */
  async getQuantity(userId: string, comodinType: ComodinTypeEnum): Promise<number> {
    const inventory = await this.getInventory(userId);
    return inventory.getAvailable(comodinType);
  }

  /**
   * Compra comodines con ML Coins
   *
   * @description Valida saldo, deduce ML Coins, incrementa inventario
   * y crea registro de transacción.
   *
   * Precios:
   * - PISTAS: 15 ML Coins/unidad
   * - VISION_LECTORA: 25 ML Coins/unidad
   * - SEGUNDA_OPORTUNIDAD: 40 ML Coins/unidad
   *
   * @param userId - ID del usuario
   * @param comodinType - Tipo de comodín a comprar
   * @param quantity - Cantidad a comprar (>= 1)
   * @returns Inventario actualizado
   * @throws BadRequestException - Saldo insuficiente o cantidad inválida
   *
   * @example
   * const inventory = await service.purchase(userId, ComodinTypeEnum.PISTAS, 3);
   * // Usuario paga 45 ML Coins (15 * 3) y recibe 3 pistas
   */
  async purchase(
    userId: string,
    comodinType: ComodinTypeEnum,
    quantity: number,
  ): Promise<ComodinesInventory> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const inventory = await this.getInventory(userId);
    const costPerUnit = inventory.getCost(comodinType);
    const totalCost = costPerUnit * quantity;

    // Validar saldo de ML Coins
    const balance = await this.mlCoinsService.getBalance(userId);
    if (balance < totalCost) {
      throw new BadRequestException(
        `Insufficient ML Coins. Required: ${totalCost}, Available: ${balance}`,
      );
    }

    // Deducir ML Coins
    await this.mlCoinsService.spendCoins(
      userId,
      totalCost,
      TransactionTypeEnum.SPENT_POWERUP,
      `Purchased ${quantity}x ${comodinType}`,
      undefined,
      'comodin_purchase',
    );

    // Actualizar inventario según tipo (wide table)
    switch (comodinType) {
      case ComodinTypeEnum.PISTAS:
        inventory.pistas_available += quantity;
        inventory.pistas_purchased_total += quantity;
        break;
      case ComodinTypeEnum.VISION_LECTORA:
        inventory.vision_lectora_available += quantity;
        inventory.vision_lectora_purchased_total += quantity;
        break;
      case ComodinTypeEnum.SEGUNDA_OPORTUNIDAD:
        inventory.segunda_oportunidad_available += quantity;
        inventory.segunda_oportunidad_purchased_total += quantity;
        break;
      default:
        throw new BadRequestException(`Invalid comodin type: ${comodinType}`);
    }

    // Actualizar metadata
    inventory.metadata = {
      ...inventory.metadata,
      last_purchase_date: new Date().toISOString(),
      last_purchase_type: comodinType,
    };

    const updated = await this.inventoryRepo.save(inventory);

    // Crear transacción de auditoría
    const transaction = this.transactionRepo.create({
      user_id: userId,
      item_id: `comodin_${comodinType}`,
      transaction_type: 'PURCHASE',
      quantity: quantity,
      metadata: {
        comodin_type: comodinType,
        ml_coins_spent: totalCost,
        cost_per_unit: costPerUnit,
      },
    });
    await this.transactionRepo.save(transaction);

    this.logger.log(
      `User ${userId} purchased ${quantity} ${comodinType} for ${totalCost} ML Coins`,
    );

    return updated;
  }

  /**
   * Usa un comodín en un ejercicio
   *
   * @description Decrementa el inventario y crea registro de uso.
   * No crea boost temporal (los comodines se usan inmediatamente en el frontend).
   *
   * @param userId - ID del usuario
   * @param comodinType - Tipo de comodín a usar
   * @param exerciseId - ID del ejercicio donde se usa
   * @param context - Contexto adicional (ej: "used on question 5")
   * @returns void
   * @throws BadRequestException - Stock insuficiente
   *
   * @example
   * await service.use(userId, ComodinTypeEnum.PISTAS, exerciseId, 'question 3');
   * // Decrementa pistas_available y crea transaction
   */
  async use(
    userId: string,
    comodinType: ComodinTypeEnum,
    exerciseId: string,
    context?: string,
  ): Promise<void> {
    const inventory = await this.getInventory(userId);

    // Validar stock
    if (!inventory.hasStock(comodinType, 1)) {
      throw new BadRequestException(
        `Insufficient ${comodinType} stock. Available: ${inventory.getAvailable(comodinType)}`,
      );
    }

    // Decrementar inventario según tipo
    switch (comodinType) {
      case ComodinTypeEnum.PISTAS:
        inventory.pistas_available -= 1;
        inventory.pistas_used_total += 1;
        break;
      case ComodinTypeEnum.VISION_LECTORA:
        inventory.vision_lectora_available -= 1;
        inventory.vision_lectora_used_total += 1;
        break;
      case ComodinTypeEnum.SEGUNDA_OPORTUNIDAD:
        inventory.segunda_oportunidad_available -= 1;
        inventory.segunda_oportunidad_used_total += 1;
        break;
      default:
        throw new BadRequestException(`Invalid comodin type: ${comodinType}`);
    }

    // Actualizar metadata
    inventory.metadata = {
      ...inventory.metadata,
      last_use_date: new Date().toISOString(),
      last_use_type: comodinType,
    };

    await this.inventoryRepo.save(inventory);

    // Crear transacción de auditoría
    const transaction = this.transactionRepo.create({
      user_id: userId,
      item_id: `comodin_${comodinType}`,
      transaction_type: 'USE',
      quantity: -1, // Negativo para consumo
      metadata: {
        comodin_type: comodinType,
        exercise_id: exerciseId,
        context: context || null,
        used_at: new Date().toISOString(),
      },
    });
    await this.transactionRepo.save(transaction);

    this.logger.log(
      `User ${userId} used ${comodinType} in exercise ${exerciseId}`,
    );
  }

  /**
   * Obtiene el historial de transacciones de comodines del usuario
   *
   * @description Filtra InventoryTransaction por metadata.comodin_type.
   * Retorna compras y usos ordenados por fecha descendente.
   *
   * @param userId - ID del usuario
   * @param limit - Número máximo de registros (default: 50)
   * @returns Lista de transacciones
   *
   * @example
   * const history = await service.getUsageHistory(userId, 20);
   * // Retorna últimas 20 transacciones de comodines
   */
  async getUsageHistory(
    userId: string,
    limit: number = 50,
  ): Promise<InventoryTransaction[]> {
    // TypeORM no soporta queries complejas en JSONB directamente
    // Usamos query builder para filtrar por metadata
    const transactions = await this.transactionRepo
      .createQueryBuilder('tx')
      .where('tx.user_id = :userId', { userId })
      .andWhere("tx.metadata->>'comodin_type' IS NOT NULL")
      .orderBy('tx.created_at', 'DESC')
      .limit(limit)
      .getMany();

    return transactions;
  }

  /**
   * Obtiene estadísticas agregadas de uso de comodines
   *
   * @description Calcula estadísticas directamente desde ComodinesInventory (wide table).
   * Facilita agregaciones sin joins complejos.
   *
   * @param userId - ID del usuario
   * @returns Estadísticas detalladas por tipo
   *
   * @example
   * const stats = await service.getStats(userId);
   * // {
   * //   total_purchased: 19,
   * //   total_used: 9,
   * //   total_ml_coins_spent: 435,
   * //   by_type: { pistas: {...}, vision_lectora: {...}, segunda_oportunidad: {...} },
   * //   usage_rate: 47.37,
   * //   most_used: 'pistas'
   * // }
   */
  async getStats(userId: string): Promise<{
    user_id: string;
    total_purchased: number;
    total_used: number;
    total_ml_coins_spent: number;
    by_type: {
      [key: string]: {
        purchased: number;
        used: number;
        available: number;
        ml_coins_spent: number;
      };
    };
    usage_rate: number;
    most_used: string | null;
  }> {
    const inventory = await this.getInventory(userId);

    const totalPurchased =
      inventory.pistas_purchased_total +
      inventory.vision_lectora_purchased_total +
      inventory.segunda_oportunidad_purchased_total;

    const totalUsed =
      inventory.pistas_used_total +
      inventory.vision_lectora_used_total +
      inventory.segunda_oportunidad_used_total;

    // Calcular gasto total en ML Coins
    const totalMLCoinsSpent =
      inventory.pistas_purchased_total * inventory.pistas_cost +
      inventory.vision_lectora_purchased_total * inventory.vision_lectora_cost +
      inventory.segunda_oportunidad_purchased_total * inventory.segunda_oportunidad_cost;

    // Estadísticas por tipo
    const byType = {
      pistas: {
        purchased: inventory.pistas_purchased_total,
        used: inventory.pistas_used_total,
        available: inventory.pistas_available,
        ml_coins_spent: inventory.pistas_purchased_total * inventory.pistas_cost,
      },
      vision_lectora: {
        purchased: inventory.vision_lectora_purchased_total,
        used: inventory.vision_lectora_used_total,
        available: inventory.vision_lectora_available,
        ml_coins_spent:
          inventory.vision_lectora_purchased_total * inventory.vision_lectora_cost,
      },
      segunda_oportunidad: {
        purchased: inventory.segunda_oportunidad_purchased_total,
        used: inventory.segunda_oportunidad_used_total,
        available: inventory.segunda_oportunidad_available,
        ml_coins_spent:
          inventory.segunda_oportunidad_purchased_total *
          inventory.segunda_oportunidad_cost,
      },
    };

    // Calcular tasa de uso (% de comodines comprados que fueron usados)
    const usageRate = totalPurchased > 0 ? (totalUsed / totalPurchased) * 100 : 0;

    // Determinar el más usado
    let mostUsed: string | null = null;
    let maxUsed = 0;
    for (const [type, stats] of Object.entries(byType)) {
      if (stats.used > maxUsed) {
        maxUsed = stats.used;
        mostUsed = type;
      }
    }

    return {
      user_id: userId,
      total_purchased: totalPurchased,
      total_used: totalUsed,
      total_ml_coins_spent: totalMLCoinsSpent,
      by_type: byType,
      usage_rate: Number(usageRate.toFixed(2)),
      most_used: mostUsed,
    };
  }

  /**
   * Verifica si el usuario tiene suficiente stock de un comodín
   *
   * @param userId - ID del usuario
   * @param comodinType - Tipo de comodín
   * @param quantity - Cantidad requerida (default: 1)
   * @returns true si tiene suficiente stock
   *
   * @example
   * const hasStock = await service.hasStock(userId, ComodinTypeEnum.PISTAS, 2);
   * if (!hasStock) {
   *   throw new BadRequestException('Insufficient stock');
   * }
   */
  async hasStock(
    userId: string,
    comodinType: ComodinTypeEnum,
    quantity: number = 1,
  ): Promise<boolean> {
    const inventory = await this.getInventory(userId);
    return inventory.hasStock(comodinType, quantity);
  }
}
