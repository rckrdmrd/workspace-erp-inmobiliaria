import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassroomMember } from '@modules/social/entities/classroom-member.entity';
import { TeacherClassroom } from '@modules/social/entities/teacher-classroom.entity';
import { Profile } from '@modules/auth/entities/profile.entity';
import { ClassroomMemberStatusEnum } from '@shared/constants/enums.constants';
import {
  BlockStudentDto,
  BlockType,
  UpdatePermissionsDto,
  StudentPermissionsResponseDto,
} from '../dto/student-blocking';

/**
 * StudentBlockingService
 *
 * @description Service para gestionar bloqueo y permisos de estudiantes en aulas
 * @module teacher
 *
 * Funcionalidades:
 * - Bloqueo completo (full): status='inactive', sin acceso al aula
 * - Bloqueo parcial (partial): restricción de módulos/ejercicios específicos
 * - Desbloqueo: restaurar acceso completo
 * - Gestión de permisos granulares: allowed_modules, allowed_features, flags
 */
@Injectable()
export class StudentBlockingService {
  constructor(
    @InjectRepository(ClassroomMember, 'social')
    private readonly classroomMemberRepo: Repository<ClassroomMember>,

    @InjectRepository(TeacherClassroom, 'social')
    private readonly teacherClassroomRepo: Repository<TeacherClassroom>,

    @InjectRepository(Profile, 'auth')
    private readonly profileRepo: Repository<Profile>,
  ) {}

  /**
   * Bloquea un estudiante en un aula
   *
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @param teacherId ID del profesor
   * @param dto Datos del bloqueo
   * @returns Permisos y estado actualizado del estudiante
   * @throws NotFoundException Si el estudiante no existe en el aula
   * @throws ForbiddenException Si el profesor no tiene acceso al aula
   * @throws BadRequestException Si el estudiante ya está bloqueado
   */
  async blockStudent(
    classroomId: string,
    studentId: string,
    teacherId: string,
    dto: BlockStudentDto,
  ): Promise<StudentPermissionsResponseDto> {
    // 1. Validar que el profesor tiene acceso al aula
    await this.validateTeacherAccess(teacherId, classroomId);

    // 2. Obtener el classroom_member
    const member = await this.getClassroomMember(classroomId, studentId);

    // 3. Verificar que el estudiante no está ya bloqueado
    if (
      member.status === ClassroomMemberStatusEnum.INACTIVE ||
      !member.is_active
    ) {
      throw new BadRequestException(
        `Student ${studentId} is already blocked in classroom ${classroomId}`,
      );
    }

    // 4. Aplicar bloqueo según el tipo
    if (dto.block_type === BlockType.FULL) {
      // Bloqueo completo
      member.status = ClassroomMemberStatusEnum.INACTIVE;
      member.is_active = false;
      member.withdrawal_reason = dto.reason;
      member.permissions = {
        block_type: BlockType.FULL,
        blocked_at: new Date().toISOString(),
        blocked_by: teacherId,
        block_reason: dto.reason,
      };
    } else {
      // Bloqueo parcial
      member.status = ClassroomMemberStatusEnum.ACTIVE;
      member.is_active = true;
      member.permissions = {
        ...member.permissions,
        block_type: BlockType.PARTIAL,
        blocked_modules: dto.blocked_modules || [],
        blocked_exercises: dto.blocked_exercises || [],
        blocked_at: new Date().toISOString(),
        blocked_by: teacherId,
        block_reason: dto.reason,
      };
    }

    // 5. Guardar en base de datos
    const updatedMember = await this.classroomMemberRepo.save(member);

    // 6. Retornar respuesta formateada
    return this.formatPermissionsResponse(updatedMember);
  }

  /**
   * Desbloquea un estudiante en un aula
   *
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @param teacherId ID del profesor
   * @returns Permisos y estado actualizado del estudiante
   * @throws NotFoundException Si el estudiante no existe en el aula
   * @throws ForbiddenException Si el profesor no tiene acceso al aula
   * @throws BadRequestException Si el estudiante no está bloqueado
   */
  async unblockStudent(
    classroomId: string,
    studentId: string,
    teacherId: string,
  ): Promise<StudentPermissionsResponseDto> {
    // 1. Validar que el profesor tiene acceso al aula
    await this.validateTeacherAccess(teacherId, classroomId);

    // 2. Obtener el classroom_member
    const member = await this.getClassroomMember(classroomId, studentId);

    // 3. Verificar que el estudiante está bloqueado
    const isBlocked =
      member.status === ClassroomMemberStatusEnum.INACTIVE ||
      !member.is_active ||
      member.permissions?.block_type;

    if (!isBlocked) {
      throw new BadRequestException(
        `Student ${studentId} is not blocked in classroom ${classroomId}`,
      );
    }

    // 4. Restaurar acceso completo
    member.status = ClassroomMemberStatusEnum.ACTIVE;
    member.is_active = true;
    member.withdrawal_reason = undefined;
    member.permissions = {
      unblocked_at: new Date().toISOString(),
      unblocked_by: teacherId,
    };

    // 5. Guardar en base de datos
    const updatedMember = await this.classroomMemberRepo.save(member);

    // 6. Retornar respuesta formateada
    return this.formatPermissionsResponse(updatedMember);
  }

