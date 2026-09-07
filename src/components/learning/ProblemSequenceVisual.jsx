import React from 'react';
import { ArrowRight, Database, Eye, Repeat } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ProblemSequenceVisual:
 * Illustrates sequential token arrival and the divergence between:
 * 1) Full Attention (unbounded lookback to all past tokens)
 * 2) Linear Attention (continuous condensation into a running state)
 */
export const ProblemSequenceVisual = ({ className = '' }) => {
  const tokens = [
    { label: 'Token 1', desc: 'Prefix' },
    { label: 'Token 2', desc: 'Context' },
    { label: 'Token 3', desc: 'Key-Val' },
    { label: '...', desc: 'Stream' },
    { label: 'Current Query', desc: 'Target', isTarget: true },
  ];

  return (
    <Card variant="standard" className={`p-6 sm:p-8 space-y-8 ${className}`}>
      {/* Sequence Ingestion Pipeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-lab-text-secondary uppercase">
          <span>Sequential Ingestion Timeline</span>
          <span className="text-lab-accent">t = 1 → t = N</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {tokens.map((token, idx) => (
            <div
              key={token.label}
              className={`p-3 rounded-lg border font-mono text-center flex flex-col justify-center transition-all ${
                token.isTarget
                  ? 'border-lab-accent bg-lab-accent/15 text-lab-accent shadow-sm'
                  : 'border-lab-border bg-lab-secondary/60 text-lab-text-primary hover:border-lab-border-light'
              }`}
            >
              <span className="text-xs font-bold">{token.label}</span>
              <span className="text-[10px] text-lab-text-muted mt-0.5">{token.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Approaches Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-lab-border/70">
        {/* Approach 1: Full Attention Lookback */}
        <div className="p-4 sm:p-5 rounded-xl bg-lab-secondary/40 border border-lab-purple/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-lab-purple" />
              <h4 className="text-sm font-bold text-lab-text-primary">Approach 1: Retain Everything</h4>
            </div>
            <Badge variant="research" size="sm">Full Attention</Badge>
          </div>
          <p className="text-xs text-lab-text-secondary leading-relaxed">
            Maintains individual representations for every previous token. The current query directly computes similarity against all past tokens. Nothing is lost, but memory footprints grow continuously.
          </p>
          <div className="text-[11px] font-mono text-lab-purple bg-lab-surface/80 p-2 rounded border border-lab-border/50">
            Mechanism: Direct access to every past token vector
          </div>
        </div>

        {/* Approach 2: Linear Attention State Update */}
        <div className="p-4 sm:p-5 rounded-xl bg-lab-secondary/40 border border-lab-accent/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-lab-accent" />
              <h4 className="text-sm font-bold text-lab-text-primary">Approach 2: Compress into a State</h4>
            </div>
            <Badge variant="accent" size="sm">Linear Attention</Badge>
          </div>
          <p className="text-xs text-lab-text-secondary leading-relaxed">
            Condenses each incoming token into a compact running state matrix. The current query only interacts with this fixed-size state, allowing rapid inference at a constant computational cost.
          </p>
          <div className="text-[11px] font-mono text-lab-accent bg-lab-surface/80 p-2 rounded border border-lab-border/50">
            Mechanism: Running recurrent state representation
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProblemSequenceVisual;
