import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ComodinesService } from '../services/comodines.service';
import { PurchaseComodinDto } from '../dto/comodines/purchase-comodin.dto';
import { UseComodinDto } from '../dto/comodines/use-comodin.dto';
import { InventoryResponseDto } from '../dto/comodines/inventory-response.dto';
import { JwtAuthGuard } from '@/modules/auth/guards';
import { ComodinTypeEnum } from '@/shared/constants/enums.constants';

/**
 * ComodinesController
 *
 * @description Controlador REST para gestión de comodines (power-ups).
 * Proporciona endpoints para comprar, usar y consultar comodines.
 *
 * Características:
 * - Sistema de compra con ML Coins
 * - Uso de comodines en ejercicios
 * - Inventario por usuario
 * - Historial de transacciones
 * - Estadísticas de uso
 * - Autenticación JWT en todos los endpoints
 *
 * Tipos de Comodines:
 * - PISTAS (15 ML Coins): Revela pistas contextuales
 * - VISION_LECTORA (25 ML Coins): Resalta palabras clave
 * - SEGUNDA_OPORTUNIDAD (40 ML Coins): Permite reintentar ejercicio
 *
 * @route /api/v1/gamification/comodines*
 * @security JWT Bearer Token
 *
 * @see Service: ComodinesService
 * @see Entities: ComodinesInventory, InventoryTransaction
 */
