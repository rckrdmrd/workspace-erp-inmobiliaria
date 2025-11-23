import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({
    description: 'Permission key',
    example: 'can_create_content',
  })
  key!: string;

  @ApiProperty({
    description: 'Permission display name',
    example: 'Can Create Content',
  })
  displayName!: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows user to create new content in the platform',
  })
  description!: string;

  @ApiProperty({
    description: 'Permission category',
    example: 'content',
  })
  category!: string;
}

export class RoleDto {
  @ApiProperty({
    description: 'Role unique identifier',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  id!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'teacher',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Teacher role with content creation permissions',
  })
  description?: string;

  @ApiProperty({
    description: 'Role permissions in JSON format',
    example: { can_create_content: true, can_delete_users: false },
  })
  permissions!: Record<string, boolean>;

  @ApiProperty({
    description: 'Indicates if the role is active',
    example: true,
  })
  is_active!: boolean;

  @ApiProperty({
    description: 'Number of users with this role',
    example: 45,
  })
  users_count?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-11-19T10:30:00Z',
  })
  created_at!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-11-19T10:30:00Z',
  })
  updated_at!: string;
}
