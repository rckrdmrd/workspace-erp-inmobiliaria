import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ModuleProgress } from '../entities';
import { CreateModuleProgressDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { ProgressStatusEnum } from '@shared/constants/enums.constants';

/**
 * ModuleProgressService
 *
 * Gestión del progreso de estudiantes por módulo educativo
 * - CRUD de progreso de módulos
 * - Actualización de porcentajes y estadísticas
 * - Completación de módulos
 * - Análisis de rutas de aprendizaje
 * - Agregación de estadísticas por módulo
 */
@Injectable()
export class ModuleProgressService {
  constructor(
    @InjectRepository(ModuleProgress, 'progress')
    private readonly moduleProgressRepo: Repository<ModuleProgress>,
  ) {}

  /**
   * Obtiene todos los registros de progreso de un usuario
   * @param userId - ID del usuario
   * @returns Lista de progreso de módulos ordenados por última actualización
   */
  async findByUserId(userId: string): Promise<ModuleProgress[]> {
    return await this.moduleProgressRepo.find({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
    });
  }

  /**
   * Obtiene el progreso específico de un usuario en un módulo
   * @param userId - ID del usuario
   * @param moduleId - ID del módulo
   * @returns Registro de progreso o lanza excepción si no existe
   */
  async findByUserAndModule(userId: string, moduleId: string): Promise<ModuleProgress> {
    const progress = await this.moduleProgressRepo.findOne({
      where: { user_id: userId, module_id: moduleId },
    });

    if (!progress) {
      throw new NotFoundException(
        `No progress found for user ${userId} in module ${moduleId}`,
      );
    }

    return progress;
  }

  /**
   * Crea un nuevo registro de progreso para un módulo
   * @param dto - Datos para crear el progreso
   * @returns Nuevo registro de progreso
   */
  async create(dto: CreateModuleProgressDto): Promise<ModuleProgress> {
    // Verificar que no exista progreso previo
    const existingProgress = await this.moduleProgressRepo.findOne({
      where: { user_id: dto.user_id, module_id: dto.module_id },
    });

    if (existingProgress) {
      throw new BadRequestException(
        `Progress already exists for user ${dto.user_id} in module ${dto.module_id}`,
      );
    }

    const newProgress = this.moduleProgressRepo.create({
      ...dto,
      status: ProgressStatusEnum.NOT_STARTED,
      progress_percentage: 0,
      completed_exercises: 0,
      total_exercises: dto.total_exercises || 0,
      skipped_exercises: 0,
      total_score: 0,
      total_xp_earned: 0,
      total_ml_coins_earned: 0,
      time_spent: '00:00:00',
      sessions_count: 0,
      attempts_count: 0,
      hints_used_total: 0,
      comodines_used_total: 0,
      comodines_cost_total: 0,
      started_at: new Date(),
      learning_path: [],
      performance_analytics: {},
      system_observations: {},
      metadata: {},
    });

    return await this.moduleProgressRepo.save(newProgress);
  }

  /**
   * Actualiza campos específicos de un progreso
   * @param id - ID del registro de progreso
   * @param dto - Campos a actualizar
   * @returns Registro actualizado
   */
  async update(
    id: string,
    dto: Partial<CreateModuleProgressDto>,
  ): Promise<ModuleProgress> {
    const progress = await this.moduleProgressRepo.findOne({ where: { id } });

    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    Object.assign(progress, dto);
    return await this.moduleProgressRepo.save(progress);
  }

  /**
   * Actualiza el porcentaje de progreso de un módulo
   * @param id - ID del registro de progreso
   * @param percentage - Nuevo porcentaje (0-100)
   * @returns Registro actualizado
   */
  async updateProgressPercentage(id: string, percentage: number): Promise<ModuleProgress> {
    // Validar porcentaje
    if (percentage < 0 || percentage > 100) {
      throw new BadRequestException('Progress percentage must be between 0 and 100');
    }

    const progress = await this.moduleProgressRepo.findOne({ where: { id } });

    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    progress.progress_percentage = percentage;
    progress.last_accessed_at = new Date();

    // Actualizar estado basado en porcentaje
    if (percentage === 0) {
      progress.status = ProgressStatusEnum.NOT_STARTED;
    } else if (percentage < 100) {
      progress.status = ProgressStatusEnum.IN_PROGRESS;
    } else {
      progress.status = ProgressStatusEnum.COMPLETED;
      progress.completed_at = new Date();
    }

    return await this.moduleProgressRepo.save(progress);
  }

  /**
   * Marca un módulo como completado
   * @param id - ID del registro de progreso
   * @returns Registro actualizado
   */
  async completeModule(id: string): Promise<ModuleProgress> {
    const progress = await this.moduleProgressRepo.findOne({ where: { id } });

    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    progress.status = ProgressStatusEnum.COMPLETED;
    progress.progress_percentage = 100;
    progress.completed_at = new Date();
    progress.last_accessed_at = new Date();

    // Calcular promedio de score si hay ejercicios completados
    if (progress.completed_exercises > 0 && progress.max_possible_score) {
      progress.average_score = Number(
        ((progress.total_score / progress.max_possible_score) * 100).toFixed(2),
      );
    }

    return await this.moduleProgressRepo.save(progress);
  }

  /**
   * Obtiene estadísticas agregadas de un módulo
   * @param moduleId - ID del módulo
   * @returns Estadísticas del módulo (total estudiantes, promedios, completados)
   */
  async getModuleStats(moduleId: string): Promise<{
    total_students: number;
    completed_count: number;
    in_progress_count: number;
    average_progress: number;
    average_score: number;
    average_time_spent: string;
  }> {
    const allProgress = await this.moduleProgressRepo.find({
      where: { module_id: moduleId },
    });

    if (allProgress.length === 0) {
      return {
        total_students: 0,
        completed_count: 0,
        in_progress_count: 0,
        average_progress: 0,
        average_score: 0,
        average_time_spent: '00:00:00',
      };
    }

    const completedCount = allProgress.filter(
      (p) => p.status === ProgressStatusEnum.COMPLETED,
    ).length;

    const inProgressCount = allProgress.filter(
      (p) => p.status === ProgressStatusEnum.IN_PROGRESS,
    ).length;

    const totalProgress = allProgress.reduce((sum, p) => sum + p.progress_percentage, 0);
    const averageProgress = totalProgress / allProgress.length;

    const validScores = allProgress.filter((p) => p.average_score !== null && p.average_score !== undefined);
    const totalScore = validScores.reduce((sum, p) => sum + (p.average_score || 0), 0);
    const averageScore = validScores.length > 0 ? totalScore / validScores.length : 0;

    return {
      total_students: allProgress.length,
      completed_count: completedCount,
      in_progress_count: inProgressCount,
      average_progress: Number(averageProgress.toFixed(2)),
      average_score: Number(averageScore.toFixed(2)),
      average_time_spent: '00:00:00', // TODO: Calcular promedio real de intervalos
    };
  }

  /**
   * Obtiene resumen de progreso de un usuario (completion rates, módulos activos)
   * @param userId - ID del usuario
   * @returns Resumen de progreso del usuario
   */
  async getUserProgressSummary(userId: string): Promise<{
    total_modules: number;
    completed_modules: number;
    in_progress_modules: number;
    completion_rate: number;
    total_xp_earned: number;
    total_ml_coins_earned: number;
    total_time_spent: string;
  }> {
    const allProgress = await this.moduleProgressRepo.find({
      where: { user_id: userId },
    });

    const completedModules = allProgress.filter(
      (p) => p.status === ProgressStatusEnum.COMPLETED,
    ).length;

    const inProgressModules = allProgress.filter(
      (p) => p.status === ProgressStatusEnum.IN_PROGRESS,
    ).length;

    const completionRate =
      allProgress.length > 0 ? (completedModules / allProgress.length) * 100 : 0;

    const totalXp = allProgress.reduce((sum, p) => sum + p.total_xp_earned, 0);
    const totalCoins = allProgress.reduce((sum, p) => sum + p.total_ml_coins_earned, 0);

    return {
      total_modules: allProgress.length,
      completed_modules: completedModules,
      in_progress_modules: inProgressModules,
      completion_rate: Number(completionRate.toFixed(2)),
      total_xp_earned: totalXp,
      total_ml_coins_earned: totalCoins,
      total_time_spent: '00:00:00', // TODO: Sumar intervalos
    };
  }

  /**
   * Obtiene módulos en progreso de un usuario
   * @param userId - ID del usuario
   * @returns Lista de módulos actualmente en progreso
   */
  async findInProgress(userId: string): Promise<ModuleProgress[]> {
    return await this.moduleProgressRepo.find({
      where: {
        user_id: userId,
        status: ProgressStatusEnum.IN_PROGRESS,
      },
      order: { last_accessed_at: 'DESC' },
    });
  }

  /**
   * Genera ruta de aprendizaje personalizada basada en progreso
   * @param userId - ID del usuario
   * @returns Recomendaciones de próximos módulos
   */
  async calculateLearningPath(userId: string): Promise<{
    recommended_modules: string[];
    reasoning: string;
    difficulty_adjustment: string;
  }> {
    const allProgress = await this.moduleProgressRepo.find({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
    });

    // Lógica simple de recomendación
    const completedCount = allProgress.filter(
      (p) => p.status === ProgressStatusEnum.COMPLETED,
    ).length;

    const averageScore = allProgress.length > 0
      ? allProgress.reduce((sum, p) => sum + (p.average_score || 0), 0) / allProgress.length
      : 0;

    let difficultyAdjustment = 'maintain';
    let reasoning = 'Continue with current difficulty level';

    if (averageScore >= 90) {
      difficultyAdjustment = 'increase';
      reasoning = 'High performance detected, ready for more challenging content';
    } else if (averageScore < 60) {
      difficultyAdjustment = 'decrease';
      reasoning = 'Additional practice recommended, adjusting to easier modules';
    }

    return {
      recommended_modules: [], // TODO: Implementar lógica de recomendación real
      reasoning,
      difficulty_adjustment: difficultyAdjustment,
    };
  }
}
