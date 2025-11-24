import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsBoolean,
  IsInt,
  Min,
  IsObject,
  IsDateString,
  Matches,
  IsUrl,
} from 'class-validator';
import { SubscriptionTierEnum } from '@/shared/constants/enums.constants';

/**
 * CreateTenantDto - DTO para creación de tenants
 *
 * @description Valida los datos de entrada al crear un nuevo tenant.
 * Solo incluye campos que el cliente puede enviar (excluye id, created_at, updated_at).
 *
 * @see TenantEntity para la estructura completa
 */
export class CreateTenantDto {
  /**
   * Nombre completo del tenant/organización
   * @required
   * @minLength 1
   * @example "Universidad Nacional Autónoma de México"
   */
  @IsString()
  @MinLength(1, { message: 'El nombre del tenant no puede estar vacío' })
  @MaxLength(500, { message: 'El nombre del tenant no puede exceder 500 caracteres' })
  name!: string;

  /**
   * Slug URL-friendly único para el tenant
   * @required
   * @pattern Solo letras minúsculas, números y guiones
   * @example "unam-fes-aragon"
   */
  @IsString()
  @MinLength(3, { message: 'El slug debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El slug no puede exceder 100 caracteres' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'El slug solo puede contener letras minúsculas, números y guiones (sin espacios)',
  })
  slug!: string;

  /**
   * Dominio personalizado del tenant (opcional)
   * @optional
   * @example "unam.gamilit.com"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El dominio no puede exceder 255 caracteres' })
  domain?: string;

  /**
   * URL del logo del tenant (opcional)
   * @optional
   * @example "https://cdn.gamilit.com/logos/unam.png"
   */
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'La URL del logo debe ser válida' })
  logo_url?: string;

  /**
   * Nivel de suscripción del tenant
   * @optional
   * @default SubscriptionTierEnum.FREE
   */
  @IsEnum(SubscriptionTierEnum, {
    message: `El tier de suscripción debe ser uno de: ${Object.values(SubscriptionTierEnum).join(', ')}`,
  })
  @IsOptional()
  subscription_tier?: SubscriptionTierEnum = SubscriptionTierEnum.FREE;

  /**
   * Número máximo de usuarios permitidos
   * @optional
   * @default 100
   * @min 1
   */
  @IsInt({ message: 'El máximo de usuarios debe ser un número entero' })
  @Min(1, { message: 'El máximo de usuarios debe ser al menos 1' })
  @IsOptional()
  max_users?: number = 100;

  /**
   * Almacenamiento máximo en GB
   * @optional
   * @default 5
   * @min 1
   */
  @IsInt({ message: 'El máximo de storage debe ser un número entero' })
  @Min(1, { message: 'El máximo de storage debe ser al menos 1 GB' })
  @IsOptional()
  max_storage_gb?: number = 5;

  /**
   * Estado activo del tenant
   * @optional
   * @default true
   */
  @IsBoolean({ message: 'is_active debe ser un valor booleano' })
  @IsOptional()
  is_active?: boolean = true;

  /**
   * Fecha de fin del período de prueba (opcional)
   * @optional
   * @format ISO 8601
   */
  @IsDateString({}, { message: 'La fecha de fin de prueba debe estar en formato ISO 8601' })
  @IsOptional()
  trial_ends_at?: Date;

  /**
   * Configuraciones del tenant (JSONB)
   * @optional
   * @default { theme: "detective", features: {...}, language: "es", timezone: "America/Mexico_City" }
   */
  @IsObject({ message: 'Las configuraciones deben ser un objeto JSON válido' })
  @IsOptional()
  settings?: Record<string, any>;

  /**
   * Metadata adicional del tenant (JSONB)
   * @optional
   * @default {}
   */
  @IsObject({ message: 'La metadata debe ser un objeto JSON válido' })
  @IsOptional()
  metadata?: Record<string, any>;
}
