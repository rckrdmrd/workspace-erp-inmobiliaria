/**
 * Admin API DTOs and Types
 * Generated for FE-051
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================================================
// ORGANIZATIONS (INSTITUTIONS)
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'university' | 'corporate' | 'individual';
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  users: number;
  status: 'active' | 'suspended' | 'inactive';
  features: string[];
  subscription?: {
    tier: string;
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
  };
  contact?: {
    email: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFilters extends PaginationParams {
  type?: 'school' | 'university' | 'corporate' | 'individual';
  tier?: 'free' | 'basic' | 'premium' | 'enterprise';
  status?: 'active' | 'suspended' | 'inactive';
  search?: string;
}

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

// ============================================================================
// CONTENT & APPROVALS
// ============================================================================

export interface PendingContent {
  id: string;
  type: 'exercise' | 'media' | 'module' | 'assignment';
  title: string;
  author: string;
  authorId: string;
  authorEmail: string;
  module?: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
}

export interface ContentFilters extends PaginationParams {
  type?: 'exercise' | 'media' | 'module' | 'assignment';
  status?: 'pending' | 'approved' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
}

export interface MediaFile {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  uploaderId: string;
  uploaderName: string;
  uploadedAt: string;
}

export interface ApprovalHistory {
  id: string;
  contentId: string;
  contentType: string;
  action: 'approved' | 'rejected';
  reason?: string;
  approvedBy: string;
  approvedByName: string;
  approvedAt: string;
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface DashboardStats {
  users: {
    total: number;
    activeToday: number;
    newThisWeek: number;
    growth: number; // percentage
  };
  content: {
    exercises: number;
    modules: number;
    avgCompletion: number; // percentage
  };
  organizations: {
    total: number;
    active: number;
    suspended: number;
  };
}

export interface DashboardActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface MonthlyGrowth {
  month: string;
  users: number;
  organizations: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  growthData: MonthlyGrowth[];
}

// ============================================================================
// USERS
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin_teacher' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  organization?: string;
  organizationId?: string;
  joinDate: string;
  lastLogin?: string;
  metadata?: any;
}

export interface UserFilters extends PaginationParams {
  role?: 'student' | 'admin_teacher' | 'super_admin';
  status?: 'active' | 'inactive' | 'suspended';
  organizationId?: string;
  search?: string;
}

export interface UserDetails extends User {
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
  };
  stats?: {
    exercisesCompleted: number;
    modulesCompleted: number;
    mlCoins: number;
    rank: string;
  };
}

// ============================================================================
// ROLES & PERMISSIONS
// ============================================================================

export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  userCount: number;
  isSystem: boolean; // cannot be deleted
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  module: 'users' | 'content' | 'gamification' | 'monitoring' | 'system';
  action: 'view' | 'create' | 'edit' | 'delete';
  granted: boolean;
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

export interface AvailablePermission {
  module: string;
  action: string;
  description: string;
}

// ============================================================================
// GAMIFICATION
// ============================================================================

export interface MayaRank {
  id: string;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon?: string;
  userCount?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  xpReward: number;
  mlCoinsReward: number;
  userCount?: number;
  isActive: boolean;
}

export interface EconomyConfig {
  mlCoinsPerExercise: number;
  mlCoinsPerAchievement: number;
  mlCoinsPerModule: number;
  shopEnabled: boolean;
  powerUpsEnabled: boolean;
}

export interface GamificationStats {
  totalXPEarned: number;
  totalAchievementsUnlocked: number;
  averageRank: string;
  mostActiveDay: string;
  totalMLCoinsCirculation: number;
  averageMLCoinsPerUser: number;
  dailyTransactions: number;
}

export interface GamificationSettings {
  ranks: MayaRank[];
  achievements: Achievement[];
  economy: EconomyConfig;
  stats: GamificationStats;
}

// ============================================================================
// MONITORING
// ============================================================================

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  services: {
    database: {
      status: 'up' | 'down';
      responseTime: number;
    };
    redis?: {
      status: 'up' | 'down';
      responseTime: number;
    };
    storage: {
      status: 'up' | 'down';
      responseTime: number;
    };
  };
  metrics: {
    cpu: number; // percentage
    memory: number; // percentage
    disk: number; // percentage
  };
  timestamp: string;
}

export interface SystemMetrics {
  requests: {
    total: number;
    avgResponseTime: number;
  };
  errors: {
    count: number;
    rate: number; // percentage
  };
  activeUsers: number;
  timestamp: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  context?: any;
  stackTrace?: string;
}

export interface LogFilters extends PaginationParams {
  level?: 'error' | 'warn' | 'info' | 'debug';
  date?: string;
  search?: string;
}

export interface MaintenanceMode {
  enabled: boolean;
  message?: string;
  startedAt?: string;
  startedBy?: string;
}

// ============================================================================
// SETTINGS
// ============================================================================

export type SettingsCategory =
  | 'general'
  | 'email'
  | 'notifications'
  | 'security'
  | 'maintenance'
  | 'analytics'
  | 'integrations';

export interface GeneralSettings {
  platformName: string;
  platformUrl: string;
  platformLogo?: string;
  defaultLanguage: 'es' | 'en' | 'fr';
  timezone: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string; // never returned from API
  smtpFrom: string;
  smtpFromName: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
}

export interface SecuritySettings {
  sessionDuration: number; // hours
  require2FA: boolean;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireUppercase: boolean;
  loginAttempts: number;
  lockoutDuration: number; // minutes
}

export interface MaintenanceSettings {
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup?: string;
  cacheEnabled: boolean;
  cacheTTL: number; // seconds
}

export interface SystemConfig {
  general?: GeneralSettings;
  email?: EmailSettings;
  notifications?: NotificationSettings;
  security?: SecuritySettings;
  maintenance?: MaintenanceSettings;
  [key: string]: any;
}

// ============================================================================
// REPORTS
// ============================================================================

export type ReportType =
  | 'users'
  | 'progress'
  | 'exercises'
  | 'gamification'
  | 'usage'
  | 'completion'
  | 'financial';

export type ReportFormat = 'pdf' | 'csv' | 'excel' | 'json';

export interface ReportFilters {
  startDate: string;
  endDate: string;
  organizationId?: string;
  moduleId?: string;
  [key: string]: any;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun?: string;
}

export interface Report {
  id: string;
  type: ReportType;
  name: string;
  format: ReportFormat;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  generatedAt?: string;
  generatedBy: string;
  parameters: ReportFilters;
  schedule?: ReportSchedule;
  error?: string;
}

export interface GenerateReportParams {
  reportType: ReportType;
  format: ReportFormat;
  filters: ReportFilters;
  schedule?: ReportSchedule;
}

export interface ReportListFilters extends PaginationParams {
  status?: 'queued' | 'processing' | 'completed' | 'failed';
  type?: ReportType;
}
