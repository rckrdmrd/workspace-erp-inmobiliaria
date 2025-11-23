import { ApiProperty } from '@nestjs/swagger';
import { AuditLogDto } from './audit-log.dto';

export class PaginatedAuditLogDto {
  @ApiProperty({
    description: 'Array of audit log entries',
    type: [AuditLogDto],
  })
  data!: AuditLogDto[];

  @ApiProperty({
    description: 'Total number of audit log entries',
    example: 1250,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Items per page',
    example: 50,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 25,
  })
  total_pages!: number;
}
