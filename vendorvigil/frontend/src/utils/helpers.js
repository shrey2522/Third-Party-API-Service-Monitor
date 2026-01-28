import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status color based on HTTP status code
 */
export function getStatusColor(statusCode) {
  if (statusCode >= 200 && statusCode < 300) return 'success';
  if (statusCode >= 300 && statusCode < 400) return 'warning';
  if (statusCode >= 400 && statusCode < 500) return 'error';
  if (statusCode >= 500) return 'critical';
  return 'unknown';
}

/**
 * Calculate uptime percentage
 */
export function calculateUptime(successCount, totalCount) {
  if (totalCount === 0) return 0;
  return ((successCount / totalCount) * 100).toFixed(2);
}
