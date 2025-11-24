import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherClassroom } from '@modules/social/entities/teacher-classroom.entity';

/**
 * ClassroomOwnershipGuard
 *
 * @description Guard para verificar que el profesor tiene acceso al aula
 * @module teacher/guards
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, TeacherGuard, ClassroomOwnershipGuard)
 *
 * Validaciones:
 * - Requiere que el usuario esté autenticado (JwtAuthGuard)
 * - Requiere que el usuario sea profesor (TeacherGuard)
 * - Verifica que existe una asignación teacher_classrooms para el par (teacher_id, classroom_id)
 * - Extrae classroomId del path param `:classroomId`
 *
 * @example
 * @Post(':classroomId/students/:studentId/block')
 * @UseGuards(JwtAuthGuard, TeacherGuard, ClassroomOwnershipGuard)
 * async blockStudent(@Param('classroomId') classroomId: string) {
 *   // Solo profesores asignados a este aula pueden bloquear estudiantes
 * }
 */
@Injectable()
export class ClassroomOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(TeacherClassroom, 'social')
    private readonly teacherClassroomRepo: Repository<TeacherClassroom>,
  ) {}

  /**
   * Determina si la petición puede continuar
   *
   * @param context Contexto de ejecución de NestJS
   * @returns true si el profesor tiene acceso al aula, lanza ForbiddenException si no
   * @throws ForbiddenException si el profesor no tiene acceso al aula
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const classroomId = request.params.classroomId;

    // Validar que tenemos la información necesaria
    if (!user || !user.sub) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!classroomId) {
      throw new ForbiddenException('Classroom ID not provided in request');
    }

    // Verificar que el profesor tiene una asignación en este aula
    const assignment = await this.teacherClassroomRepo.findOne({
      where: {
        teacher_id: user.sub,
        classroom_id: classroomId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        `Teacher ${user.sub} does not have access to classroom ${classroomId}`,
      );
    }

    // El profesor tiene acceso, permitir la petición
    return true;
  }
}
