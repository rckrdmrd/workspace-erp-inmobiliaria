import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomAssignmentsController } from '../controllers/classroom-assignments.controller';
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
import { TeacherClassroomRole } from '@modules/social/entities/teacher-classroom.entity';

describe('ClassroomAssignmentsController', () => {
  let controller: ClassroomAssignmentsController;
  let service: ClassroomAssignmentsService;

  const mockClassroomAssignmentsService = {
    assignClassroomToTeacher: jest.fn(),
    bulkAssignClassrooms: jest.fn(),
    removeClassroomAssignment: jest.fn(),
    reassignClassroom: jest.fn(),
    getTeacherClassrooms: jest.fn(),
    getAvailableClassrooms: jest.fn(),
    getAssignmentHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomAssignmentsController],
      providers: [
        {
          provide: ClassroomAssignmentsService,
          useValue: mockClassroomAssignmentsService,
        },
      ],
    }).compile();

    controller = module.get<ClassroomAssignmentsController>(
      ClassroomAssignmentsController,
    );
    service = module.get<ClassroomAssignmentsService>(
      ClassroomAssignmentsService,
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('assignClassroom', () => {
    const mockDto: AssignClassroomDto = {
      teacherId: 'teacher-1',
      classroomId: 'classroom-1',
      notes: 'Test assignment',
    };

    const mockResponse: ClassroomAssignmentResponseDto = {
      classroom_id: 'classroom-1',
      name: 'Math 101',
      teacher_id: 'teacher-1',
      role: TeacherClassroomRole.TEACHER,
      student_count: 25,
      assigned_at: new Date(),
    };

    it('should assign classroom to teacher', async () => {
      // Arrange
      mockClassroomAssignmentsService.assignClassroomToTeacher.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.assignClassroom(mockDto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(
        mockClassroomAssignmentsService.assignClassroomToTeacher,
      ).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('bulkAssignClassrooms', () => {
    const mockDto: BulkAssignClassroomsDto = {
      teacherId: 'teacher-1',
      classroomIds: ['classroom-1', 'classroom-2'],
    };

    const mockResponse = {
      successful: [
        {
          classroom_id: 'classroom-1',
          name: 'Math 101',
          teacher_id: 'teacher-1',
          role: TeacherClassroomRole.TEACHER,
          student_count: 25,
          assigned_at: new Date(),
        },
      ] as ClassroomAssignmentResponseDto[],
      failed: [
        {
          classroom_id: 'classroom-2',
          reason: 'Classroom not found',
        },
      ],
    };

    it('should bulk assign classrooms', async () => {
      // Arrange
      mockClassroomAssignmentsService.bulkAssignClassrooms.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.bulkAssignClassrooms(mockDto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.successful).toHaveLength(1);
      expect(result.failed).toHaveLength(1);
      expect(
        mockClassroomAssignmentsService.bulkAssignClassrooms,
      ).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('removeClassroomAssignment', () => {
    const teacherId = 'teacher-1';
    const classroomId = 'classroom-1';
    const mockDto: RemoveAssignmentDto = { force: false };

    const mockResponse = {
      message: 'Assignment removed successfully',
    };

    it('should remove classroom assignment', async () => {
      // Arrange
      mockClassroomAssignmentsService.removeClassroomAssignment.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.removeClassroomAssignment(
        teacherId,
        classroomId,
        mockDto,
      );

      // Assert
      expect(result).toEqual(mockResponse);
      expect(
        mockClassroomAssignmentsService.removeClassroomAssignment,
      ).toHaveBeenCalledWith(teacherId, classroomId, mockDto);
    });
  });

  describe('reassignClassroom', () => {
    const mockDto: ReassignClassroomDto = {
      classroomId: 'classroom-1',
      fromTeacherId: 'teacher-1',
      toTeacherId: 'teacher-2',
      reason: 'Teacher transfer',
    };

    const mockResponse: ClassroomAssignmentResponseDto = {
      classroom_id: 'classroom-1',
      name: 'Math 101',
      teacher_id: 'teacher-2',
      role: TeacherClassroomRole.OWNER,
      student_count: 20,
      assigned_at: new Date(),
    };

    it('should reassign classroom to new teacher', async () => {
      // Arrange
      mockClassroomAssignmentsService.reassignClassroom.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.reassignClassroom(mockDto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.teacher_id).toBe('teacher-2');
      expect(
        mockClassroomAssignmentsService.reassignClassroom,
      ).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('getTeacherClassrooms', () => {
    const teacherId = 'teacher-1';

    const mockResponse: ClassroomAssignmentResponseDto[] = [
      {
        classroom_id: 'classroom-1',
        name: 'Math 101',
        teacher_id: teacherId,
        role: TeacherClassroomRole.TEACHER,
        student_count: 25,
        assigned_at: new Date(),
      },
      {
        classroom_id: 'classroom-2',
        name: 'Science 101',
        teacher_id: teacherId,
        role: TeacherClassroomRole.OWNER,
        student_count: 20,
        assigned_at: new Date(),
      },
    ];

    it('should get all classrooms for a teacher', async () => {
      // Arrange
      mockClassroomAssignmentsService.getTeacherClassrooms.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.getTeacherClassrooms(teacherId);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
      expect(
        mockClassroomAssignmentsService.getTeacherClassrooms,
      ).toHaveBeenCalledWith(teacherId);
    });

    it('should return empty array if teacher has no classrooms', async () => {
      // Arrange
      mockClassroomAssignmentsService.getTeacherClassrooms.mockResolvedValue(
        [],
      );

      // Act
      const result = await controller.getTeacherClassrooms(teacherId);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAvailableClassrooms', () => {
    const filters: AvailableClassroomsFiltersDto = {
      search: 'Math',
      level: 'primaria',
      activeOnly: true,
    };

    const mockResponse: Classroom[] = [
      {
        id: 'classroom-1',
        name: 'Math 101',
        is_active: true,
        grade_level: 'primaria',
        current_students_count: 25,
      } as Classroom,
      {
        id: 'classroom-2',
        name: 'Math 102',
        is_active: true,
        grade_level: 'primaria',
        current_students_count: 20,
      } as Classroom,
    ];

    it('should get available classrooms with filters', async () => {
      // Arrange
      mockClassroomAssignmentsService.getAvailableClassrooms.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.getAvailableClassrooms(filters);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
      expect(
        mockClassroomAssignmentsService.getAvailableClassrooms,
      ).toHaveBeenCalledWith(filters);
    });

    it('should get all active classrooms when no filters', async () => {
      // Arrange
      const emptyFilters: AvailableClassroomsFiltersDto = {
        activeOnly: true,
      };
      mockClassroomAssignmentsService.getAvailableClassrooms.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.getAvailableClassrooms(emptyFilters);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(
        mockClassroomAssignmentsService.getAvailableClassrooms,
      ).toHaveBeenCalledWith(emptyFilters);
    });
  });

  describe('getAssignmentHistory', () => {
    const classroomId = 'classroom-1';

    const mockResponse: AssignmentHistoryResponseDto[] = [
      {
        classroom_id: classroomId,
        classroom_name: 'Math 101',
        teacher_id: 'teacher-1',
        teacher_name: 'Teacher One',
        action: 'assigned',
        role: TeacherClassroomRole.TEACHER,
        assigned_at: new Date('2024-01-01'),
        removed_at: undefined,
      },
      {
        classroom_id: classroomId,
        classroom_name: 'Math 101',
        teacher_id: 'teacher-2',
        teacher_name: 'Teacher Two',
        action: 'assigned',
        role: TeacherClassroomRole.OWNER,
        assigned_at: new Date('2024-02-01'),
        removed_at: undefined,
      },
    ];

    it('should get assignment history for a classroom', async () => {
      // Arrange
      mockClassroomAssignmentsService.getAssignmentHistory.mockResolvedValue(
        mockResponse,
      );

      // Act
      const result = await controller.getAssignmentHistory(classroomId);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
      expect(result[0].classroom_id).toBe(classroomId);
      expect(result[1].classroom_id).toBe(classroomId);
      expect(
        mockClassroomAssignmentsService.getAssignmentHistory,
      ).toHaveBeenCalledWith(classroomId);
    });

    it('should return empty history if no assignments', async () => {
      // Arrange
      mockClassroomAssignmentsService.getAssignmentHistory.mockResolvedValue(
        [],
      );

      // Act
      const result = await controller.getAssignmentHistory(classroomId);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
