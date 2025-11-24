import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum ReportType {
  USERS = 'users',
  PROGRESS = 'progress',
  GAMIFICATION = 'gamification',
  SYSTEM = 'system',
}

export enum ReportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  PDF = 'pdf',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class ReportDto {
  @ApiProperty({
    description: 'Report unique identifier',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  id!: string;

  @ApiProperty({
    description: 'Report type',
    enum: ReportType,
    example: ReportType.USERS,
  })
  type!: ReportType;

  @ApiProperty({
    description: 'Report format',
    enum: ReportFormat,
    example: ReportFormat.EXCEL,
  })
  format!: ReportFormat;

  @ApiProperty({
    description: 'Report status',
    enum: ReportStatus,
    example: ReportStatus.COMPLETED,
  })
  status!: ReportStatus;

  @ApiPropertyOptional({
    description: 'Report file URL (when completed)',
    example: '/reports/users-2025-11-19.xlsx',
  })
  file_url?: string;

  @ApiPropertyOptional({
    description: 'Report metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Report creation timestamp',
    example: '2025-11-19T10:30:00Z',
  })
  created_at!: string;

  @ApiPropertyOptional({
    description: 'Report completion timestamp',
    example: '2025-11-19T10:35:00Z',
  })
  completed_at?: string;

  @ApiProperty({
    description: 'User ID who requested the report',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  })
  requested_by!: string;
}

export class GenerateReportDto {
  @ApiProperty({
    description: 'Type of report to generate',
    enum: ReportType,
    example: ReportType.USERS,
  })
  @IsEnum(ReportType)
  type!: ReportType;

  @ApiProperty({
    description: 'Report output format',
    enum: ReportFormat,
    example: ReportFormat.EXCEL,
  })
  @IsEnum(ReportFormat)
  format!: ReportFormat;

  @ApiPropertyOptional({
    description: 'Report filters',
    example: { start_date: '2025-01-01', end_date: '2025-12-31' },
  })
  @IsOptional()
  filters?: Record<string, any>;
}

export class ListReportsDto {
  @ApiPropertyOptional({
    description: 'Filter by report type',
    enum: ReportType,
  })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ReportStatus,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  limit?: number = 20;
}

export class PaginatedReportsDto {
  @ApiProperty({
    description: 'Array of reports',
    type: [ReportDto],
  })
  data!: ReportDto[];

  @ApiProperty({
    description: 'Total number of reports',
    example: 50,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total pages',
    example: 3,
  })
  total_pages!: number;
}
