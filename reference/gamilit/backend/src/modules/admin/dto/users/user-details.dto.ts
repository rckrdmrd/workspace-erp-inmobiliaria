import { Expose } from 'class-transformer';

/**
 * UserDetailsDto
 * Response con detalles completos de un usuario
 */
export class UserDetailsDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: string;

  @Expose()
  tenant_id?: string;

  @Expose()
  status!: string;

  @Expose()
  email_verified!: boolean;

  @Expose()
  email_confirmed_at?: Date;

  @Expose()
  last_sign_in_at?: Date;

  @Expose()
  raw_user_meta_data!: Record<string, any>;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;
}