  /**
   * Obtiene los permisos actuales de un estudiante
   *
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @param teacherId ID del profesor
   * @returns Permisos y estado actual del estudiante
   * @throws NotFoundException Si el estudiante no existe en el aula
   * @throws ForbiddenException Si el profesor no tiene acceso al aula
   */
  async getStudentPermissions(
    classroomId: string,
    studentId: string,
    teacherId: string,
  ): Promise<StudentPermissionsResponseDto> {
    // 1. Validar que el profesor tiene acceso al aula
    await this.validateTeacherAccess(teacherId, classroomId);

    // 2. Obtener el classroom_member
    const member = await this.getClassroomMember(classroomId, studentId);

    // 3. Retornar respuesta formateada
    return this.formatPermissionsResponse(member);
  }

  /**
   * Actualiza permisos granulares de un estudiante
   *
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @param teacherId ID del profesor
   * @param dto Permisos a actualizar
   * @returns Permisos y estado actualizado del estudiante
   * @throws NotFoundException Si el estudiante no existe en el aula
   * @throws ForbiddenException Si el profesor no tiene acceso al aula
   * @throws BadRequestException Si hay conflictos en los permisos
   */
  async updateStudentPermissions(
    classroomId: string,
    studentId: string,
    teacherId: string,
    dto: UpdatePermissionsDto,
  ): Promise<StudentPermissionsResponseDto> {
    // 1. Validar que el profesor tiene acceso al aula
    await this.validateTeacherAccess(teacherId, classroomId);

    // 2. Obtener el classroom_member
    const member = await this.getClassroomMember(classroomId, studentId);

    // 3. Validar que no hay conflictos
    // Si existe blocked_modules y se intenta setear allowed_modules, advertir
    const hasBlockedModules = member.permissions?.blocked_modules?.length > 0;
    if (hasBlockedModules && dto.allowed_modules) {
      // Limpiar blocked_modules si se especifica allowed_modules
      member.permissions.blocked_modules = [];
      member.permissions.block_type = undefined;
    }

    // 4. Merge de permisos (mantener existentes, actualizar solo los provistos)
    member.permissions = {
      ...member.permissions,
      ...dto,
      updated_at: new Date().toISOString(),
      updated_by: teacherId,
    };

    // 5. Guardar en base de datos
    const updatedMember = await this.classroomMemberRepo.save(member);

    // 6. Retornar respuesta formateada
    return this.formatPermissionsResponse(updatedMember);
  }

  /**
   * Valida que el profesor tiene acceso al aula
   *
   * @param teacherId ID del profesor
   * @param classroomId ID del aula
   * @returns Assignment del profesor en el aula
   * @throws ForbiddenException Si el profesor no tiene acceso
   * @private
   */
  private async validateTeacherAccess(
    teacherId: string,
    classroomId: string,
  ): Promise<TeacherClassroom> {
    const assignment = await this.teacherClassroomRepo.findOne({
      where: {
        teacher_id: teacherId,
        classroom_id: classroomId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        `Teacher ${teacherId} does not have access to classroom ${classroomId}`,
      );
    }

    return assignment;
  }

  /**
   * Obtiene un classroom_member
   *
   * @param classroomId ID del aula
   * @param studentId ID del estudiante
   * @returns ClassroomMember
   * @throws NotFoundException Si el estudiante no existe en el aula
   * @private
   */
  private async getClassroomMember(
    classroomId: string,
    studentId: string,
  ): Promise<ClassroomMember> {
    const member = await this.classroomMemberRepo.findOne({
      where: {
        classroom_id: classroomId,
        student_id: studentId,
      },
    });

    if (!member) {
      throw new NotFoundException(
        `Student ${studentId} not found in classroom ${classroomId}`,
      );
    }

    return member;
  }

  /**
   * Formatea un ClassroomMember a StudentPermissionsResponseDto
   *
   * @param member ClassroomMember entity
   * @returns StudentPermissionsResponseDto
   * @private
   */
  private formatPermissionsResponse(
    member: ClassroomMember,
  ): StudentPermissionsResponseDto {
    // Determinar si está bloqueado
    const isBlocked =
      member.status === ClassroomMemberStatusEnum.INACTIVE ||
      !member.is_active ||
      !!member.permissions?.block_type;

    return {
      student_id: member.student_id,
      classroom_id: member.classroom_id,
      status: member.status,
      is_blocked: isBlocked,
      block_type: member.permissions?.block_type,
      permissions: member.permissions || {},
      blocked_at: member.permissions?.blocked_at
        ? new Date(member.permissions.blocked_at)
        : undefined,
      blocked_by: member.permissions?.blocked_by,
      block_reason: member.permissions?.block_reason || member.withdrawal_reason,
    };
  }
}
