import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class UpdatePermissionsDto {
  @ApiProperty({
    description: 'Updated permissions in JSON format',
    example: {
      can_create_content: true,
      can_delete_users: false,
      can_manage_settings: true,
      can_view_reports: true,
    },
  })
  @IsObject()
  @IsNotEmpty()
  permissions!: Record<string, boolean>;
}

export class RolePermissionsDto {
  @ApiProperty({
    description: 'Role ID',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  role_id!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'teacher',
  })
  role_name!: string;

  @ApiProperty({
    description: 'Current permissions',
    example: {
      can_create_content: true,
      can_delete_users: false,
    },
  })
  permissions!: Record<string, boolean>;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-11-19T10:30:00Z',
  })
  updated_at!: string;
}
