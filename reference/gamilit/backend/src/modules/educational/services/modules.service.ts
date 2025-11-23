import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../entities';
import { DB_SCHEMAS } from '@shared/constants';
import { DifficultyLevelEnum } from '@shared/constants/enums.constants';

/**
 * ModulesService
 *
 * Servicio para gestionar módulos educativos.
 * Proporciona operaciones CRUD básicas y lógica de negocio especializada.
 */
@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module, 'educational')
    private readonly moduleRepo: Repository<Module>,
  ) {}

  /**
   * Obtener todos los módulos ordenados por índice
   * FILTRO EXPLÍCITO: Solo módulos publicados (workaround para RLS)
   */
  async findAll(): Promise<Module[]> {
    return await this.moduleRepo.find({
      where: {
        is_published: true,
        status: 'published' as any,
      },
      order: { order_index: 'ASC' },
    });
  }

  /**
   * Obtener un módulo por ID
   */
  async findById(id: string): Promise<Module | null> {
    return await this.moduleRepo.findOne({ where: { id } });
  }

  /**
   * Crear un nuevo módulo
   */
  async create(moduleData: Partial<Module>): Promise<Module> {
    const module = this.moduleRepo.create(moduleData);
    return await this.moduleRepo.save(module);
  }

  /**
   * Actualizar un módulo existente
   */
  async update(id: string, moduleData: Partial<Module>): Promise<Module | null> {
    await this.moduleRepo.update(id, moduleData);
    return await this.findById(id);
  }

  /**
   * Eliminar un módulo
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.moduleRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Obtener módulos filtrados por nivel de dificultad
   */
  async findByDifficulty(
    difficulty: DifficultyLevelEnum,
  ): Promise<Module[]> {
    return await this.moduleRepo.find({
      where: { difficulty_level: difficulty },
      order: { order_index: 'ASC' },
    });
  }

  /**
   * Obtener los módulos prerequisitos de un módulo específico
   * Retorna los módulos que deben completarse antes del módulo actual
   */
  async getPrerequisites(moduleId: string): Promise<Module[]> {
    const module = await this.findById(moduleId);
    if (!module || !module.prerequisites || module.prerequisites.length === 0) {
      return [];
    }

    return await this.moduleRepo
      .createQueryBuilder('module')
      .where('module.id IN (:...ids)', { ids: module.prerequisites })
      .orderBy('module.order_index', 'ASC')
      .getMany();
  }

  /**
   * Buscar módulos por palabra clave
   * Busca en título, subtítulo y descripción
   *
   * @param keyword - Palabra clave a buscar
   * @returns Módulos que coinciden con la búsqueda
   */
  async search(keyword: string): Promise<Module[]> {
    if (!keyword || keyword.trim().length === 0) {
      return await this.findAll();
    }

    const searchTerm = `%${keyword.toLowerCase()}%`;

    return await this.moduleRepo
      .createQueryBuilder('module')
      .where('LOWER(module.title) LIKE :searchTerm', { searchTerm })
      .orWhere('LOWER(module.subtitle) LIKE :searchTerm', { searchTerm })
      .orWhere('LOWER(module.description) LIKE :searchTerm', { searchTerm })
      .orderBy('module.order_index', 'ASC')
      .getMany();
  }

  /**
   * Obtener módulos con progreso del usuario
   *
   * @param userId - ID del usuario
   * @returns Módulos con información de progreso incluida
   */
  async getUserModules(userId: string): Promise<any[]> {
    const query = `
      SELECT
        m.id,
        m.title,
        m.description,
        m.difficulty_level as difficulty,
        m.estimated_duration_minutes as "estimatedTime",
        m.xp_reward as "xpReward",
        m.ml_coins_reward as "mlCoinsReward",
        m.order_index,
        m.thumbnail_url as icon,
        m.subjects as category,
        COALESCE(mp.progress_percentage,
          CASE
            WHEN total_ex.total > 0 THEN (CAST(completed_ex.completed AS DECIMAL) / total_ex.total) * 100
            ELSE 0
          END, 0) as progress,
        COALESCE(completed_ex.completed, 0) as "completedExercises",
        COALESCE(total_ex.total, 0) as "totalExercises",
        CASE
          WHEN mp.status = 'completed' THEN 'completed'
          WHEN mp.status = 'in_progress' THEN 'in_progress'
          WHEN completed_ex.completed > 0 THEN 'in_progress'
          WHEN mp.status IS NULL OR mp.status = 'not_started' THEN 'available'
          ELSE 'available'
        END as status
      FROM educational_content.modules m
      LEFT JOIN progress_tracking.module_progress mp
        ON m.id = mp.module_id AND mp.user_id = $1
      LEFT JOIN LATERAL (
        SELECT COUNT(*) as total
        FROM educational_content.exercises e
        WHERE e.module_id = m.id AND e.is_active = true
      ) total_ex ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(DISTINCT e.id) as completed
        FROM educational_content.exercises e
        INNER JOIN progress_tracking.exercise_attempts ea
          ON e.id = ea.exercise_id AND ea.user_id = $1
        WHERE e.module_id = m.id
          AND e.is_active = true
          AND ea.is_correct = true
      ) completed_ex ON true
      WHERE m.is_published = true
      ORDER BY m.order_index ASC
    `;

    return await this.moduleRepo.query(query, [userId]);
  }
}
