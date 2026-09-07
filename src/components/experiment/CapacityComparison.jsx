import React from 'react';
import { Eye, Layers, ArrowRight, Database, Scale } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * CapacityComparison — Conceptual educational breakdown comparing the memory architectures.
 */
export const CapacityComparison = () => {
  return (
    <Card variant="standard" className="p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-lab-accent" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Architecture Comparison: Memory & Computation
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Conceptual Pipeline
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Full Attention Architecture */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-purple/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-lab-purple" />
              <h3 className="font-bold text-lab-purple uppercase">Full Attention</h3>
            </div>
            <span className="text-[10px] text-lab-purple font-semibold bg-lab-purple/15 px-2 py-0.5 rounded border border-lab-purple/30">
              O(N) Memory
            </span>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-lab-bg/80 border border-lab-border text-[11px] text-lab-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-lab-purple font-bold">1. Input:</span>
              <span>Sequence of N facts enters model</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lab-purple font-bold">2. Storage:</span>
              <span>All token vectors retained in KV cache</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lab-purple font-bold">3. Retrieval:</span>
              <span>Query compares pairwise against all N keys</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lab-purple font-bold">4. Cost:</span>
              <span>O(N) memory per sequence, O(N) per step</span>
            </div>
          </div>

          <p className="text-[11px] text-lab-text-muted leading-relaxed">
            Direct pairwise access allows exact retrieval across any token position, but memory grows linearly with context length.
          </p>
        </div>

        {/* Linear Attention Architecture */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-accent/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-lab-accent" />
              <h3 className="font-bold text-lab-accent uppercase">Linear Attention</h3>
            </div>
            <span className="text-[10px] text-lab-accent font-semibold bg-lab-accent/15 px-2 py-0.5 rounded border border-lab-accent/30">
              O(1) State
            </span>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-lab-bg/80 border border-lab-border text-[11px] text-lab-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-lab-accent font-bold">1. Input:</span>
              <span>Sequence of N facts arrives sequentially</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lab-accent font-bold">2. Storage:</span>
              <span>Facts compressed into fixed S_t matrix (d×m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lab-accent font-bold">3. Retrieval:</span>
              <span>Query multiplies directly against state: φ(Q)ᵀS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lab-accent font-bold">4. Cost:</span>
              <span>O(1) constant memory, O(1) per step</span>
            </div>
          </div>

          <p className="text-[11px] text-lab-text-muted leading-relaxed">
            Fixed-dimensional matrix compresses the entire history into constant memory, trading absolute resolution for bounded inference efficiency.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CapacityComparison;
