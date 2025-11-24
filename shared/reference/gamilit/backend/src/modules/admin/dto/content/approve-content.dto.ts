import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveContentDto {
  @ApiPropertyOptional({
    description: 'Optional notes or feedback from the admin upon approval',
    example: 'Excellent content, approved for publication',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  approval_notes?: string;

  @ApiPropertyOptional({
    description: 'Whether to publish immediately after approval',
    example: true,
    default: true,
  })
  @IsOptional()
  publish_immediately?: boolean;
}
