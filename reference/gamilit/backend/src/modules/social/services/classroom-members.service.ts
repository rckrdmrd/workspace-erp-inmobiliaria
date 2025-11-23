import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassroomMember } from '../entities';
import { CreateClassroomMemberDto, UpdateClassroomMemberStatusDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { ClassroomMemberStatusEnum } from '@shared/constants/enums.constants';

/**
 * ClassroomMembersService
 *
 * Gestión de membresía de estudiantes en aulas
 * - CRUD de inscripciones
 * - Estados: active, inactive, withdrawn, completed
 * - Tracking de calificaciones y asistencia
 * - Gestión de notas del profesor
 * - Generación de leaderboards por aula
 */
@Injectable()
export class ClassroomMembersService {
  constructor(
    @InjectRepository(ClassroomMember, 'social')
    private readonly classroomMemberRepo: Repository<ClassroomMember>,
  ) {}

  /**
   * Inscribe un estudiante en un aula
   * @param dto - Datos de inscripción
   * @returns Nueva membresía creada
   * @throws ConflictException si el estudiante ya está inscrito
   */
  async create(dto: CreateClassroomMemberDto): Promise<ClassroomMember> {
    // Verificar que no exista inscripción previa
    const existingMember = await this.classroomMemberRepo.findOne({
      where: {
        classroom_id: dto.classroom_id,
        student_id: dto.student_id,
      },
    });

    if (existingMember) {
      throw new ConflictException(
        `Student ${dto.student_id} is already enrolled in classroom ${dto.classroom_id}`,
      );
    }

    const member = this.classroomMemberRepo.create({
      ...dto,
      enrollment_date: new Date(),
      status: ClassroomMemberStatusEnum.ACTIVE,
      is_active: true,
      permissions: dto.permissions || {},
      parent_contact_info: dto.parent_contact_info || {},
      metadata: dto.metadata || {},
    });

    return await this.classroomMemberRepo.save(member);
  }

  /**
   * Obtiene todos los miembros de un aula
   * @param classroomId - ID del aula
   * @returns Lista de miembros ordenados por fecha de inscripción
   */
  async findByClassroomId(classroomId: string): Promise<ClassroomMember[]> {
    return await this.classroomMemberRepo.find({
      where: { classroom_id: classroomId },
      order: { enrollment_date: 'ASC' },
    });
  }

  /**
   * Obtiene todas las aulas en las que está inscrito un estudiante
   * @param userId - ID del estudiante
   * @returns Lista de membresías ordenadas por fecha de inscripción
   */
  async findByUserId(userId: string): Promise<ClassroomMember[]> {
    return await this.classroomMemberRepo.find({
      where: { student_id: userId },
      order: { enrollment_date: 'DESC' },
    });
  }

  /**
   * Obtiene una membresía específica de un estudiante en un aula
   * @param classroomId - ID del aula
   * @param userId - ID del estudiante
   * @returns Membresía encontrada
   * @throws NotFoundException si no existe la membresía
   */
  async findByClassroomAndUser(
    classroomId: string,
    userId: string,
  ): Promise<ClassroomMember> {
    const member = await this.classroomMemberRepo.findOne({
      where: {
        classroom_id: classroomId,
        student_id: userId,
      },
    });

    if (!member) {
      throw new NotFoundException(
        `Student ${userId} is not enrolled in classroom ${classroomId}`,
      );
    }

    return member;
  }

  /**
   * Actualiza el estado de una membresía
   * @param id - ID de la membresía
   * @param status - Nuevo estado
   * @returns Membresía actualizada
   * @throws NotFoundException si no existe la membresía
   */
  async updateStatus(id: string, status: string): Promise<ClassroomMember> {
    const member = await this.classroomMemberRepo.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Classroom member with ID ${id} not found`);
    }

    member.status = status;

    // Si se retira, actualizar fecha y activar flag
    if (status === ClassroomMemberStatusEnum.WITHDRAWN) {
      member.withdrawal_date = new Date();
      member.is_active = false;
    }

    return await this.classroomMemberRepo.save(member);
  }

  /**
   * Registra una calificación final para un estudiante
   * @param id - ID de la membresía
   * @param grade - Calificación (0.0 - 10.0)
   * @returns Membresía actualizada
   * @throws NotFoundException si no existe la membresía
   * @throws BadRequestException si la calificación es inválida
   */
  async recordGrade(id: string, grade: number): Promise<ClassroomMember> {
    // Validar rango de calificación
    if (grade < 0 || grade > 10) {
      throw new BadRequestException('Grade must be between 0.0 and 10.0');
    }

    const member = await this.classroomMemberRepo.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Classroom member with ID ${id} not found`);
    }

    member.final_grade = grade;
    return await this.classroomMemberRepo.save(member);
  }

  /**
   * Actualiza el porcentaje de asistencia de un estudiante
   * @param id - ID de la membresía
   * @param attendance - Porcentaje de asistencia (0.00 - 100.00)
   * @returns Membresía actualizada
   * @throws NotFoundException si no existe la membresía
   * @throws BadRequestException si el porcentaje es inválido
   */
  async updateAttendance(id: string, attendance: number): Promise<ClassroomMember> {
    // Validar rango de asistencia
    if (attendance < 0 || attendance > 100) {
      throw new BadRequestException('Attendance percentage must be between 0 and 100');
    }

    const member = await this.classroomMemberRepo.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Classroom member with ID ${id} not found`);
    }

    member.attendance_percentage = attendance;
    return await this.classroomMemberRepo.save(member);
  }

  /**
   * Retira un estudiante de un aula
   * @param id - ID de la membresía
   * @param reason - Razón del retiro (opcional)
   * @returns Membresía actualizada
   * @throws NotFoundException si no existe la membresía
   */
  async withdraw(id: string, reason?: string): Promise<ClassroomMember> {
    const member = await this.classroomMemberRepo.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Classroom member with ID ${id} not found`);
    }

    member.status = ClassroomMemberStatusEnum.WITHDRAWN;
    member.withdrawal_date = new Date();
    member.withdrawal_reason = reason;
    member.is_active = false;

    return await this.classroomMemberRepo.save(member);
  }

  /**
   * Obtiene todos los miembros activos de un aula
   * @param classroomId - ID del aula
   * @returns Lista de miembros activos ordenados por nombre
   */
  async getActiveMembers(classroomId: string): Promise<ClassroomMember[]> {
    return await this.classroomMemberRepo.find({
      where: {
        classroom_id: classroomId,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
      },
      order: { enrollment_date: 'ASC' },
    });
  }

  /**
   * Obtiene el leaderboard de un aula (ranking por calificación o XP)
   * @param classroomId - ID del aula
   * @returns Lista de miembros ordenados por final_grade DESC
   */
  async getClassroomLeaderboard(classroomId: string): Promise<ClassroomMember[]> {
    return await this.classroomMemberRepo.find({
      where: {
        classroom_id: classroomId,
        status: ClassroomMemberStatusEnum.ACTIVE,
      },
      order: { final_grade: 'DESC' },
    });
  }
}
