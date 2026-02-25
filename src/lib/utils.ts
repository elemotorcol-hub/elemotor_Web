import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes conditionally.
 * Usage: cn('px-4', condition && 'text-white', 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a localized string (Colombia locale by default).
 */
export function formatDate(
  date: Date | string,
  locale: string = 'es-CO'
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
