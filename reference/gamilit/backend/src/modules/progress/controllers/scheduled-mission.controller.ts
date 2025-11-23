import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ScheduledMissionService } from '../services';
import {
  CreateScheduledMissionDto,
  ScheduledMissionResponseDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ScheduledMissionController
 *
 * @description Gestión de misiones programadas para aulas (classroom-based).
 * Endpoints para crear, asignar y trackear misiones colectivas con deadlines.
 *
 * @route /api/v1/progress/scheduled-missions
 */
@ApiTags('Progress - Scheduled Missions')
@Controller(extractBasePath(API_ROUTES.PROGRESS.BASE))
export class ScheduledMissionController {
  constructor(
    private readonly missionService: ScheduledMissionService,
  ) {}

  /**
   * Crea una nueva misión programada (Teacher only)
   *
   * @param createMissionDto - Datos para crear la misión
   * @returns Nueva misión programada
   *
   * @example
   * POST /api/v1/progress/scheduled-missions
   * Request: {
   *   "classroom_id": "bb0e8400-e29b-41d4-a716-446655440000",
   *   "mission_id": "cc0e8400-e29b-41d4-a716-446655440000",
   *   "assigned_by_teacher_id": "teacher-uuid",
   *   "start_date": "2025-01-20T00:00:00Z",
   *   "due_date": "2025-01-27T23:59:59Z"
   * }
   */
  @Post('scheduled-missions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create scheduled mission [Teacher only]',
    description:
      'Crea y asigna una nueva misión programada a un aula. Requiere permisos de profesor.',
  })
  @ApiResponse({
    status: 201,
    description: 'Misión programada creada exitosamente',
    type: ScheduledMissionResponseDto,
    schema: {
      example: {
        id: 'dd0e8400-e29b-41d4-a716-446655440000',
        classroom_id: 'bb0e8400-e29b-41d4-a716-446655440000',
        mission_id: 'cc0e8400-e29b-41d4-a716-446655440000',
        assigned_by_teacher_id: 'teacher-uuid',
        start_date: '2025-01-20T00:00:00Z',
        due_date: '2025-01-27T23:59:59Z',
        status: 'scheduled',
        is_active: false,
        created_at: '2025-01-16T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o fechas incorrectas',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de profesor',
  })
  async create(@Body() createMissionDto: CreateScheduledMissionDto) {
    return await this.missionService.create(createMissionDto);
  }

  /**
   * Obtiene todas las misiones de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @returns Lista de misiones ordenadas por fecha de vencimiento
   *
   * @example
   * GET /api/v1/progress/scheduled-missions/classrooms/bb0e8400-e29b-41d4-a716-446655440000
   */
  @Get('scheduled-missions/classrooms/:classroomId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom missions',
    description: 'Obtiene todas las misiones programadas para un aula específica',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
    example: 'bb0e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de misiones del aula obtenida exitosamente',
    type: [ScheduledMissionResponseDto],
    schema: {
      example: [
        {
          id: 'dd0e8400-e29b-41d4-a716-446655440000',
          classroom_id: 'bb0e8400-e29b-41d4-a716-446655440000',
          mission_id: 'cc0e8400-e29b-41d4-a716-446655440000',
          start_date: '2025-01-20T00:00:00Z',
          due_date: '2025-01-27T23:59:59Z',
          status: 'active',
          is_active: true,
          completion_percentage: 45.5,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  async findByClassroomId(@Param('classroomId') classroomId: string) {
    return await this.missionService.findByClassroomId(classroomId);
  }

  /**
   * Obtiene todas las misiones asignadas a un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de misiones ordenadas por fecha de vencimiento
   *
   * @example
   * GET /api/v1/progress/scheduled-missions/users/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('scheduled-missions/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user missions',
    description:
      'Obtiene todas las misiones programadas asignadas a un usuario a través de sus aulas',
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
    description: 'Lista de misiones del usuario obtenida exitosamente',
    type: [ScheduledMissionResponseDto],
    schema: {
      example: [
        {
          id: 'dd0e8400-e29b-41d4-a716-446655440000',
          classroom_id: 'bb0e8400-e29b-41d4-a716-446655440000',
          mission_id: 'cc0e8400-e29b-41d4-a716-446655440000',
          due_date: '2025-01-27T23:59:59Z',
          status: 'active',
          user_progress: 60.0,
          time_remaining: '5 days',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.missionService.findByUserId(userId);
  }

  /**
   * Obtiene todas las misiones activas
   *
   * @returns Lista de misiones activas en todas las aulas
   *
   * @example
   * GET /api/v1/progress/scheduled-missions/active
   */
  @Get('scheduled-missions/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active missions',
    description: 'Obtiene todas las misiones activas actualmente en todas las aulas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de misiones activas obtenida exitosamente',
    type: [ScheduledMissionResponseDto],
    schema: {
      example: [
        {
          id: 'dd0e8400-e29b-41d4-a716-446655440000',
          classroom_id: 'bb0e8400-e29b-41d4-a716-446655440000',
          mission_id: 'cc0e8400-e29b-41d4-a716-446655440000',
          status: 'active',
          is_active: true,
          completion_percentage: 62.5,
          participants_completed: 15,
          total_participants: 24,
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findActive() {
    return await this.missionService.findActive();
  }

  /**
   * Obtiene misiones próximas de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de misiones que iniciarán pronto
   *
   * @example
   * GET /api/v1/progress/scheduled-missions/users/550e8400-e29b-41d4-a716-446655440000/upcoming
   */
  @Get('scheduled-missions/users/:userId/upcoming')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get upcoming missions',
    description:
      'Obtiene las misiones programadas que iniciarán pronto para un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de misiones próximas obtenida exitosamente',
    type: [ScheduledMissionResponseDto],
    schema: {
      example: [
        {
          id: 'dd0e8400-e29b-41d4-a716-446655440000',
          classroom_id: 'bb0e8400-e29b-41d4-a716-446655440000',
          mission_id: 'cc0e8400-e29b-41d4-a716-446655440000',
          start_date: '2025-01-25T00:00:00Z',
          due_date: '2025-02-01T23:59:59Z',
          status: 'scheduled',
          days_until_start: 9,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findUpcoming(@Param('userId') userId: string) {
    return await this.missionService.findUpcoming(userId);
  }

  /**
   * Inicia una misión programada (marca como activa)
   *
   * @param id - ID de la misión programada (UUID)
   * @returns Misión actualizada con status 'active'
   *
   * @example
   * POST /api/v1/progress/scheduled-missions/dd0e8400-e29b-41d4-a716-446655440000/start
   */
  @Post('scheduled-missions/:id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Start mission',
    description:
      'Inicia una misión programada, cambiando su status a activo y habilitando participación',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión programada en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Misión iniciada exitosamente',
    type: ScheduledMissionResponseDto,
    schema: {
      example: {
        id: 'dd0e8400-e29b-41d4-a716-446655440000',
        status: 'active',
        is_active: true,
        actual_start_date: '2025-01-20T08:00:00Z',
        updated_at: '2025-01-20T08:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Misión ya iniciada o fecha de inicio no alcanzada',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión programada no encontrada',
  })
  async startMission(@Param('id') id: string) {
    return await this.missionService.startMission(id);
  }

  /**
   * Completa una misión programada
   *
   * @param id - ID de la misión programada (UUID)
   * @returns Misión actualizada con status 'completed'
   *
   * @example
   * POST /api/v1/progress/scheduled-missions/dd0e8400-e29b-41d4-a716-446655440000/complete
   */
  @Post('scheduled-missions/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete mission',
    description:
      'Marca una misión programada como completada y calcula recompensas finales',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión programada en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Misión completada exitosamente',
    type: ScheduledMissionResponseDto,
    schema: {
      example: {
        id: 'dd0e8400-e29b-41d4-a716-446655440000',
        status: 'completed',
        is_active: false,
        completion_percentage: 100,
        completed_at: '2025-01-27T16:30:00Z',
        participants_completed: 22,
        total_participants: 24,
        bonus_xp_awarded: 500,
        bonus_ml_coins_awarded: 250,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Misión no activa o ya completada',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión programada no encontrada',
  })
  async completeMission(@Param('id') id: string) {
    return await this.missionService.completeMission(id);
  }

  /**
   * Actualiza el progreso de una misión
   *
   * @param id - ID de la misión programada (UUID)
   * @param body - Nuevo porcentaje de progreso
   * @returns Misión actualizada con nuevo progreso
   *
   * @example
   * PATCH /api/v1/progress/scheduled-missions/dd0e8400-e29b-41d4-a716-446655440000/progress
   * Request: { "progress": 75.5 }
   */
  @Patch('scheduled-missions/:id/progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update mission progress',
    description:
      'Actualiza el porcentaje de progreso colectivo de una misión programada',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión programada en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso de misión actualizado exitosamente',
    type: ScheduledMissionResponseDto,
    schema: {
      example: {
        id: 'dd0e8400-e29b-41d4-a716-446655440000',
        completion_percentage: 75.5,
        participants_completed: 18,
        total_participants: 24,
        updated_at: '2025-01-25T14:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Progreso inválido o misión no activa',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión programada no encontrada',
  })
  async updateProgress(
    @Param('id') id: string,
    @Body() body: { progress: number },
  ) {
    return await this.missionService.updateProgress(id, body.progress);
  }

  /**
   * Reclama recompensas bonus de una misión completada
   *
   * @param id - ID de la misión programada (UUID)
   * @returns Misión actualizada con recompensas reclamadas
   *
   * @example
   * POST /api/v1/progress/scheduled-missions/dd0e8400-e29b-41d4-a716-446655440000/claim-rewards
   */
  @Post('scheduled-missions/:id/claim-rewards')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Claim bonus rewards',
    description:
      'Reclama las recompensas bonus de una misión completada (para todos los participantes)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la misión programada en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Recompensas bonus reclamadas exitosamente',
    type: ScheduledMissionResponseDto,
    schema: {
      example: {
        id: 'dd0e8400-e29b-41d4-a716-446655440000',
        bonus_rewards_claimed: true,
        bonus_rewards_claimed_at: '2025-01-27T17:00:00Z',
        bonus_xp_awarded: 500,
        bonus_ml_coins_awarded: 250,
        participants_rewarded: 22,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Recompensas ya reclamadas o misión no completada',
  })
  @ApiResponse({
    status: 404,
    description: 'Misión programada no encontrada',
  })
  async claimBonusRewards(@Param('id') id: string) {
    return await this.missionService.claimBonusRewards(id);
  }
}
