import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../entities';
import { CreateFriendshipDto, UpdateFriendshipStatusDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { FriendshipStatusEnum } from '@shared/constants/enums.constants';

/**
 * FriendshipsService
 *
 * Gestión de relaciones de amistad entre usuarios
 * - CRUD de amistades
 * - Estados: pending, accepted, rejected, blocked
 * - Prevención de auto-amistad y solicitudes duplicadas
 * - Manejo bidireccional de relaciones de amistad
 */
@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(Friendship, 'social')
    private readonly friendshipRepo: Repository<Friendship>,
  ) {}

  /**
   * Obtiene todas las relaciones de amistad de un usuario (amigos y solicitudes)
   * @param userId - ID del usuario
   * @returns Lista de amistades ordenadas por última actualización
   */
  async findByUserId(userId: string): Promise<Friendship[]> {
    return await this.friendshipRepo.find({
      where: [{ user_id: userId }, { friend_id: userId }],
      order: { updated_at: 'DESC' },
    });
  }

  /**
   * Busca una relación de amistad específica entre dos usuarios (bidireccional)
   * @param userId - ID del usuario 1
   * @param friendId - ID del usuario 2
   * @returns Relación de amistad si existe, null en caso contrario
   */
  async findByUserPair(
    userId: string,
    friendId: string,
  ): Promise<Friendship | null> {
    const friendship = await this.friendshipRepo.findOne({
      where: [
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId },
      ],
    });

    return friendship || null;
  }

  /**
   * Envía una solicitud de amistad
   * @param userId - ID del usuario que envía la solicitud
   * @param friendId - ID del usuario receptor
   * @returns Nueva solicitud de amistad creada
   * @throws BadRequestException si intenta enviarse solicitud a sí mismo
   * @throws ConflictException si ya existe una solicitud o amistad
   */
  async sendFriendRequest(userId: string, friendId: string): Promise<Friendship> {
    // Validar que no sea auto-amistad
    if (userId === friendId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Verificar solicitud existente
    const existingFriendship = await this.findByUserPair(userId, friendId);
    if (existingFriendship) {
      throw new ConflictException('Friendship request already exists');
    }

    // Crear solicitud de amistad
    const friendship = this.friendshipRepo.create({
      user_id: userId,
      friend_id: friendId,
      status: FriendshipStatusEnum.PENDING,
    });

    return await this.friendshipRepo.save(friendship);
  }

  /**
   * Acepta una solicitud de amistad
   * @param friendshipId - ID de la solicitud de amistad
   * @returns Solicitud actualizada con status 'accepted'
   * @throws NotFoundException si la solicitud no existe
   * @throws BadRequestException si la solicitud no está en estado 'pending'
   */
  async acceptFriendRequest(friendshipId: string): Promise<Friendship> {
    const friendship = await this.friendshipRepo.findOne({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException(`Friendship with ID ${friendshipId} not found`);
    }

    if (friendship.status !== FriendshipStatusEnum.PENDING) {
      throw new BadRequestException('Only pending friendship requests can be accepted');
    }

    friendship.status = FriendshipStatusEnum.ACCEPTED;
    return await this.friendshipRepo.save(friendship);
  }

  /**
   * Rechaza una solicitud de amistad
   * @param friendshipId - ID de la solicitud de amistad
   * @returns Solicitud actualizada con status 'rejected'
   * @throws NotFoundException si la solicitud no existe
   * @throws BadRequestException si la solicitud no está en estado 'pending'
   */
  async rejectFriendRequest(friendshipId: string): Promise<Friendship> {
    const friendship = await this.friendshipRepo.findOne({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException(`Friendship with ID ${friendshipId} not found`);
    }

    if (friendship.status !== FriendshipStatusEnum.PENDING) {
      throw new BadRequestException('Only pending friendship requests can be rejected');
    }

    friendship.status = FriendshipStatusEnum.REJECTED;
    return await this.friendshipRepo.save(friendship);
  }

  /**
   * Bloquea un usuario
   * @param userId - ID del usuario que bloquea
   * @param friendId - ID del usuario a bloquear
   * @returns Relación actualizada con status 'blocked'
   * @throws BadRequestException si intenta bloquearse a sí mismo
   */
  async blockUser(userId: string, friendId: string): Promise<Friendship> {
    if (userId === friendId) {
      throw new BadRequestException('Cannot block yourself');
    }

    // Buscar relación existente
    let friendship = await this.findByUserPair(userId, friendId);

    if (friendship) {
      // Si existe, actualizar a blocked
      friendship.status = FriendshipStatusEnum.BLOCKED;
      return await this.friendshipRepo.save(friendship);
    } else {
      // Si no existe, crear nueva relación con status blocked
      friendship = this.friendshipRepo.create({
        user_id: userId,
        friend_id: friendId,
        status: FriendshipStatusEnum.BLOCKED,
      });
      return await this.friendshipRepo.save(friendship);
    }
  }

  /**
   * Desbloquea un usuario
   * @param userId - ID del usuario que desbloquea
   * @param friendId - ID del usuario a desbloquear
   * @returns Relación eliminada
   * @throws NotFoundException si no existe bloqueo
   */
  async unblockUser(userId: string, friendId: string): Promise<void> {
    const friendship = await this.friendshipRepo.findOne({
      where: { user_id: userId, friend_id: friendId, status: FriendshipStatusEnum.BLOCKED },
    });

    if (!friendship) {
      throw new NotFoundException('No blocked relationship found');
    }

    await this.friendshipRepo.remove(friendship);
  }

  /**
   * Elimina una amistad
   * @param userId - ID del usuario que elimina
   * @param friendId - ID del amigo a eliminar
   * @throws NotFoundException si no existe amistad
   */
  async removeFriend(userId: string, friendId: string): Promise<void> {
    const friendship = await this.findByUserPair(userId, friendId);

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    await this.friendshipRepo.remove(friendship);
  }

  /**
   * Obtiene solicitudes de amistad pendientes recibidas por un usuario
   * @param userId - ID del usuario
   * @returns Lista de solicitudes pendientes recibidas
   */
  async getPendingRequests(userId: string): Promise<Friendship[]> {
    return await this.friendshipRepo.find({
      where: {
        friend_id: userId,
        status: FriendshipStatusEnum.PENDING,
      },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtiene solicitudes de amistad enviadas por un usuario
   * @param userId - ID del usuario
   * @returns Lista de solicitudes enviadas
   */
  async getSentRequests(userId: string): Promise<Friendship[]> {
    return await this.friendshipRepo.find({
      where: {
        user_id: userId,
        status: FriendshipStatusEnum.PENDING,
      },
      order: { created_at: 'DESC' },
    });
  }
}
