import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@shared/utils';

// Maya rank system based on actual GAMILIT platform
export type RankType =
  | 'detective_novato' // Detective Novato
  | 'sargento' // Sargento
  | 'teniente' // Teniente
  | 'capitan' // Capitán
  | 'comisario' // Comisario/Maestro
  | 'al_mehen' // New Maya ranks
  | 'chilan'
  | 'batab'
  | 'halach_uinik'
  | 'kukulkan';

export interface RankBadgeProps {
  rank: RankType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

// Rank gradient classes (some use detective-theme.css, some use Tailwind)
const rankStyles: Record<RankType, string> = {
  // Detective rank system (uses detective-theme.css)
  detective_novato: 'rank-badge-detective',
  sargento: 'rank-badge-sargento',
  teniente: 'rank-badge-teniente',
  capitan: 'rank-badge-capitan',
  comisario: 'rank-badge-comisario',

  // Maya rank system (Tailwind gradients)
  al_mehen: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg',
  chilan: 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg',
  batab: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg',
  halach_uinik: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg',
  kukulkan: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white shadow-lg',
};

const rankLabels: Record<RankType, string> = {
  detective_novato: 'Detective Novato',
  sargento: 'Sargento',
  teniente: 'Teniente',
  capitan: 'Capitán',
  comisario: 'Comisario',
  al_mehen: 'AL MEHEN',
  chilan: 'CHILAN',
  batab: 'Ajaw',
  halach_uinik: 'HALACH UINIK',
  kukulkan: 'K\'UK\'ULKAN',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const RankBadge = React.forwardRef<HTMLSpanElement, RankBadgeProps>(
  ({ rank, showIcon = true, size = 'md', className, animated = false }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-semibold rounded-full',
          rankStyles[rank],
          sizeStyles[size],
          animated && 'badge-pulse', // Uses detective-theme.css animation
          className
        )}
        role="status"
        aria-label={`Rango: ${rankLabels[rank]}`}
      >
        {showIcon && <Crown className={iconSizes[size]} aria-hidden="true" />}
        {rankLabels[rank]}
      </span>
    );
  }
);

RankBadge.displayName = 'RankBadge';
