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
import { ChallengeParticipantsService } from '../services';
import {
  AddChallengeParticipantDto,
  UpdateParticipantScoreDto,
  DistributeRewardsDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ChallengeParticipantsController
 *
 * @description Gestión de participantes en peer challenges (Epic EXT-009).
 * Endpoints para CRUD de participantes, gestión de scores, rankings,
 * distribución de recompensas y estadísticas.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Challenge Participants')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class ChallengeParticipantsController {
  constructor(private readonly participantsService: ChallengeParticipantsService) {}

  /**
   * Agrega un participante a un desafío
   *
   * @param dto - Datos del participante (challenge_id, user_id, invited_by)
   * @returns Participante creado
   */
  @Post('challenge-participants')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add participant to challenge',
    description: 'Agrega un participante a un desafío',
  })
  @ApiBody({ type: AddChallengeParticipantDto })
  @ApiResponse({
    status: 201,
    description: 'Participante agregado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Desafío lleno o en estado inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Desafío no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuario ya es participante',
  })
  async addParticipant(@Body() dto: AddChallengeParticipantDto) {
    return await this.participantsService.addParticipant(
      dto.challenge_id,
      dto.user_id,
      dto.invited_by,
    );
  }

  /**
   * Obtiene todos los participantes de un desafío
   *
   * @param challengeId - ID del desafío
   * @returns Lista de participantes ordenados por rank
   */
  @Get('challenge-participants/challenge/:challengeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get participants by challenge',
    description: 'Obtiene todos los participantes de un desafío',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de participantes',
  })
  async findByChallengeId(@Param('challengeId') challengeId: string) {
    return await this.participantsService.findByChallengeId(challengeId);
  }

  /**
   * Obtiene participación específica de un usuario en un desafío
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @returns Participante encontrado
   */
  @Get('challenge-participants/challenge/:challengeId/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get participant by challenge and user',
    description: 'Obtiene la participación de un usuario en un desafío específico',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Participante encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Participante no encontrado',
  })
  async findByUserAndChallenge(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
  ) {
    return await this.participantsService.findByUserAndChallenge(challengeId, userId);
  }

  /**
   * Obtiene todos los desafíos en los que participa un usuario
   *
   * @param userId - ID del usuario
   * @param status - Filtro opcional por estado de participación
   * @returns Lista de participaciones
   */
  @Get('challenge-participants/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get participations by user',
    description: 'Obtiene todos los desafíos en los que participa un usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Estado de participación',
    enum: ['invited', 'accepted', 'in_progress', 'completed', 'forfeit', 'disqualified'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de participaciones del usuario',
  })
  async findByUserId(@Param('userId') userId: string, @Query('status') status?: string) {
    return await this.participantsService.findByUserId(userId, status);
  }

  /**
   * Acepta una invitación a un desafío
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @returns Participante actualizado
   */
  @Patch('challenge-participants/challenge/:challengeId/user/:userId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept challenge invitation',
    description: 'Acepta una invitación a un desafío',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Invitación aceptada',
  })
  @ApiResponse({
    status: 400,
    description: 'Estado inválido (no es invited)',
  })
  @ApiResponse({
    status: 404,
    description: 'Participante no encontrado',
  })
  async acceptInvitation(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
  ) {
    return await this.participantsService.acceptInvitation(challengeId, userId);
  }

  /**
   * Actualiza el estado de participación
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @param status - Nuevo estado
   * @returns Participante actualizado
   */
  @Patch('challenge-participants/challenge/:challengeId/user/:userId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update participation status',
    description: 'Actualiza el estado de participación de un usuario',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'Nuevo estado',
    enum: ['invited', 'accepted', 'in_progress', 'completed', 'forfeit', 'disqualified'],
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
  })
  async updateStatus(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
    @Query('status') status: 'invited' | 'accepted' | 'in_progress' | 'completed' | 'forfeit' | 'disqualified',
  ) {
    return await this.participantsService.updateStatus(challengeId, userId, status);
  }

  /**
   * Actualiza el score de un participante
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @param dto - Nuevo score
   * @returns Participante actualizado
   */
  @Patch('challenge-participants/challenge/:challengeId/user/:userId/score')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update participant score',
    description: 'Actualiza el score de un participante',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiBody({ type: UpdateParticipantScoreDto })
  @ApiResponse({
    status: 200,
    description: 'Score actualizado',
  })
  async updateScore(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateParticipantScoreDto,
  ) {
    return await this.participantsService.updateScore(challengeId, userId, dto.score);
  }

  /**
   * Calcula y asigna rankings a todos los participantes
   *
   * @param challengeId - ID del desafío
   * @returns Lista de participantes con rankings actualizados
   */
  @Patch('challenge-participants/challenge/:challengeId/rankings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate rankings',
    description: 'Calcula y asigna rankings a todos los participantes según sus scores',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Rankings calculados',
  })
  async calculateRankings(@Param('challengeId') challengeId: string) {
    return await this.participantsService.calculateRankings(challengeId);
  }

  /**
   * Determina y marca el ganador de un desafío
   *
   * @param challengeId - ID del desafío
   * @returns Participante ganador
   */
  @Patch('challenge-participants/challenge/:challengeId/winner')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Determine winner',
    description: 'Determina y marca el ganador del desafío (mayor score)',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Ganador determinado',
  })
  @ApiResponse({
    status: 400,
    description: 'Sin participantes o sin scores',
  })
  async determineWinner(@Param('challengeId') challengeId: string) {
    return await this.participantsService.determineWinner(challengeId);
  }

  /**
   * Distribuye recompensas a un participante específico
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @param xp - XP a otorgar
   * @param mlCoins - ML Coins a otorgar
   * @returns Participante actualizado
   */
  @Post('challenge-participants/challenge/:challengeId/user/:userId/rewards')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Distribute rewards to participant',
    description: 'Distribuye recompensas (XP y ML Coins) a un participante',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiQuery({
    name: 'xp',
    required: true,
    description: 'XP a otorgar',
    type: Number,
  })
  @ApiQuery({
    name: 'mlCoins',
    required: true,
    description: 'ML Coins a otorgar',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Recompensas distribuidas',
  })
  async distributeRewards(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
    @Query('xp') xp: number,
    @Query('mlCoins') mlCoins: number,
  ) {
    return await this.participantsService.distributeRewards(challengeId, userId, xp, mlCoins);
  }

  /**
   * Distribuye recompensas a todos los participantes
   *
   * @param challengeId - ID del desafío
   * @param dto - Recompensas base y multiplicador
   * @returns Lista de participantes con recompensas
   */
  @Post('challenge-participants/challenge/:challengeId/rewards')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Distribute rewards to all',
    description: 'Distribuye recompensas a todos los participantes según su ranking',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiBody({ type: DistributeRewardsDto })
  @ApiResponse({
    status: 200,
    description: 'Recompensas distribuidas a todos',
  })
  async distributeRewardsToAll(
    @Param('challengeId') challengeId: string,
    @Body() dto: DistributeRewardsDto,
  ) {
    return await this.participantsService.distributeRewardsToAll(
      challengeId,
      dto.base_xp,
      dto.base_coins,
      dto.winner_multiplier,
    );
  }

  /**
   * Abandona un desafío (forfeit)
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @returns Participante actualizado
   */
  @Patch('challenge-participants/challenge/:challengeId/user/:userId/forfeit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Forfeit challenge',
    description: 'Abandona un desafío (cambia estado a forfeit)',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Desafío abandonado',
  })
  async forfeit(@Param('challengeId') challengeId: string, @Param('userId') userId: string) {
    return await this.participantsService.forfeit(challengeId, userId);
  }

  /**
   * Descalifica a un participante
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario a descalificar
   * @param reason - Razón de descalificación
   * @returns Participante actualizado
   */
  @Patch('challenge-participants/challenge/:challengeId/user/:userId/disqualify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Disqualify participant',
    description: 'Descalifica a un participante del desafío',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiQuery({
    name: 'reason',
    required: false,
    description: 'Razón de descalificación',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Participante descalificado',
  })
  async disqualify(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
    @Query('reason') reason?: string,
  ) {
    return await this.participantsService.disqualify(challengeId, userId, reason);
  }

  /**
   * Elimina un participante de un desafío
   *
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   */
  @Delete('challenge-participants/challenge/:challengeId/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove participant',
    description: 'Elimina un participante de un desafío (solo si no está en progreso)',
  })
  @ApiParam({
    name: 'challengeId',
    description: 'ID del desafío',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Participante eliminado',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar (desafío en progreso)',
  })
  async removeParticipant(
    @Param('challengeId') challengeId: string,
    @Param('userId') userId: string,
  ) {
    await this.participantsService.removeParticipant(challengeId, userId);
  }

  /**
   * Obtiene estadísticas de participación de un usuario
   *
   * @param userId - ID del usuario
   * @returns Estadísticas agregadas
   */
  @Get('challenge-participants/user/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user stats',
    description: 'Obtiene estadísticas de participación de un usuario en peer challenges',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del usuario',
    schema: {
      example: {
        total_challenges: 25,
        completed: 20,
        wins: 12,
        forfeits: 2,
        disqualifications: 0,
        total_xp: 2500,
        total_coins: 1250,
        win_rate: 60.0,
      },
    },
  })
  async getUserStats(@Param('userId') userId: string) {
    return await this.participantsService.getUserStats(userId);
  }
}
