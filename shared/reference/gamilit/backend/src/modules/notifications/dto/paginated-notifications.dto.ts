import { ApiProperty } from '@nestjs/swagger';
import { NotificationResponseDto } from './notification-response.dto';

export class PaginatedNotificationsDto {
  @ApiProperty({
    type: [NotificationResponseDto],
    description: 'Array of notifications',
  })
  data!: NotificationResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 50,
      page: 1,
      limit: 20,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
