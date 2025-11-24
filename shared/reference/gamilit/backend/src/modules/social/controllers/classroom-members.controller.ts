import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ClassroomMembersService } from '../services';
import {
  CreateClassroomMemberDto,
  ClassroomMemberResponseDto,
  UpdateClassroomMemberStatusDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ClassroomMembersController
 *
 * @description Gestión de membresía de estudiantes en aulas.
 * Endpoints para inscripción, actualización de estado, calificaciones,
 * asistencia, y leaderboards por aula.
 *
 * @route /api/v1/social
 */
@ApiTags('Social - Classroom Members')
@Controller(extractBasePath(API_ROUTES.SOCIAL.BASE))
export class ClassroomMembersController {
  constructor(
    private readonly classroomMembersService: ClassroomMembersService,
  ) {}

  /**
   * Obtiene todos los miembros de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @returns Lista de miembros
   *
   * @example
   * GET /api/v1/social/classroom-members/classrooms/770e8400-e29b-41d4-a716-446655440020
   */
  @Get('classroom-members/classrooms/:classroomId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom members',
    description: 'Obtiene todos los estudiantes inscritos en un aula específica',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiResponse({
    status: 200,
    description: 'Miembros obtenidos exitosamente',
    type: [ClassroomMemberResponseDto],
    schema: {
      example: [
        {
          id: '880e8400-e29b-41d4-a716-446655440030',
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          student_id: '550e8400-e29b-41d4-a716-446655440010',
          status: 'active',
          enrollment_method: 'teacher_invite',
          enrollment_date: '2025-01-15',
          final_grade: 87.5,
          attendance_percentage: 95.5,
          is_active: true,
        },
      ],
    },
  })
  async findByClassroomId(@Param('classroomId') classroomId: string) {
    return await this.classroomMembersService.findByClassroomId(classroomId);
  }

  /**
   * Obtiene todas las aulas en las que está inscrito un estudiante
   *
   * @param userId - ID del estudiante (UUID)
   * @returns Lista de membresías
   *
   * @example
   * GET /api/v1/social/classroom-members/users/550e8400-e29b-41d4-a716-446655440010
   */
  @Get('classroom-members/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user classrooms',
    description:
      'Obtiene todas las aulas en las que está inscrito un estudiante',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del estudiante en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Membresías obtenidas exitosamente',
    type: [ClassroomMemberResponseDto],
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.classroomMembersService.findByUserId(userId);
  }

  /**
   * Obtiene la membresía de un estudiante en un aula específica
   *
   * @param classroomId - ID del aula (UUID)
   * @param userId - ID del estudiante (UUID)
   * @returns Membresía encontrada
   *
   * @example
   * GET /api/v1/social/classroom-members/classrooms/770e8400-e29b-41d4-a716-446655440020/users/550e8400-e29b-41d4-a716-446655440010
   */
  @Get('classroom-members/classrooms/:classroomId/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom member',
    description:
      'Obtiene la membresía específica de un estudiante en un aula',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del estudiante en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Membresía obtenida exitosamente',
    type: ClassroomMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async findByClassroomAndUser(
    @Param('classroomId') classroomId: string,
    @Param('userId') userId: string,
  ) {
    return await this.classroomMembersService.findByClassroomAndUser(
      classroomId,
      userId,
    );
  }

  /**
   * Inscribe un estudiante en un aula
   *
   * @param createDto - Datos de inscripción
   * @returns Nueva membresía creada
   *
   * @example
   * POST /api/v1/social/classroom-members
   * Request: {
   *   "classroom_id": "770e8400-e29b-41d4-a716-446655440020",
   *   "student_id": "550e8400-e29b-41d4-a716-446655440010",
   *   "enrollment_method": "teacher_invite"
   * }
   */
  @Post('classroom-members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enroll student',
    description: 'Inscribe un estudiante en un aula',
  })
  @ApiBody({
    type: CreateClassroomMemberDto,
    description: 'Datos de inscripción del estudiante',
    examples: {
      example1: {
        value: {
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          student_id: '550e8400-e29b-41d4-a716-446655440010',
          enrollment_method: 'teacher_invite',
          seat_number: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Estudiante inscrito exitosamente',
    type: ClassroomMemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El estudiante ya está inscrito en el aula',
    schema: {
      example: {
        statusCode: 409,
        message:
          'Student 550e8400-e29b-41d4-a716-446655440010 is already enrolled in classroom 770e8400-e29b-41d4-a716-446655440020',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createDto: CreateClassroomMemberDto) {
    return await this.classroomMembersService.create(createDto);
  }

  /**
   * Actualiza el estado de una membresía
   *
   * @param id - ID de la membresía (UUID)
   * @param updateDto - Nuevo estado
   * @returns Membresía actualizada
   *
   * @example
   * PATCH /api/v1/social/classroom-members/880e8400-e29b-41d4-a716-446655440030/status
   * Request: {
   *   "status": "completed"
   * }
   */
  @Patch('classroom-members/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update member status',
    description:
      'Actualiza el estado de una membresía (active, inactive, withdrawn, completed)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la membresía en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    type: UpdateClassroomMemberStatusDto,
    description: 'Nuevo estado de la membresía',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: ClassroomMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassroomMemberStatusDto,
  ) {
    return await this.classroomMembersService.updateStatus(id, updateDto.status);
  }

  /**
   * Registra la calificación final de un estudiante
   *
   * @param id - ID de la membresía (UUID)
   * @param body - Calificación
   * @returns Membresía actualizada
   *
   * @example
   * PATCH /api/v1/social/classroom-members/880e8400-e29b-41d4-a716-446655440030/grade
   * Request: { "grade": 87.5 }
   */
  @Patch('classroom-members/:id/grade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record final grade',
    description:
      'Registra la calificación final de un estudiante en el aula',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la membresía en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Calificación final (0-100)',
    examples: {
      example1: {
        value: { grade: 87.5 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Calificación registrada exitosamente',
    type: ClassroomMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async recordGrade(
    @Param('id') id: string,
    @Body() body: { grade: number },
  ) {
    return await this.classroomMembersService.recordGrade(id, body.grade);
  }

  /**
   * Actualiza el porcentaje de asistencia de un estudiante
   *
   * @param id - ID de la membresía (UUID)
   * @param body - Porcentaje de asistencia
   * @returns Membresía actualizada
   *
   * @example
   * PATCH /api/v1/social/classroom-members/880e8400-e29b-41d4-a716-446655440030/attendance
   * Request: { "attendance": 95.5 }
   */
  @Patch('classroom-members/:id/attendance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update attendance',
    description:
      'Actualiza el porcentaje de asistencia de un estudiante en el aula',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la membresía en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Porcentaje de asistencia (0-100)',
    examples: {
      example1: {
        value: { attendance: 95.5 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Asistencia actualizada exitosamente',
    type: ClassroomMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async updateAttendance(
    @Param('id') id: string,
    @Body() body: { attendance: number },
  ) {
    return await this.classroomMembersService.updateAttendance(
      id,
      body.attendance,
    );
  }

  /**
   * Marca a un estudiante como retirado del aula
   *
   * @param id - ID de la membresía (UUID)
   * @param body - Razón del retiro
   * @returns Membresía actualizada
   *
   * @example
   * POST /api/v1/social/classroom-members/880e8400-e29b-41d4-a716-446655440030/withdraw
   * Request: { "reason": "Transferido a otra escuela" }
   */
  @Post('classroom-members/:id/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Withdraw student',
    description:
      'Marca a un estudiante como retirado del aula, actualizando status a "withdrawn"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la membresía en formato UUID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Razón del retiro',
    examples: {
      example1: {
        value: { reason: 'Transferido a otra escuela' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante retirado exitosamente',
    type: ClassroomMemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Membresía no encontrada',
  })
  async withdraw(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return await this.classroomMembersService.withdraw(id, body.reason);
  }

  /**
   * Obtiene los miembros activos de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @returns Lista de miembros activos
   *
   * @example
   * GET /api/v1/social/classroom-members/classrooms/770e8400-e29b-41d4-a716-446655440020/active
   */
  @Get('classroom-members/classrooms/:classroomId/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active classroom members',
    description:
      'Obtiene solo los estudiantes con status "active" en un aula',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembros activos obtenidos exitosamente',
    type: [ClassroomMemberResponseDto],
  })
  async getActiveMembers(@Param('classroomId') classroomId: string) {
    return await this.classroomMembersService.getActiveMembers(classroomId);
  }

  /**
   * Obtiene el leaderboard de un aula
   *
   * @param classroomId - ID del aula (UUID)
   * @returns Leaderboard ordenado por calificación
   *
   * @example
   * GET /api/v1/social/classroom-members/classrooms/770e8400-e29b-41d4-a716-446655440020/leaderboard
   */
  @Get('classroom-members/classrooms/:classroomId/leaderboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get classroom leaderboard',
    description:
      'Obtiene el leaderboard del aula ordenado por calificación final (de mayor a menor)',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'ID del aula en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard obtenido exitosamente',
    type: [ClassroomMemberResponseDto],
    schema: {
      example: [
        {
          id: '880e8400-e29b-41d4-a716-446655440030',
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          student_id: '550e8400-e29b-41d4-a716-446655440010',
          final_grade: 97.5,
          attendance_percentage: 100,
          rank: 1,
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440031',
          classroom_id: '770e8400-e29b-41d4-a716-446655440020',
          student_id: '550e8400-e29b-41d4-a716-446655440011',
          final_grade: 92.0,
          attendance_percentage: 98.5,
          rank: 2,
        },
      ],
    },
  })
  async getClassroomLeaderboard(@Param('classroomId') classroomId: string) {
    return await this.classroomMembersService.getClassroomLeaderboard(
      classroomId,
    );
  }
}
