import { ApiProperty } from '@nestjs/swagger';

/**
 * Comodin Item Response DTO
 *
 * @description Información de un tipo de comodín específico
 */
export class ComodinItemDto {
  @ApiProperty({
    description: 'Tipo de comodín',
    example: 'pistas',
  })
  type!: string;

  @ApiProperty({
    description: 'Cantidad disponible',
    example: 5,
  })
  available!: number;

  @ApiProperty({
    description: 'Total comprado',
    example: 10,
  })
  purchased_total!: number;

  @ApiProperty({
    description: 'Total usado',
    example: 5,
  })
  used_total!: number;

  @ApiProperty({
    description: 'Costo en ML Coins',
    example: 15,
  })
  cost!: number;
}

/**
 * Inventory Response DTO
 *
 * @description DTO de respuesta para inventario de comodines
 * @usage Retornado en endpoints de consulta de inventario
 */
export class InventoryResponseDto {
  @ApiProperty({
    description: 'ID del inventario',
    example: '990e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  @ApiProperty({
    description: 'Pistas Contextuales',
    type: ComodinItemDto,
  })
  pistas!: ComodinItemDto;

  @ApiProperty({
    description: 'Visión Lectora',
    type: ComodinItemDto,
  })
  vision_lectora!: ComodinItemDto;

  @ApiProperty({
    description: 'Segunda Oportunidad',
    type: ComodinItemDto,
  })
  segunda_oportunidad!: ComodinItemDto;

  @ApiProperty({
    description: 'Metadatos adicionales',
    example: { last_purchase_date: '2025-11-01T10:00:00Z' },
  })
  metadata!: Record<string, any>;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-10-01T00:00:00Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-11-02T14:30:00Z',
  })
  updated_at!: Date;
}
