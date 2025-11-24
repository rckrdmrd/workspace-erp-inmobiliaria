import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MLCoinsService } from '../services';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { TransactionTypeEnum } from '@/shared/constants/enums.constants';
// import { JwtAuthGuard } from '@/modules/auth/guards';

/**
 * MLCoinsController
 *
 * @description Gestión de la economía virtual del sistema (ML Coins).
 * Endpoints para consultar balance, agregar/gastar coins, y ver historial de transacciones.
 *
 * @route /api/v1/gamification/users/:userId/ml-coins*
 */
@ApiTags('Gamification - ML Coins')
@Controller(extractBasePath(API_ROUTES.GAMIFICATION.BASE))
// @UseGuards(JwtAuthGuard)
export class MLCoinsController {
  constructor(private readonly mlCoinsService: MLCoinsService) {}

  /**
   * Obtiene el balance actual de ML Coins del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Objeto con balance actual y estadísticas de coins
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/ml-coins
   * Response: {
   *   "current_balance": 500,
   *   "total_earned": 1000,
   *   "total_spent": 500,
   *   "earned_today": 150
   * }
   */
  @Get('users/:userId/ml-coins')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get ML Coins balance',
    description: 'Obtiene el balance actual y estadísticas de ML Coins de un usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Balance de ML Coins obtenido exitosamente',
    schema: {
      example: {
        current_balance: 500,
        total_earned: 1000,
        total_spent: 500,
        earned_today: 150,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getMLCoinsBalance(@Param('userId') userId: string) {
    return await this.mlCoinsService.getCoinsStats(userId);
  }

  /**
   * Obtiene el historial de transacciones de ML Coins del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @param limit - Número máximo de transacciones a retornar (default: 50)
   * @param offset - Número de transacciones a saltar para paginación (default: 0)
   * @returns Array de transacciones ordenadas por fecha descendente
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/ml-coins/transactions?limit=20&offset=0
   * Response: [
   *   {
   *     "id": "660e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "amount": 50,
   *     "balance_before": 450,
   *     "balance_after": 500,
   *     "transaction_type": "EARNED_EXERCISE",
   *     "description": "Completaste el ejercicio de comprensión lectora",
   *     "created_at": "2024-01-15T10:30:00Z"
   *   },
   *   ...
   * ]
   */
  @Get('users/:userId/ml-coins/transactions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get ML Coins transactions',
    description: 'Obtiene el historial de transacciones de ML Coins de un usuario con paginación',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de transacciones a retornar',
    example: 50,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Número de transacciones a saltar para paginación',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Transacciones obtenidas exitosamente',
    schema: {
      example: [
        {
          id: '660e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          amount: 50,
          balance_before: 450,
          balance_after: 500,
          transaction_type: 'EARNED_EXERCISE',
          description: 'Completaste el ejercicio de comprensión lectora',
          reference_type: 'exercise',
          reference_id: '770e8400-e29b-41d4-a716-446655440000',
          created_at: '2024-01-15T10:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getMLCoinsTransactions(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    return await this.mlCoinsService.getTransactions(userId, limitNum, offsetNum);
  }

  /**
   * Agrega ML Coins al balance del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @param body - Objeto con monto y detalles de la transacción
   * @returns Nuevo balance y detalles de la transacción registrada
   *
   * @example
   * POST /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/ml-coins/add
   * Request: {
   *   "amount": 50,
   *   "transaction_type": "EARNED_EXERCISE",
   *   "description": "Completaste el ejercicio de comprensión lectora",
   *   "reference_id": "770e8400-e29b-41d4-a716-446655440000",
   *   "reference_type": "exercise",
   *   "multiplier": 1.5
   * }
   * Response: {
   *   "balance": 500,
   *   "transaction": {
   *     "id": "660e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "amount": 75,
   *     "balance_before": 425,
   *     "balance_after": 500,
   *     "transaction_type": "EARNED_EXERCISE",
   *     "multiplier": 1.5,
   *     "created_at": "2024-01-15T10:30:00Z"
   *   }
   * }
   */
  @Post('users/:userId/ml-coins/add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add ML Coins',
    description: 'Agrega ML Coins al balance de un usuario y registra la transacción',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'ML Coins agregados exitosamente',
    schema: {
      example: {
        balance: 500,
        transaction: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          amount: 75,
          balance_before: 425,
          balance_after: 500,
          transaction_type: 'EARNED_EXERCISE',
          description: 'Completaste el ejercicio de comprensión lectora',
          multiplier: 1.5,
          created_at: '2024-01-15T10:30:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o monto debe ser mayor a 0',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async addMLCoins(
    @Param('userId') userId: string,
    @Body()
    body: {
      amount: number;
      transaction_type: TransactionTypeEnum;
      description?: string;
      reference_id?: string;
      reference_type?: string;
      multiplier?: number;
    },
  ) {
    return await this.mlCoinsService.addCoins(
      userId,
      body.amount,
      body.transaction_type,
      body.description,
      body.reference_id,
      body.reference_type,
      body.multiplier,
    );
  }

  /**
   * Gasta ML Coins del balance del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @param body - Objeto con monto y detalles de la transacción
   * @returns Nuevo balance y detalles de la transacción registrada
   *
   * @example
   * POST /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/ml-coins/spend
   * Request: {
   *   "amount": 50,
   *   "transaction_type": "SPENT_POWERUP",
   *   "description": "Compraste un power-up de ayuda",
   *   "reference_id": "880e8400-e29b-41d4-a716-446655440000",
   *   "reference_type": "powerup"
   * }
   * Response: {
   *   "balance": 450,
   *   "transaction": {
   *     "id": "660e8400-e29b-41d4-a716-446655440001",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "amount": -50,
   *     "balance_before": 500,
   *     "balance_after": 450,
   *     "transaction_type": "SPENT_POWERUP",
   *     "created_at": "2024-01-15T10:35:00Z"
   *   }
   * }
   */
  @Post('users/:userId/ml-coins/spend')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Spend ML Coins',
    description: 'Gasta ML Coins del balance de un usuario con validación de saldo suficiente',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'ML Coins gastados exitosamente',
    schema: {
      example: {
        balance: 450,
        transaction: {
          id: '660e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          amount: -50,
          balance_before: 500,
          balance_after: 450,
          transaction_type: 'SPENT_POWERUP',
          description: 'Compraste un power-up de ayuda',
          created_at: '2024-01-15T10:35:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, monto debe ser mayor a 0, o saldo insuficiente',
    schema: {
      example: {
        statusCode: 400,
        message: 'Insufficient balance. Required: 1000, Available: 450',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async spendMLCoins(
    @Param('userId') userId: string,
    @Body()
    body: {
      amount: number;
      transaction_type: TransactionTypeEnum;
      description?: string;
      reference_id?: string;
      reference_type?: string;
    },
  ) {
    return await this.mlCoinsService.spendCoins(
      userId,
      body.amount,
      body.transaction_type,
      body.description,
      body.reference_id,
      body.reference_type,
    );
  }
}
