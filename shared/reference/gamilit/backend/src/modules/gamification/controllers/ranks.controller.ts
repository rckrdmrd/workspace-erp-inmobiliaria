import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RanksService, RankProgressDto } from '../services/ranks.service';
import {
  CreateUserRankDto,
  UpdateUserRankDto,
  UserRankResponseDto,
} from '../dto/user-ranks';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { UserRank } from '../entities';

/**
 * RankMetadataDto
 * Metadata de un rango maya para endpoints públicos
 */
export interface RankMetadataDto {
  rank: string;
  name: string;
  description: string;
  xp_min: number;
  xp_max: number;
  ml_coins_bonus: number;
  order: number;
}

/**
 * RanksController
 *
 * @description Gestión del sistema de rangos maya.
 * Endpoints para consultar rangos, progreso, y administración.
 *
 * @route /api/v1/gamification/ranks
 */
@ApiTags('Gamification - Ranks')
@Controller('gamification/ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  // =========================================================================
  // ENDPOINTS PÚBLICOS
  // =========================================================================

  /**
   * 1. GET /api/gamification/ranks
   * Lista todos los rangos disponibles con metadata
   *
   * @returns Array con información de todos los rangos maya
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todos los rangos',
    description: 'Obtiene la lista de todos los rangos maya disponibles con su metadata',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de rangos obtenida exitosamente',
    type: [Object],
  })
  async listRanks(): Promise<RankMetadataDto[]> {
    const ranksConfig = this.ranksService.getAllRanksConfig();

    return ranksConfig.map((config) => ({
      rank: config.name,
      name: config.name,
      description: config.description,
      xp_min: config.xp_min,
      xp_max: config.xp_max === Infinity ? -1 : config.xp_max,
      ml_coins_bonus: config.ml_coins_bonus,
      order: config.order,
    }));
  }

  /**
   * 2. GET /api/gamification/ranks/current
   * Obtiene el rango actual del usuario autenticado
   *
   * @param req - Request con usuario autenticado
   * @returns Rango actual del usuario
   */
  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener rango actual del usuario',
    description: 'Obtiene el rango maya actual del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Rango actual obtenido exitosamente',
    type: UserRank,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Usuario sin rango inicializado' })
  async getCurrentRank(@Request() req: any): Promise<UserRank> {
    const userId = req.user.sub;
    return await this.ranksService.getCurrentRank(userId);
  }

  /**
   * 3. GET /api/gamification/ranks/:id
   * Obtiene detalles de un registro de rango específico
   *
   * @param id - ID del registro de rango (UUID)
   * @returns Detalles del registro de rango
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalles de un registro de rango',
    description: 'Obtiene información detallada de un registro de rango por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de rango (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del rango obtenidos exitosamente',
    type: UserRank,
  })
  @ApiResponse({ status: 404, description: 'Registro de rango no encontrado' })
  async getRankDetails(@Param('id') id: string): Promise<UserRank> {
    return await this.ranksService.findById(id);
  }

  /**
   * 4. GET /api/gamification/users/:userId/rank-progress
   * Obtiene el progreso hacia el siguiente rango
   *
   * @param userId - ID del usuario
   * @returns Información de progreso detallada
   */
  @Get('users/:userId/rank-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener progreso hacia siguiente rango',
    description:
      'Calcula y retorna el progreso del usuario hacia el siguiente rango maya',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso calculado exitosamente',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserRankProgress(
    @Param('userId') userId: string,
  ): Promise<RankProgressDto> {
    return await this.ranksService.calculateRankProgress(userId);
  }

  /**
   * 5. GET /api/gamification/users/:userId/rank-history
   * Obtiene el historial de rangos del usuario
   *
   * @param userId - ID del usuario
   * @returns Array con historial de rangos
   */
  @Get('users/:userId/rank-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener historial de rangos',
    description: 'Obtiene el historial completo de rangos alcanzados por el usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial obtenido exitosamente',
    type: [UserRank],
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getUserRankHistory(@Param('userId') userId: string): Promise<UserRank[]> {
    return await this.ranksService.getUserRankHistory(userId);
  }

  /**
   * 6. GET /api/gamification/ranks/check-promotion/:userId
   * Verifica si el usuario es elegible para promoción
   *
   * @param userId - ID del usuario
   * @returns Boolean indicando si puede promocionar
   */
  @Get('check-promotion/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verificar elegibilidad para promoción',
    description: 'Verifica si el usuario cumple los requisitos para promocionar al siguiente rango',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Elegibilidad verificada',
    schema: {
      properties: {
        eligible: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async checkPromotionEligibility(
    @Param('userId') userId: string,
  ): Promise<{ eligible: boolean }> {
    const eligible = await this.ranksService.checkPromotionEligibility(userId);
    return { eligible };
  }

  /**
   * 7. POST /api/gamification/ranks/promote/:userId
   * Promociona al usuario al siguiente rango
   *
   * @param userId - ID del usuario
   * @returns Nuevo rango del usuario
   */
  @Post('promote/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Promocionar usuario al siguiente rango',
    description: 'Promociona al usuario al siguiente rango maya si cumple los requisitos',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario promocionado exitosamente',
    type: UserRank,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Usuario no elegible para promoción' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async promoteUser(@Param('userId') userId: string): Promise<UserRank> {
    return await this.ranksService.promoteToNextRank(userId);
  }

  // =========================================================================
  // ENDPOINTS ADMIN
  // =========================================================================

  /**
   * 6. POST /api/gamification/admin/ranks
   * Crea un nuevo registro de rango manualmente (admin)
   *
   * @param createDto - DTO con datos del nuevo rango
   * @returns Registro de rango creado
   */
  @Post('admin/ranks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear registro de rango (Admin)',
    description: 'Crea un nuevo registro de rango manualmente. Solo para administradores.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registro de rango creado exitosamente',
    type: UserRank,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  async createRank(@Body() createDto: CreateUserRankDto): Promise<UserRank> {
    return await this.ranksService.createRank(createDto);
  }

  /**
   * 7. PUT /api/gamification/admin/ranks/:id
   * Actualiza un registro de rango manualmente (admin)
   *
   * @param id - ID del registro de rango
   * @param updateDto - DTO con datos a actualizar
   * @returns Registro de rango actualizado
   */
  @Put('admin/ranks/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar registro de rango (Admin)',
    description: 'Actualiza un registro de rango existente. Solo para administradores.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de rango (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro de rango actualizado exitosamente',
    type: UserRank,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Registro de rango no encontrado' })
  async updateRank(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserRankDto,
  ): Promise<UserRank> {
    return await this.ranksService.updateRank(id, updateDto);
  }

  /**
   * 8. DELETE /api/gamification/admin/ranks/:id
   * Elimina un registro de rango (admin)
   *
   * @param id - ID del registro de rango
   * @returns void
   */
  @Delete('admin/ranks/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar registro de rango (Admin)',
    description:
      'Elimina un registro de rango. No se puede eliminar el rango actual. Solo para administradores.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de rango (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Registro de rango eliminado exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Registro de rango no encontrado' })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar el rango actual',
  })
  async deleteRank(@Param('id') id: string): Promise<void> {
    await this.ranksService.deleteRank(id);
  }
}
