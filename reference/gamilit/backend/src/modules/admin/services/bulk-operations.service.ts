import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BulkOperation } from '../entities/bulk-operation.entity';
import { User } from '@modules/auth/entities/user.entity';
import { UserSuspension } from '@modules/auth/entities/user-suspension.entity';
import {
  BulkSuspendUsersDto,
  BulkActivateUsersDto,
  BulkUpdateRoleDto,
  BulkDeleteUsersDto,
  BulkOperationStatusDto,
} from '../dto/bulk-operations';
import { IBulkOperationResult } from '../interfaces/bulk-operation.interface';

/**
 * BulkOperationsService
 *
 * @description Servicio para manejar operaciones bulk (masivas) sobre usuarios
 * @related EXT-002 (Admin Extendido - Bulk Operations)
 *
 * IMPORTANTE:
 * - Procesa operaciones sobre múltiples usuarios de forma asíncrona
 * - Registra progreso en tabla admin_dashboard.bulk_operations
 * - Usa función SQL update_bulk_operation_progress() para tracking
 * - En v2: Integrar con BullMQ para procesamiento en background
 */
@Injectable()
export class BulkOperationsService {
  private readonly logger = new Logger(BulkOperationsService.name);

  constructor(
    @InjectRepository(BulkOperation, 'auth')
    private readonly bulkOpsRepo: Repository<BulkOperation>,
    @InjectRepository(User, 'auth')
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSuspension, 'auth')
    private readonly suspensionRepo: Repository<UserSuspension>,
    @InjectDataSource('auth')
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Suspende múltiples usuarios de forma masiva
   */
  async bulkSuspendUsers(
    dto: BulkSuspendUsersDto,
    adminId: string,
  ): Promise<BulkOperationStatusDto> {
    // Crear registro de operación bulk
    const operation = await this.createBulkOperation(
      'suspend_users',
      'users',
      dto.userIds,
      adminId,
    );

    // Procesar de forma asíncrona (sin bloquear la respuesta)
    this.processBulkSuspend(operation.id, dto, adminId).catch((error) => {
      this.logger.error(`Error processing bulk suspend: ${error.message}`, error.stack);
    });

    return this.mapToDto(operation);
  }

  /**
   * Activa múltiples usuarios de forma masiva
   */
  async bulkActivateUsers(
    dto: BulkActivateUsersDto,
    adminId: string,
  ): Promise<BulkOperationStatusDto> {
    const operation = await this.createBulkOperation(
      'activate_users',
      'users',
      dto.userIds,
      adminId,
    );

    this.processBulkActivate(operation.id, dto).catch((error) => {
      this.logger.error(`Error processing bulk activate: ${error.message}`, error.stack);
    });

    return this.mapToDto(operation);
  }

  /**
   * Actualiza roles de múltiples usuarios
   */
  async bulkUpdateRole(
    dto: BulkUpdateRoleDto,
    adminId: string,
  ): Promise<BulkOperationStatusDto> {
    const operation = await this.createBulkOperation(
      'update_role',
      'users',
      dto.userIds,
      adminId,
    );

    this.processBulkUpdateRole(operation.id, dto).catch((error) => {
      this.logger.error(`Error processing bulk update role: ${error.message}`, error.stack);
    });

    return this.mapToDto(operation);
  }

  /**
   * Elimina múltiples usuarios (soft delete por defecto)
   */
  async bulkDeleteUsers(
    dto: BulkDeleteUsersDto,
    adminId: string,
  ): Promise<BulkOperationStatusDto> {
    const operation = await this.createBulkOperation(
      'delete_users',
      'users',
      dto.userIds,
      adminId,
    );

    this.processBulkDelete(operation.id, dto).catch((error) => {
      this.logger.error(`Error processing bulk delete: ${error.message}`, error.stack);
    });

    return this.mapToDto(operation);
  }

  /**
   * Obtiene el estado de una operación bulk
   */
  async getBulkOperationStatus(operationId: string): Promise<BulkOperationStatusDto> {
    const operation = await this.bulkOpsRepo.findOne({
      where: { id: operationId },
    });

    if (!operation) {
      throw new NotFoundException(`Bulk operation ${operationId} not found`);
    }

    return this.mapToDto(operation);
  }

  /**
   * Lista operaciones bulk del sistema (últimas 100)
   */
  async listBulkOperations(limit: number = 100): Promise<BulkOperationStatusDto[]> {
    const operations = await this.bulkOpsRepo.find({
      order: { started_at: 'DESC' },
      take: limit,
    });

    return operations.map((op) => this.mapToDto(op));
  }

  // ========================================
  // PRIVATE METHODS - Procesamiento
  // ========================================

  /**
   * Crea el registro inicial de operación bulk
   */
  private async createBulkOperation(
    operationType: string,
    targetEntity: string,
    targetIds: string[],
    adminId: string,
  ): Promise<BulkOperation> {
    const operation = this.bulkOpsRepo.create({
      operation_type: operationType,
      target_entity: targetEntity,
      target_ids: targetIds,
      target_count: targetIds.length,
      started_by: adminId,
      status: 'pending',
    });

    return await this.bulkOpsRepo.save(operation);
  }

