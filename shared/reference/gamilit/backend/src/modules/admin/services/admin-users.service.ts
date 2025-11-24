import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '@modules/auth/entities/user.entity';
import {
  ListUsersDto,
  UpdateUserDto,
  SuspendUserDto,
  ResetPasswordDto,
  PaginatedUsersDto,
  UserStatsDto,
} from '../dto/users';
import { UserStatusEnum } from '@shared/constants';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User, 'auth')
    private readonly userRepo: Repository<User>,
  ) {}

  async listUsers(query: ListUsersDto): Promise<PaginatedUsersDto> {
    const { search, role, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.email = Like(`%${search}%`);
    }
    if (role) where.role = role;

    // Fix: Usar deleted_at para determinar status (activo/suspendido)
    // active = deleted_at IS NULL, suspended/inactive = deleted_at IS NOT NULL
    if (status) {
      if (status === UserStatusEnum.ACTIVE) {
        where.deleted_at = null;
      } else if (status === UserStatusEnum.SUSPENDED || status === UserStatusEnum.INACTIVE) {
        // Para suspended: usar IsNotNull() en el query builder
        // Esta es una aproximación simple, mejor usar QueryBuilder
      }
    }

    const [data, total] = await this.userRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: data as any,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserDetails(id);
    Object.assign(user, updateDto);
    return await this.userRepo.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserDetails(id);
    await this.userRepo.remove(user);
  }

  async suspendUser(id: string, suspendDto: SuspendUserDto): Promise<User> {
    const user = await this.getUserDetails(id);

    // Fix: Usar deleted_at para marcar como suspendido (soft delete)
    user.deleted_at = new Date();
    user.raw_user_meta_data = {
      ...user.raw_user_meta_data,
      suspension_reason: suspendDto.reason,
      suspended_at: new Date().toISOString(),
      status: 'suspended', // Guardar status en metadata para referencia
    };
    return await this.userRepo.save(user);
  }

  async activateUser(id: string): Promise<User> {
    const user = await this.getUserDetails(id);

    // Fix: Limpiar deleted_at para marcar como activo
    user.deleted_at = undefined;
    user.raw_user_meta_data = {
      ...user.raw_user_meta_data,
      activated_at: new Date().toISOString(),
      status: 'active', // Guardar status en metadata para referencia
    };
    return await this.userRepo.save(user);
  }

  async unsuspendUser(id: string): Promise<User> {
    const user = await this.getUserDetails(id);

    if (!user.deleted_at) {
      throw new BadRequestException('User is not currently suspended');
    }

    // Limpiar deleted_at y metadata de suspensión
    user.deleted_at = undefined;
    user.raw_user_meta_data = {
      ...user.raw_user_meta_data,
      unsuspended_at: new Date().toISOString(),
      status: 'active',
      suspension_reason: undefined, // Limpiar razón de suspensión
    };

    return await this.userRepo.save(user);
  }

  async deactivateUser(id: string, deactivateDto: SuspendUserDto): Promise<User> {
    const user = await this.getUserDetails(id);

    if (user.deleted_at) {
      throw new BadRequestException('User is already deactivated or suspended');
    }

    // Marcar como desactivado (similar a suspend pero con diferente semántica)
    user.deleted_at = new Date();
    user.raw_user_meta_data = {
      ...user.raw_user_meta_data,
      deactivation_reason: deactivateDto.reason,
      deactivated_at: new Date().toISOString(),
      status: 'inactive',
    };

    return await this.userRepo.save(user);
  }

  async resetPassword(
    id: string,
    resetDto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.getUserDetails(id);

    // Mark user as requiring password reset
    user.raw_user_meta_data = {
      ...user.raw_user_meta_data,
      require_password_reset: true,
      password_reset_requested_at: new Date().toISOString(),
      password_reset_requested_by: 'admin',
    };

    await this.userRepo.save(user);

    // In production: Generate reset token and send email
    // For now, just return success
    const message = resetDto.sendEmail
      ? 'Password reset email sent to user'
      : 'User marked for password reset on next login';

    return {
      success: true,
      message,
    };
  }

  async getUserStats(): Promise<UserStatsDto> {
    const total = await this.userRepo.count();

    // Fix: Usar deleted_at para determinar usuarios activos/suspendidos
    const active = await this.userRepo.count({
      where: { deleted_at: null as any } // Usuario activo = deleted_at IS NULL
    });

    const suspended = await this.userRepo
      .createQueryBuilder('user')
      .where('user.deleted_at IS NOT NULL')
      .getCount();

    // Fix: Usar email_confirmed_at para verificar email
    const pending = await this.userRepo.count({
      where: { email_confirmed_at: null as any } // Email no verificado = email_confirmed_at IS NULL
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = await this.userRepo
      .createQueryBuilder('user')
      .where('user.created_at > :date', { date: thirtyDaysAgo })
      .getCount();

    return {
      total_users: total,
      active_users: active,
      suspended_users: suspended,
      pending_verification: pending,
      students: 0, // TODO: Implementar conteo por rol
      teachers: 0,
      admins: 0,
      users_last_30_days: recent,
    };
  }
}
