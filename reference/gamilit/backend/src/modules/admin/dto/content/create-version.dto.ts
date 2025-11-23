import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * DTO for creating a version snapshot of content
 * Supports modules, exercises, and templates
 */
export class CreateVersionDto {
  @ApiProperty({
    description: 'UUID of the content to version',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  content_id!: string;

  @ApiProperty({
    description: 'Type of content to version',
    enum: ['module', 'exercise', 'template'],
    example: 'module',
  })
  @IsEnum(['module', 'exercise', 'template'], {
    message: 'content_type must be one of: module, exercise, template',
  })
  @IsNotEmpty()
  content_type!: 'module' | 'exercise' | 'template';

  @ApiProperty({
    description: 'Optional notes describing the changes in this version',
    example: 'Updated title and description',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  version_notes?: string;

  @ApiProperty({
    description:
      'Optional custom version number in semver format (x.y.z). If not provided, auto-increments minor version.',
    example: '1.2.0',
    required: false,
    pattern: '^\\d+\\.\\d+\\.\\d+$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'new_version must be in semver format (x.y.z)',
  })
  new_version?: string;
}
