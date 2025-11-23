import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entities';
import { CreateTeamDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';

/**
 * TeamsService
 *
 * Gestión de equipos colaborativos de estudiantes
 * - CRUD de equipos
 * - Validación de códigos únicos de equipo
 * - Control de capacidad de miembros
 * - Tracking de XP, ML Coins, módulos y achievements
 * - Gestión de leaderboards
 * - Configuraciones visuales (colores, badges, avatars)
 */
@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team, 'social')
    private readonly teamRepo: Repository<Team>,
  ) {}

  /**
   * Crea un nuevo equipo
   * @param dto - Datos para crear el equipo
   * @returns Nuevo equipo creado
   * @throws ConflictException si el código de equipo ya existe
   */
  async create(dto: CreateTeamDto): Promise<Team> {
    // Validar código único si se proporciona
    if (dto.team_code) {
      const existingTeam = await this.teamRepo.findOne({
        where: { team_code: dto.team_code },
      });

      if (existingTeam) {
        throw new ConflictException(`Team with code ${dto.team_code} already exists`);
      }
    }

    const team = this.teamRepo.create({
      ...dto,
      current_members_count: 0,
      total_xp: 0,
      total_ml_coins: 0,
      modules_completed: 0,
      achievements_earned: 0,
      is_active: true,
      is_verified: false,
      founded_at: new Date(),
      last_activity_at: new Date(),
      badges: dto.badges || [],
      metadata: dto.metadata || {},
    });

    return await this.teamRepo.save(team);
  }

  /**
   * Obtiene todos los equipos, opcionalmente filtrados por aula
   * @param classroomId - ID del aula (opcional)
   * @returns Lista de equipos ordenados por XP total
   */
  async findAll(classroomId?: string): Promise<Team[]> {
    const whereCondition = classroomId ? { classroom_id: classroomId } : {};

    return await this.teamRepo.find({
      where: whereCondition,
      order: { total_xp: 'DESC' },
    });
  }

  /**
   * Obtiene un equipo por ID
   * @param id - ID del equipo
   * @returns Equipo encontrado
   * @throws NotFoundException si el equipo no existe
   */
  async findById(id: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  /**
   * Obtiene un equipo por su código único
   * @param code - Código del equipo
   * @returns Equipo encontrado
   * @throws NotFoundException si el equipo no existe
   */
  async findByCode(code: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { team_code: code } });

    if (!team) {
      throw new NotFoundException(`Team with code ${code} not found`);
    }

    return team;
  }

  /**
   * Actualiza un equipo
   * @param id - ID del equipo
   * @param dto - Campos a actualizar
   * @returns Equipo actualizado
   * @throws NotFoundException si el equipo no existe
   * @throws ConflictException si el nuevo código ya existe
   */
  async update(id: string, dto: Partial<CreateTeamDto>): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    // Si se actualiza el código, validar unicidad
    if (dto.team_code && dto.team_code !== team.team_code) {
      const existingTeam = await this.teamRepo.findOne({
        where: { team_code: dto.team_code },
      });

      if (existingTeam) {
        throw new ConflictException(`Team with code ${dto.team_code} already exists`);
      }
    }

    Object.assign(team, dto);
    team.last_activity_at = new Date();

    return await this.teamRepo.save(team);
  }

  /**
   * Elimina un equipo
   * @param id - ID del equipo
   * @throws NotFoundException si el equipo no existe
   */
  async delete(id: string): Promise<void> {
    const team = await this.teamRepo.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    await this.teamRepo.remove(team);
  }

  /**
   * Agrega un miembro al equipo (incrementa contador)
   * @param teamId - ID del equipo
   * @param userId - ID del usuario
   * @returns Equipo actualizado
   * @throws NotFoundException si el equipo no existe
   * @throws BadRequestException si el equipo está lleno
   */
  async addMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Verificar capacidad
    if (team.current_members_count >= team.max_members) {
      throw new BadRequestException('Team is at maximum capacity');
    }

    team.current_members_count += 1;
    team.last_activity_at = new Date();

    return await this.teamRepo.save(team);
  }

  /**
   * Retira un miembro del equipo (decrementa contador)
   * @param teamId - ID del equipo
   * @param userId - ID del usuario
   * @returns Equipo actualizado
   * @throws NotFoundException si el equipo no existe
   */
  async removeMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Decrementar contador (no puede ser negativo)
    if (team.current_members_count > 0) {
      team.current_members_count -= 1;
    }

    team.last_activity_at = new Date();

    return await this.teamRepo.save(team);
  }

  /**
   * Actualiza el score total de un equipo
   * @param teamId - ID del equipo
   * @param score - Nuevo score
   * @returns Equipo actualizado
   * @throws NotFoundException si el equipo no existe
   */
  async updateScore(teamId: string, score: number): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // El score se puede almacenar en metadata si no hay campo directo
    team.metadata = {
      ...team.metadata,
      total_score: score,
    };

    team.last_activity_at = new Date();

    return await this.teamRepo.save(team);
  }

  /**
   * Agrega XP a un equipo
   * @param teamId - ID del equipo
   * @param xp - Cantidad de XP a agregar
   * @returns Equipo actualizado
   * @throws NotFoundException si el equipo no existe
   */
  async addXP(teamId: string, xp: number): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    team.total_xp += xp;
    team.last_activity_at = new Date();

    return await this.teamRepo.save(team);
  }

  /**
   * Obtiene el leaderboard de equipos de un aula
   * @param classroomId - ID del aula
   * @returns Lista de equipos ordenados por XP y score
   */
  async getLeaderboard(classroomId: string): Promise<Team[]> {
    return await this.teamRepo.find({
      where: {
        classroom_id: classroomId,
        is_active: true,
      },
      order: {
        total_xp: 'DESC',
        total_ml_coins: 'DESC',
      },
    });
  }

  /**
   * Obtiene estadísticas de un equipo
   * @param teamId - ID del equipo
   * @returns Estadísticas del equipo (miembros, desafíos, achievements)
   * @throws NotFoundException si el equipo no existe
   */
  async getTeamStats(teamId: string): Promise<{
    member_count: number;
    max_members: number;
    capacity_usage_percentage: number;
    total_xp: number;
    total_ml_coins: number;
    modules_completed: number;
    achievements_earned: number;
    challenges_completed: number;
  }> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const capacityUsage =
      team.max_members > 0
        ? (team.current_members_count / team.max_members) * 100
        : 0;

    return {
      member_count: team.current_members_count,
      max_members: team.max_members,
      capacity_usage_percentage: Number(capacityUsage.toFixed(2)),
      total_xp: team.total_xp,
      total_ml_coins: team.total_ml_coins,
      modules_completed: team.modules_completed,
      achievements_earned: team.achievements_earned,
      challenges_completed: 0, // TODO: Query team_challenges when available
    };
  }
}
