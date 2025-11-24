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
import { PeerChallengesService } from '../services';
import { CreatePeerChallengeDto, UpdatePeerChallengeDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * PeerChallengesController
 *
 * @description Gestión de desafíos peer-to-peer entre estudiantes (Epic EXT-009).
 * Endpoints para CRUD de challenges, gestión de estados, participantes,
 * y estadísticas de desafíos.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Peer Challenges')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class PeerChallengesController {
  constructor(private readonly challengesService: PeerChallengesService) {}

  /**
   * Crea un nuevo desafío peer-to-peer
   *
   * @param dto - Datos del desafío
   * @returns Desafío creado
   */
  @Post('peer-challenges')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create peer challenge',
    description: 'Crea un nuevo desafío peer-to-peer',
  })
  @ApiBody({ type: CreatePeerChallengeDto })
  @ApiResponse({
    status: 201,
    description: 'Desafío creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async create(@Body() dto: CreatePeerChallengeDto) {
    const data: any = { ...dto };

    // Convert date strings to Date objects
    if (dto.start_time) {
      data.start_time = new Date(dto.start_time);
    }
    if (dto.end_time) {
      data.end_time = new Date(dto.end_time);
    }

    return await this.challengesService.create(dto.created_by, data);
  }

  /**
   * Obtiene todos los desafíos con filtros opcionales
   *
   * @param status - Estado del desafío (opcional)
   * @param challenge_type - Tipo de desafío (opcional)
   * @param created_by - ID del creador (opcional)
   * @returns Lista de desafíos
   */
  @Get('peer-challenges')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all peer challenges',
    description: 'Obtiene todos los desafíos con filtros opcionales',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Estado del desafío',
    enum: ['open', 'full', 'in_progress', 'completed', 'cancelled', 'expired'],
  })
  @ApiQuery({
    name: 'challenge_type',
    required: false,
    description: 'Tipo de desafío',
    enum: ['head_to_head', 'multiplayer', 'tournament', 'leaderboard'],
  })
  @ApiQuery({
    name: 'created_by',
    required: false,
    description: 'ID del usuario creador',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de desafíos obtenida exitosamente',
  })
  async findAll(
    @Query('status') status?: string,
    @Query('challenge_type') challenge_type?: string,
    @Query('created_by') created_by?: string,
  ) {
    return await this.challengesService.findAll({ status, challenge_type, created_by });
  }

  /**
   * Obtiene desafíos abiertos (disponibles para unirse)
   *
   * @returns Lista de desafíos abiertos
   */
  @Get('peer-challenges/open')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get open challenges',
    description: 'Obtiene desafíos abiertos disponibles para unirse',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de desafíos abiertos',
  })
  async findOpen() {
    return await this.challengesService.findOpen();
  }

  /**
   * Obtiene desafíos activos (en progreso)
   *
   * @returns Lista de desafíos activos
   */
  @Get('peer-challenges/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active challenges',
    description: 'Obtiene desafíos actualmente en progreso',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de desafíos activos',
  })
  async findActive() {
    return await this.challengesService.findActive();
  }

  /**
   * Obtiene un desafío por ID
   *
   * @param id - ID del desafío (UUID)
   * @returns Desafío encontrado
   */
  @Get('peer-challenges/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get challenge by ID',
    description: 'Obtiene un desafío específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  async findById(@Param('id') id: string) {
    return await this.challengesService.findById(id);
  }

  /**
   * Obtiene desafíos creados por un usuario
   *
   * @param userId - ID del usuario creador
   * @returns Lista de desafíos
   */
  @Get('peer-challenges/creator/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get challenges by creator',
    description: 'Obtiene desafíos creados por un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario creador',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de desafíos del creador',
  })
  async findByCreator(@Param('userId') userId: string) {
    return await this.challengesService.findByCreator(userId);
  }

  /**
   * Actualiza un desafío (solo creador, solo si está en 'open')
   *
   * @param id - ID del desafío
   * @param userId - ID del usuario (debe ser el creador)
   * @param dto - Datos a actualizar
   * @returns Desafío actualizado
   */
  @Patch('peer-challenges/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update challenge',
    description: 'Actualiza un desafío (solo creador, solo si está abierto)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID del usuario (debe ser el creador)',
    type: String,
  })
  @ApiBody({ type: UpdatePeerChallengeDto })
  @ApiResponse({
    status: 200,
    description: 'Desafío actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede actualizar (estado inválido)',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado (no es el creador)',
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() dto: UpdatePeerChallengeDto,
  ) {
    const data: any = { ...dto };

    // Convert date strings to Date objects
    if (dto.start_time) {
      data.start_time = new Date(dto.start_time);
    }
    if (dto.end_time) {
      data.end_time = new Date(dto.end_time);
    }

    return await this.challengesService.update(id, userId, data);
  }

  /**
   * Inicia un desafío (cambia a 'in_progress')
   *
   * @param id - ID del desafío
   * @returns Desafío actualizado
   */
  @Patch('peer-challenges/:id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Start challenge',
    description: 'Inicia un desafío (cambia estado a in_progress)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío iniciado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Transición de estado inválida',
  })
  async start(@Param('id') id: string) {
    return await this.challengesService.start(id);
  }

  /**
   * Completa un desafío (cambia a 'completed')
   *
   * @param id - ID del desafío
   * @returns Desafío actualizado
   */
  @Patch('peer-challenges/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete challenge',
    description: 'Marca un desafío como completado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío completado exitosamente',
  })
  async complete(@Param('id') id: string) {
    return await this.challengesService.complete(id);
  }

  /**
   * Cancela un desafío (solo creador)
   *
   * @param id - ID del desafío
   * @param userId - ID del usuario (debe ser el creador)
   * @returns Desafío cancelado
   */
  @Patch('peer-challenges/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel challenge',
    description: 'Cancela un desafío (solo creador)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID del usuario (debe ser el creador)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío cancelado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado (no es el creador)',
  })
  async cancel(@Param('id') id: string, @Query('userId') userId: string) {
    return await this.challengesService.cancel(id, userId);
  }

  /**
   * Marca desafíos expirados
   *
   * @returns Número de desafíos marcados como expirados
   */
  @Patch('peer-challenges/mark-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark expired challenges',
    description: 'Marca desafíos expirados (batch operation)',
  })
  @ApiResponse({
    status: 200,
    description: 'Desafíos expirados marcados',
    schema: {
      example: { count: 5 },
    },
  })
  async markExpired() {
    const count = await this.challengesService.markExpired();
    return { count };
  }

  /**
   * Elimina un desafío (solo creador)
   *
   * @param id - ID del desafío
   * @param userId - ID del usuario (debe ser el creador)
   */
  @Delete('peer-challenges/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete challenge',
    description: 'Elimina un desafío (solo creador, no puede estar en progreso)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID del usuario (debe ser el creador)',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Desafío eliminado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar (está en progreso)',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado (no es el creador)',
  })
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    await this.challengesService.delete(id, userId);
  }

  /**
   * Obtiene estadísticas por tipo de desafío
   *
   * @returns Conteo por tipo
   */
  @Get('peer-challenges/stats/by-type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get stats by type',
    description: 'Obtiene estadísticas agregadas por tipo de desafío',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas por tipo',
    schema: {
      example: {
        head_to_head: 15,
        multiplayer: 8,
        tournament: 3,
        leaderboard: 12,
      },
    },
  })
  async getStatsByType() {
    return await this.challengesService.getStatsByType();
  }

  /**
   * Obtiene estadísticas por estado
   *
   * @returns Conteo por estado
   */
  @Get('peer-challenges/stats/by-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get stats by status',
    description: 'Obtiene estadísticas agregadas por estado de desafío',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas por estado',
    schema: {
      example: {
        open: 5,
        full: 2,
        in_progress: 8,
        completed: 20,
        cancelled: 3,
        expired: 2,
      },
    },
  })
  async getStatsByStatus() {
    return await this.challengesService.getStatsByStatus();
  }
}