  /**
   * Procesa suspensión masiva de usuarios
   */
  private async processBulkSuspend(
    operationId: string,
    dto: BulkSuspendUsersDto,
    adminId: string,
  ): Promise<void> {
    await this.updateOperationStatus(operationId, 'running');

    const results: IBulkOperationResult[] = [];
    let completed = 0;
    let failed = 0;

    for (const userId of dto.userIds) {
      try {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
          results.push({ userId, success: false, error: 'User not found' });
          failed++;
          continue;
        }

        // Crear registro de suspensión
        const suspension = this.suspensionRepo.create({
          user_id: userId,
          reason: dto.reason,
          suspension_until: dto.durationDays
            ? new Date(Date.now() + dto.durationDays * 24 * 60 * 60 * 1000)
            : null,
          suspended_by: adminId,
        });
        await this.suspensionRepo.save(suspension);

        // Marcar usuario como suspendido (soft delete)
        user.deleted_at = new Date();
        await this.userRepo.save(user);

        results.push({ userId, success: true });
        completed++;
      } catch (error: any) {
        this.logger.error(`Error suspending user ${userId}: ${error.message}`);
        results.push({ userId, success: false, error: error.message });
        failed++;
      }

      // Actualizar progreso cada 10 usuarios
      if ((completed + failed) % 10 === 0) {
        await this.updateProgress(operationId, 10, 0);
      }
    }

    // Actualizar progreso final
    const remaining = (completed + failed) % 10;
    if (remaining > 0) {
      await this.updateProgress(operationId, remaining, 0);
    }

    // Guardar resultado final
    const operation = await this.bulkOpsRepo.findOne({ where: { id: operationId } });
    if (operation) {
      operation.error_details = results.filter((r) => !r.success);
      operation.result = {
        total: dto.userIds.length,
        completed,
        failed,
        summary: `Suspended ${completed} users, ${failed} failed`,
      };
      await this.bulkOpsRepo.save(operation);
    }
  }

  /**
   * Procesa activación masiva de usuarios
   */
  private async processBulkActivate(
    operationId: string,
    dto: BulkActivateUsersDto,
  ): Promise<void> {
    await this.updateOperationStatus(operationId, 'running');

    let completed = 0;
    let failed = 0;

    for (const userId of dto.userIds) {
      try {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
          failed++;
          continue;
        }

        // Reactivar usuario (quitar soft delete)
        user.deleted_at = undefined;
        await this.userRepo.save(user);

        // Eliminar suspensiones activas
        await this.suspensionRepo.delete({ user_id: userId });

        completed++;
      } catch (error: any) {
        this.logger.error(`Error activating user ${userId}: ${error.message}`);
        failed++;
      }

      if ((completed + failed) % 10 === 0) {
        await this.updateProgress(operationId, 10, 0);
      }
    }

    const remaining = (completed + failed) % 10;
    if (remaining > 0) {
      await this.updateProgress(operationId, remaining, 0);
    }
  }

  /**
   * Procesa actualización masiva de roles
   */
  private async processBulkUpdateRole(
    operationId: string,
    dto: BulkUpdateRoleDto,
  ): Promise<void> {
    await this.updateOperationStatus(operationId, 'running');

    let completed = 0;
    let failed = 0;

    for (const userId of dto.userIds) {
      try {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (user) {
          user.role = dto.newRole as any; // Cast to any para evitar error de tipos
          await this.userRepo.save(user);
          completed++;
        } else {
          failed++;
        }
      } catch (error: any) {
        this.logger.error(`Error updating role for user ${userId}: ${error.message}`);
        failed++;
      }

      if ((completed + failed) % 10 === 0) {
        await this.updateProgress(operationId, 10, 0);
      }
    }

    const remaining = (completed + failed) % 10;
    if (remaining > 0) {
      await this.updateProgress(operationId, remaining, 0);
    }
  }

  /**
   * Procesa eliminación masiva de usuarios
   */
  private async processBulkDelete(
    operationId: string,
    dto: BulkDeleteUsersDto,
  ): Promise<void> {
    await this.updateOperationStatus(operationId, 'running');

    let completed = 0;
    let failed = 0;

    for (const userId of dto.userIds) {
      try {
        if (dto.hardDelete) {
          // Hard delete (eliminar permanentemente)
          await this.userRepo.delete(userId);
        } else {
          // Soft delete (marcar como eliminado)
          const user = await this.userRepo.findOne({ where: { id: userId } });
          if (user) {
            user.deleted_at = new Date();
            await this.userRepo.save(user);
          }
        }
        completed++;
      } catch (error: any) {
        this.logger.error(`Error deleting user ${userId}: ${error.message}`);
        failed++;
      }

      if ((completed + failed) % 10 === 0) {
        await this.updateProgress(operationId, 10, 0);
      }
    }

    const remaining = (completed + failed) % 10;
    if (remaining > 0) {
      await this.updateProgress(operationId, remaining, 0);
    }
  }

  /**
   * Actualiza el progreso de una operación usando la función SQL
   */
  private async updateProgress(
    operationId: string,
    completedIncrement: number,
    failedIncrement: number = 0,
  ): Promise<void> {
    await this.dataSource.query(
      `SELECT admin_dashboard.update_bulk_operation_progress($1, $2, $3)`,
      [operationId, completedIncrement, failedIncrement],
    );
  }

  /**
   * Actualiza el estado de una operación
   */
  private async updateOperationStatus(
    operationId: string,
    status: 'pending' | 'running' | 'completed' | 'failed',
  ): Promise<void> {
    await this.bulkOpsRepo.update(operationId, { status });
  }

  /**
   * Mapea entity a DTO de respuesta
   */
  private mapToDto(operation: BulkOperation): BulkOperationStatusDto {
    return {
      id: operation.id,
      operationType: operation.operation_type,
      targetEntity: operation.target_entity,
      status: operation.status,
      targetCount: operation.target_count,
      completedCount: operation.completed_count,
      failedCount: operation.failed_count,
      startedAt: operation.started_at,
      completedAt: operation.completed_at,
      errorDetails: operation.error_details,
      result: operation.result,
      startedBy: operation.started_by,
    };
  }
}
