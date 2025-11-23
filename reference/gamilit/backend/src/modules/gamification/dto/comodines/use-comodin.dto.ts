import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComodinTypeEnum } from '@/shared/constants/enums.constants';

/**
 * Use Comodin DTO
 *
 * @description DTO para usar un comodín (power-up)
 * @usage Usado en endpoint de uso de comodines durante ejercicios
 *
 * Validaciones críticas:
 * - quantity >= 1
 * - comodin_type debe ser válido según enum
 * - Validar stock suficiente antes de uso (en servicio)
 */
export class UseComodinDto {
  @ApiProperty({
    description: 'ID del usuario que usa el comodín',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  user_id!: string;

  @ApiProperty({
    description: 'Tipo de comodín a usar',
    enum: ComodinTypeEnum,
    example: ComodinTypeEnum.PISTAS,
  })
  @IsEnum(ComodinTypeEnum)
  comodin_type!: ComodinTypeEnum;

  @ApiProperty({
    description: 'Cantidad a usar',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({
    description: 'ID del ejercicio donde se usa',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  exercise_id?: string;

  @ApiPropertyOptional({
    description: 'Contexto adicional del uso',
    example: 'Used hint during difficult comprehension question',
  })
  @IsOptional()
  @IsString()
  context?: string;
}
