import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for filtering available classrooms
 */
export class AvailableClassroomsFiltersDto {
  @ApiPropertyOptional({
    description: 'Search by classroom name',
    example: '3-A',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by education level',
    example: 'primaria',
    enum: ['primaria', 'secundaria', 'preparatoria'],
  })
  @IsOptional()
  @IsEnum(['primaria', 'secundaria', 'preparatoria'])
  level?: string;

  @ApiPropertyOptional({
    description: 'Only return active classrooms',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  activeOnly?: boolean;
}
