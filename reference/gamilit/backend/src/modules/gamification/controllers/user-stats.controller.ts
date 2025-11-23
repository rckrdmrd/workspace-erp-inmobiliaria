import { Controller, Get, Patch, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserStatsService } from '../services';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { JwtAuthGuard } from '@/modules/auth/guards';

/**
 * UserStatsController
 *
 * @description Gestión de estadísticas y rango de usuarios en el sistema de gamificación.
 * Endpoints para obtener y actualizar estadísticas de XP, niveles y rangos Maya.
 *
 * SEGURIDAD: Protegido con JwtAuthGuard - Requiere autenticación para todos los endpoints.
 *
 * @route /api/v1/gamification/users/:userId/*
 */
@ApiTags('Gamification - User Stats')
@Controller(extractBasePath(API_ROUTES.GAMIFICATION.BASE))
@UseGuards(JwtAuthGuard)
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  /**
   * Obtiene las estadísticas completas de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Objeto de estadísticas del usuario con niveles, XP, rango actual, etc.
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/stats
   * Response: {
   *   "id": "550e8400-e29b-41d4-a716-446655440000",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "level": 5,
   *   "total_xp": 250,
   *   "xp_to_next_level": 100,
   *   "current_rank": "Nacom",
   *   "rank_progress": 45.5,
   *   "ml_coins": 500,
   *   "ml_coins_earned_total": 1000,
   *   "ml_coins_spent_total": 500,
   *   ...
   * }
   */
  @Get('users/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user stats',
    description: 'Obtiene las estadísticas completas de gamificación para un usuario específico',
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
    description: 'Estadísticas del usuario obtenidas exitosamente',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        level: 5,
        total_xp: 250,
        xp_to_next_level: 121,
        current_rank: 'Nacom',
        rank_progress: 45.5,
        ml_coins: 500,
        ml_coins_earned_total: 1000,
        ml_coins_spent_total: 500,
        current_streak: 3,
        max_streak: 10,
        days_active_total: 15,
        exercises_completed: 28,
        modules_completed: 4,
        total_score: 890,
        achievements_earned: 8,
        certificates_earned: 2,
        sessions_count: 45,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: { example: { statusCode: 404, message: 'No stats found for user 550e8400-e29b-41d4-a716-446655440000' } },
  })
  async getUserStats(@Param('userId') userId: string) {
    return await this.userStatsService.findByUserId(userId);
  }

  /**
   * Obtiene el rango actual y progreso del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Objeto con rango actual y progreso hacia el siguiente rango
   *
   * @example
   * GET /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/rank
   * Response: {
   *   "current_rank": "Nacom",
   *   "rank_progress": 45.5,
   *   "level": 5,
   *   "next_rank": "Ah K'in",
   *   "levels_to_next_rank": 5
   * }
   */
  @Get('users/:userId/rank')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user rank',
    description: 'Obtiene el rango Maya actual y progreso hacia el siguiente rango',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Rango del usuario obtenido exitosamente',
    schema: {
      example: {
        current_rank: 'Nacom',
        rank_progress: 45.5,
        level: 5,
        next_rank: "Ah K'in",
        levels_to_next_rank: 5,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserRank(@Param('userId') userId: string) {
    const stats = await this.userStatsService.findByUserId(userId);

    const RANKS = ['Ajaw', 'Nacom', "Ah K'in", 'Halach Uinic', "K'uk'ulkan"];
    const currentIndex = RANKS.indexOf(stats.current_rank);
    const nextRank = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;
    const levelThreshold = (currentIndex + 1) * 5;
    const levelsToNext = Math.max(0, levelThreshold - stats.level);

    return {
      current_rank: stats.current_rank,
      rank_progress: stats.rank_progress || 0,
      level: stats.level,
      next_rank: nextRank,
      levels_to_next_rank: levelsToNext,
    };
  }

  /**
   * Actualiza las estadísticas de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @param updateData - Objeto con los campos a actualizar (XP, nivel, etc.)
   * @returns Estadísticas actualizadas del usuario
   *
   * @example
   * PATCH /api/v1/gamification/users/550e8400-e29b-41d4-a716-446655440000/stats
   * Request: {
   *   "total_xp": 350,
   *   "current_streak": 5,
   *   "exercises_completed": 30
   * }
   * Response: {
   *   "id": "550e8400-e29b-41d4-a716-446655440000",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "level": 6,
   *   "total_xp": 350,
   *   "xp_to_next_level": 133,
   *   ...
   * }
   */
  @Patch('users/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user stats',
    description: 'Actualiza las estadísticas de gamificación de un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas actualizadas exitosamente',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        level: 6,
        total_xp: 350,
        xp_to_next_level: 133,
        current_rank: 'Nacom',
        rank_progress: 50.0,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async updateUserStats(
    @Param('userId') userId: string,
    @Body() updateData: Record<string, any>,
  ) {
    return await this.userStatsService.updateStats(userId, updateData);
  }
}
