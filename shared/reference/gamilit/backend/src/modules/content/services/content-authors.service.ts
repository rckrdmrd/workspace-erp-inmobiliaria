import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentAuthor } from '../entities';

/**
 * ContentAuthorsService
 *
 * @description Gestión de autores de contenido educativo.
 *
 * Funcionalidades:
 * - CRUD de perfiles de autores
 * - Validación de user_id único
 * - Tracking de contenido creado vs publicado
 * - Sistema de ratings y verificación
 * - Autores destacados (featured)
 * - Filtrado por áreas de expertise
 *
 * @see ContentAuthor entity
 */
@Injectable()
export class ContentAuthorsService {
  constructor(
    @InjectRepository(ContentAuthor, 'content')
    private readonly authorRepo: Repository<ContentAuthor>,
  ) {}

  /**
   * Crea un nuevo perfil de autor
   * @param userId - ID del usuario
   * @param displayName - Nombre público del autor
   * @param bio - Biografía (opcional)
   * @param expertiseAreas - Áreas de expertise (opcional)
   * @returns Autor creado
   * @throws ConflictException si el usuario ya tiene un perfil de autor
   */
  async create(
    userId: string,
    displayName: string,
    bio?: string,
    expertiseAreas?: string[],
  ): Promise<ContentAuthor> {
    // Verificar que el usuario no tenga ya un perfil de autor
    const existing = await this.authorRepo.findOne({
      where: { user_id: userId },
    });

    if (existing) {
      throw new ConflictException('User already has an author profile');
    }

    const author = this.authorRepo.create({
      user_id: userId,
      display_name: displayName,
      bio,
      expertise_areas: expertiseAreas || [],
      total_content_created: 0,
      total_content_published: 0,
      is_featured: false,
      is_verified: false,
    });

    return await this.authorRepo.save(author);
  }

  /**
   * Obtiene todos los autores
   * @param filters - Filtros opcionales
   * @returns Lista de autores
   */
  async findAll(filters?: {
    is_featured?: boolean;
    is_verified?: boolean;
    expertise_area?: string;
  }): Promise<ContentAuthor[]> {
    const query = this.authorRepo.createQueryBuilder('a');

    if (filters?.is_featured !== undefined) {
      query.andWhere('a.is_featured = :featured', { featured: filters.is_featured });
    }

    if (filters?.is_verified !== undefined) {
      query.andWhere('a.is_verified = :verified', { verified: filters.is_verified });
    }

    if (filters?.expertise_area) {
      query.andWhere(':expertise = ANY(a.expertise_areas)', { expertise: filters.expertise_area });
    }

    return await query
      .orderBy('a.average_rating', 'DESC', 'NULLS LAST')
      .addOrderBy('a.total_content_published', 'DESC')
      .getMany();
  }

