import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for removing a classroom assignment
 */
export class RemoveAssignmentDto {
  @ApiPropertyOptional({
    description:
      'Force removal even if classroom has active students. Default: false',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
