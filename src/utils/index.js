/**
 * Utility functions for formatting and calculations
 */

/**
 * Format numerical metric with precision
 */
export const formatMetric = (val, decimals = 2) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toFixed(decimals);
};

/**
 * Format percentage string
 */
export const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '—%';
  return `${Math.round(val * 100)}%`;
};
