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
import { ModuleProgressService } from '../services';
import { PendingActivitiesService } from '../services/pending-activities.service';
import { RecentActivityService } from '../services/recent-activity.service';
import {
  CreateModuleProgressDto,
  ModuleProgressResponseDto,
} from '../dto';
import {
  GetPendingActivitiesDto,
  PendingActivityDto,
} from '../dto/pending-activities.dto';
import {
  GetRecentActivitiesDto,
  RecentActivityDto,
} from '../dto/recent-activity.dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ModuleProgressController
 *
 * @description Gestión del progreso de estudiantes por módulo educativo.
 * Endpoints para tracking de avance, completación y estadísticas de progreso.
 *
 * @route /api/v1/progress
 */
@ApiTags('Progress - Module Progress')
@Controller(extractBasePath(API_ROUTES.PROGRESS.BASE))
export class ModuleProgressController {
  constructor(
    private readonly progressService: ModuleProgressService,
    private readonly pendingActivitiesService: PendingActivitiesService,
    private readonly recentActivityService: RecentActivityService,
  ) {}

  /**
   * Obtiene el progreso de un usuario en todos los módulos
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de progreso de módulos ordenados por última actualización
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user progress for all modules',
    description:
      'Obtiene todos los registros de progreso de un usuario en diferentes módulos educativos',
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
    description: 'Lista de progreso obtenida exitosamente',
    type: [ModuleProgressResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          module_id: '660e8400-e29b-41d4-a716-446655440000',
          status: 'in_progress',
          progress_percentage: 45.5,
          completed_exercises: 5,
          total_exercises: 11,
          total_score: 850,
          total_xp_earned: 250,
          total_ml_coins_earned: 125,
          started_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-16T14:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getUserProgress(@Param('userId') userId: string) {
    return await this.progressService.findByUserId(userId);
  }

  /**
   * Obtiene el progreso específico de un usuario en un módulo
   *
   * @param userId - ID del usuario (UUID)
   * @param moduleId - ID del módulo (UUID)
   * @returns Registro de progreso del usuario en el módulo
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000/modules/660e8400-e29b-41d4-a716-446655440000
   */
  @Get('users/:userId/modules/:moduleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user progress for specific module',
    description: 'Obtiene el progreso de un usuario en un módulo específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'ID del módulo educativo en formato UUID',
    type: String,
    required: true,
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso obtenido exitosamente',
    type: ModuleProgressResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module_id: '660e8400-e29b-41d4-a716-446655440000',
        status: 'in_progress',
        progress_percentage: 45.5,
        completed_exercises: 5,
        total_exercises: 11,
        skipped_exercises: 1,
        total_score: 850,
        total_xp_earned: 250,
        total_ml_coins_earned: 125,
        time_spent: '02:30:45',
        sessions_count: 3,
        attempts_count: 18,
        hints_used_total: 4,
        comodines_used_total: 2,
        comodines_cost_total: 100,
        started_at: '2025-01-15T10:00:00Z',
        completed_at: null,
        last_activity_at: '2025-01-16T14:30:00Z',
        learning_path: ['exercise-1', 'exercise-2', 'exercise-3'],
        performance_analytics: {
          average_score: 85,
          best_exercise: 'exercise-2',
          struggling_topics: ['topic-a'],
        },
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-16T14:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Progreso no encontrado para el usuario y módulo especificados',
  })
  async getModuleProgress(
    @Param('userId') userId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return await this.progressService.findByUserAndModule(userId, moduleId);
  }

  /**
   * Crea un nuevo registro de progreso para un módulo
   *
   * @param createProgressDto - Datos para crear el progreso
   * @returns Nuevo registro de progreso
   *
   * @example
   * POST /api/v1/progress
   * Request: {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "module_id": "660e8400-e29b-41d4-a716-446655440000",
   *   "total_exercises": 11
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create module progress record',
    description:
      'Crea un nuevo registro de progreso cuando un usuario inicia un módulo educativo',
  })
  @ApiResponse({
    status: 201,
    description: 'Progreso creado exitosamente',
    type: ModuleProgressResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module_id: '660e8400-e29b-41d4-a716-446655440000',
        status: 'not_started',
        progress_percentage: 0,
        completed_exercises: 0,
        total_exercises: 11,
        total_score: 0,
        started_at: '2025-01-15T10:00:00Z',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o progreso ya existe para este usuario y módulo',
    schema: {
      example: {
        statusCode: 400,
        message: 'Progress already exists for user 550e8400-e29b-41d4-a716-446655440000 in module 660e8400-e29b-41d4-a716-446655440000',
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createProgressDto: CreateModuleProgressDto) {
    return await this.progressService.create(createProgressDto);
  }

  /**
   * Actualiza el progreso de un módulo
   *
   * @param id - ID del registro de progreso (UUID)
   * @param updateData - Datos a actualizar (parciales)
   * @returns Progreso actualizado
   *
   * @example
   * PATCH /api/v1/progress/550e8400-e29b-41d4-a716-446655440001
   * Request: {
   *   "completed_exercises": 6,
   *   "total_score": 950,
   *   "status": "in_progress"
   * }
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update module progress',
    description: 'Actualiza campos específicos del progreso de un módulo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de progreso en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso actualizado exitosamente',
    type: ModuleProgressResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de progreso no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateModuleProgressDto>,
  ) {
    return await this.progressService.update(id, updateData);
  }

  /**
   * Actualiza el porcentaje de progreso de un módulo
   *
   * @param id - ID del registro de progreso (UUID)
   * @param body - Objeto con el nuevo porcentaje
   * @returns Progreso actualizado con nuevo porcentaje
   *
   * @example
   * PATCH /api/v1/progress/550e8400-e29b-41d4-a716-446655440001/percentage
   * Request: { "percentage": 55.5 }
   */
  @Patch(':id/percentage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update progress percentage',
    description:
      'Actualiza el porcentaje de progreso en un módulo basado en ejercicios completados',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de progreso en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Porcentaje de progreso actualizado exitosamente',
    type: ModuleProgressResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        progress_percentage: 55.5,
        status: 'in_progress',
        updated_at: '2025-01-16T15:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Porcentaje inválido (debe estar entre 0 y 100)',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de progreso no encontrado',
  })
  async updateProgressPercentage(
    @Param('id') id: string,
    @Body() body: { percentage: number },
  ) {
    return await this.progressService.updateProgressPercentage(
      id,
      body.percentage,
    );
  }

  /**
   * Marca un módulo como completado
   *
   * @param id - ID del registro de progreso (UUID)
   * @returns Progreso actualizado con status 'completed'
   *
   * @example
   * POST /api/v1/progress/550e8400-e29b-41d4-a716-446655440001/complete
   */
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete module',
    description:
      'Marca un módulo como completado, actualiza status y registra fecha de completación',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de progreso en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo completado exitosamente',
    type: ModuleProgressResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'completed',
        progress_percentage: 100,
        completed_at: '2025-01-17T18:45:00Z',
        updated_at: '2025-01-17T18:45:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de progreso no encontrado',
  })
  async completeModule(@Param('id') id: string) {
    return await this.progressService.completeModule(id);
  }

  /**
   * Obtiene estadísticas agregadas de un módulo
   *
   * @param moduleId - ID del módulo (UUID)
   * @returns Estadísticas del módulo (promedio, completados, etc.)
   *
   * @example
   * GET /api/v1/progress/modules/660e8400-e29b-41d4-a716-446655440000/stats
   */
  @Get('modules/:moduleId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get module statistics',
    description:
      'Obtiene estadísticas agregadas de un módulo: usuarios completados, promedio de progreso, tiempo promedio, etc.',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'ID del módulo educativo en formato UUID',
    type: String,
    required: true,
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del módulo obtenidas exitosamente',
    schema: {
      example: {
        module_id: '660e8400-e29b-41d4-a716-446655440000',
        total_users: 125,
        completed_users: 78,
        in_progress_users: 42,
        not_started_users: 5,
        average_progress: 67.5,
        average_score: 82.3,
        average_time_spent: '03:45:30',
        completion_rate: 62.4,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  async getModuleStats(@Param('moduleId') moduleId: string) {
    return await this.progressService.getModuleStats(moduleId);
  }

  /**
   * Obtiene resumen de progreso de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Resumen con totales, promedios y estadísticas generales
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000/summary
   */
  @Get('users/:userId/summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user progress summary',
    description:
      'Obtiene un resumen consolidado del progreso del usuario en todos los módulos',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen de progreso obtenido exitosamente',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        total_modules: 8,
        completed_modules: 3,
        in_progress_modules: 4,
        not_started_modules: 1,
        overall_progress: 45.5,
        total_xp_earned: 1250,
        total_ml_coins_earned: 625,
        total_time_spent: '12:30:45',
        average_score: 85.3,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserProgressSummary(@Param('userId') userId: string) {
    return await this.progressService.getUserProgressSummary(userId);
  }

  /**
   * Obtiene módulos en progreso de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de módulos con status 'in_progress'
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000/in-progress
   */
  @Get('users/:userId/in-progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user modules in progress',
    description: 'Obtiene todos los módulos que el usuario tiene en progreso actualmente',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos en progreso obtenida exitosamente',
    type: [ModuleProgressResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          module_id: '660e8400-e29b-41d4-a716-446655440000',
          status: 'in_progress',
          progress_percentage: 45.5,
          last_activity_at: '2025-01-16T14:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findInProgress(@Param('userId') userId: string) {
    return await this.progressService.findInProgress(userId);
  }

  /**
   * Calcula la ruta de aprendizaje recomendada para un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Ruta de aprendizaje personalizada basada en progreso y performance
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000/learning-path
   */
  @Get('users/:userId/learning-path')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate learning path',
    description:
      'Calcula y devuelve una ruta de aprendizaje personalizada basada en el progreso, performance y áreas de mejora del usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Ruta de aprendizaje calculada exitosamente',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        recommended_modules: [
          {
            module_id: '660e8400-e29b-41d4-a716-446655440001',
            priority: 'high',
            reason: 'Prerequisite for current modules',
          },
          {
            module_id: '660e8400-e29b-41d4-a716-446655440002',
            priority: 'medium',
            reason: 'Strengthen weak areas',
          },
        ],
        areas_for_improvement: ['Comprensión Literal', 'Inferencial'],
        suggested_exercises: ['exercise-7', 'exercise-9'],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async calculateLearningPath(@Param('userId') userId: string) {
    return await this.progressService.calculateLearningPath(userId);
  }

  /**
   * Get pending activities for a user
   *
   * @param userId - User ID (UUID)
   * @param query - Query parameters for filtering
   * @returns List of pending activities prioritized by urgency
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000/pending-activities?limit=10
   */
  @Get('users/:userId/pending-activities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user pending activities',
    description:
      'Obtiene lista de actividades pendientes del usuario basado en módulos incompletos, priorizadas por urgencia y fecha límite',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'type',
    description: 'Filter by activity type',
    enum: ['exercise', 'lesson', 'assessment', 'assignment'],
    required: false,
  })
  @ApiQuery({
    name: 'priority',
    description: 'Filter by priority level',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of activities to return (1-50)',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Pending activities retrieved successfully',
    schema: {
      example: [
        {
          id: 'activity-660e8400-e29b-41d4-a716-446655440000',
          type: 'exercise',
          title: 'Comprensión Literal - Nivel 1',
          module_name: 'Comprensión Literal - Nivel 1',
          module_id: '660e8400-e29b-41d4-a716-446655440000',
          difficulty: 'easy',
          estimated_minutes: 15,
          due_date: '2025-01-20T23:59:59Z',
          priority: 'high',
          xp_reward: 100,
          ml_coins_reward: 50,
          progress_percentage: 45.5,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getPendingActivities(
    @Param('userId') userId: string,
    @Query() query: GetPendingActivitiesDto,
  ): Promise<PendingActivityDto[]> {
    return await this.pendingActivitiesService.getPendingActivities(
      userId,
      query,
    );
  }

  /**
   * Get recent activities for a user
   *
   * @param userId - User ID (UUID)
   * @param query - Query parameters for pagination
   * @returns List of recent learning activities
   *
   * @example
   * GET /api/v1/progress/users/550e8400-e29b-41d4-a716-446655440000/recent-activities?limit=20
   */
  @Get('users/:userId/recent-activities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user recent activities',
    description:
      'Obtiene lista de actividades recientes del usuario: módulos iniciados/completados, ejercicios resueltos, sesiones de estudio',
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
    description: 'Maximum number of activities to return (1-100)',
    type: Number,
    required: false,
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Offset for pagination',
    type: Number,
    required: false,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
    schema: {
      example: [
        {
          id: 'module-completed-550e8400',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          action: 'completed_module',
          description: 'Completó el módulo "Comprensión Literal - Nivel 1"',
          entity_type: 'module',
          entity_id: '660e8400-e29b-41d4-a716-446655440000',
          entity_name: 'Comprensión Literal - Nivel 1',
          metadata: {
            xp_earned: 100,
            ml_coins_earned: 50,
            progress_percentage: 100,
          },
          created_at: '2025-01-18T10:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getRecentActivities(
    @Param('userId') userId: string,
    @Query() query: GetRecentActivitiesDto,
  ): Promise<RecentActivityDto[]> {
    return await this.recentActivityService.getRecentActivities(
      userId,
      query,
    );
  }
}
