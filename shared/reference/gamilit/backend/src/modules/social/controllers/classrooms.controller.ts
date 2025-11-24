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
import { ClassroomsService, ClassroomMembersService } from '../services';
import { CreateClassroomDto, ClassroomResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ClassroomsController
 *
 * @description Gestión de aulas virtuales para organizar estudiantes.
 * Endpoints para CRUD de aulas, inscripción de estudiantes, estadísticas
 * y configuración de horarios.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Classrooms')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly classroomMembersService: ClassroomMembersService,
  ) {}

  /**
   * Obtiene todas las aulas, opcionalmente filtradas por escuela o profesor
   *
   * @param schoolId - ID de la escuela (opcional)
   * @param teacherId - ID del profesor (opcional)
   * @returns Lista de aulas
   *
   * @example
   * GET /api/v1/social/classrooms?schoolId=660e8400-e29b-41d4-a716-446655440010
   * GET /api/v1/social/classrooms?teacherId=550e8400-e29b-41d4-a716-446655440005
   */
  @Get('classrooms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all classrooms',
    description:
      'Obtiene todas las aulas del sistema, con filtros opcionales por escuela o profesor',
  })
  @ApiQuery({
    name: 'schoolId',
    description: 'ID de la escuela para filtrar aulas (opcional)',
    type: String,
    required: false,
    example: '660e8400-e29b-41d4-a716-446655440010',
  })
  @ApiQuery({
    name: 'teacherId',
    description: 'ID del profesor para filtrar aulas (opcional)',
    type: String,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de aulas obtenida exitosamente',
    type: [ClassroomResponseDto],
    schema: {
      example: [
        {
          id: '770e8400-e29b-41d4-a716-446655440020',
          school_id: '660e8400-e29b-41d4-a716-446655440010',
          teacher_id: '550e8400-e29b-41d4-a716-446655440005',
          name: '5to Grado A',
          code: '5A2025',
          description: 'Aula de quinto grado sección A',
          grade_level: '5to',
          section: 'A',
          capacity: 30,
          current_students_count: 25,
          is_active: true,
          created_at: '2025-01-12T09:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(
    @Query('schoolId') schoolId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    return await this.classroomsService.findAll(schoolId, teacherId);
  }

  /**
   * Obtiene un aula por su código único
   *
   * IMPORTANTE: Esta ruta debe ir ANTES de 'classrooms/:id' para evitar
   * que 'code' sea capturado como un ID.
   *
   * @param code - Código del aula
   * @returns Aula encontrada
   *
   * @example
   * GET /api/v1/social/classrooms/code/5A2025
   */
  @Get('classrooms/code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom by code',
    description:
      'Obtiene un aula por su código único de identificación (útil para inscripción rápida)',
  })
  @ApiParam({
    name: 'code',
    description: 'Código único del aula',
    type: String,
    required: true,
    example: '5A2025',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula obtenida exitosamente',
    type: ClassroomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Aula con el código especificado no encontrada',
  })
  async findByCode(@Param('code') code: string) {
    return await this.classroomsService.findByCode(code);
  }

  /**
   * Obtiene un aula por ID
   *
   * IMPORTANTE: Esta ruta debe ir DESPUÉS de rutas más específicas
   * como 'classrooms/code/:code' para evitar conflictos.
   *
   * @param id - ID del aula (UUID)
   * @returns Aula encontrada
   *
   * @example
   * GET /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020
   */
  @Get('classrooms/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom by ID',
    description: 'Obtiene un aula específica por su identificador único',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula obtenida exitosamente',
    type: ClassroomResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440020',
        school_id: '660e8400-e29b-41d4-a716-446655440010',
        teacher_id: '550e8400-e29b-41d4-a716-446655440005',
        name: '5to Grado A',
        code: '5A2025',
        description: 'Aula de quinto grado sección A',
        grade_level: '5to',
        section: 'A',
        capacity: 30,
        current_students_count: 25,
        start_date: '2025-01-15',
        end_date: '2025-11-30',
        is_active: true,
        is_archived: false,
        schedule: [
          { day: 'Monday', start: '08:00', end: '12:00' },
          { day: 'Tuesday', start: '08:00', end: '12:00' },
        ],
        settings: {
          require_approval: true,
          visible_in_directory: true,
        },
        created_at: '2025-01-12T09:00:00Z',
        updated_at: '2025-11-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  async findById(@Param('id') id: string) {
    return await this.classroomsService.findById(id);
  }

  /**
   * Crea una nueva aula
   *
   * @param createDto - Datos para crear el aula
   * @returns Nueva aula creada
   *
   * @example
   * POST /api/v1/social/classrooms
   * Request: {
   *   "school_id": "660e8400-e29b-41d4-a716-446655440010",
   *   "teacher_id": "550e8400-e29b-41d4-a716-446655440005",
   *   "name": "5to Grado A",
   *   "code": "5A2025",
   *   "capacity": 30
   * }
   */
  @Post('classrooms')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create classroom',
    description:
      'Crea una nueva aula virtual. Requiere permisos de profesor o administrador.',
  })
  @ApiBody({
    type: CreateClassroomDto,
    description: 'Datos para crear el aula',
    examples: {
      example1: {
        value: {
          school_id: '660e8400-e29b-41d4-a716-446655440010',
          teacher_id: '550e8400-e29b-41d4-a716-446655440005',
          name: '5to Grado A',
          code: '5A2025',
          description: 'Aula de quinto grado sección A',
          grade_level: '5to',
          section: 'A',
          capacity: 30,
          start_date: '2025-01-15',
          end_date: '2025-11-30',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Aula creada exitosamente',
    type: ClassroomResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440020',
        school_id: '660e8400-e29b-41d4-a716-446655440010',
        teacher_id: '550e8400-e29b-41d4-a716-446655440005',
        name: '5to Grado A',
        code: '5A2025',
        capacity: 30,
        current_students_count: 0,
        is_active: true,
        is_archived: false,
        created_at: '2025-01-17T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 409,
    description: 'El código de aula ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'Classroom with code 5A2025 already exists',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createDto: CreateClassroomDto) {
    return await this.classroomsService.create(createDto);
  }

  /**
   * Actualiza un aula
   *
   * @param id - ID del aula (UUID)
   * @param updateDto - Campos a actualizar
   * @returns Aula actualizada
   *
   * @example
   * PATCH /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020
   * Request: {
   *   "capacity": 35,
   *   "description": "Aula ampliada"
   * }
   */
  @Patch('classrooms/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update classroom',
    description:
      'Actualiza campos específicos de un aula. Requiere permisos de profesor o administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Aula actualizada exitosamente',
    type: ClassroomResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El nuevo código ya existe en otra aula',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateClassroomDto>,
  ) {
    return await this.classroomsService.update(id, updateDto);
  }

  /**
   * Desactiva un aula (soft delete)
   *
   * @param id - ID del aula (UUID)
   * @returns Aula desactivada
   *
   * @example
   * DELETE /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020
   */
  @Delete('classrooms/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete classroom',
    description:
      'Desactiva un aula (soft delete), marcándola como inactiva. Requiere permisos de profesor o administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Aula desactivada exitosamente',
    type: ClassroomResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440020',
        name: '5to Grado A',
        is_active: false,
        updated_at: '2025-01-17T14:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  async delete(@Param('id') id: string) {
    return await this.classroomsService.delete(id);
  }

  /**
   * Obtiene estadísticas de un aula
   *
   * @param id - ID del aula (UUID)
   * @returns Estadísticas de matrícula y capacidad
   *
   * @example
   * GET /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020/stats
   */
  @Get('classrooms/:id/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom statistics',
    description:
      'Obtiene estadísticas detalladas de un aula: matrícula, capacidad, promedio de calificaciones',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      example: {
        enrollment_count: 25,
        capacity: 30,
        capacity_usage_percentage: 83.33,
        is_at_capacity: false,
        available_spots: 5,
        average_grade: 87.5,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  async getClassroomStats(@Param('id') id: string) {
    return await this.classroomsService.getClassroomStats(id);
  }

  /**
   * Obtiene aulas activas de un profesor
   *
   * @param teacherId - ID del profesor (UUID)
   * @returns Lista de aulas activas del profesor
   *
   * @example
   * GET /api/v1/social/teachers/550e8400-e29b-41d4-a716-446655440005/classrooms/active
   */
  @Get('teachers/:teacherId/classrooms/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active classrooms for teacher',
    description:
      'Obtiene todas las aulas activas (no archivadas) de un profesor específico',
  })
  @ApiParam({
    name: 'teacherId',
    description: 'ID del profesor en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Aulas activas obtenidas exitosamente',
    type: [ClassroomResponseDto],
    schema: {
      example: [
        {
          id: '770e8400-e29b-41d4-a716-446655440020',
          teacher_id: '550e8400-e29b-41d4-a716-446655440005',
          name: '5to Grado A',
          is_active: true,
          is_archived: false,
          current_students_count: 25,
        },
      ],
    },
  })
  async getActiveClassrooms(@Param('teacherId') teacherId: string) {
    return await this.classroomsService.getActiveClassrooms(teacherId);
  }

  /**
   * Inscribe un estudiante en un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @param studentId - ID del estudiante (UUID)
   * @returns Aula actualizada
   *
   * @example
   * POST /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020/students/550e8400-e29b-41d4-a716-446655440010
   */
  @Post('classrooms/:classroomId/students/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enroll student in classroom',
    description:
      'Inscribe un estudiante en un aula, incrementando el contador de estudiantes',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'studentId',
    description: 'ID del estudiante en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante inscrito exitosamente',
    type: ClassroomResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440020',
        current_students_count: 26,
        updated_at: '2025-01-17T16:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Aula llena o datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Classroom is at maximum capacity',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula o estudiante no encontrado',
  })
  async enrollStudent(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.classroomsService.enrollStudent(classroomId, studentId);
  }

  /**
   * Retira un estudiante de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @param studentId - ID del estudiante (UUID)
   * @returns Aula actualizada
   *
   * @example
   * DELETE /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020/students/550e8400-e29b-41d4-a716-446655440010
   */
  @Delete('classrooms/:classroomId/students/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove student from classroom',
    description:
      'Retira un estudiante de un aula, decrementando el contador de estudiantes',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'studentId',
    description: 'ID del estudiante en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante retirado exitosamente',
    type: ClassroomResponseDto,
    schema: {
      example: {
        id: '770e8400-e29b-41d4-a716-446655440020',
        current_students_count: 24,
        updated_at: '2025-01-17T16:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aula o estudiante no encontrado',
  })
  async removeStudent(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.classroomsService.removeStudent(classroomId, studentId);
  }

  /**
   * Actualiza el horario de un aula
   *
   * @param id - ID del aula (UUID)
   * @param body - Nuevo horario
   * @returns Aula actualizada
   *
   * @example
   * PATCH /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020/schedule
   * Request: {
   *   "schedule": [
   *     { "day": "Monday", "start": "08:00", "end": "12:00" },
   *     { "day": "Wednesday", "start": "08:00", "end": "12:00" }
   *   ]
   * }
   */
  @Patch('classrooms/:id/schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update classroom schedule',
    description: 'Actualiza el horario de un aula con nuevos días y horas',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Objeto con el nuevo horario del aula',
    examples: {
      example1: {
        value: {
          schedule: [
            { day: 'Monday', start: '08:00', end: '12:00' },
            { day: 'Wednesday', start: '08:00', end: '12:00' },
            { day: 'Friday', start: '08:00', end: '12:00' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Horario actualizado exitosamente',
    type: ClassroomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada',
  })
  async updateSchedule(
    @Param('id') id: string,
    @Body() body: { schedule: any[] },
  ) {
    return await this.classroomsService.updateSchedule(id, body.schedule);
  }

  /**
   * Obtiene los miembros de un aula (shortcut a ClassroomMembersController)
   *
   * @param classroomId - ID del aula (UUID)
   * @returns Lista de miembros del aula
   *
   * @example
   * GET /api/v1/social/classrooms/770e8400-e29b-41d4-a716-446655440020/members
   */
  @Get('classrooms/:classroomId/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom members',
    description:
      'Obtiene todos los miembros (estudiantes) de un aula específica. Este es un endpoint de conveniencia que delega a ClassroomMembersService.',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembros del aula obtenidos exitosamente',
    schema: {
      example: [
        {
          id: '880e8400-e29b-41d4-a716-446655440030',
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          user_id: '550e8400-e29b-41d4-a716-446655440010',
          status: 'active',
          enrollment_date: '2025-01-15',
        },
      ],
    },
  })
  async getMembers(@Param('classroomId') classroomId: string) {
    return await this.classroomMembersService.findByClassroomId(classroomId);
  }
}
