import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeerChallenge } from '../entities';

/**
 * PeerChallengesService
 *
 * @description Gestión de desafíos peer-to-peer entre estudiantes (Epic EXT-009).
 *
 * Funcionalidades:
 * - CRUD de peer challenges
 * - Gestión de estados (open, full, in_progress, completed, cancelled, expired)
 * - Tipos de desafío: head_to_head, multiplayer, tournament, leaderboard
 * - Sistema de recompensas con bonus multipliers
 * - Control de participantes y capacidad
 * - Timing y deadlines
 * - Filtrado por estado, tipo y creador
 *
 * @see PeerChallenge entity
 * @see ChallengeParticipant entity
 */
@Injectable()
export class PeerChallengesService {
  constructor(
    @InjectRepository(PeerChallenge, 'social')
    private readonly challengeRepo: Repository<PeerChallenge>,
  ) {}

  /**
   * Crea un nuevo peer challenge
   * @param createdBy - ID del usuario que crea el desafío
   * @param data - Datos del desafío
   * @returns Challenge creado
   * @throws BadRequestException si los datos son inválidos
   */
  async create(createdBy: string, data: Partial<PeerChallenge>): Promise<PeerChallenge> {
    // Validaciones
    if (!data.challenge_type) {
      throw new BadRequestException('challenge_type is required');
    }

    if (!data.title) {
      throw new BadRequestException('title is required');
    }

    // Validar max_participants según tipo
    if (data.challenge_type === 'head_to_head' && data.max_participants !== 2) {
      throw new BadRequestException('head_to_head challenges must have exactly 2 participants');
    }

    if (data.max_participants && data.max_participants < 2) {
      throw new BadRequestException('max_participants must be at least 2');
    }

    // Validar fechas
    if (data.start_time && data.end_time && data.start_time >= data.end_time) {
      throw new BadRequestException('end_time must be after start_time');
    }

    const challenge = this.challengeRepo.create({
      ...data,
      created_by: createdBy,
      status: 'open',
      max_participants: data.max_participants || 2,
      winner_bonus_multiplier: data.winner_bonus_multiplier || 1.5,
      rewards: data.rewards || {},
      metadata: data.metadata || {},
      created_at: new Date(),
    });

    return await this.challengeRepo.save(challenge);
  }

  /**
   * Obtiene todos los desafíos, opcionalmente filtrados
   * @param filters - Filtros opcionales (status, challenge_type, created_by)
   * @returns Lista de desafíos ordenados por created_at DESC
   */
  async findAll(filters?: {
    status?: string;
    challenge_type?: string;
    created_by?: string;
  }): Promise<PeerChallenge[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.challenge_type) {
      where.challenge_type = filters.challenge_type;
    }

    if (filters?.created_by) {
      where.created_by = filters.created_by;
    }

