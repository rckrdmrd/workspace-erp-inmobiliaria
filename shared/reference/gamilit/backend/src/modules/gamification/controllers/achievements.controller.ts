import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AchievementsService } from '../services';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { GrantAchievementDto } from '../dto';
import { JwtAuthGuard } from '@/modules/auth/guards';

/**
 * AchievementsController
 *
 * @description Gestión completa de logros (achievements) en el sistema de gamificación.
 * Endpoints para obtener achievements, ver progreso del usuario y otorgar logros.
 *
 * SEGURIDAD: Protegido con JwtAuthGuard - Requiere autenticación para todos los endpoints.
 *
 * @route /api/v1/gamification/*
 */
@ApiTags('Gamification - Achievements')
@Controller(extractBasePath(API_ROUTES.GAMIFICATION.BASE))
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  /**
   * Obtiene todos los achievements disponibles
   *
   * @param includeSecret - Incluir achievements secretos (por defecto false)
   * @returns Array de achievements activos ordenados por índice
   *
   * @example
   * GET /api/v1/gamification/achievements
   * Response: [
   *   {
   *     "id": "550e8400-e29b-41d4-a716-446655440000",
   *     "name": "Primer Paso",
   *     "description": "Completa tu primer ejercicio",
   *     "icon_url": "https://...",
   *     "is_secret": false,
   *     "is_active": true,
   *     "reward_ml_coins": 50
   *   },
   *   ...
   * ]
   */
  @Get('achievements')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all achievements',
    description: 'Obtiene la lista de todos los achievements disponibles en el sistema',
  })
  @ApiQuery({
    name: 'includeSecret',
    required: false,
    type: Boolean,
    description: 'Incluir achievements secretos en la respuesta',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de achievements obtenida exitosamente',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Primer Paso',
          description: 'Completa tu primer ejercicio',
          category: 'starter',
          icon_url: 'https://cdn.example.com/achievements/first-step.png',
          is_secret: false,
          is_active: true,
          is_repeatable: false,
          reward_ml_coins: 50,
          order_index: 1,
        },
      ],
    },
  })
  async getAllAchievements(
    @Query('includeSecret') includeSecret?: string,
  ) {
    const include = includeSecret === 'true';
    return await this.achievementsService.findAll(include);
  }

  /**
   * Obtiene un achievement específico por ID
   *
   * @param id - ID del achievement (UUID)
   * @returns Objeto con detalles completos del achievement
   *
   * @example
   * GET /api/v1/gamification/achievements/550e8400-e29b-41d4-a716-446655440000
   * Response: {
   *   "id": "550e8400-e29b-41d4-a716-446655440000",
   *   "name": "Primer Paso",
   *   "description": "Completa tu primer ejercicio",
   *   "category": "starter",
   *   "is_secret": false,
   *   ...
   * }
   */
  @Get('achievements/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get achievement by ID',
    description: 'Obtiene los detalles completos de un achievement específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del achievement en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Achievement obtenido exitosamente',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Primer Paso',
        description: 'Completa tu primer ejercicio',
        category: 'starter',
        icon_url: 'https://cdn.example.com/achievements/first-step.png',
        is_secret: false,
        is_active: true,
        is_repeatable: false,
        reward_ml_coins: 50,
        conditions: { type: 'progress', exercises_completed: 1 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Achievement no encontrado',
  })
  async getAchievementById(@Param('id') id: string) {
    return await this.achievementsService.findById(id);
  }

  /**
   * Obtiene todos los achievements completados por un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Array de achievements completados por el usuario
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/achievements
   * Response: [
   *   {
   *     "id": "660e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "achievement_id": "770e8400-e29b-41d4-a716-446655440000",
   *     "is_completed": true,
   *     "completed_at": "2024-01-15T10:30:00Z",
   *     "completion_percentage": 100,
   *     "rewards_claimed": true
   *   },
   *   ...
   * ]
   */
  @Get('users/:userId/achievements')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user achievements',
    description: 'Obtiene todos los logros completados por un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Logros del usuario obtenidos exitosamente',
    schema: {
      example: [
        {
          id: '660e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          achievement_id: '770e8400-e29b-41d4-a716-446655440000',
          progress: 1,
          max_progress: 1,
          is_completed: true,
          completion_percentage: 100,
          completed_at: '2024-01-15T10:30:00Z',
          rewards_claimed: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserAchievements(@Param('userId') userId: string) {
    return await this.achievementsService.getCompletedByUser(userId);
  }

  /**
   * Otorga un achievement a un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @param achievementId - ID del achievement (UUID)
   * @param grantDto - Datos para otorgar el achievement (progreso, completado, etc.)
   * @returns Objeto actualizado de user-achievement
   *
   * @example
   * POST /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/achievements/770e8400-e29b-41d4-a716-446655440000
   * Request: {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "achievement_id": "770e8400-e29b-41d4-a716-446655440000",
   *   "progress": 1,
   *   "max_progress": 1,
   *   "is_completed": true,
   *   "metadata": { "source": "exercise_completion" }
   * }
   * Response: {
   *   "id": "660e8400-e29b-41d4-a716-446655440000",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "achievement_id": "770e8400-e29b-41d4-a716-446655440000",
   *   "progress": 1,
   *   "max_progress": 1,
   *   "is_completed": true,
   *   "completion_percentage": 100,
   *   "completed_at": "2024-01-15T10:30:00Z",
   *   ...
   * }
   */
  @Post('users/:userId/achievements/:achievementId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Grant achievement to user',
    description: 'Otorga o actualiza el progreso de un achievement para un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'achievementId',
    description: 'ID del achievement en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Achievement otorgado o actualizado exitosamente',
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        achievement_id: '770e8400-e29b-41d4-a716-446655440000',
        progress: 1,
        max_progress: 1,
        is_completed: true,
        completion_percentage: 100,
        completed_at: '2024-01-15T10:30:00Z',
        rewards_claimed: false,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o achievement no encontrado',
  })
  async grantAchievement(
    @Param('userId') userId: string,
    @Param('achievementId') achievementId: string,
    @Body() grantDto: GrantAchievementDto,
  ) {
    // Asegurar que los IDs del DTO coincidan con los parámetros
    grantDto.user_id = userId;
    grantDto.achievement_id = achievementId;

    return await this.achievementsService.grantAchievement(userId, grantDto);
  }

  /**
   * Obtiene un resumen de los achievements del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Resumen estadístico de achievements del usuario
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/achievements/summary
   * Response: {
   *   "total_available": 30,
   *   "completed": 12,
   *   "completion_percentage": 40.00,
   *   "unclaimed_rewards": 3
   * }
   */
  @Get('users/:userId/achievements/summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user achievements summary',
    description: 'Obtiene estadísticas de logros del usuario (completados, pendientes, recompensas sin reclamar)',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen de achievements obtenido exitosamente',
    schema: {
      example: {
        total_available: 30,
        completed: 12,
        completion_percentage: 40.0,
        unclaimed_rewards: 3,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getAchievementSummary(@Param('userId') userId: string) {
    return await this.achievementsService.getUserAchievementStats(userId);
  }

  /**
   * Reclama las recompensas de un achievement completado
   *
   * @param userId - ID del usuario (UUID)
   * @param achievementId - ID del achievement (UUID)
   * @returns User achievement actualizado con rewards_claimed = true
   *
   * @example
   * POST /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/achievements/770e8400-e29b-41d4-a716-446655440000/claim
   * Response: {
   *   "id": "660e8400-e29b-41d4-a716-446655440000",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "achievement_id": "770e8400-e29b-41d4-a716-446655440000",
   *   "is_completed": true,
   *   "rewards_claimed": true,
   *   "completed_at": "2024-01-15T10:30:00Z"
   * }
   */
  @Post('users/:userId/achievements/:achievementId/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Claim achievement rewards',
    description: 'Reclama las recompensas de un achievement completado (ML Coins, XP, etc.)',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'achievementId',
    description: 'ID del achievement en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Recompensas reclamadas exitosamente',
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        achievement_id: '770e8400-e29b-41d4-a716-446655440000',
        is_completed: true,
        rewards_claimed: true,
        completed_at: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Achievement no completado o recompensas ya reclamadas',
  })
  @ApiResponse({
    status: 404,
    description: 'Achievement no encontrado para el usuario',
  })
  async claimAchievement(
    @Param('userId') userId: string,
    @Param('achievementId') achievementId: string,
  ) {
    return await this.achievementsService.claimRewards(userId, achievementId);
  }
}
