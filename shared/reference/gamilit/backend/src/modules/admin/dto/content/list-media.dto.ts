import { IsOptional, IsEnum, IsInt, Min, Max, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MediaTypeEnum } from '@shared/constants/enums.constants';

export class ListMediaDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search term to filter files by filename or description',
    example: 'marie-curie',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by media type',
    enum: MediaTypeEnum,
    example: MediaTypeEnum.IMAGE,
  })
  @IsOptional()
  @IsEnum(MediaTypeEnum)
  media_type?: MediaTypeEnum;

  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'exercise',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by uploader ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  uploaded_by?: string;
}
