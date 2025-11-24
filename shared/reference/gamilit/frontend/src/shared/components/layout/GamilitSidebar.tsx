/**
 * GamilitSidebar Component
 *
 * Detective-themed sidebar with role-based navigation and gamification features.
 *
 * Features:
 * - Role-based navigation (student, teacher, admin)
 * - Module progress tracking for students
 * - Locked/unlocked module states
 * - Mobile responsive with overlay
 * - Smooth Framer Motion animations
 * - Progress tracking and visualization
 *
 * @component
 * @example
 * ```tsx
 * <GamilitSidebar
 *   isOpen={true}
 *   userRole="student"
 *   currentPath="/dashboard"
 *   moduleProgress={modules}
 *   onNavigate={(path) => navigate(path)}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Trophy,
  User,
  Settings,
  HelpCircle,
  ShoppingBag,
  BarChart3,
  Lock,
  CheckCircle2,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  MessageSquare,
  Share2,
  Building2,
  ShieldCheck,
  CheckCircle,
  Activity,
  Wrench,
} from 'lucide-react';
import { cn } from '@shared/utils';

/**
 * Navigation item for the sidebar
 */
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

/**
 * Module progress data for sidebar
 */
export interface SidebarModuleProgress {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

/**
 * GamilitSidebar component props
 */
export interface GamilitSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  currentPath?: string;
  moduleProgress?: SidebarModuleProgress[];
  onNavigate?: (path: string) => void;
  className?: string;
  userRole?: 'student' | 'teacher' | 'admin';
}

/**
 * Default module data for students
 */
const defaultModules: SidebarModuleProgress[] = [
  {
    id: 'module-1',
    title: 'Comprensión Literal',
    subtitle: 'Marie Curie',
    icon: BookOpen,
    progress: 75,
    isUnlocked: true,
    isCompleted: false,
  },
  {
    id: 'module-2',
    title: 'Comprensión Inferencial',
    subtitle: 'Leonardo da Vinci',
    icon: BookOpen,
    progress: 45,
    isUnlocked: true,
    isCompleted: false,
  },
  {
    id: 'module-3',
    title: 'Comprensión Crítica',
    subtitle: 'Frida Kahlo',
    icon: BookOpen,
    progress: 0,
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: 'module-4',
    title: 'Análisis Literario',
    subtitle: 'William Shakespeare',
    icon: BookOpen,
    progress: 0,
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: 'module-5',
    title: 'Síntesis y Evaluación',
    subtitle: 'Maya Angelou',
    icon: BookOpen,
    progress: 0,
    isUnlocked: false,
    isCompleted: false,
  },
];

/**
 * Get navigation items based on user role
 */
const getNavigationItems = (
  userRole: 'student' | 'teacher' | 'admin' = 'student'
): NavigationItem[] => {
  const baseItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path:
        userRole === 'teacher'
          ? '/teacher/dashboard'
          : userRole === 'admin'
            ? '/admin/dashboard'
            : '/dashboard',
      icon: 'Home',
    },
  ];

  const studentItems = [
    {
      id: 'badges',
      label: 'Insignias',
      path: '/badges',
      icon: 'Trophy',
    },
    {
      id: 'store',
      label: 'Tienda',
      path: '/store',
      icon: 'ShoppingBag',
    },
    {
      id: 'profile',
      label: 'Perfil',
      path: '/profile',
      icon: 'User',
    },
    {
      id: 'stats',
      label: 'Estadísticas',
      path: '/stats',
      icon: 'BarChart3',
    },
  ];

  const teacherItems = [
    {
      id: 'monitoring',
      label: 'Monitoreo',
      path: '/teacher/monitoring',
      icon: 'User',
    },
    {
      id: 'assignments',
      label: 'Asignaciones',
      path: '/teacher/assignments',
      icon: 'Calendar',
    },
    {
      id: 'progress',
      label: 'Progreso',
      path: '/teacher/progress',
      icon: 'TrendingUp',
    },
    {
      id: 'alerts',
      label: 'Alertas',
      path: '/teacher/alerts',
      icon: 'AlertTriangle',
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      path: '/teacher/analytics',
      icon: 'BarChart3',
    },
    {
      id: 'reports',
      label: 'Reportes',
      path: '/teacher/reports',
      icon: 'FileText',
    },
    {
      id: 'communication',
      label: 'Comunicación',
      path: '/teacher/communication',
      icon: 'MessageSquare',
    },
    {
      id: 'content',
      label: 'Contenido',
      path: '/teacher/content',
      icon: 'BookOpen',
    },
    {
      id: 'gamification',
      label: 'Gamificación',
      path: '/teacher/gamification',
      icon: 'Trophy',
    },
    {
      id: 'resources',
      label: 'Recursos',
      path: '/teacher/resources',
      icon: 'Share2',
    },
  ];

  const adminItems = [
    {
      id: 'institutions',
      label: 'Instituciones',
      path: '/admin/institutions',
      icon: 'Building2',
    },
    {
      id: 'users',
      label: 'Usuarios',
      path: '/admin/users',
      icon: 'Users',
    },
    {
      id: 'roles',
      label: 'Roles y Permisos',
      path: '/admin/roles',
      icon: 'ShieldCheck',
    },
    {
      id: 'content',
      label: 'Contenido',
      path: '/admin/content',
      icon: 'BookOpen',
    },
    {
      id: 'approvals',
      label: 'Aprobaciones',
      path: '/admin/approvals',
      icon: 'CheckCircle',
    },
    {
      id: 'gamification',
      label: 'Gamificación',
      path: '/admin/gamification',
      icon: 'Trophy',
    },
    {
      id: 'monitoring',
      label: 'Monitoreo',
      path: '/admin/monitoring',
      icon: 'Activity',
    },
    {
      id: 'advanced',
      label: 'Herramientas',
      path: '/admin/advanced',
      icon: 'Wrench',
    },
    {
      id: 'reports',
      label: 'Reportes',
      path: '/admin/reports',
      icon: 'FileText',
    },
    {
      id: 'settings',
      label: 'Configuración',
      path: '/admin/settings',
      icon: 'Settings',
    },
  ];

  const roleSpecificItems = {
    student: studentItems,
    teacher: teacherItems,
    admin: adminItems,
  };

  return [...baseItems, ...roleSpecificItems[userRole]];
};

