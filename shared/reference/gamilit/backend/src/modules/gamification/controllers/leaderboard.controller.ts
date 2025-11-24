import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LeaderboardService } from '../services';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { JwtAuthGuard } from '@/modules/auth/guards';

/**
 * LeaderboardController
 *
 * @description Gestión de leaderboards y rankings del sistema
 * - Leaderboard global (todos los usuarios)
 * - Leaderboard por escuela
 * - Leaderboard por aula
 *
 * SEGURIDAD: Protegido con JwtAuthGuard - Requiere autenticación
 *
 * @route /api/v1/gamification/leaderboard/*
 */
@ApiTags('Gamification - Leaderboard')
@Controller(extractBasePath(API_ROUTES.GAMIFICATION.BASE))
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  /**
   * Obtiene el leaderboard global
   *
   * @param limit - Cantidad de usuarios a retornar (default: 100)
   * @param offset - Offset para paginación (default: 0)
   * @param timePeriod - Período de tiempo: all_time, this_week, this_month (future feature)
   * @returns Leaderboard global con top usuarios
   *
   * @example
   * GET /api/v1/gamification/leaderboard/global?limit=50&offset=0
   * Response: {
   *   "type": "global",
   *   "entries": [
   *     {
   *       "rank": 1,
   *       "userId": "550e8400-...",
   *       "username": "Juan Pérez",
   *       "firstName": "Juan",
   *       "lastName": "Pérez",
   *       "avatar": "https://...",
   *       "totalXP": 15000,
   *       "level": 25,
   *       "currentRank": "Nacom",
   *       "streak": 45,
   *       "achievementCount": 12,
   *       "tasksCompleted": 150
   *     },
   *     ...
   *   ],
   *   "totalEntries": 1500,
   *   "lastUpdated": "2025-11-04T10:30:00Z",
   *   "timePeriod": "all_time"
   * }
   */
  @Get('leaderboard/global')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get global leaderboard',
    description:
      'Obtiene el ranking global de todos los usuarios ordenados por XP total',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de usuarios a retornar',
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginación',
    example: 0,
  })
  @ApiQuery({
    name: 'timePeriod',
    required: false,
    type: String,
    description:
      'Período de tiempo: all_time, this_week, this_month (feature futura)',
    example: 'all_time',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard global obtenido exitosamente',
    schema: {
      example: {
        type: 'global',
        entries: [
          {
            rank: 1,
            userId: '550e8400-e29b-41d4-a716-446655440000',
            username: 'Juan Pérez',
            firstName: 'Juan',
            lastName: 'Pérez',
            avatar: 'https://cdn.example.com/avatars/juan.jpg',
            totalXP: 15000,
            level: 25,
            currentRank: 'Nacom',
            streak: 45,
            achievementCount: 12,
            tasksCompleted: 150,
          },
        ],
        totalEntries: 1500,
        lastUpdated: '2025-11-04T10:30:00Z',
        timePeriod: 'all_time',
      },
    },
  })
  async getGlobalLeaderboard(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('timePeriod') timePeriod?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return await this.leaderboardService.getGlobalLeaderboard(
      parsedLimit,
      parsedOffset,
      timePeriod,
    );
  }

  /**
   * Obtiene el leaderboard de una escuela
   *
   * @param schoolId - ID de la escuela (UUID)
   * @param limit - Cantidad de usuarios a retornar (default: 100)
   * @param offset - Offset para paginación (default: 0)
   * @param timePeriod - Período de tiempo (future feature)
   * @returns Leaderboard de la escuela
   *
   * @example
   * GET /api/v1/gamification/leaderboard/schools/660e8400-e29b-41d4-a716-446655440000?limit=50
   * Response: {
   *   "type": "school",
   *   "entries": [...],
   *   "totalEntries": 250,
   *   "lastUpdated": "2025-11-04T10:30:00Z",
   *   "timePeriod": "all_time",
   *   "schoolId": "660e8400-e29b-41d4-a716-446655440000"
   * }
   */
  @Get('leaderboard/schools/:schoolId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get school leaderboard',
    description:
      'Obtiene el ranking de una escuela específica ordenado por XP',
  })
  @ApiParam({
    name: 'schoolId',
    description: 'ID de la escuela en formato UUID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de usuarios a retornar',
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginación',
    example: 0,
  })
  @ApiQuery({
    name: 'timePeriod',
    required: false,
    type: String,
    description: 'Período de tiempo (feature futura)',
    example: 'all_time',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard de escuela obtenido exitosamente',
    schema: {
      example: {
        type: 'school',
        entries: [
          {
            rank: 1,
            userId: '550e8400-e29b-41d4-a716-446655440000',
            username: 'María García',
            totalXP: 12000,
            level: 22,
            currentRank: 'Nacom',
            streak: 30,
            achievementCount: 10,
            tasksCompleted: 120,
          },
        ],
        totalEntries: 250,
        lastUpdated: '2025-11-04T10:30:00Z',
        timePeriod: 'all_time',
        schoolId: '660e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela no encontrada',
  })
  async getSchoolLeaderboard(
    @Param('schoolId') schoolId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('timePeriod') timePeriod?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return await this.leaderboardService.getSchoolLeaderboard(
      schoolId,
      parsedLimit,
      parsedOffset,
      timePeriod,
    );
  }

  /**
   * Obtiene el leaderboard de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @param limit - Cantidad de usuarios a retornar (default: 100)
   * @param offset - Offset para paginación (default: 0)
   * @param timePeriod - Período de tiempo (future feature)
   * @returns Leaderboard del aula
   *
   * @example
   * GET /api/v1/gamification/leaderboard/classrooms/770e8400-e29b-41d4-a716-446655440000?limit=30
   * Response: {
   *   "type": "classroom",
   *   "entries": [...],
   *   "totalEntries": 35,
   *   "lastUpdated": "2025-11-04T10:30:00Z",
   *   "timePeriod": "all_time",
   *   "classroomId": "770e8400-e29b-41d4-a716-446655440000"
   * }
   */
  @Get('leaderboard/classrooms/:classroomId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom leaderboard',
    description: 'Obtiene el ranking de un aula específica ordenado por XP',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de usuarios a retornar',
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginación',
    example: 0,
  })
  @ApiQuery({
    name: 'timePeriod',
    required: false,
    type: String,
    description: 'Período de tiempo (feature futura)',
    example: 'all_time',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard de aula obtenido exitosamente',
    schema: {
      example: {
        type: 'classroom',
        entries: [
          {
            rank: 1,
            userId: '550e8400-e29b-41d4-a716-446655440000',
            username: 'Carlos López',
            totalXP: 8000,
            level: 18,
            currentRank: 'Ajaw',
            streak: 20,
            achievementCount: 8,
            tasksCompleted: 85,
          },
        ],
        totalEntries: 35,
        lastUpdated: '2025-11-04T10:30:00Z',
        timePeriod: 'all_time',
        classroomId: '770e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  async getClassroomLeaderboard(
    @Param('classroomId') classroomId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('timePeriod') timePeriod?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return await this.leaderboardService.getClassroomLeaderboard(
      classroomId,
      parsedLimit,
      parsedOffset,
      timePeriod,
    );
  }

  /**
   * Obtiene el leaderboard de amigos del usuario
   *
   * @param userId - ID del usuario (UUID)
   * @param limit - Cantidad de amigos a retornar (default: 100)
   * @param offset - Offset para paginación (default: 0)
   * @param timePeriod - Período de tiempo (future feature)
   * @returns Leaderboard de amigos del usuario
   *
   * @example
   * GET /api/v1/gamification/leaderboard/friends/550e8400-e29b-41d4-a716-446655440000?limit=20
   * Response: {
   *   "type": "friends",
   *   "entries": [
   *     {
   *       "rank": 1,
   *       "userId": "660e8400-e29b-41d4-a716-446655440000",
   *       "username": "Ana Martínez",
   *       "totalXP": 9500,
   *       "level": 20,
   *       "currentRank": "Nacom",
   *       "streak": 25,
   *       "achievementCount": 9,
   *       "tasksCompleted": 95
   *     }
   *   ],
   *   "totalEntries": 15,
   *   "lastUpdated": "2025-11-11T10:30:00Z",
   *   "timePeriod": "all_time",
   *   "userId": "550e8400-e29b-41d4-a716-446655440000"
   * }
   */
  @Get('leaderboard/friends/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get friends leaderboard',
    description:
      'Obtiene el ranking de amigos de un usuario específico ordenado por XP',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de amigos a retornar',
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginación',
    example: 0,
  })
  @ApiQuery({
    name: 'timePeriod',
    required: false,
    type: String,
    description: 'Período de tiempo (feature futura)',
    example: 'all_time',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard de amigos obtenido exitosamente',
    schema: {
      example: {
        type: 'friends',
        entries: [
          {
            rank: 1,
            userId: '660e8400-e29b-41d4-a716-446655440000',
            username: 'Ana Martínez',
            firstName: 'Ana',
            lastName: 'Martínez',
            avatar: 'https://cdn.example.com/avatars/ana.jpg',
            totalXP: 9500,
            level: 20,
            currentRank: 'Nacom',
            streak: 25,
            achievementCount: 9,
            tasksCompleted: 95,
          },
        ],
        totalEntries: 15,
        lastUpdated: '2025-11-11T10:30:00Z',
        timePeriod: 'all_time',
        userId: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getFriendsLeaderboard(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('timePeriod') timePeriod?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return await this.leaderboardService.getFriendsLeaderboard(
      userId,
      parsedLimit,
      parsedOffset,
      timePeriod,
    );
  }
}
