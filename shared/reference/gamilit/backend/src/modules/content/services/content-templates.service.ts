import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentTemplate } from '../entities';
import { CreateContentTemplateDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants';

/**
 * ContentTemplatesService
 *
 * @description Gestión completa de plantillas de contenido reutilizables.
 *              - CRUD de plantillas
 *              - Filtrado por tipo y categoría
 *              - Tracking de uso (usage_count)
 *              - Plantillas populares
 */
@Injectable()
export class ContentTemplatesService {
  constructor(
    @InjectRepository(ContentTemplate, 'content')
    private readonly templateRepo: Repository<ContentTemplate>,
  ) {}

  /**
   * Crea una nueva plantilla de contenido
   *
   * @param dto - Datos de la plantilla
   * @returns Plantilla creada
   */
  async create(dto: CreateContentTemplateDto): Promise<ContentTemplate> {
    const template = this.templateRepo.create(dto);
    return await this.templateRepo.save(template);
  }

  /**
   * Obtiene todas las plantillas con filtros opcionales
   *
   * @param type - Tipo de plantilla (opcional)
   * @param category - Categoría (opcional, no usado en DDL pero útil para filtros futuros)
   * @returns Lista de plantillas
   */
  async findAll(type?: string, category?: string): Promise<ContentTemplate[]> {
    const query = this.templateRepo.createQueryBuilder('t');

    if (type) {
      query.andWhere('t.template_type = :type', { type });
    }

    // Note: category no existe en DDL, pero se deja preparado para extensión futura
    // if (category) {
    //   query.andWhere('t.category = :category', { category });
    // }

    return await query.orderBy('t.usage_count', 'DESC').addOrderBy('t.name', 'ASC').getMany();
  }

  /**
   * Busca una plantilla por ID
   *
   * @param id - ID de la plantilla
   * @returns Plantilla encontrada
   * @throws NotFoundException si no existe
   */
  async findById(id: string): Promise<ContentTemplate> {
    const template = await this.templateRepo.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Content template ${id} not found`);
    }

    return template;
  }

  /**
   * Actualiza una plantilla existente
   *
   * @param id - ID de la plantilla
   * @param dto - Datos parciales a actualizar
   * @returns Plantilla actualizada
   * @throws NotFoundException si no existe
   */
  async update(id: string, dto: Partial<CreateContentTemplateDto>): Promise<ContentTemplate> {
    const template = await this.findById(id);

    Object.assign(template, dto);

    return await this.templateRepo.save(template);
  }

  /**
   * Soft delete: marca plantilla como inactiva (is_public = false, is_system_template = false)
   * Note: DDL no tiene campo is_active, pero podemos usar is_public como flag
   *
   * @param id - ID de la plantilla
   * @returns Plantilla desactivada
   * @throws NotFoundException si no existe
   */
  async delete(id: string): Promise<ContentTemplate> {
    const template = await this.findById(id);

    // Soft delete: marcamos como no pública (equivalente a desactivar)
    template.is_public = false;

    return await this.templateRepo.save(template);
  }

  /**
   * Incrementa el contador de uso de una plantilla
   *
   * @param id - ID de la plantilla
   * @returns Plantilla con contador actualizado
   * @throws NotFoundException si no existe
   */
  async incrementUsage(id: string): Promise<ContentTemplate> {
    const template = await this.findById(id);

    template.usage_count += 1;

    return await this.templateRepo.save(template);
  }

  /**
   * Busca plantillas por tipo
   *
   * @param templateType - Tipo de plantilla (exercise, module, assessment, announcement, feedback)
   * @returns Lista de plantillas del tipo especificado
   */
  async findByType(templateType: string): Promise<ContentTemplate[]> {
    return await this.templateRepo.find({
      where: { template_type: templateType },
      order: { usage_count: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Busca plantillas por categoría (preparado para extensión futura)
   * Note: El DDL actual no tiene campo category, pero se deja para compatibilidad
   *
   * @param category - Categoría de plantilla
   * @returns Lista de plantillas de la categoría
   */
  async findByCategory(category: string): Promise<ContentTemplate[]> {
    // Actualmente retorna todas ya que no existe el campo category en DDL
    // Se puede extender con metadata o agregando el campo en una migración futura
    return await this.templateRepo.find({
      order: { usage_count: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Obtiene las plantillas más populares (más usadas)
   *
   * @param limit - Número máximo de plantillas a retornar (default: 10)
   * @returns Lista de plantillas más usadas
   */
  async getPopularTemplates(limit: number = 10): Promise<ContentTemplate[]> {
    return await this.templateRepo
      .createQueryBuilder('t')
      .where('t.usage_count > 0')
      .orderBy('t.usage_count', 'DESC')
      .addOrderBy('t.name', 'ASC')
      .limit(limit)
      .getMany();
  }
}
