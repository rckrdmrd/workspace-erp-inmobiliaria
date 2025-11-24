import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ClassroomAssignmentsService } from '../services/classroom-assignments.service';
import { Classroom } from '@modules/social/entities/classroom.entity';
import { TeacherClassroom, TeacherClassroomRole } from '@modules/social/entities/teacher-classroom.entity';
import { Profile } from '@modules/auth/entities/profile.entity';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { GamilityRoleEnum } from '@shared/constants/enums.constants';
import {
  AssignClassroomDto,
  BulkAssignClassroomsDto,
  RemoveAssignmentDto,
  ReassignClassroomDto,
  AvailableClassroomsFiltersDto,
} from '../dto/classroom-assignments';

describe('ClassroomAssignmentsService', () => {
  let service: ClassroomAssignmentsService;
  let classroomRepository: Repository<Classroom>;
  let teacherClassroomRepository: Repository<TeacherClassroom>;
  let profileRepository: Repository<Profile>;
  let userRoleRepository: Repository<UserRole>;

  const mockClassroomRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTeacherClassroomRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUserRoleRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomAssignmentsService,
        {
          provide: getRepositoryToken(Classroom, 'social'),
          useValue: mockClassroomRepository,
        },
        {
          provide: getRepositoryToken(TeacherClassroom, 'social'),
          useValue: mockTeacherClassroomRepository,
        },
        {
          provide: getRepositoryToken(Profile, 'auth'),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(UserRole, 'auth'),
          useValue: mockUserRoleRepository,
        },
      ],
    }).compile();

    service = module.get<ClassroomAssignmentsService>(
      ClassroomAssignmentsService,
    );
    classroomRepository = module.get(getRepositoryToken(Classroom, 'social'));
    teacherClassroomRepository = module.get(
      getRepositoryToken(TeacherClassroom, 'social'),
    );
    profileRepository = module.get(getRepositoryToken(Profile, 'auth'));
    userRoleRepository = module.get(getRepositoryToken(UserRole, 'auth'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('assignClassroomToTeacher', () => {
    const mockTeacher = {
      id: 'teacher-1',
      email: 'teacher@test.com',
      role: GamilityRoleEnum.ADMIN_TEACHER,
      full_name: 'Test Teacher',
    } as Profile;

    const mockClassroom = {
      id: 'classroom-1',
      name: 'Math 101',
      is_active: true,
      current_students_count: 25,
    } as Classroom;

    const mockDto: AssignClassroomDto = {
      teacherId: 'teacher-1',
      classroomId: 'classroom-1',
      notes: 'Test assignment',
    };

    it('should assign classroom to teacher successfully', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.findOne.mockResolvedValue(null);
      mockTeacherClassroomRepository.create.mockReturnValue({
        teacher_id: mockDto.teacherId,
        classroom_id: mockDto.classroomId,
        role: TeacherClassroomRole.TEACHER,
        assigned_at: new Date(),
      });
      mockTeacherClassroomRepository.save.mockResolvedValue({
        id: 'assignment-1',
        teacher_id: mockDto.teacherId,
        classroom_id: mockDto.classroomId,
        role: TeacherClassroomRole.TEACHER,
        assigned_at: new Date(),
      });

      // Act
      const result = await service.assignClassroomToTeacher(mockDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.classroom_id).toBe(mockDto.classroomId);
      expect(result.teacher_id).toBe(mockDto.teacherId);
      expect(result.name).toBe(mockClassroom.name);
      expect(result.student_count).toBe(25);
      expect(mockProfileRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDto.teacherId },
      });
      expect(mockClassroomRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDto.classroomId },
      });
      expect(mockTeacherClassroomRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if teacher not found', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.assignClassroomToTeacher(mockDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is not a teacher', async () => {
      // Arrange
      const studentProfile = {
        ...mockTeacher,
        role: GamilityRoleEnum.STUDENT,
      };
      mockProfileRepository.findOne.mockResolvedValue(studentProfile);

      // Act & Assert
      await expect(
        service.assignClassroomToTeacher(mockDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if classroom not found', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockClassroomRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.assignClassroomToTeacher(mockDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if classroom is inactive', async () => {
      // Arrange
      const inactiveClassroom = { ...mockClassroom, is_active: false };
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockClassroomRepository.findOne.mockResolvedValue(inactiveClassroom);

      // Act & Assert
      await expect(
        service.assignClassroomToTeacher(mockDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if assignment already exists', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.findOne.mockResolvedValue({
        id: 'existing-assignment',
        teacher_id: mockDto.teacherId,
        classroom_id: mockDto.classroomId,
      });

      // Act & Assert
      await expect(
        service.assignClassroomToTeacher(mockDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('bulkAssignClassrooms', () => {
    const mockTeacher = {
      id: 'teacher-1',
      email: 'teacher@test.com',
      role: GamilityRoleEnum.ADMIN_TEACHER,
    } as Profile;

    const mockClassrooms = [
      {
        id: 'classroom-1',
        name: 'Math 101',
        is_active: true,
        current_students_count: 25,
      },
      {
        id: 'classroom-2',
        name: 'Science 101',
        is_active: true,
        current_students_count: 20,
      },
    ] as Classroom[];

    const mockDto: BulkAssignClassroomsDto = {
      teacherId: 'teacher-1',
      classroomIds: ['classroom-1', 'classroom-2', 'classroom-3'],
    };

    it('should bulk assign classrooms with partial success', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockClassroomRepository.find.mockResolvedValue(mockClassrooms);
      mockTeacherClassroomRepository.findOne.mockResolvedValue(null);
      mockTeacherClassroomRepository.create.mockImplementation((data) => data);
      mockTeacherClassroomRepository.save.mockImplementation(async (data) => ({
        ...data,
        id: 'assignment-id',
        assigned_at: new Date(),
      }));

      // Act
      const result = await service.bulkAssignClassrooms(mockDto);

      // Assert
      expect(result.successful).toHaveLength(2);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].classroom_id).toBe('classroom-3');
      expect(result.failed[0].reason).toBe('Classroom not found or inactive');
    });
  });

  describe('removeClassroomAssignment', () => {
    const mockAssignment = {
      id: 'assignment-1',
      teacher_id: 'teacher-1',
      classroom_id: 'classroom-1',
      role: TeacherClassroomRole.TEACHER,
    } as TeacherClassroom;

    const mockClassroom = {
      id: 'classroom-1',
      name: 'Math 101',
      current_students_count: 0,
    } as Classroom;

    it('should remove assignment successfully when no students', async () => {
      // Arrange
      mockTeacherClassroomRepository.findOne.mockResolvedValue(mockAssignment);
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.remove.mockResolvedValue(mockAssignment);

      // Act
      const result = await service.removeClassroomAssignment(
        'teacher-1',
        'classroom-1',
        { force: false },
      );

      // Assert
      expect(result.message).toContain('Assignment removed successfully');
      expect(mockTeacherClassroomRepository.remove).toHaveBeenCalledWith(
        mockAssignment,
      );
    });

    it('should throw BadRequestException if classroom has students and force=false', async () => {
      // Arrange
      const classroomWithStudents = {
        ...mockClassroom,
        current_students_count: 15,
      };
      mockTeacherClassroomRepository.findOne.mockResolvedValue(mockAssignment);
      mockClassroomRepository.findOne.mockResolvedValue(classroomWithStudents);

      // Act & Assert
      await expect(
        service.removeClassroomAssignment('teacher-1', 'classroom-1', {
          force: false,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should remove assignment with force=true even with students', async () => {
      // Arrange
      const classroomWithStudents = {
        ...mockClassroom,
        current_students_count: 15,
      };
      mockTeacherClassroomRepository.findOne.mockResolvedValue(mockAssignment);
      mockClassroomRepository.findOne.mockResolvedValue(classroomWithStudents);
      mockTeacherClassroomRepository.remove.mockResolvedValue(mockAssignment);

      // Act
      const result = await service.removeClassroomAssignment(
        'teacher-1',
        'classroom-1',
        { force: true },
      );

      // Assert
      expect(result.message).toContain('Assignment removed successfully');
      expect(mockTeacherClassroomRepository.remove).toHaveBeenCalled();
    });
  });

  describe('reassignClassroom', () => {
    const mockDto: ReassignClassroomDto = {
      classroomId: 'classroom-1',
      fromTeacherId: 'teacher-1',
      toTeacherId: 'teacher-2',
      reason: 'Teacher transfer',
    };

    const mockTeacher1 = {
      id: 'teacher-1',
      role: GamilityRoleEnum.ADMIN_TEACHER,
    } as Profile;

    const mockTeacher2 = {
      id: 'teacher-2',
      role: GamilityRoleEnum.ADMIN_TEACHER,
    } as Profile;

    const mockClassroom = {
      id: 'classroom-1',
      name: 'Math 101',
      is_active: true,
      current_students_count: 20,
    } as Classroom;

    const mockOriginalAssignment = {
      id: 'assignment-1',
      teacher_id: 'teacher-1',
      classroom_id: 'classroom-1',
      role: TeacherClassroomRole.OWNER,
    } as TeacherClassroom;

    it('should reassign classroom successfully', async () => {
      // Arrange
      mockProfileRepository.findOne
        .mockResolvedValueOnce(mockTeacher1)
        .mockResolvedValueOnce(mockTeacher2);
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.findOne
        .mockResolvedValueOnce(mockOriginalAssignment)
        .mockResolvedValueOnce(null);
      mockTeacherClassroomRepository.remove.mockResolvedValue(
        mockOriginalAssignment,
      );
      mockTeacherClassroomRepository.create.mockReturnValue({
        teacher_id: mockDto.toTeacherId,
        classroom_id: mockDto.classroomId,
        role: TeacherClassroomRole.OWNER,
      });
      mockTeacherClassroomRepository.save.mockResolvedValue({
        id: 'new-assignment',
        teacher_id: mockDto.toTeacherId,
        classroom_id: mockDto.classroomId,
        role: TeacherClassroomRole.OWNER,
        assigned_at: new Date(),
      });

      // Act
      const result = await service.reassignClassroom(mockDto);

      // Assert
      expect(result.teacher_id).toBe(mockDto.toTeacherId);
      expect(result.classroom_id).toBe(mockDto.classroomId);
      expect(result.role).toBe(TeacherClassroomRole.OWNER);
      expect(mockTeacherClassroomRepository.remove).toHaveBeenCalledWith(
        mockOriginalAssignment,
      );
      expect(mockTeacherClassroomRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if original assignment not found', async () => {
      // Arrange
      mockProfileRepository.findOne
        .mockResolvedValueOnce(mockTeacher1)
        .mockResolvedValueOnce(mockTeacher2);
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.reassignClassroom(mockDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if new teacher already assigned', async () => {
      // Arrange
      mockProfileRepository.findOne
        .mockResolvedValueOnce(mockTeacher1)
        .mockResolvedValueOnce(mockTeacher2);
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.findOne
        .mockResolvedValueOnce(mockOriginalAssignment)
        .mockResolvedValueOnce({ id: 'existing-assignment' } as TeacherClassroom);

      // Act & Assert
      await expect(service.reassignClassroom(mockDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getTeacherClassrooms', () => {
    const mockTeacher = {
      id: 'teacher-1',
      role: GamilityRoleEnum.ADMIN_TEACHER,
    } as Profile;

    const mockAssignments = [
      {
        id: 'assignment-1',
        teacher_id: 'teacher-1',
        classroom_id: 'classroom-1',
        role: TeacherClassroomRole.TEACHER,
        assigned_at: new Date(),
      },
      {
        id: 'assignment-2',
        teacher_id: 'teacher-1',
        classroom_id: 'classroom-2',
        role: TeacherClassroomRole.OWNER,
        assigned_at: new Date(),
      },
    ] as TeacherClassroom[];

    const mockClassrooms = [
      {
        id: 'classroom-1',
        name: 'Math 101',
        current_students_count: 25,
      },
      {
        id: 'classroom-2',
        name: 'Science 101',
        current_students_count: 20,
      },
    ] as Classroom[];

    it('should return all classrooms for a teacher', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockTeacherClassroomRepository.find.mockResolvedValue(mockAssignments);
      mockClassroomRepository.find.mockResolvedValue(mockClassrooms);

      // Act
      const result = await service.getTeacherClassrooms('teacher-1');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].classroom_id).toBe('classroom-1');
      expect(result[0].name).toBe('Math 101');
      expect(result[0].student_count).toBe(25);
      expect(result[1].classroom_id).toBe('classroom-2');
      expect(result[1].name).toBe('Science 101');
      expect(result[1].student_count).toBe(20);
    });

    it('should return empty array if teacher has no classrooms', async () => {
      // Arrange
      mockProfileRepository.findOne.mockResolvedValue(mockTeacher);
      mockTeacherClassroomRepository.find.mockResolvedValue([]);
      mockClassroomRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getTeacherClassrooms('teacher-1');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getAvailableClassrooms', () => {
    const mockClassrooms = [
      {
        id: 'classroom-1',
        name: 'Math 101',
        is_active: true,
        grade_level: 'primaria',
      },
      {
        id: 'classroom-2',
        name: 'Science 101',
        is_active: true,
        grade_level: 'secundaria',
      },
    ] as Classroom[];

    it('should return available classrooms with filters', async () => {
      // Arrange
      const filters: AvailableClassroomsFiltersDto = {
        search: 'Math',
        level: 'primaria',
        activeOnly: true,
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockClassrooms[0]]),
      };

      mockClassroomRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      const result = await service.getAvailableClassrooms(filters);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Math 101');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'classroom.is_active = :isActive',
        { isActive: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'classroom.name ILIKE :search',
        { search: '%Math%' },
      );
    });
  });

  describe('getAssignmentHistory', () => {
    const mockClassroom = {
      id: 'classroom-1',
      name: 'Math 101',
      is_active: true,
    } as Classroom;

    const mockAssignments = [
      {
        id: 'assignment-1',
        teacher_id: 'teacher-1',
        classroom_id: 'classroom-1',
        role: TeacherClassroomRole.TEACHER,
        assigned_at: new Date('2024-01-01'),
      },
      {
        id: 'assignment-2',
        teacher_id: 'teacher-2',
        classroom_id: 'classroom-1',
        role: TeacherClassroomRole.OWNER,
        assigned_at: new Date('2024-02-01'),
      },
    ] as TeacherClassroom[];

    const mockProfiles = [
      {
        id: 'teacher-1',
        full_name: 'Teacher One',
        display_name: 'T1',
      },
      {
        id: 'teacher-2',
        full_name: 'Teacher Two',
        display_name: 'T2',
      },
    ] as Profile[];

    it('should return assignment history for a classroom', async () => {
      // Arrange
      mockClassroomRepository.findOne.mockResolvedValue(mockClassroom);
      mockTeacherClassroomRepository.find.mockResolvedValue(mockAssignments);
      mockProfileRepository.find.mockResolvedValue(mockProfiles);

      // Act
      const result = await service.getAssignmentHistory('classroom-1');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].classroom_id).toBe('classroom-1');
      expect(result[0].classroom_name).toBe('Math 101');
      expect(result[0].teacher_name).toBe('Teacher One');
      expect(result[1].teacher_name).toBe('Teacher Two');
    });
  });
});
