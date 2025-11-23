// Admin Dashboard Types

// System Health & Monitoring
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  cpu: number;
  memory: number;
  uptime: number;
  activeUsers: number;
  requestsPerMin: number;
  errorRate: number;
  database: 'healthy' | 'degraded' | 'down';
  apiUptime: number;
  lastCheck: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  userCount: number;
  createdAt: string;
  features: string[];
  subscription?: {
    startDate: string;
    endDate: string;
    autoRenew: boolean;
  };
}

export interface OrganizationUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface PendingExercise {
  id: string;
  title: string;
  type: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  status: 'pending';
}

export interface MediaItem {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
  name?: string; // Alias for filename
  mimeType?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  changes: string;
  createdBy: string;
  createdAt: string;
}

export interface SystemUser {
  id: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin_teacher' | 'student';
  department?: string;
  status: 'active' | 'inactive';
  organizationId?: string;
  organizationName?: string;
  lastLogin: string;
  createdAt: string;
  // Alias for full_name (for backward compatibility)
  display_name?: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface SystemSettings {
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
}

export interface SystemStats {
  totalUsers: number;
  totalOrganizations: number;
  totalExercises: number;
  activeUsers: number;
  storageUsed: number;
  apiCalls24h: number;
}

// Dashboard-specific Types
export interface SystemMetrics {
  totalUsers: number;
  userGrowth: number; // percentage
  totalOrganizations: number;
  organizationGrowth: number;
  activeSessions: number;
  flaggedContentCount: number;
  systemUptime: number; // seconds
  storageUsed: number; // GB
  storageTotal: number; // GB
  avgResponseTime: number; // ms
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'suspend' | 'restore';
  targetType: string;
  targetId: string;
  targetName?: string;
  success: boolean;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'security';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  details: string;
  timestamp: Date;
  dismissed: boolean;
  dismissedBy?: string;
  dismissedAt?: Date;
  source: string;
  affectedResources?: string[];
  actionRequired?: boolean;
}

export interface UserActivityData {
  date: string;
  activeUsers: number;
  newRegistrations: number;
  totalSessions: number;
  avgSessionDuration: number;
}

export interface UserManagementFilters {
  search?: string;
  role?: string[];
  status?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  organizationId?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LogFilter {
  level?: ('info' | 'warning' | 'error' | 'critical')[];
  source?: string[];
  timeFrom?: Date;
  timeTo?: Date;
  search?: string;
}

export interface DashboardStats {
  systemHealth: SystemHealth;
  metrics: SystemMetrics;
  recentActions: AdminAction[];
  alerts: SystemAlert[];
  userActivity: UserActivityData[];
}

export interface BulkActionResult {
  successful: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}
