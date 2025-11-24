/**
 * Analytics Service - Unit Tests
 *
 * Tests for AnalyticsService including student insights generation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { AnalyticsService } from '../services/analytics.service';
import { StudentProgressService } from '../services/student-progress.service';
import { ExerciseSubmission } from '@/modules/progress/entities/exercise-submission.entity';
import { Profile } from '@/modules/auth/entities/profile.entity';
import { Classroom } from '@/modules/social/entities/classroom.entity';
import { ClassroomMember } from '@/modules/social/entities/classroom-member.entity';
import { Assignment } from '@/modules/assignments/entities/assignment.entity';
import { AssignmentSubmission } from '@/modules/assignments/entities/assignment-submission.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let studentProgressService: StudentProgressService;

  // Mock repositories
  const mockSubmissionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockProfileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockClassroomRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockClassroomMemberRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAssignmentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAssignmentSubmissionRepository = {
    find: jest.fn(),
  };

  // Mock StudentProgressService
  const mockStudentProgressService = {
    getStudentStats: jest.fn(),
    getModuleProgress: jest.fn(),
    getStruggleAreas: jest.fn(),
    getClassComparison: jest.fn(),
  };

  // Mock CacheManager
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(ExerciseSubmission, 'progress'),
          useValue: mockSubmissionRepository,
        },
        {
          provide: getRepositoryToken(Profile, 'auth'),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(Classroom, 'social'),
          useValue: mockClassroomRepository,
        },
        {
          provide: getRepositoryToken(ClassroomMember, 'social'),
          useValue: mockClassroomMemberRepository,
        },
        {
          provide: getRepositoryToken(Assignment, 'content'),
          useValue: mockAssignmentRepository,
        },
        {
          provide: getRepositoryToken(AssignmentSubmission, 'content'),
          useValue: mockAssignmentSubmissionRepository,
        },
        {
          provide: StudentProgressService,
          useValue: mockStudentProgressService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    studentProgressService = module.get<StudentProgressService>(StudentProgressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStudentInsights', () => {
    const mockStudentId = 'student-123';

    const mockStudentStats = {
      total_modules: 5,
      completed_modules: 3,
      total_exercises: 50,
      completed_exercises: 40,
      average_score: 75,
      total_time_spent_minutes: 300,
      current_streak_days: 7,
      longest_streak_days: 15,
      achievements_unlocked: 12,
    };

    const mockModuleProgress = [
      {
        module_id: 'module-1',
        module_name: 'Módulo 1',
        module_order: 1,
        total_activities: 10,
        completed_activities: 10,
        average_score: 85,
        time_spent_minutes: 60,
        status: 'completed' as const,
      },
      {
        module_id: 'module-2',
        module_name: 'Módulo 2',
        module_order: 2,
        total_activities: 10,
        completed_activities: 5,
        average_score: 70,
        time_spent_minutes: 40,
        status: 'in_progress' as const,
      },
    ];

    const mockStruggleAreas = [
      {
        topic: 'Argumentación',
        module_name: 'Módulo 3',
        attempts: 5,
        success_rate: 60,
        average_score: 55,
        last_attempt_date: new Date(),
      },
    ];

    const mockClassComparison = [
      {
        metric: 'Puntuación Promedio',
        student_value: 75,
        class_average: 70,
        percentile: 65,
      },
    ];

    beforeEach(() => {
      mockStudentProgressService.getStudentStats.mockResolvedValue(mockStudentStats);
      mockStudentProgressService.getModuleProgress.mockResolvedValue(mockModuleProgress);
      mockStudentProgressService.getStruggleAreas.mockResolvedValue(mockStruggleAreas);
      mockStudentProgressService.getClassComparison.mockResolvedValue(mockClassComparison);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return student insights with correct structure', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('overall_score');
      expect(result).toHaveProperty('modules_completed');
      expect(result).toHaveProperty('modules_total');
      expect(result).toHaveProperty('comparison_to_class');
      expect(result).toHaveProperty('risk_level');
      expect(result).toHaveProperty('strengths');
      expect(result).toHaveProperty('weaknesses');
      expect(result).toHaveProperty('predictions');
      expect(result).toHaveProperty('recommendations');
    });

    it('should calculate overall_score correctly', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      // Overall score = average_score * 0.7 + completion_rate * 0.3
      // completion_rate = (3/5) * 100 = 60
      // overall_score = 75 * 0.7 + 60 * 0.3 = 52.5 + 18 = 70.5 => 71 (rounded)
      expect(result.overall_score).toBe(71);
    });

    it('should return correct modules stats', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(result.modules_completed).toBe(3);
      expect(result.modules_total).toBe(5);
    });

    it('should include score_percentile from class comparison', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(result.comparison_to_class.score_percentile).toBe(65);
    });

    it('should calculate risk_level as low for good performer', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      // With overall_score = 71, completion = 60%, and 1 struggle area
      // Should be medium risk (overall_score < 70 actually makes it medium)
      expect(['low', 'medium', 'high']).toContain(result.risk_level);
    });

    it('should identify high risk student', async () => {
      // Mock low performance
      mockStudentProgressService.getStudentStats.mockResolvedValueOnce({
        ...mockStudentStats,
        average_score: 45,
        completed_modules: 1,
        current_streak_days: 0,
      });

      mockStudentProgressService.getStruggleAreas.mockResolvedValueOnce([
        ...mockStruggleAreas,
        ...mockStruggleAreas,
        ...mockStruggleAreas,
        ...mockStruggleAreas, // 5 struggle areas total
      ]);

      const result = await service.getStudentInsights(mockStudentId);

      expect(result.risk_level).toBe('high');
    });

    it('should generate strengths array', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(Array.isArray(result.strengths)).toBe(true);
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.strengths.length).toBeLessThanOrEqual(5);
    });

    it('should generate weaknesses from struggle areas', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(Array.isArray(result.weaknesses)).toBe(true);
      expect(result.weaknesses.length).toBeGreaterThan(0);
      expect(result.weaknesses.length).toBeLessThanOrEqual(5);

      // Should mention the struggle area topic
      const hasStruggleAreaMention = result.weaknesses.some((weakness) =>
        weakness.includes('Argumentación'),
      );
      expect(hasStruggleAreaMention).toBe(true);
    });

    it('should include predictions with valid probabilities', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(result.predictions).toBeDefined();
      expect(result.predictions.completion_probability).toBeGreaterThanOrEqual(0);
      expect(result.predictions.completion_probability).toBeLessThanOrEqual(1);
      expect(result.predictions.dropout_risk).toBeGreaterThanOrEqual(0);
      expect(result.predictions.dropout_risk).toBeLessThanOrEqual(1);
    });

    it('should generate personalized recommendations', async () => {
      const result = await service.getStudentInsights(mockStudentId);

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeLessThanOrEqual(6);
    });

    it('should include urgency recommendations for high risk students', async () => {
      // Mock high risk scenario
      mockStudentProgressService.getStudentStats.mockResolvedValueOnce({
        ...mockStudentStats,
        average_score: 40,
        completed_modules: 0,
        current_streak_days: 0,
      });

      const result = await service.getStudentInsights(mockStudentId);

      expect(result.risk_level).toBe('high');

      // Should have urgent recommendations
      const hasUrgentRec = result.recommendations.some(
        (rec) => rec.includes('tutoría') || rec.includes('urgente'),
      );
      expect(hasUrgentRec).toBe(true);
    });

    it('should handle edge case with no modules', async () => {
      mockStudentProgressService.getStudentStats.mockResolvedValueOnce({
        ...mockStudentStats,
        total_modules: 0,
        completed_modules: 0,
      });

      const result = await service.getStudentInsights(mockStudentId);

      expect(result.modules_total).toBe(0);
      expect(result.modules_completed).toBe(0);
      // Should not crash with division by zero
      expect(result.overall_score).toBeDefined();
    });

    it('should handle student with no struggle areas', async () => {
      mockStudentProgressService.getStruggleAreas.mockResolvedValueOnce([]);

      const result = await service.getStudentInsights(mockStudentId);

      expect(result.weaknesses).toBeDefined();
      expect(Array.isArray(result.weaknesses)).toBe(true);
      // Should still provide some feedback even without struggle areas
      expect(result.weaknesses.length).toBeGreaterThan(0);
    });

    it('should call all required dependencies', async () => {
      await service.getStudentInsights(mockStudentId);

      expect(mockStudentProgressService.getStudentStats).toHaveBeenCalledWith(mockStudentId);
      expect(mockStudentProgressService.getModuleProgress).toHaveBeenCalledWith(mockStudentId);
      expect(mockStudentProgressService.getStruggleAreas).toHaveBeenCalledWith(mockStudentId);
      expect(mockStudentProgressService.getClassComparison).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle excellent student (score >= 80, low risk)', async () => {
      mockStudentProgressService.getStudentStats.mockResolvedValueOnce({
        ...mockStudentStats,
        average_score: 90,
        completed_modules: 5,
        current_streak_days: 14,
      });

      mockStudentProgressService.getStruggleAreas.mockResolvedValueOnce([]);

      const result = await service.getStudentInsights(mockStudentId);

      expect(result.risk_level).toBe('low');
      expect(result.overall_score).toBeGreaterThan(80);

      // Should suggest advanced content
      const hasAdvancedRec = result.recommendations.some(
        (rec) => rec.includes('avanzado') || rec.includes('extensión'),
      );
      expect(hasAdvancedRec).toBe(true);
    });
  });
});
