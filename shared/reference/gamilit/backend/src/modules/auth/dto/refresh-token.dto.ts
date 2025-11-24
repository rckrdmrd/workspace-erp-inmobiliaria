import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * RefreshTokenDto
 *
 * @description DTO para renovar access token usando refresh token.
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token para generar nuevo access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @IsString({ message: 'Refresh token debe ser string' })
  @IsNotEmpty({ message: 'Refresh token es requerido' })
  refreshToken!: string;
}
