import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
  ApiBody,
} from '@nestjs/swagger';
import { TeamsService, TeamMembersService } from '../services';
import { CreateTeamDto, TeamResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * TeamsController
 *
 * @description Gestión de equipos colaborativos dentro de aulas.
 * Endpoints para CRUD de equipos, gestión de miembros, puntuaciones,
 * XP, y leaderboards de equipos.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Teams')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  /**
   * Obtiene todos los equipos, opcionalmente filtrados por aula
   *
   * @param classroomId - ID del aula (opcional)
   * @returns Lista de equipos
   *
   * @example
   * GET /api/v1/social/teams?classroomId=770e8400-e29b-41d4-a716-446655440020
   */
  @Get('teams')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all teams',
    description: 'Obtiene todos los equipos, con filtro opcional por aula',
  })
  @ApiQuery({
    name: 'classroomId',
    description: 'ID del aula para filtrar equipos (opcional)',
    type: String,
    required: false,
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipos obtenida exitosamente',
    type: [TeamResponseDto],
    schema: {
      example: [
        {
          id: '990e8400-e29b-41d4-a716-446655440040',
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          name: 'Los Águilas',
          code: 'AGU2025',
          description: 'Equipo de lectura avanzada',
          avatar_url: 'https://example.com/avatars/team1.png',
          total_score: 1250,
          total_xp: 3500,
          is_active: true,
          created_at: '2025-01-15T10:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(@Query('classroomId') classroomId?: string) {
    return await this.teamsService.findAll(classroomId);
  }

  /**
   * Obtiene un equipo por ID
   *
   * @param id - ID del equipo (UUID)
   * @returns Equipo encontrado
   *
   * @example
   * GET /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040
   */
  @Get('teams/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team by ID',
    description: 'Obtiene un equipo específico por su identificador único',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
    example: '990e8400-e29b-41d4-a716-446655440040',
  })
  @ApiResponse({
    status: 200,
    description: 'Equipo obtenido exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo no encontrado',
  })
  async findById(@Param('id') id: string) {
    return await this.teamsService.findById(id);
  }

  /**
   * Obtiene un equipo por su código único
   *
   * @param code - Código del equipo
   * @returns Equipo encontrado
   *
   * @example
   * GET /api/v1/social/teams/code/AGU2025
   */
  @Get('teams/code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team by code',
    description:
      'Obtiene un equipo por su código único (útil para unirse rápidamente)',
  })
  @ApiParam({
    name: 'code',
    description: 'Código único del equipo',
    type: String,
    required: true,
    example: 'AGU2025',
  })
  @ApiResponse({
    status: 200,
    description: 'Equipo obtenido exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo con el código especificado no encontrado',
  })
  async findByCode(@Param('code') code: string) {
    return await this.teamsService.findByCode(code);
  }

  /**
   * Crea un nuevo equipo
   *
   * @param createDto - Datos para crear el equipo
   * @returns Nuevo equipo creado
   *
   * @example
   * POST /api/v1/social/teams
   * Request: {
   *   "classroom_id": "770e8400-e29b-41d4-a716-446655440020",
   *   "name": "Los Águilas",
   *   "code": "AGU2025",
   *   "max_members": 5
   * }
   */
  @Post('teams')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create team',
    description: 'Crea un nuevo equipo colaborativo dentro de un aula',
  })
  @ApiBody({
    type: CreateTeamDto,
    description: 'Datos para crear el equipo',
    examples: {
      example1: {
        value: {
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          name: 'Los Águilas',
          code: 'AGU2025',
          description: 'Equipo de lectura avanzada',
          max_members: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Equipo creado exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El código de equipo ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'Team with code AGU2025 already exists',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createDto: CreateTeamDto) {
    return await this.teamsService.create(createDto);
  }

  /**
   * Actualiza un equipo
   *
   * @param id - ID del equipo (UUID)
   * @param updateDto - Campos a actualizar
   * @returns Equipo actualizado
   *
   * @example
   * PATCH /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040
   * Request: {
   *   "description": "Equipo de lectura expertos",
   *   "max_members": 6
   * }
   */
  @Patch('teams/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update team',
    description:
      'Actualiza campos específicos de un equipo. Requiere ser propietario o administrador del equipo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Equipo actualizado exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El nuevo código ya existe en otro equipo',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateTeamDto>,
  ) {
    return await this.teamsService.update(id, updateDto);
  }

  /**
   * Elimina un equipo
   *
   * @param id - ID del equipo (UUID)
   * @returns Confirmación de eliminación
   *
   * @example
   * DELETE /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040
   */
  @Delete('teams/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete team',
    description:
      'Elimina un equipo permanentemente. Requiere ser propietario del equipo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Equipo eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo no encontrado',
  })
  async delete(@Param('id') id: string) {
    await this.teamsService.delete(id);
  }

  /**
   * Agrega un miembro a un equipo
   *
   * @param teamId - ID del equipo (UUID)
   * @param userId - ID del usuario (UUID)
   * @returns Equipo actualizado
   *
   * @example
   * POST /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040/members/550e8400-e29b-41d4-a716-446655440010
   */
  @Post('teams/:teamId/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add team member',
    description: 'Agrega un usuario a un equipo como miembro',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembro agregado exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'El equipo está lleno o el usuario ya es miembro',
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo o usuario no encontrado',
  })
  async addMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return await this.teamsService.addMember(teamId, userId);
  }

  /**
   * Remueve un miembro de un equipo
   *
   * @param teamId - ID del equipo (UUID)
   * @param userId - ID del usuario (UUID)
   * @returns Equipo actualizado
   *
   * @example
   * DELETE /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040/members/550e8400-e29b-41d4-a716-446655440010
   */
  @Delete('teams/:teamId/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove team member',
    description: 'Remueve un usuario de un equipo',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembro removido exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo o membresía no encontrada',
  })
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return await this.teamsService.removeMember(teamId, userId);
  }

  /**
   * Actualiza la puntuación de un equipo
   *
   * @param id - ID del equipo (UUID)
   * @param body - Nueva puntuación
   * @returns Equipo actualizado
   *
   * @example
   * PATCH /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040/score
   * Request: { "score": 1500 }
   */
  @Patch('teams/:id/score')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update team score',
    description: 'Actualiza la puntuación total de un equipo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Nueva puntuación del equipo',
    examples: {
      example1: {
        value: { score: 1500 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Puntuación actualizada exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo no encontrado',
  })
  async updateScore(
    @Param('id') id: string,
    @Body() body: { score: number },
  ) {
    return await this.teamsService.updateScore(id, body.score);
  }

  /**
   * Agrega XP a un equipo
   *
   * @param id - ID del equipo (UUID)
   * @param body - XP a agregar
   * @returns Equipo actualizado
   *
   * @example
   * POST /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040/xp
   * Request: { "xp": 250 }
   */
  @Post('teams/:id/xp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add team XP',
    description: 'Agrega puntos de experiencia (XP) a un equipo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'XP a agregar al equipo',
    examples: {
      example1: {
        value: { xp: 250 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'XP agregado exitosamente',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo no encontrado',
  })
  async addXP(@Param('id') id: string, @Body() body: { xp: number }) {
    return await this.teamsService.addXP(id, body.xp);
  }

  /**
   * Obtiene el leaderboard de equipos de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @returns Leaderboard de equipos ordenado por puntuación
   *
   * @example
   * GET /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020/teams/leaderboard
   */
  @Get('classrooms/:classroomId/teams/leaderboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get teams leaderboard',
    description:
      'Obtiene el leaderboard de equipos de un aula ordenado por puntuación total (de mayor a menor)',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard obtenido exitosamente',
    type: [TeamResponseDto],
    schema: {
      example: [
        {
          id: '990e8400-e29b-41d4-a716-446655440040',
          name: 'Los Águilas',
          total_score: 2500,
          total_xp: 5000,
          rank: 1,
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440041',
          name: 'Los Jaguares',
          total_score: 2200,
          total_xp: 4500,
          rank: 2,
        },
      ],
    },
  })
  async getLeaderboard(@Param('classroomId') classroomId: string) {
    return await this.teamsService.getLeaderboard(classroomId);
  }

  /**
   * Obtiene estadísticas de un equipo
   *
   * @param id - ID del equipo (UUID)
   * @returns Estadísticas del equipo
   *
   * @example
   * GET /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040/stats
   */
  @Get('teams/:id/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team statistics',
    description:
      'Obtiene estadísticas detalladas de un equipo: miembros, puntuación, desafíos completados',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      example: {
        member_count: 5,
        max_members: 5,
        total_score: 2500,
        total_xp: 5000,
        challenges_completed: 12,
        average_member_grade: 88.5,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo no encontrado',
  })
  async getTeamStats(@Param('id') id: string) {
    return await this.teamsService.getTeamStats(id);
  }

  /**
   * Obtiene los miembros de un equipo (shortcut a TeamMembersController)
   *
   * @param teamId - ID del equipo (UUID)
   * @returns Lista de miembros del equipo
   *
   * @example
   * GET /api/v1/social/teams/990e8400-e29b-41d4-a716-446655440040/members
   */
  @Get('teams/:teamId/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team members',
    description:
      'Obtiene todos los miembros de un equipo. Este es un endpoint de conveniencia que delega a TeamMembersService.',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembros del equipo obtenidos exitosamente',
    schema: {
      example: [
        {
          id: 'aa0e8400-e29b-41d4-a716-446655440050',
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          user_id: '550e8400-e29b-41d4-a716-446655440010',
          role: 'owner',
          joined_at: '2025-01-15T10:00:00Z',
        },
      ],
    },
  })
  async getMembers(@Param('teamId') teamId: string) {
    return await this.teamMembersService.findByTeamId(teamId);
  }
}
