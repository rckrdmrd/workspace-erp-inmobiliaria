import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { TeacherGuard, ClassroomOwnershipGuard } from '../guards';
import { StudentBlockingService } from '../services/student-blocking.service';
import {
  BlockStudentDto,
  UpdatePermissionsDto,
  StudentPermissionsResponseDto,
} from '../dto/student-blocking';

/**
 * TeacherClassroomsController
 *
 * @description Controller para gestión de estudiantes en aulas por profesores
 * @tags Teacher - Classrooms
 *
 * Endpoints:
 * - POST /:classroomId/students/:studentId/block - Bloquear estudiante
 * - POST /:classroomId/students/:studentId/unblock - Desbloquear estudiante
 * - GET /:classroomId/students/:studentId/permissions - Ver permisos
 * - PATCH /:classroomId/students/:studentId/permissions - Actualizar permisos
 *
 * Guards:
 * - JwtAuthGuard: Usuario debe estar autenticado
 * - TeacherGuard: Usuario debe ser profesor
 * - ClassroomOwnershipGuard: Profesor debe tener acceso al aula
 */
@ApiTags('Teacher - Classrooms')
@Controller('teacher/classrooms')
@UseGuards(JwtAuthGuard, TeacherGuard, ClassroomOwnershipGuard)
@ApiBearerAuth()
export class TeacherClassroomsController {
  constructor(
    private readonly studentBlockingService: StudentBlockingService,
  ) {}

  /**
   * Bloquea un estudiante en un aula
   *
   * @route POST /api/teacher/classrooms/:classroomId/students/:studentId/block
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @param dto Datos del bloqueo (reason, block_type, blocked_modules)
   * @returns Permisos y estado del estudiante
   */
  @Post(':classroomId/students/:studentId/block')
  @ApiOperation({
    summary: 'Block student in classroom',
    description:
      'Blocks a student in the classroom. Supports full block (no access) or partial block (restricted modules).',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'Classroom UUID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiResponse({
    status: 201,
    description: 'Student blocked successfully',
    type: StudentPermissionsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found in classroom',
  })
  @ApiResponse({
    status: 403,
    description: 'Teacher does not have access to this classroom',
  })
  @ApiResponse({
    status: 400,
    description: 'Student is already blocked or invalid block type',
  })
  async blockStudent(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
    @Body() dto: BlockStudentDto,
    @Request() req: any,
  ): Promise<StudentPermissionsResponseDto> {
    const teacherId = req.user.sub;
    return await this.studentBlockingService.blockStudent(
      classroomId,
      studentId,
      teacherId,
      dto,
    );
  }

  /**
   * Desbloquea un estudiante en un aula
   *
   * @route POST /api/teacher/classrooms/:classroomId/students/:studentId/unblock
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @returns Permisos y estado del estudiante
   */
  @Post(':classroomId/students/:studentId/unblock')
  @ApiOperation({
    summary: 'Unblock student in classroom',
    description:
      'Removes all blocks and restrictions from a student, restoring full access to the classroom.',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'Classroom UUID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiResponse({
    status: 201,
    description: 'Student unblocked successfully',
    type: StudentPermissionsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found in classroom',
  })
  @ApiResponse({
    status: 403,
    description: 'Teacher does not have access to this classroom',
  })
  @ApiResponse({
    status: 400,
    description: 'Student is not blocked',
  })
  async unblockStudent(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
    @Request() req: any,
  ): Promise<StudentPermissionsResponseDto> {
    const teacherId = req.user.sub;
    return await this.studentBlockingService.unblockStudent(
      classroomId,
      studentId,
      teacherId,
    );
  }

  /**
   * Obtiene los permisos actuales de un estudiante
   *
   * @route GET /api/teacher/classrooms/:classroomId/students/:studentId/permissions
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @returns Permisos y estado actual del estudiante
   */
  @Get(':classroomId/students/:studentId/permissions')
  @ApiOperation({
    summary: 'Get student permissions',
    description:
      'Retrieves current permissions and block status for a student in the classroom.',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'Classroom UUID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiResponse({
    status: 200,
    description: 'Student permissions retrieved',
    type: StudentPermissionsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found in classroom',
  })
  @ApiResponse({
    status: 403,
    description: 'Teacher does not have access to this classroom',
  })
  async getStudentPermissions(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
    @Request() req: any,
  ): Promise<StudentPermissionsResponseDto> {
    const teacherId = req.user.sub;
    return await this.studentBlockingService.getStudentPermissions(
      classroomId,
      studentId,
      teacherId,
    );
  }

  /**
   * Actualiza permisos granulares de un estudiante
   *
   * @route PATCH /api/teacher/classrooms/:classroomId/students/:studentId/permissions
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @param dto Permisos a actualizar
   * @returns Permisos y estado actualizado del estudiante
   */
  @Patch(':classroomId/students/:studentId/permissions')
  @ApiOperation({
    summary: 'Update student permissions',
    description:
      'Updates granular permissions for a student (allowed_modules, allowed_features, flags). Performs a merge with existing permissions.',
  })
  @ApiParam({
    name: 'classroomId',
    description: 'Classroom UUID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions updated successfully',
    type: StudentPermissionsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found in classroom',
  })
  @ApiResponse({
    status: 403,
    description: 'Teacher does not have access to this classroom',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid permissions or conflicts detected',
  })
  async updateStudentPermissions(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
    @Body() dto: UpdatePermissionsDto,
    @Request() req: any,
  ): Promise<StudentPermissionsResponseDto> {
    const teacherId = req.user.sub;
    return await this.studentBlockingService.updateStudentPermissions(
      classroomId,
      studentId,
      teacherId,
      dto,
    );
  }
}
