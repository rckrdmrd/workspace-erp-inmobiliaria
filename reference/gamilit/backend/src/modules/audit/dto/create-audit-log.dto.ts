/**
 * Create Audit Log DTO
 */

import { IsString, IsOptional, IsEnum, IsObject, IsArray } from 'class-validator';
import { ActorType, Severity, Status } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsString()
  eventType!: string;

  @IsString()
  action!: string;

  @IsOptional()
  @IsString()
  resourceType?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsEnum(ActorType)
  actorType?: ActorType;

  @IsOptional()
  @IsString()
  actorIp?: string;

  @IsOptional()
  @IsString()
  actorUserAgent?: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  oldValues?: any;

  @IsOptional()
  @IsObject()
  newValues?: any;

  @IsOptional()
  @IsObject()
  changes?: any;

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  errorCode?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsString()
  stackTrace?: string;

  @IsOptional()
  @IsString()
  requestId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsObject()
  additionalData?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
