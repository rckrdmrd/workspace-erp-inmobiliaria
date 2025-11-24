import React from 'react';
import { cn } from '@shared/utils';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

export type StatusType = 'active' | 'inactive' | 'suspended' | 'pending' | 'completed' | 'in_progress';

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string; // Custom label override
}

const statusConfig: Record<
  StatusType,
  {
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
    defaultLabel: string;
  }
> = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: CheckCircle2,
    defaultLabel: 'Activo',
  },
  inactive: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: XCircle,
    defaultLabel: 'Inactivo',
  },
  suspended: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: AlertCircle,
    defaultLabel: 'Suspendido',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: Clock,
    defaultLabel: 'Pendiente',
  },
  completed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: CheckCircle2,
    defaultLabel: 'Completado',
  },
  in_progress: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: Clock,
    defaultLabel: 'En Progreso',
  },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, className, showIcon = true, size = 'md', label }, ref) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    const displayLabel = label || config.defaultLabel;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium border',
          config.bg,
          config.text,
          config.border,
          sizeStyles[size],
          className
        )}
        role="status"
        aria-label={`Estado: ${displayLabel}`}
      >
        {showIcon && <Icon className={iconSizes[size]} aria-hidden="true" />}
        <span>{displayLabel}</span>
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
