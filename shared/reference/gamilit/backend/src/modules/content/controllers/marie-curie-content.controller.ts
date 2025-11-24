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
import { MarieCurieContentService } from '../services';
import { CreateMarieCurieContentDto, MarieCurieContentResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * MarieCurieContentController
 *
 * @description Gestión de contenido educativo sobre Marie Curie.
 * Endpoints para CRUD, filtrado, publicación y contenido destacado.
 *
 * @route /api/v1/content/marie-curie
 */
@ApiTags('Content Management - Marie Curie')
@Controller(extractBasePath(API_ROUTES.CONTENT.BASE))
export class MarieCurieContentController {
  constructor(private readonly contentService: MarieCurieContentService) {}

  /**
   * GET /content/marie-curie - Obtiene todo el contenido con filtros
   */
  @Get('marie-curie')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all Marie Curie content',
    description: 'Obtiene todo el contenido sobre Marie Curie con filtro opcional por dificultad',
  })
  @ApiQuery({ name: 'difficulty', required: false, description: 'Nivel de dificultad (beginner, intermediate, advanced, etc.)' })
  @ApiResponse({ status: 200, description: 'Lista de contenido obtenida exitosamente', type: [MarieCurieContentResponseDto] })
  async findAll(@Query('difficulty') difficulty?: string) {
    return await this.contentService.findAll(difficulty);
  }

  /**
   * GET /content/marie-curie/:id - Obtiene contenido por ID
   */
  @Get('marie-curie/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Marie Curie content by ID',
    description: 'Obtiene los detalles completos de un contenido específico',
  })
  @ApiParam({ name: 'id', description: 'ID del contenido (UUID)' })
  @ApiResponse({ status: 200, description: 'Contenido obtenido exitosamente', type: MarieCurieContentResponseDto })
  @ApiResponse({ status: 404, description: 'Contenido no encontrado' })
  async findById(@Param('id') id: string) {
    return await this.contentService.findById(id);
  }

  /**
   * GET /content/marie-curie/category/:category - Obtiene contenido por categoría
   */
  @Get('marie-curie/category/:category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get content by category',
    description: 'Obtiene contenido de una categoría específica (biography, discoveries, nobel_prizes, etc.)',
  })
  @ApiParam({ name: 'category', description: 'Categoría del contenido' })
  @ApiResponse({ status: 200, description: 'Contenido obtenido exitosamente', type: [MarieCurieContentResponseDto] })
  async findByCategory(@Param('category') category: string) {
    return await this.contentService.findByCategory(category);
  }

  /**
   * POST /content/marie-curie - Crea nuevo contenido (Admin only)
   */
  @Post('marie-curie')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Marie Curie content',
    description: 'Crea nuevo contenido sobre Marie Curie (requiere permisos de administrador)',
  })
  @ApiResponse({ status: 201, description: 'Contenido creado exitosamente', type: MarieCurieContentResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateMarieCurieContentDto) {
    return await this.contentService.create(dto);
  }

  /**
   * PATCH /content/marie-curie/:id - Actualiza contenido (Admin only)
   */
  @Patch('marie-curie/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Marie Curie content',
    description: 'Actualiza contenido existente (requiere permisos de administrador)',
  })
  @ApiParam({ name: 'id', description: 'ID del contenido (UUID)' })
  @ApiResponse({ status: 200, description: 'Contenido actualizado exitosamente', type: MarieCurieContentResponseDto })
  @ApiResponse({ status: 404, description: 'Contenido no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMarieCurieContentDto>,
  ) {
    return await this.contentService.update(id, dto);
  }

  /**
   * DELETE /content/marie-curie/:id - Elimina contenido (Admin only)
   */
  @Delete('marie-curie/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete Marie Curie content',
    description: 'Elimina contenido del sistema (requiere permisos de administrador)',
  })
  @ApiParam({ name: 'id', description: 'ID del contenido (UUID)' })
  @ApiResponse({ status: 204, description: 'Contenido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Contenido no encontrado' })
  async delete(@Param('id') id: string) {
    await this.contentService.delete(id);
  }

  /**
   * POST /content/marie-curie/:id/publish - Publica contenido (Admin only)
   */
  @Post('marie-curie/:id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Publish Marie Curie content',
    description: 'Cambia el estado del contenido a publicado (draft → published)',
  })
  @ApiParam({ name: 'id', description: 'ID del contenido (UUID)' })
  @ApiResponse({ status: 200, description: 'Contenido publicado exitosamente', type: MarieCurieContentResponseDto })
  @ApiResponse({ status: 404, description: 'Contenido no encontrado' })
  async publish(@Param('id') id: string) {
    return await this.contentService.publish(id);
  }

  /**
   * GET /content/marie-curie/published - Obtiene todo el contenido publicado
   */
  @Get('marie-curie/published')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get published content',
    description: 'Obtiene todo el contenido publicado sobre Marie Curie',
  })
  @ApiResponse({ status: 200, description: 'Contenido publicado obtenido exitosamente', type: [MarieCurieContentResponseDto] })
  async getPublishedContent() {
    return await this.contentService.getPublishedContent();
  }

  /**
   * GET /content/marie-curie/featured - Obtiene contenido destacado
   */
  @Get('marie-curie/featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get featured content',
    description: 'Obtiene el contenido destacado (featured) sobre Marie Curie',
  })
  @ApiResponse({ status: 200, description: 'Contenido destacado obtenido exitosamente', type: [MarieCurieContentResponseDto] })
  async getFeaturedContent() {
    return await this.contentService.getFeaturedContent();
  }
}
