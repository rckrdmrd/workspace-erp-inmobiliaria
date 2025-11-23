/**
 * UserStatsDto
 * Estadísticas de usuarios del sistema
 */
export class UserStatsDto {
  total_users!: number;
  active_users!: number;
  suspended_users!: number;
  pending_verification!: number;
  students!: number;
  teachers!: number;
  admins!: number;
  users_last_30_days!: number;
}
