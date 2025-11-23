import { IsOptional, IsEnum, IsEmail, IsBoolean, IsObject } from 'class-validator';
import { GamilityRoleEnum, UserStatusEnum } from '@shared/constants';

/**
 * UpdateUserDto
 * DTO para actualizar información de usuario (admin only)
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(GamilityRoleEnum)
  role?: GamilityRoleEnum;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsObject()
  raw_user_meta_data?: Record<string, any>;
}
