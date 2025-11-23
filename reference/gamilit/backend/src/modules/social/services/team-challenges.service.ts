import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamChallenge } from '../entities';
import { CreateTeamChallengeDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { TeamChallengeStatusEnum } from '@shared/constants/enums.constants';

/**
 * TeamChallengesService
 *
 * Gestión de desafíos asignados a equipos
 * - CRUD de desafíos de equipos
 * - Estados: active, in_progress, completed, failed, cancelled
 * - Tracking de scores y fechas de inicio/completación
 * - Generación de leaderboards por desafío
 * - Validación de transiciones de estado
 */
@Injectable()
export class TeamChallengesService {
  constructor(
    @InjectRepository(TeamChallenge, 'social')
    private readonly teamChallengeRepo: Repository<TeamChallenge>,
  ) {}

  /**
   * Asigna un desafío a un equipo
   * @param dto - Datos del desafío
   * @returns Nuevo desafío creado
   * @throws ConflictException si el equipo ya tiene asignado este desafío
   */
  async create(dto: CreateTeamChallengeDto): Promise<TeamChallenge> {
    // Verificar que no exista asignación previa
    const existingChallenge = await this.teamChallengeRepo.findOne({
      where: {
        team_id: dto.team_id,
        challenge_id: dto.challenge_id,
      },
    });

    if (existingChallenge) {
      throw new ConflictException(
        `Challenge ${dto.challenge_id} is already assigned to team ${dto.team_id}`,
      );
    }

    const teamChallenge = this.teamChallengeRepo.create({
      ...dto,
      status: TeamChallengeStatusEnum.ACTIVE,
      started_at: new Date(),
      score: 0,
    });

    return await this.teamChallengeRepo.save(teamChallenge);
  }

  /**
   * Obtiene todos los desafíos de un equipo
   * @param teamId - ID del equipo
   * @returns Lista de desafíos ordenados por fecha de inicio
   */
  async findByTeamId(teamId: string): Promise<TeamChallenge[]> {
    return await this.teamChallengeRepo.find({
      where: { team_id: teamId },
      order: { started_at: 'DESC' },
    });
  }

  /**
   * Obtiene todos los equipos que tienen asignado un desafío
   * @param challengeId - ID del desafío
   * @returns Lista de asignaciones ordenadas por score
   */
  async findByChallengeId(challengeId: string): Promise<TeamChallenge[]> {
    return await this.teamChallengeRepo.find({
      where: { challenge_id: challengeId },
      order: { score: 'DESC' },
    });
  }

  /**
   * Obtiene una asignación específica de desafío a equipo
   * @param teamId - ID del equipo
   * @param challengeId - ID del desafío
   * @returns Asignación encontrada
   * @throws NotFoundException si no existe la asignación
   */
  async findByTeamAndChallenge(
    teamId: string,
    challengeId: string,
  ): Promise<TeamChallenge> {
    const teamChallenge = await this.teamChallengeRepo.findOne({
      where: {
        team_id: teamId,
        challenge_id: challengeId,
      },
    });

    if (!teamChallenge) {
      throw new NotFoundException(
        `Challenge ${challengeId} not found for team ${teamId}`,
      );
    }

    return teamChallenge;
  }

  /**
   * Actualiza el estado de un desafío
   * @param id - ID del desafío de equipo
   * @param status - Nuevo estado
   * @returns Desafío actualizado
   * @throws NotFoundException si no existe el desafío
   * @throws BadRequestException si la transición de estado es inválida
   */
  async updateStatus(id: string, status: string): Promise<TeamChallenge> {
    const teamChallenge = await this.teamChallengeRepo.findOne({ where: { id } });

    if (!teamChallenge) {
      throw new NotFoundException(`Team challenge with ID ${id} not found`);
    }

    // Validar transiciones de estado
    this.validateStatusTransition(teamChallenge.status, status);

    teamChallenge.status = status;

    // Si se completa, registrar fecha
    if (
      status === TeamChallengeStatusEnum.COMPLETED ||
      status === TeamChallengeStatusEnum.FAILED
    ) {
      teamChallenge.completed_at = new Date();
    }

    return await this.teamChallengeRepo.save(teamChallenge);
  }

  /**
   * Registra un score para un desafío de equipo
   * @param id - ID del desafío de equipo
   * @param score - Score obtenido
   * @returns Desafío actualizado
   * @throws NotFoundException si no existe el desafío
   * @throws BadRequestException si el score es negativo
   */
  async recordScore(id: string, score: number): Promise<TeamChallenge> {
    if (score < 0) {
      throw new BadRequestException('Score cannot be negative');
    }

    const teamChallenge = await this.teamChallengeRepo.findOne({ where: { id } });

    if (!teamChallenge) {
      throw new NotFoundException(`Team challenge with ID ${id} not found`);
    }

    teamChallenge.score = score;

    // Si está activo, cambiar a in_progress
    if (teamChallenge.status === TeamChallengeStatusEnum.ACTIVE) {
      teamChallenge.status = TeamChallengeStatusEnum.IN_PROGRESS;
    }

    return await this.teamChallengeRepo.save(teamChallenge);
  }

  /**
   * Marca un desafío como completado con score final
   * @param id - ID del desafío de equipo
   * @param score - Score final
   * @returns Desafío completado
   * @throws NotFoundException si no existe el desafío
   */
  async complete(id: string, score: number): Promise<TeamChallenge> {
    const teamChallenge = await this.teamChallengeRepo.findOne({ where: { id } });

    if (!teamChallenge) {
      throw new NotFoundException(`Team challenge with ID ${id} not found`);
    }

    teamChallenge.status = TeamChallengeStatusEnum.COMPLETED;
    teamChallenge.score = score;
    teamChallenge.completed_at = new Date();

    return await this.teamChallengeRepo.save(teamChallenge);
  }

  /**
   * Marca un desafío como fallado
   * @param id - ID del desafío de equipo
   * @returns Desafío actualizado
   * @throws NotFoundException si no existe el desafío
   */
  async fail(id: string): Promise<TeamChallenge> {
    const teamChallenge = await this.teamChallengeRepo.findOne({ where: { id } });

    if (!teamChallenge) {
      throw new NotFoundException(`Team challenge with ID ${id} not found`);
    }

    teamChallenge.status = TeamChallengeStatusEnum.FAILED;
    teamChallenge.completed_at = new Date();

    return await this.teamChallengeRepo.save(teamChallenge);
  }

  /**
   * Obtiene el leaderboard de un desafío (equipos rankeados por score)
   * @param challengeId - ID del desafío
   * @returns Lista de equipos ordenados por score DESC
   */
  async getLeaderboard(challengeId: string): Promise<TeamChallenge[]> {
    return await this.teamChallengeRepo.find({
      where: { challenge_id: challengeId },
      order: { score: 'DESC', completed_at: 'ASC' },
    });
  }

  /**
   * Valida que una transición de estado sea permitida
   * @param currentStatus - Estado actual
   * @param newStatus - Nuevo estado
   * @throws BadRequestException si la transición es inválida
   */
  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: Record<string, string[]> = {
      [TeamChallengeStatusEnum.ACTIVE]: [
        TeamChallengeStatusEnum.IN_PROGRESS,
        TeamChallengeStatusEnum.CANCELLED,
      ],
      [TeamChallengeStatusEnum.IN_PROGRESS]: [
        TeamChallengeStatusEnum.COMPLETED,
        TeamChallengeStatusEnum.FAILED,
        TeamChallengeStatusEnum.CANCELLED,
      ],
      [TeamChallengeStatusEnum.COMPLETED]: [], // Estado final
      [TeamChallengeStatusEnum.FAILED]: [], // Estado final
      [TeamChallengeStatusEnum.CANCELLED]: [], // Estado final
    };

    const allowedTransitions = validTransitions[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
