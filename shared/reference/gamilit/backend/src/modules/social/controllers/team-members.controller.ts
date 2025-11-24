import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { TeamMembersService } from '../services';
import { CreateTeamMemberDto, TeamMemberResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * TeamMembersController
 *
 * @description Gestión de membresía de usuarios en equipos.
 * Endpoints para unirse a equipos, actualizar roles, transferir propiedad,
 * y obtener miembros activos.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Team Members')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  /**
   * Obtiene todos los miembros de un equipo
   *
   * @param teamId - ID del equipo (UUID)
   * @returns Lista de miembros
   *
   * @example
   * GET /api/v1/social/team-members/teams/990e8400-e29b-41d4-a716-446655440040
   */
  @Get('team-members/teams/:teamId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team members',
    description: 'Obtiene todos los miembros de un equipo específico',
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
    description: 'Miembros obtenidos exitosamente',
    type: [TeamMemberResponseDto],
    schema: {
      example: [
        {
          id: 'aa0e8400-e29b-41d4-a716-446655440050',
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          user_id: '550e8400-e29b-41d4-a716-446655440010',
          role: 'owner',
          joined_at: '2025-01-15T10:00:00Z',
          is_active: true,
        },
      ],
    },
  })
  async findByTeamId(@Param('teamId') teamId: string) {
    return await this.teamMembersService.findByTeamId(teamId);
  }

  /**
   * Obtiene todos los equipos en los que participa un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de membresías
   *
   * @example
   * GET /api/v1/social/team-members/users/550e8400-e29b-41d4-a716-446655440010
   */
  @Get('team-members/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user teams',
    description: 'Obtiene todos los equipos en los que participa un usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Membresías obtenidas exitosamente',
    type: [TeamMemberResponseDto],
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.teamMembersService.findByUserId(userId);
  }

  /**
   * Obtiene la membresía de un usuario en un equipo específico
   *
   * @param teamId - ID del equipo (UUID)
   * @param userId - ID del usuario (UUID)
   * @returns Membresía encontrada
   *
   * @example
   * GET /api/v1/social/team-members/teams/990e8400-e29b-41d4-a716-446655440040/users/550e8400-e29b-41d4-a716-446655440010
   */
  @Get('team-members/teams/:teamId/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team member',
    description:
      'Obtiene la membresía específica de un usuario en un equipo',
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
    description: 'Membresía obtenida exitosamente',
    type: TeamMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async findByTeamAndUser(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return await this.teamMembersService.findByTeamAndUser(teamId, userId);
  }

  /**
   * Agrega un usuario a un equipo (join team)
   *
   * @param createDto - Datos de membresía
   * @returns Nueva membresía creada
   *
   * @example
   * POST /api/v1/social/team-members
   * Request: {
   *   "team_id": "990e8400-e29b-41d4-a716-446655440040",
   *   "user_id": "550e8400-e29b-41d4-a716-446655440010",
   *   "role": "member"
   * }
   */
  @Post('team-members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Join team',
    description: 'Agrega un usuario a un equipo como miembro',
  })
  @ApiBody({
    type: CreateTeamMemberDto,
    description: 'Datos para unirse al equipo',
    examples: {
      example1: {
        value: {
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          user_id: '550e8400-e29b-41d4-a716-446655440010',
          role: 'member',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario agregado al equipo exitosamente',
    type: TeamMemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o equipo lleno',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya es miembro del equipo',
    schema: {
      example: {
        statusCode: 409,
        message:
          'User 550e8400-e29b-41d4-a716-446655440010 is already a member of team 990e8400-e29b-41d4-a716-446655440040',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createDto: CreateTeamMemberDto) {
    return await this.teamMembersService.create(createDto);
  }

  /**
   * Actualiza el rol de un miembro en el equipo
   *
   * @param id - ID de la membresía (UUID)
   * @param body - Nuevo rol
   * @returns Membresía actualizada
   *
   * @example
   * PATCH /api/v1/social/team-members/aa0e8400-e29b-41d4-a716-446655440050/role
   * Request: { "role": "admin" }
   */
  @Patch('team-members/:id/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update member role',
    description:
      'Actualiza el rol de un miembro en el equipo (owner, admin, member)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la membresía en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Nuevo rol del miembro',
    examples: {
      example1: {
        value: { role: 'admin' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: TeamMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() body: { role: string },
  ) {
    return await this.teamMembersService.updateRole(id, body.role);
  }

  /**
   * Remueve un miembro de un equipo (leave team)
   *
   * @param id - ID de la membresía (UUID)
   * @returns Confirmación de eliminación
   *
   * @example
   * DELETE /api/v1/social/team-members/aa0e8400-e29b-41d4-a716-446655440050
   */
  @Delete('team-members/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Leave team',
    description: 'Remueve un miembro de un equipo (salir del equipo)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la membresía en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Miembro removido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async remove(@Param('id') id: string) {
    await this.teamMembersService.remove(id);
  }

  /**
   * Obtiene los miembros activos de un equipo
   *
   * @param teamId - ID del equipo (UUID)
   * @returns Lista de miembros activos
   *
   * @example
   * GET /api/v1/social/team-members/teams/990e8400-e29b-41d4-a716-446655440040/active
   */
  @Get('team-members/teams/:teamId/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active team members',
    description: 'Obtiene solo los miembros activos de un equipo',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembros activos obtenidos exitosamente',
    type: [TeamMemberResponseDto],
  })
  async getActiveMembers(@Param('teamId') teamId: string) {
    return await this.teamMembersService.getActiveMembers(teamId);
  }

  /**
   * Transfiere la propiedad del equipo a otro miembro
   *
   * @param teamId - ID del equipo (UUID)
   * @param body - ID del nuevo propietario
   * @returns Confirmación de transferencia
   *
   * @example
   * POST /api/v1/social/team-members/teams/990e8400-e29b-41d4-a716-446655440040/transfer-ownership
   * Request: { "newOwnerId": "550e8400-e29b-41d4-a716-446655440011" }
   */
  @Post('team-members/teams/:teamId/transfer-ownership')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Transfer team ownership',
    description:
      'Transfiere la propiedad del equipo a otro miembro. El propietario actual se convierte en admin.',
  })
  @ApiParam({
    name: 'teamId',
    description: 'ID del equipo en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'ID del nuevo propietario',
    examples: {
      example1: {
        value: { newOwnerId: '550e8400-e29b-41d4-a716-446655440011' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Propiedad transferida exitosamente',
    schema: {
      example: {
        message: 'Ownership transferred successfully',
        newOwner: {
          id: 'aa0e8400-e29b-41d4-a716-446655440051',
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          user_id: '550e8400-e29b-41d4-a716-446655440011',
          role: 'owner',
        },
        previousOwner: {
          id: 'aa0e8400-e29b-41d4-a716-446655440050',
          team_id: '990e8400-e29b-41d4-a716-446655440040',
          user_id: '550e8400-e29b-41d4-a716-446655440010',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El nuevo propietario no es miembro del equipo',
  })
  @ApiResponse({
    status: 404,
    description: 'Equipo o usuario no encontrado',
  })
  async transferOwnership(
    @Param('teamId') teamId: string,
    @Body() body: { newOwnerId: string },
  ) {
    return await this.teamMembersService.transferOwnership(
      teamId,
      body.newOwnerId,
    );
  }
}
