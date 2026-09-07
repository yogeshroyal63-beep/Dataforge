import React from 'react';

/**
 * MemoryCell — A single cell in the memory visualization.
 *
 * States:
 *   idle         - neutral, inactive
 *   active       - currently being written (accent highlight)
 *   selected     - selected / queried (stronger glow)
 *   interference - corrupted/overwritten (danger color)
 */
export const MemoryCell = ({
  itemKey = 'KEY',
  value = null,
  state = 'idle', // 'idle' | 'active' | 'selected' | 'interference'
  index,
  showIndex = true,
  compact = false,
  className = '',
}) => {
  const stateStyles = {
    idle: 'bg-lab-surface border-lab-border text-lab-text-secondary',
    active: 'bg-lab-accent/15 border-lab-accent text-lab-accent shadow-sm',
    selected: 'bg-lab-accent/25 border-lab-accent ring-1 ring-lab-accent/50 text-lab-accent shadow-lab-glow',
    interference: 'bg-lab-danger/15 border-lab-danger text-lab-danger animate-pulse',
  };

  const displayValue = value !== null && value !== undefined ? value : '—';

  return (
    <div
      role="listitem"
      aria-label={`Fact ${itemKey} with value ${displayValue}, state: ${state}`}
      className={`
        font-mono border rounded-lg transition-all duration-200
        ${compact ? 'px-2 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'}
        ${stateStyles[state] || stateStyles.idle}
        flex items-center justify-between gap-2
        ${className}
      `}
    >
      <div className="flex items-center gap-2 min-w-0">
        {showIndex && typeof index === 'number' && (
          <span className="text-[9px] text-lab-text-muted select-none w-4 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <span className="font-bold truncate">{itemKey}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-lab-text-muted text-[10px]">→</span>
        <span
          className={`font-bold text-sm px-1 rounded ${
            state === 'idle' ? 'text-lab-text-primary' : ''
          }`}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
};

export default MemoryCell;