/**
 * Icon mapping for navigation items
 */
const IconMap = {
  Home,
  BookOpen,
  Trophy,
  User,
  Settings,
  HelpCircle,
  ShoppingBag,
  BarChart3,
  Lock,
  CheckCircle2,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  MessageSquare,
  Share2,
  Building2,
  ShieldCheck,
  CheckCircle,
  Activity,
  Wrench,
};

/**
 * Badge component for module completion status
 */
const Badge: React.FC<{
  variant?: 'success' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}> = ({ variant = 'default', size = 'md', children }) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-700 border-green-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {children}
    </span>
  );
};

/**
 * Progress bar component with animation
 */
const ProgressBar: React.FC<{
  value: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'detective' | 'success';
  showPercentage?: boolean;
}> = ({ value, size = 'md', variant = 'detective', showPercentage = true }) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    detective: 'bg-gradient-to-r from-orange-500 to-orange-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
  };

  return (
    <div className="w-full">
      <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

/**
 * GamilitSidebar - Detective-themed sidebar with gamification
 *
 * Sidebar component with role-based navigation, module progress tracking,
 * and detective theme styling. Features smooth animations and responsive
 * mobile overlay.
 */
export const GamilitSidebar: React.FC<GamilitSidebarProps> = ({
  isOpen,
  onClose,
  currentPath = '/dashboard',
  moduleProgress = defaultModules,
  onNavigate,
  className,
  userRole = 'student',
}) => {
  const navigationItems = getNavigationItems(userRole);

  /**
   * Handle navigation item click
   */
  const handleNavClick = (path: string) => {
    onNavigate?.(path);
    onClose?.();
  };

  /**
   * Handle module click
   */
  const handleModuleClick = (moduleId: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      onNavigate?.(`/modules/${moduleId}`);
      onClose?.();
    }
  };

  /**
   * Calculate total progress for student role
   */
  const totalProgress =
    userRole === 'student'
      ? Math.round(
          moduleProgress.reduce((acc, module) => acc + module.progress, 0) /
            moduleProgress.length
        )
      : 0;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 bg-white border-r border-gray-200',
          'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src="/logo_gamilit.png"
                alt="Gamilit"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Gamilit
                </h2>
                <p className="text-xs text-gray-500">Detectives de la Lectura</p>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent =
                  IconMap[item.icon as keyof typeof IconMap] || Home;
                const isActive = currentPath === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left',
                      'transition-all duration-200 group',
                      isActive
                        ? 'bg-orange-100 text-orange-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <IconComponent
                      className={cn(
                        'h-5 w-5 transition-colors duration-200',
                        isActive
                          ? 'text-orange-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Modules Section - Only for students */}
          {userRole === 'student' && (
            <div className="flex-1 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Casos de Detective
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Resuelve casos para mejorar tu comprensión lectora
                </p>
              </div>

              <div className="space-y-3">
                {moduleProgress.map((module, index) => {
                  const IconComponent = module.icon;
                  const isCompleted = module.progress === 100;

                  return (
                    <motion.button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id, module.isUnlocked)}
                      className={cn(
                        'w-full p-4 rounded-xl border text-left transition-all duration-200',
                        module.isUnlocked
                          ? 'border-gray-200 bg-white hover:shadow-md hover:border-orange-200 cursor-pointer'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
                        isCompleted && 'border-green-200 bg-green-50'
                      )}
                      whileHover={module.isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={module.isUnlocked ? { scale: 0.98 } : {}}
                      disabled={!module.isUnlocked}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg',
                              module.isUnlocked
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-400',
                              isCompleted && 'bg-green-100 text-green-600'
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : module.isUnlocked ? (
                              <IconComponent className="h-5 w-5" />
                            ) : (
                              <Lock className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4
                              className={cn(
                                'font-medium text-sm',
                                module.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                              )}
                            >
                              {module.title}
                            </h4>
                            <p
                              className={cn(
                                'text-xs',
                                module.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                              )}
                            >
                              {module.subtitle}
                            </p>
                          </div>
                        </div>

                        {isCompleted && (
                          <Badge variant="success">
                            Completado
                          </Badge>
                        )}
                      </div>

                      {/* Progress bar */}
                      {module.isUnlocked && (
                        <div className="space-y-2">
                          <ProgressBar
                            value={module.progress}

                            variant={isCompleted ? 'success' : 'detective'}
                            showPercentage={false}
                          />
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Progreso</span>
                            <span
                              className={cn(
                                'font-medium',
                                isCompleted ? 'text-green-600' : 'text-orange-600'
                              )}
                            >
                              {module.progress}%
                            </span>
                          </div>
                        </div>
                      )}

                      {!module.isUnlocked && (
                        <div className="text-xs text-gray-400 mt-2">
                          Completa el caso anterior para desbloquear
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Total Progress Footer - Only for students */}
          {userRole === 'student' && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Progreso Total
                </span>
                <span className="text-sm font-medium text-orange-600">
                  {totalProgress}%
                </span>
              </div>
              <ProgressBar
                value={totalProgress}

                variant="detective"
                showPercentage={false}
              />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default GamilitSidebar;
