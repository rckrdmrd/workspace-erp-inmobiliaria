import { UserDetailsDto } from './user-details.dto';

/**
 * PaginatedUsersDto
 * Response paginada de lista de usuarios
 */
export class PaginatedUsersDto {
  data!: UserDetailsDto[];
  total!: number;
  page!: number;
  limit!: number;
  total_pages!: number;
}
