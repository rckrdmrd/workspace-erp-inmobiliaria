import { ApiProperty } from '@nestjs/swagger';
import { MediaFileResponseDto } from '@modules/content/dto/media-file-response.dto';

export class PaginatedMediaDto {
  @ApiProperty({
    description: 'List of media files',
    type: [MediaFileResponseDto],
  })
  data!: MediaFileResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total pages' })
  total_pages!: number;
}
