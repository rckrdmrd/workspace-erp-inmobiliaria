import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { StudentBlockingService } from '../services/student-blocking.service';
import { ClassroomMember } from '@modules/social/entities/classroom-member.entity';
import { TeacherClassroom } from '@modules/social/entities/teacher-classroom.entity';
import { Profile } from '@modules/auth/entities/profile.entity';
import { ClassroomMemberStatusEnum } from '@shared/constants/enums.constants';
import { BlockStudentDto, BlockType, UpdatePermissionsDto } from '../dto/student-blocking';

describe('StudentBlockingService', () => {
  let service: StudentBlockingService;
  let classroomMemberRepository: Repository<ClassroomMember>;
  let teacherClassroomRepository: Repository<TeacherClassroom>;
  let profileRepository: Repository<Profile>;

  const mockClassroomMemberRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockTeacherClassroomRepository = {
    findOne: jest.fn(),
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentBlockingService,
        {
          provide: getRepositoryToken(ClassroomMember, 'social'),
          useValue: mockClassroomMemberRepository,
        },
        {
          provide: getRepositoryToken(TeacherClassroom, 'social'),
          useValue: mockTeacherClassroomRepository,
        },
        {
          provide: getRepositoryToken(Profile, 'auth'),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<StudentBlockingService>(StudentBlockingService);
    classroomMemberRepository = module.get(
      getRepositoryToken(ClassroomMember, 'social'),
    );
    teacherClassroomRepository = module.get(
      getRepositoryToken(TeacherClassroom, 'social'),
    );
    profileRepository = module.get(getRepositoryToken(Profile, 'auth'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('blockStudent', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';
    const teacherId = 'teacher-1';

    const mockTeacherAssignment = {
      id: 'assignment-1',
      teacher_id: teacherId,
      classroom_id: classroomId,
    } as TeacherClassroom;

    const mockClassroomMember = {
      id: 'member-1',
      classroom_id: classroomId,
      student_id: studentId,
      status: ClassroomMemberStatusEnum.ACTIVE,
      is_active: true,
      permissions: {},
    } as unknown as ClassroomMember;

    it('should block student with full block', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Inappropriate behavior',
        block_type: BlockType.FULL,
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(
        mockClassroomMember,
      );
      mockClassroomMemberRepository.save.mockResolvedValue({
        ...mockClassroomMember,
        status: ClassroomMemberStatusEnum.INACTIVE,
        is_active: false,
        withdrawal_reason: dto.reason,
        permissions: {
          block_type: BlockType.FULL,
          blocked_at: expect.any(String),
          blocked_by: teacherId,
          block_reason: dto.reason,
        },
      });

      // Act
      const result = await service.blockStudent(
        classroomId,
        studentId,
        teacherId,
        dto,
      );

      // Assert
      expect(result.is_blocked).toBe(true);
      expect(result.status).toBe(ClassroomMemberStatusEnum.INACTIVE);
      expect(result.block_type).toBe(BlockType.FULL);
      expect(mockClassroomMemberRepository.save).toHaveBeenCalled();
    });

    it('should block student with partial block', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Incomplete prerequisites',
        block_type: BlockType.PARTIAL,
        blocked_modules: ['module-1', 'module-2'],
        blocked_exercises: ['exercise-1'],
      };

      // Create fresh copy to avoid mutation from previous tests
      const freshMember = {
        ...mockClassroomMember,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {},
      } as unknown as ClassroomMember;

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(freshMember);
      mockClassroomMemberRepository.save.mockResolvedValue({
        ...mockClassroomMember,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {
          block_type: BlockType.PARTIAL,
          blocked_modules: dto.blocked_modules,
          blocked_exercises: dto.blocked_exercises,
          blocked_at: expect.any(String),
          blocked_by: teacherId,
          block_reason: dto.reason,
        },
      });

      // Act
      const result = await service.blockStudent(
        classroomId,
        studentId,
        teacherId,
        dto,
      );

      // Assert
      expect(result.is_blocked).toBe(true);
      expect(result.status).toBe(ClassroomMemberStatusEnum.ACTIVE);
      expect(result.block_type).toBe(BlockType.PARTIAL);
      expect(result.permissions.blocked_modules).toEqual(['module-1', 'module-2']);
    });

    it('should throw ForbiddenException if teacher has no access', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Test',
        block_type: BlockType.FULL,
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.blockStudent(classroomId, studentId, teacherId, dto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if student not in classroom', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Test',
        block_type: BlockType.FULL,
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.blockStudent(classroomId, studentId, teacherId, dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if student already blocked', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Test',
        block_type: BlockType.FULL,
      };

      const blockedMember = {
        ...mockClassroomMember,
        status: ClassroomMemberStatusEnum.INACTIVE,
        is_active: false,
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(blockedMember);

      // Act & Assert
      await expect(
        service.blockStudent(classroomId, studentId, teacherId, dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unblockStudent', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';
    const teacherId = 'teacher-1';

    const mockTeacherAssignment = {
      id: 'assignment-1',
      teacher_id: teacherId,
      classroom_id: classroomId,
    } as TeacherClassroom;

    it('should unblock a blocked student', async () => {
      // Arrange
      const blockedMember = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.INACTIVE,
        is_active: false,
        withdrawal_reason: 'Was blocked',
        permissions: {
          block_type: BlockType.FULL,
          blocked_at: '2025-11-11T20:00:00Z',
          blocked_by: teacherId,
        },
      } as unknown as ClassroomMember;

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(blockedMember);
      mockClassroomMemberRepository.save.mockResolvedValue({
        ...blockedMember,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        withdrawal_reason: undefined,
        permissions: {
          unblocked_at: expect.any(String),
          unblocked_by: teacherId,
        },
      });

      // Act
      const result = await service.unblockStudent(
        classroomId,
        studentId,
        teacherId,
      );

      // Assert
      expect(result.is_blocked).toBe(false);
      expect(result.status).toBe(ClassroomMemberStatusEnum.ACTIVE);
      expect(mockClassroomMemberRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if student not blocked', async () => {
      // Arrange
      const activeMember = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {},
      } as unknown as ClassroomMember;

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(activeMember);

      // Act & Assert
      await expect(
        service.unblockStudent(classroomId, studentId, teacherId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if teacher has no access', async () => {
      // Arrange
      mockTeacherClassroomRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.unblockStudent(classroomId, studentId, teacherId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getStudentPermissions', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';
    const teacherId = 'teacher-1';

    const mockTeacherAssignment = {
      id: 'assignment-1',
      teacher_id: teacherId,
      classroom_id: classroomId,
    } as TeacherClassroom;

    it('should return student permissions', async () => {
      // Arrange
      const member = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {
          allowed_modules: ['module-1'],
          can_submit_assignments: true,
        },
      } as unknown as ClassroomMember;

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(member);

      // Act
      const result = await service.getStudentPermissions(
        classroomId,
        studentId,
        teacherId,
      );

      // Assert
      expect(result.student_id).toBe(studentId);
      expect(result.classroom_id).toBe(classroomId);
      expect(result.is_blocked).toBe(false);
      expect(result.permissions).toHaveProperty('allowed_modules');
    });

    it('should identify blocked student correctly', async () => {
      // Arrange
      const blockedMember = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.INACTIVE,
        is_active: false,
        permissions: { block_type: BlockType.FULL },
      } as unknown as ClassroomMember;

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(blockedMember);

      // Act
      const result = await service.getStudentPermissions(
        classroomId,
        studentId,
        teacherId,
      );

      // Assert
      expect(result.is_blocked).toBe(true);
      expect(result.block_type).toBe(BlockType.FULL);
    });
  });

  describe('updateStudentPermissions', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';
    const teacherId = 'teacher-1';

    const mockTeacherAssignment = {
      id: 'assignment-1',
      teacher_id: teacherId,
      classroom_id: classroomId,
    } as TeacherClassroom;

    it('should update student permissions', async () => {
      // Arrange
      const member = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {},
      } as unknown as ClassroomMember;

      const dto: UpdatePermissionsDto = {
        allowed_modules: ['module-1', 'module-2'],
        can_submit_assignments: false,
        can_view_leaderboard: true,
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(member);
      mockClassroomMemberRepository.save.mockResolvedValue({
        ...member,
        permissions: {
          ...dto,
          updated_at: expect.any(String),
          updated_by: teacherId,
        },
      });

      // Act
      const result = await service.updateStudentPermissions(
        classroomId,
        studentId,
        teacherId,
        dto,
      );

      // Assert
      expect(result.permissions.allowed_modules).toEqual(['module-1', 'module-2']);
      expect(result.permissions.can_submit_assignments).toBe(false);
      expect(mockClassroomMemberRepository.save).toHaveBeenCalled();
    });

    it('should clear blocked_modules when setting allowed_modules', async () => {
      // Arrange
      const member = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {
          block_type: BlockType.PARTIAL,
          blocked_modules: ['module-3', 'module-4'],
        },
      } as unknown as ClassroomMember;

      const dto: UpdatePermissionsDto = {
        allowed_modules: ['module-1'],
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(member);
      mockClassroomMemberRepository.save.mockImplementation(
        async (entity) => entity,
      );

      // Act
      const result = await service.updateStudentPermissions(
        classroomId,
        studentId,
        teacherId,
        dto,
      );

      // Assert
      expect(result.permissions.blocked_modules).toEqual([]);
      expect(result.permissions.block_type).toBeUndefined();
    });

    it('should merge with existing permissions', async () => {
      // Arrange
      const member = {
        id: 'member-1',
        classroom_id: classroomId,
        student_id: studentId,
        status: ClassroomMemberStatusEnum.ACTIVE,
        is_active: true,
        permissions: {
          can_view_leaderboard: true,
          existing_field: 'value',
        },
      } as unknown as ClassroomMember;

      const dto: UpdatePermissionsDto = {
        can_submit_assignments: false,
      };

      mockTeacherClassroomRepository.findOne.mockResolvedValue(
        mockTeacherAssignment,
      );
      mockClassroomMemberRepository.findOne.mockResolvedValue(member);
      mockClassroomMemberRepository.save.mockImplementation(
        async (entity) => entity,
      );

      // Act
      const result = await service.updateStudentPermissions(
        classroomId,
        studentId,
        teacherId,
        dto,
      );

      // Assert
      expect(result.permissions.can_view_leaderboard).toBe(true);
      expect(result.permissions.can_submit_assignments).toBe(false);
      expect(result.permissions.existing_field).toBe('value');
    });
  });
});
