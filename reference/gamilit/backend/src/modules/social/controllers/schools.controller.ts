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
import { SchoolsService } from '../services';
import { CreateSchoolDto, SchoolResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * SchoolsController
 *
 * @description Gestión de instituciones educativas (escuelas y colegios).
 * Endpoints para CRUD de escuelas, estadísticas y configuraciones.
 * Soporte multi-tenant con aislamiento por tenant_id.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Schools')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  /**
   * Obtiene todas las escuelas, opcionalmente filtradas por tenant
   *
   * @param tenantId - ID del tenant (opcional)
   * @returns Lista de escuelas
   *
   * @example
   * GET /api/v1/social/schools?tenantId=550e8400-e29b-41d4-a716-446655440000
   */
  @Get('schools')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all schools',
    description:
      'Obtiene todas las escuelas del sistema, con filtro opcional por tenant para multi-tenancy',
  })
  @ApiQuery({
    name: 'tenantId',
    description: 'ID del tenant para filtrar escuelas (opcional)',
    type: String,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de escuelas obtenida exitosamente',
    type: [SchoolResponseDto],
    schema: {
      example: [
        {
          id: '660e8400-e29b-41d4-a716-446655440010',
          tenant_id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Colegio Nacional Mixto',
          code: 'CNM2025',
          address: 'Av. Principal 123',
          city: 'Guatemala',
          country: 'Guatemala',
          max_students: 500,
          current_students_count: 342,
          current_teachers_count: 25,
          is_active: true,
          is_verified: true,
          created_at: '2025-01-10T08:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(@Query('tenantId') tenantId?: string) {
    return await this.schoolsService.findAll(tenantId);
  }

  /**
   * Obtiene una escuela por ID
   *
   * @param id - ID de la escuela (UUID)
   * @returns Escuela encontrada
   *
   * @example
   * GET /api/v1/social/schools/660e8400-e29b-41d4-a716-446655440010
   */
  @Get('schools/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get school by ID',
    description: 'Obtiene una escuela específica por su identificador único',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la escuela en formato UUID',
    type: String,
    required: true,
    example: '660e8400-e29b-41d4-a716-446655440010',
  })
  @ApiResponse({
    status: 200,
    description: 'Escuela obtenida exitosamente',
    type: SchoolResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440010',
        tenant_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Colegio Nacional Mixto',
        code: 'CNM2025',
        address: 'Av. Principal 123',
        city: 'Guatemala',
        country: 'Guatemala',
        phone: '+502 2345-6789',
        email: 'info@cnm.edu.gt',
        website: 'https://cnm.edu.gt',
        max_students: 500,
        current_students_count: 342,
        current_teachers_count: 25,
        is_active: true,
        is_verified: true,
        settings: {
          require_approval: true,
          allow_public_enrollment: false,
        },
        created_at: '2025-01-10T08:00:00Z',
        updated_at: '2025-01-15T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela no encontrada',
  })
  async findById(@Param('id') id: string) {
    return await this.schoolsService.findById(id);
  }

  /**
   * Obtiene una escuela por su código único
   *
   * @param code - Código de la escuela
   * @returns Escuela encontrada
   *
   * @example
   * GET /api/v1/social/schools/code/CNM2025
   */
  @Get('schools/code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get school by code',
    description:
      'Obtiene una escuela por su código único de identificación institucional',
  })
  @ApiParam({
    name: 'code',
    description: 'Código único de la escuela',
    type: String,
    required: true,
    example: 'CNM2025',
  })
  @ApiResponse({
    status: 200,
    description: 'Escuela obtenida exitosamente',
    type: SchoolResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela con el código especificado no encontrada',
  })
  async findByCode(@Param('code') code: string) {
    return await this.schoolsService.findByCode(code);
  }

  /**
   * Crea una nueva escuela
   *
   * @param createDto - Datos para crear la escuela
   * @returns Nueva escuela creada
   *
   * @example
   * POST /api/v1/social/schools
   * Request: {
   *   "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "name": "Colegio Nacional Mixto",
   *   "code": "CNM2025",
   *   "city": "Guatemala",
   *   "country": "Guatemala",
   *   "max_students": 500
   * }
   */
  @Post('schools')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create school',
    description:
      'Crea una nueva institución educativa en el sistema. Requiere permisos de administrador.',
  })
  @ApiBody({
    type: CreateSchoolDto,
    description: 'Datos para crear la escuela',
    examples: {
      example1: {
        value: {
          tenant_id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Colegio Nacional Mixto',
          code: 'CNM2025',
          address: 'Av. Principal 123',
          city: 'Guatemala',
          country: 'Guatemala',
          phone: '+502 2345-6789',
          email: 'info@cnm.edu.gt',
          max_students: 500,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Escuela creada exitosamente',
    type: SchoolResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440010',
        tenant_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Colegio Nacional Mixto',
        code: 'CNM2025',
        city: 'Guatemala',
        country: 'Guatemala',
        current_students_count: 0,
        current_teachers_count: 0,
        is_active: true,
        is_verified: false,
        created_at: '2025-01-17T10:00:00Z',
        updated_at: '2025-01-17T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 409,
    description: 'El código de escuela ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'School with code CNM2025 already exists',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createDto: CreateSchoolDto) {
    return await this.schoolsService.create(createDto);
  }

  /**
   * Actualiza una escuela
   *
   * @param id - ID de la escuela (UUID)
   * @param updateDto - Campos a actualizar
   * @returns Escuela actualizada
   *
   * @example
   * PATCH /api/v1/social/schools/660e8400-e29b-41d4-a716-446655440010
   * Request: {
   *   "max_students": 600,
   *   "phone": "+502 2345-6790"
   * }
   */
  @Patch('schools/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update school',
    description:
      'Actualiza campos específicos de una escuela. Requiere permisos de administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la escuela en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Escuela actualizada exitosamente',
    type: SchoolResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El nuevo código ya existe en otra escuela',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateSchoolDto>,
  ) {
    return await this.schoolsService.update(id, updateDto);
  }

  /**
   * Desactiva una escuela (soft delete)
   *
   * @param id - ID de la escuela (UUID)
   * @returns Escuela desactivada
   *
   * @example
   * DELETE /api/v1/social/schools/660e8400-e29b-41d4-a716-446655440010
   */
  @Delete('schools/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete school',
    description:
      'Desactiva una escuela (soft delete), marcándola como inactiva sin eliminarla de la base de datos. Requiere permisos de administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la escuela en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Escuela desactivada exitosamente',
    type: SchoolResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440010',
        name: 'Colegio Nacional Mixto',
        is_active: false,
        updated_at: '2025-01-17T14:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela no encontrada',
  })
  async delete(@Param('id') id: string) {
    return await this.schoolsService.delete(id);
  }

  /**
   * Obtiene estadísticas de una escuela
   *
   * @param id - ID de la escuela (UUID)
   * @returns Estadísticas de matrícula y capacidad
   *
   * @example
   * GET /api/v1/social/schools/660e8400-e29b-41d4-a716-446655440010/stats
   */
  @Get('schools/:id/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get school statistics',
    description:
      'Obtiene estadísticas detalladas de una escuela: estudiantes, profesores, aulas y uso de capacidad',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la escuela en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      example: {
        student_count: 342,
        teacher_count: 25,
        classroom_count: 18,
        capacity_usage_percentage: 68.4,
        is_at_capacity: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela no encontrada',
  })
  async getSchoolStats(@Param('id') id: string) {
    return await this.schoolsService.getSchoolStats(id);
  }

  /**
   * Actualiza las configuraciones de una escuela
   *
   * @param id - ID de la escuela (UUID)
   * @param settings - Nuevas configuraciones
   * @returns Escuela actualizada
   *
   * @example
   * PATCH /api/v1/social/schools/660e8400-e29b-41d4-a716-446655440010/settings
   * Request: {
   *   "require_approval": false,
   *   "allow_public_enrollment": true
   * }
   */
  @Patch('schools/:id/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update school settings',
    description:
      'Actualiza las configuraciones personalizadas de una escuela. Los nuevos valores se mezclan con los existentes. Requiere permisos de administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la escuela en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Objeto JSON con las configuraciones a actualizar',
    examples: {
      example1: {
        value: {
          require_approval: false,
          allow_public_enrollment: true,
          max_classroom_size: 30,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Configuraciones actualizadas exitosamente',
    type: SchoolResponseDto,
    schema: {
      example: {
        id: '660e8400-e29b-41d4-a716-446655440010',
        name: 'Colegio Nacional Mixto',
        settings: {
          require_approval: false,
          allow_public_enrollment: true,
          max_classroom_size: 30,
        },
        updated_at: '2025-01-17T15:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Escuela no encontrada',
  })
  async updateSettings(
    @Param('id') id: string,
    @Body() settings: Record<string, any>,
  ) {
    return await this.schoolsService.updateSettings(id, settings);
  }
}
