import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { ScheduledMission } from '../entities';
import { CreateScheduledMissionDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';

/**
 * ScheduledMissionService
 *
 * Gestión de misiones programadas para aulas
 * - CRUD de misiones programadas
 * - Validación de fechas (starts_at < ends_at)
 * - Control de activación/desactivación
 * - Auto-expiración de misiones pasadas
 * - Distribución de bonus rewards
 * - Consultas por classroom, usuario, estado
 */
@Injectable()
export class ScheduledMissionService {
  constructor(
    @InjectRepository(ScheduledMission, 'progress')
    private readonly scheduledMissionRepo: Repository<ScheduledMission>,
  ) {}

  /**
   * Crea una nueva misión programada
   * @param dto - Datos de la misión
   * @returns Nueva misión creada
   */
  async create(dto: CreateScheduledMissionDto): Promise<ScheduledMission> {
    // Validar que starts_at < ends_at
    if (dto.starts_at >= dto.ends_at) {
      throw new BadRequestException('Start date must be before end date');
    }

    const newMission = this.scheduledMissionRepo.create({
      ...dto,
      is_active: true,
      bonus_xp: dto.bonus_xp || 0,
      bonus_coins: dto.bonus_coins || 0,
    });

    return await this.scheduledMissionRepo.save(newMission);
  }

  /**
   * Obtiene todas las misiones de un aula
   * @param classroomId - ID del aula
   * @returns Lista de misiones del aula
   */
  async findByClassroomId(classroomId: string): Promise<ScheduledMission[]> {
    return await this.scheduledMissionRepo.find({
      where: { classroom_id: classroomId },
      order: { starts_at: 'DESC' },
    });
  }

  /**
   * Obtiene misiones asignadas a un estudiante (por sus aulas)
   * @param userId - ID del estudiante
   * @returns Lista de misiones del estudiante
   * @note Este método requiere conocer las aulas del usuario, se debe integrar con ClassroomService
   */
  async findByUserId(userId: string): Promise<ScheduledMission[]> {
    // TODO: Integrar con ClassroomService para obtener classrooms del usuario
    // Por ahora, retornar todas las misiones activas como placeholder
    return await this.scheduledMissionRepo.find({
      where: { is_active: true },
      order: { starts_at: 'DESC' },
    });
  }

  /**
   * Obtiene todas las misiones activas
   * @returns Lista de misiones activas
   */
  async findActive(): Promise<ScheduledMission[]> {
    const now = new Date();

    return await this.scheduledMissionRepo.find({
      where: {
        is_active: true,
        starts_at: LessThan(now),
        ends_at: MoreThan(now),
      },
      order: { starts_at: 'ASC' },
    });
  }

  /**
   * Obtiene misiones próximas de un usuario (no iniciadas)
   * @param userId - ID del usuario
   * @returns Lista de misiones próximas
   */
  async findUpcoming(userId: string): Promise<ScheduledMission[]> {
    const now = new Date();

    // TODO: Filtrar por classrooms del usuario
    return await this.scheduledMissionRepo.find({
      where: {
        is_active: true,
        starts_at: MoreThan(now),
      },
      order: { starts_at: 'ASC' },
    });
  }

  /**
   * Inicia una misión (marca como iniciada)
   * @param id - ID de la misión programada
   * @returns Misión actualizada
   */
  async startMission(id: string): Promise<ScheduledMission> {
    const mission = await this.scheduledMissionRepo.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException(`Scheduled mission with ID ${id} not found`);
    }

    const now = new Date();

    // Validar que la misión esté en el periodo válido
    if (now < mission.starts_at) {
      throw new BadRequestException('Mission has not started yet');
    }

    if (now > mission.ends_at) {
      throw new BadRequestException('Mission has already ended');
    }

    if (!mission.is_active) {
      throw new BadRequestException('Mission is not active');
    }

    // La misión ya está activa, retornar tal cual
    return mission;
  }

  /**
   * Marca una misión como completada
   * @param id - ID de la misión programada
   * @returns Misión actualizada
   * @note Este método podría registrar progreso del usuario en otra tabla
   */
  async completeMission(id: string): Promise<ScheduledMission> {
    const mission = await this.scheduledMissionRepo.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException(`Scheduled mission with ID ${id} not found`);
    }

    const now = new Date();

    if (now > mission.ends_at) {
      throw new BadRequestException('Mission deadline has passed');
    }

    // TODO: Registrar completación en tabla de user_mission_progress
    // Por ahora, simplemente retornar la misión

    return mission;
  }

  /**
   * Actualiza el progreso de una misión
   * @param id - ID de la misión programada
   * @param progress - Porcentaje de progreso (0-100)
   * @returns Misión actualizada
   * @note Este método es para tracking, puede extenderse con tabla auxiliar
   */
  async updateProgress(id: string, progress: number): Promise<ScheduledMission> {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const mission = await this.scheduledMissionRepo.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException(`Scheduled mission with ID ${id} not found`);
    }

    // TODO: Almacenar progreso en tabla auxiliar user_mission_progress
    // Por ahora, solo validamos y retornamos

    return mission;
  }

  /**
   * Distribuye bonus rewards por completar misión
   * @param id - ID de la misión programada
   * @returns Información de rewards distribuidos
   */
  async claimBonusRewards(id: string): Promise<{
    mission: ScheduledMission;
    bonus_xp: number;
    bonus_coins: number;
  }> {
    const mission = await this.scheduledMissionRepo.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException(`Scheduled mission with ID ${id} not found`);
    }

    const now = new Date();

    // Verificar que la misión esté completada antes de deadline
    if (now > mission.ends_at) {
      throw new BadRequestException('Mission deadline has passed, no bonus available');
    }

    if (!mission.is_active) {
      throw new BadRequestException('Mission is not active');
    }

    // TODO: Integrar con GamificationService para distribuir rewards
    // await this.userStatsService.addXp(userId, mission.bonus_xp);
    // await this.mlCoinsService.addCoins(userId, mission.bonus_coins, 'earned_mission');

    return {
      mission,
      bonus_xp: mission.bonus_xp,
      bonus_coins: mission.bonus_coins,
    };
  }

  /**
   * Auto-expira misiones pasadas
   * @returns Cantidad de misiones expiradas
   * @note Este método debe ejecutarse periódicamente (cron job)
   */
  async expirePastMissions(): Promise<number> {
    const now = new Date();

    const pastMissions = await this.scheduledMissionRepo.find({
      where: {
        is_active: true,
        ends_at: LessThan(now),
      },
    });

    // Desactivar misiones expiradas
    for (const mission of pastMissions) {
      mission.is_active = false;
      await this.scheduledMissionRepo.save(mission);
    }

    return pastMissions.length;
  }

  /**
   * Obtiene una misión por ID
   * @param id - ID de la misión programada
   * @returns Misión encontrada
   */
  async findById(id: string): Promise<ScheduledMission> {
    const mission = await this.scheduledMissionRepo.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException(`Scheduled mission with ID ${id} not found`);
    }

    return mission;
  }

  /**
   * Desactiva una misión programada
   * @param id - ID de la misión programada
   * @returns Misión desactivada
   */
  async deactivate(id: string): Promise<ScheduledMission> {
    const mission = await this.findById(id);

    mission.is_active = false;
    return await this.scheduledMissionRepo.save(mission);
  }

  /**
   * Reactiva una misión programada
   * @param id - ID de la misión programada
   * @returns Misión reactivada
   */
  async activate(id: string): Promise<ScheduledMission> {
    const mission = await this.findById(id);

    const now = new Date();

    // Validar que no haya expirado
    if (now > mission.ends_at) {
      throw new BadRequestException('Cannot activate expired mission');
    }

    mission.is_active = true;
    return await this.scheduledMissionRepo.save(mission);
  }
}
