import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengeParticipant, PeerChallenge } from '../entities';

/**
 * ChallengeParticipantsService
 *
 * @description Gestión de participantes en peer challenges.
 *
 * Funcionalidades:
 * - CRUD de participantes
 * - Gestión de estados (invited, accepted, in_progress, completed, forfeit, disqualified)
 * - Tracking de scores y rankings
 * - Distribución de recompensas (XP, ML Coins)
 * - Determinación de ganadores
 * - Estadísticas por participante
 *
 * @see ChallengeParticipant entity
 * @see PeerChallenge entity
 */
@Injectable()
export class ChallengeParticipantsService {
  constructor(
    @InjectRepository(ChallengeParticipant, 'social')
    private readonly participantRepo: Repository<ChallengeParticipant>,
    @InjectRepository(PeerChallenge, 'social')
    private readonly challengeRepo: Repository<PeerChallenge>,
  ) {}

  /**
   * Agrega un participante a un desafío
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario participante
   * @param invitedBy - ID del usuario que invita (opcional)
   * @returns Participante creado
   * @throws NotFoundException si el desafío no existe
   * @throws ConflictException si el usuario ya es participante
   * @throws BadRequestException si el desafío está lleno o en estado inválido
   */
  async addParticipant(
    challengeId: string,
    userId: string,
    invitedBy?: string,
  ): Promise<ChallengeParticipant> {
    // Verificar que el desafío existe
    const challenge = await this.challengeRepo.findOne({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`PeerChallenge with ID ${challengeId} not found`);
    }

    // Verificar que el desafío está abierto
    if (!['open', 'full'].includes(challenge.status)) {
      throw new BadRequestException(`Cannot join challenge in status ${challenge.status}`);
    }

    // Verificar que el usuario no es ya participante
    const existingParticipant = await this.participantRepo.findOne({
      where: { challenge_id: challengeId, user_id: userId },
    });

    if (existingParticipant) {
      throw new ConflictException('User is already a participant in this challenge');
    }

    // Contar participantes actuales
    const currentCount = await this.participantRepo.count({
      where: { challenge_id: challengeId },
    });

    if (currentCount >= challenge.max_participants) {
      throw new BadRequestException('Challenge is already full');
    }

    // Crear participante
    const participant = this.participantRepo.create({
      challenge_id: challengeId,
      user_id: userId,
      participation_status: invitedBy ? 'invited' : 'accepted',
      score: 0,
      is_winner: false,
      xp_earned: 0,
      ml_coins_earned: 0,
      invited_at: invitedBy ? new Date() : undefined,
      accepted_at: !invitedBy ? new Date() : undefined,
    });

    const savedParticipant = await this.participantRepo.save(participant);

    // Actualizar estado del desafío si se llenó
    if (currentCount + 1 >= challenge.max_participants) {
      challenge.status = 'full';
      await this.challengeRepo.save(challenge);
    }

    return savedParticipant;
  }

  /**
   * Obtiene todos los participantes de un desafío
   * @param challengeId - ID del desafío
   * @returns Lista de participantes ordenados por rank
   */
  async findByChallengeId(challengeId: string): Promise<ChallengeParticipant[]> {
    return await this.participantRepo.find({
      where: { challenge_id: challengeId },
      order: { rank: 'ASC', score: 'DESC' },
    });
  }

