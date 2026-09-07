import React from 'react';
import Card from './Card';
import Badge from './Badge';

/**
 * MetricCard component for laboratory dashboards and experiment outputs.
 */
export const MetricCard = ({
  label,
  value = '—',
  description,
  trend,
  status = 'default',
  icon: Icon,
  className = '',
}) => {
  return (
    <Card variant="metric" className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-lab-text-secondary uppercase tracking-wider">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-lab-text-muted" />}
      </div>

      <div className="flex items-baseline gap-3 my-1">
        <span className="text-2xl sm:text-3xl font-mono font-bold text-lab-text-primary">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-mono text-lab-text-muted">
            {trend}
          </span>
        )}
      </div>

      {(description || status !== 'default') && (
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-lab-border/50 text-xs text-lab-text-muted">
          {description && <span className="truncate">{description}</span>}
          {status !== 'default' && (
            <Badge size="sm" variant={status}>
              {status}
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};

export default MetricCard;
