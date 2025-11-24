import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MissionsService } from '../services/missions.service';
import { MissionTypeEnum } from '../entities/mission.entity';
import { MissionResponseDto } from '../dto/missions/mission-response.dto';
import { MissionStatsDto } from '../dto/missions/mission-stats.dto';
import { UpdateMissionProgressDto } from '../dto/missions/update-mission-progress.dto';
import { JwtAuthGuard } from '@/modules/auth/guards';

/**
 * MissionsController
 *
 * @description Controlador REST para gestión de misiones gamificadas.
 * Proporciona endpoints para consultar, iniciar, actualizar y reclamar misiones.
 *
 * Características:
 * - Generación automática de misiones daily/weekly
 * - Sistema de progreso multi-objetivo
 * - Sistema de reclamación de recompensas
 * - Estadísticas detalladas de misiones
 * - Autenticación JWT en todos los endpoints
 *
 * @route /api/v1/gamification/missions*
 * @security JWT Bearer Token
 *
 * @see Service: MissionsService
 * @see Entity: Mission
 */
@ApiTags('Gamification - Missions')
@Controller('gamification/missions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  /**
   * Obtiene misiones diarias del usuario autenticado
   *
   * @description Retorna las 3 misiones diarias del usuario.
   * Si no existen misiones para hoy, las genera automáticamente.
   *
   * Las misiones diarias incluyen:
   * 1. Completar 3 ejercicios → 50 XP + 25 ML Coins
   * 2. Racha de 2 aciertos → 30 XP + 15 ML Coins
   * 3. Estudiar 15 minutos → 40 XP + 20 ML Coins
   *
   * @param req - Request con usuario autenticado (JWT)
   * @returns Array de 3 misiones diarias
   *
   * @example
   * GET /api/v1/gamification/missions/daily
   * Authorization: Bearer <token>
   *
   * Response 200:
   * [
   *   {
   *     "id": "880e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "template_id": "daily_complete_exercises",
   *     "title": "Completar ejercicios",
   *     "description": "Completa 3 ejercicios hoy",
   *     "mission_type": "daily",
   *     "objectives": [
   *       {
   *         "type": "complete_exercises",
   *         "target": 3,
   *         "current": 1,
   *         "description": "Completa 3 ejercicios"
   *       }
   *     ],
   *     "rewards": {
   *       "ml_coins": 25,
   *       "xp": 50
   *     },
   *     "status": "in_progress",
   *     "progress": 33.33,
   *     "start_date": "2025-11-11T00:00:00Z",
   *     "end_date": "2025-11-11T23:59:59Z",
   *     "completed_at": null,
   *     "claimed_at": null
   *   },
   *   ...
   * ]
   */
  @Get('daily')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get daily missions',
    description:
      'Obtiene las 3 misiones diarias del usuario autenticado. Genera automáticamente si no existen.',
  })
  @ApiResponse({
    status: 200,
    description: 'Misiones diarias obtenidas exitosamente',
    type: [MissionResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  async getDailyMissions(@Request() req: any) {
    const userId = req.user.id;
    return await this.missionsService.findByTypeAndUser(userId, MissionTypeEnum.DAILY);
  }

  /**
   * Obtiene misiones semanales del usuario autenticado
   *
   * @description Retorna las 2 misiones semanales del usuario.
   * Si no existen misiones para esta semana, las genera automáticamente.
   *
   * Las misiones semanales incluyen:
   * 1. Completar 15 ejercicios → 200 XP + 100 ML Coins
   * 2. Racha de 5 días consecutivos → 300 XP + 150 ML Coins
   *
   * @param req - Request con usuario autenticado (JWT)
   * @returns Array de 2 misiones semanales
   *
   * @example
   * GET /api/v1/gamification/missions/weekly
   * Authorization: Bearer <token>
   *
   * Response 200:
   * [
   *   {
   *     "id": "990e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "template_id": "weekly_exercise_marathon",
   *     "title": "Maratón de ejercicios",
   *     "description": "Completa 15 ejercicios esta semana",
   *     "mission_type": "weekly",
   *     "objectives": [
   *       {
   *         "type": "complete_exercises",
   *         "target": 15,
   *         "current": 5,
   *         "description": "Completa 15 ejercicios"
   *       }
   *     ],
   *     "rewards": {
   *       "ml_coins": 100,
   *       "xp": 200
   *     },
   *     "status": "in_progress",
   *     "progress": 33.33,
   *     "start_date": "2025-11-09T00:00:00Z",
   *     "end_date": "2025-11-15T23:59:59Z",
   *     "completed_at": null,
   *     "claimed_at": null
   *   },
   *   ...
   * ]
   */
  @Get('weekly')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get weekly missions',
    description:
      'Obtiene las 2 misiones semanales del usuario autenticado. Genera automáticamente si no existen.',
  })
  @ApiResponse({
    status: 200,
    description: 'Misiones semanales obtenidas exitosamente',
    type: [MissionResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  async getWeeklyMissions(@Request() req: any) {
    const userId = req.user.id;
    return await this.missionsService.findByTypeAndUser(userId, MissionTypeEnum.WEEKLY);
  }

  /**
   * Obtiene misiones especiales del usuario autenticado
   *
   * @description Retorna las misiones especiales activas del usuario.
   * Las misiones especiales son creadas manualmente para eventos especiales
   * y NO se generan automáticamente.
   *
   * @param req - Request con usuario autenticado (JWT)
   * @returns Array de misiones especiales (puede estar vacío)
   *
   * @example
   * GET /api/v1/gamification/missions/special
   * Authorization: Bearer <token>
   *
   * Response 200:
   * [
   *   {
   *     "id": "aa0e8400-e29b-41d4-a716-446655440000",
   *     "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *     "template_id": "special_halloween_2025",
   *     "title": "Desafío Halloween",
   *     "description": "Completa 5 ejercicios de cultura maya",
   *     "mission_type": "special",
   *     "objectives": [...],
   *     "rewards": {
   *       "ml_coins": 500,
   *       "xp": 1000
   *     },
   *     "status": "active",
   *     "progress": 0,
   *     ...
   *   }
   * ]
   */
  @Get('special')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get special missions',
    description:
      'Obtiene las misiones especiales del usuario autenticado. Estas misiones son creadas manualmente para eventos especiales.',
  })
  @ApiResponse({
    status: 200,
    description: 'Misiones especiales obtenidas exitosamente',
    type: [MissionResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  async getSpecialMissions(@Request() req: any) {
    const userId = req.user.id;
    return await this.missionsService.findByTypeAndUser(userId, MissionTypeEnum.SPECIAL);
  }

  /**
   * Obtiene estadísticas de misiones del usuario
   *
   * @description Retorna estadísticas detalladas de las misiones del usuario:
   * - Misiones del día (completadas / totales)
   * - Misiones de la semana (completadas / totales)
   * - Totales históricos (completadas, XP ganado, ML Coins ganados)
   * - Rachas actuales y récords
   *
   * @param userId - ID del usuario (UUID)
   * @param req - Request con usuario autenticado (JWT)
   * @returns Objeto con estadísticas detalladas
   *
   * @throws {BadRequestException} Si userId no coincide con usuario autenticado
   *
   * @example
   * GET /api/v1/gamification/missions/stats/550e8400-e29b-41d4-a716-446655440000
   * Authorization: Bearer <token>
   *
   * Response 200:
   * {
   *   "todayCompleted": 2,
   *   "todayTotal": 3,
   *   "weekCompleted": 8,
   *   "weekTotal": 10,
   *   "totalCompleted": 45,
   *   "totalXPEarned": 2250,
   *   "totalMLCoinsEarned": 1125,
   *   "currentStreak": 5,
   *   "longestStreak": 12
   * }
   */
  @Get('stats/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mission stats for user',
    description: 'Obtiene estadísticas detalladas de misiones del usuario',
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
    description: 'Estadísticas obtenidas exitosamente',
    type: MissionStatsDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - El userId no coincide con el usuario autenticado',
  })
  async getStats(@Param('userId') userId: string, @Request() req: any) {
    // Validar que el userId coincide con el usuario autenticado
    if (userId !== req.user.id) {
      throw new HttpException('Forbidden: Cannot access stats of another user', HttpStatus.FORBIDDEN);
    }

    return await this.missionsService.getStats(userId);
  }

  /**
   * Inicia una misión
   *
   * @description Marca una misión como 'in_progress' (iniciada por el usuario).
   * Solo se pueden iniciar misiones con status 'active'.
   *
   * @param id - ID de la misión (UUID)
   * @param req - Request con usuario autenticado (JWT)
   * @returns Misión actualizada con status 'in_progress'
   *
   * @throws {NotFoundException} Si la misión no existe
   * @throws {BadRequestException} Si la misión no pertenece al usuario o no está activa
   *
   * @example
   * POST /api/v1/gamification/missions/880e8400-e29b-41d4-a716-446655440000/start
   * Authorization: Bearer <token>
   *
   * Response 200:
   * {
   *   "id": "880e8400-e29b-41d4-a716-446655440000",
   *   "status": "in_progress",
   *   ...
   * }
   */
  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Start a mission',
    description: 'Inicia una misión (cambia status a in_progress)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión en formato UUID',
    type: String,
    required: true,
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Misión iniciada exitosamente',
    type: MissionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Misión no puede ser iniciada (no pertenece al usuario o no está activa)',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión no encontrada',
  })
  async startMission(@Param('id') missionId: string, @Request() req: any) {
    const userId = req.user.id;
    return await this.missionsService.startMission(missionId, userId);
  }

  /**
   * Actualiza el progreso de una misión
   *
   * @description Incrementa el progreso de un objetivo específico dentro de una misión.
   * Recalcula el progreso general de la misión (0-100%).
   * Si todos los objetivos se completan, marca la misión como 'completed'.
   *
   * Tipos de objetivos soportados:
   * - complete_exercises: Ejercicios completados
   * - correct_streak: Racha de aciertos
   * - study_time: Tiempo de estudio (minutos)
   * - consecutive_days: Días consecutivos
   *
   * @param id - ID de la misión (UUID)
   * @param dto - DTO con tipo de objetivo y cantidad a incrementar
   * @param req - Request con usuario autenticado (JWT)
   * @returns Misión actualizada con nuevo progreso
   *
   * @throws {NotFoundException} Si la misión no existe
   * @throws {BadRequestException} Si la misión no pertenece al usuario, está expirada, o el objetivo no existe
   *
   * @example
   * PATCH /api/v1/gamification/missions/880e8400-e29b-41d4-a716-446655440000/progress
   * Authorization: Bearer <token>
   * Content-Type: application/json
   *
   * Request body:
   * {
   *   "objective_type": "complete_exercises",
   *   "increment": 1
   * }
   *
   * Response 200:
   * {
   *   "id": "880e8400-e29b-41d4-a716-446655440000",
   *   "objectives": [
   *     {
   *       "type": "complete_exercises",
   *       "target": 3,
   *       "current": 2,
   *       "description": "Completa 3 ejercicios"
   *     }
   *   ],
   *   "progress": 66.67,
   *   "status": "in_progress",
   *   ...
   * }
   */
  @Patch(':id/progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update mission progress',
    description:
      'Actualiza el progreso de un objetivo específico. Si se completan todos los objetivos, la misión se marca como completed.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión en formato UUID',
    type: String,
    required: true,
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso actualizado exitosamente',
    type: MissionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, misión expirada, o objetivo no existe',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión no encontrada',
  })
  async updateProgress(
    @Param('id') missionId: string,
    @Body() dto: UpdateMissionProgressDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return await this.missionsService.updateProgress(
      missionId,
      userId,
      dto.objective_type,
      dto.increment,
    );
  }

  /**
   * Reclama las recompensas de una misión completada
   *
   * @description Marca una misión como 'claimed' y otorga las recompensas al usuario.
   * Solo se pueden reclamar misiones con status 'completed'.
   *
   * TODO: Integrar con MLCoinsService y UserStatsService para otorgar recompensas reales.
   *
   * @param id - ID de la misión (UUID)
   * @param req - Request con usuario autenticado (JWT)
   * @returns Objeto con misión actualizada y recompensas otorgadas
   *
   * @throws {NotFoundException} Si la misión no existe
   * @throws {BadRequestException} Si la misión no pertenece al usuario, no está completada, o ya fue reclamada
   *
   * @example
   * POST /api/v1/gamification/missions/880e8400-e29b-41d4-a716-446655440000/claim
   * Authorization: Bearer <token>
   *
   * Response 200:
   * {
   *   "mission": {
   *     "id": "880e8400-e29b-41d4-a716-446655440000",
   *     "status": "claimed",
   *     "claimed_at": "2025-11-11T15:30:00Z",
   *     ...
   *   },
   *   "rewards": {
   *     "ml_coins": 25,
   *     "xp": 50
   *   }
   * }
   */
  @Post(':id/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Claim mission rewards',
    description: 'Reclama las recompensas de una misión completada y las otorga al usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión en formato UUID',
    type: String,
    required: true,
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recompensas reclamadas exitosamente',
    schema: {
      example: {
        mission: {
          id: '880e8400-e29b-41d4-a716-446655440000',
          status: 'claimed',
          claimed_at: '2025-11-11T15:30:00Z',
        },
        rewards: {
          ml_coins: 25,
          xp: 50,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Misión no está completada o ya fue reclamada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token JWT inválido o ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión no encontrada',
  })
  async claimRewards(@Param('id') missionId: string, @Request() req: any) {
    const userId = req.user.id;
    return await this.missionsService.claimRewards(missionId, userId);
  }
}