    return await this.challengeRepo.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtiene desafíos abiertos (disponibles para unirse)
   * @returns Lista de desafíos abiertos
   */
  async findOpen(): Promise<PeerChallenge[]> {
    return await this.challengeRepo.find({
      where: { status: 'open' },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtiene desafíos activos (in_progress)
   * @returns Lista de desafíos activos
   */
  async findActive(): Promise<PeerChallenge[]> {
    return await this.challengeRepo.find({
      where: { status: 'in_progress' },
      order: { start_time: 'ASC' },
    });
  }

  /**
   * Obtiene un desafío por ID
   * @param id - ID del desafío
   * @returns Desafío encontrado
   * @throws NotFoundException si no existe
   */
  async findById(id: string): Promise<PeerChallenge> {
    const challenge = await this.challengeRepo.findOne({ where: { id } });

    if (!challenge) {
      throw new NotFoundException(`PeerChallenge with ID ${id} not found`);
    }

    return challenge;
  }

  /**
   * Obtiene desafíos creados por un usuario
   * @param userId - ID del usuario creador
   * @returns Lista de desafíos
   */
  async findByCreator(userId: string): Promise<PeerChallenge[]> {
    return await this.challengeRepo.find({
      where: { created_by: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Actualiza un desafío
   * @param id - ID del desafío
   * @param userId - ID del usuario (debe ser el creador)
   * @param data - Datos a actualizar
   * @returns Desafío actualizado
   * @throws NotFoundException si no existe
   * @throws ForbiddenException si el usuario no es el creador
   * @throws BadRequestException si el desafío ya está en progreso o completado
   */
  async update(id: string, userId: string, data: Partial<PeerChallenge>): Promise<PeerChallenge> {
    const challenge = await this.findById(id);

    // Validar que el usuario sea el creador
    if (challenge.created_by !== userId) {
      throw new ForbiddenException('Only the creator can update this challenge');
    }

    // No permitir actualizar desafíos en progreso o completados
    if (['in_progress', 'completed', 'cancelled'].includes(challenge.status)) {
      throw new BadRequestException(`Cannot update challenge in status ${challenge.status}`);
    }

    // Actualizar campos permitidos
    Object.assign(challenge, {
      title: data.title ?? challenge.title,
      description: data.description ?? challenge.description,
      custom_rules: data.custom_rules ?? challenge.custom_rules,
      max_participants: data.max_participants ?? challenge.max_participants,
      start_time: data.start_time ?? challenge.start_time,
      end_time: data.end_time ?? challenge.end_time,
      rewards: data.rewards ?? challenge.rewards,
      winner_bonus_multiplier: data.winner_bonus_multiplier ?? challenge.winner_bonus_multiplier,
      metadata: data.metadata ?? challenge.metadata,
    });

    return await this.challengeRepo.save(challenge);
  }

  /**
   * Cambia el estado de un desafío
   * @param id - ID del desafío
   * @param newStatus - Nuevo estado
   * @returns Desafío actualizado
   * @throws NotFoundException si no existe
   * @throws BadRequestException si la transición de estado no es válida
   */
  async updateStatus(
    id: string,
    newStatus: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | 'expired',
  ): Promise<PeerChallenge> {
    const challenge = await this.findById(id);

    // Validar transiciones de estado
    const validTransitions: Record<string, string[]> = {
      open: ['full', 'in_progress', 'cancelled', 'expired'],
      full: ['in_progress', 'cancelled', 'expired'],
      in_progress: ['completed', 'cancelled'],
      completed: [], // Estado final
      cancelled: [], // Estado final
      expired: [], // Estado final
    };

    const allowedNextStates = validTransitions[challenge.status] || [];
    if (!allowedNextStates.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${challenge.status} to ${newStatus}`,
      );
    }

    challenge.status = newStatus;

    // Actualizar timestamps según el estado
    if (newStatus === 'in_progress' && !challenge.started_at) {
      challenge.started_at = new Date();
    }

    if (['completed', 'cancelled', 'expired'].includes(newStatus) && !challenge.completed_at) {
      challenge.completed_at = new Date();
    }

    return await this.challengeRepo.save(challenge);
  }

  /**
   * Marca un desafío como lleno (max participants reached)
   * @param id - ID del desafío
   * @returns Desafío actualizado
   */
  async markAsFull(id: string): Promise<PeerChallenge> {
    return await this.updateStatus(id, 'full');
  }

  /**
   * Inicia un desafío (cambia a in_progress)
   * @param id - ID del desafío
   * @returns Desafío actualizado
   */
  async start(id: string): Promise<PeerChallenge> {
    return await this.updateStatus(id, 'in_progress');
  }

  /**
   * Completa un desafío
   * @param id - ID del desafío
   * @returns Desafío actualizado
   */
  async complete(id: string): Promise<PeerChallenge> {
    return await this.updateStatus(id, 'completed');
  }

  /**
   * Cancela un desafío
   * @param id - ID del desafío
   * @param userId - ID del usuario (debe ser el creador)
   * @returns Desafío actualizado
   * @throws ForbiddenException si el usuario no es el creador
   */
  async cancel(id: string, userId: string): Promise<PeerChallenge> {
    const challenge = await this.findById(id);

    if (challenge.created_by !== userId) {
      throw new ForbiddenException('Only the creator can cancel this challenge');
    }

    return await this.updateStatus(id, 'cancelled');
  }

  /**
   * Marca desafíos expirados (end_time pasado y aún no completados)
   * @returns Número de desafíos marcados como expirados
   */
  async markExpired(): Promise<number> {
    const now = new Date();

    const expiredChallenges = await this.challengeRepo.find({
      where: [
        { status: 'open', end_time: now },
        { status: 'full', end_time: now },
        { status: 'in_progress', end_time: now },
      ],
    });

    let count = 0;
    for (const challenge of expiredChallenges) {
      if (challenge.end_time && challenge.end_time < now) {
        challenge.status = 'expired';
        challenge.completed_at = new Date();
        await this.challengeRepo.save(challenge);
        count++;
      }
    }

    return count;
  }

  /**
   * Elimina un desafío
   * @param id - ID del desafío
   * @param userId - ID del usuario (debe ser el creador)
   * @throws NotFoundException si no existe
   * @throws ForbiddenException si el usuario no es el creador
   * @throws BadRequestException si el desafío ya está en progreso
   */
  async delete(id: string, userId: string): Promise<void> {
    const challenge = await this.findById(id);

    if (challenge.created_by !== userId) {
      throw new ForbiddenException('Only the creator can delete this challenge');
    }

    if (challenge.status === 'in_progress') {
      throw new BadRequestException('Cannot delete challenge in progress');
    }

    await this.challengeRepo.remove(challenge);
  }

  /**
   * Obtiene estadísticas de desafíos por tipo
   * @returns Conteo por tipo de desafío
   */
  async getStatsByType(): Promise<
    Record<'head_to_head' | 'multiplayer' | 'tournament' | 'leaderboard', number>
  > {
    const challenges = await this.challengeRepo.find();

    return challenges.reduce(
      (acc, challenge) => {
        acc[challenge.challenge_type] = (acc[challenge.challenge_type] || 0) + 1;
        return acc;
      },
      {
        head_to_head: 0,
        multiplayer: 0,
        tournament: 0,
        leaderboard: 0,
      } as Record<'head_to_head' | 'multiplayer' | 'tournament' | 'leaderboard', number>,
    );
  }

  /**
   * Obtiene estadísticas de desafíos por estado
   * @returns Conteo por estado
   */
  async getStatsByStatus(): Promise<
    Record<'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | 'expired', number>
  > {
    const challenges = await this.challengeRepo.find();

    return challenges.reduce(
      (acc, challenge) => {
        acc[challenge.status] = (acc[challenge.status] || 0) + 1;
        return acc;
      },
      {
        open: 0,
        full: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        expired: 0,
      } as Record<'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | 'expired', number>,
    );
  }
}
