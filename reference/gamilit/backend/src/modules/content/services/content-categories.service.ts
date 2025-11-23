import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ContentCategory } from '../entities';

/**
 * ContentCategoriesService
 *
 * @description Gestión de categorías jerárquicas para contenido.
 *
 * Funcionalidades:
 * - CRUD de categorías
 * - Gestión de jerarquías (parent-child)
 * - Validación de slugs únicos
 * - Categorías raíz (sin parent)
 * - Subcategorías (con parent)
 * - Soft delete (is_active)
 * - Ordenamiento personalizado (display_order)
 *
 * @see ContentCategory entity
 */
@Injectable()
export class ContentCategoriesService {
  constructor(
    @InjectRepository(ContentCategory, 'content')
    private readonly categoryRepo: Repository<ContentCategory>,
  ) {}

  /**
   * Crea una nueva categoría
   * @param name - Nombre de la categoría
   * @param slug - Slug único para URLs
   * @param description - Descripción (opcional)
   * @param parentCategoryId - ID de la categoría padre (opcional)
   * @param displayOrder - Orden de visualización (opcional)
   * @param icon - Ícono (opcional)
   * @param color - Color (opcional)
   * @returns Categoría creada
   * @throws ConflictException si el slug ya existe
   * @throws NotFoundException si la categoría padre no existe
   */
  async create(
    name: string,
    slug: string,
    description?: string,
    parentCategoryId?: string,
    displayOrder?: number,
    icon?: string,
    color?: string,
  ): Promise<ContentCategory> {
    // Verificar que el slug sea único
    const existingSlug = await this.categoryRepo.findOne({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Category with slug "${slug}" already exists`);
    }

    // Si hay parent_category_id, verificar que existe
    if (parentCategoryId) {
      const parent = await this.findById(parentCategoryId);
      if (!parent) {
        throw new NotFoundException(`Parent category with ID ${parentCategoryId} not found`);
      }
    }

    const category = this.categoryRepo.create({
      name,
      slug,
      description,
      parent_category_id: parentCategoryId,
      display_order: displayOrder ?? 0,
      is_active: true,
      icon,
      color,
    });

    return await this.categoryRepo.save(category);
  }

  /**
   * Obtiene todas las categorías
   * @param includeInactive - Incluir categorías inactivas
   * @returns Lista de categorías ordenadas
   */
  async findAll(includeInactive: boolean = false): Promise<ContentCategory[]> {
    const where = includeInactive ? {} : { is_active: true };

    return await this.categoryRepo.find({
      where,
      order: { display_order: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Obtiene categorías raíz (sin padre)
   * @returns Lista de categorías raíz
   */
  async findRootCategories(): Promise<ContentCategory[]> {
    return await this.categoryRepo.find({
      where: { parent_category_id: IsNull(), is_active: true },
      order: { display_order: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Obtiene una categoría por ID
   * @param id - ID de la categoría
   * @returns Categoría encontrada
   * @throws NotFoundException si no existe
   */
  async findById(id: string): Promise<ContentCategory> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`ContentCategory with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Obtiene una categoría por slug
   * @param slug - Slug de la categoría
   * @returns Categoría encontrada
   * @throws NotFoundException si no existe
   */
  async findBySlug(slug: string): Promise<ContentCategory> {
    const category = await this.categoryRepo.findOne({ where: { slug } });

    if (!category) {
      throw new NotFoundException(`ContentCategory with slug "${slug}" not found`);
    }

    return category;
  }

  /**
   * Obtiene subcategorías de una categoría
   * @param parentId - ID de la categoría padre
   * @returns Lista de subcategorías
   */
  async findChildren(parentId: string): Promise<ContentCategory[]> {
    return await this.categoryRepo.find({
      where: { parent_category_id: parentId, is_active: true },
      order: { display_order: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Obtiene la jerarquía completa desde una categoría hacia arriba
   * @param categoryId - ID de la categoría
   * @returns Array de categorías desde la raíz hasta la categoría actual
   */
  async getBreadcrumb(categoryId: string): Promise<ContentCategory[]> {
    const breadcrumb: ContentCategory[] = [];
    let current = await this.findById(categoryId);

    while (current) {
      breadcrumb.unshift(current);
      if (current.parent_category_id) {
        current = await this.findById(current.parent_category_id);
      } else {
        break;
      }
    }

    return breadcrumb;
  }

  /**
   * Obtiene el árbol completo de categorías
   * @returns Array de categorías raíz con sus hijos anidados
   */
  async getTree(): Promise<ContentCategory[]> {
    const allCategories = await this.findAll();

    // Crear mapa de categorías por ID
    const categoryMap = new Map<string, ContentCategory & { children: ContentCategory[] }>();

    for (const cat of allCategories) {
      categoryMap.set(cat.id, { ...cat, children: [] });
    }

    // Construir árbol
    const roots: ContentCategory[] = [];

    for (const cat of allCategories) {
      const category = categoryMap.get(cat.id)!;

      if (cat.parent_category_id) {
        const parent = categoryMap.get(cat.parent_category_id);
        if (parent) {
          parent.children.push(category);
        }
      } else {
        roots.push(category);
      }
    }

    return roots;
  }

  /**
   * Actualiza una categoría
   * @param id - ID de la categoría
   * @param data - Datos a actualizar
   * @returns Categoría actualizada
   * @throws NotFoundException si no existe
   * @throws ConflictException si el nuevo slug ya existe
   * @throws BadRequestException si se intenta establecer como su propio padre
   */
  async update(
    id: string,
    data: Partial<ContentCategory>,
  ): Promise<ContentCategory> {
    const category = await this.findById(id);

    // Validar slug único si se está cambiando
    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await this.categoryRepo.findOne({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new ConflictException(`Category with slug "${data.slug}" already exists`);
      }
    }

    // Validar que no se establezca como su propio padre
    if (data.parent_category_id === id) {
      throw new BadRequestException('A category cannot be its own parent');
    }

    // Validar que el nuevo padre existe
    if (data.parent_category_id && data.parent_category_id !== category.parent_category_id) {
      await this.findById(data.parent_category_id);
    }

    // Actualizar campos
    Object.assign(category, {
      name: data.name ?? category.name,
      slug: data.slug ?? category.slug,
      description: data.description ?? category.description,
      parent_category_id: data.parent_category_id ?? category.parent_category_id,
      display_order: data.display_order ?? category.display_order,
      is_active: data.is_active ?? category.is_active,
      icon: data.icon ?? category.icon,
      color: data.color ?? category.color,
    });

    return await this.categoryRepo.save(category);
  }

  /**
   * Actualiza el display_order de una categoría
   * @param id - ID de la categoría
   * @param newOrder - Nuevo orden
   * @returns Categoría actualizada
   */
  async updateOrder(id: string, newOrder: number): Promise<ContentCategory> {
    const category = await this.findById(id);
    category.display_order = newOrder;
    return await this.categoryRepo.save(category);
  }

  /**
   * Activa o desactiva una categoría (soft delete)
   * @param id - ID de la categoría
   * @param active - true para activar, false para desactivar
   * @returns Categoría actualizada
   */
  async setActive(id: string, active: boolean): Promise<ContentCategory> {
    const category = await this.findById(id);
    category.is_active = active;
    return await this.categoryRepo.save(category);
  }

  /**
   * Mueve una categoría a otro padre
   * @param id - ID de la categoría a mover
   * @param newParentId - ID del nuevo padre (null para raíz)
   * @returns Categoría actualizada
   * @throws BadRequestException si se crea un ciclo
   */
  async moveCategory(id: string, newParentId: string | null): Promise<ContentCategory> {
    const category = await this.findById(id);

    // Validar que no se cree un ciclo
    if (newParentId) {
      const isDescendant = await this.isDescendant(id, newParentId);
      if (isDescendant) {
        throw new BadRequestException('Cannot move category to its own descendant');
      }
    }

    category.parent_category_id = newParentId ?? undefined;
    return await this.categoryRepo.save(category);
  }

  /**
   * Verifica si una categoría es descendiente de otra
   * @param ancestorId - ID del posible ancestro
   * @param descendantId - ID del posible descendiente
   * @returns true si es descendiente
   */
  private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    let current = await this.findById(descendantId);

    while (current.parent_category_id) {
      if (current.parent_category_id === ancestorId) {
        return true;
      }
      current = await this.findById(current.parent_category_id);
    }

    return false;
  }

  /**
   * Elimina una categoría (hard delete)
   * @param id - ID de la categoría
   * @throws BadRequestException si tiene subcategorías
   */
  async delete(id: string): Promise<void> {
    const category = await this.findById(id);

    // Verificar que no tenga hijos
    const children = await this.findChildren(id);
    if (children.length > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    await this.categoryRepo.remove(category);
  }

  /**
   * Obtiene estadísticas de categorías
   * @returns Estadísticas agregadas
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    root_categories: number;
    with_children: number;
  }> {
    const total = await this.categoryRepo.count();
    const active = await this.categoryRepo.count({ where: { is_active: true } });
    const inactive = total - active;
    const root_categories = await this.categoryRepo.count({
      where: { parent_category_id: IsNull() },
    });

    const categoriesWithChildren = await this.categoryRepo
      .createQueryBuilder('c1')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('c2.parent_category_id')
          .from(ContentCategory, 'c2')
          .where('c2.parent_category_id IS NOT NULL')
          .getQuery();
        return `c1.id IN ${subQuery}`;
      })
      .getCount();

    return {
      total,
      active,
      inactive,
      root_categories,
      with_children: categoriesWithChildren,
    };
  }
}
