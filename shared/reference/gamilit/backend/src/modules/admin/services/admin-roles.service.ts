import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@modules/auth/entities/role.entity';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import {
  RoleDto,
  PermissionDto,
  UpdatePermissionsDto,
  RolePermissionsDto,
} from '../dto/roles';

@Injectable()
export class AdminRolesService {
  constructor(
    @InjectRepository(Role, 'auth')
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole, 'auth')
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  /**
   * Get all available roles with their permissions
   */
  async getRoles(): Promise<RoleDto[]> {
    const roles = await this.roleRepo.find({
      order: { name: 'ASC' },
    });

    // Get user counts for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const usersCount = await this.userRoleRepo.count({
          where: { role: role.name as any },
        });

        return {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          is_active: role.is_active,
          users_count: usersCount,
          created_at: role.created_at.toISOString(),
          updated_at: role.updated_at.toISOString(),
        };
      }),
    );

    return rolesWithCounts;
  }

  /**
   * Get permissions for a specific role
   */
  async getRolePermissions(roleId: string): Promise<RolePermissionsDto> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return {
      role_id: role.id,
      role_name: role.name,
      permissions: role.permissions,
      updated_at: role.updated_at.toISOString(),
    };
  }

  /**
   * Update permissions for a specific role
   */
  async updateRolePermissions(
    roleId: string,
    updateDto: UpdatePermissionsDto,
  ): Promise<RolePermissionsDto> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Update permissions
    role.permissions = updateDto.permissions;
    const updatedRole = await this.roleRepo.save(role);

    return {
      role_id: updatedRole.id,
      role_name: updatedRole.name,
      permissions: updatedRole.permissions,
      updated_at: updatedRole.updated_at.toISOString(),
    };
  }

  /**
   * Get all available permissions in the system
   */
  async getAvailablePermissions(): Promise<PermissionDto[]> {
    // Define all available permissions in the system
    // In a real system, this could come from a database table or configuration file
    const permissions: PermissionDto[] = [
      // Content permissions
      {
        key: 'can_create_content',
        displayName: 'Can Create Content',
        description: 'Allows user to create new content in the platform',
        category: 'content',
      },
      {
        key: 'can_edit_content',
        displayName: 'Can Edit Content',
        description: 'Allows user to edit existing content',
        category: 'content',
      },
      {
        key: 'can_delete_content',
        displayName: 'Can Delete Content',
        description: 'Allows user to delete content',
        category: 'content',
      },
      {
        key: 'can_approve_content',
        displayName: 'Can Approve Content',
        description: 'Allows user to approve content for publication',
        category: 'content',
      },

      // User management permissions
      {
        key: 'can_create_users',
        displayName: 'Can Create Users',
        description: 'Allows user to create new user accounts',
        category: 'users',
      },
      {
        key: 'can_edit_users',
        displayName: 'Can Edit Users',
        description: 'Allows user to edit user information',
        category: 'users',
      },
      {
        key: 'can_delete_users',
        displayName: 'Can Delete Users',
        description: 'Allows user to delete user accounts',
        category: 'users',
      },
      {
        key: 'can_suspend_users',
        displayName: 'Can Suspend Users',
        description: 'Allows user to suspend or ban users',
        category: 'users',
      },

      // Organization permissions
      {
        key: 'can_manage_organizations',
        displayName: 'Can Manage Organizations',
        description: 'Allows user to manage organizations/tenants',
        category: 'organizations',
      },

      // System permissions
      {
        key: 'can_manage_settings',
        displayName: 'Can Manage Settings',
        description: 'Allows user to modify system settings',
        category: 'system',
      },
      {
        key: 'can_view_reports',
        displayName: 'Can View Reports',
        description: 'Allows user to view system reports',
        category: 'reports',
      },
      {
        key: 'can_generate_reports',
        displayName: 'Can Generate Reports',
        description: 'Allows user to generate custom reports',
        category: 'reports',
      },
      {
        key: 'can_manage_gamification',
        displayName: 'Can Manage Gamification',
        description: 'Allows user to configure gamification settings',
        category: 'gamification',
      },

      // Analytics permissions
      {
        key: 'can_view_analytics',
        displayName: 'Can View Analytics',
        description: 'Allows user to view platform analytics',
        category: 'analytics',
      },

      // Advanced permissions
      {
        key: 'can_access_admin_panel',
        displayName: 'Can Access Admin Panel',
        description: 'Allows user to access the admin panel',
        category: 'admin',
      },
      {
        key: 'can_manage_roles',
        displayName: 'Can Manage Roles',
        description: 'Allows user to manage roles and permissions',
        category: 'admin',
      },
    ];

    return permissions;
  }
}
