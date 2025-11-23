import { Test, TestingModule } from '@nestjs/testing';
import { TeacherClassroomsController } from '../controllers/teacher-classrooms.controller';
import { StudentBlockingService } from '../services/student-blocking.service';
import { TeacherGuard, ClassroomOwnershipGuard } from '../guards';
import {
  BlockStudentDto,
  BlockType,
  UpdatePermissionsDto,
  StudentPermissionsResponseDto,
} from '../dto/student-blocking';
import { ClassroomMemberStatusEnum } from '@shared/constants/enums.constants';

describe('TeacherClassroomsController', () => {
  let controller: TeacherClassroomsController;
  let service: StudentBlockingService;

  const mockStudentBlockingService = {
    blockStudent: jest.fn(),
    unblockStudent: jest.fn(),
    getStudentPermissions: jest.fn(),
    updateStudentPermissions: jest.fn(),
  };

  const mockGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherClassroomsController],
      providers: [
        {
          provide: StudentBlockingService,
          useValue: mockStudentBlockingService,
        },
      ],
    })
      .overrideGuard(TeacherGuard)
      .useValue(mockGuard)
      .overrideGuard(ClassroomOwnershipGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<TeacherClassroomsController>(
      TeacherClassroomsController,
    );
    service = module.get<StudentBlockingService>(StudentBlockingService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockRequest = {
    user: {
      sub: 'teacher-1',
      email: 'teacher@test.com',
      role: 'admin_teacher',
    },
  };

  describe('blockStudent', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';

    const mockResponse: StudentPermissionsResponseDto = {
      student_id: studentId,
      classroom_id: classroomId,
      status: ClassroomMemberStatusEnum.INACTIVE,
      is_blocked: true,
      block_type: BlockType.FULL,
      permissions: {
        block_type: BlockType.FULL,
        blocked_at: '2025-11-11T20:00:00Z',
        blocked_by: 'teacher-1',
        block_reason: 'Inappropriate behavior',
      },
      blocked_at: new Date('2025-11-11T20:00:00Z'),
      blocked_by: 'teacher-1',
      block_reason: 'Inappropriate behavior',
    };

    it('should block student with full block', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Inappropriate behavior',
        block_type: BlockType.FULL,
      };

      mockStudentBlockingService.blockStudent.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.blockStudent(
        classroomId,
        studentId,
        dto,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockStudentBlockingService.blockStudent).toHaveBeenCalledWith(
        classroomId,
        studentId,
        'teacher-1',
        dto,
      );
    });

    it('should block student with partial block', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Incomplete prerequisites',
        block_type: BlockType.PARTIAL,
        blocked_modules: ['module-1', 'module-2'],
      };

      const partialResponse: StudentPermissionsResponseDto = {
        ...mockResponse,
        status: ClassroomMemberStatusEnum.ACTIVE,
        block_type: BlockType.PARTIAL,
        permissions: {
          block_type: BlockType.PARTIAL,
          blocked_modules: ['module-1', 'module-2'],
        },
      };

      mockStudentBlockingService.blockStudent.mockResolvedValue(
        partialResponse,
      );

      // Act
      const result = await controller.blockStudent(
        classroomId,
        studentId,
        dto,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(partialResponse);
      expect(result.block_type).toBe(BlockType.PARTIAL);
    });

    it('should extract teacherId from request.user.sub', async () => {
      // Arrange
      const dto: BlockStudentDto = {
        reason: 'Test',
        block_type: BlockType.FULL,
      };

      mockStudentBlockingService.blockStudent.mockResolvedValue(mockResponse);

      // Act
      await controller.blockStudent(classroomId, studentId, dto, mockRequest);

      // Assert
      const callArgs = mockStudentBlockingService.blockStudent.mock.calls[0];
      expect(callArgs[2]).toBe('teacher-1'); // teacherId from mockRequest.user.sub
    });
  });

  describe('unblockStudent', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';

    const mockResponse: StudentPermissionsResponseDto = {
      student_id: studentId,
      classroom_id: classroomId,
      status: ClassroomMemberStatusEnum.ACTIVE,
      is_blocked: false,
      permissions: {
        unblocked_at: '2025-11-11T20:30:00Z',
        unblocked_by: 'teacher-1',
      },
    };

    it('should unblock student', async () => {
      // Arrange
      mockStudentBlockingService.unblockStudent.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.unblockStudent(
        classroomId,
        studentId,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.is_blocked).toBe(false);
      expect(mockStudentBlockingService.unblockStudent).toHaveBeenCalledWith(
        classroomId,
        studentId,
        'teacher-1',
      );
    });

    it('should extract teacherId from request', async () => {
      // Arrange
      mockStudentBlockingService.unblockStudent.mockResolvedValue(mockResponse);

      // Act
      await controller.unblockStudent(classroomId, studentId, mockRequest);

      // Assert
      const callArgs = mockStudentBlockingService.unblockStudent.mock.calls[0];
      expect(callArgs[2]).toBe('teacher-1');
    });
  });

  describe('getStudentPermissions', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';

    const mockResponse: StudentPermissionsResponseDto = {
      student_id: studentId,
      classroom_id: classroomId,
      status: ClassroomMemberStatusEnum.ACTIVE,
      is_blocked: false,
      permissions: {
        allowed_modules: ['module-1'],
        can_submit_assignments: true,
        can_view_leaderboard: true,
      },
    };

    it('should get student permissions', async () => {
      // Arrange
      mockStudentBlockingService.getStudentPermissions.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.getStudentPermissions(
        classroomId,
        studentId,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.permissions).toHaveProperty('allowed_modules');
      expect(
        mockStudentBlockingService.getStudentPermissions,
      ).toHaveBeenCalledWith(classroomId, studentId, 'teacher-1');
    });

    it('should return blocked status correctly', async () => {
      // Arrange
      const blockedResponse: StudentPermissionsResponseDto = {
        ...mockResponse,
        is_blocked: true,
        status: ClassroomMemberStatusEnum.INACTIVE,
        block_type: BlockType.FULL,
      };

      mockStudentBlockingService.getStudentPermissions.mockResolvedValue(
        blockedResponse,
      );

      // Act
      const result = await controller.getStudentPermissions(
        classroomId,
        studentId,
        mockRequest,
      );

      // Assert
      expect(result.is_blocked).toBe(true);
      expect(result.block_type).toBe(BlockType.FULL);
    });
  });

  describe('updateStudentPermissions', () => {
    const classroomId = 'classroom-1';
    const studentId = 'student-1';

    const mockResponse: StudentPermissionsResponseDto = {
      student_id: studentId,
      classroom_id: classroomId,
      status: ClassroomMemberStatusEnum.ACTIVE,
      is_blocked: false,
      permissions: {
        allowed_modules: ['module-1', 'module-2'],
        can_submit_assignments: false,
        can_view_leaderboard: true,
      },
    };

    it('should update student permissions', async () => {
      // Arrange
      const dto: UpdatePermissionsDto = {
        allowed_modules: ['module-1', 'module-2'],
        can_submit_assignments: false,
      };

      mockStudentBlockingService.updateStudentPermissions.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.updateStudentPermissions(
        classroomId,
        studentId,
        dto,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.permissions.allowed_modules).toEqual([
        'module-1',
        'module-2',
      ]);
      expect(
        mockStudentBlockingService.updateStudentPermissions,
      ).toHaveBeenCalledWith(classroomId, studentId, 'teacher-1', dto);
    });

    it('should update single permission flag', async () => {
      // Arrange
      const dto: UpdatePermissionsDto = {
        can_use_forum: false,
      };

      const response: StudentPermissionsResponseDto = {
        ...mockResponse,
        permissions: {
          ...mockResponse.permissions,
          can_use_forum: false,
        },
      };

      mockStudentBlockingService.updateStudentPermissions.mockResolvedValue(
        response,
      );

      // Act
      const result = await controller.updateStudentPermissions(
        classroomId,
        studentId,
        dto,
        mockRequest,
      );

      // Assert
      expect(result.permissions.can_use_forum).toBe(false);
    });

    it('should update allowed_features', async () => {
      // Arrange
      const dto: UpdatePermissionsDto = {
        allowed_features: ['assignments', 'achievements'],
      };

      const response: StudentPermissionsResponseDto = {
        ...mockResponse,
        permissions: {
          ...mockResponse.permissions,
          allowed_features: ['assignments', 'achievements'],
        },
      };

      mockStudentBlockingService.updateStudentPermissions.mockResolvedValue(
        response,
      );

      // Act
      const result = await controller.updateStudentPermissions(
        classroomId,
        studentId,
        dto,
        mockRequest,
      );

      // Assert
      expect(result.permissions.allowed_features).toEqual([
        'assignments',
        'achievements',
      ]);
    });

    it('should handle empty permissions update', async () => {
      // Arrange
      const dto: UpdatePermissionsDto = {};

      mockStudentBlockingService.updateStudentPermissions.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.updateStudentPermissions(
        classroomId,
        studentId,
        dto,
        mockRequest,
      );

      // Assert
      expect(result).toBeDefined();
      expect(
        mockStudentBlockingService.updateStudentPermissions,
      ).toHaveBeenCalledWith(classroomId, studentId, 'teacher-1', dto);
    });
  });
});
