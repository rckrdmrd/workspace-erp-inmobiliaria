import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { LeaderboardService } from '../services';

describe('LeaderboardController - Friends Endpoint', () => {
  let controller: LeaderboardController;
  let leaderboardService: LeaderboardService;

  const mockLeaderboardService = {
    getGlobalLeaderboard: jest.fn(),
    getSchoolLeaderboard: jest.fn(),
    getClassroomLeaderboard: jest.fn(),
    getFriendsLeaderboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: LeaderboardService,
          useValue: mockLeaderboardService,
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /leaderboard/friends/:userId', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000';

    const mockFriendsLeaderboard = {
      type: 'friends',
      entries: [
        {
          rank: 1,
          userId: '660e8400-e29b-41d4-a716-446655440000',
          username: 'Ana Martínez',
          firstName: 'Ana',
          lastName: 'Martínez',
          avatar: 'https://cdn.example.com/avatars/ana.jpg',
          totalXP: 9500,
          level: 20,
          currentRank: 'Nacom',
          streak: 25,
          achievementCount: 9,
          tasksCompleted: 95,
        },
        {
          rank: 2,
          userId: '770e8400-e29b-41d4-a716-446655440000',
          username: 'Carlos López',
          firstName: 'Carlos',
          lastName: 'López',
          avatar: 'https://cdn.example.com/avatars/carlos.jpg',
          totalXP: 8500,
          level: 18,
          currentRank: 'Ajaw',
          streak: 20,
          achievementCount: 7,
          tasksCompleted: 85,
        },
      ],
      totalEntries: 15,
      lastUpdated: '2025-11-11T10:30:00Z',
      timePeriod: 'all_time',
      userId,
    };

    it('should return friends leaderboard with correct structure', async () => {
      // Arrange
      mockLeaderboardService.getFriendsLeaderboard.mockResolvedValue(
        mockFriendsLeaderboard,
      );

      // Act
      const result = await controller.getFriendsLeaderboard(userId);

      // Assert
      expect(leaderboardService.getFriendsLeaderboard).toHaveBeenCalledWith(
        userId,
        100, // default limit
        0, // default offset
        undefined, // default timePeriod
      );
      expect(result).toEqual(mockFriendsLeaderboard);
      expect(result.type).toBe('friends');
      expect(result.entries).toHaveLength(2);
      expect(result.totalEntries).toBe(15);
    });

    it('should return friends ordered by XP (highest first)', async () => {
      // Arrange
      mockLeaderboardService.getFriendsLeaderboard.mockResolvedValue(
        mockFriendsLeaderboard,
      );

      // Act
      const result = await controller.getFriendsLeaderboard(userId);

      // Assert
      expect(result.entries[0].totalXP).toBeGreaterThan(
        result.entries[1].totalXP,
      );
      expect(result.entries[0].rank).toBe(1);
      expect(result.entries[1].rank).toBe(2);
    });

    it('should support custom limit parameter', async () => {
      // Arrange
      const customLimit = '20';
      mockLeaderboardService.getFriendsLeaderboard.mockResolvedValue({
        ...mockFriendsLeaderboard,
        entries: mockFriendsLeaderboard.entries.slice(0, 1),
      });

      // Act
      await controller.getFriendsLeaderboard(
        userId,
        customLimit,
        undefined,
        undefined,
      );

      // Assert
      expect(leaderboardService.getFriendsLeaderboard).toHaveBeenCalledWith(
        userId,
        20, // parsed limit
        0,
        undefined,
      );
    });

    it('should support pagination with offset', async () => {
      // Arrange
      const limit = '10';
      const offset = '10';
      mockLeaderboardService.getFriendsLeaderboard.mockResolvedValue({
        ...mockFriendsLeaderboard,
        entries: [],
      });

      // Act
      await controller.getFriendsLeaderboard(userId, limit, offset, undefined);

      // Assert
      expect(leaderboardService.getFriendsLeaderboard).toHaveBeenCalledWith(
        userId,
        10,
        10, // offset
        undefined,
      );
    });

    it('should return empty array if user has no friends', async () => {
      // Arrange
      const emptyLeaderboard = {
        type: 'friends',
        entries: [],
        totalEntries: 0,
        lastUpdated: '2025-11-11T10:30:00Z',
        timePeriod: 'all_time',
        userId,
      };
      mockLeaderboardService.getFriendsLeaderboard.mockResolvedValue(
        emptyLeaderboard,
      );

      // Act
      const result = await controller.getFriendsLeaderboard(userId);

      // Assert
      expect(result.entries).toEqual([]);
      expect(result.totalEntries).toBe(0);
    });

    it('should include all required user fields in entries', async () => {
      // Arrange
      mockLeaderboardService.getFriendsLeaderboard.mockResolvedValue(
        mockFriendsLeaderboard,
      );

      // Act
      const result = await controller.getFriendsLeaderboard(userId);

      // Assert
      const firstEntry = result.entries[0];
      expect(firstEntry).toHaveProperty('rank');
      expect(firstEntry).toHaveProperty('userId');
      expect(firstEntry).toHaveProperty('username');
      expect(firstEntry).toHaveProperty('firstName');
      expect(firstEntry).toHaveProperty('lastName');
      expect(firstEntry).toHaveProperty('avatar');
      expect(firstEntry).toHaveProperty('totalXP');
      expect(firstEntry).toHaveProperty('level');
      expect(firstEntry).toHaveProperty('currentRank');
      expect(firstEntry).toHaveProperty('streak');
      expect(firstEntry).toHaveProperty('achievementCount');
      expect(firstEntry).toHaveProperty('tasksCompleted');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const invalidUserId = 'invalid-uuid';
      const error = new Error('Usuario no encontrado');
      mockLeaderboardService.getFriendsLeaderboard.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.getFriendsLeaderboard(invalidUserId),
      ).rejects.toThrow('Usuario no encontrado');
    });
  });
});
