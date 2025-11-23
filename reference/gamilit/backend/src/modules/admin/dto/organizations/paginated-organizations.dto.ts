import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages!: number;

  @ApiProperty({ description: 'Total number of items', example: 150 })
  totalItems!: number;

  @ApiProperty({ description: 'Items per page', example: 20 })
  limit!: number;
}

export class PaginatedOrganizationsDto {
  @ApiProperty({
    description: 'Array of organizations',
    type: [OrganizationDto],
  })
  items!: OrganizationDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
  })
  pagination!: PaginationMeta;
}
