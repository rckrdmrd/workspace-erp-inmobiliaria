import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectContentDto {
  @ApiProperty({
    description: 'Reason for rejecting the content (required)',
    example: 'Contains factual errors in the historical context section. Please review and correct.',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  rejection_reason!: string;
}
