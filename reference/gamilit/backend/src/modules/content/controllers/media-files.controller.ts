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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MediaFilesService } from '../services';
import { CreateMediaFileDto, MediaFileResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { ProcessingStatusEnum } from '@shared/constants/enums.constants';

/**
 * MediaFilesController
 *
 * @description Gestión de archivos multimedia del sistema.
 * Endpoints para upload, CRUD, filtrado, búsqueda, procesamiento y estadísticas.
 *
 * @route /api/v1/content/media-files
 */
@ApiTags('Content Management - Media Files')
@Controller(extractBasePath(API_ROUTES.CONTENT.BASE))
export class MediaFilesController {
  constructor(private readonly mediaService: MediaFilesService) {}

  /**
   * GET /content/media-files - Obtiene todos los archivos con filtros
   */
  @Get('media-files')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all media files',
    description: 'Obtiene todos los archivos multimedia con filtros opcionales por tipo y estado',
  })
  @ApiQuery({ name: 'fileType', required: false, description: 'Tipo de archivo (image, video, audio, document, interactive, animation)' })
  @ApiQuery({ name: 'status', required: false, description: 'Estado de procesamiento (uploading, processing, ready, error, optimizing)' })
  @ApiResponse({ status: 200, description: 'Lista de archivos obtenida exitosamente', type: [MediaFileResponseDto] })
  async findAll(
    @Query('fileType') fileType?: string,
    @Query('status') status?: string,
  ) {
    return await this.mediaService.findAll(fileType, status);
  }

  /**
   * GET /content/media-files/:id - Obtiene un archivo por ID
   */
  @Get('media-files/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get media file by ID',
    description: 'Obtiene los detalles completos de un archivo multimedia',
  })
  @ApiParam({ name: 'id', description: 'ID del archivo (UUID)' })
  @ApiResponse({ status: 200, description: 'Archivo obtenido exitosamente', type: MediaFileResponseDto })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async findById(@Param('id') id: string) {
    return await this.mediaService.findById(id);
  }

  /**
   * POST /content/media-files - Registra un nuevo archivo (upload)
   * Note: En producción, este endpoint debe manejar multipart/form-data
   */
  @Post('media-files')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload media file',
    description: 'Registra un nuevo archivo multimedia en el sistema (requiere multipart upload)',
  })
  @ApiBody({ type: CreateMediaFileDto })
  @ApiResponse({ status: 201, description: 'Archivo registrado exitosamente', type: MediaFileResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateMediaFileDto) {
    return await this.mediaService.create(dto);
  }

  /**
   * PATCH /content/media-files/:id - Actualiza metadata de un archivo
   */
  @Patch('media-files/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update media file metadata',
    description: 'Actualiza la metadata de un archivo multimedia',
  })
  @ApiParam({ name: 'id', description: 'ID del archivo (UUID)' })
  @ApiResponse({ status: 200, description: 'Archivo actualizado exitosamente', type: MediaFileResponseDto })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMediaFileDto>,
  ) {
    return await this.mediaService.update(id, dto);
  }

  /**
   * DELETE /content/media-files/:id - Elimina un archivo del sistema
   */
  @Delete('media-files/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete media file',
    description: 'Elimina un archivo multimedia del sistema (incluye archivo físico)',
  })
  @ApiParam({ name: 'id', description: 'ID del archivo (UUID)' })
  @ApiResponse({ status: 204, description: 'Archivo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async delete(@Param('id') id: string) {
    await this.mediaService.delete(id);
  }

  /**
   * GET /content/media-files/type/:fileType - Obtiene archivos por tipo
   */
  @Get('media-files/type/:fileType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get files by type',
    description: 'Obtiene todos los archivos de un tipo específico',
  })
  @ApiParam({ name: 'fileType', description: 'Tipo de archivo (image, video, audio, document, etc.)' })
  @ApiResponse({ status: 200, description: 'Archivos obtenidos exitosamente', type: [MediaFileResponseDto] })
  async findByType(@Param('fileType') fileType: string) {
    return await this.mediaService.findByType(fileType);
  }

  /**
   * GET /content/media-files/search - Búsqueda por tags
   */
  @Get('media-files/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search files by tags',
    description: 'Busca archivos que contengan alguno de los tags especificados',
  })
  @ApiQuery({ name: 'tags', required: true, description: 'Tags a buscar (separados por coma)', example: 'marie-curie,scientist,laboratory' })
  @ApiResponse({ status: 200, description: 'Archivos encontrados exitosamente', type: [MediaFileResponseDto] })
  async findByTags(@Query('tags') tags: string) {
    const tagsArray = tags.split(',').map(t => t.trim());
    return await this.mediaService.findByTags(tagsArray);
  }

  /**
   * PATCH /content/media-files/:id/status - Actualiza estado de procesamiento
   */
  @Patch('media-files/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update processing status',
    description: 'Actualiza el estado de procesamiento de un archivo',
  })
  @ApiParam({ name: 'id', description: 'ID del archivo (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['uploading', 'processing', 'ready', 'error', 'optimizing'],
          example: 'ready',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente', type: MediaFileResponseDto })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async updateProcessingStatus(
    @Param('id') id: string,
    @Body('status') status: ProcessingStatusEnum,
  ) {
    return await this.mediaService.updateProcessingStatus(id, status);
  }

  /**
   * GET /content/media-files/stats - Obtiene estadísticas de almacenamiento
   */
  @Get('media-files/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get storage statistics',
    description: 'Obtiene estadísticas agregadas de almacenamiento (tamaño total, conteos por tipo)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      example: {
        totalFiles: 1250,
        totalSize: 10737418240,
        countsByType: {
          image: 800,
          video: 200,
          audio: 150,
          document: 100,
        },
        avgFileSize: 8589934,
      },
    },
  })
  async getFileStats() {
    return await this.mediaService.getFileStats();
  }

  /**
   * GET /content/media-files/users/:userId - Obtiene archivos subidos por usuario
   */
  @Get('media-files/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get files by uploader',
    description: 'Obtiene todos los archivos subidos por un usuario específico',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario uploader (UUID)' })
  @ApiResponse({ status: 200, description: 'Archivos obtenidos exitosamente', type: [MediaFileResponseDto] })
  async findByUploader(@Param('userId') userId: string) {
    return await this.mediaService.findByUploader(userId);
  }

  /**
   * POST /content/media-files/:id/thumbnail - Genera thumbnail para archivo
   */
  @Post('media-files/:id/thumbnail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate thumbnail',
    description: 'Genera o actualiza el thumbnail de un archivo (imágenes/videos)',
  })
  @ApiParam({ name: 'id', description: 'ID del archivo (UUID)' })
  @ApiResponse({ status: 200, description: 'Thumbnail generado exitosamente', type: MediaFileResponseDto })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async generateThumbnail(@Param('id') id: string) {
    return await this.mediaService.generateThumbnail(id);
  }

  /**
   * POST /content/media-files/:id/increment/:counterType - Incrementa contadores
   */
  @Post('media-files/:id/increment/:counterType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Increment usage counters',
    description: 'Incrementa contadores de uso, descarga o visualización',
  })
  @ApiParam({ name: 'id', description: 'ID del archivo (UUID)' })
  @ApiParam({ name: 'counterType', description: 'Tipo de contador (usage, download, view)' })
  @ApiResponse({ status: 200, description: 'Contador incrementado exitosamente', type: MediaFileResponseDto })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async incrementCounter(
    @Param('id') id: string,
    @Param('counterType') counterType: 'usage' | 'download' | 'view',
  ) {
    return await this.mediaService.incrementCounter(id, counterType);
  }
}
