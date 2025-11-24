import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
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
import { LearningSessionService } from '../services';
import {
  CreateLearningSessionDto,
  LearningSessionResponseDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * LearningSessionController
 *
 * @description Gestión de sesiones de aprendizaje y tracking de actividad.
 * Endpoints para iniciar, finalizar y analizar sesiones de estudio.
 *
 * @route /api/v1/progress/sessions
 */
@ApiTags('Progress - Learning Sessions')
@Controller(extractBasePath(API_ROUTES.PROGRESS.BASE))
export class LearningSessionController {
  constructor(private readonly sessionService: LearningSessionService) {}

  /**
   * Crea una nueva sesión de aprendizaje
   *
   * @param createSessionDto - Datos para crear la sesión
   * @returns Nueva sesión de aprendizaje
   *
   * @example
   * POST /api/v1/progress/sessions
   * Request: {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "module_id": "660e8400-e29b-41d4-a716-446655440000",
   *   "device_type": "desktop"
   * }
   */
  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create learning session',
    description:
      'Inicia una nueva sesión de aprendizaje para tracking de tiempo y actividad del usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión creada exitosamente',
    type: LearningSessionResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module_id: '660e8400-e29b-41d4-a716-446655440000',
        started_at: '2025-01-16T10:00:00Z',
        is_active: true,
        device_type: 'desktop',
        ip_address: '192.168.1.1',
        created_at: '2025-01-16T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o sesión activa ya existe',
  })
  async create(@Body() createSessionDto: CreateLearningSessionDto) {
    return await this.sessionService.create(createSessionDto);
  }

  /**
   * Obtiene todas las sesiones de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de sesiones ordenadas por fecha de inicio (más recientes primero)
   *
   * @example
   * GET /api/v1/progress/sessions/users/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('sessions/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user sessions',
    description: 'Obtiene todas las sesiones de aprendizaje de un usuario',
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
    description: 'Lista de sesiones obtenida exitosamente',
    type: [LearningSessionResponseDto],
    schema: {
      example: [
        {
          id: '770e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          module_id: '660e8400-e29b-41d4-a716-446655440000',
          started_at: '2025-01-16T10:00:00Z',
          ended_at: '2025-01-16T11:30:00Z',
          duration: '01:30:00',
          is_active: false,
          exercises_completed: 3,
          xp_earned: 150,
          ml_coins_earned: 75,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.sessionService.findByUserId(userId);
  }

  /**
   * Obtiene una sesión específica por ID
   *
   * @param id - ID de la sesión (UUID)
   * @returns Sesión de aprendizaje
   *
   * @example
   * GET /api/v1/progress/sessions/770e8400-e29b-41d4-a716-446655440000
   */
  @Get('sessions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get session by ID',
    description: 'Obtiene los detalles de una sesión de aprendizaje específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sesión en formato UUID',
    type: String,
    required: true,
    example: '770e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión encontrada exitosamente',
    type: LearningSessionResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module_id: '660e8400-e29b-41d4-a716-446655440000',
        started_at: '2025-01-16T10:00:00Z',
        ended_at: '2025-01-16T11:30:00Z',
        duration: '01:30:00',
        is_active: false,
        exercises_completed: 3,
        exercises_attempted: 5,
        xp_earned: 150,
        ml_coins_earned: 75,
        engagement_score: 85.5,
        focus_time: '01:15:00',
        idle_time: '00:15:00',
        device_type: 'desktop',
        browser: 'Chrome',
        location: 'Guatemala City',
        created_at: '2025-01-16T10:00:00Z',
        updated_at: '2025-01-16T11:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  async findById(@Param('id') id: string) {
    return await this.sessionService.findById(id);
  }

  /**
   * Finaliza una sesión de aprendizaje
   *
   * @param id - ID de la sesión (UUID)
   * @returns Sesión finalizada con duración calculada
   *
   * @example
   * POST /api/v1/progress/sessions/770e8400-e29b-41d4-a716-446655440000/end
   */
  @Post('sessions/:id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'End learning session',
    description:
      'Finaliza una sesión activa, calcula duración y actualiza estadísticas finales',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sesión en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión finalizada exitosamente',
    type: LearningSessionResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440000',
        ended_at: '2025-01-16T11:30:00Z',
        duration: '01:30:00',
        is_active: false,
        exercises_completed: 3,
        xp_earned: 150,
        ml_coins_earned: 75,
        engagement_score: 85.5,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Sesión ya está finalizada',
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  async endSession(@Param('id') id: string) {
    return await this.sessionService.endSession(id);
  }

  /**
   * Actualiza el engagement score de una sesión
   *
   * @param id - ID de la sesión (UUID)
   * @param body - Objeto con el nuevo engagement score
   * @returns Sesión actualizada
   *
   * @example
   * PATCH /api/v1/progress/sessions/770e8400-e29b-41d4-a716-446655440000/engagement
   * Request: { "engagement_score": 92.5 }
   */
  @Patch('sessions/:id/engagement')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update engagement score',
    description:
      'Actualiza el score de engagement basado en interacciones, tiempo de foco y completación de ejercicios',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sesión en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Engagement score actualizado exitosamente',
    type: LearningSessionResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440000',
        engagement_score: 92.5,
        updated_at: '2025-01-16T11:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Engagement score inválido (debe estar entre 0 y 100)',
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  async updateEngagement(
    @Param('id') id: string,
    @Body()
    body: {
      clicks_count?: number;
      page_views?: number;
      resource_downloads?: number;
      exercises_attempted?: number;
      exercises_completed?: number;
      content_viewed?: number;
      active_time?: string;
      idle_time?: string;
    },
  ) {
    return await this.sessionService.updateEngagement(id, body);
  }

  /**
   * Obtiene la sesión activa de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Sesión activa o null si no hay ninguna
   *
   * @example
   * GET /api/v1/progress/sessions/users/550e8400-e29b-41d4-a716-446655440000/active
   */
  @Get('sessions/users/:userId/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active session',
    description: 'Obtiene la sesión de aprendizaje activa actual del usuario, si existe',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión activa obtenida exitosamente (puede ser null)',
    type: LearningSessionResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module_id: '660e8400-e29b-41d4-a716-446655440000',
        started_at: '2025-01-16T10:00:00Z',
        is_active: true,
        exercises_completed: 2,
        current_duration: '00:45:30',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getActiveSession(@Param('userId') userId: string) {
    return await this.sessionService.getActiveSession(userId);
  }

  /**
   * Obtiene estadísticas de sesiones por período
   *
   * @param userId - ID del usuario (UUID)
   * @param period - Período de agregación (opcional: daily, weekly, monthly)
   * @returns Estadísticas agregadas de sesiones
   *
   * @example
   * GET /api/v1/progress/sessions/users/550e8400-e29b-41d4-a716-446655440000/stats?period=weekly
   */
  @Get('sessions/users/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get session statistics',
    description:
      'Obtiene estadísticas agregadas de sesiones de aprendizaje por período (diario, semanal, mensual)',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'period',
    description: 'Período de agregación para las estadísticas',
    required: false,
    enum: ['daily', 'weekly', 'monthly'],
    example: 'weekly',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de sesiones obtenidas exitosamente',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        period: 'weekly',
        total_sessions: 12,
        total_time: '18:30:45',
        average_duration: '01:32:33',
        total_exercises_completed: 45,
        total_xp_earned: 1250,
        total_ml_coins_earned: 625,
        average_engagement: 87.5,
        sessions_per_day: 1.7,
        most_active_day: 'Monday',
        most_active_time: '14:00-16:00',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getSessionStats(
    @Param('userId') userId: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
  ) {
    const validPeriod = period || 'daily';
    return await this.sessionService.getSessionStats(userId, validPeriod);
  }

  /**
   * Obtiene sesiones por rango de fechas
   *
   * @param userId - ID del usuario (UUID)
   * @param startDate - Fecha de inicio (ISO 8601)
   * @param endDate - Fecha de fin (ISO 8601)
   * @returns Lista de sesiones en el rango especificado
   *
   * @example
   * GET /api/v1/progress/sessions/users/550e8400-e29b-41d4-a716-446655440000/range?startDate=2025-01-01&endDate=2025-01-31
   */
  @Get('sessions/users/:userId/range')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get sessions by date range',
    description: 'Obtiene todas las sesiones de un usuario dentro de un rango de fechas',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Fecha de inicio en formato ISO 8601',
    required: false,
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Fecha de fin en formato ISO 8601',
    required: false,
    type: String,
    example: '2025-01-31T23:59:59Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesiones en el rango de fechas obtenidas exitosamente',
    type: [LearningSessionResponseDto],
    schema: {
      example: [
        {
          id: '770e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          started_at: '2025-01-15T10:00:00Z',
          ended_at: '2025-01-15T11:30:00Z',
          duration: '01:30:00',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Rango de fechas inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findByDateRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();
    return await this.sessionService.findByDateRange(userId, start, end);
  }
}
