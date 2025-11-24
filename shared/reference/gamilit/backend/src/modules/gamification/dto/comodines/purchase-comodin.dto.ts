import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComodinTypeEnum } from '@/shared/constants/enums.constants';

/**
 * Purchase Comodin DTO
 *
 * @description DTO para comprar comodines (power-ups)
 * @usage Usado en endpoint de compra de comodines
 *
 * Validaciones críticas:
 * - quantity >= 1
 * - comodin_type debe ser válido según enum
 * - Validar balance suficiente antes de compra (en servicio)
 */
export class PurchaseComodinDto {
  @ApiProperty({
    description: 'ID del usuario que compra',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  user_id!: string;

  @ApiProperty({
    description: 'Tipo de comodín a comprar',
    enum: ComodinTypeEnum,
    example: ComodinTypeEnum.PISTAS,
  })
  @IsEnum(ComodinTypeEnum)
  comodin_type!: ComodinTypeEnum;

  @ApiProperty({
    description: 'Cantidad a comprar',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