@ApiTags('Gamification - Comodines')
@Controller('gamification/comodines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComodinesController {
  constructor(private readonly comodinesService: ComodinesService) {}

  /**
   * Compra comodines con ML Coins
   *
   * @description Permite al usuario comprar comodines usando ML Coins.
   * Valida saldo suficiente antes de realizar la compra.
   *
   * Precios:
   * - PISTAS: 15 ML Coins por unidad
   * - VISION_LECTORA: 25 ML Coins por unidad
   * - SEGUNDA_OPORTUNIDAD: 40 ML Coins por unidad
   *
   * @param purchaseDto - Datos de compra (user_id, comodin_type, quantity)
   * @returns Inventario actualizado
   * @throws BadRequestException - Saldo insuficiente o cantidad inválida
   *
   * @example
   * POST /api/v1/gamification/comodines/purchase
   * Authorization: Bearer <token>
   * Body:
   * {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "comodin_type": "pistas",
   *   "quantity": 3
   * }
   *
   * Response 201:
   * {
   *   "id": "990e8400-e29b-41d4-a716-446655440000",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "pistas": {
   *     "type": "pistas",
   *     "available": 8,
   *     "purchased_total": 8,
   *     "used_total": 0,
   *     "cost": 15
   *   },
   *   ...
   * }
   */
  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Purchase comodines with ML Coins',
    description: 'Permite comprar comodines usando ML Coins del usuario',
  })
  @ApiBody({ type: PurchaseComodinDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comodines comprados exitosamente',
    type: InventoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Saldo insuficiente o cantidad inválida',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido o expirado',
  })
  async purchase(
    @Body() purchaseDto: PurchaseComodinDto,
  ): Promise<InventoryResponseDto> {
    const { user_id, comodin_type, quantity } = purchaseDto;

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const inventory = await this.comodinesService.purchase(
      user_id,
      comodin_type,
      quantity,
    );

    return this.formatInventoryResponse(inventory);
  }

  /**
   * Usa un comodín en un ejercicio
   *
   * @description Consume un comodín del inventario y lo aplica en el ejercicio especificado.
   * El efecto del comodín se maneja en el frontend.
   *
   * Comportamiento:
   * - Decrementa inventario disponible
   * - Incrementa contador de usos
   * - Crea transacción de auditoría
   * - No crea boosts temporales (efecto inmediato)
   *
   * @param useDto - Datos de uso (user_id, comodin_type, quantity, exercise_id, context)
   * @returns Objeto con estado del uso y cantidad restante
   * @throws BadRequestException - Stock insuficiente
   * @throws NotFoundException - Inventario no encontrado
   *
   * @example
   * POST /api/v1/gamification/comodines/use
   * Authorization: Bearer <token>
   * Body:
   * {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "comodin_type": "pistas",
   *   "quantity": 1,
   *   "exercise_id": "660e8400-e29b-41d4-a716-446655440000",
   *   "context": "Used during difficult comprehension question"
   * }
   *
   * Response 200:
   * {
   *   "success": true,
   *   "used": {
   *     "comodin_type": "pistas",
   *     "quantity": 1,
   *     "exercise_id": "660e8400-e29b-41d4-a716-446655440000"
   *   },
   *   "remaining_quantity": 7
   * }
   */
  @Post('use')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Use a comodin in an exercise',
    description: 'Consume un comodín y aplica su efecto inmediato',
  })
  @ApiBody({ type: UseComodinDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comodín usado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        used: {
          type: 'object',
          properties: {
            comodin_type: { type: 'string', example: 'pistas' },
            quantity: { type: 'number', example: 1 },
            exercise_id: {
              type: 'string',
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
        remaining_quantity: { type: 'number', example: 7 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Stock insuficiente o datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inventario no encontrado',
  })
  async use(@Body() useDto: UseComodinDto): Promise<any> {
    const { user_id, comodin_type, quantity, exercise_id, context } = useDto;

    if (quantity !== 1) {
      throw new BadRequestException('Can only use 1 comodin at a time');
    }

    // Use comodin
    await this.comodinesService.use(
      user_id,
      comodin_type,
      exercise_id || 'unknown',
      context,
    );

    // Get remaining quantity
    const remainingQty = await this.comodinesService.getQuantity(
      user_id,
      comodin_type,
    );

    return {
      success: true,
      used: {
        comodin_type,
        quantity,
        exercise_id: exercise_id || null,
      },
      remaining_quantity: remainingQty,
    };
  }

  /**
   * Obtiene el inventario de comodines del usuario
   *
   * @description Retorna el inventario completo con cantidades disponibles,
   * totales comprados, totales usados y costos por tipo.
   *
   * @param userId - ID del usuario
   * @returns Inventario completo del usuario
   * @throws NotFoundException - Usuario o inventario no encontrado
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/comodines/inventory
   * Authorization: Bearer <token>
   *
   * Response 200:
   * {
   *   "id": "990e8400-e29b-41d4-a716-446655440000",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "pistas": {
   *     "type": "pistas",
   *     "available": 5,
   *     "purchased_total": 10,
   *     "used_total": 5,
   *     "cost": 15
   *   },
   *   "vision_lectora": { ... },
   *   "segunda_oportunidad": { ... },
   *   "metadata": { "last_purchase_date": "2025-11-10T15:30:00Z" },
   *   "created_at": "2025-10-01T00:00:00Z",
   *   "updated_at": "2025-11-11T09:00:00Z"
   * }
   */
  @Get('users/:userId/inventory')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user comodines inventory',
    description: 'Obtiene el inventario completo de comodines del usuario',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventario obtenido exitosamente',
    type: InventoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario o inventario no encontrado',
  })
  async getInventory(@Param('userId') userId: string): Promise<InventoryResponseDto> {
    const inventory = await this.comodinesService.getInventory(userId);
    return this.formatInventoryResponse(inventory);
  }

  /**
   * Obtiene el historial de transacciones de comodines
   *
   * @description Retorna el historial de compras y usos de comodines del usuario,
   * ordenado por fecha (más reciente primero).
   *
   * @param userId - ID del usuario
   * @param limit - Número máximo de registros (default: 50, max: 200)
   * @returns Lista de transacciones
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/comodines/history?limit=10
   * Authorization: Bearer <token>
   *
   * Response 200:
   * [
   *   {
   *     "id": "tt0e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "item_id": "comodin_pistas",
   *     "transaction_type": "USE",
   *     "quantity": -1,
   *     "metadata": {
   *       "comodin_type": "pistas",
   *       "exercise_id": "660e8400-e29b-41d4-a716-446655440000",
   *       "context": "Used during comprehension question",
   *       "used_at": "2025-11-11T10:30:00Z"
   *     },
   *     "created_at": "2025-11-11T10:30:00Z"
   *   },
   *   ...
   * ]
   */
  @Get('users/:userId/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get comodines transaction history',
    description: 'Obtiene el historial de compras y usos de comodines',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User UUID',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Número máximo de registros (default: 50, max: 200)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historial obtenido exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          item_id: { type: 'string' },
          transaction_type: { type: 'string', enum: ['PURCHASE', 'USE'] },
          quantity: { type: 'number' },
          metadata: { type: 'object' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getHistory(
    @Param('userId') userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<any[]> {
    // Cap limit at 200
    const cappedLimit = Math.min(limit, 200);

    const transactions = await this.comodinesService.getUsageHistory(
      userId,
      cappedLimit,
    );

    return transactions.map((tx) => ({
      id: tx.id,
      user_id: tx.user_id,
      item_id: tx.item_id,
      transaction_type: tx.transaction_type,
      quantity: tx.quantity,
      metadata: tx.metadata,
      created_at: tx.created_at,
    }));
  }

  /**
   * Obtiene estadísticas de uso de comodines
   *
   * @description Retorna estadísticas agregadas de compras, usos y gastos
   * en ML Coins por tipo de comodín.
   *
   * @param userId - ID del usuario
   * @returns Estadísticas agregadas
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/comodines/stats
   * Authorization: Bearer <token>
   *
   * Response 200:
   * {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "total_purchased": 19,
   *   "total_used": 9,
   *   "total_ml_coins_spent": 435,
   *   "by_type": {
   *     "pistas": {
   *       "purchased": 10,
   *       "used": 5,
   *       "available": 5,
   *       "ml_coins_spent": 150
   *     },
   *     "vision_lectora": { ... },
   *     "segunda_oportunidad": { ... }
   *   },
   *   "usage_rate": 47.37,
   *   "most_used": "pistas"
   * }
   */
  @Get('users/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get comodines usage statistics',
    description: 'Obtiene estadísticas agregadas de compras y usos',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        total_purchased: { type: 'number' },
        total_used: { type: 'number' },
        total_ml_coins_spent: { type: 'number' },
        by_type: {
          type: 'object',
          properties: {
            pistas: {
              type: 'object',
              properties: {
                purchased: { type: 'number' },
                used: { type: 'number' },
                available: { type: 'number' },
                ml_coins_spent: { type: 'number' },
              },
            },
            vision_lectora: { type: 'object' },
            segunda_oportunidad: { type: 'object' },
          },
        },
        usage_rate: { type: 'number', description: 'Porcentaje de uso' },
        most_used: {
          type: 'string',
          description: 'Tipo de comodín más usado',
          nullable: true,
        },
      },
    },
  })
  async getStats(@Param('userId') userId: string): Promise<any> {
    return this.comodinesService.getStats(userId);
  }

  /**
   * Helper: Format inventory response
   */
  private formatInventoryResponse(inventory: any): InventoryResponseDto {
    return {
      id: inventory.id,
      user_id: inventory.user_id,
      pistas: {
        type: 'pistas',
        available: inventory.pistas_available,
        purchased_total: inventory.pistas_purchased_total,
        used_total: inventory.pistas_used_total,
        cost: inventory.pistas_cost,
      },
      vision_lectora: {
        type: 'vision_lectora',
        available: inventory.vision_lectora_available,
        purchased_total: inventory.vision_lectora_purchased_total,
        used_total: inventory.vision_lectora_used_total,
        cost: inventory.vision_lectora_cost,
      },
      segunda_oportunidad: {
        type: 'segunda_oportunidad',
        available: inventory.segunda_oportunidad_available,
        purchased_total: inventory.segunda_oportunidad_purchased_total,
        used_total: inventory.segunda_oportunidad_used_total,
        cost: inventory.segunda_oportunidad_cost,
      },
      metadata: inventory.metadata,
      created_at: inventory.created_at,
      updated_at: inventory.updated_at,
    };
  }
}
