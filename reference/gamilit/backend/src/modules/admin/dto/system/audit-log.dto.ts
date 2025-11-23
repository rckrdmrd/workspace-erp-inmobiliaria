import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditLogDto {
  @ApiProperty({ description: 'Audit log ID', example: 'abc123...' })
  id!: string;

  @ApiPropertyOptional({ description: 'User ID', example: 'user123...' })
  user_id?: string | null;

  @ApiProperty({ description: 'Email attempted', example: 'user@example.com' })
  email!: string;

  @ApiPropertyOptional({ description: 'IP address', example: '192.168.1.1' })
  ip_address?: string | null;

  @ApiPropertyOptional({ description: 'User agent string' })
  user_agent?: string | null;

  @ApiProperty({ description: 'Was attempt successful', example: false })
  success!: boolean;

  @ApiPropertyOptional({ description: 'Failure reason', example: 'Invalid credentials' })
  failure_reason?: string | null;

  @ApiProperty({ description: 'Timestamp of attempt', example: '2025-11-02T18:00:00Z' })
  attempted_at!: Date;
}
