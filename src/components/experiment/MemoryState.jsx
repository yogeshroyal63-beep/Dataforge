import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * MemoryState: Displays the internal representation of memory (Fixed recurrent matrix vs KV cache).
 */
export const MemoryState = ({
  type = 'linear', // 'linear' | 'full'
  dimension = '64 × 64',
  saturationPercent = 0,
  className = '',
}) => {
  const isLinear = type === 'linear';

  return (
    <Card variant="standard" className={`p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-mono uppercase font-semibold text-lab-text-primary">
            {isLinear ? 'Fixed Recurrent State Matrix (S_t)' : 'Key-Value Cache (K, V)'}
          </h4>
          <Badge variant={isLinear ? 'accent' : 'research'} size="sm">
            {isLinear ? 'O(1) Memory' : 'O(N) Memory'}
          </Badge>
        </div>
        <span className="text-xs font-mono text-lab-text-muted">
          Dim: {dimension}
        </span>
      </div>

      {/* Visual State Representation */}
      <div className="bg-lab-bg/80 border border-lab-border rounded-lg p-4 font-mono text-xs text-center">
        {isLinear ? (
          <div className="space-y-2">
            <div className="grid grid-cols-8 gap-1.5 py-2 opacity-80">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-[2px] bg-lab-accent/20 border border-lab-accent/30 transition-all"
                  style={{ opacity: 0.3 + (i % 7) * 0.1 }}
                />
              ))}
            </div>
            <p className="text-[11px] text-lab-text-muted pt-2 border-t border-lab-border/40">
              Continuous superposition state: all tokens mapped into constant dimensional matrix.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 py-2 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-lab-secondary border border-lab-border text-[10px] text-lab-text-secondary"
                >
                  Token[{i}]
                </span>
              ))}
            </div>
            <p className="text-[11px] text-lab-text-muted pt-2 border-t border-lab-border/40">
              Discrete token store: every past key-value vector preserved individually.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MemoryState;
