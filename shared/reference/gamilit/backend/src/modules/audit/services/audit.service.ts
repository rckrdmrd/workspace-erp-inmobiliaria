/**
 * Audit Service
 *
 * Centralized service for audit logging.
 * Tracks all critical system actions for compliance and security.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, ActorType, Severity, Status } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog, 'audit')
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Log Audit Event
   *
   * Records an audit event to the audit_logs table.
   * Failures are logged but don't throw errors to avoid disrupting business logic.
   */
  async logEvent(event: CreateAuditLogDto): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        tenantId: event.tenantId || null,
        eventType: event.eventType,
        action: event.action,
        resourceType: event.resourceType || null,
        resourceId: event.resourceId || null,
        actorId: event.actorId || null,
        actorType: event.actorType || ActorType.USER,
        actorIp: event.actorIp || null,
        actorUserAgent: event.actorUserAgent || null,
        targetId: event.targetId || null,
        targetType: event.targetType || null,
        sessionId: event.sessionId || null,
        description: event.description || null,
        oldValues: event.oldValues || null,
        newValues: event.newValues || null,
        changes: event.changes || null,
        severity: event.severity || Severity.INFO,
        status: event.status || Status.SUCCESS,
        errorCode: event.errorCode || null,
        errorMessage: event.errorMessage || null,
        stackTrace: event.stackTrace || null,
        requestId: event.requestId || null,
        correlationId: event.correlationId || null,
        additionalData: event.additionalData || null,
        tags: event.tags || null,
      });

      await this.auditLogRepository.save(auditLog);

      this.logger.debug(`Audit event logged: ${event.eventType} - ${event.action}`);
    } catch (error) {
      // Don't throw on audit log failure - log error but continue
      this.logger.error('Failed to log audit event:', error);
    }
  }

  /**
   * Log Organization Created
   */
  async logOrganizationCreated(
    organizationId: string,
    organizationData: any,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'organization_created',
      action: 'create',
      resourceType: 'organization',
      resourceId: organizationId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.INFO,
      status: Status.SUCCESS,
      description: `Organization created: ${organizationData.name}`,
      newValues: organizationData,
      tags: ['admin', 'organization', 'create'],
    });
  }

  /**
   * Log Organization Updated
   */
  async logOrganizationUpdated(
    organizationId: string,
    oldValues: any,
    newValues: any,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    const changes = this.calculateChanges(oldValues, newValues);

    await this.logEvent({
      eventType: 'organization_updated',
      action: 'update',
      resourceType: 'organization',
      resourceId: organizationId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.INFO,
      status: Status.SUCCESS,
      description: `Organization updated: ${newValues.name}`,
      oldValues,
      newValues,
      changes,
      tags: ['admin', 'organization', 'update'],
    });
  }

  /**
   * Log Organization Deleted
   */
  async logOrganizationDeleted(
    organizationId: string,
    organizationData: any,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'organization_deleted',
      action: 'delete',
      resourceType: 'organization',
      resourceId: organizationId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.WARNING,
      status: Status.SUCCESS,
      description: `Organization deleted: ${organizationData.name}`,
      oldValues: organizationData,
      tags: ['admin', 'organization', 'delete'],
    });
  }

  /**
   * Log User Role Changed
   */
  async logUserRoleChanged(
    userId: string,
    oldRole: string,
    newRole: string,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'user_role_changed',
      action: 'update_role',
      resourceType: 'user',
      resourceId: userId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.WARNING,
      status: Status.SUCCESS,
      description: `User role changed from ${oldRole} to ${newRole}`,
      oldValues: { role: oldRole },
      newValues: { role: newRole },
      changes: { role: { from: oldRole, to: newRole } },
      tags: ['admin', 'user', 'role', 'security'],
    });
  }

  /**
   * Log User Status Changed
   */
  async logUserStatusChanged(
    userId: string,
    oldStatus: string,
    newStatus: string,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'user_status_changed',
      action: 'update_status',
      resourceType: 'user',
      resourceId: userId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.INFO,
      status: Status.SUCCESS,
      description: `User status changed from ${oldStatus} to ${newStatus}`,
      oldValues: { status: oldStatus },
      newValues: { status: newStatus },
      changes: { status: { from: oldStatus, to: newStatus } },
      tags: ['admin', 'user', 'status'],
    });
  }

  /**
   * Log Content Approved
   */
  async logContentApproved(
    contentId: string,
    contentType: string,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'content_approved',
      action: 'approve',
      resourceType: contentType,
      resourceId: contentId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.INFO,
      status: Status.SUCCESS,
      description: `${contentType} approved`,
      tags: ['admin', 'content', 'approval'],
    });
  }

  /**
   * Log Content Rejected
   */
  async logContentRejected(
    contentId: string,
    contentType: string,
    reason: string,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'content_rejected',
      action: 'reject',
      resourceType: contentType,
      resourceId: contentId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.INFO,
      status: Status.SUCCESS,
      description: `${contentType} rejected: ${reason}`,
      additionalData: { rejection_reason: reason },
      tags: ['admin', 'content', 'rejection'],
    });
  }

  /**
   * Log Feature Flag Changed
   */
  async logFeatureFlagChanged(
    organizationId: string,
    featureName: string,
    oldValue: boolean,
    newValue: boolean,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'feature_flag_changed',
      action: 'toggle_feature',
      resourceType: 'organization',
      resourceId: organizationId,
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.WARNING,
      status: Status.SUCCESS,
      description: `Feature flag '${featureName}' changed from ${oldValue} to ${newValue}`,
      oldValues: { [featureName]: oldValue },
      newValues: { [featureName]: newValue },
      changes: { [featureName]: { from: oldValue, to: newValue } },
      tags: ['admin', 'feature_flag', 'configuration'],
    });
  }

  /**
   * Log System Configuration Changed
   */
  async logSystemConfigChanged(
    configKey: string,
    oldValue: any,
    newValue: any,
    actorId: string,
    actorIp?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'system_config_changed',
      action: 'update_config',
      resourceType: 'system_config',
      actorId,
      actorType: ActorType.USER,
      actorIp,
      severity: Severity.WARNING,
      status: Status.SUCCESS,
      description: `System configuration '${configKey}' changed`,
      oldValues: { [configKey]: oldValue },
      newValues: { [configKey]: newValue },
      changes: { [configKey]: { from: oldValue, to: newValue } },
      tags: ['admin', 'system', 'configuration'],
    });
  }

  /**
   * Log Authentication Attempt
   */
  async logAuthenticationAttempt(
    email: string,
    success: boolean,
    actorIp?: string,
    errorMessage?: string,
  ): Promise<void> {
    await this.logEvent({
      eventType: 'authentication_attempt',
      action: 'login',
      resourceType: 'auth',
      actorType: ActorType.USER,
      actorIp,
      severity: success ? Severity.INFO : Severity.WARNING,
      status: success ? Status.SUCCESS : Status.FAILURE,
      description: success
        ? `Successful login: ${email}`
        : `Failed login attempt: ${email}`,
      additionalData: { email },
      errorMessage: errorMessage || undefined,
      tags: ['auth', 'login', success ? 'success' : 'failure'],
    });
  }

  /**
   * Calculate changes between old and new values
   */
  private calculateChanges(oldValues: any, newValues: any): any {
    const changes: any = {};

    Object.keys(newValues).forEach((key) => {
      if (oldValues[key] !== newValues[key]) {
        changes[key] = {
          from: oldValues[key],
          to: newValues[key],
        };
      }
    });

    return changes;
  }

  /**
   * Get Audit Logs
   *
   * Retrieves audit logs with filtering and pagination.
   */
  async getAuditLogs(filters: {
    tenantId?: string;
    eventType?: string;
    resourceType?: string;
    actorId?: string;
    severity?: Severity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

      if (filters.tenantId) {
        queryBuilder.andWhere('audit.tenantId = :tenantId', {
          tenantId: filters.tenantId,
        });
      }

      if (filters.eventType) {
        queryBuilder.andWhere('audit.eventType = :eventType', {
          eventType: filters.eventType,
        });
      }

      if (filters.resourceType) {
        queryBuilder.andWhere('audit.resourceType = :resourceType', {
          resourceType: filters.resourceType,
        });
      }

      if (filters.actorId) {
        queryBuilder.andWhere('audit.actorId = :actorId', {
          actorId: filters.actorId,
        });
      }

      if (filters.severity) {
        queryBuilder.andWhere('audit.severity = :severity', {
          severity: filters.severity,
        });
      }

      if (filters.startDate) {
        queryBuilder.andWhere('audit.createdAt >= :startDate', {
          startDate: filters.startDate,
        });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('audit.createdAt <= :endDate', {
          endDate: filters.endDate,
        });
      }

      queryBuilder.orderBy('audit.createdAt', 'DESC');

      const total = await queryBuilder.getCount();

      const limit = filters.limit || 100;
      const offset = filters.offset || 0;

      queryBuilder.take(limit).skip(offset);

      const logs = await queryBuilder.getMany();

      return { logs, total };
    } catch (error) {
      this.logger.error('Error fetching audit logs:', error);
      throw error;
    }
  }
}
