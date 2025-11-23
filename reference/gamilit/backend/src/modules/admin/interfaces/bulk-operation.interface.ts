/**
 * Bulk Operations Interfaces
 * Relacionado: EXT-002 (Admin Extendido - Bulk Operations)
 */

/**
 * Interface para operación bulk
 */
export interface IBulkOperation {
  id: string;
  operationType: string;
  targetEntity: string;
  targetIds: string[];
  targetCount: number;
  completedCount: number;
  failedCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedBy: string;
  startedAt: Date;
  completedAt?: Date;
  errorDetails?: any[];
  result?: any;
}

/**
 * Interface para job de BullMQ
 */
export interface IBulkOperationJob {
  operationId: string;
  operationType: 'suspend_users' | 'activate_users' | 'update_role' | 'delete_users';
  targetIds: string[];
  payload: any;
  adminId: string;
}

/**
 * Result individual de procesamiento
 */
export interface IBulkOperationResult {
  userId: string;
  success: boolean;
  error?: string;
}
