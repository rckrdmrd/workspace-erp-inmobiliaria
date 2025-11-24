/**
 * CN Utility
 *
 * Combines clsx and tailwind-merge for optimal className merging.
 * Ensures Tailwind classes don't conflict.
 *
 * @example
 * ```tsx
 * <div className={cn('p-4 text-red-500', isActive && 'bg-blue-500', className)} />
 * ```
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
