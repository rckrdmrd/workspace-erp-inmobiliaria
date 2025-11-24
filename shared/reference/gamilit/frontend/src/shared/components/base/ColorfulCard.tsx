/**
 * ColorfulCard Component
 *
 * Card component with automatic vibrant colors based on ID or index.
 * Makes cards visually appealing with minimal code changes.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils';

export interface ColorfulCardProps {
  children: React.ReactNode;
  id?: string;
  index?: number;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  animationDelay?: number;
  useGradientBorder?: boolean;
  useGradientBackground?: boolean;
}

// Built-in color schemes (simplified version without external utility)
const colorSchemes = [
  {
    name: 'ocean',
    border: 'border-blue-400',
    shadow: 'shadow-blue-200',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    name: 'sunset',
    border: 'border-orange-400',
    shadow: 'shadow-orange-200',
    gradient: 'from-orange-400 to-pink-500',
  },
  {
    name: 'forest',
    border: 'border-green-400',
    shadow: 'shadow-green-200',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    name: 'twilight',
    border: 'border-purple-400',
    shadow: 'shadow-purple-200',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    name: 'fire',
    border: 'border-red-400',
    shadow: 'shadow-red-200',
    gradient: 'from-red-400 to-orange-500',
  },
  {
    name: 'sky',
    border: 'border-sky-400',
    shadow: 'shadow-sky-200',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    name: 'tropical',
    border: 'border-teal-400',
    shadow: 'shadow-teal-200',
    gradient: 'from-teal-400 to-green-500',
  },
  {
    name: 'neon',
    border: 'border-fuchsia-400',
    shadow: 'shadow-fuchsia-200',
    gradient: 'from-fuchsia-400 to-purple-500',
  },
];

function getColorSchemeByIndex(index: number) {
  return colorSchemes[index % colorSchemes.length];
}

function getColorSchemeById(id: string) {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash = hash & hash;
  }
  return colorSchemes[Math.abs(hash) % colorSchemes.length];
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

export const ColorfulCard = React.forwardRef<HTMLDivElement, ColorfulCardProps>(
  (
    {
      children,
      id,
      index,
      hover = true,
      padding = 'md',
      className,
      onClick,
      animate = true,
      animationDelay = 0,
      useGradientBorder = true,
      useGradientBackground = true,
    },
    ref
  ) => {
    const colorScheme = useMemo(() => {
      if (id) return getColorSchemeById(id);
      if (index !== undefined) return getColorSchemeByIndex(index);
      return getColorSchemeByIndex(0);
    }, [id, index]);

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          'relative bg-white rounded-xl shadow-md overflow-hidden',
          'border-2 transition-all duration-300',
          useGradientBorder ? colorScheme.border : 'border-gray-200',
          useGradientBorder ? colorScheme.shadow : '',
          paddingStyles[padding],
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {useGradientBackground && (
          <div
            className={cn(
              'absolute inset-0 opacity-5',
              'bg-gradient-to-br',
              colorScheme.gradient
            )}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );

    if (!animate) {
      return cardContent;
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={hover ? { y: -5, scale: 1.02 } : {}}
        transition={{
          duration: 0.4,
          delay: animationDelay,
          ease: 'easeOut',
        }}
      >
        {cardContent}
      </motion.div>
    );
  }
);

ColorfulCard.displayName = 'ColorfulCard';

/**
 * ColorfulIconCard - Card with a prominent colored icon
 */
export interface ColorfulIconCardProps extends ColorfulCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconSize?: 'sm' | 'md' | 'lg';
}

const iconSizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const iconContainerSizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
};

export const ColorfulIconCard = React.forwardRef<HTMLDivElement, ColorfulIconCardProps>(
  ({ icon: Icon, iconSize = 'md', children, ...props }, ref) => {
    const colorScheme = useMemo(() => {
      if (props.id) return getColorSchemeById(props.id);
      if (props.index !== undefined) return getColorSchemeByIndex(props.index);
      return getColorSchemeByIndex(0);
    }, [props.id, props.index]);

    return (
      <ColorfulCard ref={ref} {...props}>
        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              iconContainerSizes[iconSize],
              'rounded-xl flex items-center justify-center',
              'bg-gradient-to-br shadow-md flex-shrink-0',
              colorScheme.gradient
            )}
          >
            <Icon className={cn(iconSizes[iconSize], 'text-white')} />
          </div>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </ColorfulCard>
    );
  }
);

ColorfulIconCard.displayName = 'ColorfulIconCard';
