import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ContentCategoriesService } from '../services';
import { CreateContentCategoryDto, UpdateContentCategoryDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ContentCategoriesController
 *
 * @description Gestión de categorías jerárquicas para contenido educativo.
 * Endpoints para CRUD de categorías, gestión de jerarquías, ordenamiento,
 * y navegación por árbol de categorías.
 *
 * @route /api/v1/content
 */
@ApiTags('Content - Categories')
@Controller(extractBasePath(API_ROUTES.CONTENT.BASE))
export class ContentCategoriesController {
  constructor(private readonly categoriesService: ContentCategoriesService) {}

  /**
   * Crea una nueva categoría
   *
   * @param dto - Datos de la categoría
   * @returns Categoría creada
   */
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create category',
    description: 'Crea una nueva categoría de contenido',
  })
  @ApiBody({ type: CreateContentCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug ya existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría padre no encontrada',
  })
  async create(@Body() dto: CreateContentCategoryDto) {
    return await this.categoriesService.create(
      dto.name,
      dto.slug,
      dto.description,
      dto.parent_category_id,
      dto.display_order,
      dto.icon,
      dto.color,
    );
  }

  /**
   * Obtiene todas las categorías
   *
   * @param includeInactive - Incluir categorías inactivas
   * @returns Lista de categorías
   */
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Obtiene todas las categorías ordenadas',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Incluir categorías inactivas',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías',
  })
  async findAll(@Query('includeInactive') includeInactive?: boolean) {
    return await this.categoriesService.findAll(includeInactive === true);
  }

  /**
   * Obtiene categorías raíz (sin padre)
   *
   * @returns Lista de categorías raíz
   */
  @Get('categories/root')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get root categories',
    description: 'Obtiene categorías de nivel superior (sin padre)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías raíz',
  })
  async findRootCategories() {
    return await this.categoriesService.findRootCategories();
  }

  /**
   * Obtiene el árbol completo de categorías
   *
   * @returns Árbol de categorías con hijos anidados
   */
  @Get('categories/tree')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category tree',
    description: 'Obtiene el árbol completo de categorías con jerarquías',
  })
  @ApiResponse({
    status: 200,
    description: 'Árbol de categorías',
    schema: {
      example: [
        {
          id: '...',
          name: 'Comprensión Lectora',
          children: [
            { id: '...', name: 'Literal', children: [] },
            { id: '...', name: 'Inferencial', children: [] },
          ],
        },
      ],
    },
  })
  async getTree() {
    return await this.categoriesService.getTree();
  }

  /**
   * Obtiene estadísticas de categorías
   *
   * @returns Estadísticas agregadas
   */
  @Get('categories/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get categories statistics',
    description: 'Obtiene estadísticas generales de categorías',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de categorías',
    schema: {
      example: {
        total: 50,
        active: 45,
        inactive: 5,
        root_categories: 10,
        with_children: 15,
      },
    },
  })
  async getStats() {
    return await this.categoriesService.getStats();
  }

  /**
   * Obtiene una categoría por ID
   *
   * @param id - ID de la categoría
   * @returns Categoría encontrada
   */
  @Get('categories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Obtiene una categoría específica por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  async findById(@Param('id') id: string) {
    return await this.categoriesService.findById(id);
  }

  /**
   * Obtiene una categoría por slug
   *
   * @param slug - Slug de la categoría
   * @returns Categoría encontrada
   */
  @Get('categories/slug/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by slug',
    description: 'Obtiene una categoría por su slug único',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug de la categoría',
    type: String,
    example: 'comprension-lectora',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  async findBySlug(@Param('slug') slug: string) {
    return await this.categoriesService.findBySlug(slug);
  }

  /**
   * Obtiene subcategorías de una categoría
   *
   * @param parentId - ID de la categoría padre
   * @returns Lista de subcategorías
   */
  @Get('categories/:parentId/children')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get subcategories',
    description: 'Obtiene las subcategorías de una categoría',
  })
  @ApiParam({
    name: 'parentId',
    description: 'ID de la categoría padre',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de subcategorías',
  })
  async findChildren(@Param('parentId') parentId: string) {
    return await this.categoriesService.findChildren(parentId);
  }

  /**
   * Obtiene el breadcrumb (ruta) de una categoría
   *
   * @param id - ID de la categoría
   * @returns Array de categorías desde la raíz hasta la actual
   */
  @Get('categories/:id/breadcrumb')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category breadcrumb',
    description: 'Obtiene la ruta completa desde la raíz hasta la categoría',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb de la categoría',
    schema: {
      example: [
        { id: '...', name: 'Comprensión Lectora' },
        { id: '...', name: 'Inferencial' },
        { id: '...', name: 'Análisis de Personajes' },
      ],
    },
  })
  async getBreadcrumb(@Param('id') id: string) {
    return await this.categoriesService.getBreadcrumb(id);
  }

  /**
   * Actualiza una categoría
   *
   * @param id - ID de la categoría
   * @param dto - Datos a actualizar
   * @returns Categoría actualizada
   */
  @Patch('categories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update category',
    description: 'Actualiza una categoría existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: String,
  })
  @ApiBody({ type: UpdateContentCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (ciclo en jerarquía, etc.)',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug ya existe',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateContentCategoryDto) {
    return await this.categoriesService.update(id, dto);
  }

  /**
   * Actualiza el orden de visualización de una categoría
   *
   * @param id - ID de la categoría
   * @param order - Nuevo orden
   * @returns Categoría actualizada
   */
  @Patch('categories/:id/order')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update category order',
    description: 'Actualiza el orden de visualización de una categoría',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: String,
  })
  @ApiQuery({
    name: 'order',
    required: true,
    description: 'Nuevo orden',
    type: Number,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Orden actualizado',
  })
  async updateOrder(@Param('id') id: string, @Query('order') order: number) {
    return await this.categoriesService.updateOrder(id, Number(order));
  }

  /**
   * Activa o desactiva una categoría
   *
   * @param id - ID de la categoría
   * @param active - true para activar, false para desactivar
   * @returns Categoría actualizada
   */
  @Patch('categories/:id/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set category active status',
    description: 'Activa o desactiva una categoría (soft delete)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: String,
  })
  @ApiQuery({
    name: 'active',
    required: true,
    description: 'true para activar, false para desactivar',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
  })
  async setActive(@Param('id') id: string, @Query('active') active: boolean) {
    return await this.categoriesService.setActive(id, active === true);
  }

  /**
   * Mueve una categoría a otro padre
   *
   * @param id - ID de la categoría a mover
   * @param newParentId - ID del nuevo padre (null para raíz)
   * @returns Categoría actualizada
   */
  @Patch('categories/:id/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Move category',
    description: 'Mueve una categoría a otro padre en la jerarquía',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría a mover',
    type: String,
  })
  @ApiQuery({
    name: 'newParentId',
    required: false,
    description: 'ID del nuevo padre (omitir para convertir en raíz)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría movida',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede mover (crearía un ciclo)',
  })
  async moveCategory(@Param('id') id: string, @Query('newParentId') newParentId?: string) {
    return await this.categoriesService.moveCategory(id, newParentId || null);
  }

  /**
   * Elimina una categoría
   *
   * @param id - ID de la categoría
   */
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete category',
    description: 'Elimina una categoría (solo si no tiene subcategorías)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Categoría eliminada',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar (tiene subcategorías)',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  async delete(@Param('id') id: string) {
    await this.categoriesService.delete(id);
  }
}
