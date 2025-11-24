import React, { useState } from 'react';
import { cn } from '@shared/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', className }) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  };

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getColorFromName = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const showFallback = !src || imageError;

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center overflow-hidden',
      sizeStyles[size],
      showFallback && getColorFromName(name),
      className
    )}>
      {showFallback ? (
        <span className="font-semibold text-white">
          {getInitials(name)}
        </span>
      ) : (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};
