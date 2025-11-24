import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MediaService } from '../services';
import { UploadMediaDto, MediaResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { ProcessingStatusEnum } from '@/shared/constants/enums.constants';

/**
 * MediaController
 *
 * @description Gestión de recursos multimedia (imágenes, videos, audio, documentos).
 * Endpoints para crear, leer, actualizar y eliminar recursos multimedia,
 * así como gestionar estados de procesamiento.
 *
 * @route /api/v1/educational/media
 */
@ApiTags('Educational - Media Resources')
@Controller(extractBasePath(API_ROUTES.EDUCATIONAL.BASE))
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Obtiene todos los recursos multimedia ordenados por fecha de creación
   *
   * @returns Array de recursos multimedia ordenados
   *
   * @example
   * GET /api/v1/educational/media
   * Response: [
   *   {
   *     "id": "550e8400-e29b-41d4-a716-446655440000",
   *     "title": "Marie Curie Portrait",
   *     "media_type": "image",
   *     "url": "https://cdn.example.com/marie-curie.jpg",
   *     "processing_status": "ready",
   *     ...
   *   }
   * ]
   */
  @Get('media')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all media resources',
    description: 'Obtiene todos los recursos multimedia ordenados por fecha de creación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recursos multimedia obtenida exitosamente',
    type: [MediaResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Marie Curie Portrait',
          description: 'Retrato histórico de Marie Curie',
          alt_text: 'Fotografía de Marie Curie en su laboratorio',
          media_type: 'image',
          file_format: 'jpg',
          file_size_bytes: 2048576,
          url: 'https://cdn.example.com/marie-curie.jpg',
          thumbnail_url: 'https://cdn.example.com/marie-curie-thumb.jpg',
          cdn_url: 'https://cdn.example.com/marie-curie.jpg',
          width: 1920,
          height: 1080,
          resolution: '1080p',
          category: 'historical',
          tags: ['marie curie', 'portrait', 'historical'],
          keywords: ['curie', 'scientist', 'portrait'],
          processing_status: 'ready',
          is_public: true,
          is_active: true,
          used_in_modules: ['660e8400-e29b-41d4-a716-446655440000'],
          used_in_exercises: ['550e8400-e29b-41d4-a716-446655440001'],
          copyright_info: 'Public Domain',
          license: 'CC0',
          attribution: 'Wikimedia Commons',
          metadata: {
            source: 'Wikimedia Commons',
            year: '1903',
          },
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll() {
    return await this.mediaService.findAll();
  }

  /**
   * Obtiene un recurso multimedia específico por ID
   *
   * @param id - ID del recurso multimedia (UUID)
   * @returns Recurso multimedia encontrado
   *
   * @example
   * GET /api/v1/educational/media/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('media/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get media resource by ID',
    description: 'Obtiene un recurso multimedia específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del recurso multimedia en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recurso multimedia encontrado exitosamente',
    type: MediaResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Marie Curie Portrait',
        description: 'Retrato histórico de Marie Curie en su laboratorio',
        alt_text: 'Fotografía de Marie Curie trabajando en su laboratorio',
        media_type: 'image',
        file_format: 'jpg',
        file_size_bytes: 2048576,
        url: 'https://cdn.example.com/marie-curie.jpg',
        thumbnail_url: 'https://cdn.example.com/marie-curie-thumb.jpg',
        cdn_url: 'https://cdn.example.com/marie-curie.jpg',
        width: 1920,
        height: 1080,
        duration_seconds: null,
        resolution: '1080p',
        category: 'historical',
        tags: ['marie curie', 'portrait', 'historical', 'laboratory'],
        keywords: ['curie', 'scientist', 'portrait', 'physics'],
        processing_status: 'ready',
        is_public: true,
        is_active: true,
        used_in_modules: ['660e8400-e29b-41d4-a716-446655440000'],
        used_in_exercises: ['550e8400-e29b-41d4-a716-446655440001'],
        copyright_info: 'Public Domain',
        license: 'CC0',
        attribution: 'Wikimedia Commons',
        metadata: {
          source: 'Wikimedia Commons',
          year: '1903',
          photographer: 'Unknown',
        },
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Recurso multimedia no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Media resource with ID 550e8400-e29b-41d4-a716-446655440000 not found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.mediaService.findById(id);
  }

  /**
   * Crea (sube) un nuevo recurso multimedia
   *
   * @param uploadMediaDto - Datos del recurso multimedia a crear
   * @returns Recurso multimedia creado
   *
   * @example
   * POST /api/v1/educational/media
   * Request: {
   *   "title": "Marie Curie Portrait",
   *   "media_type": "image",
   *   "url": "https://cdn.example.com/marie-curie.jpg",
   *   "category": "historical"
   * }
   */
  @Post('media')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload new media resource [Admin only]',
    description:
      'Crea (sube) un nuevo recurso multimedia. Requiere permisos de administrador.',
  })
  @ApiResponse({
    status: 201,
    description: 'Recurso multimedia creado exitosamente',
    type: MediaResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Marie Curie Portrait',
        media_type: 'image',
        url: 'https://cdn.example.com/marie-curie.jpg',
        processing_status: 'uploading',
        is_active: true,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
    schema: {
      example: {
        statusCode: 400,
        message: ['title should not be empty', 'url should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de administrador',
  })
  async create(@Body() uploadMediaDto: UploadMediaDto) {
    return await this.mediaService.create(uploadMediaDto);
  }

  /**
   * Elimina un recurso multimedia
   *
   * @param id - ID del recurso multimedia a eliminar
   * @returns Resultado de la operación
   *
   * @example
   * DELETE /api/v1/educational/media/550e8400-e29b-41d4-a716-446655440000
   */
  @Delete('media/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete media resource [Admin only]',
    description:
      'Elimina un recurso multimedia. ADVERTENCIA: Las referencias en módulos/ejercicios quedarán inválidas. Requiere permisos de administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del recurso multimedia en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Recurso multimedia eliminado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Media resource deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Recurso multimedia no encontrado',
  })
  async remove(@Param('id') id: string) {
    const deleted = await this.mediaService.delete(id);
    return {
      success: deleted,
      message: deleted ? 'Media resource deleted successfully' : 'Media resource not found',
    };
  }

  /**
   * Actualiza el estado de procesamiento de un recurso multimedia
   *
   * @param id - ID del recurso multimedia
   * @param body - Objeto con el nuevo estado y metadatos opcionales
   * @returns Recurso multimedia actualizado
   *
   * @example
   * PATCH /api/v1/educational/media/550e8400-e29b-41d4-a716-446655440000/status
   * Request: {
   *   "status": "ready",
   *   "metadata": {
   *     "processed_at": "2025-01-15T10:05:00Z",
   *     "processor": "ImageOptimizer v2.0"
   *   }
   * }
   */
  @Patch('media/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update media processing status',
    description:
      'Actualiza el estado de procesamiento de un recurso multimedia. Valida transiciones de estado permitidas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del recurso multimedia en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de procesamiento actualizado exitosamente',
    type: MediaResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Marie Curie Portrait',
        processing_status: 'ready',
        metadata: {
          processed_at: '2025-01-15T10:05:00Z',
          processor: 'ImageOptimizer v2.0',
        },
        updated_at: '2025-01-15T10:05:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Transición de estado inválida',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid status transition from ready to uploading',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Recurso multimedia no encontrado',
  })
  async updateProcessingStatus(
    @Param('id') id: string,
    @Body() body: { status: ProcessingStatusEnum; metadata?: Record<string, any> },
  ) {
    return await this.mediaService.updateProcessingStatus(id, body.status, body.metadata);
  }

  /**
   * Obtiene recursos multimedia por categoría
   *
   * @param category - Categoría de los recursos multimedia
   * @returns Array de recursos multimedia de esa categoría
   *
   * @example
   * GET /api/v1/educational/media/category/historical
   * Response: [
   *   {
   *     "id": "550e8400-e29b-41d4-a716-446655440000",
   *     "title": "Marie Curie Portrait",
   *     "category": "historical",
   *     "media_type": "image"
   *   }
   * ]
   */
  @Get('media/category/:category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get media resources by category',
    description: 'Obtiene todos los recursos multimedia de una categoría específica',
  })
  @ApiParam({
    name: 'category',
    description: 'Categoría del recurso multimedia',
    type: String,
    required: true,
    example: 'historical',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recursos multimedia filtrados por categoría',
    type: [MediaResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Marie Curie Portrait',
          category: 'historical',
          media_type: 'image',
          url: 'https://cdn.example.com/marie-curie.jpg',
          processing_status: 'ready',
          is_active: true,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Laboratory Equipment 1900s',
          category: 'historical',
          media_type: 'image',
          url: 'https://cdn.example.com/lab-equipment.jpg',
          processing_status: 'ready',
          is_active: true,
        },
      ],
    },
  })
  async findByCategory(@Param('category') category: string) {
    return await this.mediaService.findByCategory(category);
  }
}
