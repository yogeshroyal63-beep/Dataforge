import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ModelCard: Compares Full Attention vs Linear Attention architecture cards.
 */
export const ModelCard = ({
  title,
  type = 'full', // 'full' | 'linear'
  memoryComplexity,
  timeComplexity,
  description,
  prediction = '—',
  groundTruth = '—',
  accuracy = '—',
  isPhase1Placeholder = true,
  className = '',
}) => {
  const isLinear = type === 'linear';

  return (
    <Card
      variant="standard"
      className={`border-t-2 ${isLinear ? 'border-t-lab-accent' : 'border-t-lab-purple'} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-lab-text-primary">{title}</h3>
            <Badge variant={isLinear ? 'accent' : 'research'} size="sm">
              {isLinear ? 'Fixed State' : 'Softmax KV'}
            </Badge>
          </div>
          <p className="text-xs text-lab-text-secondary mt-1">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 my-4 py-3 border-y border-lab-border/60 text-xs font-mono">
        <div>
          <span className="text-lab-text-muted block text-[10px] uppercase">Memory Footprint</span>
          <span className="font-semibold text-lab-text-primary">{memoryComplexity}</span>
        </div>
        <div>
          <span className="text-lab-text-muted block text-[10px] uppercase">Time Complexity</span>
          <span className="font-semibold text-lab-text-primary">{timeComplexity}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-lab-text-secondary">Predicted Output:</span>
          <span className="font-mono font-bold text-lab-text-primary bg-lab-secondary px-2 py-0.5 rounded border border-lab-border">
            {prediction}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-lab-text-secondary">Expected Truth:</span>
          <span className="font-mono text-lab-text-secondary bg-lab-secondary/50 px-2 py-0.5 rounded">
            {groundTruth}
          </span>
        </div>
      </div>

      {isPhase1Placeholder && (
        <div className="mt-4 pt-3 border-t border-lab-border/40 text-center">
          <span className="text-[11px] font-mono text-lab-text-muted">
            Evaluation model pending Phase 4 activation
          </span>
        </div>
      )}
    </Card>
  );
};

export default ModelCard;