  /**
   * Obtiene participación de un usuario en un desafío específico
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @returns Participante encontrado
   * @throws NotFoundException si no existe
   */
  async findByUserAndChallenge(
    challengeId: string,
    userId: string,
  ): Promise<ChallengeParticipant> {
    const participant = await this.participantRepo.findOne({
      where: { challenge_id: challengeId, user_id: userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found in this challenge');
    }

    return participant;
  }

  /**
   * Obtiene todos los desafíos en los que participa un usuario
   * @param userId - ID del usuario
   * @param status - Filtro opcional por estado de participación
   * @returns Lista de participaciones
   */
  async findByUserId(userId: string, status?: string): Promise<ChallengeParticipant[]> {
    const where: any = { user_id: userId };

    if (status) {
      where.participation_status = status;
    }

    return await this.participantRepo.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Acepta una invitación a un desafío
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @returns Participante actualizado
   * @throws NotFoundException si no existe
   * @throws BadRequestException si el estado no es 'invited'
   */
  async acceptInvitation(challengeId: string, userId: string): Promise<ChallengeParticipant> {
    const participant = await this.findByUserAndChallenge(challengeId, userId);

    if (participant.participation_status !== 'invited') {
      throw new BadRequestException('Can only accept invitations in invited status');
    }

    participant.participation_status = 'accepted';
    return await this.participantRepo.save(participant);
  }

  /**
   * Actualiza el estado de participación
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @param newStatus - Nuevo estado
   * @returns Participante actualizado
   */
  async updateStatus(
    challengeId: string,
    userId: string,
    newStatus: 'invited' | 'accepted' | 'in_progress' | 'completed' | 'forfeit' | 'disqualified',
  ): Promise<ChallengeParticipant> {
    const participant = await this.findByUserAndChallenge(challengeId, userId);

    participant.participation_status = newStatus;

    if (newStatus === 'completed' && !participant.completed_at) {
      participant.completed_at = new Date();
    }

    return await this.participantRepo.save(participant);
  }

  /**
   * Actualiza el score de un participante
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @param score - Nuevo score
   * @returns Participante actualizado
   */
  async updateScore(
    challengeId: string,
    userId: string,
    score: number,
  ): Promise<ChallengeParticipant> {
    const participant = await this.findByUserAndChallenge(challengeId, userId);

    participant.score = score;
    participant.updated_at = new Date();

    return await this.participantRepo.save(participant);
  }

  /**
   * Calcula y asigna rankings a todos los participantes de un desafío
   * @param challengeId - ID del desafío
   * @returns Lista de participantes con rankings actualizados
   */
  async calculateRankings(challengeId: string): Promise<ChallengeParticipant[]> {
    const participants = await this.participantRepo.find({
      where: { challenge_id: challengeId },
      order: { score: 'DESC', completed_at: 'ASC' },
    });

    let rank = 1;
    for (const participant of participants) {
      participant.rank = rank;
      rank++;
    }

    return await this.participantRepo.save(participants);
  }

  /**
   * Determina y marca el ganador de un desafío
   * @param challengeId - ID del desafío
   * @returns Participante ganador
   * @throws BadRequestException si no hay participantes o scores
   */
  async determineWinner(challengeId: string): Promise<ChallengeParticipant> {
    // Calcular rankings primero
    const participants = await this.calculateRankings(challengeId);

    if (participants.length === 0) {
      throw new BadRequestException('No participants in challenge');
    }

    // El primer participante (mayor score) es el ganador
    const winner = participants[0];

    if (!winner.score || winner.score === 0) {
      throw new BadRequestException('Cannot determine winner: no scores recorded');
    }

    // Marcar como ganador
    winner.is_winner = true;
    await this.participantRepo.save(winner);

    return winner;
  }

  /**
   * Distribuye recompensas a un participante
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @param xp - XP a otorgar
   * @param mlCoins - ML Coins a otorgar
   * @returns Participante actualizado
   */
  async distributeRewards(
    challengeId: string,
    userId: string,
    xp: number,
    mlCoins: number,
  ): Promise<ChallengeParticipant> {
    const participant = await this.findByUserAndChallenge(challengeId, userId);

    participant.xp_earned = xp;
    participant.ml_coins_earned = mlCoins;
    participant.metadata = {
      ...participant.metadata,
      rewards_distributed_at: new Date().toISOString(),
    };

    return await this.participantRepo.save(participant);
  }

  /**
   * Distribuye recompensas a todos los participantes según su ranking
   * @param challengeId - ID del desafío
   * @param baseXp - XP base
   * @param baseCoins - ML Coins base
   * @param winnerMultiplier - Multiplicador para el ganador
   * @returns Lista de participantes con recompensas distribuidas
   */
  async distributeRewardsToAll(
    challengeId: string,
    baseXp: number,
    baseCoins: number,
    winnerMultiplier: number = 1.5,
  ): Promise<ChallengeParticipant[]> {
    const participants = await this.findByChallengeId(challengeId);

    const now = new Date().toISOString();
    for (const participant of participants) {
      let xp = baseXp;
      let coins = baseCoins;

      // Aplicar multiplicador al ganador
      if (participant.is_winner) {
        xp = Math.round(xp * winnerMultiplier);
        coins = Math.round(coins * winnerMultiplier);
      }

      participant.xp_earned = xp;
      participant.ml_coins_earned = coins;
      participant.metadata = {
        ...participant.metadata,
        rewards_distributed_at: now,
      };
    }

    return await this.participantRepo.save(participants);
  }

  /**
   * Abandona un desafío (forfeit)
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @returns Participante actualizado
   */
  async forfeit(challengeId: string, userId: string): Promise<ChallengeParticipant> {
    return await this.updateStatus(challengeId, userId, 'forfeit');
  }

  /**
   * Descalifica a un participante
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario a descalificar
   * @param reason - Razón de descalificación
   * @returns Participante actualizado
   */
  async disqualify(
    challengeId: string,
    userId: string,
    reason?: string,
  ): Promise<ChallengeParticipant> {
    const participant = await this.updateStatus(challengeId, userId, 'disqualified');

    if (reason) {
      participant.metadata = {
        ...participant.metadata,
        disqualification_reason: reason,
        disqualified_at: new Date().toISOString(),
      };
      await this.participantRepo.save(participant);
    }

    return participant;
  }

  /**
   * Elimina un participante de un desafío
   * @param challengeId - ID del desafío
   * @param userId - ID del usuario
   * @throws BadRequestException si el desafío ya está en progreso
   */
  async removeParticipant(challengeId: string, userId: string): Promise<void> {
    const participant = await this.findByUserAndChallenge(challengeId, userId);

    // Verificar estado del desafío
    const challenge = await this.challengeRepo.findOne({
      where: { id: challengeId },
    });

    if (challenge && challenge.status === 'in_progress') {
      throw new BadRequestException('Cannot remove participant from challenge in progress');
    }

    await this.participantRepo.remove(participant);

    // Actualizar estado del desafío si ya no está lleno
    if (challenge && challenge.status === 'full') {
      challenge.status = 'open';
      await this.challengeRepo.save(challenge);
    }
  }

  /**
   * Obtiene estadísticas de participación de un usuario
   * @param userId - ID del usuario
   * @returns Estadísticas agregadas
   */
  async getUserStats(userId: string): Promise<{
    total_challenges: number;
    completed: number;
    wins: number;
    forfeits: number;
    disqualifications: number;
    total_xp: number;
    total_coins: number;
    win_rate: number;
  }> {
    const participations = await this.findByUserId(userId);

    const stats = {
      total_challenges: participations.length,
      completed: 0,
      wins: 0,
      forfeits: 0,
      disqualifications: 0,
      total_xp: 0,
      total_coins: 0,
      win_rate: 0,
    };

    for (const p of participations) {
      if (p.participation_status === 'completed') stats.completed++;
      if (p.is_winner) stats.wins++;
      if (p.participation_status === 'forfeit') stats.forfeits++;
      if (p.participation_status === 'disqualified') stats.disqualifications++;
      stats.total_xp += p.xp_earned;
      stats.total_coins += p.ml_coins_earned;
    }

    stats.win_rate = stats.completed > 0 ? (stats.wins / stats.completed) * 100 : 0;

    return stats;
  }
}
