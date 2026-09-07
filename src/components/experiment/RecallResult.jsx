import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * RecallResult: Displays query probe and outcome evaluation.
 */
export const RecallResult = ({
  queryKey = 'KIWI',
  expectedValue = 9,
  fullAttentionOutput = '—',
  linearAttentionOutput = '—',
  isPhase1 = true,
  className = '',
}) => {
  return (
    <Card variant="standard" className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-lab-text-secondary">Probe Query:</span>
          <span className="font-mono text-sm font-bold text-lab-accent bg-lab-accent/10 px-2 py-0.5 rounded border border-lab-accent/30">
            {queryKey} = ?
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-lab-text-muted">Target:</span>
          <span className="text-lab-text-primary font-bold">{expectedValue}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-lab-secondary/50 border border-lab-border text-xs space-y-1">
          <span className="text-[11px] font-mono text-lab-purple block">Full Attention Output</span>
          <span className="text-lg font-mono font-bold text-lab-text-primary">{fullAttentionOutput}</span>
        </div>
        <div className="p-3 rounded-lg bg-lab-secondary/50 border border-lab-border text-xs space-y-1">
          <span className="text-[11px] font-mono text-lab-accent block">Linear Attention Output</span>
          <span className="text-lg font-mono font-bold text-lab-text-primary">{linearAttentionOutput}</span>
        </div>
      </div>

      {isPhase1 && (
        <div className="p-2.5 rounded bg-lab-surface border border-lab-border/60 text-center text-xs text-lab-text-muted font-mono">
          Real-time query execution will be enabled in Phase 4
        </div>
      )}
    </Card>
  );
};

export default RecallResult;
