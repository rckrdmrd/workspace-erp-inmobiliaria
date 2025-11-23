import { IsString, IsNotEmpty } from 'class-validator';

/**
 * SuspendUserDto
 * DTO para suspender cuenta de usuario con razón
 */
export class SuspendUserDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
