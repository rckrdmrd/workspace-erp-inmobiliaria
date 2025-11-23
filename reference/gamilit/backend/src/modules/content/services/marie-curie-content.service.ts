import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarieCurieContent } from '../entities';
import { CreateMarieCurieContentDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants';
import { ContentStatusEnum } from '@shared/constants/enums.constants';

/**
 * MarieCurieContentService
 *
 * @description Gestión completa del contenido educativo sobre Marie Curie.
 *              - CRUD de contenido curado
 *              - Filtrado por dificultad y categoría
 *              - Workflow de publicación (draft → published)
 *              - Contenido destacado (featured)
 */
@Injectable()
export class MarieCurieContentService {
  constructor(
    @InjectRepository(MarieCurieContent, 'content')
    private readonly contentRepo: Repository<MarieCurieContent>,
  ) {}

  /**
   * Crea nuevo contenido sobre Marie Curie
   *
   * @param dto - Datos del contenido
   * @returns Contenido creado
   */
  async create(dto: CreateMarieCurieContentDto): Promise<MarieCurieContent> {
    const content = this.contentRepo.create(dto);
    return await this.contentRepo.save(content);
  }

  /**
   * Obtiene todo el contenido con filtro opcional por dificultad
   *
   * @param difficulty - Nivel de dificultad (opcional)
   * @returns Lista de contenido
   */
  async findAll(difficulty?: string): Promise<MarieCurieContent[]> {
    const query = this.contentRepo.createQueryBuilder('mc');

    if (difficulty) {
      query.andWhere('mc.difficulty_level = :difficulty', { difficulty });
    }

    return await query.orderBy('mc.created_at', 'DESC').getMany();
  }

  /**
   * Busca contenido por ID
   *
   * @param id - ID del contenido
   * @returns Contenido encontrado
   * @throws NotFoundException si no existe
   */
  async findById(id: string): Promise<MarieCurieContent> {
    const content = await this.contentRepo.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException(`Marie Curie content ${id} not found`);
    }

    return content;
  }

  /**
   * Busca contenido por categoría
   * Note: En el DDL la categoría tiene CHECK constraint con valores específicos
   *
   * @param category - Categoría del contenido (biography, discoveries, etc.)
   * @returns Lista de contenido de la categoría
   */
  async findByCategory(category: string): Promise<MarieCurieContent[]> {
    return await this.contentRepo.find({
      where: { category },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Actualiza contenido existente
   *
   * @param id - ID del contenido
   * @param dto - Datos parciales a actualizar
   * @returns Contenido actualizado
   * @throws NotFoundException si no existe
   */
  async update(id: string, dto: Partial<CreateMarieCurieContentDto>): Promise<MarieCurieContent> {
    const content = await this.findById(id);

    Object.assign(content, dto);

    return await this.contentRepo.save(content);
  }

  /**
   * Elimina contenido
   *
   * @param id - ID del contenido
   * @returns void
   * @throws NotFoundException si no existe
   */
  async delete(id: string): Promise<void> {
    const content = await this.findById(id);
    await this.contentRepo.remove(content);
  }

  /**
   * Publica un contenido (cambia status a published)
   *
   * @param id - ID del contenido
   * @returns Contenido publicado
   * @throws NotFoundException si no existe
   */
  async publish(id: string): Promise<MarieCurieContent> {
    const content = await this.findById(id);

    content.status = ContentStatusEnum.PUBLISHED;

    return await this.contentRepo.save(content);
  }

  /**
   * Obtiene todo el contenido publicado ordenado alfabéticamente
   *
   * @returns Lista de contenido publicado
   */
  async getPublishedContent(): Promise<MarieCurieContent[]> {
    return await this.contentRepo.find({
      where: { status: ContentStatusEnum.PUBLISHED },
      order: { title: 'ASC' },
    });
  }

  /**
   * Obtiene contenido destacado (featured)
   *
   * @returns Lista de contenido destacado publicado
   */
  async getFeaturedContent(): Promise<MarieCurieContent[]> {
    return await this.contentRepo.find({
      where: {
        is_featured: true,
        status: ContentStatusEnum.PUBLISHED,
      },
      order: { created_at: 'DESC' },
    });
  }
}
