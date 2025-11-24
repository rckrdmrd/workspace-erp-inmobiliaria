import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { GamilityRoleEnum, UserStatusEnum } from '@shared/constants';

/**
 * ListUsersDto
 * Query parameters para listar usuarios con filtros y paginación
 */
export class ListUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(GamilityRoleEnum)
  role?: GamilityRoleEnum;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
