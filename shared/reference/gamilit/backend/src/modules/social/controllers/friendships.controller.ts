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
import { FriendshipsService } from '../services';
import {
  CreateFriendshipDto,
  FriendshipResponseDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * FriendshipsController
 *
 * @description Gestión de relaciones de amistad entre usuarios.
 * Endpoints para enviar/aceptar/rechazar solicitudes, bloquear usuarios,
 * y gestionar amistades bidireccionales.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Friendships')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  /**
   * Obtiene todas las amistades de un usuario (amigos y solicitudes)
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de amistades del usuario
   *
   * @example
   * GET /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/friends
   */
  @Get('users/:userId/friends')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user friends',
    description:
      'Obtiene todas las relaciones de amistad del usuario (amigos y solicitudes pendientes)',
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
    description: 'Lista de amistades obtenida exitosamente',
    type: [FriendshipResponseDto],
    schema: {
      example: [
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          friend_id: '550e8400-e29b-41d4-a716-446655440002',
          status: 'accepted',
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:30:00Z',
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
  async getUserFriends(@Param('userId') userId: string) {
    return await this.friendshipsService.findByUserId(userId);
  }

  /**
   * Obtiene solicitudes de amistad pendientes recibidas por el usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de solicitudes pendientes recibidas
   *
   * @example
   * GET /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/friends/pending
   */
  @Get('users/:userId/friends/pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get pending friend requests',
    description:
      'Obtiene las solicitudes de amistad pendientes que el usuario ha recibido',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitudes pendientes obtenidas exitosamente',
    type: [FriendshipResponseDto],
    schema: {
      example: [
        {
          id: '660e8400-e29b-41d4-a716-446655440003',
          user_id: '550e8400-e29b-41d4-a716-446655440005',
          friend_id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'pending',
          created_at: '2025-01-16T08:00:00Z',
          updated_at: '2025-01-16T08:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getPendingRequests(@Param('userId') userId: string) {
    return await this.friendshipsService.getPendingRequests(userId);
  }

  /**
   * Obtiene solicitudes de amistad enviadas por el usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de solicitudes enviadas
   *
   * @example
   * GET /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/friends/sent
   */
  @Get('users/:userId/friends/sent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get sent friend requests',
    description: 'Obtiene las solicitudes de amistad que el usuario ha enviado',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitudes enviadas obtenidas exitosamente',
    type: [FriendshipResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getSentRequests(@Param('userId') userId: string) {
    return await this.friendshipsService.getSentRequests(userId);
  }

  /**
   * Envía una solicitud de amistad
   *
   * @param createDto - Datos de la solicitud (userId, friendId)
   * @returns Nueva solicitud de amistad creada
   *
   * @example
   * POST /api/v1/social/friendships/request
   * Request: {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "friend_id": "550e8400-e29b-41d4-a716-446655440002"
   * }
   */
  @Post('friendships/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send friend request',
    description: 'Envía una solicitud de amistad a otro usuario',
  })
  @ApiBody({
    type: CreateFriendshipDto,
    description: 'Datos para enviar solicitud de amistad',
    examples: {
      example1: {
        value: {
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          friend_id: '550e8400-e29b-41d4-a716-446655440002',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitud de amistad enviada exitosamente',
    type: FriendshipResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440007',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        friend_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'pending',
        created_at: '2025-01-17T14:00:00Z',
        updated_at: '2025-01-17T14:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (auto-amistad no permitida)',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot send friend request to yourself',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'La solicitud o amistad ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'Friendship request already exists',
        error: 'Conflict',
      },
    },
  })
  async sendFriendRequest(@Body() createDto: CreateFriendshipDto) {
    return await this.friendshipsService.sendFriendRequest(
      createDto.user_id,
      createDto.friend_id,
    );
  }

  /**
   * Acepta una solicitud de amistad
   *
   * @param id - ID de la solicitud de amistad (UUID)
   * @returns Solicitud actualizada con status 'accepted'
   *
   * @example
   * PATCH /api/v1/social/friendships/660e8400-e29b-41d4-a716-446655440003/accept
   */
  @Patch('friendships/:id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept friend request',
    description:
      'Acepta una solicitud de amistad pendiente, actualizando el status a "accepted"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la solicitud de amistad en formato UUID',
    type: String,
    required: true,
    example: '660e8400-e29b-41d4-a716-446655440003',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud aceptada exitosamente',
    type: FriendshipResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440005',
        friend_id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'accepted',
        created_at: '2025-01-16T08:00:00Z',
        updated_at: '2025-01-17T15:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La solicitud no está en estado pendiente',
    schema: {
      example: {
        statusCode: 400,
        message: 'Only pending friendship requests can be accepted',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud de amistad no encontrada',
  })
  async acceptFriendRequest(@Param('id') id: string) {
    return await this.friendshipsService.acceptFriendRequest(id);
  }

  /**
   * Rechaza una solicitud de amistad
   *
   * @param id - ID de la solicitud de amistad (UUID)
   * @returns Solicitud actualizada con status 'rejected'
   *
   * @example
   * PATCH /api/v1/social/friendships/660e8400-e29b-41d4-a716-446655440003/reject
   */
  @Patch('friendships/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reject friend request',
    description:
      'Rechaza una solicitud de amistad pendiente, actualizando el status a "rejected"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la solicitud de amistad en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud rechazada exitosamente',
    type: FriendshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'La solicitud no está en estado pendiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud de amistad no encontrada',
  })
  async rejectFriendRequest(@Param('id') id: string) {
    return await this.friendshipsService.rejectFriendRequest(id);
  }

  /**
   * Bloquea un usuario
   *
   * @param userId - ID del usuario que bloquea (UUID)
   * @param friendId - ID del usuario a bloquear (UUID)
   * @returns Relación de bloqueo creada o actualizada
   *
   * @example
   * POST /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/block/550e8400-e29b-41d4-a716-446655440002
   */
  @Post('users/:userId/block/:friendId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Block user',
    description:
      'Bloquea a un usuario, creando o actualizando la relación de amistad a status "blocked"',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario que bloquea en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'friendId',
    description: 'ID del usuario a bloquear en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario bloqueado exitosamente',
    type: FriendshipResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440008',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        friend_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'blocked',
        created_at: '2025-01-17T16:00:00Z',
        updated_at: '2025-01-17T16:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede bloquear a sí mismo',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot block yourself',
        error: 'Bad Request',
      },
    },
  })
  async blockUser(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return await this.friendshipsService.blockUser(userId, friendId);
  }

  /**
   * Desbloquea un usuario
   *
   * @param userId - ID del usuario que desbloquea (UUID)
   * @param friendId - ID del usuario a desbloquear (UUID)
   * @returns Confirmación de desbloqueo
   *
   * @example
   * DELETE /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/block/550e8400-e29b-41d4-a716-446655440002
   */
  @Delete('users/:userId/block/:friendId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Unblock user',
    description:
      'Desbloquea a un usuario, eliminando la relación de bloqueo',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario que desbloquea en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'friendId',
    description: 'ID del usuario a desbloquear en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Usuario desbloqueado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe relación de bloqueo',
  })
  async unblockUser(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    await this.friendshipsService.unblockUser(userId, friendId);
  }

  /**
   * Elimina una amistad
   *
   * @param userId - ID del usuario que elimina (UUID)
   * @param friendId - ID del amigo a eliminar (UUID)
   * @returns Confirmación de eliminación
   *
   * @example
   * DELETE /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/friends/550e8400-e29b-41d4-a716-446655440002
   */
  @Delete('users/:userId/friends/:friendId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove friend',
    description: 'Elimina una amistad existente entre dos usuarios',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario que elimina en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'friendId',
    description: 'ID del amigo a eliminar en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Amistad eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Amistad no encontrada',
  })
  async removeFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    await this.friendshipsService.removeFriend(userId, friendId);
  }

  /**
   * Verifica el estado de amistad entre dos usuarios
   *
   * @param userId1 - ID del primer usuario (UUID)
   * @param userId2 - ID del segundo usuario (UUID)
   * @returns Relación de amistad si existe, null en caso contrario
   *
   * @example
   * GET /api/v1/social/users/550e8400-e29b-41d4-a716-446655440000/550e8400-e29b-41d4-a716-446655440002/friendship
   */
  @Get('users/:userId1/:userId2/friendship')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check friendship status',
    description:
      'Verifica si existe una relación de amistad entre dos usuarios y devuelve su estado',
  })
  @ApiParam({
    name: 'userId1',
    description: 'ID del primer usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'userId2',
    description: 'ID del segundo usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de amistad obtenido exitosamente',
    type: FriendshipResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        friend_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'accepted',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No existe relación de amistad entre los usuarios',
  })
  async findByUserPair(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return await this.friendshipsService.findByUserPair(userId1, userId2);
  }
}