  /**
   * Obtiene un autor por ID
   * @param id - ID del autor
   * @returns Autor encontrado
   * @throws NotFoundException si no existe
   */
  async findById(id: string): Promise<ContentAuthor> {
    const author = await this.authorRepo.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`ContentAuthor with ID ${id} not found`);
    }

    return author;
  }

  /**
   * Obtiene un autor por user_id
   * @param userId - ID del usuario
   * @returns Autor encontrado
   * @throws NotFoundException si no existe
   */
  async findByUserId(userId: string): Promise<ContentAuthor> {
    const author = await this.authorRepo.findOne({
      where: { user_id: userId },
    });

    if (!author) {
      throw new NotFoundException(`Author profile not found for user ${userId}`);
    }

    return author;
  }

  /**
   * Obtiene autores destacados (featured)
   * @param limit - Límite de resultados
   * @returns Lista de autores destacados
   */
  async findFeatured(limit: number = 10): Promise<ContentAuthor[]> {
    return await this.authorRepo.find({
      where: { is_featured: true },
      order: { average_rating: 'DESC', total_content_published: 'DESC' },
      take: limit,
    });
  }

  /**
   * Obtiene autores verificados
   * @param limit - Límite de resultados
   * @returns Lista de autores verificados
   */
  async findVerified(limit?: number): Promise<ContentAuthor[]> {
    const query = this.authorRepo
      .createQueryBuilder('a')
      .where('a.is_verified = :verified', { verified: true })
      .orderBy('a.average_rating', 'DESC', 'NULLS LAST')
      .addOrderBy('a.total_content_published', 'DESC');

    if (limit) {
      query.take(limit);
    }

    return await query.getMany();
  }

  /**
   * Obtiene top autores por rating
   * @param limit - Número de autores a retornar
   * @returns Lista de autores ordenados por rating
   */
  async findTopRated(limit: number = 10): Promise<ContentAuthor[]> {
    return await this.authorRepo.find({
      where: { average_rating: (await this.authorRepo.findOne({ order: { average_rating: 'DESC' } }))?.average_rating },
      order: { average_rating: 'DESC', total_content_published: 'DESC' },
      take: limit,
    });
  }

  /**
   * Busca autores por área de expertise
   * @param area - Área de expertise
   * @returns Lista de autores
   */
  async findByExpertise(area: string): Promise<ContentAuthor[]> {
    return await this.authorRepo
      .createQueryBuilder('a')
      .where(':expertise = ANY(a.expertise_areas)', { expertise: area })
      .orderBy('a.average_rating', 'DESC', 'NULLS LAST')
      .addOrderBy('a.total_content_published', 'DESC')
      .getMany();
  }

  /**
   * Actualiza un perfil de autor
   * @param id - ID del autor
   * @param data - Datos a actualizar
   * @returns Autor actualizado
   * @throws NotFoundException si no existe
   */
  async update(
    id: string,
    data: Partial<ContentAuthor>,
  ): Promise<ContentAuthor> {
    const author = await this.findById(id);

    // Campos actualizables
    Object.assign(author, {
      display_name: data.display_name ?? author.display_name,
      bio: data.bio ?? author.bio,
      expertise_areas: data.expertise_areas ?? author.expertise_areas,
    });

    return await this.authorRepo.save(author);
  }

  /**
   * Incrementa el contador de contenido creado
   * @param userId - ID del usuario
   * @returns Autor actualizado
   */
  async incrementContentCreated(userId: string): Promise<ContentAuthor> {
    const author = await this.findByUserId(userId);
    author.total_content_created += 1;
    return await this.authorRepo.save(author);
  }

  /**
   * Incrementa el contador de contenido publicado
   * @param userId - ID del usuario
   * @returns Autor actualizado
   */
  async incrementContentPublished(userId: string): Promise<ContentAuthor> {
    const author = await this.findByUserId(userId);
    author.total_content_published += 1;
    return await this.authorRepo.save(author);
  }

  /**
   * Actualiza el rating promedio del autor
   * @param id - ID del autor
   * @param newRating - Nuevo rating promedio
   * @returns Autor actualizado
   * @throws BadRequestException si el rating es inválido
   */
  async updateRating(id: string, newRating: number): Promise<ContentAuthor> {
    if (newRating < 0 || newRating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }

    const author = await this.findById(id);
    author.average_rating = newRating;
    return await this.authorRepo.save(author);
  }

  /**
   * Marca un autor como destacado
   * @param id - ID del autor
   * @param featured - true para destacar, false para quitar
   * @returns Autor actualizado
   */
  async setFeatured(id: string, featured: boolean): Promise<ContentAuthor> {
    const author = await this.findById(id);
    author.is_featured = featured;
    return await this.authorRepo.save(author);
  }

  /**
   * Marca un autor como verificado
   * @param id - ID del autor
   * @param verified - true para verificar, false para quitar
   * @returns Autor actualizado
   */
  async setVerified(id: string, verified: boolean): Promise<ContentAuthor> {
    const author = await this.findById(id);
    author.is_verified = verified;
    return await this.authorRepo.save(author);
  }

  /**
   * Elimina un perfil de autor
   * @param id - ID del autor
   * @throws NotFoundException si no existe
   */
  async delete(id: string): Promise<void> {
    const author = await this.findById(id);
    await this.authorRepo.remove(author);
  }

  /**
   * Obtiene estadísticas generales de autores
   * @returns Estadísticas agregadas
   */
  async getStats(): Promise<{
    total: number;
    verified: number;
    featured: number;
    with_content: number;
    average_rating: number;
  }> {
    const total = await this.authorRepo.count();
    const verified = await this.authorRepo.count({ where: { is_verified: true } });
    const featured = await this.authorRepo.count({ where: { is_featured: true } });

    const withContent = await this.authorRepo
      .createQueryBuilder('a')
      .where('a.total_content_published > 0')
      .getCount();

    const result = await this.authorRepo
      .createQueryBuilder('a')
      .select('AVG(a.average_rating)', 'avg')
      .where('a.average_rating IS NOT NULL')
      .getRawOne();

    return {
      total,
      verified,
      featured,
      with_content: withContent,
      average_rating: result?.avg ? parseFloat(result.avg) : 0,
    };
  }
}
