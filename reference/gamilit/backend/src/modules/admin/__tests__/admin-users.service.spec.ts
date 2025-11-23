import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminUsersService } from '../services/admin-users.service';
import { User } from '@modules/auth/entities/user.entity';
import { ListUsersDto, UpdateUserDto, SuspendUserDto } from '../dto/users';
import { GamilityRoleEnum, UserStatusEnum } from '@shared/constants';

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        {
          provide: getRepositoryToken(User, 'auth'),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
    userRepository = module.get(getRepositoryToken(User, 'auth'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('listUsers', () => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'user1@example.com',
        role: GamilityRoleEnum.STUDENT,
        deleted_at: null,
        created_at: new Date('2024-01-01'),
      },
      {
        id: 'user-2',
        email: 'user2@example.com',
        role: GamilityRoleEnum.ADMIN_TEACHER,
        deleted_at: null,
        created_at: new Date('2024-01-02'),
      },
    ];

    it('should list users with default pagination', async () => {
      // Arrange
      const query: ListUsersDto = {};
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      // Act
      const result = await service.listUsers(query);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.total_pages).toBe(1);
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const query: ListUsersDto = { page: 2, limit: 10 };
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 25]);

      // Act
      const result = await service.listUsers(query);

      // Assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page 2 - 1) * limit 10
          take: 10,
        }),
      );
      expect(result.page).toBe(2);
      expect(result.total_pages).toBe(3); // 25 / 10 = 2.5 => 3
    });

    it('should filter by search term', async () => {
      // Arrange
      const query: ListUsersDto = { search: 'user1' };
      mockUserRepository.findAndCount.mockResolvedValue([[mockUsers[0]], 1]);

      // Act
      await service.listUsers(query);

      // Assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            email: expect.anything(), // Like filter
          }),
        }),
      );
    });

    it('should filter by role', async () => {
      // Arrange
      const query: ListUsersDto = { role: GamilityRoleEnum.STUDENT };
      mockUserRepository.findAndCount.mockResolvedValue([[mockUsers[0]], 1]);

      // Act
      await service.listUsers(query);

      // Assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: GamilityRoleEnum.STUDENT,
          }),
        }),
      );
    });

    it('should filter by status (active)', async () => {
      // Arrange
      const query: ListUsersDto = { status: UserStatusEnum.ACTIVE };
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      // Act
      await service.listUsers(query);

      // Assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deleted_at: null,
          }),
        }),
      );
    });

    it('should order by created_at DESC', async () => {
      // Arrange
      const query: ListUsersDto = {};
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      // Act
      await service.listUsers(query);

      // Assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { created_at: 'DESC' },
        }),
      );
    });

    it('should return empty array when no users found', async () => {
      // Arrange
      const query: ListUsersDto = {};
      mockUserRepository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.listUsers(query);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.total_pages).toBe(0);
    });

    it('should combine multiple filters', async () => {
      // Arrange
      const query: ListUsersDto = {
        search: 'test',
        role: GamilityRoleEnum.STUDENT,
        status: UserStatusEnum.ACTIVE,
        page: 2,
        limit: 5,
      };
      mockUserRepository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      await service.listUsers(query);

      // Assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: GamilityRoleEnum.STUDENT,
            deleted_at: null,
          }),
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('getUserDetails', () => {
    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      role: GamilityRoleEnum.STUDENT,
      deleted_at: null,
    };

    it('should return user details by ID', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.getUserDetails('user-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user-1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserDetails('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.getUserDetails('non-existent')).rejects.toThrow(
        'User non-existent not found',
      );
    });
  });

  describe('updateUser', () => {
    const getMockUser = () => ({
      id: 'user-1',
      email: 'old@example.com',
      role: GamilityRoleEnum.STUDENT,
    });

    const updateDto: UpdateUserDto = {
      email: 'new@example.com',
      role: GamilityRoleEnum.ADMIN_TEACHER,
    };

    it('should update user successfully', async () => {
      // Arrange
      const mockUser = getMockUser();
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      // Act
      const result = await service.updateUser('user-1', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe('new@example.com');
      expect(result.role).toBe(GamilityRoleEnum.ADMIN_TEACHER);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateUser('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should only update provided fields', async () => {
      // Arrange
      const mockUser = getMockUser();
      const partialUpdate: UpdateUserDto = { email: 'updated@example.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        email: 'updated@example.com',
      });

      // Act
      const result = await service.updateUser('user-1', partialUpdate);

      // Assert
      expect(result.email).toBe('updated@example.com');
      expect(result.role).toBe(GamilityRoleEnum.STUDENT); // Should remain unchanged
    });
  });

  describe('deleteUser', () => {
    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      role: GamilityRoleEnum.STUDENT,
    };

    it('should delete user successfully', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      // Act
      await service.deleteUser('user-1');

      // Assert
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteUser('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });

    it('should find user before deleting', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      // Act
      await service.deleteUser('user-1');

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      // expect(mockUserRepository.findOne).toHaveBeenCalledBefore(mockUserRepository.remove); // toHaveBeenCalledBefore not available in Jest
    });
  });

  describe('suspendUser', () => {
    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      role: GamilityRoleEnum.STUDENT,
      deleted_at: null,
    };

    const suspendDto: SuspendUserDto = {
      reason: 'Violation of terms',
    };

    it('should suspend user successfully', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        deleted_at: new Date(),
      });

      // Act
      const result = await service.suspendUser('user-1', suspendDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.deleted_at).toBeDefined(); // Soft delete marks as suspended
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.suspendUser('non-existent', suspendDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow suspending already suspended user', async () => {
      // Arrange
      const suspendedUser = {
        ...mockUser,
        deleted_at: new Date('2024-01-01'),
      };
      mockUserRepository.findOne.mockResolvedValue(suspendedUser);
      mockUserRepository.save.mockResolvedValue(suspendedUser);

      // Act & Assert
      await expect(service.suspendUser('user-1', suspendDto)).resolves.not.toThrow();
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      // Arrange
      const userId = 'user-1';
      // Mock would need to query related data (exercises completed, achievements, etc.)
      // This is a placeholder for when the method is implemented

      // Act & Assert
      // This test will be implemented when getUserStats method exists
      expect(service).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      mockUserRepository.findAndCount.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(service.listUsers({})).rejects.toThrow('Database connection failed');
    });

    it('should handle invalid user IDs', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserDetails('invalid-id-format')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
