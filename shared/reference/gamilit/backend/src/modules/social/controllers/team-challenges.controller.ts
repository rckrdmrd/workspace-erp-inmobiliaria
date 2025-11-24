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
  ApiBody,
} from '@nestjs/swagger';
import { TeamChallengesService } from '../services';
import {
  CreateTeamChallengeDto,
  TeamChallengeResponseDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * TeamChallengesController
 *
 * @description Gestión de desafíos asignados a equipos.
 * Endpoints para asignar desafíos, actualizar estados, registrar
 * puntuaciones, completar/fallar desafíos, y leaderboards.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Team Challenges')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class TeamChallengesController {
  constructor(
    private readonly teamChallengesService: TeamChallengesService,
  ) {}

  /**
   * Obtiene todos los desafíos de un equipo
   *
   * @param teamId - ID del equipo (UUID)
   * @returns Lista de desafíos
   *
   * @example
   * GET /api/v1/social/team-challenges/teams/990e8400-e29b-41d4-a716-446655440040
   */
  @Get('team-challenges/teams/:teamId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team challenges',
    description: 'Obtiene todos los desafíos asignados a un equipo',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
    example: '990e8400-e29b-41d4-a716-446655440040',
  })
  @ApiResponse({
    status: 200,
    description: 'Desafíos obtenidos exitosamente',
    type: [TeamChallengeResponseDto],
    schema: {
      example: [
        {
          id: 'bb0e8400-e29b-41d4-a716-446655440060',
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          challenge_id: 'cc0e8400-e29b-41d4-a716-446655440070',
          status: 'in_progress',
          score: 850,
          started_at: '2025-01-17T10:00:00Z',
          created_at: '2025-01-17T09:00:00Z',
        },
      ],
    },
  })
  async findByTeamId(@Param('teamId') teamId: string) {
    return await this.teamChallengesService.findByTeamId(teamId);
  }

  /**
   * Obtiene todos los equipos participando en un desafío
   *
   * @param challengeId - ID del desafío (UUID)
   * @returns Lista de equipos
   *
   * @example
   * GET /api/v1/social/team-challenges/challenges/cc0e8400-e29b-41d4-a716-446655440070
   */
  @Get('team-challenges/challenges/:challengeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get challenge teams',
    description:
      'Obtiene todos los equipos que están participando en un desafío específico',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Equipos obtenidos exitosamente',
    type: [TeamChallengeResponseDto],
  })
  async findByChallengeId(@Param('challengeId') challengeId: string) {
    return await this.teamChallengesService.findByChallengeId(challengeId);
  }

  /**
   * Obtiene el registro de un equipo en un desafío específico
   *
   * @param teamId - ID del equipo (UUID)
   * @param challengeId - ID del desafío (UUID)
   * @returns Registro del desafío
   *
   * @example
   * GET /api/v1/social/team-challenges/teams/990e8400-e29b-41d4-a716-446655440040/challenges/cc0e8400-e29b-41d4-a716-446655440070
   */
  @Get('team-challenges/teams/:teamId/challenges/:challengeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team challenge',
    description:
      'Obtiene el registro específico de un equipo en un desafío',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Registro del desafío obtenido exitosamente',
    type: TeamChallengeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
  })
  async findByTeamAndChallenge(
    @Param('teamId') teamId: string,
    @Param('challengeId') challengeId: string,
  ) {
    return await this.teamChallengesService.findByTeamAndChallenge(
      teamId,
      challengeId,
    );
  }

  /**
   * Asigna un desafío a un equipo
   *
   * @param createDto - Datos del desafío
   * @returns Nuevo desafío creado
   *
   * @example
   * POST /api/v1/social/team-challenges
   * Request: {
   *   "team_id": "990e8400-e29b-41d4-a716-446655440040",
   *   "challenge_id": "cc0e8400-e29b-41d4-a716-446655440070",
   *   "max_score": 1000
   * }
   */
  @Post('team-challenges')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Assign challenge to team',
    description: 'Asigna un desafío a un equipo',
  })
  @ApiBody({
    type: CreateTeamChallengeDto,
    description: 'Datos para asignar el desafío',
    examples: {
      example1: {
        value: {
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          challenge_id: 'cc0e8400-e29b-41d4-a716-446655440070',
          max_score: 1000,
          time_limit_minutes: 60,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Desafío asignado exitosamente',
    type: TeamChallengeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El equipo ya tiene este desafío asignado',
    schema: {
      example: {
        statusCode: 409,
        message:
          'Team 990e8400-e29b-41d4-a716-446655440040 already has challenge cc0e8400-e29b-41d4-a716-446655440070 assigned',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createDto: CreateTeamChallengeDto) {
    return await this.teamChallengesService.create(createDto);
  }

  /**
   * Actualiza el estado de un desafío
   *
   * @param id - ID del registro de desafío (UUID)
   * @param body - Nuevo estado
   * @returns Desafío actualizado
   *
   * @example
   * PATCH /api/v1/social/team-challenges/bb0e8400-e29b-41d4-a716-446655440060/status
   * Request: { "status": "in_progress" }
   */
  @Patch('team-challenges/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update challenge status',
    description:
      'Actualiza el estado de un desafío (active, in_progress, completed, failed, cancelled)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Nuevo estado del desafío',
    examples: {
      example1: {
        value: { status: 'in_progress' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: TeamChallengeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return await this.teamChallengesService.updateStatus(id, body.status);
  }

  /**
   * Registra la puntuación de un equipo en un desafío
   *
   * @param id - ID del registro de desafío (UUID)
   * @param body - Puntuación
   * @returns Desafío actualizado
   *
   * @example
   * PATCH /api/v1/social/team-challenges/bb0e8400-e29b-41d4-a716-446655440060/score
   * Request: { "score": 850 }
   */
  @Patch('team-challenges/:id/score')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record challenge score',
    description:
      'Registra o actualiza la puntuación de un equipo en un desafío',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Puntuación obtenida',
    examples: {
      example1: {
        value: { score: 850 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Puntuación registrada exitosamente',
    type: TeamChallengeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  async recordScore(
    @Param('id') id: string,
    @Body() body: { score: number },
  ) {
    return await this.teamChallengesService.recordScore(id, body.score);
  }

  /**
   * Marca un desafío como completado
   *
   * @param id - ID del registro de desafío (UUID)
   * @param body - Puntuación final (opcional)
   * @returns Desafío actualizado
   *
   * @example
   * POST /api/v1/social/team-challenges/bb0e8400-e29b-41d4-a716-446655440060/complete
   * Request: { "score": 950 }
   */
  @Post('team-challenges/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete challenge',
    description:
      'Marca un desafío como completado, actualizando status a "completed" y registrando la fecha de completación',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Puntuación final (opcional)',
    examples: {
      example1: {
        value: { score: 950 },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío completado exitosamente',
    type: TeamChallengeResponseDto,
    schema: {
      example: {
        id: 'bb0e8400-e29b-41d4-a716-446655440060',
        team_id: '990e8400-e29b-41d4-a716-446655440040',
        challenge_id: 'cc0e8400-e29b-41d4-a716-446655440070',
        status: 'completed',
        score: 950,
        started_at: '2025-01-17T10:00:00Z',
        completed_at: '2025-01-17T11:30:00Z',
        updated_at: '2025-01-17T11:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  async complete(
    @Param('id') id: string,
    @Body() body: { score?: number },
  ) {
    return await this.teamChallengesService.complete(id, body.score ?? 0);
  }

  /**
   * Marca un desafío como fallido
   *
   * @param id - ID del registro de desafío (UUID)
   * @returns Desafío actualizado
   *
   * @example
   * POST /api/v1/social/team-challenges/bb0e8400-e29b-41d4-a716-446655440060/fail
   */
  @Post('team-challenges/:id/fail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fail challenge',
    description:
      'Marca un desafío como fallido, actualizando status a "failed"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío marcado como fallido exitosamente',
    type: TeamChallengeResponseDto,
    schema: {
      example: {
        id: 'bb0e8400-e29b-41d4-a716-446655440060',
        status: 'failed',
        completed_at: '2025-01-17T12:00:00Z',
        updated_at: '2025-01-17T12:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  async fail(@Param('id') id: string) {
    return await this.teamChallengesService.fail(id);
  }

  /**
   * Obtiene el leaderboard de un desafío
   *
   * @param challengeId - ID del desafío (UUID)
   * @returns Leaderboard ordenado por puntuación
   *
   * @example
   * GET /api/v1/social/team-challenges/challenges/cc0e8400-e29b-41d4-a716-446655440070/leaderboard
   */
  @Get('team-challenges/challenges/:challengeId/leaderboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get challenge leaderboard',
    description:
      'Obtiene el leaderboard de un desafío ordenado por puntuación (de mayor a menor)',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard obtenido exitosamente',
    type: [TeamChallengeResponseDto],
    schema: {
      example: [
        {
          id: 'bb0e8400-e29b-41d4-a716-446655440060',
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          challenge_id: 'cc0e8400-e29b-41d4-a716-446655440070',
          score: 950,
          status: 'completed',
          rank: 1,
        },
        {
          id: 'bb0e8400-e29b-41d4-a716-446655440061',
          team_id: '990e8400-e29b-41d4-a716-446655440041',
          challenge_id: 'cc0e8400-e29b-41d4-a716-446655440070',
          score: 880,
          status: 'completed',
          rank: 2,
        },
      ],
    },
  })
  async getLeaderboard(@Param('challengeId') challengeId: string) {
    return await this.teamChallengesService.getLeaderboard(challengeId);
  }
}
