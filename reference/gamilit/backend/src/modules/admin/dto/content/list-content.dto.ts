import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatusEnum } from '@shared/constants';

export class ListContentDto {
  @ApiPropertyOptional({
    description: 'Filter by content type',
    enum: ['module', 'exercise', 'template'],
    example: 'module',
  })
  @IsOptional()
  @IsEnum(['module', 'exercise', 'template'])
  content_type?: 'module' | 'exercise' | 'template';

  @ApiPropertyOptional({
    description: 'Filter by content status',
    enum: ContentStatusEnum,
    example: ContentStatusEnum.UNDER_REVIEW,
  })
  @IsOptional()
  @IsEnum(ContentStatusEnum)
  status?: ContentStatusEnum;

  @ApiPropertyOptional({
    description: 'Search by title or description',
    example: 'Marie Curie',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by creator user ID',
    example: 'abc123...',
  })
  @IsOptional()
  @IsString()
  created_by?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
