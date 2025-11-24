/**
 * DTOs for Analytics Queries
 */

import { IsEnum, IsOptional, IsUUID, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export enum TimeRange {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  ALL = 'all',
}

export enum ReportFormat {
  JSON = 'json',
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
}

export class GetAnalyticsQueryDto {
  @ApiPropertyOptional({ enum: TimeRange, description: 'Time range filter' })
  @IsEnum(TimeRange)
  @IsOptional()
  time_range?: TimeRange = TimeRange.THIRTY_DAYS;

  @ApiPropertyOptional({ description: 'Filter by module ID' })
  @IsUUID()
  @IsOptional()
  module_id?: string;
}

export class GetStudentProgressQueryDto {
  @ApiPropertyOptional({ enum: TimeRange, description: 'Time range for exercise history' })
  @IsEnum(TimeRange)
  @IsOptional()
  time_range?: TimeRange = TimeRange.THIRTY_DAYS;

  @ApiPropertyOptional({ description: 'Filter exercise history by module' })
  @IsUUID()
  @IsOptional()
  module_id?: string;

  @ApiPropertyOptional({ enum: ['all', 'correct', 'incorrect'] })
  @IsEnum(['all', 'correct', 'incorrect'])
  @IsOptional()
  status?: 'all' | 'correct' | 'incorrect' = 'all';
}

export class GetEngagementMetricsDto {
  @ApiPropertyOptional({ enum: TimeRange, description: 'Time range filter', default: TimeRange.THIRTY_DAYS })
  @IsEnum(TimeRange)
  @IsOptional()
  time_range?: TimeRange = TimeRange.THIRTY_DAYS;

  @ApiPropertyOptional({ description: 'Filter by classroom ID' })
  @IsUUID()
  @IsOptional()
  classroom_id?: string;
}

export class GenerateReportsDto {
  @ApiPropertyOptional({ enum: TimeRange, description: 'Time range for report', default: TimeRange.THIRTY_DAYS })
  @IsEnum(TimeRange)
  @IsOptional()
  time_range?: TimeRange = TimeRange.THIRTY_DAYS;

  @ApiPropertyOptional({ enum: ReportFormat, description: 'Report format', default: ReportFormat.JSON })
  @IsEnum(ReportFormat)
  @IsOptional()
  format?: ReportFormat = ReportFormat.JSON;

  @ApiPropertyOptional({ description: 'Filter by classroom ID' })
  @IsUUID()
  @IsOptional()
  classroom_id?: string;

  @ApiPropertyOptional({ description: 'Report type', enum: ['classroom', 'student', 'assignment', 'overall'] })
  @IsOptional()
  @IsString()
  report_type?: string = 'overall';
}

/**
 * Student Insights Response DTO
 * Provides comprehensive analytics and AI-generated insights for individual students
 */
export class StudentInsightsResponseDto {
  @ApiProperty({ description: 'Overall performance score (0-100)' })
  overall_score!: number;

  @ApiProperty({ description: 'Number of modules completed' })
  modules_completed!: number;

  @ApiProperty({ description: 'Total number of modules' })
  modules_total!: number;

  @ApiProperty({ description: 'Comparison to class metrics' })
  comparison_to_class!: {
    score_percentile: number;
  };

  @ApiProperty({ description: 'Risk level', enum: ['low', 'medium', 'high'] })
  risk_level!: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Student strengths', type: [String] })
  strengths!: string[];

  @ApiProperty({ description: 'Areas for improvement', type: [String] })
  weaknesses!: string[];

  @ApiProperty({ description: 'Performance predictions' })
  predictions!: {
    completion_probability: number;
    dropout_risk: number;
  };

  @ApiProperty({ description: 'Personalized recommendations', type: [String] })
  recommendations!: string[];
}
