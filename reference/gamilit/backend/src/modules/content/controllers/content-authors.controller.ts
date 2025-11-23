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
import { ContentAuthorsService } from '../services';
import { CreateContentAuthorDto, UpdateContentAuthorDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ContentAuthorsController
 *
 * @description Gestión de perfiles de autores de contenido educativo.
 * Endpoints para CRUD de autores, gestión de ratings, verificación,
 * featured status, y estadísticas.
 *
 * @route /api/v1/content
 */
@ApiTags('Content - Authors')
@Controller(extractBasePath(API_ROUTES.CONTENT.BASE))
export class ContentAuthorsController {
  constructor(private readonly authorsService: ContentAuthorsService) {}

  /**
   * Crea un nuevo perfil de autor
   *
   * @param dto - Datos del autor
   * @returns Autor creado
   */
  @Post('authors')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create author profile',
    description: 'Crea un nuevo perfil de autor de contenido',
  })
  @ApiBody({ type: CreateContentAuthorDto })
  @ApiResponse({
    status: 201,
    description: 'Autor creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuario ya tiene un perfil de autor',
  })
  async create(@Body() dto: CreateContentAuthorDto) {
    return await this.authorsService.create(
      dto.user_id,
      dto.display_name,
      dto.bio,
      dto.expertise_areas,
    );
  }

  /**
   * Obtiene todos los autores con filtros opcionales
   *
   * @param is_featured - Filtrar por destacados
   * @param is_verified - Filtrar por verificados
   * @param expertise_area - Filtrar por área de expertise
   * @returns Lista de autores
   */
  @Get('authors')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all authors',
    description: 'Obtiene todos los autores con filtros opcionales',
  })
  @ApiQuery({
    name: 'is_featured',
    required: false,
    description: 'Filtrar por destacados',
    type: Boolean,
  })
  @ApiQuery({
    name: 'is_verified',
    required: false,
    description: 'Filtrar por verificados',
    type: Boolean,
  })
  @ApiQuery({
    name: 'expertise_area',
    required: false,
    description: 'Filtrar por área de expertise',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de autores',
  })
  async findAll(
    @Query('is_featured') is_featured?: boolean,
    @Query('is_verified') is_verified?: boolean,
    @Query('expertise_area') expertise_area?: string,
  ) {
    return await this.authorsService.findAll({
      is_featured: is_featured !== undefined ? is_featured : undefined,
      is_verified: is_verified !== undefined ? is_verified : undefined,
      expertise_area,
    });
  }

  /**
   * Obtiene autores destacados
   *
   * @param limit - Número máximo de autores a retornar
   * @returns Lista de autores destacados
   */
  @Get('authors/featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get featured authors',
    description: 'Obtiene autores destacados ordenados por rating',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de autores',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de autores destacados',
  })
  async findFeatured(@Query('limit') limit?: number) {
    return await this.authorsService.findFeatured(limit ? Number(limit) : 10);
  }

  /**
   * Obtiene autores verificados
   *
   * @param limit - Número máximo de autores a retornar
   * @returns Lista de autores verificados
   */
  @Get('authors/verified')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get verified authors',
    description: 'Obtiene autores verificados ordenados por rating',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de autores',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de autores verificados',
  })
  async findVerified(@Query('limit') limit?: number) {
    return await this.authorsService.findVerified(limit ? Number(limit) : undefined);
  }

  /**
   * Obtiene top autores por rating
   *
   * @param limit - Número máximo de autores a retornar
   * @returns Lista de top autores
   */
  @Get('authors/top-rated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get top rated authors',
    description: 'Obtiene autores mejor calificados',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de autores',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de top autores',
  })
  async findTopRated(@Query('limit') limit?: number) {
    return await this.authorsService.findTopRated(limit ? Number(limit) : 10);
  }

  /**
   * Obtiene estadísticas generales de autores
   *
   * @returns Estadísticas agregadas
   */
  @Get('authors/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get authors statistics',
    description: 'Obtiene estadísticas generales de autores',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de autores',
    schema: {
      example: {
        total: 150,
        verified: 45,
        featured: 20,
        with_content: 120,
        average_rating: 4.2,
      },
    },
  })
  async getStats() {
    return await this.authorsService.getStats();
  }

  /**
   * Busca autores por área de expertise
   *
   * @param area - Área de expertise
   * @returns Lista de autores
   */
  @Get('authors/expertise/:area')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get authors by expertise',
    description: 'Busca autores por área de expertise',
  })
  @ApiParam({
    name: 'area',
    description: 'Área de expertise',
    type: String,
    example: 'Comprensión Lectora',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de autores con esa expertise',
  })
  async findByExpertise(@Param('area') area: string) {
    return await this.authorsService.findByExpertise(area);
  }

  /**
   * Obtiene un autor por ID
   *
   * @param id - ID del autor
   * @returns Autor encontrado
   */
  @Get('authors/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get author by ID',
    description: 'Obtiene un autor específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del autor',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Autor encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Autor no encontrado',
  })
  async findById(@Param('id') id: string) {
    return await this.authorsService.findById(id);
  }

  /**
   * Obtiene un autor por user_id
   *
   * @param userId - ID del usuario
   * @returns Autor encontrado
   */
  @Get('authors/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get author by user ID',
    description: 'Obtiene el perfil de autor de un usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de autor encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de autor no encontrado',
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.authorsService.findByUserId(userId);
  }

  /**
   * Actualiza un perfil de autor
   *
   * @param id - ID del autor
   * @param dto - Datos a actualizar
   * @returns Autor actualizado
   */
  @Patch('authors/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update author',
    description: 'Actualiza un perfil de autor',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del autor',
    type: String,
  })
  @ApiBody({ type: UpdateContentAuthorDto })
  @ApiResponse({
    status: 200,
    description: 'Autor actualizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Autor no encontrado',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateContentAuthorDto) {
    return await this.authorsService.update(id, dto);
  }

  /**
   * Incrementa contador de contenido creado
   *
   * @param userId - ID del usuario
   * @returns Autor actualizado
   */
  @Patch('authors/user/:userId/increment-created')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Increment content created',
    description: 'Incrementa el contador de contenido creado',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Contador incrementado',
  })
  async incrementContentCreated(@Param('userId') userId: string) {
    return await this.authorsService.incrementContentCreated(userId);
  }

  /**
   * Incrementa contador de contenido publicado
   *
   * @param userId - ID del usuario
   * @returns Autor actualizado
   */
  @Patch('authors/user/:userId/increment-published')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Increment content published',
    description: 'Incrementa el contador de contenido publicado',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Contador incrementado',
  })
  async incrementContentPublished(@Param('userId') userId: string) {
    return await this.authorsService.incrementContentPublished(userId);
  }

  /**
   * Actualiza el rating de un autor
   *
   * @param id - ID del autor
   * @param rating - Nuevo rating (0-5)
   * @returns Autor actualizado
   */
  @Patch('authors/:id/rating')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update author rating',
    description: 'Actualiza el rating promedio del autor',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del autor',
    type: String,
  })
  @ApiQuery({
    name: 'rating',
    required: true,
    description: 'Nuevo rating (0-5)',
    type: Number,
    example: 4.5,
  })
  @ApiResponse({
    status: 200,
    description: 'Rating actualizado',
  })
  @ApiResponse({
    status: 400,
    description: 'Rating inválido (debe estar entre 0 y 5)',
  })
  async updateRating(@Param('id') id: string, @Query('rating') rating: number) {
    return await this.authorsService.updateRating(id, Number(rating));
  }

  /**
   * Marca/desmarca autor como destacado
   *
   * @param id - ID del autor
   * @param featured - true para destacar, false para quitar
   * @returns Autor actualizado
   */
  @Patch('authors/:id/featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set author featured status',
    description: 'Marca o desmarca un autor como destacado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del autor',
    type: String,
  })
  @ApiQuery({
    name: 'featured',
    required: true,
    description: 'true para destacar, false para quitar',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
  })
  async setFeatured(@Param('id') id: string, @Query('featured') featured: boolean) {
    return await this.authorsService.setFeatured(id, featured === true);
  }

  /**
   * Marca/desmarca autor como verificado
   *
   * @param id - ID del autor
   * @param verified - true para verificar, false para quitar
   * @returns Autor actualizado
   */
  @Patch('authors/:id/verified')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set author verified status',
    description: 'Marca o desmarca un autor como verificado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del autor',
    type: String,
  })
  @ApiQuery({
    name: 'verified',
    required: true,
    description: 'true para verificar, false para quitar',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
  })
  async setVerified(@Param('id') id: string, @Query('verified') verified: boolean) {
    return await this.authorsService.setVerified(id, verified === true);
  }

  /**
   * Elimina un perfil de autor
   *
   * @param id - ID del autor
   */
  @Delete('authors/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete author',
    description: 'Elimina un perfil de autor',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del autor',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Autor eliminado',
  })
  @ApiResponse({
    status: 404,
    description: 'Autor no encontrado',
  })
  async delete(@Param('id') id: string) {
    await this.authorsService.delete(id);
  }
}
