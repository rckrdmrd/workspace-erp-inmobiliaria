import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ContentTemplatesService } from '../services';
import { CreateContentTemplateDto, ContentTemplateResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ContentTemplatesController
 *
 * @description Gestión de plantillas de contenido reutilizables.
 * Endpoints para CRUD, filtrado, uso y estadísticas de plantillas.
 *
 * @route /api/v1/content/templates
 */
@ApiTags('Content Management - Templates')
@Controller(extractBasePath(API_ROUTES.CONTENT.BASE))
export class ContentTemplatesController {
  constructor(private readonly templatesService: ContentTemplatesService) {}

  /**
   * GET /content/templates - Obtiene todas las plantillas con filtros opcionales
   */
  @Get('templates')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all content templates',
    description: 'Obtiene todas las plantillas de contenido con filtros opcionales por tipo y categoría',
  })
  @ApiQuery({ name: 'type', required: false, description: 'Tipo de plantilla (exercise, module, assessment, announcement, feedback)' })
  @ApiQuery({ name: 'category', required: false, description: 'Categoría de plantilla' })
  @ApiResponse({ status: 200, description: 'Lista de plantillas obtenida exitosamente', type: [ContentTemplateResponseDto] })
  async findAll(
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return await this.templatesService.findAll(type, category);
  }

  /**
   * GET /content/templates/:id - Obtiene una plantilla por ID
   */
  @Get('templates/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get template by ID',
    description: 'Obtiene los detalles completos de una plantilla específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la plantilla (UUID)' })
  @ApiResponse({ status: 200, description: 'Plantilla obtenida exitosamente', type: ContentTemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  async findById(@Param('id') id: string) {
    return await this.templatesService.findById(id);
  }

  /**
   * POST /content/templates - Crea una nueva plantilla (Admin only)
   */
  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create content template',
    description: 'Crea una nueva plantilla de contenido (requiere permisos de administrador)',
  })
  @ApiResponse({ status: 201, description: 'Plantilla creada exitosamente', type: ContentTemplateResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateContentTemplateDto) {
    return await this.templatesService.create(dto);
  }

  /**
   * PATCH /content/templates/:id - Actualiza una plantilla (Admin only)
   */
  @Patch('templates/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update content template',
    description: 'Actualiza una plantilla existente (requiere permisos de administrador)',
  })
  @ApiParam({ name: 'id', description: 'ID de la plantilla (UUID)' })
  @ApiResponse({ status: 200, description: 'Plantilla actualizada exitosamente', type: ContentTemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateContentTemplateDto>,
  ) {
    return await this.templatesService.update(id, dto);
  }

  /**
   * DELETE /content/templates/:id - Desactiva una plantilla (Admin only)
   */
  @Delete('templates/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete content template',
    description: 'Desactiva una plantilla (soft delete, marca como no pública)',
  })
  @ApiParam({ name: 'id', description: 'ID de la plantilla (UUID)' })
  @ApiResponse({ status: 200, description: 'Plantilla desactivada exitosamente', type: ContentTemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  async delete(@Param('id') id: string) {
    return await this.templatesService.delete(id);
  }

  /**
   * POST /content/templates/:id/use - Incrementa contador de uso
   */
  @Post('templates/:id/use')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Increment template usage',
    description: 'Incrementa el contador de uso de una plantilla',
  })
  @ApiParam({ name: 'id', description: 'ID de la plantilla (UUID)' })
  @ApiResponse({ status: 200, description: 'Contador incrementado exitosamente', type: ContentTemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  async incrementUsage(@Param('id') id: string) {
    return await this.templatesService.incrementUsage(id);
  }

  /**
   * GET /content/templates/type/:type - Obtiene plantillas por tipo
   */
  @Get('templates/type/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get templates by type',
    description: 'Obtiene todas las plantillas de un tipo específico',
  })
  @ApiParam({ name: 'type', description: 'Tipo de plantilla (exercise, module, assessment, announcement, feedback)' })
  @ApiResponse({ status: 200, description: 'Plantillas obtenidas exitosamente', type: [ContentTemplateResponseDto] })
  async findByType(@Param('type') type: string) {
    return await this.templatesService.findByType(type);
  }

  /**
   * GET /content/templates/category/:category - Obtiene plantillas por categoría
   */
  @Get('templates/category/:category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get templates by category',
    description: 'Obtiene todas las plantillas de una categoría específica',
  })
  @ApiParam({ name: 'category', description: 'Categoría de plantilla' })
  @ApiResponse({ status: 200, description: 'Plantillas obtenidas exitosamente', type: [ContentTemplateResponseDto] })
  async findByCategory(@Param('category') category: string) {
    return await this.templatesService.findByCategory(category);
  }

  /**
   * GET /content/templates/popular - Obtiene plantillas más usadas
   */
  @Get('templates/popular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get popular templates',
    description: 'Obtiene las plantillas más usadas del sistema',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de plantillas a retornar (default: 10)' })
  @ApiResponse({ status: 200, description: 'Plantillas populares obtenidas exitosamente', type: [ContentTemplateResponseDto] })
  async getPopularTemplates(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.templatesService.getPopularTemplates(limitNum);
  }
}
