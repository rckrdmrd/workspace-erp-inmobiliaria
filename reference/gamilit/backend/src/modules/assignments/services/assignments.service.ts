/**
 * Assignments Service
 *
 * Service for managing teacher assignments (tasks, quizzes, exams, projects)
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../entities/assignment.entity';
import { AssignmentClassroom } from '../entities/assignment-classroom.entity';
import { AssignmentExercise } from '../entities/assignment-exercise.entity';
import { AssignmentStudent } from '../entities/assignment-student.entity';
import { AssignmentSubmission } from '../entities/assignment-submission.entity';
import { CreateAssignmentDto } from '../dto/create-assignment.dto';
import { UpdateAssignmentDto } from '../dto/update-assignment.dto';
import { AssignToClassroomsDto } from '../dto/assign-to-classrooms.dto';
import { GradeSubmissionDto } from '../dto/grade-submission.dto';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(
    @InjectRepository(Assignment, 'content')
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentClassroom, 'content')
    private readonly assignmentClassroomRepository: Repository<AssignmentClassroom>,
    @InjectRepository(AssignmentExercise, 'content')
    private readonly assignmentExerciseRepository: Repository<AssignmentExercise>,
    @InjectRepository(AssignmentStudent, 'content')
    private readonly assignmentStudentRepository: Repository<AssignmentStudent>,
    @InjectRepository(AssignmentSubmission, 'content')
    private readonly submissionRepository: Repository<AssignmentSubmission>,
  ) {}

  /**
   * Create a new assignment
   */
  async create(createDto: CreateAssignmentDto, teacherId: string): Promise<Assignment> {
    // Sanitize HTML in description
    const sanitizedDescription = this.sanitizeHtml(createDto.description);

    const assignment = this.assignmentRepository.create({
      ...createDto,
      teacherId,
      description: sanitizedDescription,
      dueDate: createDto.deadline ? new Date(createDto.deadline) : null,
      isPublished: false, // New assignments start as drafts
    });

    const saved = await this.assignmentRepository.save(assignment);

    this.logger.log(`Assignment created: ${saved.id} by teacher ${teacherId}`);

    return saved;
  }

  /**
   * Get all assignments for a teacher
   */
  async findAll(teacherId: string, filters?: {
    isPublished?: boolean;
    assignmentType?: string;
    search?: string;
  }): Promise<Assignment[]> {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.teacherId = :teacherId', { teacherId });

    if (filters?.isPublished !== undefined) {
      queryBuilder.andWhere('assignment.isPublished = :isPublished', { isPublished: filters.isPublished });
    }

    if (filters?.assignmentType) {
      queryBuilder.andWhere('assignment.assignmentType = :assignmentType', {
        assignmentType: filters.assignmentType,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(LOWER(assignment.title) LIKE LOWER(:search) OR LOWER(assignment.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy('assignment.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Get single assignment by ID
   */
  async findOne(id: string, teacherId: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, teacherId, isPublished: true },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  /**
   * Update assignment
   * REQ-TCH-028: Only allow if no submissions exist
   */
  async update(
    id: string,
    updateDto: UpdateAssignmentDto,
    teacherId: string,
  ): Promise<Assignment> {
    const assignment = await this.findOne(id, teacherId);

    // Check if assignment has submissions
    const submissionsCount = await this.submissionRepository.count({
      where: { assignmentId: id },
    });

    if (submissionsCount > 0) {
      throw new UnprocessableEntityException(
        'Cannot update assignment with existing submissions',
      );
    }

    // Sanitize HTML fields if provided
    if (updateDto.description !== undefined) {
      updateDto.description = this.sanitizeHtml(updateDto.description) || undefined;
    }
    // TODO: Handle instructions field if/when added to entity
    // if (updateDto.instructions !== undefined) {
    //   updateDto.instructions = this.sanitizeHtml(updateDto.instructions);
    // }

    // Update fields
    Object.assign(assignment, updateDto);

    if (updateDto.deadline) {
      assignment.dueDate = new Date(updateDto.deadline);
    }

    const updated = await this.assignmentRepository.save(assignment);

    this.logger.log(`Assignment updated: ${id} by teacher ${teacherId}`);

    return updated;
  }

  /**
   * Patch assignment (partial update)
   * Allows updates even with submissions, but blocks critical fields
   * REQ-TCH-091: Partial updates permitted
   */
  async patchAssignment(
    id: string,
    patchDto: any,
    teacherId: string,
  ): Promise<Assignment> {
    // 1. Verify ownership
    const assignment = await this.assignmentRepository.findOne({
      where: { id, teacherId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found or access denied`);
    }

    // 2. Check for submissions
    const submissionsCount = await this.submissionRepository.count({
      where: { assignmentId: id },
    });

    // 3. Block critical field changes if submissions exist
    if (submissionsCount > 0) {
      const blockedFields = [];
      if (patchDto.assignmentType !== undefined) blockedFields.push('assignmentType');
      if (patchDto.totalPoints !== undefined) blockedFields.push('totalPoints');
      if (patchDto.dueDate !== undefined) blockedFields.push('dueDate');

      if (blockedFields.length > 0) {
        throw new UnprocessableEntityException(
          `Cannot change ${blockedFields.join(', ')} when submissions exist (${submissionsCount} submissions)`,
        );
      }
    }

    // 4. Sanitize HTML fields
    if (patchDto.description !== undefined) {
      patchDto.description = this.sanitizeHtml(patchDto.description) || undefined;
    }
    if (patchDto.instructions !== undefined) {
      patchDto.instructions = this.sanitizeHtml(patchDto.instructions) || undefined;
    }

    // 5. Apply partial update
    Object.keys(patchDto).forEach((key) => {
      if (patchDto[key] !== undefined) {
        if (key === 'dueDate') {
          assignment.dueDate = new Date(patchDto.dueDate);
        } else {
          (assignment as any)[key] = patchDto[key];
        }
      }
    });

    const updated = await this.assignmentRepository.save(assignment);

    this.logger.log(`Assignment patched: ${id} by teacher ${teacherId} (${submissionsCount} submissions)`);

    return updated;
  }

  /**
   * Distribute assignment to classrooms and/or students
   * Enhanced version of assignToClassrooms with more options
   * REQ-TCH-091: Assignment distribution
   */
  async distributeAssignment(
    assignmentId: string,
    dto: any,
    teacherId: string,
  ): Promise<any> {
    // 1. Verify ownership
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId, teacherId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found or access denied`);
    }

    const result: any = {
      classroomsSuccess: 0,
      classroomsFailed: 0,
      studentsSuccess: 0,
      studentsFailed: 0,
      published: assignment.isPublished,
      notificationsSent: false,
    };

    // 2. Distribute to classrooms
    for (const classroom of dto.classrooms) {
      try {
        // Validate deadline override is in future
        if (classroom.deadlineOverride) {
          const overrideDate = new Date(classroom.deadlineOverride);
          if (overrideDate < new Date()) {
            this.logger.warn(`Deadline override for classroom ${classroom.classroomId} is in the past`);
            result.classroomsFailed++;
            continue;
          }
        }

        // Check if already assigned
        const existing = await this.assignmentClassroomRepository.findOne({
          where: {
            assignmentId,
            classroomId: classroom.classroomId,
          },
        });

        if (existing) {
          this.logger.warn(`Assignment already distributed to classroom ${classroom.classroomId}`);
          result.classroomsFailed++;
          continue;
        }

        // Create distribution
        const assignmentClassroom = this.assignmentClassroomRepository.create({
          assignmentId,
          classroomId: classroom.classroomId,
          deadlineOverride: classroom.deadlineOverride ? new Date(classroom.deadlineOverride) : null,
          studentsCount: 0, // TODO: Calculate from classroom
        });

        await this.assignmentClassroomRepository.save(assignmentClassroom);
        result.classroomsSuccess++;
      } catch (error) {
        this.logger.error(`Failed to distribute to classroom ${classroom.classroomId}:`, error);
        result.classroomsFailed++;
      }
    }

    // 3. Distribute to individual students (if provided)
    if (dto.studentIds && dto.studentIds.length > 0) {
      for (const studentId of dto.studentIds) {
        try {
          const existing = await this.assignmentStudentRepository.findOne({
            where: { assignmentId, studentId },
          });

          if (existing) {
            result.studentsFailed++;
            continue;
          }

          const assignmentStudent = this.assignmentStudentRepository.create({
            assignmentId,
            studentId,
          });

          await this.assignmentStudentRepository.save(assignmentStudent);
          result.studentsSuccess++;
        } catch (error) {
          this.logger.error(`Failed to distribute to student ${studentId}:`, error);
          result.studentsFailed++;
        }
      }
    }

    // 4. Publish if requested
    if (dto.publishOnDistribute && !assignment.isPublished) {
      assignment.isPublished = true;
      await this.assignmentRepository.save(assignment);
      result.published = true;
      result.publishedAt = new Date().toISOString();
    }

    // 5. Send notifications (mock - to be implemented)
    if (dto.sendNotifications) {
      // TODO: Integrate with notification service
      result.notificationsSent = true;
      this.logger.log(`Notifications sent for assignment ${assignmentId}`);
    }

    this.logger.log(
      `Assignment ${assignmentId} distributed: ${result.classroomsSuccess} classrooms, ${result.studentsSuccess} students`,
    );

    return result;
  }

  /**
   * Duplicate assignment with optional modifications
   * Creates a new assignment with same properties but new ID
   * REQ-TCH-091: Assignment duplication
   */
  async duplicateAssignment(
    originalId: string,
    dto: any,
    teacherId: string,
  ): Promise<any> {
    // 1. Get original assignment and verify ownership
    const original = await this.assignmentRepository.findOne({
      where: { id: originalId, teacherId },
    });

    if (!original) {
      throw new NotFoundException(`Assignment with ID ${originalId} not found or access denied`);
    }

    // 2. Create duplicate (omit id, timestamps)
    const newTitle = dto.newTitle || `Copy of ${original.title}`;
    const newDueDate = dto.newDueDate ? new Date(dto.newDueDate) : original.dueDate;

    const duplicate = this.assignmentRepository.create({
      teacherId: original.teacherId,
      title: newTitle,
      description: original.description,
      assignmentType: original.assignmentType,
      totalPoints: original.totalPoints,
      dueDate: newDueDate,
      isPublished: false, // Always start as draft
    });

    const saved = await this.assignmentRepository.save(duplicate);

    const response: any = {
      id: saved.id,
      title: saved.title,
      originalId: originalId,
      classroomsCopied: 0,
      exercisesCopied: 0,
      isPublished: false,
    };

    // 3. Copy classroom assignments if requested
    if (dto.copyClassroomAssignments) {
      const classrooms = await this.assignmentClassroomRepository.find({
        where: { assignmentId: originalId },
      });

      for (const ac of classrooms) {
        try {
          const newAC = this.assignmentClassroomRepository.create({
            assignmentId: saved.id,
            classroomId: ac.classroomId,
            deadlineOverride: ac.deadlineOverride,
            studentsCount: 0,
          });
          await this.assignmentClassroomRepository.save(newAC);
          response.classroomsCopied++;
        } catch (error) {
          this.logger.error(`Failed to copy classroom assignment ${ac.id}:`, error);
        }
      }
    }

    // 4. Copy exercises if requested (default: true)
    if (dto.copyExercises !== false) {
      const exercises = await this.assignmentExerciseRepository.find({
        where: { assignmentId: originalId },
        order: { orderIndex: 'ASC' },
      });

      for (const ex of exercises) {
        try {
          const newEx = this.assignmentExerciseRepository.create({
            assignmentId: saved.id,
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex,
            pointsOverride: ex.pointsOverride,
            isRequired: ex.isRequired,
          });
          await this.assignmentExerciseRepository.save(newEx);
          response.exercisesCopied++;
        } catch (error) {
          this.logger.error(`Failed to copy exercise ${ex.id}:`, error);
        }
      }
    }

    this.logger.log(
      `Assignment ${originalId} duplicated to ${saved.id} (${response.classroomsCopied} classrooms, ${response.exercisesCopied} exercises)`,
    );

    return response;
  }

  /**
   * Soft delete assignment
   * REQ-TCH-037: Soft delete (is_active = false)
   */
  async remove(id: string, teacherId: string): Promise<void> {
    const assignment = await this.findOne(id, teacherId);

    assignment.isPublished = false;
    await this.assignmentRepository.save(assignment);

    this.logger.log(`Assignment soft deleted: ${id} by teacher ${teacherId}`);
  }

  /**
   * Assign assignment to classrooms
   * REQ-TCH-031: Allow assignment to multiple classrooms
   */
  async assignToClassrooms(
    assignmentId: string,
    dto: AssignToClassroomsDto,
    teacherId: string,
  ): Promise<{ success: number; failed: number }> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    let successCount = 0;
    let failedCount = 0;

    for (const classroom of dto.classrooms) {
      try {
        // Check if already assigned
        const existing = await this.assignmentClassroomRepository.findOne({
          where: {
            assignmentId,
            classroomId: classroom.classroomId,
          },
        });

        if (existing) {
          failedCount++;
          continue;
        }

        // Create assignment-classroom relationship
        const assignmentClassroom = this.assignmentClassroomRepository.create({
          assignmentId,
          classroomId: classroom.classroomId,
          deadlineOverride: classroom.deadlineOverride
            ? new Date(classroom.deadlineOverride)
            : null,
          studentsCount: 0, // TODO: Calculate from classroom
        });

        await this.assignmentClassroomRepository.save(assignmentClassroom);
        successCount++;
      } catch (error) {
        this.logger.error(
          `Failed to assign to classroom ${classroom.classroomId}:`,
          error,
        );
        failedCount++;
      }
    }

    this.logger.log(
      `Assignment ${assignmentId} assigned to classrooms: ${successCount} success, ${failedCount} failed`,
    );

    return { success: successCount, failed: failedCount };
  }

  /**
   * Get all submissions for an assignment
   */
  async getSubmissions(
    assignmentId: string,
    teacherId: string,
    filters?: {
      status?: string;
      classroomId?: string;
    },
  ): Promise<AssignmentSubmission[]> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    const queryBuilder = this.submissionRepository
      .createQueryBuilder('submission')
      .where('submission.assignmentId = :assignmentId', { assignmentId });

    if (filters?.status) {
      queryBuilder.andWhere('submission.status = :status', { status: filters.status });
    }

    if (filters?.classroomId) {
      queryBuilder.andWhere('submission.classroomId = :classroomId', {
        classroomId: filters.classroomId,
      });
    }

    queryBuilder.orderBy('submission.submittedAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Grade a submission
   */
  async gradeSubmission(
    submissionId: string,
    dto: GradeSubmissionDto,
    teacherId: string,
  ): Promise<AssignmentSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${submissionId} not found`);
    }

    // Verify teacher owns the assignment and get total points
    const assignment = await this.findOne(submission.assignmentId, teacherId);

    // Validate score doesn't exceed max points
    if (dto.score > assignment.totalPoints) {
      throw new UnprocessableEntityException(
        `Score cannot exceed max points (${assignment.totalPoints})`,
      );
    }

    // Update submission
    submission.score = dto.score;
    submission.feedback = dto.feedback || null;
    submission.gradedBy = teacherId;
    submission.gradedAt = new Date();
    submission.status = 'graded' as any;

    const graded = await this.submissionRepository.save(submission);

    this.logger.log(`Submission graded: ${submissionId} by teacher ${teacherId}`);

    return graded;
  }

  /**
   * Add exercises to an assignment
   * Creates M2M relationships in assignment_exercises table
   */
  async addExercisesToAssignment(
    assignmentId: string,
    exerciseIds: Array<{
      exerciseId: string;
      orderIndex: number;
      pointsOverride?: number;
      isRequired?: boolean;
    }>,
    teacherId: string,
  ): Promise<AssignmentExercise[]> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    const createdExercises: AssignmentExercise[] = [];

    for (const exerciseData of exerciseIds) {
      // Check if already assigned
      const existing = await this.assignmentExerciseRepository.findOne({
        where: {
          assignmentId,
          exerciseId: exerciseData.exerciseId,
        },
      });

      if (existing) {
        this.logger.warn(
          `Exercise ${exerciseData.exerciseId} already assigned to ${assignmentId}`,
        );
        continue;
      }

      const assignmentExercise = this.assignmentExerciseRepository.create({
        assignmentId,
        exerciseId: exerciseData.exerciseId,
        orderIndex: exerciseData.orderIndex,
        pointsOverride: exerciseData.pointsOverride || null,
        isRequired: exerciseData.isRequired !== undefined ? exerciseData.isRequired : true,
      });

      const saved = await this.assignmentExerciseRepository.save(assignmentExercise);
      createdExercises.push(saved);
    }

    this.logger.log(
      `Added ${createdExercises.length} exercises to assignment ${assignmentId}`,
    );

    return createdExercises;
  }

  /**
   * Remove exercise from assignment
   */
  async removeExerciseFromAssignment(
    assignmentId: string,
    exerciseId: string,
    teacherId: string,
  ): Promise<void> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    const result = await this.assignmentExerciseRepository.delete({
      assignmentId,
      exerciseId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Exercise ${exerciseId} not found in assignment ${assignmentId}`,
      );
    }

    this.logger.log(`Removed exercise ${exerciseId} from assignment ${assignmentId}`);
  }

  /**
   * Reorder exercises in an assignment
   */
  async reorderExercises(
    assignmentId: string,
    orderedExerciseIds: Array<{ exerciseId: string; orderIndex: number }>,
    teacherId: string,
  ): Promise<void> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    for (const { exerciseId, orderIndex } of orderedExerciseIds) {
      await this.assignmentExerciseRepository.update(
        { assignmentId, exerciseId },
        { orderIndex },
      );
    }

    this.logger.log(`Reordered exercises for assignment ${assignmentId}`);
  }

  /**
   * Get all exercises for an assignment
   */
  async getAssignmentExercises(
    assignmentId: string,
    teacherId: string,
  ): Promise<AssignmentExercise[]> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    return this.assignmentExerciseRepository.find({
      where: { assignmentId },
      order: { orderIndex: 'ASC' },
    });
  }

  /**
   * Assign assignment to individual students
   * Used for remedial or advanced assignments
   */
  async assignToStudents(
    assignmentId: string,
    studentIds: string[],
    teacherId: string,
  ): Promise<{ success: number; failed: number }> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    let successCount = 0;
    let failedCount = 0;

    for (const studentId of studentIds) {
      try {
        // Check if already assigned
        const existing = await this.assignmentStudentRepository.findOne({
          where: {
            assignmentId,
            studentId,
          },
        });

        if (existing) {
          failedCount++;
          continue;
        }

        const assignmentStudent = this.assignmentStudentRepository.create({
          assignmentId,
          studentId,
        });

        await this.assignmentStudentRepository.save(assignmentStudent);
        successCount++;
      } catch (error) {
        this.logger.error(`Failed to assign to student ${studentId}:`, error);
        failedCount++;
      }
    }

    this.logger.log(
      `Assignment ${assignmentId} assigned to students: ${successCount} success, ${failedCount} failed`,
    );

    return { success: successCount, failed: failedCount };
  }

  /**
   * Remove student from assignment
   */
  async removeStudentAssignment(
    assignmentId: string,
    studentId: string,
    teacherId: string,
  ): Promise<void> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    const result = await this.assignmentStudentRepository.delete({
      assignmentId,
      studentId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Student ${studentId} not assigned to ${assignmentId}`,
      );
    }

    this.logger.log(`Removed student ${studentId} from assignment ${assignmentId}`);
  }

  /**
   * Get all students assigned to an assignment
   */
  async getAssignedStudents(
    assignmentId: string,
    teacherId: string,
  ): Promise<AssignmentStudent[]> {
    // Verify ownership
    await this.findOne(assignmentId, teacherId);

    return this.assignmentStudentRepository.find({
      where: { assignmentId },
      order: { assignedAt: 'ASC' },
    });
  }

  /**
   * Sanitize HTML to prevent XSS
   * REQ-TCH-021: HTML sanitization
   */
  private sanitizeHtml(html?: string): string | null {
    if (!html) return null;

    // Basic sanitization - in production use DOMPurify
    // For now, strip script tags and dangerous attributes
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');

    return sanitized;
  }
}
