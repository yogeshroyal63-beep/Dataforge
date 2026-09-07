import React from 'react';

/**
 * ProgressBar component for sequence capacity and experiment progress.
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  status = 'default',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const statusColors = {
    default: 'bg-lab-accent',
    success: 'bg-lab-success',
    warning: 'bg-lab-warning',
    danger: 'bg-lab-danger',
    purple: 'bg-lab-purple',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
          {label && <span className="text-lab-text-secondary">{label}</span>}
          {showPercentage && <span className="text-lab-text-primary font-medium">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-lab-secondary rounded-full overflow-hidden border border-lab-border/60 ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={`h-full transition-all duration-300 rounded-full ${statusColors[status] || statusColors.default}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
