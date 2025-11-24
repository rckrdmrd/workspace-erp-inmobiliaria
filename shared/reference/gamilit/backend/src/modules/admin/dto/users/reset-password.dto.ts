import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiPropertyOptional({
    description: 'Whether to send email notification to user',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean = true;

  @ApiPropertyOptional({
    description: 'Custom message to include in the reset email',
    example: 'Your password has been reset by an administrator.',
  })
  @IsOptional()
  @IsString()
  customMessage?: string;
}
