import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn - Class Name Utility
 * Combines clsx and tailwind-merge for optimal Tailwind CSS class handling
 *
 * Features:
 * - Conditionally joins class names
 * - Merges Tailwind classes intelligently (removes conflicts)
 * - Supports all clsx input types (strings, objects, arrays)
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('base-class', { 'active-class': isActive, 'disabled-class': isDisabled })
 * // => 'base-class active-class' (if isActive is true)
 *
 * // Tailwind conflict resolution
 * cn('px-2 py-1', 'px-4')
 * // => 'py-1 px-4' (removes px-2, keeps px-4)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
