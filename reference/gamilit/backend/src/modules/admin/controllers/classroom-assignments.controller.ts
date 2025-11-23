import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { ClassroomAssignmentsService } from '../services/classroom-assignments.service';
import {
  AssignClassroomDto,
  BulkAssignClassroomsDto,
  RemoveAssignmentDto,
  ReassignClassroomDto,
  AvailableClassroomsFiltersDto,
  ClassroomAssignmentResponseDto,
  AssignmentHistoryResponseDto,
} from '../dto/classroom-assignments';
import { Classroom } from '@modules/social/entities/classroom.entity';

/**
 * ClassroomAssignmentsController
 *
 * @description Controller para administrar asignaciones de aulas a profesores
 * @tags Admin - Classroom Assignments
 *
 * Endpoints:
 * - POST /admin/classrooms/assign - Asignar aula individual
 * - POST /admin/classrooms/bulk-assign - Asignación masiva
 * - DELETE /admin/classrooms/assign/:teacherId/:classroomId - Remover asignación
 * - POST /admin/classrooms/reassign - Reasignar aula
 * - GET /admin/classrooms/teacher/:teacherId - Listar aulas de profesor
 * - GET /admin/classrooms/available - Listar aulas disponibles
 * - GET /admin/classrooms/:classroomId/history - Historial de asignaciones
 */
@ApiTags('Admin - Classroom Assignments')
@Controller('admin/classrooms')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class ClassroomAssignmentsController {
  constructor(
    private readonly classroomAssignmentsService: ClassroomAssignmentsService,
  ) {}

  /**
   * Asigna un aula a un profesor
   *
   * @route POST /admin/classrooms/assign
   * @param dto Datos de asignación (teacherId, classroomId, notes)
   * @returns Información de la asignación creada
   */
  @Post('assign')
  @ApiOperation({
    summary: 'Assign classroom to teacher',
    description:
      'Assigns a single classroom to a teacher. Validates that both teacher and classroom exist and are valid.',
  })
  @ApiResponse({
    status: 201,
    description: 'Classroom assigned successfully',
    type: ClassroomAssignmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher or classroom not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Assignment already exists',
  })
  async assignClassroom(
    @Body() dto: AssignClassroomDto,
  ): Promise<ClassroomAssignmentResponseDto> {
    return await this.classroomAssignmentsService.assignClassroomToTeacher(dto);
  }

  /**
   * Asigna múltiples aulas a un profesor de forma masiva
   *
   * @route POST /admin/classrooms/bulk-assign
   * @param dto Datos de asignación masiva (teacherId, classroomIds[])
   * @returns Resultado con asignaciones exitosas y fallidas
   */
  @Post('bulk-assign')
  @ApiOperation({
    summary: 'Bulk assign classrooms to teacher',
    description:
      'Assigns multiple classrooms (up to 50) to a teacher. Returns both successful and failed assignments.',
  })
  @ApiResponse({
    status: 201,
    description: 'Bulk assignment completed (may include partial failures)',
    schema: {
      type: 'object',
      properties: {
        successful: {
          type: 'array',
          items: { $ref: '#/components/schemas/ClassroomAssignmentResponseDto' },
        },
        failed: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              classroom_id: { type: 'string' },
              reason: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  async bulkAssignClassrooms(@Body() dto: BulkAssignClassroomsDto): Promise<{
    successful: ClassroomAssignmentResponseDto[];
    failed: Array<{ classroom_id: string; reason: string }>;
  }> {
    return await this.classroomAssignmentsService.bulkAssignClassrooms(dto);
  }

  /**
   * Remueve la asignación de un aula a un profesor
   *
   * @route DELETE /admin/classrooms/assign/:teacherId/:classroomId
   * @param teacherId ID del profesor
   * @param classroomId ID del aula
   * @param dto Opciones de remoción (force)
   * @returns Mensaje de confirmación
   */
  @Delete('assign/:teacherId/:classroomId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove classroom assignment',
    description:
      'Removes a classroom assignment from a teacher. Validates that the classroom has no active students unless force=true.',
  })
  @ApiParam({
    name: 'teacherId',
    description: 'Teacher UUID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'Classroom UUID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment removed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Classroom has active students (use force=true to override)',
  })
  async removeClassroomAssignment(
    @Param('teacherId') teacherId: string,
    @Param('classroomId') classroomId: string,
    @Query() dto: RemoveAssignmentDto,
  ): Promise<{ message: string }> {
    return await this.classroomAssignmentsService.removeClassroomAssignment(
      teacherId,
      classroomId,
      dto,
    );
  }

  /**
   * Reasigna un aula de un profesor a otro
   *
   * @route POST /admin/classrooms/reassign
   * @param dto Datos de reasignación (classroomId, fromTeacherId, toTeacherId, reason)
   * @returns Información de la nueva asignación
   */
  @Post('reassign')
  @ApiOperation({
    summary: 'Reassign classroom to different teacher',
    description:
      'Transfers a classroom assignment from one teacher to another. Validates both teachers and maintains the same role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Classroom reassigned successfully',
    type: ClassroomAssignmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher or classroom assignment not found',
  })
  @ApiResponse({
    status: 409,
    description: 'New teacher is already assigned to this classroom',
  })
  async reassignClassroom(
    @Body() dto: ReassignClassroomDto,
  ): Promise<ClassroomAssignmentResponseDto> {
    return await this.classroomAssignmentsService.reassignClassroom(dto);
  }

  /**
   * Obtiene todas las aulas asignadas a un profesor
   *
   * @route GET /admin/classrooms/teacher/:teacherId
   * @param teacherId ID del profesor
   * @returns Lista de aulas asignadas al profesor
   */
  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: 'Get teacher classrooms',
    description: 'Retrieves all classrooms assigned to a specific teacher.',
  })
  @ApiParam({
    name: 'teacherId',
    description: 'Teacher UUID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assigned classrooms',
    type: [ClassroomAssignmentResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  async getTeacherClassrooms(
    @Param('teacherId') teacherId: string,
  ): Promise<ClassroomAssignmentResponseDto[]> {
    return await this.classroomAssignmentsService.getTeacherClassrooms(
      teacherId,
    );
  }

  /**
   * Obtiene las aulas disponibles para asignación
   *
   * @route GET /admin/classrooms/available
   * @param filters Filtros de búsqueda (search, level, activeOnly)
   * @returns Lista de aulas disponibles
   */
  @Get('available')
  @ApiOperation({
    summary: 'Get available classrooms',
    description:
      'Retrieves classrooms available for assignment with optional filters by name, level, and active status.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available classrooms',
    type: [Classroom],
  })
  async getAvailableClassrooms(
    @Query() filters: AvailableClassroomsFiltersDto,
  ): Promise<Classroom[]> {
    return await this.classroomAssignmentsService.getAvailableClassrooms(
      filters,
    );
  }

  /**
   * Obtiene el historial de asignaciones de un aula
   *
   * @route GET /admin/classrooms/:classroomId/history
   * @param classroomId ID del aula
   * @returns Historial de asignaciones del aula
   */
  @Get(':classroomId/history')
  @ApiOperation({
    summary: 'Get classroom assignment history',
    description:
      'Retrieves the complete assignment history for a classroom, including all past and current teachers.',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'Classroom UUID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment history',
    type: [AssignmentHistoryResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom not found',
  })
  async getAssignmentHistory(
    @Param('classroomId') classroomId: string,
  ): Promise<AssignmentHistoryResponseDto[]> {
    return await this.classroomAssignmentsService.getAssignmentHistory(
      classroomId,
    );
  }
}
