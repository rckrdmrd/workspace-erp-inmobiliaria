import { ApiProperty } from '@nestjs/swagger';
import { ContentDto } from './content.dto';

export class PaginatedContentDto {
  @ApiProperty({
    description: 'Array of content items',
    type: [ContentDto],
  })
  data!: ContentDto[];

  @ApiProperty({
    description: 'Total number of content items',
    example: 45,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  total_pages!: number;
}
